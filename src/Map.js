import React, { useState, useEffect, useRef } from "react";
import MapGL, { SVGOverlay } from "react-map-gl";
import { DeckGL, ScatterplotLayer, GeoJsonLayer, ArcLayer } from "deck.gl";
import { Spring } from "react-spring/renderprops";
import Goo from "./goodies/Goo";
import { easeBackOut } from "d3";

import ArcBrushingLayer from "./goodies/ArcBrushingLayer";

import { useRecoilValue } from "recoil";
import { incomingPacket } from "./components/stores";

/*function SvgOverlayExample({ packets, radius }) {
  const redraw = ({ project }) => {
    return (
      <g>
        <Goo>
          {packets.map((lib) => {
            const [x, y] = project(lib.position);
            return (
              <circle key={lib.id} cx={x} cy={y} r={radius} fill="tomato" />
            );
          })}
        </Goo>
      </g>
    );
  };
  return <SVGOverlay redraw={redraw} />;
}*/

export default function Map({
  width,
  height,
  viewState,
  onViewStateChange,
  radius,
  arcsEnabled,
}) {

  // Array of all packets currently showing on the map
  const [packets, setPacket] = useState([])
  const [packetLinks, setPacketLinks] = useState([])

  // Get data from incoming packet
  const packetData = useRecoilValue(incomingPacket)

  // Process and append packet data to map
  useEffect(() => {
    if(packetData){
      let newPacketData = { coordinates: [packetData.destLong, packetData.destLat] }
      setPacket([...packets, newPacketData])

      let newPacketLinksData = { to: [packetData.destLong, packetData.destLat], from: [packetData.sourceLong, packetData.sourceLat] }
      setPacketLinks([...packetLinks, newPacketLinksData])
    }
  }, [packetData]);

  // Remove stale packets from map (FIFO) 
  const packetRef = useRef([])
  const packetLinksRef = useRef([]);
  useEffect(() => { packetRef.current = packets })
  useEffect(() => { packetLinksRef.current = packetLinks })
  useEffect(() => {
    setInterval(() => { clearPacket() }, 500)
  }, [])

  function clearPacket(){
    if(packetRef.current.length > 0){
      setPacket(packetRef.current.slice(1))
      setPacketLinks(packetLinksRef.current.slice(1))
    }
  }

  return (
    <MapGL
      mapStyle={"mapbox://styles/mapbox/navigation-night-v1"}
      width={width}
      height={height}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
    >

      {/* Print packet data on the map */}
      { packetData &&
        <div className="rawData">
          <h4 style={{ transform: "translate(60vw, 0)" }}>Incoming packet!</h4>
          <ol style={{ transform: "translate(60vw, 0)" }}>
            <li>Source IP: {packetData.sourceIP}</li>
            <li>Dest IP: {packetData.destIP}</li>
            <li>
              Source Location: LAT {packetData.sourceLat} , LONG{" "}
              {packetData.sourceLong}
            </li>
            <li>
              Dest Location: LAT {packetData.destLat} , LONG {packetData.destLong}
            </li>
          </ol>
        </div>
      }

      <Spring to={{ arcCoef: arcsEnabled ? 1 : 1e-10 }}>
        {(springProps) => {
          const layers = [
            new ScatterplotLayer({
              id: "scatterplot-layer",
              data: packets,
              getRadius: 500 * radius,
              radiusMaxPixels: 15,
              getPosition: d => d.coordinates,
              getFillColor: [32, 184, 231],
              transitions: {
                getRadius: {
                  duration: 1000,
                  easing: easeBackOut,
                },
              },
              pickable: true,
              onClick: (info) => console.log(info.object),
              autoHighlight: true,
            }),

            new GeoJsonLayer({
              id: "geojson-layer",
              data: [],
              lineWidthMinPixels: 1,
              getLineColor: [0, 0, 0, 20],
            }),

            new ArcBrushingLayer({
              id: "arc-layer",
              data: packetLinks,
              getSourcePosition: (d) => d.from,
              getTargetPosition: (d) => d.to,
              getSourceColor: [0, 255, 0],
              getTargetColor: [0, 200, 200],
              getWidth: 3,
              visible: springProps.arcCoef > 1e-6,
              coef: springProps.arcCoef,
            }),
          ];

          return <DeckGL layers={layers} viewState={viewState} />;
        }}
      </Spring>


      {/* <Spring from={{ radius: 0 }} to={{ radius }}>
        {springProps => (
          <SvgOverlayExample
            packets={packetMass}
            radius={springProps.radius}
          />
        )}
        </Spring> */}


    </MapGL>
  );
}

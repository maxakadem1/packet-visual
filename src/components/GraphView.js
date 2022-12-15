import React, { useEffect, useState } from 'react';
import "./components.css";
import GraphDisplay from "./GraphDisplay";
import { useRecoilValue } from 'recoil';
import { done, username } from './stores';

export default function GraphView({showGraphs=false}) {

  const playbackDone = useRecoilValue(done)
  const user = useRecoilValue(username)

  // Graphs
  const [protocols, setProtocols] = useState("")
  const [layers, setLayers] = useState("")

  useEffect(() => {
    if(playbackDone){
      fetch ('/anaylyzeProtocols?userId='+username, {
        method: 'GET',
      })
        .then (response => {
          if (response.ok) {
            (async ()=>{
              let retURL = await response.text()
              retURL = retURL.replaceAll('"','')
              console.log("Protocols graph: " + retURL)
              setProtocols(retURL)
            })();
          } 
          else {  
            console.error(`Analyze Protocols image not returned for ${user}`);
          }
        })

        fetch ('/anaylyzeLayers?userId='+username, {
          method: 'GET',
        })
          .then (response => {
            if (response.ok) {
              (async ()=>{
                let retURL = await response.text()
                retURL = retURL.replaceAll('"','')
                console.log("Layers graph: " + retURL)
                setLayers(retURL)
              })();
            } 
            else {  
              console.error(`Analyze Layers image not returned for ${user}`);
            }
          })
    }
  }, [playbackDone]);

  return (
    <div className={"uiOverlay graphView"}>
      <h4> Graph View </h4>
      { showGraphs && <GraphDisplay label="Protocol breakdown" imageUrl={protocols} /> }
      { showGraphs && <GraphDisplay label="Packets over time" imageUrl={layers} /> }
    </div>
  );
}
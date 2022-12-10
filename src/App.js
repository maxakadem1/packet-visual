import React from "react";
import styles from "./App.module.css";
import * as Locations from "./locations";
import Map from "./Map";
import { FlyToInterpolator } from "react-map-gl";
import { csv } from "d3";

import Overlays from './components/Overlays';

import { RecoilRoot } from 'recoil';

const App = () => {
  const [viewState, setViewState] = React.useState(Locations.usa);
  const handleChangeViewState = ({ viewState }) => setViewState(viewState);
  const handleFlyTo = (destination) =>
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });

  const [libraries, setLibraries] = React.useState([]);

  React.useEffect(() => {
    csv("/data/public_libraries.csv", (d, id) => ({
      id,
      state: d["State"],
      position: [+d["Longitude"], +d["Latitude"]],
    }))
      .then((libraries) =>
        libraries.filter((d) => d.position[0] != null && d.position[1] != null)
      )
      .then(setLibraries);
  }, []);

  // extract data from lounge_dat.json file
  // React.useEffect(() => {
  //   fetch("/data/lounge_dat.json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setLibraries(data);
  //     });
  // }, []);

  const [radius, setRadius] = React.useState(15);
  const handleToggleRadius = () =>
    setRadius(radius > 0 ? 0 : Math.random() * 35 + 5);

  const [arcsEnabled, setArcsEnabled] = React.useState(true);
  const handleToggleArcs = () => setArcsEnabled(!arcsEnabled);

  return (
    <div>
      <RecoilRoot>
        {/* USER CONTROLS */}
        <Overlays />

      {/* WORLD MAP */}
      <Map
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        libraries={libraries}
        radius={radius}
        arcsEnabled={arcsEnabled}
      />

      {/* BUTTONS */}
      <div className={styles.controls}>
        <button onClick={handleToggleRadius}>Radius</button>
        <button onClick={handleToggleArcs}>Arcs</button>
        {Object.keys(Locations).map((key) => (
          <button key={key} onClick={() => handleFlyTo(Locations[key])}>
            {key}
          </button>
        ))}
      </div>
      </RecoilRoot>
    </div>
  );
};

export default App;

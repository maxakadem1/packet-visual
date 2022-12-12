import React from "react";
import styles from "./App.module.css";
import * as Locations from "./locations";
import Map from "./Map";
import { FlyToInterpolator } from "react-map-gl";

import Overlays from "./components/Overlays";

import { RecoilRoot } from "recoil";

const App = () => {
  const [viewState, setViewState] = React.useState(Locations.canada);
  const handleChangeViewState = ({ viewState }) => setViewState(viewState);
  const handleFlyTo = (destination) =>
    setViewState({
      ...viewState,
      ...destination,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });

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
          radius={radius}
          arcsEnabled={arcsEnabled}
        />

        {/* BUTTONS */}
        <div className={styles.controls}>
          {/* <button onClick={handleToggleRadius}>Radius</button>
          <button onClick={handleToggleArcs}>Arcs</button> */}
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

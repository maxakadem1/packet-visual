import React from 'react';
import "./components.css";
import GraphDisplay from "./GraphDisplay";

export default function GraphView({showGraphs=false}) {
  return (
    <div className={"uiOverlay graphView"}>
      <h4 style={{ backgroundColor: "#448466", padding: "0.5em 0.2em 0.5em 0.2em" }}> Graph View </h4>
      { showGraphs && <GraphDisplay label="Protocol breakdown" /> }
      { showGraphs && <GraphDisplay label="Packets over time" /> }
    </div>
  );
}
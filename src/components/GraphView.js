import React from 'react';
import "./components.css";
import GraphDisplay from "./GraphDisplay";

export default function GraphView({showGraphs=false}) {
  return (
    <div className={"uiOverlay graphView"}>
      <h4> Graph View </h4>
      { showGraphs && <GraphDisplay label="Protocol breakdown" imageUrl="/graph1.png" /> }
      { showGraphs && <GraphDisplay label="Packets over time" imageUrl="/graph2.png" /> }
    </div>
  );
}
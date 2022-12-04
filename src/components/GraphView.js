import React from 'react';
import "./components.css";
import GraphDisplay from "./GraphDisplay";

export default function GraphView() {
  return (
    <div className={"uiOverlay graphView"}>
      <h4 style={{ backgroundColor: "orchid" }}> Graph View </h4>
      <GraphDisplay label="Protocol breakdown" />
      <GraphDisplay label="Packets over time" />
    </div>
  );
}
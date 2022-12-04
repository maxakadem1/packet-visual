import React from 'react';
import "./components.css";

export default function GraphDisplay({ label="" }) {
  return (
    <div className={"graphDisplay centerDisplay"}>
        <p>{label}</p>
    </div>
  );
}
import React from 'react';
import "./components.css";

export default function GraphDisplay({ label="", imageUrl }) {
  return (
    <div className={"graphDisplay"}>
        <div className="graphImg"><img src={imageUrl} alt={"Graph Result"} /></div>
        <p>{label}</p>
    </div>
  );
}
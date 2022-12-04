import React from 'react';
import "./components.css";

export default function Playback({visible=true}){
  return (
    <>
      { visible && 
        <div className={"uiOverlay playbackMenu"}>
          <h2> Playback </h2>
        </div>
      }
    </>
  );
}

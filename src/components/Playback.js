import React from 'react';
import "./components.css";

export default function Playback({visible=true}){
  return (
    <>
      { visible && 
        <div className={"uiOverlay playbackMenu lateralFlex"}>
          <button className={"playButton centerDisplay"}> 
            <div>▶</div>
          </button>
          <p className="sideText"> Play animation </p>
        </div>
      }
    </>
  );
}

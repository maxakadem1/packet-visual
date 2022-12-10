import React from 'react'
import "./components.css"
import { useState } from "react"
import { useRecoilState } from 'recoil'
import { isPlaybackDone, done } from './stores'

export default function Playback({visible=true}){

  let times = [1000, 3000, 3300, 3600, 5000, 8000]
  let currFrame = 0
  const [time, setTime] = useState("00:00:00:00")
  let playTime = 0
  let totalTime = 0

  const [done, setDone] = useRecoilState(isPlaybackDone)
  const setPlaybackDone = () => { setDone(true) }

  // Set playback durations
  const play = () => {
    totalTime = times[times.length-1]+100

    let pid = setInterval(loadContent, 100)
    function loadContent() {
      if (playTime < totalTime){
        if(playTime >= times[currFrame]){
          dispatchAnimation(formatTime(times[currFrame]))
          currFrame++
        }
        
        playTime += 100
        setTime(formatTime(playTime))
      }
      else {
        showResults()
        clearInterval(pid)
      }
    }
  }

  function formatTime(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);
    return hours.toString(10).padStart(2, "0") + ":" + minutes.toString(10).padStart(2, "0") + ":" + seconds.toString(10).padStart(2, "0") + ":" + Math.round(milliseconds / 10).toString(10).padStart(2, "0")
  }

  function dispatchAnimation(sentTime){
    console.log("Sent packet at " + sentTime)
  }

  function showResults(){
    setPlaybackDone()
    playTime = 0
    totalTime = 0
    currFrame = -1
    setTime("00:00:00:00")
  }

  return (
    <>
      { visible && 
        <div className={"uiOverlay playbackMenu lateralFlex"}>
          <button className={"playButton centerDisplay"} onClick={play}> 
            <div>▶</div>
          </button>
          <p className="sideText"> {time} </p>
        </div>
      }
    </>
  );
}

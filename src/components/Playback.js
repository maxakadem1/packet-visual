import React from "react"
import "./components.css"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { isPlaybackDone, done, sendPacket, incomingPacket } from "./stores"

export default function Playback({visible=true}){

  let packets = []

  // Fetch JSON packet data
  fetch("/data/lounge_dat.json")
  .then((response) => response.json())
  .then((data) => {
    packets = data
  })

  // Sample dispatch times
  // TODO: replace with actual packet time intervals converted to milliseconds
  let times = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000]
  let currFrame = 0
  const [time, setTime] = useState("00:00:00:00")
  let playTime = 0
  let totalTime = 0


  const [done, setDone] = useRecoilState(isPlaybackDone)
  /* setPlaybackDone
   *    Notify application if playback is finished (true) or starting (false)
   *    @params: Boolean
   */
  const setPlaybackDone = (bool) => { setDone(bool) }


  const [incomingPacket, setPacket] = useRecoilState(sendPacket)
  /* setThePacket
   *    Load data to be dispatched to the map
   *    @params: Object<Packet>
   */
  const setThePacket = (thePacket) => { 
    setPacket({
      "sourceIP": thePacket["source_ip"],
      "destIP": thePacket["destination_ip"],
      "sourceLat": thePacket["source_location"]["latitude"],
      "sourceLong": thePacket["source_location"]["longitude"],
      "destLat": thePacket["destination_location"]["latitude"],
      "destLong": thePacket["destination_location"]["longitude"]
    })
  }


  /* play
   *    Run the Playback component from the beginning on button click
   */
  const play = () => {
    // Hide graphs when replaying
    setPlaybackDone(false)
    
    // Get end duration
    totalTime = times[times.length-1]+100

    // Load packet time intervals
    let pid = setInterval(loadContent, 100)
    function loadContent() {
      if (playTime < totalTime){
        if(playTime >= times[currFrame]){
          setThePacket(packets[currFrame.toString()])
          currFrame++
        }
        
        playTime += 100
        setTime(formatTime(playTime))
      }
      else {
        end()
        clearInterval(pid)
      }
    }
  }

  /* formatTime
   *    Helper function to format time from milliseconds to hh:mm:ss:mm display in UI
   *    @params: Number
   */
  function formatTime(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = Math.floor(milliseconds % 1000);
    return hours.toString(10).padStart(2, "0") + ":" + minutes.toString(10).padStart(2, "0") + ":" + seconds.toString(10).padStart(2, "0") + ":" + Math.round(milliseconds / 10).toString(10).padStart(2, "0")
  }

  /* end
   *    End playback by resetting time and variables to defaults
   */
  function end(){
    setPlaybackDone(true)
    playTime = 0
    totalTime = 0
    currFrame = -1
    setTime("00:00:00:00 - ANIMATION COMPLETE")
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

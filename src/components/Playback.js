import React from "react"
import "./components.css"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { isPlaybackDone, done, sendPacket, incomingPacket } from "./stores"

export default function Playback({visible=true, dataUrl=null}){

  let packets = []
  let playTime = 0
  let totalTime = 0
  let times = []
  let currFrame = 0

  // Set packet upper bound to 50
  let maxPackets = 50

  // Fetch JSON packet data
  fetch(dataUrl)
    .then ((response) => response.json())
    .then ((data) => {
      packets = Object.values(data)

      // Get time intervals
      let start = parseFloat(packets[0]["timestamp"])

      let timestamps = packets.map(p => parseFloat(p["timestamp"]))
      for (let t of timestamps) {
        let diff = Math.round((t-start)*1000)
        times.push(diff)
      }
      
      times = times.slice(0,maxPackets)
      totalTime = times[times.length-1]+100
    })
    .catch (function() {
      console.error(`Error retrieving data from ${dataUrl}`);
    })
  
  const [time, setTime] = useState("00:00:00:00")
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

    // Load packet time intervals
    let pid = setInterval(loadContent, 100)
    function loadContent() {
      if (playTime < totalTime){
        if(playTime >= times[currFrame]){
          setThePacket(packets[currFrame])
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

import React from 'react';
import "./components.css";
import FileMenu from "./FileMenu";
import GraphView from "./GraphView";
import Playback from "./Playback";

import { useRecoilValue } from 'recoil';
import { done, loaded, pData } from './stores';

export default function Overlays() {
  
  const playbackDone = useRecoilValue(done)
  const fileLoaded = useRecoilValue(loaded)
  const dataFileURL = useRecoilValue(pData)

  return (
    <div id="overlays">
        <FileMenu />
        <GraphView showGraphs={playbackDone} />
        <Playback visible={fileLoaded} dataUrl={dataFileURL} />
    </div>
  );
}
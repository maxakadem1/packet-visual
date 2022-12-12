import React from 'react';
import "./components.css";
import { useState } from "react"
import Form from 'react-bootstrap/Form';
import { useRecoilState } from "recoil"
import { isFileLoaded, loaded, setPacketDataFile, pData } from "./stores"

export default function FileMenu() {

  /* setFileLoadSuccess
   *    Notify application if file load is successful
   */
  const [loaded, setLoaded] = useRecoilState(isFileLoaded)
  const setFileLoadSuccess = () => { setLoaded(true) }

  // Text to be shown in FileMenu bar
  const[statusText, changeStatus] = useState("No file uploaded")


  /* loadFile
   *    Manage new file intake
   */
  const [pData, setPacketFile] = useRecoilState(setPacketDataFile)
  const loadFile = (e) => {
    const file = e.target.files[0]
    let fn = file.name
    let extension = fn.split('.').pop()
    if(extension == "pcapng"){
      setFileLoadSuccess()
      changeStatus("READY → " + fn)
    }
    else {
      alert("Invalid file. Packet Visual only accepts .pcapng files.")
      changeStatus("File load failed. Please try a new file.")
    }

    // Upload file to server to be parsed
    const reader = new FileReader();
    reader.onload = () => {
      const fileUrl = URL.createObjectURL(file)

      fetch ('/addFile', {
        method: 'POST',
        body: JSON.stringify({ fileUrl }),
      })
        .then (response => {
          if (response.ok) {  
            let retURL = response.text()
            setPacketFile(retURL)
          } 
          else {  
            console.error(`Data file URL is not returned for ${fn}`);
          }
        })
    }
    reader.readAsBinaryString(file)
    
  }

  return (
    <div className={"uiOverlay fileMenu lateralFlex"}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload .pcapng file</Form.Label>
        <Form.Control 
          type="file"
          onChange={loadFile} 
        />
      </Form.Group>
      <p className="sideText">{statusText}</p>
    </div>
  );
}
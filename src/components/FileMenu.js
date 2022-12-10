import React from 'react';
import "./components.css";
import { useState } from "react"
import Form from 'react-bootstrap/Form';

export default function FileMenu() {
  const[statusText, changeStatus] = useState("No file uploaded")

  const loadFile = (e) => {
    const file = e.target.files[0]
    let fn = file.name
    let extension = fn.split('.').pop()
    if(extension == "pcapng"){
      changeStatus("READY → " + fn)
    }
    else {
      alert("Invalid file. Packet Visual only accepts .pcapng files.")
      changeStatus("File load failed. Please try a new file.")
    }

    // TODO: Upload file to the server to be parsed
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
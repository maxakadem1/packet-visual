import React from 'react';
import "./components.css";

import Form from 'react-bootstrap/Form';

export default function FileMenu({ statusText="No file uploaded" }) {
  return (
    <div className={"uiOverlay fileMenu lateralFlex"}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload .pcapng file</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <p className="sideText">{statusText}</p>
    </div>
  );
}
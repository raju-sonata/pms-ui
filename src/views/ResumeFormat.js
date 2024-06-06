import React, { useRef, useState } from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import "./../assets/scss/light-bootstrap-dashboard-react.scss";

function ResumeFormat() {
  const [files, setFiles] = useState(null);

  const [fileUploaded, setFileUploaded] = useState(null);

  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  const handleUpload = (files) => {
    console.log("files uploaded:", files);
    setFileUploaded(true);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card className="card-user">
              <Card.Body>
                <Row>
                  <Col md="6" className="box-section">
                    {
                      <div
                        className="dropZone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <h5>Drag & Drop files to upload</h5>
                        <h5>(Allowed files of .pdf,.doc,.docx)</h5>
                      </div>
                    }
                    <div>
                      <input
                        type="file"
                        multiple
                        onChange={(event) => setFiles(event.target.files)}
                        hidden
                        ref={inputRef}
                        accept=".pdf,.doc,.docx"
                      />
                      <Button
                        variant="primary"
                        type="button"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Select Files"
                        style={{ width: "100%" }}
                        onClick={() => inputRef.current.click()}
                      >
                        <i className="nc-icon nc-tap-01 icon-bold">
                          Select Files
                        </i>
                      </Button>
                    </div>
                  </Col>
                  <Col md="6" className="box-section">
                    {files && (
                      <div className="uploads">
                        <h5 className="card-title">Selected files</h5>
                        <ul className="list-group">
                          {Array.from(files).map((file, idx) => (
                            <li className="list-group-item" key={idx}>
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <div className="actions">
                      <Button
                        type="button"
                        variant="danger"
                        style={{ width: "50%" }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Select Files"
                        onClick={() => setFiles(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="success"
                        style={{ width: "50%" }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Select Files"
                        onClick={() => handleUpload(files)}
                      >
                        <i className="bi bi-upload">Upload files</i>
                      </Button>
                    </div>
                    {/* <button className="btn btn-outline-primary" type="button">
                      <i className="bi bi-file-earmark-check-fill">
                        Format files
                      </i>
                    </button> */}
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    {fileUploaded && (
                      <Button
                        type="button"
                        variant="primary"
                        style={{ width: "100%" }}
                      >
                        <i className="bi bi-file-earmark-check-fill">
                          Format files
                        </i>
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <Card.Body>
                <h5 className="card-title">Downloads</h5>
                <div className="input-group">
                  <Button
                    type="button"
                    variant="primary"
                    style={{ width: "100%" }}
                  >
                    <i className="bi bi-file-earmark-arrow-down-fill">
                      Formatted files
                    </i>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    style={{ width: "100%" }}
                  >
                    <i className="bi bi-file-earmark-arrow-down">
                      Unformatted files
                    </i>
                  </Button>
                </div>
                <hr></hr>
                <h5 className="card-title">Downloaded times</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">1 time</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ResumeFormat;

import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";

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
  Toast,
  Spinner,
} from "react-bootstrap";

import axios from "axios";
import FormData from "form-data";

const baseURL = "http://192.168.1.143:8080/formatter/api/";

function ResumeFormat() {
  const [files, setFiles] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [fileFormatted, setFileFormatted] = useState(null);
  let [formatDownloadCount, setFormatDownloadCount] = useState(0);
  let [unformatDownloadCount, setUnformatDownloadCount] = useState(0);
  const [toast, setToast] = useState({
    variant: "primary",
    show: false,
    heading: "Sample Head",
    message: "Messsage",
  });
  const [spinStatus, setSpinStatus] = useState(false);
  const inputRef = useRef();
  cd;

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  const handleSelectFiles = (files) => {
    if (files.length >= 1) {
      setFiles(files);
    } else {
      // the cancel event logics will always land here
      setFiles(null);
    }
  };

  const handleUpload = async (files) => {
    setSpinStatus(true);
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    try {
      const response = await axios.post(baseURL + "uploadFiles", formData);
      setSpinStatus(false);
      setToast({
        variant: "success",
        show: true,
        heading: "Resume Upload",
        message: "Documents are uploaded successfully!",
      });
      setFileUploaded(true);
    } catch (error) {
      console.log(error);
      setSpinStatus(false);
      setToast({
        variant: "danger",
        show: true,
        heading: "Resume Upload",
        message: "Documents failed to upload",
      });
    }
  };

  const handleFormat = async () => {
    setSpinStatus(true);
    try {
      const response = await axios.post(baseURL + "formatDoc?");
      setSpinStatus(false);
      setToast({
        variant: "success",
        show: true,
        heading: "Resume Format",
        message: "Documents are formatted successfully!",
      });
      setFileFormatted(true);
    } catch (error) {
      console.log(error);
      setSpinStatus(false);
      setToast({
        variant: "danger",
        show: true,
        heading: "Resume Format",
        message: "Documents failed to format",
      });
    }
  };

  const downloadFormattedFiles = async () => {
    setSpinStatus(true);
    try {
      const response = await axios.get(baseURL + "downloadZip", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `formatted-${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();

      setSpinStatus(false);
      setToast({
        variant: "success",
        show: true,
        heading: "Download Formatted Docs",
        message: "Formatted Documents are downloaded successfully!",
      });
      setFileUploaded(true);
      setFormatDownloadCount(++formatDownloadCount);
    } catch (error) {
      console.log(error);
      setSpinStatus(false);
      setToast({
        variant: "danger",
        show: true,
        heading: "Download Formatted Docs",
        message: "Formatted Documents failed to download",
      });
    }
  };

  const downloadUnformattedFiles = async () => {
    setSpinStatus(true);
    try {
      const response = await axios.get(
        baseURL + "downloadUnformattedFilesZip",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `unformatted-${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();

      setSpinStatus(false);
      setToast({
        variant: "success",
        show: true,
        heading: "Download Unformatted Docs",
        message: "Unformatted Documents are downloaded successfully!",
      });
      setFileUploaded(true);
      setUnformatDownloadCount(++unformatDownloadCount);
    } catch (error) {
      console.log(error);
      setSpinStatus(false);
      setToast({
        variant: "danger",
        show: true,
        heading: "Download Unformatted Docs",
        message: "Unformatted Documents failed to download",
      });
    }
  };

  return (
    <>
      <Container fluid>
        <div className="Toast-box">
          {spinStatus && <Spinner animation="border" />}
          {toast && (
            <Toast
              className="d-inline-block m-1"
              bg={toast?.variant && toast?.variant.toLowerCase()}
              onClose={() => setToast({ show: false })}
              show={toast?.show}
              delay={5000}
              autohide
            >
              <Toast.Header closeButton={true}>
                <strong className="me-auto">{toast?.heading}</strong>
              </Toast.Header>
              <Toast.Body></Toast.Body>
              <Toast.Body className="text-white">{toast?.message}</Toast.Body>
            </Toast>
          )}
        </div>
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
                      <div style={{ marginBottom: "10px" }}>
                        <input
                          type="file"
                          multiple
                          onChange={(event) =>
                            handleSelectFiles(event.target.files)
                          }
                          hidden
                          ref={inputRef}
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => inputRef.current.click()}
                      >
                        <i className="nc-icon nc-tap-01 icon-bold" />
                        Select Files
                      </Button>
                    </div>
                  </Col>
                  <Col md="6" className="box-section">
                    {files && (
                      <div className="uploads">
                        <h5 className="card-title">Selected files</h5>
                        <hr />
                        <ul
                          className="list-group"
                          style={{ marginBottom: "10px" }}
                        >
                          {Array.from(files).map((file, idx) => (
                            <li
                              className="list-group-item"
                              key={idx}
                              style={{ backgroundColor: "yellow" }}
                            >
                              {file.name}
                            </li>
                          ))}
                        </ul>
                        <Row>
                          <Col md="6">
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => setFiles(null)}
                            >
                              <i className="nc-icon nc-simple-remove icon-bold" />
                              Cancel
                            </Button>
                          </Col>
                          <Col md="6">
                            {!fileUploaded && (
                              <Button
                                type="button"
                                variant="success"
                                onClick={() => handleUpload(files)}
                              >
                                <i className="nc-icon nc-cloud-upload-94 icon-bold" />
                                Upload files
                              </Button>
                            )}
                            {fileUploaded && (
                              <Button
                                type="button"
                                variant="primary"
                                onClick={() => handleFormat()}
                              >
                                <i className="nc-icon nc-check-2 icon-bold" />
                                Format files
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </div>
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
                {fileFormatted && (
                  <div className="input-group">
                    <Row>
                      <Col md="6">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => downloadFormattedFiles()}
                          download
                        >
                          <i className="bi bi-file-earmark-arrow-down-fill" />
                          Formatted
                        </Button>
                      </Col>
                      <Col md="6">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => downloadUnformattedFiles()}
                        >
                          <i className="bi bi-file-earmark-arrow-down" />
                          Unformatted
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
                <hr></hr>
                <h5 className="card-title">Downloaded count</h5>
                <ul className="list-group list-group-flush">
                  <li
                    className="list-group-item"
                    style={{ backgroundColor: "#00a500", color: "white" }}
                  >
                    Formatted files: {formatDownloadCount}{" "}
                    {formatDownloadCount > 1 ? "times" : "time"}
                  </li>
                  <li
                    className="list-group-item"
                    style={{ backgroundColor: "#d90000c9", color: "white" }}
                  >
                    Unformatted files: {unformatDownloadCount}{" "}
                    {unformatDownloadCount > 1 ? "times" : "time"}
                  </li>
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

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
const baseURL = "http://192.168.1.243:8080/formatter/api/";

function ResumeFormat() {
  const [files, setFiles] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [toast, setToast] = useState({
    variant: "primary",
    show: false,
    heading: "Sample Head",
    message: "Messsage",
  });
  const [spinStatus, setSpinStatus] = useState(false);

  const aRef = useRef();

  const [url, setFileUrl] = useState();

  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  const handleUpload = async (files) => {
    setSpinStatus(true);
    console.log("files uploaded:", files);
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    try {
      const response = await axios.post(baseURL + "uploadFiles", formData);
      console.log("Axios-:", JSON.stringify(response));
      // setPosts(response.data);
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
    console.log("files formatting:");
    try {
      const response = await axios.post(baseURL + "formatDoc?");
      console.log("Axios2-:", JSON.stringify(response));
      setSpinStatus(false);
      setToast({
        variant: "success",
        show: true,
        heading: "Resume Format",
        message: "Documents are formatted successfully!",
      });
      setFileUploaded(true);
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
    console.log("formattedFiles downloading:");

    try {
      const response = await axios.get(baseURL + "downloadZip", {
        responseType: "blob",
      });
      console.log("Axios3-:", JSON.stringify(response));

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${Date.now()}.zip`);
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
    console.log("UnformattedFiles downloading:");
    try {
      const response = await axios.get(
        baseURL + "downloadUnformattedFilesZip",
        { responseType: "blob" }
      );
      console.log("Axios4-:", JSON.stringify(response));

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${Date.now()}.zip`);
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
                        <hr />
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
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    {fileUploaded && (
                      <Button
                        type="button"
                        variant="primary"
                        style={{ width: "100%" }}
                        onClick={() => handleFormat()}
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
                <hr />
                <a href={url} download={name} className="hidden" ref={aRef} />

                <div className="input-group">
                  <Button
                    type="button"
                    variant="primary"
                    style={{ width: "100%" }}
                    onClick={() => downloadFormattedFiles()}
                    download
                  >
                    <i className="bi bi-file-earmark-arrow-down-fill">
                      Formatted files
                    </i>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    style={{ width: "100%" }}
                    onClick={() => downloadUnformattedFiles()}
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

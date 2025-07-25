import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaTrashAlt,
  FaPlus,
  FaEdit,
  FaFileAlt,
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";

const DistributorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    location: "",
    licenseFile: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const distributors = [
    {
      id: 1,
      name: "Distributor 1",
      location: "Gaza",
      email: "dist1@example.com",
      phone: "0590000000",
      tests: 50,
      license: true,
    },
    {
      id: 2,
      name: "Distributor 2",
      location: "Rafah",
      email: "dist2@example.com",
      phone: "0561111111",
      tests: 80,
      license: true,
    },
  ];

  const filtered = distributors.filter((dist) =>
    dist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrop = (acceptedFiles) => {
    setFormData((prev) => ({ ...prev, licenseFile: acceptedFiles[0] }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.phone) errors.phone = "Phone is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.licenseFile) errors.licenseFile = "License file is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Data saved:", formData);
      setShowModal(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        country: "",
        location: "",
        licenseFile: null,
      });
    }
  };

  return (
    <Container className="my-4" style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}>
      {/* 🔍 Search & Add */}
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "400px", minWidth: "250px" }}
        />
        <button
          className="btn d-flex align-items-center px-4 py-2"
          onClick={() => setShowModal(true)}
          style={{
            fontWeight: 600,
            fontSize: "0.8rem",
            height: "42px",
            borderRadius: "100px",
            backgroundColor: "#4a90e2",
            color: "white",
            width: "100%",
            maxWidth: "200px",
          }}
        >
          <FaPlus className="me-2" />
          Add Distributor
        </button>
      </div>

      {/* 📋 Table */}
      <div className="table-responsive">
        <Table
          hover
          className="mb-0"
          style={{
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            minWidth: "700px",
            fontSize: "0.95rem",
          }}
        >
          <thead className="text-center" style={{ backgroundColor: "#f0f0f0", color: "#4a4a4a" }}>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tests</th>
              <th>License</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filtered.map((dist, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                }}
              >
                <td>{dist.name}</td>
                <td>{dist.location}</td>
                <td>{dist.email}</td>
                <td>{dist.phone}</td>
                <td>{dist.tests}</td>
                <td>
                  <FaFileAlt />
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm" title="Delete">
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4">
                  No distributors found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ➕ Add Distributor Modal */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Distributor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          <p style={{  marginBottom: "20px" }}>
            Please fill next fields
          </p>
          <h6 style={{ marginBottom: "20px" }}>
           <strong>Date : {new Date().toLocaleDateString()}</strong> 
          </h6>
<hr/>

          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Distributor Name</Form.Label>
                <Form.Control
                  value={formData.name}
                  isInvalid={!!formErrors.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  value={formData.phone}
                  isInvalid={!!formErrors.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  value={formData.email}
                  isInvalid={!!formErrors.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  value={formData.country}
                  isInvalid={!!formErrors.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{formErrors.country}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Location Address</Form.Label>
                <Form.Control
                  value={formData.location}
                  isInvalid={!!formErrors.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>License Upload</Form.Label>
                <div
                  {...getRootProps()}
                  className={`border border-2 p-4 text-center rounded ${
                    formErrors.licenseFile ? "border-danger" : "border-secondary"
                  }`}
                  style={{ cursor: "pointer", background: "#fafafa" }}
                >
                  <input {...getInputProps()} />
                  {formData.licenseFile ? (
                    <p className="mb-0">{formData.licenseFile.name}</p>
                  ) : (
                    <p className="mb-0 text-muted">Drag & drop file here, or click to select</p>
                  )}
                </div>
                {formErrors.licenseFile && (
                  <div className="text-danger mt-1">{formErrors.licenseFile}</div>
                )}
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              <Button
                onClick={handleSave}
                style={{
                  backgroundColor: "#004080",
                  border: "none",
                  borderRadius: "25px",
                  padding: "8px 30px",
                  fontWeight: "600",
                }}
              >
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DistributorsPage;

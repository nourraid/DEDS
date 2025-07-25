import React, { useState } from "react";
import { Container, Table, Button, Pagination, Modal, Form } from "react-bootstrap";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaFileAlt,
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";

const LicenseDropzone = ({ file, onFileAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [],
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "8px",
        backgroundColor: isDragActive ? "#e9f5ff" : "#fafafa",
      }}
    >
      <input {...getInputProps()} />
      {file ? (
        <p>{file.name}</p>
      ) : (
        <p>Drag & drop license file here, or click to select file (PDF, JPG, PNG)</p>
      )}
    </div>
  );
};

const ProvidersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
const [formErrors, setFormErrors] = useState({});

const validateForm = () => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{7,15}$/;

  if (!newProvider.name.trim()) errors.name = "Name is required";
  if (!newProvider.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(newProvider.phone)) {
    errors.phone = "Phone must be numbers only";
  }
  if (!newProvider.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(newProvider.email)) {
    errors.email = "Email format is invalid";
  }
  if (!newProvider.country.trim()) errors.country = "Country is required";
  if (!newProvider.location.trim()) errors.location = "Location is required";
  if (!newProvider.licenseFile) errors.licenseFile = "License file is required";

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  const providersPerPage = 5;
  const thStyle = {
    color: "#a8a5a5ff",
    backgroundColor: "#f0f0f0",
    borderBottom: "none",
  };

  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Dr. Ahmed Salim",
      location: "Gaza City",
      email: "ahmed@example.com",
      phone: "0599999999",
      tests: 124,
      license: "LIC12345",
    },
    {
      id: 2,
      name: "Dr. Lina Hasan",
      location: "Rafah",
      email: "lina@example.com",
      phone: "0566666666",
      tests: 98,
      license: "LIC23456",
    },
    {
      id: 3,
      name: "Dr. Omar Naser",
      location: "Khan Younis",
      email: "omar@example.com",
      phone: "0577777777",
      tests: 150,
      license: "LIC34567",
    },
    {
      id: 4,
      name: "Dr. Mariam Odeh",
      location: "Deir al-Balah",
      email: "mariam@example.com",
      phone: "0588888888",
      tests: 102,
      license: "LIC45678",
    },
  ]);

  const [newProvider, setNewProvider] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    country: "",
    tests: "",
    licenseFile: null,
  });

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(
    indexOfFirstProvider,
    indexOfLastProvider
  );
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSave = () => {
  if (!validateForm()) return;

  const newId = Date.now();
  const licenseText = newProvider.licenseFile ? newProvider.licenseFile.name : "No License";

  const providerToAdd = {
    id: newId,
    name: newProvider.name,
    location: newProvider.location,
    email: newProvider.email,
    phone: newProvider.phone,
    country: newProvider.country,
    tests: newProvider.tests || 0,
    license: licenseText,
  };

  setProviders((prev) => [...prev, providerToAdd]);
  setShowModal(false);
  setNewProvider({
    name: "",
    location: "",
    email: "",
    phone: "",
    country: "",
    tests: "",
    licenseFile: null,
  });
  setFormErrors({});
};


  return (
    <Container
      className="my-4"
      style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}
    >
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
          onClick={() => setShowModal(true)}
          className="btn d-flex align-items-center px-4 py-2"
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
          Add New Provider
        </button>
      </div>

      {/* 📋 Table */}
      <div className="table-responsive">
        <Table
          hover
          responsive
          className="mb-0"
          style={{
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            minWidth: "700px",
            fontSize: "0.95rem",
          }}
        >
          <thead
            className="text-center"
            style={{
              backgroundColor: "#f0f0f0",
              color: "#4a4a4a",
            }}
          >
            <tr>
              <th className="py-3" style={thStyle}>
                Name
              </th>
              <th className="py-3" style={thStyle}>
                Location
              </th>
              <th className="py-3" style={thStyle}>
                Email
              </th>
              <th className="py-3" style={thStyle}>
                Phone
              </th>
              <th className="py-3" style={thStyle}>
                Tests
              </th>
              <th className="py-3" style={thStyle}>
                License
              </th>
              <th className="py-3" style={thStyle}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-center">
            {currentProviders.length > 0 ? (
              currentProviders.map((provider, idx) => (
                <tr
                  key={provider.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <td
                    className="py-3"
                    style={{
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                  >
                    {provider.name}
                  </td>
                  <td className="py-3">{provider.location}</td>
                  <td className="py-3">{provider.email}</td>
                  <td className="py-3">{provider.phone}</td>
                  <td className="py-3">{provider.tests}</td>
                  <td className="py-3">
                    <FaFileAlt title={provider.license} />
                  </td>
                  <td
                    className="py-3"
                    style={{
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                  >
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4">
                  No providers found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Modal */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Provider</Modal.Title>
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
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Provider Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProvider.name}
                onChange={handleInputChange}
                placeholder="Write here"
                required
                isInvalid={!!formErrors.name}
               />
               <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Write here"
                value={newProvider.phone}
                onChange={handleInputChange}
                required
              isInvalid={!!formErrors.phone}
               />
               <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Write here"
                value={newProvider.email}
                onChange={handleInputChange}
                required
              isInvalid={!!formErrors.email}
               />
               <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>            </Form.Group>

            <Form.Group className="mb-3" controlId="formCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                placeholder="Write here"
                value={newProvider.country}
                onChange={handleInputChange}
                required
              isInvalid={!!formErrors.country}
               />
               <Form.Control.Feedback type="invalid">{formErrors.country}</Form.Control.Feedback>            </Form.Group>

            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location Address</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Write here"
                value={newProvider.location}
                onChange={handleInputChange}
                required
              isInvalid={!!formErrors.location}
               />
               <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>            </Form.Group>

        

            <Form.Group className="mb-3" controlId="formLicenseUpload">
              <Form.Label>License</Form.Label>
              <LicenseDropzone
                file={newProvider.licenseFile}
                onFileAccepted={(file) =>
                  setNewProvider((prev) => ({ ...prev, licenseFile: file }))
                }
              isInvalid={!!formErrors.licenseFile}
               />
               <Form.Control.Feedback type="invalid">{formErrors.licenseFile}</Form.Control.Feedback>            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            onClick={handleSave}
            style={{
              borderRadius: "50px",
              backgroundColor: "#003366",
              borderColor: "#003366",
              width: "120px",
              fontWeight: "600",
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProvidersPage;

import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaTrashAlt, FaPlus, FaEdit, FaFileAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

const DistributorsPage = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDrop = (acceptedFiles) => {
    setFormData((prev) => ({ ...prev, licenseFile: acceptedFiles[0] }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
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
      setDistributors(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  const filtered = distributors.filter((dist) =>
    dist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = t("distributors.name_required");
    if (!formData.phone) errors.phone = t("distributors.phone_required");
    if (!formData.email) errors.email = t("distributors.email_required");
    if (!formData.country) errors.country = t("distributors.country_required");
    if (!formData.location) errors.location = t("distributors.location_required");
    if (!formData.licenseFile) errors.licenseFile = t("distributors.license_file_required");
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const newDistributor = {
        ...formData,
        id: Date.now(),
        tests: 0,
        license: true,
      };
      setDistributors((prev) => [...prev, newDistributor]);
      setShowModal(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        country: "",
        location: "",
        licenseFile: null,
      });
      setFormErrors({});
    }
  };

  return (
    <Container
      className="my-4"
      style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}
    >
      {/* Search & Add */}
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder={t("distributors.search_by_name")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "400px", minWidth: "250px" }}
          disabled={loading}
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
          disabled={loading}
        >
          <FaPlus className="me-2" />
          {t("distributors.add_distributor")}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">{t("distributors.loading_distributors")}</div>
      ) : (
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
                <th>{t("distributors.name")}</th>
                <th>{t("distributors.location")}</th>
                <th>{t("distributors.email")}</th>
                <th>{t("distributors.phone")}</th>
                <th>{t("distributors.tests")}</th>
                <th>{t("distributors.license")}</th>
                <th>{t("distributors.actions")}</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-4">
                    {t("distributors.no_distributors_found")}
                  </td>
                </tr>
              )}
              {filtered.map((dist, idx) => (
                <tr
                  key={dist.id}
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
                      <button className="btn btn-sm" title={t("distributors.edit")}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm" title={t("distributors.delete")}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add Distributor Modal */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("distributors.add_new_distributor")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: "20px" }}>{t("distributors.please_fill_next_fields")}</p>
          <h6 style={{ marginBottom: "20px" }}>
            <strong>{t("distributors.date")}: {new Date().toLocaleDateString()}</strong>
          </h6>
          <hr />

          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>{t("distributors.distributor_name")}</Form.Label>
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
                <Form.Label>{t("distributors.phone_number")}</Form.Label>
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
                <Form.Label>{t("distributors.email_address")}</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  isInvalid={!!formErrors.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>{t("distributors.country")}</Form.Label>
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
                <Form.Label>{t("distributors.location_address")}</Form.Label>
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
                <Form.Label>{t("distributors.license_upload")}</Form.Label>
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
                    <p className="mb-0 text-muted">{t("distributors.drag_drop_file")}</p>
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
                {t("distributors.save")}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DistributorsPage;

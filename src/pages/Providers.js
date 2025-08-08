import React, { useEffect, useState } from "react";
import { Container, Table, Button, Pagination, Modal, Form, Col } from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus, FaFileAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import axios from "axios";

const LicenseDropzone = ({ file, onFileAccepted, isInvalid }) => {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [],
      "image/jpeg": [],
      "image/png": []
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: isInvalid ? "2px dashed red" : "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "8px",
        backgroundColor: isDragActive ? "#e9f5ff" : "#fafafa",
        color: isInvalid ? "red" : "inherit"
      }}
    >
      <input {...getInputProps()} />
      {file ? (
        <p>{file.name}</p>
      ) : (
        <p>{isInvalid ? t("licenseDropzone.required") : t("licenseDropzone.dragDrop")}</p>
      )}
    </div>
  );
};

const ProvidersPage = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [providers, setProviders] = useState([]);
  const [editingProvider, setEditingProvider] = useState(null);
  const [areas, setAreas] = useState([]);

  const providersPerPage = 5;
  const thStyle = {
    color: "#a8a5a5ff",
    backgroundColor: "#f0f0f0",
    borderBottom: "none"
  };

  const [newProvider, setNewProvider] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    country: "",
    tests: "",
    licenseFile: null,
    area_id: "",
    gender: "",
    age: ""
  });

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await axios.get("/api/providers");
        setProviders(response.data);
      } catch (error) {
        console.error("فشل تحميل المزودين", error);
      }
    }
    fetchProviders();
  }, []);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const response = await axios.get("/api/areas");
        setAreas(response.data);
      } catch (error) {
        console.error("خطأ في جلب المناطق", error);
      }
    }
    fetchAreas();
  }, []);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!newProvider.name.trim()) errors.name = t("providersPage.validation.nameRequired");
    if (!newProvider.phone.trim()) {
      errors.phone = t("providersPage.validation.phoneRequired");
    } else if (!phoneRegex.test(newProvider.phone)) {
      errors.phone = t("providersPage.validation.phoneInvalid");
    }
    if (!newProvider.email.trim()) {
      errors.email = t("providersPage.validation.emailRequired");
    } else if (!emailRegex.test(newProvider.email)) {
      errors.email = t("providersPage.validation.emailInvalid");
    }
    if (!newProvider.location.trim()) errors.location = t("providersPage.validation.locationRequired");

    // الرخصة مطلوبة فقط في حالة الإضافة وليس التعديل
    if (!editingProvider && !newProvider.licenseFile) {
      errors.licenseFile = t("providersPage.validation.licenseRequired");
    }

    if (!newProvider.age) errors.age = t("providersPage.validation.ageRequired");
    if (!newProvider.gender) errors.gender = t("providersPage.validation.genderRequired");

    if (!newProvider.area_id) errors.area_id = t("providersPage.validation.areaRequired");

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredProviders = providers.filter((provider) =>
    (provider.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSave() {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", newProvider.name);
      formData.append("location", newProvider.location);
      formData.append("email", newProvider.email);
      formData.append("phone", newProvider.phone);
      formData.append("area_id", newProvider.area_id);
      formData.append("gender", newProvider.gender);
      formData.append("age", newProvider.age);

      // إرفاق ملف الرخصة فقط إذا تم رفع ملف جديد
      if (newProvider.licenseFile instanceof File) {
        formData.append("license", newProvider.licenseFile);
      }

      // إذا كان تعديل أرسل _method: PUT
      if (editingProvider) {
        formData.append("_method", "PUT");
      }

      const response = await axios.post(
        editingProvider ? `/api/providers/${editingProvider.id}` : "/api/providers/save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert(editingProvider ? t("providersPage.editSuccess") : t("providersPage.addSuccess"));
        setShowModal(false);
        setNewProvider({
          name: "",
          phone: "",
          email: "",
          location: "",
          licenseFile: null,
          area_id: "",
          gender: "",
          age: ""
        });
        setEditingProvider(null);
        setFormErrors({});

        // إعادة تحميل المزودين بعد الحفظ
        const refreshed = await axios.get("/api/providers");
        setProviders(refreshed.data);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      alert(t("providersPage.saveError"));
    }
  }

  return (
    <Container className="my-4" style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}>
      {/* Search and Add */}
      <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder={t("providersPage.searchByName")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "400px", minWidth: "250px" }}
        />
        <Button
          onClick={() => {
            setShowModal(true);
            setEditingProvider(null);
            setNewProvider({
              name: "",
              location: "",
              email: "",
              phone: "",
              country: "",
              tests: "",
              licenseFile: null,
              area_id: "",
              gender: "",
              age: ""
            });
            setFormErrors({});
          }}
          className="d-flex align-items-center px-4 py-2"
          style={{
            fontWeight: 600,
            fontSize: "0.8rem",
            height: "42px",
            borderRadius: "100px",
            backgroundColor: "#4a90e2",
            color: "white",
            width: "100%",
            maxWidth: "200px"
          }}
        >
          <FaPlus className="me-2" />
          {t("providersPage.add_new_provider")}
        </Button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table
          hover
          responsive
          className="mb-0"
          style={{
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            minWidth: "700px",
            fontSize: "0.95rem"
          }}
        >
          <thead className="text-center" style={{ backgroundColor: "#f0f0f0", color: "#4a4a4a" }}>
            <tr>
              <th className="py-3" style={thStyle}>{t("providersPage.name")}</th>
              <th className="py-3" style={thStyle}>{t("providersPage.location")}</th>
              <th className="py-3" style={thStyle}>{t("providersPage.email")}</th>
              <th className="py-3" style={thStyle}>{t("providersPage.phone")}</th>
              <th className="py-3" style={thStyle}>{t("providersPage.tests")}</th>
              <th className="py-3" style={thStyle}>{t("providersPage.license")}</th>
              <th className="py-3" style={thStyle}>{t("providersPage.actions")}</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {currentProviders.length > 0 ? (
              currentProviders.map((provider, idx) => (
                <tr
                  key={provider.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)"
                  }}
                >
                  <td className="py-3" style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                    {provider.user?.name || t("providersPage.unknown")}
                  </td>
                  <td className="py-3">{provider.location}</td>
                  <td className="py-3">{provider.user.email}</td>
                  <td className="py-3">{provider.user.phone}</td>
                  <td className="py-3">{provider.tests}</td>
                  <td className="py-3">
                    {provider.license ? (
                      <a
                        href={`http://localhost:8000/storage/${provider.license}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t("providersPage.viewLicense")}
                      >
                        <FaFileAlt style={{ cursor: "pointer" }} />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3" style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        title={t("providersPage.edit")}
                        onClick={() => {
                          setNewProvider({
                            name: provider.user?.name || "",
                            phone: provider.user.phone || "",
                            email: provider.user?.email || "",
                            location: provider.location || "",
                            licenseFile: null,
                            area_id: provider.user.area_id || "",
                            gender: provider.user.gender || "",
                            age: provider.user.age || ""
                          });
                          setEditingProvider(provider);
                          setShowModal(true);
                          setFormErrors({});
                        }}
                      >
                        <FaEdit />
                      </Button>

                      <Button
                        variant="light"
                        size="sm"
                        title={t("providersPage.delete")}
                        onClick={async () => {
                          if (window.confirm(t("providersPage.confirmDelete"))) {
                            try {
                              await axios.delete(`/api/providers/${provider.id}`);
                              setProviders(providers.filter(p => p.id !== provider.id));
                            } catch (error) {
                              alert(t("providersPage.deleteError"));
                            }
                          }
                        }}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4">{t("providersPage.noProvidersFound")}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Modal */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingProvider(null);
          setFormErrors({});
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProvider ? t("providersPage.editProvider") : t("providersPage.add_new_provider")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: "20px" }}>{t("providersPage.pleaseFillFields")}</p>
          <h6 style={{ marginBottom: "20px" }}>
            <strong>{t("providersPage.date")} : {new Date().toLocaleDateString()}</strong>
          </h6>
          <hr />
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>{t("providersPage.providerName")}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProvider.name}
                onChange={handleInputChange}
                placeholder={t("providersPage.writeHere")}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>{t("providersPage.phoneNumber")}</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder={t("providersPage.writeHere")}
                value={newProvider.phone}
                onChange={handleInputChange}
                isInvalid={!!formErrors.phone}
              />
              <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>{t("providersPage.emailAddress")}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t("providersPage.writeHere")}
                value={newProvider.email}
                onChange={handleInputChange}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>{t("providersPage.gender")}</Form.Label>
              <Form.Select
                name="gender"
                value={newProvider.gender}
                onChange={(e) => setNewProvider(prev => ({ ...prev, gender: e.target.value }))}
                isInvalid={!!formErrors.gender}
              >
                <option value="">{t("providersPage.select")}</option>
                <option value="male">{t("providersPage.male")}</option>
                <option value="female">{t("providersPage.female")}</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formErrors.gender}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>{t("providersPage.age")}</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder={t("providersPage.enterAge")}
                value={newProvider.age}
                onChange={handleInputChange}
                isInvalid={!!formErrors.age}
              />
              <Form.Control.Feedback type="invalid">{formErrors.age}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formArea">
              <Form.Label>{t("providersPage.country")}</Form.Label>
              <Form.Select
                name="area_id"
                value={newProvider.area_id}
                onChange={(e) => setNewProvider(prev => ({ ...prev, area_id: e.target.value }))}
                isInvalid={!!formErrors.area_id}
              >
                <option value="">{t("providersPage.selectArea")}</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formErrors.area_id}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>{t("providersPage.locationAddress")}</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder={t("providersPage.writeHere")}
                value={newProvider.location}
                onChange={handleInputChange}
                isInvalid={!!formErrors.location}
              />
              <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLicenseUpload">
              <Form.Label>{t("providersPage.license")}</Form.Label>
              <LicenseDropzone
                file={newProvider.licenseFile}
                onFileAccepted={(file) => setNewProvider(prev => ({ ...prev, licenseFile: file }))}
                isInvalid={!!formErrors.licenseFile}
              />
              <Form.Control.Feedback type="invalid">{formErrors.licenseFile}</Form.Control.Feedback>
            </Form.Group>

            {/* معاينة ملف الرخصة الحالي إن وجد */}
            {editingProvider?.license && (
              <Col md={6} className="d-flex align-items-end">
                <a
                  href={`http://localhost:8000/storage/${editingProvider.license}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  {t("providersPage.viewLicense")}
                </a>
              </Col>
            )}
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
              fontWeight: "600"
            }}
          >
            {editingProvider ? t("providersPage.edit") : t("providersPage.add")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProvidersPage;

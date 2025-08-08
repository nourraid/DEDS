import React, { useState, useEffect } from "react";
import {
  Container,
  Pagination,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { FaTrashAlt, FaPlus, FaEdit, FaFileAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import axios from "axios";

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
    location: "",
    gender: "",
    age: "",
    area_id: "",
    licenseFile: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const [areas, setAreas] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setFormData((prev) => ({ ...prev, licenseFile: acceptedFiles[0] }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

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

  useEffect(() => {
    async function fetchDistributors() {
      try {
        const response = await axios.get("/api/distributors");
        setDistributors(response.data);
        setLoading(false);
      } catch (error) {
        console.error("خطأ في تحميل الموزعين:", error);
        setLoading(false);
      }
    }
    fetchDistributors();
  }, []);

  const filtered = distributors.filter((dist) => {
    const name = dist.name || dist.user?.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const providersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / providersPerPage);
  const indexOfLast = currentPage * providersPerPage;
  const indexOfFirst = indexOfLast - providersPerPage;
  const currentProviders = filtered.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

const validateForm = () => {
  const errors = {};
  if (!formData.name) errors.name = t("distributors.name_required");
  if (!formData.phone) errors.phone = t("distributors.phone_required");
  if (!formData.email) errors.email = t("distributors.email_required");
  if (!formData.location) errors.location = t("distributors.location_required");
  if (!formData.gender) errors.gender = t("distributors.gender_required");
  if (!formData.age) errors.age = t("distributors.age_required");
  if (!formData.area_id) errors.area_id = t("distributors.area_required");

  // إذا كنا في وضع إضافة جديد، أو ما في رخصة سابقة، لازم يرفع ملف رخصة
  if (!editingDistributor && !formData.licenseFile) {
    errors.licenseFile = t("distributors.license_required");
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};


 // إضافة state جديدة
  const [editingDistributor, setEditingDistributor] = useState(null);

const openEditModal = (dist) => {
  setFormData({
    name: dist.name || dist.user?.name || "",
    phone: dist.user.phone,
    email: dist.user?.email || "",
    location: dist.location,
    gender: dist.user.gender,
    age: dist.user.age,
    area_id: dist.user.area_id,
    licenseFile: null, // لا يمكن جلب الملف القديم، ممكن تتركه فارغ
        existingLicenseUrl: dist.license, // أضفنا هذا

  });
  setEditingDistributor(dist);
  setShowModal(true);
};

// تحديث handleSave ليدعم الإضافة أو التعديل
const handleSave = async () => {
  console.log("زر الحفظ تم الضغط عليه");

  setServerErrors(null);
  if (!validateForm()) return;

  console.log("Passed validation");

  
  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("location", formData.location);
    data.append("gender", formData.gender);
    data.append("age", Number(formData.age));
    data.append("area_id", formData.area_id);
    if (formData.licenseFile) {
      data.append("license", formData.licenseFile);
    }


    let response;
    if (editingDistributor) {
      data.append('_method', 'PUT'); // الصح

      response = await axios.post(`/api/distributors/${editingDistributor.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // إضافة موزع جديد
      response = await axios.post("/api/distributors/save", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    if (response.status === 201 || response.status === 200) {
      if (editingDistributor) {
        // تحديث الموزع في الواجهة
        setDistributors((prev) =>
          prev.map((d) => (d.id === editingDistributor.id ? response.data.distributer : d))
        );
      } else {
        setDistributors((prev) => [...prev, response.data.distributer]);
      }
      setShowModal(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        location: "",
        gender: "",
        age: "",
        area_id: "",
        licenseFile: null,
      });
      setFormErrors({});
      setEditingDistributor(null);
    }
  } catch (error) {
  console.error("Error in handleSave:", error);
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
    if (error.response.status === 422) {
      setServerErrors(error.response.data.errors);
    } else {
      alert(`خطأ من السيرفر: ${error.response.status} - ${error.response.statusText}`);
    }
  } else if (error.request) {
    console.error("No response received:", error.request);
    alert("لم يصل رد من السيرفر، تحقق من الاتصال.");
  } else {
    console.error("Error setting up request:", error.message);
    alert("حدث خطأ غير متوقع. حاول مرة أخرى.");
  }
}


};

// حذف موزع
const handleDelete = async (id) => {
  if (!window.confirm("هل أنت متأكد من حذف هذا الموزع؟")) return;

  try {
    await axios.delete(`/api/distributors/${id}`);
    
    setDistributors((prev) => prev.filter((dist) => dist.id !== id));
  } catch (error) {
    alert("حدث خطأ أثناء الحذف. حاول مرة أخرى.");
  }
};



  return (
    <Container className="my-4" style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}>
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
          style={{ fontWeight: 600, fontSize: "0.8rem", height: "42px", borderRadius: "100px", backgroundColor: "#4a90e2", color: "white", width: "100%", maxWidth: "200px" }}
          disabled={loading}
        >
          <FaPlus className="me-2" />
          {t("distributors.add_distributor")}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">{t("distributors.loading_distributors")}</div>
      ) : (
        <div className="table-responsive">
          <Table hover className="mb-0" style={{ borderCollapse: "separate", borderSpacing: "0 10px", minWidth: "700px", fontSize: "0.95rem" }}>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4">{t("distributors.no_distributors_found")}</td>
                </tr>
              ) : (
                currentProviders.map((dist, idx) => (
                  <tr key={dist.id} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
                    <td>{dist.user?.name || "-"}</td>
                    <td>{dist.location}</td>
                    <td>{dist.user?.email || "-"}</td>
                    <td>{dist.user?.phone}</td>
                    <td>{dist.tests}</td>
                    <td>
                      {dist.license ? (
                        <a href={`http://localhost:8000/storage/${dist.license}`} target="_blank" rel="noopener noreferrer" title="View License">
                          <FaFileAlt />
                        </a>
                      ) : "-"}
                    </td>
                 <td>
  <div className="d-flex justify-content-center gap-2">
    <button className="btn btn-sm" title={t("distributors.edit")} onClick={() => openEditModal(dist)}>
      <FaEdit />
    </button>
    <button className="btn btn-sm" title={t("distributors.delete")} onClick={() => handleDelete(dist.id)}>
      <FaTrashAlt />
    </button>
  </div>
</td>

                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i + 1} active={currentPage === i + 1} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </div>
      )}

 <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
  {serverErrors?.name && (
  <div className="text-danger mb-2">{serverErrors.name.join(", ")}</div>
)}
{serverErrors?.email && (
  <div className="text-danger mb-2">{serverErrors.email.join(", ")}</div>
)}
{serverErrors?.phone && (
  <div className="text-danger mb-2">{serverErrors.phone.join(", ")}</div>
)}
{/* وهكذا لكل الحقول */}

  <Modal.Header closeButton>
    <Modal.Title>{t("distributors.add_new_distributor")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
 {serverErrors?.general && (
  <Alert variant="danger">
    {serverErrors.general.map((msg, idx) => (
      <div key={idx}>{msg}</div>
    ))}
  </Alert>
)}

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
          <Form.Label>{t("distributors.gender")}</Form.Label>
          <Form.Select
            value={formData.gender}
            isInvalid={!!formErrors.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">{t("distributors.select_gender")}</option>
            <option value="male">{t("distributors.male")}</option>
            <option value="female">{t("distributors.female")}</option>
          </Form.Select>
          {formErrors.gender && (
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {formErrors.gender}
            </Form.Control.Feedback>
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Label>{t("distributors.age")}</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={120}
            value={formData.age}
            isInvalid={!!formErrors.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          />
          <Form.Control.Feedback type="invalid">{formErrors.age}</Form.Control.Feedback>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Label>{t("distributors.area")}</Form.Label>
          <Form.Group controlId="area_id">
            <Form.Control
              as="select"
              value={formData.area_id || ""}
              isInvalid={!!formErrors.area_id}
              onChange={(e) => setFormData({ ...formData, area_id: e.target.value })}
            >
              <option value="">{t("form.select_area")}</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {formErrors.area_id}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        {formData.existingLicenseUrl && (
  <div className="mb-2">
    <strong>{t("distributors.current_license")}:</strong>{" "}
    <a href= {`http://localhost:8000/storage/${formData.existingLicenseUrl}`} target="_blank" rel="noopener noreferrer">
      {`http://localhost:8000/storage/${formData.existingLicenseUrl}`}
    </a>
  </div>
)}
<Form.Group controlId="licenseFile">
  <Form.Label>{t("distributors.license")}</Form.Label>
  <Form.Control
    type="file"
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, licenseFile: e.target.files[0] }))
    }
  />
</Form.Group>

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

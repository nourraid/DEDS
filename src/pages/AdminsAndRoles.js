import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";import {
  Container,
  Table,
  Button,
  Pagination,
  Modal,
  Form,
} from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const roles = ["super_admin", "admin", "moderator", "viewer"];

const AdminsAndRolesPage = () => {
  const { t } = useTranslation();

  
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
  axios
    .get("http://localhost:8000/api/admins") // رابط ال API حق جلب المشرفين
    .then((response) => {
      setAdmins(response.data);
    })
    .catch((error) => {
      console.error("Failed to fetch admins:", error);
      // ممكن تظهر رسالة خطأ للمستخدم
    });
}, []);

  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: roles[0],
  });

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [admins, searchTerm]);

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;

  const currentAdmins = useMemo(() => {
    return filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  }, [filteredAdmins, indexOfFirstAdmin, indexOfLastAdmin]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: null, name: "", email: "", role: roles[0] });
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setIsEditing(true);
    setFormData(admin);
    setShowModal(true);
  };

const handleDelete = (id) => {
  if (window.confirm(t("admin.confirm_delete") || "هل أنت متأكد من الحذف؟")) {
    axios
      .delete(`http://localhost:8000/api/admins/${id}`)
      .then(() => {
        setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      })
      .catch((err) => {
        if (err.response) {
          // الخطأ من السيرفر مع رسالة واضحة
          console.error("Delete error response data:", err.response.data);
          alert(`فشل الحذف: ${err.response.data.message || "خطأ غير معروف"}`);
        } else if (err.request) {
          // لم يتم استلام رد من السيرفر
          console.error("Delete error no response received:", err.request);
          alert("فشل الحذف: لم يتم استقبال رد من الخادم");
        } else {
          // خطأ في الإعداد أو شيء آخر
          console.error("Delete error", err.message);
          alert(`فشل الحذف: ${err.message}`);
        }
      });
  }
};



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSave = () => {
  if (!formData.name.trim() || !formData.email.trim()) {
    alert(t("admin.fill_all_fields") || "يرجى ملء جميع الحقول");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert(t("admin.invalid_email") || "البريد الإلكتروني غير صالح");
    return;
  }

  if (isEditing) {
    // تحديث مشرف موجود - PUT أو PATCH
    axios
      .put(`http://localhost:8000/api/admins/${formData.id}`, formData)
      .then((res) => {
        setAdmins((prev) =>
          prev.map((admin) => (admin.id === formData.id ? res.data : admin))
        );
        setShowModal(false);
      })
      .catch((err) => {
        console.error(err);
        alert("فشل التحديث");
      });
  } else {
    // إضافة مشرف جديد - POST
    axios
      .post("http://localhost:8000/api/admins", formData)
      .then((res) => {
        setAdmins((prev) => [...prev, res.data]);
        setShowModal(false);
      })
      .catch((err) => {
        console.error(err);
        alert("فشل الإضافة");
      });
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
          placeholder={t("admin.search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "400px", minWidth: "250px" }}
        />
        <Button
          onClick={openAddModal}
          className="d-flex align-items-center px-4 py-2"
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
          {t("admin.add_new_admin")}
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
              <th style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                {t("admin.full_name")}
              </th>
              <th>{t("admin.email")}</th>
              <th>{t("admin.role")}</th>
              <th style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                {t("admin.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="text-center">
            {currentAdmins.length > 0 ? (
              currentAdmins.map((admin, idx) => (
                <tr
                  key={admin.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <td className="py-3">{admin.name}</td>
                  <td className="py-3">{admin.email}</td>
                  <td className="py-3">{t(`roles.${admin.role}`)}</td>
                  <td className="py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openEditModal(admin)}
                        aria-label={t("admin.edit_admin") + ` ${admin.name}`}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(admin.id)}
                        aria-label={t("admin.delete_admin") + ` ${admin.name}`}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4">
                  {t("admin.no_admins_found")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
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
      <Modal size="md" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? t("admin.edit_admin") : t("admin.add_new_admin")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="adminName">
              <Form.Label>{t("admin.full_name")}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("admin.enter_full_name")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminEmail">
              <Form.Label>{t("admin.email")}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("admin.enter_email")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminRole">
              <Form.Label>{t("admin.role")}</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleInputChange}>
                {roles.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {t(`roles.${roleOption}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
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
            {isEditing ? t("admin.save_changes") : t("admin.add_admin")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminsAndRolesPage;

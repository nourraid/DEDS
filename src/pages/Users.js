import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaFileAlt,
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaInfo,
} from "react-icons/fa";
import {
  Button,
  Form,
  Modal,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    id_number: "",
    dob: "",
    gender: "",
    blood_type: "",
    weight: "",
    country: "",
    city: "",
    street: "",
    building_number: "",
    password: "",
    area_id: "",
    profile_picture: null,
    
  });

  const [formErrors, setFormErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: "",
    result: "",
    gender: "",
    age: "",
    date: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const rolesList = ["admin", "user", "provider", "distributor"];
const [editingUserId, setEditingUserId] = useState(null);
const handleEditClick = (user) => {
  setEditingUserId(user.user_id);
  setNewUser({
    name: user.name || "",  // هل موجود في user؟
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "",
    id_number: user.id_number || "",
    dob: user.dob || "",
    gender: user.gender || "",
    blood_type: user.blood_type || "",
    weight: user.weight || "",
    country: user.country || "",
    city: user.city || "",
    street: user.street || "",
    building_number: user.building_number || "",
    password:user.password ||"", 
    area_id: user.area_id || "",
    profile_picture: null,
  });
  setFormErrors({});
  setShowModal(true);
};


const handleDeleteUser = async (userId) => {
  try {
    await axios.delete(`http://localhost:8000/api/users/${userId}`);
    alert("تم حذف المستخدم بنجاح!");
    fetchUsers(); // تحديث القائمة بعد الحذف
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("حدث خطأ أثناء حذف المستخدم.");
  }
};



  // جلب المستخدمين
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/api/users");
      setUsers(res.data);
    } catch (err) {
      setError(t("usersPage.errors.fetchFailed") || "حدث خطأ أثناء جلب بيانات المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // رفع صورة بالـ Drag & Drop
  const onDrop = (acceptedFiles) => {
    setNewUser((prev) => ({ ...prev, profile_picture: acceptedFiles[0] }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  // تحديث القيم عند الإدخال
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // تحقق من صحة الفورم
const validateForm = () => {
  const errors = {};

  if (!newUser.name) errors.name = t("usersPage.modal.validationErrors.nameRequired");
  
  if (!newUser.email) errors.email = t("usersPage.modal.validationErrors.emailRequired");
  else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = t("usersPage.modal.validationErrors.emailInvalid");

  if (!newUser.phone) errors.phone = t("usersPage.modal.validationErrors.phoneRequired");

  if (!newUser.role) errors.role = t("usersPage.modal.validationErrors.roleRequired");

  if (!newUser.password) errors.password = t("usersPage.modal.validationErrors.passwordRequired");
  else if (newUser.password.length < 6) errors.password = t("usersPage.modal.validationErrors.passwordTooShort");

  if (newUser.dob && isNaN(Date.parse(newUser.dob))) errors.dob = t("usersPage.modal.validationErrors.dobInvalid");

  if (!newUser.id_number) errors.id_number = t("usersPage.modal.validationErrors.idNumberRequired");

  if (!newUser.gender) errors.gender = t("usersPage.modal.validationErrors.genderRequired");

  if (!newUser.blood_type) errors.blood_type = t("usersPage.modal.validationErrors.bloodTypeRequired");

  if (!newUser.weight) errors.weight = t("usersPage.modal.validationErrors.weightRequired");
  else if (isNaN(newUser.weight) || newUser.weight <= 0) errors.weight = t("usersPage.modal.validationErrors.weightInvalid");

  if (!newUser.country) errors.country = t("usersPage.modal.validationErrors.countryRequired");

  if (!newUser.city) errors.city = t("usersPage.modal.validationErrors.cityRequired");

  if (!newUser.street) errors.street = t("usersPage.modal.validationErrors.streetRequired");

  if (!newUser.building_number) errors.building_number = t("usersPage.modal.validationErrors.buildingNumberRequired");

  if (!newUser.area_id) errors.area_id = t("usersPage.modal.validationErrors.areaRequired");

  if (newUser.profile_picture) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(newUser.profile_picture.type)) {
      errors.profile_picture = t("usersPage.modal.validationErrors.profilePictureInvalid");
    }
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};


  // حفظ المستخدم الجديد
const handleSaveUser = async () => {
  if (!validateForm()) return;

  setSaving(true);
  setFormErrors({});

  try {
    const formData = new FormData();

    for (const [key, value] of Object.entries(newUser)) {
      if (key === "profile_picture") {
        if (value && value instanceof File) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value || "");
      }
    }

    if (editingUserId) {
      // تحديث مستخدم موجود
      await axios.post(`http://localhost:8000/api/users/${editingUserId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("تم تحديث المستخدم بنجاح!");
    } else {
      // إضافة مستخدم جديد
      await axios.post("http://localhost:8000/api/users/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("تم إضافة المستخدم بنجاح!");
    }

    setShowModal(false);
    setEditingUserId(null);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "",
      id_number: "",
      dob: "",
      gender: "",
      blood_type: "",
      weight: "",
      country: "",
      city: "",
      street: "",
      building_number: "",
      password: "",
      area_id: "",
      profile_picture: null,
    });
    fetchUsers();
  } catch (error) {
    // نفس معالجة الخطأ السابقة...
    // [محتوى معالجة الخطأ كما عندك]
  } finally {
    setSaving(false);
  }
};


  // تحديث الفلاتر
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // الفلترة
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = user.user_id?.toString().toLowerCase().includes(searchLower);

    const areaMatch = filters.area ? user.area.toLowerCase() === filters.area.toLowerCase() : true;

    const resultFilter = filters.result.toLowerCase();
    const userResult = user.ai_result ? user.ai_result.toLowerCase() : "";
    const resultMatch = filters.result ? userResult === resultFilter : true;

    const genderMatch = filters.gender ? user.gender.toLowerCase() === filters.gender.toLowerCase() : true;

    const ageMatch = filters.age ? user.age === parseInt(filters.age) : true;

    const dateMatch = filters.date ? user.registration_date === filters.date : true;

    return searchMatch && areaMatch && resultMatch && genderMatch && ageMatch && dateMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const uniqueAreas = [...new Set(users.map((user) => user.area))];

  const [areas, setAreas] = useState([]);

useEffect(() => {
  // جلب المناطق عند تحميل الصفحة
  const fetchAreas = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/areas");
      setAreas(res.data);
    } catch (error) {
      console.error("Failed to fetch areas", error);
    }
  };
  fetchAreas();
}, []);
  return (
<div
      className="container mt-4"
      style={{ padding: "30px", backgroundColor: "white", borderRadius: "5px" }}
    >
      {/* البحث + إضافة */}
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder={t("usersPage.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
        <Button
          onClick={() => setShowModal(true)}
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
          {t("usersPage.addNewUser")}
        </Button>
      </div>

      {/* الفلاتر */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.area}
            onChange={(e) => handleFilterChange("area", e.target.value)}
          >
            <option value="">{t("usersPage.filters.country")}</option>
            {uniqueAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.result}
            onChange={(e) => handleFilterChange("result", e.target.value)}
          >
            <option value="">{t("usersPage.filters.result")}</option>
            <option value="positive">{t("usersPage.filters.resultOptions.positive")}</option>
            <option value="negative">{t("usersPage.filters.resultOptions.negative")}</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.gender}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
          >
            <option value="">{t("usersPage.filters.gender")}</option>
            <option value="Male">{t("usersPage.filters.genderOptions.male")}</option>
            <option value="Female">{t("usersPage.filters.genderOptions.female")}</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder={t("usersPage.filters.age")}
            value={filters.age}
            onChange={(e) => handleFilterChange("age", e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <div
            className="position-relative"
            style={{
              width: "42px",
              height: "42px",
              border: "1px solid #ccc",
              borderRadius: "9px",
              backgroundColor: "white",
            }}
          >
            <input
              type="date"
              id="date-picker"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="position-absolute top-0 start-0 opacity-0"
              style={{ width: "100%", height: "100%", zIndex: 2, cursor: "pointer" }}
            />
            <button
              type="button"
              className="btn d-flex justify-content-center align-items-center w-100 h-100"
              onClick={() => document.getElementById("date-picker").showPicker?.()}
              style={{ zIndex: 1, pointerEvents: "none", borderRadius: "8px" }}
            >
              <FaCalendarAlt />
            </button>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div
        className="table-responsive shadow-sm rounded"
        style={{ border: "1px solid #e3e6f0" }}
      >
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center py-4">
            {error}
          </Alert>
        ) : (
          <>
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
                style={{ backgroundColor: "#f0f0f0", color: "#4a4a4a" }}
              >
                <tr>
                  <th
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                    }}
                  >
                    {t("usersPage.tableHeaders.userId")}
                  </th>
                  <th
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                    }}
                  >
                    {t("usersPage.tableHeaders.area")}
                  </th>
                  <th
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                    }}
                  >
                    {t("usersPage.tableHeaders.registrationDate")}
                  </th>
                  <th
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                    }}
                  >
                    {t("usersPage.tableHeaders.aiResult")}
                  </th>
                  <th
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                    }}
                  >
                    {t("usersPage.tableHeaders.aiTest")}
                  </th>
                  <th
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                    }}
                  >
                    {t("usersPage.tableHeaders.options")}
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      style={{
                        backgroundColor:
                          user.user_id % 2 === 0 ? "#ffffff" : "#f9f9fb",
                        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                        margin: "10px",
                        display: "table-row",
                      }}
                    >
                      <td className="py-3">{user.user_id}</td>
                      <td className="py-3">{user.area}</td>
                      <td className="py-3">{user.registration_date}</td>
                      <td className="py-3">
                        {user.ai_result ? (
                          <span
                            className={`badge ${
                              user.ai_result.toLowerCase() === "positive"
                                ? "bg-danger"
                                : user.ai_result.toLowerCase() === "negative"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {user.ai_result}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <FaFileAlt
                          style={{ cursor: "pointer", color: "#4a90e2", fontSize: "22px" }}
                          onClick={() => navigate(`/ai-test/${user.user_id}`)}
                          title={t("usersPage.tooltips.goToAiTestDetails")}
                        />
                      </td>
                      <td className="py-3">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm"
                            title={t("usersPage.tooltips.edit")}
                            onClick={() => handleEditClick(user)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="btn btn-sm"
                            title={t("usersPage.tooltips.info")}
                            onClick={() => navigate(`/users/${user.user_id}`)}
                          >
                            <FaInfo />
                          </button>
                          <button
                            className="btn btn-sm"
                            title={t("usersPage.tooltips.delete")}
                            onClick={() => handleDeleteUser(user.user_id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4">
                      {t("usersPage.noUsersFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* التصفح Pagination */}
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* مودال إضافة مستخدم جديد */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("usersPage.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">{t("usersPage.modal.fillFields")}</p>
          <h6 className="mb-4">
            <strong>
              {t("usersPage.modal.dateLabel")} {new Date().toLocaleDateString()}
            </strong>
          </h6>
          <hr />

          <Form>
            <div className="row">
              {/* الاسم */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.userName")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name || t("usersPage.modal.validationErrors.nameRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* البريد */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.emailAddress")}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.email || t("usersPage.modal.validationErrors.emailRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الهاتف */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.phoneNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.phone || t("usersPage.modal.validationErrors.phoneRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الدور */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.role")}</Form.Label>
                <Form.Select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.role}
                >
                  <option value="">{t("usersPage.modal.formPlaceholders.role")}</option>
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      {t(`usersPage.modal.roles.${r}`) || r}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.role || t("usersPage.modal.validationErrors.roleRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* كلمة المرور */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.password")}</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.password}
                  readOnly={!!editingUserId} // إذا في تعديل، الحقل يصبح قراءة فقط
                  placeholder={
                    editingUserId
                      ? "Read only while editing"
                      : ""
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.password || t("usersPage.modal.validationErrors.passwordRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* تاريخ الميلاد */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.dob")}</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={newUser.dob}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.dob}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.dob || t("usersPage.modal.validationErrors.dobRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الرقم الوطني */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.idNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  name="id_number"
                  value={newUser.id_number}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.id_number}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.id_number || t("usersPage.modal.validationErrors.idNumberRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الجنس */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.gender")}</Form.Label>
                <Form.Select
                  name="gender"
                  value={newUser.gender}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.gender}
                >
                  <option value="">{t("usersPage.modal.formPlaceholders.gender")}</option>
                  <option value="Male">{t("usersPage.filters.genderOptions.male")}</option>
                  <option value="Female">{t("usersPage.filters.genderOptions.female")}</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.gender || t("usersPage.modal.validationErrors.genderRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* فصيلة الدم */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.bloodType")}</Form.Label>
                <Form.Control
                  type="text"
                  name="blood_type"
                  value={newUser.blood_type}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.blood_type}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.blood_type || t("usersPage.modal.validationErrors.bloodTypeRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الوزن */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.weight")}</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  value={newUser.weight}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.weight}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.weight || t("usersPage.modal.validationErrors.weightRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الدولة */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.country")}</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={newUser.country}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.country}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.country || t("usersPage.modal.validationErrors.countryRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* المدينة */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.city")}</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={newUser.city}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.city || t("usersPage.modal.validationErrors.cityRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* الشارع */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.street")}</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={newUser.street}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.street}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.street || t("usersPage.modal.validationErrors.streetRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* رقم المبنى */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.buildingNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  name="building_number"
                  value={newUser.building_number}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.building_number}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.building_number || t("usersPage.modal.validationErrors.buildingNumberRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* المنطقة */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.area")}</Form.Label>
                <Form.Select
                  name="area"
                  value={newUser.area}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.area}
                >
                  <option value="">{t("usersPage.modal.formPlaceholders.area")}</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.area || t("usersPage.modal.validationErrors.areaRequired")}
                </Form.Control.Feedback>
              </Form.Group>

              {/* صورة البروفايل */}
              <Form.Group className="mb-3 col-md-6">
                <Form.Label>{t("usersPage.modal.formLabels.profilePicture")}</Form.Label>
                <div
                  {...getRootProps()}
                  className={`dropzone p-3 border rounded text-center ${
                    isDragActive ? "bg-light" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>{t("usersPage.modal.formPlaceholders.dropzonePlaceholder")}</p>
                  )}
                </div>
                {formErrors.profile_picture && (
                  <div className="text-danger mt-1">{formErrors.profile_picture}</div>
                )}
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveUser}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {t("usersPage.modal.saving")}
              </>
            ) : (
              t("usersPage.modal.addButton")
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
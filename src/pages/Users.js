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

  if (!newUser.name) errors.name = "الاسم مطلوب";
  
  if (!newUser.email) errors.email = "البريد الإلكتروني مطلوب";
  else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = "البريد الإلكتروني غير صالح";

  if (!newUser.phone) errors.phone = "رقم الهاتف مطلوب";

  if (!newUser.role) errors.role = "الدور مطلوب";

  if (!newUser.password) errors.password = "كلمة المرور مطلوبة";
  else if (newUser.password.length < 6) errors.password = "كلمة المرور قصيرة جداً";

  if (newUser.dob && isNaN(Date.parse(newUser.dob))) errors.dob = "تاريخ الميلاد غير صالح";

  if (!newUser.id_number) errors.id_number = "الرقم الوطني مطلوب";

  if (!newUser.gender) errors.gender = "الجنس مطلوب";

  if (!newUser.blood_type) errors.blood_type = "فصيلة الدم مطلوبة";

  if (!newUser.weight) errors.weight = "الوزن مطلوب";
  else if (isNaN(newUser.weight) || newUser.weight <= 0) errors.weight = "الوزن غير صالح";

  if (!newUser.country) errors.country = "الدولة مطلوبة";

  if (!newUser.city) errors.city = "المدينة مطلوبة";

  if (!newUser.street) errors.street = "الشارع مطلوب";

  if (!newUser.building_number) errors.building_number = "رقم المبنى مطلوب";

  if (!newUser.area_id) errors.area_id = "المنطقة مطلوبة";

  // ممكن تضيف تحقق للملف المرفوع إذا حابب
  if (newUser.profile_picture) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(newUser.profile_picture.type)) {
      errors.profile_picture = "نوع الملف غير مدعوم، استخدم jpg أو png";
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
            {uniqueAreas.map((area, idx) => (
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
        {formErrors.name}
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
        {formErrors.email}
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
        {formErrors.phone}
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
            {r}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {formErrors.role}
      </Form.Control.Feedback>
    </Form.Group>

    {/* كلمة المرور */}
 <Form.Group className="mb-3 col-md-6">
  <Form.Label>كلمة المرور</Form.Label>
  <Form.Control
    type="password"
    name="password"
    value={newUser.password}
    onChange={handleInputChange}
    isInvalid={!!formErrors.password}
    readOnly={!!editingUserId}   // إذا في تعديل، الحقل يصبح قراءة فقط
    placeholder={editingUserId ? "غير قابل للتعديل أثناء التعديل" : ""}
  />
  <Form.Control.Feedback type="invalid">
    {formErrors.password}
  </Form.Control.Feedback>
</Form.Group>


    {/* باقي الحقول بنفس الطريقة: */}
    {/* تاريخ الميلاد */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>تاريخ الميلاد</Form.Label>
      <Form.Control
        type="date"
        name="dob"
        value={newUser.dob}
        onChange={handleInputChange}
        isInvalid={!!formErrors.dob}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.dob}
      </Form.Control.Feedback>
    </Form.Group>

    {/* الرقم الوطني */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>الرقم الوطني</Form.Label>
      <Form.Control
        type="text"
        name="id_number"
        value={newUser.id_number}
        onChange={handleInputChange}
        isInvalid={!!formErrors.id_number}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.id_number}
      </Form.Control.Feedback>
    </Form.Group>

    {/* الجنس */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>الجنس</Form.Label>
      <Form.Select
        name="gender"
        value={newUser.gender}
        onChange={handleInputChange}
        isInvalid={!!formErrors.gender}
      >
        <option value="">اختر الجنس</option>
        <option value="Male">ذكر</option>
        <option value="Female">أنثى</option>
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {formErrors.gender}
      </Form.Control.Feedback>
    </Form.Group>

    {/* فصيلة الدم */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>فصيلة الدم</Form.Label>
      <Form.Control
        type="text"
        name="blood_type"
        value={newUser.blood_type}
        onChange={handleInputChange}
        isInvalid={!!formErrors.blood_type}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.blood_type}
      </Form.Control.Feedback>
    </Form.Group>

    {/* الوزن */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>الوزن</Form.Label>
      <Form.Control
        type="number"
        name="weight"
        value={newUser.weight}
        onChange={handleInputChange}
        isInvalid={!!formErrors.weight}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.weight}
      </Form.Control.Feedback>
    </Form.Group>

    {/* الدولة */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>الدولة</Form.Label>
      <Form.Control
        type="text"
        name="country"
        value={newUser.country}
        onChange={handleInputChange}
        isInvalid={!!formErrors.country}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.country}
      </Form.Control.Feedback>
    </Form.Group>

    {/* المدينة */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>المدينة</Form.Label>
      <Form.Control
        type="text"
        name="city"
        value={newUser.city}
        onChange={handleInputChange}
        isInvalid={!!formErrors.city}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.city}
      </Form.Control.Feedback>
    </Form.Group>

    {/* الشارع */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>الشارع</Form.Label>
      <Form.Control
        type="text"
        name="street"
        value={newUser.street}
        onChange={handleInputChange}
        isInvalid={!!formErrors.street}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.street}
      </Form.Control.Feedback>
    </Form.Group>

    {/* رقم المبنى */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>رقم المبنى</Form.Label>
      <Form.Control
        type="text"
        name="building_number"
        value={newUser.building_number}
        onChange={handleInputChange}
        isInvalid={!!formErrors.building_number}
      />
      <Form.Control.Feedback type="invalid">
        {formErrors.building_number}
      </Form.Control.Feedback>
    </Form.Group>

    {/* المنطقة */}
    <Form.Group className="mb-3 col-md-6">
      <Form.Label>المنطقة</Form.Label>
      <Form.Select
        name="area_id"
        value={newUser.area_id}
        onChange={handleInputChange}
        isInvalid={!!formErrors.area_id}
      >
        <option value="">اختر منطقة</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {formErrors.area_id}
      </Form.Control.Feedback>
    </Form.Group>

    {/* رفع الصورة */}
    <Form.Group className="mb-3 col-12">
      <Form.Label>الصورة الشخصية</Form.Label>
      <div
        {...getRootProps()}
        className={`border rounded p-3 text-center ${isDragActive ? "bg-light" : ""}`}
        style={{ cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        {newUser.profile_picture ? (
          <>
            <p>{newUser.profile_picture.name}</p>
            <img
              src={URL.createObjectURL(newUser.profile_picture)}
              alt="Profile Preview"
              style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "10px", borderRadius: "10px" }}
            />
          </>
        ) : (
          <span>{t("usersPage.modal.dropzonePlaceholder") || "اسحب الصورة أو اضغط هنا للرفع"}</span>
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
            disabled={saving}
            style={{
              borderRadius: "50px",
              fontWeight: "600",
              width: "120px",
            }}
          >
            {t("common.cancel") || "إلغاء"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveUser}
            disabled={saving}
            style={{
              borderRadius: "50px",
              backgroundColor: "#003366",
              borderColor: "#003366",
              width: "120px",
              fontWeight: "600",
            }}
          >
            {saving ? (t("usersPage.modal.saving") || "جارٍ الحفظ...") : t("usersPage.modal.addButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;



/*
 
        <Accordion.Item eventKey="0" style={{ margin: "10px" }}>
          <Accordion.Header>{t("settings.language_settings.title")}</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
              <input
                type="text"
                className="form-control flex-grow-1 me-3"
                placeholder={t("settings.language_settings.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "400px", minWidth: "250px" }}
              />
              <button
                onClick={openAddModal}
                className="btn d-flex align-items-center px-4 py-2"
                style={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  height: "42px",
                  borderRadius: "100px",
                  backgroundColor: "#5085c1ff",
                  color: "white",
                  width: "100%",
                  maxWidth: "200px",
                }}
              >
                <FaPlus className="me-2" />
                {t("settings.language_settings.add_button")}
              </button>
            </div>

            {filteredLanguages.length === 0 && (
              <p>{t("settings.language_settings.no_languages")}</p>
            )}

            {filteredLanguages.map((lang) => (
              <Row
                key={lang.id}
                className="mb-2 align-items-center"
                style={{
                  backgroundColor: "#e9e7e766",
                  padding: "12px 20px",
                  borderRadius: "5px",
                  color: "#4586cbff",
                  fontWeight: 500,
                }}
              >
                <Col md={4}>{lang.name} ({lang.code})</Col>
                <Col md={3}>{lang.direction}</Col>
                <Col md={2}>
                  {lang.is_default && <strong>{t("settings.language_settings.default")}</strong>}
                </Col>
                <Col md={3} className="text-end d-flex justify-content-end gap-2">
                  {!lang.is_default && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleSetDefault(lang.id)}
                      title={t("settings.language_settings.set_default")}
                    >
                      {t("settings.language_settings.set_default")}
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openEditModal(lang)}
                  >
                    <FaEdit className="me-1" />
                    {t("settings.actions.edit")}
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteLanguage(lang.id)}
                  >
                    <FaTrash className="me-1" />
                    {t("settings.actions.delete")}
                  </Button>
                </Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>
*/
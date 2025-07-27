import React, { useState } from "react";
import { FaPlus, FaRegEdit, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import { Button, Form, Modal, Table } from "react-bootstrap";
  import { FaCalendarAlt , FaFileAlt} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { t } from "i18next";


const Users = () => {
const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", role: "" });
  const [formErrors, setFormErrors] = useState({});

  const rolesList = ["Admin", "Editor", "Viewer", "Moderator"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newUser.name) errors.name = "Name is required.";
    if (!newUser.email) errors.email = "Email is required.";
    if (!newUser.phone) errors.phone = "Phone number is required.";
    if (!newUser.role) errors.role = "Role is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    console.log("Saving user:", newUser);
    setShowModal(false);
    setNewUser({ name: "", email: "", phone: "", role: "" });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    result: "",
    gender: "",
    age: "",
    date: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const users = [
    {
      caseId: "C001",
      userId: "U123",
      area: "Gaza",
      registrationDate: "2025-06-01",
      aiResult: "Positive",
      country: "Palestine",
      gender: "Male",
      age: 35,
    },
    {
      caseId: "C002",
      userId: "U456",
      area: "Ramallah",
      registrationDate: "2025-06-10",
      aiResult: "Negative",
      country: "Palestine",
      gender: "Female",
      age: 29,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const countryMatch = filters.country ? user.country === filters.country : true;
    const resultMatch = filters.result ? user.aiResult === filters.result : true;
    const genderMatch = filters.gender ? user.gender === filters.gender : true;
    const ageMatch = filters.age ? user.age === parseInt(filters.age) : true;
    const dateMatch = filters.date ? user.registrationDate === filters.date : true;

    return searchMatch && countryMatch && resultMatch && genderMatch && ageMatch && dateMatch;
  });

const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 5;


const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

return (
    <div className="container mt-4" style={{ padding: "30px", backgroundColor: "white", borderRadius: "5px" }}>
      {/* Search + Add */}
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder={t("usersPage.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
        <button
          onClick={() => setShowModal(true)}
          className="btn d-flex align-items-center px-4 py-2"
          style={{
            fontWeight: 600,
            fontSize: '0.8rem',
            height: '42px',
            borderRadius: '100px',
            backgroundColor: '#4a90e2',
            color: 'white',
            width: '100%',
            maxWidth: '200px',
          }}
        >
          <FaPlus className="me-2" />
          {t("usersPage.addNewUser")}
        </button>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
          >
            <option value="">{t("usersPage.filters.country")}</option>
            <option value="Palestine">{t("usersPage.filters.countryOptions.palestine")}</option>
            <option value="Jordan">{t("usersPage.filters.countryOptions.jordan")}</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.result}
            onChange={(e) => handleFilterChange("result", e.target.value)}
          >
            <option value="">{t("usersPage.filters.result")}</option>
            <option value="Positive">{t("usersPage.filters.resultOptions.positive")}</option>
            <option value="Negative">{t("usersPage.filters.resultOptions.negative")}</option>
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
          <div className="position-relative" style={{ width: "42px", height: "42px", border: "1px solid #ccc", borderRadius: "9px", backgroundColor: "white" }}>
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

      {/* Table */}
      <div className="table-responsive shadow-sm rounded" style={{ border: "1px solid #e3e6f0" }}>
        <Table hover responsive className="mb-0" style={{ borderCollapse: "separate", borderSpacing: "0 10px", minWidth: "700px", fontSize: "0.95rem" }}>
          <thead className="text-center" style={{ backgroundColor: '#f0f0f0', color: '#4a4a4a' }}>
            <tr>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.caseId")}</th>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.userId")}</th>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.area")}</th>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.registrationDate")}</th>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.aiResult")}</th>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.aiTest")}</th>
              <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>{t("usersPage.tableHeaders.options")}</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                    margin: "10px",
                    display: "table-row",
                  }}
                >
                  <td className="py-3" style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                    {user.caseId}
                  </td>
                  <td className="py-3">{user.userId}</td>
                  <td className="py-3">{user.area}</td>
                  <td className="py-3">{user.registrationDate}</td>
                  <td className="py-3">
                    <span className={user.aiResult === "Positive" ? "badge bg-danger" : "badge bg-success"}>
                      {user.aiResult}
                    </span>
                  </td>
                  <td>
                    <FaFileAlt
                      style={{ cursor: "pointer", color: "#4a90e2", fontSize: "22px" }}
                      onClick={() => navigate("/ai-test")}
                      title={t("usersPage.tooltips.goToAiTestDetails")}
                    />
                  </td>
                  <td className="py-3" style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm" title={t("usersPage.tooltips.edit")}>
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm"
                        title={t("usersPage.tooltips.info")}
                        onClick={() => navigate(`/user-details/${user.userId}`)}
                      >
                        <FaCircleInfo />
                      </button>
                      <button className="btn btn-sm" title={t("usersPage.tooltips.delete")}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4">
                  {t("usersPage.noUsersFound")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal Add New User */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("usersPage.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">{t("usersPage.modal.fillFields")}</p>
          <h6 className="mb-4"><strong>{t("usersPage.modal.dateLabel")} {new Date().toLocaleDateString()}</strong></h6>
          <hr />
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t("usersPage.modal.formLabels.userName")}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder={t("usersPage.modal.formPlaceholders.userName")}
                value={newUser.name}
                onChange={handleInputChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">{formErrors.name || t("usersPage.modal.validationErrors.nameRequired")}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("usersPage.modal.formLabels.phoneNumber")}</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder={t("usersPage.modal.formPlaceholders.phoneNumber")}
                value={newUser.phone}
                onChange={handleInputChange}
                isInvalid={!!formErrors.phone}
              />
              <Form.Control.Feedback type="invalid">{formErrors.phone || t("usersPage.modal.validationErrors.phoneRequired")}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("usersPage.modal.formLabels.emailAddress")}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t("usersPage.modal.formPlaceholders.emailAddress")}
                value={newUser.email}
                onChange={handleInputChange}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">{formErrors.email || t("usersPage.modal.validationErrors.emailRequired")}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("usersPage.modal.formLabels.role")}</Form.Label>
              <Form.Select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                isInvalid={!!formErrors.role}
              >
                <option value="">{t("usersPage.modal.formPlaceholders.role")}</option>
                {rolesList.map((role, index) => (
                  <option key={index} value={role}>{t(`usersPage.modal.roles.${role.toLowerCase()}`)}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{formErrors.role || t("usersPage.modal.validationErrors.roleRequired")}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            onClick={handleSave}
            style={{ borderRadius: "50px", backgroundColor: "#003366", borderColor: "#003366", width: "120px", fontWeight: "600" }}
          >
            {t("usersPage.modal.addButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
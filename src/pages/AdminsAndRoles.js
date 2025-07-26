import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Pagination,
  Modal,
  Form,
} from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

const roles = ["Super Admin", "Admin", "Moderator", "Viewer"];

const AdminsAndRolesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Ahmed Khalil",
      email: "ahmed@example.com",
      role: "Super Admin",
    },
    {
      id: 2,
      name: "Fatima Zahra",
      email: "fatima@example.com",
      role: "Admin",
    },
    {
      id: 3,
      name: "Omar Ali",
      email: "omar@example.com",
      role: "Moderator",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: roles[0],
  });

  // Filter admins by search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handlers for modal open/close and input changes
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
    if (window.confirm("Are you sure you want to delete this admin?")) {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (isEditing) {
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === formData.id ? { ...formData } : admin
        )
      );
    } else {
      setAdmins((prev) => [
        ...prev,
        { ...formData, id: Date.now() },
      ]);
    }
    setShowModal(false);
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
          placeholder="Search by name or email"
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
          Add New Admin
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
              <th style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>Actions</th>
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
                  <td className="py-3">{admin.role}</td>
                  <td className="py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => openEditModal(admin)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(admin.id)}>
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4">
                  No admins found.
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
          <Modal.Title>{isEditing ? "Edit Admin" : "Add New Admin"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="adminName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminRole">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleInputChange}>
                {roles.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption}
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
            {isEditing ? "Save Changes" : "Add Admin"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminsAndRolesPage;

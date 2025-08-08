import { t } from "i18next";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button, Form, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const ColoredCircle = ({ color }) => (
  <div
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: color,
      margin: "0 auto",
    }}
  />
);

const AreaCard = ({ name, totalUsers, redCount, greenCount, yellowCount }) => (
  <div
    style={{
      background: "linear-gradient(to top, white, #c5e2f45b)",
      borderRadius: "10px",
      padding: "15px",
      height: "200px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid #b8b1b1",
      cursor: "pointer",
      transition: "box-shadow 0.3s ease",
    }}
    className="area-card"
  >
    <div style={{ padding: "10px" }}>
      <Row className="align-items-center mb-3">
        <Col>
          <h5 style={{ fontWeight: "700", fontSize: "1.3rem" }}>{name}</h5>
        </Col>
        <Col className="text-end">
          <span style={{ fontWeight: "600" }}>
            <span style={{ color: "#b8b1b1" }}>{t("area.Total_Users")}</span>
            <br />
            {totalUsers}
          </span>
        </Col>
      </Row>

      <Row className="text-center">
        <Col>
          <ColoredCircle color="#e74c3c" />
          <div>{redCount}</div>
        </Col>
        <Col>
          <ColoredCircle color="#27ae60" />
          <div>{greenCount}</div>
        </Col>
        <Col>
          <ColoredCircle color="#f1c40f" />
          <div>{yellowCount}</div>
        </Col>
      </Row>
    </div>
  </div>
);

const AreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [newAreaData, setNewAreaData] = useState({
    name: "",
    description: "",
    map_image: null,
    flag_image: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/areas")
      .then((res) => res.json())
      .then((data) => setAreas(data))
      .catch((err) => console.error("Failed to fetch areas:", err));
  }, []);

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleAreas = filteredAreas.slice(0, visibleCount);

  const handleMoreClick = () => {
    setVisibleCount((prev) => Math.min(prev + 3, filteredAreas.length));
  };

  const openAddModal = () => {
    setNewAreaData({
      name: "",
      description: "",
      map_image: null,
      flag_image: null,
    });
    setShowModal(true);
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewAreaData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewAreaData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveNewArea = () => {
    if (!newAreaData.name.trim()) {
      alert(t("area.Enter_area_name"));
      return;
    }

    const formData = new FormData();
    formData.append("name", newAreaData.name.trim());
    formData.append("description", newAreaData.description.trim());
    if (newAreaData.map_image) {
      formData.append("map_image", newAreaData.map_image);
    }
    if (newAreaData.flag_image) {
      formData.append("flag_image", newAreaData.flag_image);
    }

    fetch("http://localhost:8000/api/areas", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add area");
        return res.json();
      })
      .then((newArea) => {
        setAreas((prev) => [newArea, ...prev]);
        setShowModal(false);
        setVisibleCount((prev) => prev + 1);
        setSuccessMessage("تمت إضافة المنطقة بنجاح!");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <Container className="my-4" style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}>
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder={t("area.Search")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(3);
          }}
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
            backgroundColor: "#4a90e2",
            color: "white",
            width: "100%",
            maxWidth: "200px",
          }}
        >
          <FaPlus className="me-2" />
          {t("area.Add_New_Area")}
        </button>
      </div>

      <Row className="g-3">
        {visibleAreas.length > 0 ? (
          visibleAreas.map((area) => (
            <Col md={4} key={area.id}>
              <AreaCard
                name={area.name}
                totalUsers={area.totalUsers || 0}
                redCount={area.redCount || 0}
                greenCount={area.greenCount || 0}
                yellowCount={area.yellowCount || 0}
              />
            </Col>
          ))
        ) : (
          <p className="text-center w-100">{t("area.No_areas_found")}</p>
        )}
      </Row>

      {visibleCount < filteredAreas.length && (
        <div
          style={{
            textAlign: "center",
            color: "black",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "20px",
            userSelect: "none",
            fontSize: "1.5rem",
          }}
          onClick={handleMoreClick}
        >
          {t("area.More")}
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("area.Add_New_Area")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="areaName">
              <Form.Label>{t("area.Area_Name")}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newAreaData.name}
                onChange={handleInputChange}
                placeholder={t("area.Enter_area_name")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>{t("area.Description")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newAreaData.description}
                onChange={handleInputChange}
                placeholder={t("area.Enter_description")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Map Image</Form.Label>
              <Form.Control
                type="file"
                name="map_image"
                accept="image/*"
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Flag Image</Form.Label>
              <Form.Control
                type="file"
                name="flag_image"
                accept="image/*"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            style={{ borderRadius: "50px", width: "140px", fontWeight: "600" }}
            onClick={handleSaveNewArea}
          >
            {t("area.Add_Area")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AreasPage;

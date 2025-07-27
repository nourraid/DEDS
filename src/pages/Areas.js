import { t } from "i18next";
import React, { useState } from "react";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
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
  const initialAreas = [
    { id: 1, name: "Al-Rimal", totalUsers: 120, redCount: 5, greenCount: 100, yellowCount: 15 },
    { id: 2, name: "Al-Shuja'iya", totalUsers: 90, redCount: 7, greenCount: 70, yellowCount: 13 },
    { id: 3, name: "Deir al-Balah", totalUsers: 60, redCount: 2, greenCount: 50, yellowCount: 8 },
    { id: 4, name: "Jabalia", totalUsers: 80, redCount: 6, greenCount: 65, yellowCount: 9 },
    { id: 5, name: "Beach Camp", totalUsers: 55, redCount: 3, greenCount: 45, yellowCount: 7 },
    { id: 6, name: "Nuseirat", totalUsers: 40, redCount: 1, greenCount: 30, yellowCount: 9 },
  ];

  const [areas, setAreas] = useState(initialAreas);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const [showModal, setShowModal] = useState(false);
  const [newAreaData, setNewAreaData] = useState({
    name: "",
    totalUsers: "",
    redCount: "",
    greenCount: "",
    yellowCount: "",
  });

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
      totalUsers: "",
      redCount: "",
      greenCount: "",
      yellowCount: "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAreaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewArea = () => {
    const { name, totalUsers, redCount, greenCount, yellowCount } = newAreaData;

    if (!name.trim()) {
      alert(t("area.Enter_area_name"));
      return;
    }

    if (
      [totalUsers, redCount, greenCount, yellowCount].some(
        (val) => val === "" || isNaN(val) || Number(val) < 0
      )
    ) {
      alert("Please enter valid non-negative numbers.");
      return;
    }

    const newArea = {
      id: Date.now(),
      name: name.trim(),
      totalUsers: Number(totalUsers),
      redCount: Number(redCount),
      greenCount: Number(greenCount),
      yellowCount: Number(yellowCount),
    };

    setAreas((prev) => [newArea, ...prev]);
    setShowModal(false);
    setVisibleCount((prev) => prev + 1);
  };

  return (
    <Container className="my-4" style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}>
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
          visibleAreas.map((area) => <Col md={4} key={area.id}><AreaCard {...area} /></Col>)
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

            <Form.Group className="mb-3" controlId="totalUsers">
              <Form.Label>{t("area.Total_Users")}</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="totalUsers"
                value={newAreaData.totalUsers}
                onChange={handleInputChange}
                placeholder={t("area.Enter_total_users")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="redCount">
              <Form.Label>{t("area.Red_Count")}</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="redCount"
                value={newAreaData.redCount}
                onChange={handleInputChange}
                placeholder={t("area.Enter_red_count")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="greenCount">
              <Form.Label>{t("area.Green_Count")}</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="greenCount"
                value={newAreaData.greenCount}
                onChange={handleInputChange}
                placeholder={t("area.Enter_green_count")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="yellowCount">
              <Form.Label>{t("area.Yellow_Count")}</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="yellowCount"
                value={newAreaData.yellowCount}
                onChange={handleInputChange}
                placeholder={t("area.Enter_yellow_count")}
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

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
      border:"1px solid #b8b1b1", 
    }}
  >
    <div style={{padding:"10px"}}>
      <Row className="align-items-center mb-3">
        <Col>
          <h5 style={{ fontWeight: "700", fontSize: "1.3rem" }}>{name}</h5>
        </Col>
        <Col className="text-end">
          <span style={{ fontWeight: "600" }}><span style={{color:"#b8b1b1"}}>Total User</span><br></br>{totalUsers}</span>
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
  const allAreas = [
    { id: 1, name: "Al-Rimal", totalUsers: 120, redCount: 5, greenCount: 100, yellowCount: 15 },
    { id: 2, name: "Al-Shuja'iya", totalUsers: 90, redCount: 7, greenCount: 70, yellowCount: 13 },
    { id: 3, name: "Deir al-Balah", totalUsers: 60, redCount: 2, greenCount: 50, yellowCount: 8 },
    { id: 4, name: "Jabalia", totalUsers: 80, redCount: 6, greenCount: 65, yellowCount: 9 },
    { id: 5, name: "Beach Camp", totalUsers: 55, redCount: 3, greenCount: 45, yellowCount: 7 },
    { id: 6, name: "Nuseirat", totalUsers: 40, redCount: 1, greenCount: 30, yellowCount: 9 },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredAreas = allAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleAreas = filteredAreas.slice(0, visibleCount);

  const handleMoreClick = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredAreas.length));
  };

  return (
    <Container className="my-4" style={{backgroundColor:"white", padding:"30px" , borderRadius:"10px"}}>
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap">
        <input
          type="text"
          className="form-control flex-grow-1 me-3"
          placeholder="Search here"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setVisibleCount(3);
          }}
          style={{ maxWidth: "400px", minWidth: "250px" }}
        />
        <button
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
          Add New Area
        </button>
      </div>

      <Row className="g-3">
        {visibleAreas.length > 0 ? (
          visibleAreas.map(area => (
            <Col md={4} key={area.id}>
              <AreaCard {...area} />
            </Col>
          ))
        ) : (
          <p className="text-center w-100">No areas found.</p>
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
          More..
        </div>
      )}
    </Container>
  );
};

export default AreasPage;

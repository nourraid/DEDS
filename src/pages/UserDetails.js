import React from "react";
import { Accordion, Row, Col, Image } from "react-bootstrap";

const InfoRow = ({ label, value, isImage = false }) => (
  <Row className="mb-2">
    <Col md={4}><strong>{label}</strong></Col>
    <Col
      md={8}
      style={{
        backgroundColor: "#e9e7e766",
        padding: "18px",
        borderRadius: "5px",
        color: isImage ? "inherit" : "#4586cbff",
      }}
    >
      {isImage ? <Image src={value} roundedCircle width={100} /> : value}
    </Col>
  </Row>
);

const SingleColRow = ({ label }) => (
  <Row className="mb-2">
    <Col md={12}><strong>{label}</strong></Col>
  </Row>
);

const SingleColValue = ({ value }) => (
  <Row className="mb-2">
    <Col
      md={12}
      style={{
        backgroundColor: "#e9e7e766",
        padding: "18px",
        borderRadius: "5px",
        color: "#4586cbff",
      }}
    >
      <strong>{value}</strong>
    </Col>
  </Row>
);

const HalfColRow = ({ label, value }) => (
  <>
    <Row className="mb-2">
      <Col md={4}><strong>{label}</strong></Col>
    </Row>
    <Row className="mb-2">
      <Col
        md={4}
        style={{
          backgroundColor: "#e9e7e766",
          padding: "18px",
          borderRadius: "5px",
          color: "#4586cbff",
        }}
      >
        <strong>{value}</strong>
      </Col>
    </Row>
  </>
);

const UserDetailsAccordion = () => {
  return (
    <div
      className="container my-4"
      style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px" }}
    >
      {/* Medical Information */}
      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Medical Information</Accordion.Header>
          <Accordion.Body>
            <SingleColRow label="Diseases user have" />
            <SingleColValue value="Diabetes Disease" />
            <SingleColValue value="Diabetes" />

            <SingleColRow label="Are there Kidney disease patients in the family?" />
            <HalfColRow label="" value="Yes" />

            <HalfColRow label="Are there heart disease patients in the family?" value="Yes" />
            <HalfColRow label="Have you ever had a Kidney test?" value="Yes" />

            <HalfColRow label="User other comments" value="No comments" />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* General Information */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>General Information</Accordion.Header>
          <Accordion.Body>
            <InfoRow label="Profile Picture" value="https://via.placeholder.com/100" isImage />
            <InfoRow label="Full Name" value="John Doe" />
            <InfoRow label="Email" value="john@example.com" />
            <InfoRow label="ID Number" value="123456789" />
            <InfoRow label="Phone" value="+972 599 000 000" />
            <InfoRow label="Date of Birth" value="1990-01-01" />
            <InfoRow label="Gender" value="Male" />
            <InfoRow label="Blood Type" value="O+" />
            <InfoRow label="Country" value="Palestine" />
            <InfoRow label="City" value="Gaza" />
            <InfoRow label="Area" value="Al-Rimal" />
            <InfoRow label="Street" value="Main Street" />
            <InfoRow label="Building Number" value="12" />
            <InfoRow label="Weight" value="70kg" />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default UserDetailsAccordion;

import React from "react";
import { Accordion, Row, Col, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
    {label && (
      <Row className="mb-2">
        <Col md={4}><strong>{label}</strong></Col>
      </Row>
    )}
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
  const { t } = useTranslation();

  return (
    <div
      className="container my-4"
      style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px" }}
    >
      {/* Medical Information */}
      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("user.medical_info.title")}</Accordion.Header>
          <Accordion.Body>
            <SingleColRow label={t("user.medical_info.diseases")} />
            <SingleColValue value={t("user.medical_info.diabetes1")} />
            <SingleColValue value={t("user.medical_info.diabetes2")} />

            <SingleColRow label={t("user.medical_info.kidney_family")} />
            <HalfColRow value={t("user.general.yes")} />

            <HalfColRow label={t("user.medical_info.heart_family")} value={t("user.general.yes")} />
            <HalfColRow label={t("user.medical_info.kidney_test")} value={t("user.general.yes")} />
            <HalfColRow label={t("user.medical_info.comments")} value={t("user.medical_info.no_comments")} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* General Information */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("user.general_info.title")}</Accordion.Header>
          <Accordion.Body>
            <InfoRow label={t("user.general_info.profile_picture")} value="https://via.placeholder.com/100" isImage />
            <InfoRow label={t("user.general_info.full_name")} value="John Doe" />
            <InfoRow label={t("user.general_info.email")} value="john@example.com" />
            <InfoRow label={t("user.general_info.id_number")} value="123456789" />
            <InfoRow label={t("user.general_info.phone")} value="+972 599 000 000" />
            <InfoRow label={t("user.general_info.dob")} value="1990-01-01" />
            <InfoRow label={t("user.general_info.gender")} value="Male" />
            <InfoRow label={t("user.general_info.blood_type")} value="O+" />
            <InfoRow label={t("user.general_info.country")} value="Palestine" />
            <InfoRow label={t("user.general_info.city")} value="Gaza" />
            <InfoRow label={t("user.general_info.area")} value="Al-Rimal" />
            <InfoRow label={t("user.general_info.street")} value="Main Street" />
            <InfoRow label={t("user.general_info.building_number")} value="12" />
            <InfoRow label={t("user.general_info.weight")} value="70kg" />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default UserDetailsAccordion;

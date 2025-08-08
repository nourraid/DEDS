import React, { useEffect, useState } from "react";
import { Accordion, Row, Col, Image, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useParams } from "react-router-dom";

const InfoRow = ({ label, value, isImage = false }) => {
  const baseURL = "http://localhost:8000/storage/"; // عدّلي هذا حسب رابط السيرفر الحقيقي

  const imageUrl = value ? `${baseURL}${value}` : "/default-profile.png";

  return (
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
        {isImage ? (
          <Image
            src={imageUrl}
            alt="Profile"
            roundedCircle
            width={100}
            height={100}
            fluid
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-profile.png";
            }}
          />
        ) : (
          value || "-"
        )}
      </Col>
    </Row>
  );
};



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
  const { id } = useParams(); // جلب id من URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/users/${id}`)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  if (!userData || !userData.user) {
    return <div className="text-center py-5">User not found...</div>;
  }

  const { user, medical_info } = userData;

  
  return (
    <div className="container my-4" style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px" }}>
      {/* Medical Info */}
      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("user.medical_info.title")}</Accordion.Header>
          <Accordion.Body>
            <SingleColRow label={t("user.medical_info.diseases")} />
            <SingleColValue value={`${t("user.medical_info.diabetes1")}: ${medical_info?.has_diabetes ? t("user.general.yes") : t("user.general.no")}`} />
            <SingleColValue value={`${t("user.medical_info.kidney_test")}: ${medical_info?.kidney_disease ? t("user.general.yes") : t("user.general.no")}`} />
            <SingleColValue value={`${t("user.medical_info.uti_infection")}: ${medical_info?.uti_infection ? t("user.general.yes") : t("user.general.no")}`} />

            <HalfColRow label={t("user.medical_info.comments")} value={medical_info?.comments || t("user.general.no_comments")} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* General Info */}
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("user.general_info.title")}</Accordion.Header>
          <Accordion.Body>
            <InfoRow label={t("user.general_info.profile_picture")} value={<ProfileImage src={user.profile_picture} />} />
            <InfoRow label={t("user.general_info.full_name")} value={user.name} />
            <InfoRow label={t("user.general_info.email")} value={user.email} />
            <InfoRow label={t("user.general_info.id_number")} value={user.id_number} />
            <InfoRow label={t("user.general_info.phone")} value={user.phone} />
            <InfoRow label={t("user.general_info.dob")} value={user.dob || "-"} />
            <InfoRow label={t("user.general_info.gender")} value={user.gender} />
            <InfoRow label={t("user.general_info.blood_type")} value={user.blood_type} />
            <InfoRow label={t("user.general_info.country")} value={user.country} />
            <InfoRow label={t("user.general_info.city")} value={user.city} />
            <InfoRow label={t("user.general_info.street")} value={user.street} />
            <InfoRow label={t("user.general_info.building_number")} value={user.building_number} />
            <InfoRow label={t("user.general_info.weight")} value={`${user.weight}kg`} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

const ProfileImage = ({ src }) => {
  const imageSrc = src ? `/storage/${src}` : "/images/default-profile.png";

  return (
    <img
      src={imageSrc}
      alt="Profile"
      width={100}
      height={100}
      style={{ borderRadius: "50%", objectFit: "cover" }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/images/default-profile.png";
      }}
    />
  );
};

export default UserDetailsAccordion;

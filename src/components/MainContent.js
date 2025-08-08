import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { FaChevronRight, FaMars, FaVenus } from "react-icons/fa";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CountryCard = ({ area, onClick }) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className="card shadow-sm p-3 position-relative h-100"
    >
      <div
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
        className="d-flex align-items-center mb-3"
      >
        <img
          src={area.flag_image}
          alt={`${area.name} flag`}
          className="rounded-circle me-2"
          width="32"
          height="32"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-flag.png";
          }}
        />
        <h6 className="mb-0">{area.name}</h6>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center mb-3" style={{ gap: "8px" }}>
            <span
              className="rounded-circle"
              style={{ width: 12, height: 12, backgroundColor: "#EB5757" }}
            ></span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                {area.redCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                {t("Need medical follow-up ASAP")}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center mb-3" style={{ gap: "8px" }}>
            <span
              className="rounded-circle"
              style={{ width: 12, height: 12, backgroundColor: "#27AE60" }}
            ></span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                {area.greenCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                {t("No need")}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center mb-3" style={{ gap: "8px" }}>
            <span
              className="rounded-circle"
              style={{ width: 12, height: 12, backgroundColor: "#F2C94C" }}
            ></span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                {area.yellowCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                {t("Need medical follow-up")}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <img
            src={area.map_image}
            alt={`${area.name} map`}
            width="80"
            style={{ opacity: 0.7 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-map.png";
            }}
          />
          <div className="mt-2">
            <strong>{area.totalUsers}</strong>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              {t("dashboard.totalUsers")}
            </div>
          </div>
        </div>
      </div>

      <FaChevronRight
        style={{
          borderRadius: "50%",
          border: "1px solid #ccc",
          padding: "6px",
          backgroundColor: "#fff",
          width: "32px",
          height: "32px",
        }}
        className="position-absolute top-0 end-0 m-2 text-secondary"
      />
    </div>
  );
};

function MainContent() {
  const { t } = useTranslation();
  const [areas, setAreas] = useState([]);
  const [period, setPeriod] = useState("Last 6 Months");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [siteSummary, setSiteSummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // جلب بيانات المناطق
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setAreas(data.slice(0, 6)); // عرض أول 6 فقط
        if (data.length > 0) setSelectedCountry(data[0].id);
      })
      .catch((err) => console.error("Error fetching areas:", err));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      // جلب بيانات المستخدمين الشهريين
      fetch(
        `http://localhost:8000/api/dashboard/monthly-users?area_id=${selectedCountry}&period=${
          period === "Last 12 Months" ? "last12" : "last6"
        }`
      )
        .then((res) => res.json())
        .then((data) => setMonthlyData(data))
        .catch((err) => console.error("Error fetching monthly data:", err));

      // جلب ملخص الموقع
      fetch("http://localhost:8000/api/dashboard/site-summary")
        .then((res) => res.json())
        .then((data) => setSiteSummary(data))
        .catch((err) => console.error("Error fetching site summary:", err));
    }
  }, [selectedCountry, period]);

  const handleCardClick = (area) => {
    navigate(`/area/${area.id}`);
  };

  return (
    <div className="container mt-4">
      {/* بطاقات المناطق */}
      <div className="row g-3 mb-4">
        {areas.map((area, idx) => (
          <div key={idx} className="col-md-4">
            <CountryCard area={area} onClick={() => handleCardClick(area)} />
          </div>
        ))}
      </div>

      {/* الفلاتر */}
      <div className="d-flex gap-3 mb-3 align-items-center">
        <Form.Select
          style={{ width: "200px" }}
          value={selectedCountry || ""}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          style={{ width: "200px" }}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="Last 6 Months">{t("dashboard.last6Months")}</option>
          <option value="Last 12 Months">{t("dashboard.last12Months")}</option>
        </Form.Select>
      </div>

      {/* الرسم البياني */}
      <div className="row" style={{ alignItems: "stretch" }}>
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="card shadow-sm p-3 mb-4">
            <h6>{t("dashboard.monthlyUsers")}</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" barSize={20} radius={[10, 10, 10, 10]}>
                  {monthlyData.map((entry) => (
                    <Cell
                      key={entry.month}
                      fill={entry?.isCurrentMonth ? "#F2994A" : "#2F80ED"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ملخص الموقع */}
        <div className="col-lg-4 col-md-12">
          <div className="card shadow-sm p-4 h-100 d-flex flex-column justify-content-center">
            <div className="row mb-4 text-center">
              <div className="col-6 px-3">
                <h6 className="text-muted">{t("dashboard.totalPatients")}</h6>
                <h4 className="fw-bold">{siteSummary.totalPatients || 0}</h4>
              </div>

              <div className="col-6 px-3">
                <h6 className="text-muted">{t("dashboard.completedTests")}</h6>
                <h4 className="fw-bold">{siteSummary.completedTests || 0}</h4>
              </div>
            </div>

            <div className="row text-center">
              <div className="col-6 d-flex align-items-center gap-2 px-3 justify-content-center">
                <FaMars className="text-primary fs-5" />
                <div>
                  <small className="text-muted">{t("dashboard.male")}</small>
                  <br />
                  <small className="fw-semibold">
                    {siteSummary.malePercent || 0}%
                  </small>
                </div>
              </div>
              <div className="col-6 d-flex align-items-center gap-2 px-3 justify-content-center">
                <FaVenus className="text-danger fs-5" />
                <div>
                  <small className="text-muted">{t("dashboard.female")}</small>
                  <br />
                  <small className="fw-semibold">
                    {siteSummary.femalePercent || 0}%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;

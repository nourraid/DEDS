import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { FaChevronRight, FaFemale, FaMale } from "react-icons/fa";
import { Form } from "react-bootstrap";
import { FaMars, FaVenus, FaChild } from "react-icons/fa";

const countriesData = [
  {
    country: "KSA",
    stats: [
      { color: "#EB5757", title: "Female Patients", value: 1546 },
      { color: "#27AE60", title: "Male Patients", value: 1780 },
      { color: "#F2C94C", title: "Other", value: 320 },
    ],
    totalUsers: 3646,
  },
    {
    country: "KSA",
    stats: [
      { color: "#EB5757", title: "Female Patients", value: 1546 },
      { color: "#27AE60", title: "Male Patients", value: 1780 },
      { color: "#F2C94C", title: "Other", value: 320 },
    ],
    totalUsers: 3646,
  },
    {
    country: "KSA",
    stats: [
      { color: "#EB5757", title: "Female Patients", value: 1546 },
      { color: "#27AE60", title: "Male Patients", value: 1780 },
      { color: "#F2C94C", title: "Other", value: 320 },
    ],
    totalUsers: 3646,
  },
    {
    country: "KSA",
    stats: [
      { color: "#EB5757", title: "Female Patients", value: 1546 },
      { color: "#27AE60", title: "Male Patients", value: 1780 },
      { color: "#F2C94C", title: "Other", value: 320 },
    ],
    totalUsers: 3646,
  },
  {
    country: "UAE",
    stats: [
      { color: "#EB5757", title: "Female Patients", value: 1200 },
      { color: "#27AE60", title: "Male Patients", value: 1600 },
      { color: "#F2C94C", title: "Other", value: 400 },
    ],
    totalUsers: 3200,
  },
  {
    country: "Egypt",
    stats: [
      { color: "#EB5757", title: "Female Patients", value: 1100 },
      { color: "#27AE60", title: "Male Patients", value: 1400 },
      { color: "#F2C94C", title: "Other", value: 350 },
    ],
    totalUsers: 2850,
  },
];

// بيانات المستخدم الشهري لكل دولة
const dataPerMonth = {
  KSA: {
    "Last 6 Months": [
      { month: "Mar", users: 120 },
      { month: "Apr", users: 180 },
      { month: "May", users: 150 },
      { month: "Jun", users: 200 },
      { month: "Jul", users: 240 },
      { month: "Aug", users: 210 },
    ],
    "Last 12 Months": [
      { month: "Sep", users: 100 },
      { month: "Oct", users: 130 },
      { month: "Nov", users: 170 },
      { month: "Dec", users: 190 },
      { month: "Jan", users: 200 },
      { month: "Feb", users: 220 },
      { month: "Mar", users: 250 },
      { month: "Apr", users: 260 },
      { month: "May", users: 230 },
      { month: "Jun", users: 280 },
      { month: "Jul", users: 300 },
      { month: "Aug", users: 310 },
    ],
  },
  UAE: {
    "Last 6 Months": [
      { month: "Mar", users: 100 },
      { month: "Apr", users: 140 },
      { month: "May", users: 130 },
      { month: "Jun", users: 180 },
      { month: "Jul", users: 210 },
      { month: "Aug", users: 190 },
    ],
    "Last 12 Months": [
      { month: "Sep", users: 90 },
      { month: "Oct", users: 120 },
      { month: "Nov", users: 160 },
      { month: "Dec", users: 180 },
      { month: "Jan", users: 190 },
      { month: "Feb", users: 210 },
      { month: "Mar", users: 230 },
      { month: "Apr", users: 240 },
      { month: "May", users: 220 },
      { month: "Jun", users: 260 },
      { month: "Jul", users: 270 },
      { month: "Aug", users: 280 },
    ],
  },
  Egypt: {
    "Last 6 Months": [
      { month: "Mar", users: 80 },
      { month: "Apr", users: 120 },
      { month: "May", users: 110 },
      { month: "Jun", users: 160 },
      { month: "Jul", users: 190 },
      { month: "Aug", users: 170 },
    ],
    "Last 12 Months": [
      { month: "Sep", users: 70 },
      { month: "Oct", users: 100 },
      { month: "Nov", users: 140 },
      { month: "Dec", users: 160 },
      { month: "Jan", users: 170 },
      { month: "Feb", users: 190 },
      { month: "Mar", users: 210 },
      { month: "Apr", users: 220 },
      { month: "May", users: 200 },
      { month: "Jun", users: 240 },
      { month: "Jul", users: 250 },
      { month: "Aug", users: 260 },
    ],
  },
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CountryCard = ({ country, stats, totalUsers }) => (
  <div className="card shadow-sm p-3 position-relative h-100">
    <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }} className="d-flex align-items-center mb-3">
      <img
        src={`/images/${country.toLowerCase()}-flag.png`}
        alt="flag"
        className="rounded-circle me-2"
        width="32"
        height="32"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/default-flag.png";
        }}
      />
      <h6 className="mb-0">{country}</h6>
    </div>

    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        {stats.map((item, idx) => (
          <div key={idx} className="d-flex align-items-center mb-3" style={{ gap: "8px" }}>
            <span
              className="rounded-circle"
              style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                display: "inline-block",
              }}
            ></span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                {item.value.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <img
          src={`/images/${country.toLowerCase()}-map.png`}
          alt="map"
          width="80"
          style={{ opacity: 0.7 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-map.png";
          }}
        />
        <div className="mt-2">
          <strong>{totalUsers.toLocaleString()}</strong>
          <div className="text-muted" style={{ fontSize: "0.85rem" }}>
            Total Users
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

function Areas() {
  const [period, setPeriod] = useState("Last 6 Months");
  const [selectedCountry, setSelectedCountry] = useState("KSA");
  const countryData = countriesData.find(c => c.country === selectedCountry);

  const currentMonth = monthNames[new Date().getMonth()];

  // بيانات الرسم حسب الدولة والفترة
  const data = dataPerMonth[selectedCountry][period];

  return (
    <div className="container mt-4">
      {/* بطاقات الدول */}
      <div className="row g-3 mb-4">
        {countriesData.map((item, idx) => (
          <div key={idx} className="col-md-4">
            <CountryCard {...item} />
          </div>
        ))}
      </div>

      {/* فلتر الدولة + فترة */}
      <div className="d-flex gap-3 mb-3 align-items-center">
        <Form.Select
          style={{ width: "200px" }}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countriesData.map(({ country }) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          style={{ width: "200px" }}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>Last 6 Months</option>
          <option>Last 12 Months</option>
        </Form.Select>
      </div>

      {/* الرسم البياني */}
      <div className="row" style={{ alignItems: "stretch" }}>
     <div  className="col-lg-8 col-md-12 mb-4">

                
        <div className="card shadow-sm p-3 mb-4">
                <h6>Monthly Users</h6>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" barSize={20} radius={[10, 10, 10, 10]}>
                      {data.map((entry) => (
                        <Cell
                          key={entry.month}
                          fill={entry.month === currentMonth ? "#F2994A" : "#2F80ED"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              </div>
    




<div className="col-lg-4 col-md-12">
  <div className="card shadow-sm p-4 h-100 d-flex flex-column justify-content-center">
    {/* Total Patients & Completed Tests */}
    <div className="row mb-4 text-center">
      <div className="col-6 px-3">
        <h6 className="text-muted">Total Patients</h6>
        <h4 className="fw-bold">
          {countryData?.stats.reduce((acc, s) => acc + s.value, 0)?.toLocaleString()}
        </h4>
        <div className="progress" style={{ height: 8, borderRadius: 10, overflow: "hidden" }}>
          <div
            className="progress-bar"
            style={{ backgroundColor: "#a9ddc5", width: `100%` }}
          ></div>
        </div>
      </div>

      <div className="col-6 px-3">
        <h6 className="text-muted">Completed Tests</h6>
        <h4 className="fw-bold">5000</h4>
        <div className="progress" style={{ height: 8, borderRadius: 10, overflow: "hidden" }}>
          <div
            className="progress-bar"
            style={{
              backgroundColor: "#79abc5",
              width: "50%"
            }}
          ></div>
        </div>
      </div>
    </div>

    {/* Gender Distribution */}
    <div className="row text-center">
      <div className="col-6 d-flex align-items-center gap-2 px-3 justify-content-center">
        <FaMars className="text-primary fs-5" />
        <div>
          <small className="text-muted">Male</small><br />
          <small className="fw-semibold">60%</small>
        </div>
      </div>
      <div className="col-6 d-flex align-items-center gap-2 px-3 justify-content-center">
        <FaVenus className="text-danger fs-5" />
        <div>
          <small className="text-muted">Female</small><br />
          <small className="fw-semibold">40%</small>
        </div>
      </div>
    </div>
  </div>
</div>



      </div>
 
         
    </div>
  );
}

export default Areas;

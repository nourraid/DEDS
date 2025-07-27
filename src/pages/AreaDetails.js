import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Table } from "react-bootstrap";
import {
  FaPlus,
  FaFileAlt,
  FaEdit,
  FaTrashAlt,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const COLORS = ["#EB5757", "#27AE60", "#F2C94C"];

function AreaPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    result: "",
    gender: "",
    age: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase());

      const countryMatch = filters.country
        ? user.country === filters.country
        : true;
      const resultMatch = filters.result ? user.aiResult === filters.result : true;
      const genderMatch = filters.gender ? user.gender === filters.gender : true;
      const ageMatch = filters.age ? user.age === parseInt(filters.age, 10) : true;
      const dateMatch = filters.date ? user.registrationDate === filters.date : true;

      return (
        searchMatch &&
        countryMatch &&
        resultMatch &&
        genderMatch &&
        ageMatch &&
        dateMatch
      );
    });
  }, [users, searchTerm, filters]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = useMemo(() => {
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, indexOfFirstUser, indexOfLastUser]);

  const countryData = location.state?.countryData;

  if (!countryData)
    return (
      <div className="text-center mt-5">{t("area_details.countryDataNotFound")}</div>
    );

  const pieData = countryData.stats.map(({ title, value }, index) => ({
    name: t(`area_details.stats_titles.${title}`, title),
    value,
    color: COLORS[index],
  }));

  return (
    <div className="container mt-4">
      {/* Statistics Card */}
      <div
        className="p-4 mb-5"
        style={{ backgroundColor: "white", borderRadius: "10px" }}
      >
        <h4 className="mb-2">
          {countryData.country} {t("area_details.Statistics")}
        </h4>
        <hr style={{ color: "#ccc" }} />

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch gap-4">
          <div
            style={{
              flex: "0 0 40%",
              borderRight: "1px solid #ddd",
              paddingRight: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                {countryData.stats.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center mb-3"
                    style={{ gap: "8px" }}
                  >
                    <span
                      className="rounded-circle"
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: COLORS[idx],
                        display: "inline-block",
                      }}
                    ></span>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                        {item.value.toLocaleString()}
                      </div>
                      <div>{t(`area_details.stats_titles.${item.title}`, item.title)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <img
                  src={`/images/${countryData.country.toLowerCase()}-map.png`}
                  alt="map"
                  width="180"
                  style={{ opacity: 0.7 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-map.png";
                  }}
                />
                <div className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
                  {t("area_details.Total_Users")}
                  <h5 className="mt-1 fw-bold">
                    {countryData.totalUsers.toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{ flex: "0 0 60%", minHeight: "320px" }}>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ height: "100%" }}
            >
              <div style={{ flex: "1 1 auto", position: "relative", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={100}
                      paddingAngle={4}
                      cornerRadius={10}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "40px" }}>
                    {countryData.totalUsers.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginLeft: "20px" }}>
                {pieData.map((entry, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center mb-2"
                    style={{ gap: "10px" }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: entry.color,
                        borderRadius: "50%",
                      }}
                    ></div>
                    <div style={{ fontSize: "0.9rem" }}>{entry.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filters and Table */}
      <div
        className="container mt-4"
        style={{ padding: "30px", backgroundColor: "white", borderRadius: "5px" }}
      >
        {/* Search + Add */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
          <input
            type="text"
            className="form-control flex-grow-1 me-3"
            placeholder={t("area_details.Search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "400px" }}
            aria-label={t("area_details.Search")}
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
            onClick={() => alert("Add New User clicked!")}
            aria-label={t("area_details.Add_New_User")}
          >
            <FaPlus className="me-2" />
            {t("area_details.Add_New_User")}
          </button>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          {[
            {
              label: t("area_details.Country"),
              key: "country",
              options: ["", "Palestine", "Jordan"].map(
                (c) => (c ? t(`area_details.countries.${c}`, c) : "")
              ),
            },
            {
              label: t("area_details.Result"),
              key: "result",
              options: ["", "Positive", "Negative"].map(
                (r) => (r ? t(`area_details.ai_results.${r}`, r) : "")
              ),
            },
            {
              label: t("area_details.Gender"),
              key: "gender",
              options: ["", "Male", "Female"].map(
                (g) => (g ? t(`area_details.genders.${g}`, g) : "")
              ),
            },
          ].map(({ label, key, options }) => (
            <div className="col-md-2" key={key}>
              <select
                className="form-select"
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                aria-label={`${t("area_details.Filter_by")} ${label}`}
              >
                {options.map((opt, idx) => (
                  <option key={idx} value={opt || ""}>
                    {opt || label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder={t("area_details.Age")}
              value={filters.age}
              onChange={(e) => handleFilterChange("age", e.target.value)}
              aria-label={t("area_details.Filter_by_Age")}
            />
          </div>
          <div className="col-md-1">
            <div
              className="position-relative"
              style={{
                width: "42px",
                height: "42px",
                border: "1px solid #ccc",
                borderRadius: "9px",
                backgroundColor: "white",
              }}
            >
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
                onClick={() => document.getElementById("date-picker")?.showPicker()}
                style={{ zIndex: 1, pointerEvents: "none", borderRadius: "8px" }}
                aria-label={t("area_details.Select_Date")}
              >
                <FaCalendarAlt />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          className="table-responsive shadow-sm rounded"
          style={{ border: "1px solid #e3e6f0" }}
        >
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
                {[
                  t("area_details.Case_ID"),
                  t("area_details.User_ID"),
                  t("area_details.Area"),
                  t("area_details.Registration_Date"),
                  t("area_details.AI_Result"),
                  t("area_details.AI_Test"),
                  t("area_details.Options"),
                ].map((header, idx) => (
                  <th
                    key={header}
                    className="py-3"
                    style={{
                      color: "#a8a5a5ff",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "none",
                      borderTopLeftRadius: idx === 0 ? "10px" : undefined,
                      borderBottomLeftRadius: idx === 0 ? "10px" : undefined,
                      borderTopRightRadius: idx === 6 ? "10px" : undefined,
                      borderBottomRightRadius: idx === 6 ? "10px" : undefined,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-center">
              {currentUsers.length > 0 ? (
                currentUsers.map((user, idx) => (
                  <tr
                    key={user.userId}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                      boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <td
                      className="py-3"
                      style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}
                    >
                      {user.caseId}
                    </td>
                    <td className="py-3">{user.userId}</td>
                    <td className="py-3">{user.area}</td>
                    <td className="py-3">{user.registrationDate}</td>
                    <td className="py-3">
                      <span
                        className={
                          user.aiResult === "Positive"
                            ? "badge bg-danger"
                            : "badge bg-success"
                        }
                      >
                        {t(`area_details.ai_results.${user.aiResult}`, user.aiResult)}
                      </span>
                    </td>
                    <td>
                      <FaFileAlt
                        role="button"
                        tabIndex={0}
                        style={{ cursor: "pointer", color: "#4a90e2", fontSize: "22px" }}
                        onClick={() => navigate("/ai-test")}
                        title={t("area_details.Go_to_AI_Test_details")}
                        aria-label={`${t(
                          "area_details.Go_to_AI_Test_details_for_user"
                        )} ${user.userId}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") navigate("/ai-test");
                        }}
                      />
                    </td>
                    <td
                      className="py-3"
                      style={{
                        borderTopRightRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                    >
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm"
                          title={t("area_details.Edit")}
                          aria-label={`${t("area_details.Edit_user")} ${user.userId}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm"
                          title={t("area_details.Info")}
                          onClick={() => navigate(`/user-details/${user.userId}`)}
                          aria-label={`${t(
                            "area_details.View_details_of_user"
                          )} ${user.userId}`}
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          className="btn btn-sm"
                          title={t("area_details.Delete")}
                          aria-label={`${t("area_details.Delete_user")} ${user.userId}`}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4">
                    {t("area_details.No_users_found")}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <nav aria-label={t("area_details.User_pagination")}>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                      aria-current={currentPage === i + 1 ? "page" : undefined}
                      aria-label={`${t("area_details.Go_to_page")} ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AreaPage;

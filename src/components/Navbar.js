import React from "react";
import { FaBell, FaBars, FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Navbar = ({ onToggleSidebar, darkMode, onToggleDarkMode }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);

    // اتجاه الصفحة حسب اللغة
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      // كل اللغات الأخرى من اليسار لليمين
      document.documentElement.dir = "ltr";
      document.documentElement.lang = lang;
    }
  };

  return (
    <nav
      className={`navbar fixed-top px-3 px-md-4 d-flex justify-content-between align-items-center shadow-sm`}
      style={{
        height: "70px",
        backgroundColor: darkMode ? "#1f1f1f" : "#fff",
        color: darkMode ? "#ddd" : "#000",
        borderBottom: darkMode ? "1px solid #333" : "1px solid #e3e6f0",
      }}
      role="banner"
    >
      <button
        onClick={onToggleSidebar}
        className={`btn ${darkMode ? "btn-dark" : "btn-light"} d-lg-none me-3`}
        aria-label="Toggle sidebar"
        style={{ borderColor: darkMode ? "#555" : undefined }}
      >
        <FaBars color={darkMode ? "#ddd" : undefined} />
      </button>

      <div
        className="d-flex align-items-center border-end pe-3"
        style={{ borderColor: darkMode ? "#555" : "#ddd" }}
      >
        <img
          src={darkMode ? "/images/logo.png" : "/images/logo.png"}
          alt="Logo"
          width="40"
          height="40"
          className="me-2"
          style={{ objectFit: "contain" }}
        />
        <div className="d-none d-md-block">
          <h5
            className="mb-0 fw-bold"
            style={{ color: darkMode ? "#eee" : "#000" }}
          >
            DEDS
          </h5>
          <small style={{ color: darkMode ? "#aaa" : undefined }}>
            Diabetes Early Detection System
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* اختيار اللغة مع تغيير */}
        <div
          className="border-start ps-3"
          style={{ borderColor: darkMode ? "#555" : "#ddd" }}
        >
          <select
            className={`form-select form-select-sm w-auto ${
              darkMode ? "bg-dark text-light border-secondary" : ""
            }`}
            aria-label="Select language"
            style={{ color: darkMode ? "#ddd" : undefined }}
            value={i18n.language}
            onChange={handleLanguageChange}
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
            <option value="tr">TR</option>
          </select>
        </div>

        <div
          className="border-start ps-3 d-flex align-items-center"
          style={{ borderColor: darkMode ? "#555" : "#ddd" }}
        >
          <button
            onClick={onToggleDarkMode}
            className={`btn shadow-sm ${darkMode ? "btn-dark" : "btn-light"}`}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={{ color: darkMode ? "#f39c12" : undefined }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div
          className="border-start border-end px-3"
          style={{ borderColor: darkMode ? "#555" : "#ddd" }}
        >
          <button
            className={`btn position-relative rounded-circle ${
              darkMode ? "btn-dark text-light" : "bg-light text-secondary"
            } shadow-sm p-2`}
            aria-label="Notifications"
          >
            <FaBell />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>
        </div>

        <div
          className="border-start ps-3 d-none d-md-block"
          style={{ borderColor: darkMode ? "#555" : "#ddd" }}
        >
          <div
            className="fw-semibold"
            style={{ fontSize: "0.9rem", color: darkMode ? "#ddd" : "#000" }}
            aria-live="polite"
          >
            Welcome,
            <br />
            <span className="fw-bold">Nour Shaheen</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

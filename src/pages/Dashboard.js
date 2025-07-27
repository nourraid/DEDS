import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";  // ضبط الاتجاه ليمين لليسار
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";  // ضبط الاتجاه لليسار لليمين
      document.documentElement.lang = "en";
    }
  }, [i18n.language]);


  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true" || false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`dashboard-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div
        className="d-flex flex-column vh-100"
        style={{ fontFamily: "'Segoe UI', sans-serif" }}
        role="main"
      >
        <Navbar
          onToggleSidebar={toggleSidebar}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />

        <div
          className="d-flex flex-grow-1"
          style={{ marginTop: "70px", height: "calc(100vh - 70px)" }}
        >
          {sidebarOpen && (
            <aside
              style={{ minWidth: "250px", maxWidth: "300px" }}
              aria-label="Sidebar navigation"
            >
              <Sidebar darkMode={darkMode} />
            </aside>
          )}

          <section
            className="flex-grow-1 p-3 overflow-auto"
            style={{ backgroundColor: darkMode ? "#424249ff" : "#dee9f1" }}
            aria-live="polite"
          >
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartArea,
  FaUser,
  FaMapMarkedAlt,
  FaUserShield,
  FaTruck,
  FaUserCog,
  FaCog,
  FaChartBar,
} from "react-icons/fa";

const sidebarItems = [
  { name: "Dashboard", icon: <FaChartArea />, path: "/dashboard" },
  { name: "Users", icon: <FaUser />, path: "/users" },
  { name: "Areas", icon: <FaMapMarkedAlt />, path: "/areas" },
  { name: "Providers", icon: <FaUserShield />, path: "/providers" },
  { name: "Distributors", icon: <FaTruck />, path: "/distributors" },
  { name: "Admins and Roles", icon: <FaUserCog />, path: "/admins" },
  { name: "Settings", icon: <FaCog />, path: "/settings" },
  { name: "Reports", icon: <FaChartBar />, path: "/reports" },
];

function Sidebar({ darkMode }) {
  return (
    <aside
      className={`d-flex flex-column shadow-sm ${
        darkMode ? "bg-dark text-light border-secondary" : "bg-white border-end"
      }`}
      style={{
        width: "250px",
        paddingTop: "40px",
        minHeight: "100vh",
      }}
    >
      <ul className="nav flex-column px-2">
        {sidebarItems.map((item) => (
          <li
            key={item.name}
            className="nav-item"
            title={item.name}
            tabIndex={0}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded-0 w-100 text-start ${
                  isActive
                    ? `bg-light border-start border-4 ${
                        darkMode ? "border-info text-info" : "border-primary text-primary"
                      }`
                    : darkMode
                    ? "text-light-50"
                    : "text-muted"
                }`
              }
              style={{
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              <span
                style={{
                  minWidth: "24px",
                  fontSize: "18px",
                  textAlign: "center",
                }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

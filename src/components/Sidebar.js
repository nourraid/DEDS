// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   FaChartLine, FaChevronRight, FaCalendarAlt, FaChartArea, FaUserFriends, 
//   FaClipboardCheck, FaMars, FaVenus, FaBell, FaUser, FaMapMarkedAlt, 
//   FaHospitalAlt, FaTruck, FaUserShield, FaCog, FaChartBar,
//   FaUserCog
// } from "react-icons/fa";
// import {
//   ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
//   Legend, CartesianGrid,
// } from "recharts";

// const sidebarItems = [
//   { name: "Dashboard", icon: <FaChartArea /> , path: "/dashboard"},
//    { name: "Users", icon: <FaUser />, path: "/users" },
//   { name: "Areas", icon: <FaMapMarkedAlt />, path: "/areas" },
//   { name: "Providers", icon: <FaUserShield />, path: "/providers" },
//   { name: "Distributors", icon: <FaTruck />, path: "/distributors" },
//   { name: "Admins and Roles", icon: <FaUserCog />, path: "/admins" },
//   { name: "Settings", icon: <FaCog />, path: "/settings" },
//   { name: "Reports", icon: <FaChartBar />, path: "/reports" },
// ];

// function Sidebar({ activeItem, setActiveItem }) {
//   return (
//     <aside className="bg-white border-end" style={{ width: "240px", paddingTop: "40px", height: "100%" }}>
//       <ul className="nav flex-column">
//         {sidebarItems.map((item) => {
//           const isActive = item.name === activeItem;
//           return (
//             <li key={item.name} className="nav-item">
//       <button
//   onClick={() => setActiveItem(item.name)}
//   className={`btn btn-link d-flex align-items-center px-3 py-2 ${isActive ? "bg-light border-start border-primary border-4" : "text-muted"}`}
//   style={{ textDecoration: "none", gap: "12px", fontSize: "14px" }}
// >
//   <span>{item.icon}</span>
//   <span>{item.name}</span>
// </button>
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// }
// export default Sidebar;
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartArea, FaUser, FaMapMarkedAlt, FaUserShield,
  FaTruck, FaUserCog, FaCog, FaChartBar,
  FaBars, // أيقونة القائمة (الهامبرجر)
  FaChevronLeft, // أيقونة السهم للإغلاق
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

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-end d-flex flex-column shadow-sm`}
      style={{
        width: collapsed ? "70px" : "240px",
        paddingTop: "40px",
        minHeight: "100vh",
        transition: "width 0.3s ease",
      }}
    >
      {/* زر التحكم */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="btn btn-light mb-3 mx-auto"
        style={{ width: collapsed ? "40px" : "200px" }}
      >
        {collapsed ? <FaBars /> : <><FaChevronLeft /> </>}
      </button>

      <ul className="nav flex-column px-2">
        {sidebarItems.map((item) => (
          <li key={item.name} className="nav-item" title={collapsed ? item.name : ""}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded-0 w-100 text-start ${
                  isActive
                    ? "bg-light border-start border-4 border-primary text-primary"
                    : "text-muted"
                }`
              }
              style={{
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              <span style={{ minWidth: "24px", fontSize: "18px", textAlign: "center" }}>
                {item.icon}
              </span>
              {/* إظهار الاسم فقط إذا لم يكن مصغر */}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

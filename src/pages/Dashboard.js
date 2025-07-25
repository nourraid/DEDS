import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ height: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <div className="d-flex" style={{ marginTop: "70px", height: "calc(100vh - 70px)" }}>
        <Sidebar />
        <div style={{backgroundColor:"#dee9f178"}}className="flex-grow-1 p-3 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

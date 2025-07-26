import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// صفحات المشروع
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import MainContent from "./components/MainContent";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Areas from "./pages/Areas";

import AiTestDetails from "./pages/AiTestDetails";
import UserDetails from "./pages/UserDetails";
import Providers from "./pages/Providers";
import Distributors from "./pages/Distributors ";
import AreaDetails from "./pages/AreaDetails";
import Settings from "./pages/Settings";
import AdminsAndRoles from "./pages/AdminsAndRoles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحة تسجيل الدخول مستقلة */}
        <Route path="/login" element={<Login />} />

        {/* Layout عام مع صفحات Nested */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MainContent />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="areas" element={<Areas />} />
          <Route path="providers" element={<Providers />} />
          <Route path="distributors" element={<Distributors />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admins" element={<AdminsAndRoles />} />

          <Route path="ai-test" element={<AiTestDetails />} />
          <Route path="user-details/:userId" element={<UserDetails />} />
          <Route path="/area/:areaName" element={<AreaDetails />} />

          {/* المزيد من المسارات هنا */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

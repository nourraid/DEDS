import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n";  // تهيئة i18n

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const MainContent = lazy(() => import("./components/MainContent"));
const Users = lazy(() => import("./pages/Users"));
const Reports = lazy(() => import("./pages/Reports"));
const Areas = lazy(() => import("./pages/Areas"));
const AiTestDetails = lazy(() => import("./pages/AiTestDetails"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Providers = lazy(() => import("./pages/Providers"));
const Distributors = lazy(() => import("./pages/Distributors "));
const AreaDetails = lazy(() => import("./pages/AreaDetails"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminsAndRoles = lazy(() => import("./pages/AdminsAndRoles"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
        <Routes>
          {/* صفحة تسجيل الدخول */}
          <Route path="/login" element={<Login />} />

          {/* جميع الصفحات داخل Layout */}
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
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

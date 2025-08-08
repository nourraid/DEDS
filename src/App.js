import React, { Suspense,lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// lazy imports
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const MainContent = lazy(() => import("./components/MainContent"));
const Users = lazy(() => import("./pages/Users"));
const Reports = lazy(() => import("./pages/Reports"));
const Areas = lazy(() => import("./pages/Areas"));
const AiTestDetails = lazy(() => import("./pages/AiTestDetails"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Providers = lazy(() => import("./pages/Providers"));
const Distributors = lazy(() => import("./pages/Distributors"));
const AreaDetails = lazy(() => import("./pages/AreaDetails"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminsAndRoles = lazy(() => import("./pages/AdminsAndRoles"));

function App() {
  const getDefaultRedirect = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") return "/users";
    if (role === "provider") return "/reports";
    if (role === "distributor") return "/distributors";
    return "/dashboard";
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to={getDefaultRedirect()} replace />} />
              <Route path="dashboard" element={<MainContent />} />
              <Route path="users" element={<Users />} />
              <Route path="reports" element={<Reports />} />
              <Route path="areas" element={<Areas />} />
              <Route path="providers" element={<Providers />} />
              <Route path="distributors" element={<Distributors />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admins" element={<AdminsAndRoles />} />
              <Route path="ai-test/:id" element={<AiTestDetails />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="area/:id" element={<AreaDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
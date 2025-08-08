import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // لو في توكن بيدخل، لو لا يرجع للوجين
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

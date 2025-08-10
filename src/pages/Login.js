import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// دالة التوجيه حسب الدور
const redirectByRole = (role, navigate) => {
  switch (role) {
    case "admin":
      navigate("/dashboard");
      break;
    case "provider":
      navigate("/providers");
      break;
    case "distributor":
      navigate("/distributors");
      break;
    default:
      navigate("/users");
  }
};

function Login() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // إذا المستخدم مسجل دخول بالفعل
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      redirectByRole(role, navigate);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // طلب تسجيل الدخول
      const response = await axios.post("/api/login", { email, password });

      const { token, role, user } = response.data;

      // حفظ بيانات المستخدم والتوكن
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      redirectByRole(role, navigate);
    } catch (error) {
      if (error.response) {
        const serverMsg = error.response.data.message;
        if (serverMsg === "Invalid credentials") {
          setMessage(`❌ ${t("login.error.invalid_credentials")}`);
        } else {
          setMessage(`❌ ${serverMsg || t("login.error.server_error")}`);
        }
      } else {
        setMessage(`❌ ${t("login.error.connection_error")}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #769ddf 0%, #4273c8 20%, #3561b2 100%)",
      }}
    >
      <div
        className="card p-4 shadow align-items-center"
        style={{ width: "500px", borderRadius: "20px", marginBottom: "100px" }}
      >
        <div className="d-flex mb-4 align-items-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ width: "70px", marginRight: "5px" }}
          />
          <div>
            <h4 className="mb-0">DEDS</h4>
            <p className="mb-0" style={{ fontSize: "0.9rem" }}>
              {t("login.Diabetes_Early_Detection_System")}
            </p>
          </div>
        </div>

        <p className="text-center" style={{ margin: 20 }}>
          {t("login.welcome_back")}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4" style={{ minWidth: "350px" }}>
            <input
              type="email"
              className="form-control border-0 border-bottom rounded-0"
              placeholder={t("login.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="form-control border-0 border-bottom rounded-0"
              placeholder={t("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{
              background: "#3561b3",
              borderRadius: "50px",
              padding: "12px",
              fontSize: "1.1rem",
            }}
            disabled={loading}
          >
            {loading ? t("login.loading") : t("login.Login")}
          </button>
        </form>

        {message && (
          <p
            className="text-center mt-3"
            style={{ color: message.includes("❌") ? "red" : "green" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;

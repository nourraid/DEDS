import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // منطق التحقق أو إرسال البيانات
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #769ddfff 0% ,  #4273c8ff 20% , #3561b2ff 100%)" }}
    >
      <div
        className="card p-4 shadow align-items-center"
        style={{width: "500px", borderRadius: "20px", marginBottom:"100px" }}
      >
        {/* شعار */}
        <div className="d-flex mb-4 align-items-center">
          <img
            src="/images/logo.png" // غير الرابط لمسار الصورة عندك
            alt="Logo"
            style={{ width: "70px" ,marginRight: "5px"}}
          />
           <div>
    {/* محتوى الـ div اللي جنب اللوجو */}
    <h4 className="mb-0">DEDS</h4>
    <p className="mb-0" style={{ fontSize: "0.9rem" }}>Diabetes Early Detection System</p>
  </div>
        
        </div>

        <p className="text-center" style={{ margin: 20 }}>
          welcome back! Please login to your acccount. 
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4" style={{marginTop:"50px", minWidth: "350px", width: "100%", maxWidth: "400px"}}>
           
            <input
              type="email"
              id="email"
              className="form-control border-0 border-bottom rounded-0"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
           
            <input
        
              type="password"
              id="password"
              className="form-control border-0 border-bottom rounded-0"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{marginTop:"40px" ,background:"#3561b3", borderRadius: "50px", padding: "12px", fontSize: "1.1rem" ,boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}
          >
            Login
          </button>
        </form>
      </div>

      <footer
        className="mt-3 text-center text-white"
        style={{ fontSize: "0.8rem", opacity: 0.8 }}
      >
        © 2025 DEDS (Diabetes Early Detection System)
      </footer>
    </div>
  );
}

export default Login;

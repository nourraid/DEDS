import React from 'react';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  return (
   <div>
      {/* Navbar */}
      <nav className="navbar bg-white shadow-sm fixed-top px-4 d-flex justify-content-between align-items-center" style={{ height: "70px" }}>
        <div className="d-flex align-items-center border-end pe-3">
          <img src="/images/logo.png" alt="Logo" width="40" height="40" className="me-2" />
          <div>
            <h5 className="mb-0 fw-bold">DEDS</h5>
            <small className="text-muted">Diabetes Early Detection System</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="border-start ps-3">
            <select className="form-select form-select-sm w-auto">
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>

          <div className="border-start border-end px-3">
            <button className="btn position-relative rounded-circle bg-light text-secondary shadow-sm p-2">
              <FaBell />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>
          </div>

          <div className="border-start ps-3">
            <div className="text-dark fw-semibold" style={{ fontSize: "0.9rem" }}>Welcome,<br /><span className="fw-bold">Nour Shaheen</span></div>
          </div>
        </div>
      </nav>
     
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { FaPlus, FaRegEdit, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import { Table } from "react-bootstrap";
  import { FaCalendarAlt , FaFileAlt} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";


const Users = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    result: "",
    gender: "",
    age: "",
    date: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const users = [
    {
      caseId: "C001",
      userId: "U123",
      area: "Gaza",
      registrationDate: "2025-06-01",
      aiResult: "Positive",
      country: "Palestine",
      gender: "Male",
      age: 35,
    },
    {
      caseId: "C002",
      userId: "U456",
      area: "Ramallah",
      registrationDate: "2025-06-10",
      aiResult: "Negative",
      country: "Palestine",
      gender: "Female",
      age: 29,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const countryMatch = filters.country ? user.country === filters.country : true;
    const resultMatch = filters.result ? user.aiResult === filters.result : true;
    const genderMatch = filters.gender ? user.gender === filters.gender : true;
    const ageMatch = filters.age ? user.age === parseInt(filters.age) : true;
    const dateMatch = filters.date ? user.registrationDate === filters.date : true;

    return searchMatch && countryMatch && resultMatch && genderMatch && ageMatch && dateMatch;
  });

const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 5;


const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  return (
    <div  className="container mt-4"style={{padding:"30px" , backgroundColor:"white" , borderRadius:"5px"}}>
      {/* Search + Add */}
   <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
  <input
    type="text"
    className="form-control flex-grow-1 me-3"
    placeholder="Search by Case ID or User ID"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ maxWidth: '400px' }} // تحكم بعرض البحث حسب رغبتك
  />
  <button
  className="btn d-flex align-items-center px-4 py-2"
  style={{
    fontWeight: 600,
    fontSize: '0.8rem',
    height: '42px',
    borderRadius: '100px',       // نصف قطر الحواف أكبر
    backgroundColor: '#4a90e2', // لون خلفية مختلف (أزرق جميل)
    color: 'white',
    width: '100%',              // عرض كامل للحاوية للأجهزة الصغيرة
    maxWidth: '200px',          // حد أقصى للعرض عند الشاشات الكبيرة
  }}
>
  <FaPlus className="me-2" />
  Add New User
</button>

</div>
      {/* Filters */}
     <div className="row g-3 mb-4">
  <div className="col-md-2">
    <select
      className="form-select"
      value={filters.country}
      onChange={(e) => handleFilterChange("country", e.target.value)}
    >
      <option value="">Country</option>
      <option value="Palestine">Palestine</option>
      <option value="Jordan">Jordan</option>
    </select>
  </div>
  <div className="col-md-2">
    <select
      className="form-select"
      value={filters.result}
      onChange={(e) => handleFilterChange("result", e.target.value)}
    >
      <option value="">Result</option>
      <option value="Positive">Positive</option>
      <option value="Negative">Negative</option>
    </select>
  </div>
  <div className="col-md-2">
    <select
      className="form-select"
      value={filters.gender}
      onChange={(e) => handleFilterChange("gender", e.target.value)}
    >
      <option value="">Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>
  <div className="col-md-2">
    <input
      type="number"
      className="form-control"
      placeholder="Age"
      value={filters.age}
      onChange={(e) => handleFilterChange("age", e.target.value)}
    />
  </div>
  <div className="col-md-1">

<div className="position-relative" style={{ width: "42px", height: "42px",  border:"1px solid #ccc" , borderRadius:"9px", backgroundColor:"white"}}>
  <input
    type="date"
    id="date-picker"
    value={filters.date}
    onChange={(e) => handleFilterChange("date", e.target.value)}
    className="position-absolute top-0 start-0 opacity-0"
    style={{ width: "100%", height: "100%", zIndex: 2, cursor: "pointer" }}
  />
  <button
    type="button"
    className="btn  d-flex justify-content-center align-items-center w-100 h-100"
    onClick={() => document.getElementById("date-picker").showPicker?.()}
    style={{ zIndex: 1, pointerEvents: "none", borderRadius: "8px" }}
  >
    <FaCalendarAlt />
  </button>
</div>




  </div>
</div>


      {/* Table */}
         <div className="table-responsive shadow-sm rounded" style={{ border: "1px solid #e3e6f0" }}>
        <Table
          hover
          responsive
          className="mb-0"
          style={{
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            minWidth: "700px",
            fontSize: "0.95rem",
          }}
        >
<thead
  className="text-center"
  style={{
    backgroundColor: '#f0f0f0',
    color: '#4a4a4a',
  }}
>
  <tr>
    <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>Case ID</th>
    <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>User ID</th>
    <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>Area</th>
    <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>Registration Date</th>
    <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>AI Result</th>
        <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>AI Test</th>

    <th className="py-3" style={{ color: '#a8a5a5ff', backgroundColor: '#f0f0f0', borderBottom: 'none' }}>Options</th>
  </tr>
</thead>


<tbody className="text-center">
  {currentUsers.length > 0 ? (
    currentUsers.map((user, idx) => (
      <tr
        key={idx}
        style={{
          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)", // ظل خفيف
          margin: "10px",
          display: "table-row", // مهم مع تباعد الصفوف
        }}
      >
        <td className="py-3" style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
          {user.caseId}
        </td>
        <td className="py-3">{user.userId}</td>
        <td className="py-3">{user.area}</td>
        <td className="py-3">{user.registrationDate}</td>
        <td className="py-3">
          <span className={user.aiResult === "Positive" ? "badge bg-danger" : "badge bg-success"}>
            {user.aiResult}
          </span>
        </td>
  <td>
    <FaFileAlt
      style={{ cursor: "pointer", color: "#4a90e2", fontSize: "22px"  }}
      onClick={() => navigate("/ai-test")}
      title="Go to AI Test details"
    />
  </td>   
   <td className="py-3" style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
  <div className="d-flex justify-content-center gap-2">
    <button className="btn btn-sm  " title="Edit">
      <FaEdit />
    </button>
    <button
  className="btn btn-sm"
  title="Info"
  onClick={() => navigate(`/user-details/${user.userId}`)}
>
  <FaCircleInfo />
</button>

    <button className="btn btn-sm " title="Delete">
      <FaTrashAlt />
    </button>
  </div>
</td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="py-4">
        No users found.
      </td>
    </tr>
  )}
</tbody>


        </Table>
        <div className="d-flex justify-content-center mt-3">
  <nav>
    <ul className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <li
          key={i}
          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        </li>
      ))}
    </ul>
  </nav>
</div>

      </div>
    </div>
  );
};

export default Users;

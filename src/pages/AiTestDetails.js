import React, { useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import {
  FaPrint,
  FaFileAlt,
  FaCalendarAlt,
  FaPhoneAlt,
  FaBell,
  FaCommentDots,
  FaCalendarPlus,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


const AiTestsPage = () => {
  const [note, setNote] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
      setNote(""); // تفريغ الحقل عند إلغاء الاختيار
    } else {
      setSelectedId(id);
      const selectedMsg = messages.find((msg) => msg.id === id);
      setNote(selectedMsg.text); // تعيين نص الرسالة المختارة في الحقل
    }
  };

  const messages = [
    {
      id: 1,
      text: "Your diabetes test result is ready. Please check your account.",
      borderColor: "#ffc107",
      bgColor: "#fff3cd",
      textColor: "#856404",
    },
    {
      id: 2,
      text: "We recommend scheduling a follow-up appointment.",
      borderColor: "#28a745",
      bgColor: "#d4edda",
      textColor: "#155724",
    },
    {
      id: 3,
      text: "Please contact your local health center for more information.",
      borderColor: "#dc3545",
      bgColor: "#f8d7da",
      textColor: "#721c24",
    },
  ];

  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const providersList = [
    { id: "1", name: "Provider One" },
    { id: "2", name: "Provider Two" },
  ];

  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(new Date());
  const [hour, setHour] = useState("10");
  const [ampm, setAmpm] = useState("AM");
  const [appointmentNote, setAppointmentNote] = useState("");

  const handleSaveAppointment = (data) => {
    console.log("Appointment saved:", data);
    alert("Appointment saved successfully!");
    // هنا يمكن إرسال البيانات للسيرفر أو معالجتها
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleOpenDetailsModal = (test) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedTest(null);
  };

  const allTests = [
    {
      id: 1,
      date: "2025-07-20",
      result: "Positive",
      details: "Details 1",
      patientName: "John Doe",
      caseId: "A012",
      reportDate: "2025-07-19",
      results: [
        { name: "Urobilinogen", standard: "3.2-16" },
        { name: "Bilirubin", standard: "Negative" },
        { name: "Ketone", standard: "Negative" },
        { name: "creatinine", standard: ">0.9" },
        { name: "Blood", standard: "Negative" },
        { name: "Protien", standard: "Negative" },
        { name: "Micro Albumin", standard: ">10.0" },
        { name: "Nitrite", standard: "Negative" },
        { name: "Leukocytes", standard: "Negative" },
        { name: "Glucose", standard: "Negative" },
        { name: "Specific Gravity", standard: "1000" },
        { name: "PH", standard: "7.0" },
        { name: "Ascorbate", standard: "0" },
        { name: "Calcium", standard: "0-3.0" },
      ],
    },
    {
      id: 2,
      date: "2025-07-21",
      result: "Negative",
      details: "Details 2",
      patientName: "Jane Smith",
      caseId: "B034",
      reportDate: "2025-07-20",
      results: [
        { name: "Urobilinogen", standard: "3.2-16" },
        { name: "Bilirubin", standard: "Negative" },
        { name: "Ketone", standard: "Negative" },
        { name: "creatinine", standard: ">0.9" },
        { name: "Blood", standard: "Negative" },
        { name: "Protien", standard: "Negative" },
        { name: "Micro Albumin", standard: ">10.0" },
        { name: "Nitrite", standard: "Negative" },
        { name: "Leukocytes", standard: "Negative" },
        { name: "Glucose", standard: "Negative" },
        { name: "Specific Gravity", standard: "1000" },
        { name: "PH", standard: "7.0" },
        { name: "Ascorbate", standard: "0" },
        { name: "Calcium", standard: "0-3.0" },
      ],
    },
    {
      id: 3,
      date: "2025-07-22",
      result: "Positive",
      details: "Details 3",
      patientName: "Ali Ahmad",
      caseId: "C056",
      reportDate: "2025-07-21",
      results: [
        { name: "Urobilinogen", standard: "3.2-16" },
        { name: "Bilirubin", standard: "Negative" },
        { name: "Ketone", standard: "Negative" },
        { name: "creatinine", standard: ">0.9" },
        { name: "Blood", standard: "Negative" },
        { name: "Protien", standard: "Negative" },
        { name: "Micro Albumin", standard: ">10.0" },
        { name: "Nitrite", standard: "Negative" },
        { name: "Leukocytes", standard: "Negative" },
        { name: "Glucose", standard: "Negative" },
        { name: "Specific Gravity", standard: "1000" },
        { name: "PH", standard: "7.0" },
        { name: "Ascorbate", standard: "0" },
        { name: "Calcium", standard: "0-3.0" },
      ],
    },
  ];

  const filteredTests = allTests.filter((test) => {
    const matchesSearch =
      test.id.toString().includes(searchTerm) ||
      test.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResult = selectedResult ? test.result === selectedResult : true;
    const matchesDate = selectedDate ? test.date === selectedDate : true;

    return matchesSearch && matchesResult && matchesDate;
  });

  const handleCall = (id) => alert(`Call test #${id}`);
  const handleNotify = (test) => {
    setSelectedTest(test);
    setShowNotificationModal(true);
  };
  const handleChat = (id) => alert(`Chat about test #${id}`);
  const handlecalender = (test) => {
    setSelectedTest(test);
    setShowCalendarModal(true);
  };

  const closeModal = () => {
    setShowNotificationModal(false);
    setSelectedTest(null);
    setNote("");
    setSelectedId(null);
  };

  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    setSelectedTest(null);
    setNote("");
    setSelectedId(null);
    setAppointmentNote("");
    setSelectedProvider("");
    setSelectedAppointmentDate(new Date());
    setHour("10");
    setAmpm("AM");
  };

  const handleAddNote = () => {
    if (!note.trim()) {
      alert("Please enter a note before sending.");
      return;
    }

    console.log("Note sent:", note);
    alert("Note added successfully!");
    setNote("");
    setSelectedId(null);
    closeModal();
  };

  return (
    <div
      className="container py-4"
      style={{ backgroundColor: "white", borderRadius: "10px", padding: "50px" }}
    >
      <h4 className="mb-4">🧪 AI Tests</h4>

      <input
        type="text"
        placeholder="Search here"
        className="form-control"
        style={{ maxWidth: "600px", height: "50px", marginBottom: "30px" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <hr style={{ color: "#ccc" }} />

      <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
        <h6>Filter</h6>
        <select
          className="form-select"
          value={selectedResult}
          onChange={(e) => setSelectedResult(e.target.value)}
          style={{ width: "150px" }}
        >
          <option value="">All Results</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
        <div
          style={{
            position: "relative",
            width: "42px",
            height: "42px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="position-absolute top-0 start-0 opacity-0"
            style={{ width: "100%", height: "100%", zIndex: 2, cursor: "pointer" }}
          />
          <button
            type="button"
            className="btn d-flex justify-content-center align-items-center w-100 h-100"
            onClick={() => document.getElementById("date-picker").showPicker?.()}
            style={{ zIndex: 1, pointerEvents: "none", borderRadius: "8px" }}
          >
            <FaCalendarAlt />
          </button>
        </div>
      </div>

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
            style={{ backgroundColor: "#f0f0f0", color: "#4a4a4a" }}
          >
            <tr>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                Test Number
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                Test Date
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                AI Result
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                AI Details
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                Call
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                Notification
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                Chat
              </th>
              <th
                className="py-3"
                style={{ color: "#a8a5a5ff", backgroundColor: "#f0f0f0", borderBottom: "none" }}
              >
                Appointment
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <tr
                  key={test.id}
                  style={{
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                    margin: "10px",
                    display: "table-row",
                  }}
                >
                  <td className="py-3">{test.id}</td>
                  <td className="py-3">{test.date}</td>
                  <td className="py-3">
                    <span
                      className={`badge ${
                        test.result === "Positive" ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {test.result}
                    </span>
                  </td>
                  <td className="py-3">
                    <p
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={() => handleOpenDetailsModal(test)}
                      title="details"
                    >
                      {test.details}
                    </p>
                  </td>
                  <td className="py-3">
                    <FaPhoneAlt
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={() => handleCall(test.id)}
                      title="Call"
                    />
                  </td>
                  <td className="py-3">
                    <FaBell
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={() => handleNotify(test)}
                      title="Notification"
                    />
                  </td>
                  <td className="py-3">
                    <FaCommentDots
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={() => handleChat(test.id)}
                      title="Chat"
                    />
                  </td>
                  <td className="py-3">
                    <FaCalendarPlus
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={() => handlecalender(test)}
                      title="Appointment"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4">
                  No matching tests found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal for Notification */}
      <Modal show={showNotificationModal} onHide={closeModal} centered size="lg">
        <Modal.Header
          closeButton
          className="flex-column align-items-start"
          style={{ border: "none" }}
        >
          <Modal.Title className="fs-4 fw-bold mb-1">
            Notification {selectedTest?.id}
          </Modal.Title>
          <p className="text-muted mb-0">Please fill out the note</p>
        </Modal.Header>

        <Modal.Body>
          {/* حقل الملاحظة */}
          <div className="mb-3">
            <label htmlFor="noteInput" className="form-label fw-semibold">
              send to user <strong>nour</strong>
            </label>
            <textarea
              id="noteInput"
              className="form-control"
              rows="4"
              placeholder="Write here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* أنواع الرسائل الجاهزة */}
          <div>
            <p className="fw-semibold mb-3">Quick Messages:</p>

            <div className="d-flex flex-wrap gap-2">
              {messages.map((msg) => (
                <div key={msg.id} style={{ flex: "1 1 250px", minWidth: "250px" }}>
                  <div
                    style={{
                      border: `1px solid ${msg.borderColor}`,
                      backgroundColor: msg.bgColor,
                      color: msg.textColor,
                      padding: "1rem",
                      borderRadius: "8px",
                      minHeight: "100px",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "500",
                      fontSize: "0.9rem",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    className="d-flex align-items-center gap-2 mt-2"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSelect(msg.id)}
                  >
                    {/* مربع الاختيار */}
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border:
                          selectedId === msg.id
                            ? "2px solid #28a745"
                            : "2px solid #6c757d",
                        backgroundColor: selectedId === msg.id ? "#28a745" : "transparent",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {selectedId === msg.id ? "✓" : ""}
                    </div>

                    {/* نص كلمة Select */}
                    <span
                      style={{ color: selectedId === msg.id ? "#28a745" : "#6c757d" }}
                    >
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button
            style={{
              padding: "10px",
              width: "25%",
              borderRadius: "50px",
              backgroundColor: "#558abeff",
              borderColor: "#558abeff",
              fontWeight: "600",
            }}
            className="me-2"
            onClick={handleAddNote}
          >
            <FaFileAlt className="me-1" /> Add
          </Button>
          
        </Modal.Footer>
      </Modal>



{/* Modal for Details */}
<Modal show={showDetailsModal} onHide={handleCloseModal} centered size="lg">
 
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {selectedTest && (
            <>
              <div className="mb-3">
                <h2 className="text-center" style={{padding:"10px"}}>Blood test result</h2>
                <p>Patient Name: {selectedTest.patientName}</p>
                <p>Case ID: {selectedTest.caseId}</p>
                <p>Report Date: {selectedTest.reportDate}</p>
                <hr/>
              </div>


              
    <Table
  bordered={false}
  style={{
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    width: "100%",
  }}
>
  <thead className="table-light">
    <tr>
      <th style={{ border: "none", textAlign: "left", width: "33.3%" }}>Test Name</th>
      <th style={{ border: "none", textAlign: "center", width: "33.3%" }}>Result</th>
      <th style={{ border: "none", textAlign: "center", width: "33.3%" }}>Standard</th>
    </tr>
  </thead>
  <tbody>
    {selectedTest.results?.map((res, i) => (
      <tr key={i}>
        <td
          style={{
            width: "33.3%",
            backgroundColor: "white",
            border: "1px solid #dee2e6",
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
            padding: "15px",
            verticalAlign: "middle",
          }}
        >
          {res.name}
        </td>
        <td
          style={{
            width: "33.3%",
            backgroundColor: "white",
            border: "1px solid #dee2e6",
            padding: "2px",
            verticalAlign: "middle",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#cfd7ddff",
              borderRadius: "6px",
              padding: "25px",
              width: "97%",
              height: "97%",
              fontWeight: "500",
              boxSizing: "border-box",
            }}
          >
            {res.result}
          </div>
        </td>
        <td
          style={{
            width: "33.3%",
            backgroundColor: "white",
            border: "1px solid #dee2e6",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            padding: "15px",
            textAlign: "right",
            verticalAlign: "middle",
          }}
        >
          {res.standard}
        </td>
      </tr>
    ))}
  </tbody>
</Table>

          </>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
    
            <Button 
          
            style={{
              padding:"10px",
              width:"25%",
              borderRadius: "50px",
              backgroundColor: "#558abeff",
              borderColor: "#558abeff",
              fontWeight: "600",}}

             className="me-2" onClick={() => alert("Send Report clicked")}>
              <FaFileAlt className="me-1" /> Send Report
            </Button>
            <Button    style={{
              padding:"10px",
              color:"#558abeff",
              width:"25%",
              borderRadius: "50px",
              backgroundColor: "white",
              borderRadius:"20px",
              borderColor: "#558abeff",
              fontWeight: "600",}}
               onClick={() => window.print()}>
              <FaPrint className="me-1" /> Print
            </Button>
        </Modal.Footer>
</Modal>






      {/* Modal for Appointment */}
      <Modal show={showCalendarModal} onHide={closeCalendarModal} centered size="md">
        <Modal.Header
          closeButton
          className="flex-column align-items-start"
          style={{ border: "none" }}
        >
          <Modal.Title className="fs-4 fw-bold mb-1">
            Appointment {selectedTest?.id}
          </Modal.Title>
        </Modal.Header>

    <Modal.Body>
  {/* Calendar */}
  <div className="mb-4">
    <h6 className="mb-2 fw-bold">Calendar</h6>
   
<>
  <style>{`
    .appointment-calendar-wrapper {
      width: 100%;
    }

    .appointment-calendar {
      width: 100%;
      border-radius: 16px;
      background-color: #fff;
      border: 1px solid #dee2e6;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 8px;
    }

    .appointment-calendar .react-datepicker {
      width: 100%;
      display: block;
    }

    .appointment-calendar .react-datepicker__header {
      background-color: #fff;
      border-bottom: 1px solid #dee2e6;
      padding: 12px 0;
      border-radius: 16px 16px 0 0;
    }

    .appointment-calendar .react-datepicker__current-month {
      color: #000;
      font-weight: 600;
    }

    .appointment-calendar .react-datepicker__day-name,
    .appointment-calendar .react-datepicker__day {
      color: #000;
    }

    .appointment-calendar .react-datepicker__day--selected,
    .appointment-calendar .react-datepicker__day--keyboard-selected {
      background-color: rgba(130, 165, 200, 0.6);
      color: #fff;
      border-radius: 50%;
    }

    .appointment-calendar .react-datepicker__day--today {
      font-weight: 700;
    }

    .appointment-calendar .react-datepicker__navigation-icon::before {
      border-color: #000;
    }

    .appointment-calendar .react-datepicker__navigation--previous,
    .appointment-calendar .react-datepicker__navigation--next {
      top: 12px;
    }
      .react-datepicker__month-container {
  width: 100%;
}
  `}</style>

  <div className="appointment-calendar-wrapper">
    <DatePicker
      selected={selectedAppointmentDate}
      onChange={setSelectedAppointmentDate}
      inline
      calendarClassName="appointment-calendar"
    />
  </div> 
</>



  </div>

  {/* Time */}
  <div className="mb-4">
    <h6 className="mb-2 fw-bold">Time</h6>
    <div className="row g-2">
      <div className="col-8">
        <Form.Select
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          style={{ borderRadius: "12px" }}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i}>{i + 1}</option>
          ))}
        </Form.Select>
      </div>
      <div className="col-4">
        <Form.Select
          value={ampm}
          onChange={(e) => setAmpm(e.target.value)}
          style={{ borderRadius: "12px" }}
        >
          <option>AM</option>
          <option>PM</option>
        </Form.Select>
      </div>
    </div>
  </div>

  {/* Note */}
  <div className="mb-4">
    <h6 className="mb-2 fw-bold">Note</h6>
    <Form.Control
      as="textarea"
      rows={7}
      placeholder="Write here"
      style={{ borderRadius: "12px", resize: "none" }}
      value={appointmentNote}
      onChange={(e) => setAppointmentNote(e.target.value)}
    />
  </div>

  {/* Providers */}
  <div className="mb-4">
    <h6 className="mb-2 fw-bold">Providers</h6>
    <Form.Select
      value={selectedProvider}
      onChange={(e) => setSelectedProvider(e.target.value)}
      style={{ borderRadius: "12px" }}
    >
      <option value="">Select provider</option>
      {providersList.map((provider) => (
        <option key={provider.id} value={provider.id}>
          {provider.name}
        </option>
      ))}
    </Form.Select>
  </div>
</Modal.Body>

<Modal.Footer
  className="d-flex justify-content-center"
  style={{ border: "none", marginTop: "40px" }}
>
  <Button
    style={{
      color: "#ebedefff",
      backgroundColor: "#668db4ff",
      borderRadius: "20px",
      height: "44px",
      width: "50%",
    }}
    onClick={() =>
      handleSaveAppointment({
        date: selectedAppointmentDate,
        hour,
        ampm,
        note: appointmentNote,
        provider: selectedProvider,
        testId: selectedTest?.id,
      })
    }
  >
    Save Appointment
  </Button>
</Modal.Footer>

      </Modal>
    </div>
  );
};

export default AiTestsPage;

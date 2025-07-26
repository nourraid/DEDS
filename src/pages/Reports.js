import React, { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const reportTypes = [
  { value: "byCategory", label: "By Category" },
  { value: "byCountry", label: "By Country" },
  { value: "byGender", label: "By Gender" },
  { value: "byDateRange", label: "By Date Range" },
  { value: "patientReport", label: "Comprehensive Patient Report" },
];

const categories = ["Type 1 Diabetes", "Type 2 Diabetes", "Gestational"];
const countries = ["Saudi Arabia", "Egypt", "Palestine", "UAE", "Turkey"];

const ReportsPage = () => {
  const [reportType, setReportType] = useState(reportTypes[0].value);
  const [category, setCategory] = useState(categories[0]);
  const [country, setCountry] = useState(countries[0]);
  const [gender, setGender] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = () => {
    if (reportType === "patientReport") {
      if (!patientId.trim()) {
        alert("Please enter a Patient ID.");
        return;
      }
      // بيانات تقرير شامل المريض مع نتائج الفحوصات الطبية المطلوبة
      setReportData({
        patientId,
        name: "John Doe",
        age: 45,
        gender: "Male",
        medicalCenter: "Center A",
        tests: [
          { name: "Urobilinogen", standard: "3.2-16" },
          { name: "Bilirubin",  standard: "Negative" },
          { name: "Ketone",  standard: "Negative" },
          { name: "Creatinine", standard: ">0.9" },
          { name: "Blood",  standard: "Negative" },
          { name: "Protein", standard: "Negative" },
          { name: "Micro Albumin",  standard: ">10.0" },
          { name: "Nitrite",  standard: "Negative" },
          { name: "Leukocytes",  standard: "Negative" },
          { name: "Glucose", standard: "Negative" },
          { name: "Specific Gravity", standard: "1000" },
          { name: "PH",  standard: "7.0" },
          { name: "Ascorbate",  standard: "0" },
          { name: "Calcium",  standard: "0-3.0" },
        ],
      });
    } else if (reportType === "byCategory") {
      setReportData([
        { category: "Type 1 Diabetes", cases: 500 },
        { category: "Type 2 Diabetes", cases: 1500 },
        { category: "Gestational", cases: 300 },
      ]);
    } else if (reportType === "byCountry") {
      setReportData([
        { country: "Saudi Arabia", cases: 1200 },
        { country: "Egypt", cases: 980 },
        { country: "Palestine", cases: 450 },
      ]);
    } else if (reportType === "byGender") {
      setReportData([
        { gender: "Male", count: 1800 },
        { gender: "Female", count: 1950 },
      ]);
    } else if (reportType === "byDateRange") {
      setReportData([
        { month: "January", count: 400 },
        { month: "February", count: 520 },
        { month: "March", count: 610 },
      ]);
    }
  };

  const exportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Report", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(99);

    if (reportType === "patientReport") {
      doc.text(`Patient ID: ${reportData.patientId}`, 14, 32);
      doc.text(`Name: ${reportData.name}`, 14, 40);
      doc.text(`Age: ${reportData.age}`, 14, 48);
      doc.text(`Gender: ${reportData.gender}`, 14, 56);
      doc.text(`Medical Center: ${reportData.medicalCenter}`, 14, 64);

      const tableColumn = ["Test Name", "Result", "Standard"];
      const tableRows = [];

      reportData.tests.forEach((test) => {
        tableRows.push([test.name, test.result, test.standard]);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 72,
        styles: { font: "Arial", fontSize: 12 },
        headStyles: { fillColor: [0, 51, 102] },
      });
    } else {
      let tableColumn = [];
      let tableRows = [];

      if (reportType === "byCategory") {
        tableColumn = ["Category", "Number of Cases"];
        reportData.forEach((item) => {
          tableRows.push([item.category, item.cases]);
        });
      } else if (reportType === "byCountry") {
        tableColumn = ["Country", "Number of Cases"];
        reportData.forEach((item) => {
          tableRows.push([item.country, item.cases]);
        });
      } else if (reportType === "byGender") {
        tableColumn = ["Gender", "Count"];
        reportData.forEach((item) => {
          tableRows.push([item.gender, item.count]);
        });
      } else if (reportType === "byDateRange") {
        tableColumn = ["Month", "Number of Cases"];
        reportData.forEach((item) => {
          tableRows.push([item.month, item.count]);
        });
      }

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { font: "Arial", fontSize: 12 },
        headStyles: { fillColor: [0, 51, 102] },
      });
    }

    doc.save(`report_${reportType}${reportType === "patientReport" ? `_${reportData.patientId}` : ""}.pdf`);
  };

  return (
    <div className="container p-4" style={{ backgroundColor: "white", borderRadius: "5px" }}>
      <h2 className="mb-4">Reports</h2>

      <Form.Group className="mb-3">
        <Form.Label>Report Type:</Form.Label>
        <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {reportType === "byCategory" && (
        <Form.Group className="mb-3">
          <Form.Label>Category:</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {reportType === "byCountry" && (
        <Form.Group className="mb-3">
          <Form.Label>Country:</Form.Label>
          <Form.Select value={country} onChange={(e) => setCountry(e.target.value)}>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {reportType === "byGender" && (
        <Form.Group className="mb-3">
          <Form.Label>Gender:</Form.Label>
          <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="all">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Form.Group>
      )}

      {reportType === "byDateRange" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>From:</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>To:</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>
        </>
      )}

      {reportType === "patientReport" && (
        <Form.Group className="mb-3">
          <Form.Label>Patient ID:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </Form.Group>
      )}

      <div className="mb-3">
        <Button variant="primary" className="me-2" onClick={handleGenerateReport}>
          Generate Report
        </Button>
        <Button variant="outline-success" onClick={exportPDF} disabled={!reportData}>
          Export PDF
        </Button>
      </div>

      {/* عرض تقرير المريض */}
      {reportData && reportType === "patientReport" && (
        <div>
          <h4>Patient Report for ID: {reportData.patientId}</h4>
          <p><strong>Name:</strong> {reportData.name}</p>
          <p><strong>Age:</strong> {reportData.age}</p>
          <p><strong>Gender:</strong> {reportData.gender}</p>
          <p><strong>Medical Center:</strong> {reportData.medicalCenter}</p>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Result</th>
                <th>Standard</th>
              </tr>
            </thead>
            <tbody>
              {reportData.tests.map((test, idx) => (
                <tr key={idx}>
                  <td>{test.name}</td>
                  <td>{test.result}</td>
                  <td>{test.standard}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* عرض بقية التقارير */}
      {reportData && reportType !== "patientReport" && (
        <Table hover striped bordered responsive style={{ fontSize: "0.95rem" }}>
          <thead className="text-center" style={{ backgroundColor: "#f0f0f0", color: "#4a4a4a" }}>
            <tr>
              {reportType === "byCategory" && (
                <>
                  <th>Category</th>
                  <th>Number of Cases</th>
                </>
              )}
              {reportType === "byCountry" && (
                <>
                  <th>Country</th>
                  <th>Number of Cases</th>
                </>
              )}
              {reportType === "byGender" && (
                <>
                  <th>Gender</th>
                  <th>Count</th>
                </>
              )}
              {reportType === "byDateRange" && (
                <>
                  <th>Month</th>
                  <th>Number of Cases</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="text-center">
            {reportType === "byCategory" &&
              reportData.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb" }}>
                  <td>{row.category}</td>
                  <td>{row.cases}</td>
                </tr>
              ))}
            {reportType === "byCountry" &&
              reportData.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb" }}>
                  <td>{row.country}</td>
                  <td>{row.cases}</td>
                </tr>
              ))}
            {reportType === "byGender" &&
              reportData.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb" }}>
                  <td>{row.gender}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            {reportType === "byDateRange" &&
              reportData.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb" }}>
                  <td>{row.month}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ReportsPage;

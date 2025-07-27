import React, { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslation } from "react-i18next";
import '../fonts/Amiri-normal.js';

const reportTypes = [
  { value: "byCategory", labelKey: "reports.category_header" },
  { value: "byCountry", labelKey: "reports.country_header" },
  { value: "byGender", labelKey: "reports.gender" },
  { value: "byDateRange", labelKey: "reports.month" },
  { value: "patientReport", labelKey: "reports.patient_report_title" },
];

const categories = ["Type 1 Diabetes", "Type 2 Diabetes", "Gestational"];
const countries = ["Saudi Arabia", "Egypt", "Palestine", "UAE", "Turkey"];

const ReportsPage = () => {
  const { t, i18n } = useTranslation();

  const [reportType, setReportType] = useState(reportTypes[0].value);
  const [category, setCategory] = useState(categories[0]);
  const [country, setCountry] = useState(countries[0]);
  const [gender, setGender] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [reportData, setReportData] = useState(null);

  const isRTL = i18n.language === "ar";

  const handleGenerateReport = () => {
    let newData = null;

    if (reportType === "patientReport") {
      if (!patientId.trim()) {
        alert(t("reports.please_enter_patient_id"));
        return;
      }
      newData = {
        patientId,
        name: "John Doe",
        age: 45,
        gender: isRTL ? "ذكر" : "Male",
        medicalCenter: "Center A",
        tests: [
       { name: "Urobilinogen", result: "5", standard: "3.2-16" },
          { name: "Bilirubin", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Ketone", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Creatinine", result: "1.0", standard: ">0.9" },
          { name: "Blood", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Protein", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Micro Albumin", result: "15", standard: ">10.0" },
          { name: "Nitrite", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Leukocytes", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Glucose", result: isRTL ? "سلبي" : "Negative", standard: isRTL ? "سلبي" : "Negative" },
          { name: "Specific Gravity", result: "1005", standard: "1000" },
          { name: "PH", result: "7.0", standard: "7.0" },
          { name: "Ascorbate", result: "0", standard: "0" },
          { name: "Calcium", result: "2.5", standard: "0-3.0" },
        ],
      };
    } else if (reportType === "byCategory") {
      newData = [
        { category: isRTL ? "النوع 1 من السكري" : "Type 1 Diabetes", cases: 500 },
        { category: isRTL ? "النوع 2 من السكري" : "Type 2 Diabetes", cases: 1500 },
        { category: isRTL ? "سكري الحمل" : "Gestational", cases: 300 },
      ];
    } else if (reportType === "byCountry") {
      newData = [
        { country: isRTL ? "المملكة العربية السعودية" : "Saudi Arabia", cases: 1200 },
        { country: isRTL ? "مصر" : "Egypt", cases: 980 },
        { country: isRTL ? "فلسطين" : "Palestine", cases: 450 },
      ];
    } else if (reportType === "byGender") {
      newData = [
        { gender: isRTL ? "ذكر" : "Male", count: 1800 },
        { gender: isRTL ? "أنثى" : "Female", count: 1950 },
      ];
    } else if (reportType === "byDateRange") {
      newData = [
        { month: isRTL ? "يناير" : "January", count: 400 },
        { month: isRTL ? "فبراير" : "February", count: 520 },
        { month: isRTL ? "مارس" : "March", count: 610 },
      ];
    }

    if (JSON.stringify(newData) !== JSON.stringify(reportData)) {
      setReportData(newData);
    }
  };

  const exportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF({
      putOnlyUsedFonts: true,
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      hotfixes: ["px_scaling"],
    });

    doc.setFont("Amiri");
    doc.setFontSize(18);
    doc.text(t("reports.reports"), isRTL ? 200 : 14, 22, { align: isRTL ? "right" : "left" });

    doc.setFontSize(12);
    doc.setTextColor(99);

    if (reportType === "patientReport") {
      const x = isRTL ? 200 : 14;
      const align = isRTL ? "right" : "left";

      doc.text(`${t("reports.patient_id")}: ${reportData.patientId}`, x, 32, { align });
      doc.text(`${t("reports.name") || "Name"}: ${reportData.name}`, x, 40, { align });
      doc.text(`${t("reports.age") || "Age"}: ${reportData.age}`, x, 48, { align });
      doc.text(`${t("reports.gender")}: ${reportData.gender}`, x, 56, { align });
      doc.text(`${t("reports.medical_center") || "Medical Center"}: ${reportData.medicalCenter}`, x, 64, { align });

      const tableColumn = [t("reports.test_name"), t("reports.result"), t("reports.standard")];
      const tableRows = [];

      reportData.tests.forEach((test) => {
        tableRows.push([test.name, test.result, test.standard]);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 72,
        styles: {
          font: "Amiri",
          fontSize: 12,
          halign: isRTL ? "right" : "left",
        },
        headStyles: {
          fillColor: [0, 51, 102],
          halign: isRTL ? "right" : "left",
        },
        didDrawCell: (data) => {
          if (isRTL) {
            data.cell.styles.cellPadding = { right: 5, left: 2 };
          }
        },
      });
    } else {
      let tableColumn = [];
      let tableRows = [];

      if (reportType === "byCategory") {
        tableColumn = [t("reports.category_header"), t("reports.number_of_cases")];
        reportData.forEach((item) => {
          tableRows.push([item.category, item.cases]);
        });
      } else if (reportType === "byCountry") {
        tableColumn = [t("reports.country_header"), t("reports.number_of_cases")];
        reportData.forEach((item) => {
          tableRows.push([item.country, item.cases]);
        });
      } else if (reportType === "byGender") {
        tableColumn = [t("reports.gender"), t("reports.count")];
        reportData.forEach((item) => {
          tableRows.push([item.gender, item.count]);
        });
      } else if (reportType === "byDateRange") {
        tableColumn = [t("reports.month"), t("reports.number_of_cases")];
        reportData.forEach((item) => {
          tableRows.push([item.month, item.count]);
        });
      }

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: {
          font: "Amiri",
          fontSize: 12,
          halign: isRTL ? "right" : "left",
        },
        headStyles: {
          fillColor: [0, 51, 102],
          halign: isRTL ? "right" : "left",
        },
        didDrawCell: (data) => {
          if (isRTL) {
            data.cell.styles.cellPadding = { right: 5, left: 2 };
          }
        },
      });
    }

    doc.save(`report_${reportType}${reportType === "patientReport" ? `_${reportData.patientId}` : ""}.pdf`);
  };

  return (
    <div
      className="container p-4"
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <h2 className="mb-4">{t("reports.reports")}</h2>

      <Form.Group className="mb-3">
        <Form.Label>{t("reports.report_type")}</Form.Label>
        <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {t(type.labelKey) || type.value}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {reportType === "byCategory" && (
        <Form.Group className="mb-3">
          <Form.Label>{t("reports.category")}</Form.Label>
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
          <Form.Label>{t("reports.country")}</Form.Label>
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
          <Form.Label>{t("reports.gender")}</Form.Label>
          <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="all">{t("reports.all")}</option>
            <option value="Male">{isRTL ? "ذكر" : "Male"}</option>
            <option value="Female">{isRTL ? "أنثى" : "Female"}</option>
          </Form.Select>
        </Form.Group>
      )}

      {reportType === "byDateRange" && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>{t("reports.from")}</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t("reports.to")}</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>
        </>
      )}

      {reportType === "patientReport" && (
        <Form.Group className="mb-3">
          <Form.Label>{t("reports.patient_id")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("reports.enter_patient_id")}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </Form.Group>
      )}

      <div className="mb-3">
        <Button variant="primary" className="me-2" onClick={handleGenerateReport}>
          {t("reports.generate_report")}
        </Button>
        <Button variant="outline-success" onClick={exportPDF} disabled={!reportData}>
          {t("reports.export_pdf")}
        </Button>
      </div>

      {/* عرض تقرير المريض */}
      {reportData && reportType === "patientReport" && (
        <div>
          <h4>{t("reports.patient_report_title", { id: reportData.patientId })}</h4>
          <p>
            <strong>{t("reports.name")}:</strong> {reportData.name}
          </p>
          <p>
            <strong>{t("reports.age")}:</strong> {reportData.age}
          </p>
          <p>
            <strong>{t("reports.gender")}:</strong> {reportData.gender}
          </p>
          <p>
            <strong>{t("reports.medical_center") || "Medical Center"}:</strong> {reportData.medicalCenter}
          </p>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("reports.test_name")}</th>
                <th>{t("reports.result")}</th>
                <th>{t("reports.standard")}</th>
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
                  <th>{t("reports.category_header")}</th>
                  <th>{t("reports.number_of_cases")}</th>
                </>
              )}
              {reportType === "byCountry" && (
                <>
                  <th>{t("reports.country_header")}</th>
                  <th>{t("reports.number_of_cases")}</th>
                </>
              )}
              {reportType === "byGender" && (
                <>
                  <th>{t("reports.gender")}</th>
                  <th>{t("reports.count")}</th>
                </>
              )}
              {reportType === "byDateRange" && (
                <>
                  <th>{t("reports.month")}</th>
                  <th>{t("reports.number_of_cases")}</th>
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

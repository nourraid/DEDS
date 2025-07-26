import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Pagination,
  Modal,
} from "react-bootstrap";
import { FaFilePdf, FaPaperPlane, FaPrint } from "react-icons/fa";

const sampleReports = [
  {
    id: 1,
    testName: "Blood Sugar Test",
    date: "2025-07-20",
    pdfUrl: "https://example.com/report1.pdf",
  },
  {
    id: 2,
    testName: "Cholesterol Test",
    date: "2025-07-15",
    pdfUrl: "https://example.com/report2.pdf",
  },
];

const ReportsSection = () => {
  const [reports, setReports] = useState(sampleReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter(
    (r) =>
      r.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.date.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSendReport = (report) => {
    alert(`Report "${report.testName}" has been sent!`);
  };

  const handlePrintReport = (report) => {
    window.open(report.pdfUrl, "_blank");
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowPdfModal(true);
  };

  return (
    <Container
      className="my-4"
      style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px" }}
    >
      {/* Search */}
      <div className="d-flex justify-content-start mb-4 flex-wrap">
        <input
          type="text"
          className="form-control flex-grow-1"
          placeholder="Search by test name or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "400px", minWidth: "250px" }}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
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
              backgroundColor: "#f0f0f0",
              color: "#4a4a4a",
            }}
          >
            <tr>
              <th style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                Test Name
              </th>
              <th>Date</th>
              <th style={{ minWidth: "180px", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-center">
            {currentReports.length > 0 ? (
              currentReports.map((report, idx) => (
                <tr
                  key={report.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9fb",
                    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <td className="py-3">{report.testName}</td>
                  <td className="py-3">{report.date}</td>
                  <td className="py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-success"
                        size="sm"
                        title="Send Report"
                        onClick={() => handleSendReport(report)}
                      >
                        <FaPaperPlane />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        title="Print Report"
                        onClick={() => handlePrintReport(report)}
                      >
                        <FaPrint />
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        title="View Report"
                        onClick={() => handleViewReport(report)}
                      >
                        <FaFilePdf />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4 justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* PDF Modal */}
      <Modal
        show={showPdfModal}
        onHide={() => setShowPdfModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedReport?.testName} - Report PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          {selectedReport ? (
            <iframe
              src={selectedReport.pdfUrl}
              title="Report PDF"
              width="100%"
              height="100%"
              frameBorder="0"
            />
          ) : (
            <p>No report selected.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ReportsSection;

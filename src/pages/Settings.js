import React, { useState } from "react";
import { Accordion, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const SettingsPage = () => {
  const [languages, setLanguages] = useState(["English", "Arabic", "French", "Spanish", "Turkish"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");

  const [allowDataCollection, setAllowDataCollection] = useState(true);
  const [sendStatistics, setSendStatistics] = useState(false);

  const filteredLanguages = languages.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage("");
      setShowModal(false);
    }
  };

  const handleDeleteLanguage = (lang) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  return (
    <div className="container my-4" style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px" }}>
      <Accordion defaultActiveKey="0">
        {/* Language Settings */}
        <Accordion.Item eventKey="0" style={{margin:"10px" }}>
          <Accordion.Header> Language</Accordion.Header>
          <Accordion.Body>
            {/* Search + Add Button */}
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
              <input
                type="text"
                className="form-control flex-grow-1 me-3"
                placeholder="Search by language name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "400px", minWidth: "250px" }}
              />
              <button
                onClick={() => setShowModal(true)}
                className="btn d-flex align-items-center px-4 py-2"
                style={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  height: "42px",
                  borderRadius: "100px",
                  backgroundColor: "#5085c1ff",
                  color: "white",
                  width: "100%",
                  maxWidth: "200px",
                }}
              >
                <FaPlus className="me-2" />
                Add New Language
              </button>
            </div>

            {/* Language List */}
            {filteredLanguages.map((lang, index) => (
              <Row key={index} className="mb-2 align-items-center" 
                  style={{
                      backgroundColor: "#e9e7e766",
                      padding: "12px 20px",
                      borderRadius: "5px",
                      color: "#4586cbff",
                      fontWeight: 500,
                    }}
              >
                <Col md={8}>
                  <div
            
                  >
                    {lang}
                  </div>
                </Col>
                <Col md={4} className="text-end d-flex justify-content-end gap-2">
                  <Button variant="outline-primary" size="sm">
                    <FaEdit className="me-1" />
                    
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLanguage(lang)}>
                    <FaTrash className="me-1" />
                    
                  </Button>
                </Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" style={{margin:"10px"}}>
          <Accordion.Header> Privacy </Accordion.Header>
          <Accordion.Body>
            <Form>
           
              <Form.Check
                type="switch"
                id="send-statistics"
                label="Send Usage Statistics"
                checked={sendStatistics}
                onChange={() => setSendStatistics(!sendStatistics)}
                className="mb-3"
              />
              <Button variant="danger" onClick={() => alert("All your data has been deleted!")}>
                Delete Account Data
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>

          <Accordion.Item eventKey="2"  style={{margin:"10px"}}>
          <Accordion.Header> Data </Accordion.Header>
          <Accordion.Body>
            <Form>
           
              <Form.Check
                type="switch"
                id="send-statistics"
                label="Send Usage Statistics"
                checked={sendStatistics}
                onChange={() => setSendStatistics(!sendStatistics)}
                className="mb-3"
              />
              <Button variant="danger" onClick={() => alert("All your data has been deleted!")}>
                Delete Account Data
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>

      </Accordion>

      {/* Add Language Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter language name"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddLanguage}>Add Language</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsPage;

import React, { useEffect, useState } from "react";
import {
  Accordion,
  Row,
  Col,
  Button,
  Form,
  Modal,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import i18n from "../i18n";

const SettingsPage = () => {
  const { t } = useTranslation();

  const [languages, setLanguages] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState("");
  const [languageSwitching, setLanguageSwitching] = useState(true);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newLangName, setNewLangName] = useState("");
  const [newLangCode, setNewLangCode] = useState("");
  const [newLangDirection, setNewLangDirection] = useState("LTR");
  const [editLangId, setEditLangId] = useState(null);

  const [showLanguageToggle, setShowLanguageToggle] = useState(true);
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [canDownloadReports, setCanDownloadReports] = useState(true);

  const [dataRetentionPeriod, setDataRetentionPeriod] = useState("12");
  const [enablePdfExport, setEnablePdfExport] = useState(true);
  const [enableExcelExport, setEnableExcelExport] = useState(true);

const [dataSettings, setDataSettings] = useState({
  allow_data_sharing: false,
  allow_account_deletion: false,
  data_retention_days: 12,
});
  
useEffect(() => {
 axios.get("/api/languages")
    .then((res) => {
      // هنا res.data هو المصفوفة مباشرة
      setLanguages(res.data || []);

      // عشان نحدد اللغة الافتراضية:
      const defaultLang = res.data.find(lang => lang.is_default === 1 || lang.is_default === true);
      setDefaultLanguage(defaultLang ? defaultLang.code : "");

      setLoadingLanguages(false);
    })
    .catch(() => {
      setLanguages([]);
      setLoadingLanguages(false);
    });

  axios.get("/api/privacy-settings")
    .then((res) => {
      setPrivacyPolicy(res.data?.privacy_policy || "");
      setCanDownloadReports(res.data?.can_download_reports ?? true);
    });

  axios.get("/api/settings/data")
    .then((res) => {
      setDataSettings(res.data || {});
    });
}, []);


const handleSaveData = () => {
  axios.post("/api/settings/data", {
    allow_data_sharing: dataSettings.allow_data_sharing,
    allow_account_deletion: dataSettings.allow_account_deletion,
    data_retention_days: Number(dataSettings.data_retention_days),
  })
  .then(() => alert(t("Saved successfully")))
  .catch(() => alert(t("Error saving data")));
};

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditLangId(null);
    setNewLangName("");
    setNewLangCode("");
    setNewLangDirection("LTR");
    setShowModal(true);
  };

  const openEditModal = (lang) => {
    setEditLangId(lang.id);
    setNewLangName(lang.name);
    setNewLangCode(lang.code);
    setNewLangDirection(lang.direction);
    setShowModal(true);
  };
  const [newLangIsDefault, setNewLangIsDefault] = useState(false);


const handleSaveLanguage = async () => {
  if (!newLangName.trim() || !newLangCode.trim()) {
    alert(t("settings.language_settings.fill_required"));
    return;
  }

  const payload = {
    name: newLangName,
    code: newLangCode.toLowerCase(),
    direction: newLangDirection,
    is_active: true,
    is_default: newLangIsDefault, // تأكد من أنك تربط هذا بقيمة checkbox أو مدخل المستخدم
  };

  try {
    if (payload.is_default) {
      // إذا اختار المستخدم هذه اللغة كافتراضية، يجب إزالة علامة الافتراضية من باقي اللغات في الخادم
      await axios.post("/api/languages/unset-default");
    }

    let response;

    if (editLangId) {
      response = await axios.put(`/api/languages/${editLangId}`, payload);
      setLanguages(
        languages.map((lang) => (lang.id === response.data.id ? response.data : lang))
      );
    } else {
      response = await axios.post("/api/languages", payload);
      setLanguages([...languages, response.data]);
    }


    setShowModal(false);

    // ** تحديث لغة التطبيق فوراً باستخدام i18n.changeLanguage **
    if (payload.is_default) {
      i18n.changeLanguage(payload.code);
      document.documentElement.lang = payload.code;
      document.documentElement.dir = payload.direction === "RTL" ? "rtl" : "ltr";
      localStorage.setItem("appLanguage", payload.code);
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    alert(t("settings.language_settings.error_saving"));
  }
};



  const handleDeleteLanguage = (id) => {
    if (!window.confirm(t("settings.language_settings.confirm_delete"))) return;

    axios
      .delete(`/api/languages/${id}`)
      .then(() => {
        setLanguages(languages.filter((lang) => lang.id !== id));
      })
      .catch(() => alert(t("settings.language_settings.error_deleting")));
  };

  const handleSetDefault = (id) => {
    axios
      .put(`/api/languages/${id}`, { is_default: true })
      .then(({ data }) => {
        setLanguages(
          languages.map((lang) => ({
            ...lang,
            is_default: lang.id === data.id,
          }))
        );
      })
      .catch(() => alert(t("settings.language_settings.error_setting_default")));
  };

 const handleSavePrivacy = () => {
  axios
    .post("/api/settings", {
      privacy_policy: privacyPolicy,
      can_download_reports: canDownloadReports,
    })
    .then(() => alert(t("settings.saved_successfully")))
    .catch(() => alert(t("settings.error_saving")));
};


  if (loadingLanguages)
    return <Spinner animation="border" variant="primary" className="m-5" />;

  return (
    <div className="container my-4" style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px" }}>
      <Accordion defaultActiveKey="0">
        {/* Language Settings */}
     
        <Accordion.Item eventKey="0" style={{ margin: "10px" }}>
          <Accordion.Header>{t("settings.language_settings.title")}</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">
              <input
                type="text"
                className="form-control flex-grow-1 me-3"
                placeholder={t("settings.language_settings.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: "400px", minWidth: "250px" }}
              />
              <button
                onClick={openAddModal}
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
                {t("settings.language_settings.add_button")}
              </button>
            </div>

            {filteredLanguages.length === 0 && (
              <p>{t("settings.language_settings.no_languages")}</p>
            )}

            {filteredLanguages.map((lang) => (
              <Row
                key={lang.id}
                className="mb-2 align-items-center"
                style={{
                  backgroundColor: "#e9e7e766",
                  padding: "12px 20px",
                  borderRadius: "5px",
                  color: "#4586cbff",
                  fontWeight: 500,
                }}
              >
                <Col md={4}>{lang.name} ({lang.code})</Col>
                <Col md={3}>{lang.direction}</Col>
                <Col md={2}>
                  {lang.is_default && <strong>{t("settings.language_settings.default")}</strong>}
                </Col>
                <Col md={3} className="text-end d-flex justify-content-end gap-2">
                  {!lang.is_default && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleSetDefault(lang.id)}
                      title={t("settings.language_settings.set_default")}
                    >
                      {t("settings.language_settings.set_default")}
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => openEditModal(lang)}
                  >
                    <FaEdit className="me-1" />
                    {t("settings.actions.edit")}
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteLanguage(lang.id)}
                  >
                    <FaTrash className="me-1" />
                    {t("settings.actions.delete")}
                  </Button>
                </Col>
              </Row>
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Privacy Settings */}
        <Accordion.Item eventKey="1" style={{ margin: "10px" }}>
          <Accordion.Header>{t("settings.privacy_settings.title")}</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group controlId="privacyPolicy">
                <Form.Label>{t("settings.privacy_policy")}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="canDownloadReports" className="mt-3">
                <Form.Check
                  type="checkbox"
                  label={t("settings.can_download_reports")}
                  checked={canDownloadReports}
                  onChange={(e) => setCanDownloadReports(e.target.checked)}
                />
              </Form.Group>
               <Button variant="primary" className="mt-3" onClick={handleSavePrivacy}>
    {t("settings.save")}
  </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>

        {/* Data Settings */}
        <Accordion.Item eventKey="2" style={{ margin: "10px" }}>
          <Accordion.Header>{t("settings.data_settings.title")}</Accordion.Header>
          <Accordion.Body>
<Form.Check
  type="checkbox"
  label={t("Allow Data Sharing")}
  checked={dataSettings.allow_data_sharing}
  onChange={(e) =>
    setDataSettings(prev => ({ ...prev, allow_data_sharing: e.target.checked }))
  }
/>

<Form.Check
  type="checkbox"
  label={t("Allow Account Deletion")}
  checked={dataSettings.allow_account_deletion}
  onChange={(e) =>
    setDataSettings(prev => ({ ...prev, allow_account_deletion: e.target.checked }))
  }
/>

<Form.Group>
  <Form.Label>{t("Data Retention Period (Days)")}</Form.Label>
  <Form.Control
    type="number"
    value={dataSettings.data_retention_days}
    onChange={(e) =>
      setDataSettings(prev => ({ ...prev, data_retention_days: e.target.value }))
    }
  />
</Form.Group>

<Button variant="primary" onClick={handleSaveData}>
  {t("Save")}
</Button>


          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

  

      {/* Modal Add/Edit Language */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editLangId
              ? t("settings.language_settings.modal_edit_title")
              : t("settings.language_settings.modal_title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>{t("settings.language_settings.name")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("settings.language_settings.modal_input_name")}
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("settings.language_settings.code")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("settings.language_settings.modal_input_code")}
              value={newLangCode}
              onChange={(e) => setNewLangCode(e.target.value)}
              disabled={!!editLangId}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("settings.language_settings.direction")}</Form.Label>
            <Form.Select
              value={newLangDirection}
              onChange={(e) => setNewLangDirection(e.target.value)}
            >
              <option value="LTR">{t("settings.language_settings.ltr")}</option>
              <option value="RTL">{t("settings.language_settings.rtl")}</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("settings.language_settings.modal_cancel")}
          </Button>
          <Button variant="primary" onClick={handleSaveLanguage}>
            {t("settings.language_settings.modal_submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsPage;

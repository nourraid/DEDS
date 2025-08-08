import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initI18n } from './i18n'; // استيراد تهيئة i18n

async function startApp() {
  await initI18n();

  // تعيين اللغة والاتجاه على مستوى الوثيقة عند بدء التطبيق
  const lang = localStorage.getItem("i18nextLng") || "en"; // أو i18n.language لو متاح
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();

// مراقبة الأداء
reportWebVitals();

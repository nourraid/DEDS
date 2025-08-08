import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationES from "./locales/es/translation.json";
import translationTR from "./locales/tr/translation.json";

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
  fr: { translation: translationFR },
  es: { translation: translationES },
  tr: { translation: translationTR },
};

const fetchDefaultLanguage = async () => {
  try {
    const res = await fetch("/api/default-language");
    const data = await res.json();
    return {
      default_language: data.default_language || "en",
      direction: data.direction?.toLowerCase() || "ltr",
    };
  } catch (e) {
    console.error("Failed to fetch default language", e);
    return { default_language: "en", direction: "ltr" };
  }
};
export const initI18n = async () => {
  const { default_language, direction } = await fetchDefaultLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: default_language,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: true },
    });

  document.documentElement.dir = direction;
};

export default i18n;

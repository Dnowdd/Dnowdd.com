// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importação dos arquivos de idiomas
import pt from "../locales/pt.json";
import en from "../locales/en.json";

// Configuração de idiomas
i18n
  .use(LanguageDetector) // Detecta automaticamente o idioma do navegador
  .use(initReactI18next) // Integração com React
  .init({
    fallbackLng: "en", // Idioma padrão
    debug: true,
    resources: {
      pt: {
        translation: pt,
      },
      en: {
        translation: en,
      },
      // Adicione outros idiomas conforme necessário
    },
    interpolation: {
      escapeValue: false, // React já faz o escaping
    },
  });

export default i18n;

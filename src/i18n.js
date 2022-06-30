import i18n from "i18next"
import detector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import translation_en from "./locales/en/translation.json"
import translation_es from "./locales/es/translation.json"
import translation_gr from "./locales/gr/translation.json"
import translation_it from "./locales/it/translation.json"
import translation_rs from "./locales/rs/translation.json"


import common_en from "./locales/en/common.json"
import common_es from "./locales/es/common.json"
import navigation_en from "./locales/en/navigation.json"
import navigation_es from "./locales/es/navigation.json"

import commercial_credit_en from "./locales/en/commercial_credit.json"
import commercial_credit_es from "./locales/es/commercial_credit.json"
import credit_analysis_en from "./locales/en/credit_analysis.json"
import credit_analysis_es from "./locales/es/credit_analysis.json"
import environmental_risk_en from "./locales/en/environmental_risk.json"
import environmental_risk_es from "./locales/es/environmental_risk.json"
import credit_risk_en from "./locales/en/credit_risk.json"
import credit_risk_es from "./locales/en/credit_risk.json"
import financial_report_en from "./locales/en/financial_report.json"
import financial_report_es from "./locales/es/financial_report.json"

// the translations
const resources = {
  en: {
    translation: translation_en,
    common: common_en,
    navigation: navigation_en,
    commercial_credit: commercial_credit_en,
    credit_analysis: credit_analysis_en,
    environmental_risk: environmental_risk_en,
    credit_risk: credit_risk_en,
    financial_report: financial_report_en
  },
  es: {
    translation: translation_es,
    common: common_es,
    navigation: navigation_es,
    commercial_credit: commercial_credit_es,
    credit_analysis: credit_analysis_es,
    environmental_risk: environmental_risk_es,
    credit_risk: credit_risk_es,
    financial_report: financial_report_es
  },
  gr: {
    translation: translation_gr,
  },
  it: {
    translation: translation_it,
  },
  rs: {
    translation: translation_rs,
  }
}

const language = localStorage.getItem("I18N_LANGUAGE")
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "es")
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("I18N_LANGUAGE") || "es",
    fallbackLng: "es", // use en if detected lng is not available
    keySeparator: '.', // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n

import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

function BankServices() {
  const { language } = useLanguage();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);

  // ==================================================
  // TRANSLATIONS
  // ==================================================

  const translations = {
    en: {
      financialAccess: "SARVASETU • FINANCIAL ACCESS",
      title: "Bank & Financial Services",
      subtitle:
        "Discover financial services relevant to your profile and continue through verified official sources.",

      recommendedForYou: "RECOMMENDED FOR YOU",
      personalized: "PERSONALIZED",
      recommendedServices: "Recommended Services",
      forYourProfile: "For your profile",

      recommendationText:
        "Based on the information available in your SARVASETU profile, these financial services may be relevant to you.",

      searchPlaceholder: "Search financial services...",
      allCategories: "All Categories",
      farmers: "Farmers",
      students: "Students",
      women: "Women",
      business: "Business",
      insurancePension: "Insurance & Pension",
      general: "General",

      showing: "Showing",
      service: "service",
      services: "services",

      explore: "Explore",
      viewService: "View Service",

      noServicesFound: "No services found",
      tryAnotherSearch:
        "Try another search term or category.",

      back: "Back to Financial Services",
      verifiedFinancialService:
        "SARVASETU • VERIFIED FINANCIAL SERVICE",

      responsibleDepartment: "Responsible Department",
      whoMayBenefit: "Who may benefit?",
      requiredDocuments: "Required Documents",
      officialSource: "Official Source",
      verifiedSource: "VERIFIED SOURCE",
      visitOfficialWebsite: "Visit Official Website",

      important: "Important",
      informationNotice:
        "SARVASETU provides information and redirects users to official sources. Final eligibility, approval and service procedures are controlled by the responsible Government department or financial institution.",

      financialSecurity: "Financial Security",

      neverEnterCredentials:
        "Never enter your banking password, PIN, OTP, CVV, card number or internet-banking credentials into SARVASETU.",

      useOfficialWebsite:
        "For financial transactions, use only the verified official website or authorised financial institution.",

      safeFinancialServices:
        "Use financial services safely",

      doesNotCollect:
        "SARVASETU does not collect banking passwords, PINs, OTPs, CVVs or card credentials.",

      verifyInformation:
        "Always verify important information on the official Government or financial institution website before submitting an application.",
    },

    kn: {
      financialAccess: "ಸರ್ವಸೇತು • ಹಣಕಾಸು ಪ್ರವೇಶ",
      title: "ಬ್ಯಾಂಕ್ ಮತ್ತು ಹಣಕಾಸು ಸೇವೆಗಳು",
      subtitle:
        "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ಹಣಕಾಸು ಸೇವೆಗಳನ್ನು ಕಂಡುಹಿಡಿದು ಪರಿಶೀಲಿಸಲಾದ ಅಧಿಕೃತ ಮೂಲಗಳ ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ.",

      recommendedForYou: "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
      personalized: "ವೈಯಕ್ತಿಕಗೊಳಿಸಲಾಗಿದೆ",
      recommendedServices: "ಶಿಫಾರಸು ಮಾಡಿದ ಸೇವೆಗಳು",
      forYourProfile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗಾಗಿ",

      recommendationText:
        "ನಿಮ್ಮ SARVASETU ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಈ ಹಣಕಾಸು ಸೇವೆಗಳು ನಿಮಗೆ ಸಂಬಂಧಿಸಿರಬಹುದು.",

      searchPlaceholder: "ಹಣಕಾಸು ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ...",
      allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
      farmers: "ರೈತರು",
      students: "ವಿದ್ಯಾರ್ಥಿಗಳು",
      women: "ಮಹಿಳೆಯರು",
      business: "ವ್ಯಾಪಾರ",
      insurancePension: "ವಿಮೆ ಮತ್ತು ಪಿಂಚಣಿ",
      general: "ಸಾಮಾನ್ಯ",

      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
      service: "ಸೇವೆ",
      services: "ಸೇವೆಗಳು",

      explore: "ವೀಕ್ಷಿಸಿ",
      viewService: "ಸೇವೆ ವೀಕ್ಷಿಸಿ",

      noServicesFound: "ಯಾವುದೇ ಸೇವೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
      tryAnotherSearch:
        "ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ.",

      back: "ಹಣಕಾಸು ಸೇವೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
      verifiedFinancialService:
        "ಸರ್ವಸೇತು • ಪರಿಶೀಲಿಸಲಾದ ಹಣಕಾಸು ಸೇವೆ",

      responsibleDepartment: "ಜವಾಬ್ದಾರಿಯುತ ಇಲಾಖೆ",
      whoMayBenefit: "ಯಾರು ಪ್ರಯೋಜನ ಪಡೆಯಬಹುದು?",
      requiredDocuments: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು",
      officialSource: "ಅಧಿಕೃತ ಮೂಲ",
      verifiedSource: "ಪರಿಶೀಲಿಸಲಾದ ಮೂಲ",
      visitOfficialWebsite: "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ",

      important: "ಮುಖ್ಯ ಮಾಹಿತಿ",

      informationNotice:
        "ಸರ್ವಸೇತು ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ ಅಧಿಕೃತ ಮೂಲಗಳಿಗೆ ನಿಮ್ಮನ್ನು ಕರೆದೊಯ್ಯುತ್ತದೆ. ಅಂತಿಮ ಅರ್ಹತೆ, ಅನುಮೋದನೆ ಮತ್ತು ಸೇವಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಸಂಬಂಧಿತ ಸರ್ಕಾರಿ ಇಲಾಖೆ ಅಥವಾ ಹಣಕಾಸು ಸಂಸ್ಥೆ ನಿರ್ಧರಿಸುತ್ತದೆ.",

      financialSecurity: "ಹಣಕಾಸು ಭದ್ರತೆ",

      neverEnterCredentials:
        "ನಿಮ್ಮ ಬ್ಯಾಂಕಿಂಗ್ ಪಾಸ್‌ವರ್ಡ್, PIN, OTP, CVV, ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಂಟರ್ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳನ್ನು ಸರ್ವಸೇತುವಿನಲ್ಲಿ ನಮೂದಿಸಬೇಡಿ.",

      useOfficialWebsite:
        "ಹಣಕಾಸು ವ್ಯವಹಾರಗಳಿಗಾಗಿ ಪರಿಶೀಲಿಸಲಾದ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಅಧಿಕೃತ ಹಣಕಾಸು ಸಂಸ್ಥೆಯನ್ನು ಮಾತ್ರ ಬಳಸಿ.",

      safeFinancialServices:
        "ಹಣಕಾಸು ಸೇವೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಳಸಿ",

      doesNotCollect:
        "ಸರ್ವಸೇತು ಬ್ಯಾಂಕಿಂಗ್ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು, PIN, OTP, CVV ಅಥವಾ ಕಾರ್ಡ್ ವಿವರಗಳನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",

      verifyInformation:
        "ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಅಥವಾ ಹಣಕಾಸು ಸಂಸ್ಥೆಯ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಮುಖ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    },

    hi: {
      financialAccess: "सर्वसेतु • वित्तीय पहुंच",
      title: "बैंक और वित्तीय सेवाएँ",
      subtitle:
        "अपने प्रोफ़ाइल से संबंधित वित्तीय सेवाएँ खोजें और सत्यापित आधिकारिक स्रोतों के माध्यम से आगे बढ़ें।",

      recommendedForYou: "आपके लिए अनुशंसित",
      personalized: "व्यक्तिगत",
      recommendedServices: "अनुशंसित सेवाएँ",
      forYourProfile: "आपकी प्रोफ़ाइल के लिए",

      recommendationText:
        "आपकी SARVASETU प्रोफ़ाइल में उपलब्ध जानकारी के आधार पर ये वित्तीय सेवाएँ आपके लिए उपयोगी हो सकती हैं।",

      searchPlaceholder: "वित्तीय सेवाएँ खोजें...",
      allCategories: "सभी श्रेणियाँ",
      farmers: "किसान",
      students: "छात्र",
      women: "महिलाएँ",
      business: "व्यवसाय",
      insurancePension: "बीमा और पेंशन",
      general: "सामान्य",

      showing: "दिखाया जा रहा है",
      service: "सेवा",
      services: "सेवाएँ",

      explore: "देखें",
      viewService: "सेवा देखें",

      noServicesFound: "कोई सेवा नहीं मिली",
      tryAnotherSearch:
        "कोई अन्य खोज शब्द या श्रेणी आज़माएँ।",

      back: "वित्तीय सेवाओं पर वापस जाएँ",
      verifiedFinancialService:
        "सर्वसेतु • सत्यापित वित्तीय सेवा",

      responsibleDepartment: "जिम्मेदार विभाग",
      whoMayBenefit: "कौन लाभ प्राप्त कर सकता है?",
      requiredDocuments: "आवश्यक दस्तावेज़",
      officialSource: "आधिकारिक स्रोत",
      verifiedSource: "सत्यापित स्रोत",
      visitOfficialWebsite: "आधिकारिक वेबसाइट पर जाएँ",

      important: "महत्वपूर्ण",

      informationNotice:
        "सर्वसेतु जानकारी प्रदान करता है और उपयोगकर्ताओं को आधिकारिक स्रोतों पर भेजता है। अंतिम पात्रता, स्वीकृति और सेवा प्रक्रियाएँ संबंधित सरकारी विभाग या वित्तीय संस्था द्वारा निर्धारित की जाती हैं।",

      financialSecurity: "वित्तीय सुरक्षा",

      neverEnterCredentials:
        "SARVASETU में अपना बैंकिंग पासवर्ड, PIN, OTP, CVV, कार्ड नंबर या इंटरनेट बैंकिंग विवरण कभी दर्ज न करें।",

      useOfficialWebsite:
        "वित्तीय लेनदेन के लिए केवल सत्यापित आधिकारिक वेबसाइट या अधिकृत वित्तीय संस्था का उपयोग करें।",

      safeFinancialServices:
        "वित्तीय सेवाओं का सुरक्षित उपयोग करें",

      doesNotCollect:
        "SARVASETU बैंकिंग पासवर्ड, PIN, OTP, CVV या कार्ड विवरण एकत्र नहीं करता है।",

      verifyInformation:
        "आवेदन जमा करने से पहले आधिकारिक सरकारी या वित्तीय संस्था की वेबसाइट पर महत्वपूर्ण जानकारी सत्यापित करें।",
    },
  };

  const t = translations[language] || translations.en;

  // ==================================================
  // SERVICE TRANSLATIONS
  // ==================================================

  const serviceTranslations = {
    1: {
      kn: {
        title: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನ್-ಧನ್ ಯೋಜನೆ",
        description:
          "ಮೂಲಭೂತ ಬ್ಯಾಂಕಿಂಗ್, ಉಳಿತಾಯ, ಹಣ ವರ್ಗಾವಣೆ, ಸಾಲ, ವಿಮೆ ಮತ್ತು ಪಿಂಚಣಿ ಸೇವೆಗಳಿಗೆ ಪ್ರವೇಶ ಒದಗಿಸುವ ಹಣಕಾಸು ಒಳಗೊಳ್ಳುವಿಕೆ ಕಾರ್ಯಕ್ರಮ.",
        department:
          "ಹಣಕಾಸು ಸೇವೆಗಳ ಇಲಾಖೆ, ಹಣಕಾಸು ಸಚಿವಾಲಯ",
        documents: [
          "ಬ್ಯಾಂಕ್ ಸ್ವೀಕರಿಸುವ ಗುರುತಿನ ದಾಖಲೆ",
          "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ವಿಳಾಸದ ದಾಖಲೆ",
          "ಬ್ಯಾಂಕ್ ಕೇಳುವ ಹೆಚ್ಚುವರಿ ದಾಖಲೆಗಳು",
        ],
        eligibility:
          "ಬ್ಯಾಂಕಿಂಗ್ ಸೌಲಭ್ಯವಿಲ್ಲದ ವಯಸ್ಕರಿಗೆ ಬ್ಯಾಂಕಿಂಗ್ ಪ್ರವೇಶ ಒದಗಿಸುವ ಉದ್ದೇಶ ಹೊಂದಿದ್ದು, ಅನ್ವಯಿಸುವ ಖಾತೆ ತೆರೆಯುವ ನಿಯಮಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.",
      },
      hi: {
        title: "प्रधानमंत्री जन-धन योजना",
        description:
          "मूलभूत बैंकिंग, बचत, धन हस्तांतरण, ऋण, बीमा और पेंशन सेवाओं तक पहुंच प्रदान करने वाला वित्तीय समावेशन कार्यक्रम।",
        department:
          "वित्तीय सेवा विभाग, वित्त मंत्रालय",
        documents: [
          "बैंक द्वारा स्वीकार किया गया पहचान प्रमाण",
          "जहाँ आवश्यक हो वहाँ पता प्रमाण",
          "बैंक द्वारा मांगे गए अतिरिक्त दस्तावेज़",
        ],
        eligibility:
          "मुख्य रूप से बैंकिंग सुविधा से वंचित वयस्कों को बैंकिंग पहुंच प्रदान करने के लिए है और लागू खाता खोलने की आवश्यकताओं के अधीन है।",
      },
    },

    2: {
      kn: {
        title: "ಜನಸಮರ್ಥ ಪೋರ್ಟಲ್",
        description:
          "ಸರ್ಕಾರಿ ಸಾಲ-ಸಂಬಂಧಿತ ಯೋಜನೆಗಳನ್ನು ಫಲಾನುಭವಿಗಳು ಮತ್ತು ಭಾಗವಹಿಸುವ ಸಾಲದಾತರು ಹಾಗೂ ಹಣಕಾಸು ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್.",
        department:
          "ಹಣಕಾಸು ಸೇವೆಗಳ ಇಲಾಖೆ, ಹಣಕಾಸು ಸಚಿವಾಲಯ",
        documents: [
          "ಆಯ್ಕೆ ಮಾಡಿದ ಯೋಜನೆಯ ಆಧಾರದ ಮೇಲೆ ದಾಖಲೆಗಳು ಬದಲಾಗುತ್ತವೆ",
          "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಗುರುತು ಮತ್ತು ಹಣಕಾಸು ದಾಖಲೆಗಳು",
          "ಅರ್ಜಿಯ ಸಮಯದಲ್ಲಿ ಸೂಚಿಸಲಾದ ಹೆಚ್ಚುವರಿ ದಾಖಲೆಗಳು",
        ],
        eligibility:
          "ಪೋರ್ಟಲ್ ಮೂಲಕ ಆಯ್ಕೆ ಮಾಡಿದ ನಿರ್ದಿಷ್ಟ ಸಾಲ-ಸಂಬಂಧಿತ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಮೇಲೆ ಅರ್ಹತೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ.",
      },
      hi: {
        title: "जनसमर्थ पोर्टल",
        description:
          "सरकार की क्रेडिट-लिंक्ड योजनाओं को लाभार्थियों, ऋणदाताओं और वित्तीय संस्थानों से जोड़ने वाला राष्ट्रीय पोर्टल।",
        department:
          "वित्तीय सेवा विभाग, वित्त मंत्रालय",
        documents: [
          "चयनित योजना के अनुसार दस्तावेज़",
          "जहाँ आवश्यक हो वहाँ पहचान और वित्तीय दस्तावेज़",
          "आवेदन के दौरान बताए गए अतिरिक्त दस्तावेज़",
        ],
        eligibility:
          "पात्रता पोर्टल के माध्यम से चुनी गई विशेष क्रेडिट-लिंक्ड सरकारी योजना पर निर्भर करती है।",
      },
    },

    3: {
      kn: {
        title: "PM-KISAN ಹಣಕಾಸು ನೆರವು",
        description:
          "ಅರ್ಹ ರೈತರಿಗೆ ಯೋಜನೆಯ ಮಾಹಿತಿ, ನೋಂದಣಿ ಸೌಲಭ್ಯ ಮತ್ತು ಫಲಾನುಭವಿ ಸ್ಥಿತಿ ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ಅಧಿಕೃತ PM-KISAN ಸೇವೆಗಳು ಸಹಾಯ ಮಾಡುತ್ತವೆ.",
        department:
          "ಕೃಷಿ ಮತ್ತು ರೈತರ ಕಲ್ಯಾಣ ಇಲಾಖೆ",
        documents: [
          "ರೈತ ನೋಂದಣಿಗೆ ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿ",
          "ಅಧಿಕೃತ ಪ್ರಕ್ರಿಯೆಯ ಪ್ರಕಾರ ಬ್ಯಾಂಕ್ ಖಾತೆ ಮಾಹಿತಿ",
          "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಸೂಚಿಸುವ ಹೆಚ್ಚುವರಿ ದಾಖಲೆಗಳು ಅಥವಾ ಪರಿಶೀಲನೆ",
        ],
        eligibility:
          "PM-KISAN ಯೋಜನೆಯ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಅನ್ವಯಿಸುವ ಹೊರತಾಗುವಿಕೆ ಮಾನದಂಡಗಳ ಪ್ರಕಾರ ಅರ್ಹತೆ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ.",
      },
      hi: {
        title: "PM-KISAN वित्तीय सहायता",
        description:
          "आधिकारिक PM-KISAN सेवाएँ पात्र किसानों को योजना की जानकारी, पंजीकरण और लाभार्थी स्थिति सेवाओं तक पहुंच प्रदान करती हैं।",
        department:
          "कृषि एवं किसान कल्याण विभाग",
        documents: [
          "किसान पंजीकरण के लिए आवश्यक जानकारी",
          "आधिकारिक प्रक्रिया के अनुसार बैंक खाता जानकारी",
          "आधिकारिक पोर्टल द्वारा मांगे गए अतिरिक्त दस्तावेज़ या सत्यापन",
        ],
        eligibility:
          "पात्रता PM-KISAN योजना के दिशा-निर्देशों और लागू बहिष्करण मानदंडों के अनुसार निर्धारित की जाती है।",
      },
    },

    4: {
      kn: {
        title: "ವಿಮೆ ಮತ್ತು ಪಿಂಚಣಿ ಸೇವೆಗಳು",
        description:
          "ವಿಮೆ ಮತ್ತು ಪಿಂಚಣಿ ಸಂಬಂಧಿತ ಸೇವೆಗಳನ್ನು ಒಳಗೊಂಡ ಸರ್ಕಾರಿ ಹಣಕಾಸು ಭದ್ರತಾ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
        department:
          "ಹಣಕಾಸು ಸೇವೆಗಳ ಇಲಾಖೆ, ಹಣಕಾಸು ಸಚಿವಾಲಯ",
        documents: [
          "ಗುರುತಿನ ದಾಖಲೆ",
          "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು",
          "ಆಯ್ಕೆ ಮಾಡಿದ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು",
        ],
        eligibility:
          "ನಿರ್ದಿಷ್ಟ ವಿಮೆ ಅಥವಾ ಪಿಂಚಣಿ ಕಾರ್ಯಕ್ರಮದ ಪ್ರಕಾರ ಅರ್ಹತೆ ಬದಲಾಗುತ್ತದೆ.",
      },
      hi: {
        title: "बीमा और पेंशन सेवाएँ",
        description:
          "बीमा और पेंशन से संबंधित सरकारी वित्तीय सुरक्षा कार्यक्रमों को देखें।",
        department:
          "वित्तीय सेवा विभाग, वित्त मंत्रालय",
        documents: [
          "पहचान प्रमाण",
          "जहाँ आवश्यक हो वहाँ बैंक खाता विवरण",
          "चयनित कार्यक्रम के अनुसार आवश्यक दस्तावेज़",
        ],
        eligibility:
          "पात्रता संबंधित बीमा या पेंशन कार्यक्रम के अनुसार अलग-अलग होती है।",
      },
    },

    5: {
      kn: {
        title: "ವಿದ್ಯಾರ್ಥಿ ಹಣಕಾಸು ನೆರವು",
        description:
          "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳ ಹಣಕಾಸು ಅಗತ್ಯಗಳಿಗೆ ಸಹಾಯ ಮಾಡುವ ಸರ್ಕಾರಿ ಹಣಕಾಸು ಮತ್ತು ಸಾಲ ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
        department:
          "ಆಯ್ಕೆ ಮಾಡಿದ ಸರ್ಕಾರಿ ಕಾರ್ಯಕ್ರಮದ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ",
        documents: [
          "ವಿದ್ಯಾರ್ಥಿ ಗುರುತಿನ ದಾಖಲೆ",
          "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಶೈಕ್ಷಣಿಕ ದಾಖಲೆಗಳು",
          "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಆದಾಯ ಅಥವಾ ಅರ್ಹತಾ ದಾಖಲೆಗಳು",
        ],
        eligibility:
          "ನಿರ್ದಿಷ್ಟ ಸರ್ಕಾರಿ ಕಾರ್ಯಕ್ರಮ ಅಥವಾ ಹಣಕಾಸು ಸೇವೆಯ ಮೇಲೆ ಅರ್ಹತೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ.",
      },
      hi: {
        title: "छात्र वित्तीय सहायता",
        description:
          "शिक्षा और छात्रों की वित्तीय आवश्यकताओं में सहायता करने वाली सरकारी वित्तीय और क्रेडिट सेवाओं को देखें।",
        department:
          "चयनित सरकारी कार्यक्रम पर निर्भर करता है",
        documents: [
          "छात्र पहचान प्रमाण",
          "जहाँ आवश्यक हो वहाँ शैक्षणिक दस्तावेज़",
          "जहाँ लागू हो वहाँ आय या पात्रता दस्तावेज़",
        ],
        eligibility:
          "पात्रता संबंधित सरकारी कार्यक्रम या वित्तीय सेवा पर निर्भर करती है।",
      },
    },

    6: {
      kn: {
        title: "ಮಹಿಳಾ ಹಣಕಾಸು ನೆರವು",
        description:
          "ಮಹಿಳೆಯರು, ಉಳಿತಾಯ, ಉದ್ಯಮಶೀಲತೆ ಮತ್ತು ಹಣಕಾಸು ಒಳಗೊಳ್ಳುವಿಕೆಗೆ ಸಹಾಯ ಮಾಡುವ ಸರ್ಕಾರಿ ಹಣಕಾಸು ಸೇವೆಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
        department:
          "ಆಯ್ಕೆ ಮಾಡಿದ ಸರ್ಕಾರಿ ಕಾರ್ಯಕ್ರಮದ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ",
        documents: [
          "ಗುರುತಿನ ದಾಖಲೆ",
          "ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ವಿಳಾಸದ ದಾಖಲೆ",
          "ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಅರ್ಹತಾ ದಾಖಲೆಗಳು",
        ],
        eligibility:
          "ನಿರ್ದಿಷ್ಟ ಕಾರ್ಯಕ್ರಮ ಅಥವಾ ಹಣಕಾಸು ಸೇವೆಯ ಮೇಲೆ ಅರ್ಹತೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ.",
      },
      hi: {
        title: "महिला वित्तीय सहायता",
        description:
          "महिलाओं, बचत, उद्यमिता और वित्तीय समावेशन का समर्थन करने वाली सरकारी वित्तीय सेवाओं और कार्यक्रमों को देखें।",
        department:
          "चयनित सरकारी कार्यक्रम पर निर्भर करता है",
        documents: [
          "पहचान प्रमाण",
          "जहाँ आवश्यक हो वहाँ पता प्रमाण",
          "कार्यक्रम से संबंधित पात्रता दस्तावेज़",
        ],
        eligibility:
          "पात्रता संबंधित कार्यक्रम या वित्तीय सेवा पर निर्भर करती है।",
      },
    },
  };

  // ==================================================
  // SERVICES
  // ==================================================

  const services = [
    {
      id: 1,
      title: "Pradhan Mantri Jan-Dhan Yojana",
      category: "General",
      description:
        "A financial inclusion programme providing access to basic banking, savings, remittance, credit, insurance and pension services.",
      department:
        "Department of Financial Services, Ministry of Finance",
      documents: [
        "Identity proof as accepted by the bank",
        "Address proof where applicable",
        "Additional documents requested by the bank",
      ],
      eligibility:
        "Primarily intended to provide banking access to unbanked adults, subject to applicable account-opening requirements.",
      sourceName: "Department of Financial Services",
      sourceUrl:
        "https://www.financialservices.gov.in/pradhan-mantri-jan-dhan-yojana-pmjdy",
    },

    {
      id: 2,
      title: "JanSamarth Portal",
      category: "Business",
      description:
        "A national portal for credit-linked Government schemes that connects beneficiaries with participating lenders and financial institutions.",
      department:
        "Department of Financial Services, Ministry of Finance",
      documents: [
        "Documents depend on the selected scheme",
        "Identity and financial documents where required",
        "Additional documents specified during application",
      ],
      eligibility:
        "Eligibility depends on the specific credit-linked Government scheme selected through the portal.",
      sourceName: "Department of Financial Services",
      sourceUrl:
        "https://financialservices.gov.in/jansamarth",
    },

    {
      id: 3,
      title: "PM-KISAN Financial Support",
      category: "Farmers",
      description:
        "Official PM-KISAN services allow eligible farmers to access scheme information, registration facilities and beneficiary status services.",
      department:
        "Department of Agriculture & Farmers Welfare",
      documents: [
        "Information required for farmer registration",
        "Bank account information as required by the official process",
        "Additional documents or verification specified by the official portal",
      ],
      eligibility:
        "Eligibility is determined according to PM-KISAN scheme guidelines and applicable exclusion criteria.",
      sourceName: "PM-KISAN",
      sourceUrl:
        "https://www.pmkisan.gov.in/",
    },

    {
      id: 4,
      title: "Insurance & Pension Services",
      category: "Insurance & Pension",
      description:
        "Explore Government financial-security programmes covering insurance and pension-related services.",
      department:
        "Department of Financial Services, Ministry of Finance",
      documents: [
        "Identity proof",
        "Bank account details where required",
        "Documents specified by the selected programme",
      ],
      eligibility:
        "Eligibility varies according to the specific insurance or pension programme.",
      sourceName: "Department of Financial Services",
      sourceUrl:
        "https://financialservices.gov.in/schemes-and-services",
    },

    {
      id: 5,
      title: "Student Financial Assistance",
      category: "Students",
      description:
        "Explore Government-linked financial and credit services that may support education and student-related financial needs.",
      department:
        "Depends on the selected Government programme",
      documents: [
        "Student identity proof",
        "Educational documents where required",
        "Income or eligibility documents where applicable",
      ],
      eligibility:
        "Eligibility depends on the particular Government programme or financial service.",
      sourceName: "National Government Services Portal",
      sourceUrl:
        "https://services.india.gov.in/",
    },

    {
      id: 6,
      title: "Women Financial Support",
      category: "Women",
      description:
        "Explore Government financial services and programmes that may support women, savings, entrepreneurship and financial inclusion.",
      department:
        "Depends on the selected Government programme",
      documents: [
        "Identity proof",
        "Address proof where required",
        "Programme-specific eligibility documents",
      ],
      eligibility:
        "Eligibility depends on the particular programme or financial service.",
      sourceName: "Department of Financial Services",
      sourceUrl:
        "https://financialservices.gov.in/schemes-and-services",
    },
  ];

  // ==================================================
  // CATEGORY LABEL
  // ==================================================

  const getCategoryLabel = (serviceCategory) => {
    if (serviceCategory === "Farmers") return t.farmers;
    if (serviceCategory === "Students") return t.students;
    if (serviceCategory === "Women") return t.women;
    if (serviceCategory === "Business") return t.business;

    if (serviceCategory === "Insurance & Pension") {
      return t.insurancePension;
    }

    return t.general;
  };

  // ==================================================
  // GET TRANSLATED SERVICE
  // ==================================================

  const getTranslatedService = (service) => {
    const translation =
      serviceTranslations[service.id]?.[language];

    if (!translation) {
      return service;
    }

    return {
      ...service,
      ...translation,
    };
  };

  // ==================================================
  // USER PROFILE
  // ==================================================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("USER DATA ERROR:", error);
    user = null;
  }

  const userOccupation =
    String(user?.occupation || "")
      .toLowerCase()
      .trim();

  const userGender =
    String(user?.gender || "")
      .toLowerCase()
      .trim();

  // ==================================================
  // PERSONALIZED CATEGORY
  // ==================================================

  let recommendedCategory = "General";

  if (
    userOccupation.includes("farmer") ||
    userOccupation.includes("agriculture") ||
    userOccupation.includes("agricultur")
  ) {
    recommendedCategory = "Farmers";
  } else if (
    userOccupation.includes("student") ||
    userOccupation.includes("education")
  ) {
    recommendedCategory = "Students";
  } else if (
    userOccupation.includes("business") ||
    userOccupation.includes("entrepreneur") ||
    userOccupation.includes("self employed") ||
    userOccupation.includes("self-employed")
  ) {
    recommendedCategory = "Business";
  } else if (
    userGender === "female" ||
    userGender === "woman" ||
    userGender === "women"
  ) {
    recommendedCategory = "Women";
  }

  // ==================================================
  // RECOMMENDED SERVICES
  // ==================================================

  const recommendedServices = services.filter(
    (service) =>
      service.category === recommendedCategory
  );

  // ==================================================
  // FILTER
  // ==================================================

  const filteredServices = services.filter((service) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      service.title
        .toLowerCase()
        .includes(searchText) ||
      service.description
        .toLowerCase()
        .includes(searchText) ||
      service.category
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" ||
      service.category === category;

    return matchesSearch && matchesCategory;
  });

  // ==================================================
  // OPEN OFFICIAL SOURCE
  // ==================================================

  const openOfficialSource = () => {
    if (!selectedService?.sourceUrl) {
      alert("Official source is currently unavailable.");
      return;
    }

    window.open(
      selectedService.sourceUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==================================================
  // DETAILS VIEW
  // ==================================================

  if (selectedService) {
    const displayService =
      getTranslatedService(selectedService);

    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            onClick={() => setSelectedService(null)}
            style={styles.backButton}
          >
            {t.back}
          </button>

          <div style={styles.detailsCard}>
            <div style={styles.verifiedLine}>
              {t.verifiedFinancialService}
            </div>

            <h1 style={styles.detailsTitle}>
              {displayService.title}
            </h1>

            <span style={styles.detailsCategory}>
              {getCategoryLabel(
                displayService.category
              )}
            </span>

            <p style={styles.detailsDescription}>
              {displayService.description}
            </p>

            <div style={styles.infoSection}>
              <h2 style={styles.sectionTitle}>
                {t.responsibleDepartment}
              </h2>

              <p style={styles.sectionText}>
                {displayService.department}
              </p>
            </div>

            <div style={styles.infoSection}>
              <h2 style={styles.sectionTitle}>
                {t.whoMayBenefit}
              </h2>

              <p style={styles.sectionText}>
                {displayService.eligibility}
              </p>
            </div>

            <div style={styles.infoSection}>
              <h2 style={styles.sectionTitle}>
                {t.requiredDocuments}
              </h2>

              <div style={styles.documentList}>
                {displayService.documents.map(
                  (document, index) => (
                    <div
                      key={index}
                      style={styles.documentItem}
                    >
                      {document}
                    </div>
                  )
                )}
              </div>
            </div>

            <div style={styles.infoSection}>
              <h2 style={styles.sectionTitle}>
                {t.officialSource}
              </h2>

              <div style={styles.sourceBox}>
                <div>
                  <span style={styles.sourceLabel}>
                    {t.verifiedSource}
                  </span>

                  <strong style={styles.sourceName}>
                    {displayService.sourceName}
                  </strong>
                </div>

                <button
                  onClick={openOfficialSource}
                  style={styles.officialButton}
                >
                  {t.visitOfficialWebsite}
                </button>
              </div>
            </div>

            <div style={styles.importantNotice}>
              <div style={styles.importantTitle}>
                {t.important}
              </div>

              <p>{t.informationNotice}</p>
            </div>

            <div style={styles.securityNotice}>
              <div style={styles.securityTitle}>
                {t.financialSecurity}
              </div>

              <p>{t.neverEnterCredentials}</p>

              <p>{t.useOfficialWebsite}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.label}>
            {t.financialAccess}
          </p>

          <h1 style={styles.title}>
            {t.title}
          </h1>

          <p style={styles.subtitle}>
            {t.subtitle}
          </p>
        </div>

        {/* Recommendation */}
        <div style={styles.recommendationCard}>
          <div style={styles.recommendationContent}>
            <div style={styles.recommendationLabel}>
              {t.recommendedForYou}
            </div>

            <h2 style={styles.recommendationTitle}>
              {getCategoryLabel(
                recommendedCategory
              )}
            </h2>

            <p style={styles.recommendationText}>
              {t.recommendationText}
            </p>
          </div>
        </div>

        {/* Recommended Services */}
        {recommendedServices.length > 0 && (
          <div style={styles.recommendedSection}>
            <div style={styles.sectionHeaderRow}>
              <div>
                <span style={styles.smallLabel}>
                  {t.personalized}
                </span>

                <h2 style={styles.recommendedHeading}>
                  {t.recommendedServices}
                </h2>
              </div>

              <span style={styles.recommendedBadge}>
                {t.forYourProfile}
              </span>
            </div>

            <div style={styles.recommendedGrid}>
              {recommendedServices.map((service) => {
                const displayService =
                  getTranslatedService(service);

                return (
                  <div
                    key={service.id}
                    style={styles.recommendedCard}
                  >
                    <div>
                      <h3
                        style={styles.recommendedTitle}
                      >
                        {displayService.title}
                      </h3>

                      <p
                        style={
                          styles.recommendedDescription
                        }
                      >
                        {displayService.description}
                      </p>

                      <button
                        style={styles.recommendedButton}
                        onClick={() =>
                          setSelectedService(service)
                        }
                      >
                        {t.explore}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div style={styles.filterBox}>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.searchInput}
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              {t.allCategories}
            </option>

            <option value="Farmers">
              {t.farmers}
            </option>

            <option value="Students">
              {t.students}
            </option>

            <option value="Women">
              {t.women}
            </option>

            <option value="Business">
              {t.business}
            </option>

            <option value="Insurance & Pension">
              {t.insurancePension}
            </option>

            <option value="General">
              {t.general}
            </option>
          </select>
        </div>

        {/* Result Count */}
        <div style={styles.resultText}>
          {t.showing} {filteredServices.length}{" "}
          {filteredServices.length === 1
            ? t.service
            : t.services}
        </div>

        {/* Services */}
        <div style={styles.grid}>
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const displayService =
                getTranslatedService(service);

              return (
                <div
                  key={service.id}
                  style={styles.card}
                >
                  <span style={styles.category}>
                    {getCategoryLabel(
                      service.category
                    )}
                  </span>

                  <h2 style={styles.cardTitle}>
                    {displayService.title}
                  </h2>

                  <p style={styles.cardDescription}>
                    {displayService.description}
                  </p>

                  <button
                    style={styles.viewButton}
                    onClick={() =>
                      setSelectedService(service)
                    }
                  >
                    {t.viewService}
                  </button>
                </div>
              );
            })
          ) : (
            <div style={styles.emptyState}>
              <h2 style={styles.emptyTitle}>
                {t.noServicesFound}
              </h2>

              <p style={styles.emptyText}>
                {t.tryAnotherSearch}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Security Notice */}
        <div style={styles.bottomNotice}>
          <div style={styles.bottomNoticeTitle}>
            {t.safeFinancialServices}
          </div>

          <p>{t.doesNotCollect}</p>

          <p>{t.verifyInformation}</p>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F1E3",
    padding: "34px 20px 60px",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
    color: "#3E4435",
  },

  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  label: {
    fontSize: "11px",
    letterSpacing: "2px",
    fontWeight: "700",
    color: "#81785A",
    margin: "0 0 9px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 12px",
    color: "#3E4435",
    letterSpacing: "-0.7px",
  },

  subtitle: {
    maxWidth: "720px",
    margin: "0 auto",
    color: "#6E7168",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  recommendationCard: {
    background: "#596B5A",
    color: "#F7F1E3",
    borderRadius: "16px",
    padding: "25px 28px",
    marginBottom: "32px",
    boxShadow:
      "0 8px 22px rgba(62, 68, 53, 0.12)",
  },

  recommendationContent: {
    maxWidth: "800px",
  },

  recommendationLabel: {
    fontSize: "10px",
    letterSpacing: "1.8px",
    fontWeight: "700",
    color: "#EBE1C6",
    marginBottom: "6px",
  },

  recommendationTitle: {
    fontSize: "24px",
    margin: "0 0 7px",
    color: "#F7F1E3",
  },

  recommendationText: {
    margin: 0,
    color: "#E7E9E2",
    fontSize: "13px",
    lineHeight: "1.65",
  },

  recommendedSection: {
    marginBottom: "34px",
  },

  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },

  smallLabel: {
    fontSize: "10px",
    letterSpacing: "1.8px",
    color: "#81785A",
    fontWeight: "700",
  },

  recommendedHeading: {
    margin: "4px 0 0",
    fontSize: "24px",
    color: "#3E4435",
  },

  recommendedBadge: {
    background: "#EBE1C6",
    color: "#596B5A",
    borderRadius: "20px",
    padding: "7px 12px",
    fontSize: "11px",
    fontWeight: "700",
  },

  recommendedGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  recommendedCard: {
    background: "#F2EEE1",
    border: "1px solid #C8C1AA",
    borderRadius: "14px",
    padding: "20px",
  },

  recommendedTitle: {
    margin: "0 0 8px",
    fontSize: "17px",
    color: "#3E4435",
  },

  recommendedDescription: {
    margin: "0 0 14px",
    fontSize: "13px",
    color: "#6E7168",
    lineHeight: "1.6",
  },

  recommendedButton: {
    border: "none",
    background: "#C496A1",
    color: "#3E4435",
    padding: "9px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
  },

  filterBox: {
    display: "flex",
    gap: "14px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "250px",
    padding: "13px 15px",
    border: "1px solid #C8C1AA",
    borderRadius: "10px",
    background: "#F2EEE1",
    color: "#3E4435",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  select: {
    padding: "13px 15px",
    border: "1px solid #C8C1AA",
    borderRadius: "10px",
    background: "#F2EEE1",
    color: "#3E4435",
    fontSize: "14px",
    cursor: "pointer",
    minWidth: "190px",
    outline: "none",
  },

  resultText: {
    fontSize: "12px",
    color: "#81785A",
    marginBottom: "18px",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#F2EEE1",
    border: "1px solid #C8C1AA",
    borderRadius: "15px",
    padding: "23px",
    boxShadow:
      "0 5px 16px rgba(62, 68, 53, 0.05)",
  },

  category: {
    display: "inline-block",
    background: "#E1E5DB",
    color: "#596B5A",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "19px",
    margin: "4px 0 10px",
    color: "#3E4435",
    lineHeight: "1.35",
  },

  cardDescription: {
    fontSize: "13px",
    lineHeight: "1.7",
    color: "#6E7168",
    minHeight: "90px",
    margin: 0,
  },

  viewButton: {
    width: "100%",
    marginTop: "17px",
    border: "none",
    background: "#596B5A",
    color: "#F7F1E3",
    padding: "11px 15px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#596B5A",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "20px",
    padding: "4px 0",
  },

  detailsCard: {
    background: "#F2EEE1",
    border: "1px solid #C8C1AA",
    borderRadius: "17px",
    padding: "32px",
    maxWidth: "850px",
    margin: "0 auto",
    boxShadow:
      "0 8px 24px rgba(62, 68, 53, 0.07)",
  },

  verifiedLine: {
    fontSize: "10px",
    letterSpacing: "1.7px",
    fontWeight: "700",
    color: "#81785A",
    marginBottom: "12px",
  },

  detailsTitle: {
    fontSize: "31px",
    margin: "0 0 14px",
    color: "#3E4435",
    lineHeight: "1.25",
  },

  detailsCategory: {
    display: "inline-block",
    background: "#E1E5DB",
    color: "#596B5A",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  detailsDescription: {
    fontSize: "15px",
    lineHeight: "1.75",
    color: "#62665D",
    margin: "24px 0",
  },

  infoSection: {
    borderTop: "1px solid #C8C1AA",
    paddingTop: "21px",
    marginTop: "24px",
  },

  sectionTitle: {
    fontSize: "18px",
    color: "#3E4435",
    margin: "0 0 9px",
  },

  sectionText: {
    color: "#62665D",
    lineHeight: "1.7",
    fontSize: "14px",
    margin: 0,
  },

  documentList: {
    display: "grid",
    gap: "8px",
  },

  documentItem: {
    background: "#EBE1C6",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#596B5A",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  sourceBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "17px",
    background: "#EBE1C6",
    borderRadius: "11px",
    flexWrap: "wrap",
  },

  sourceLabel: {
    display: "block",
    fontSize: "9px",
    letterSpacing: "1.5px",
    color: "#81785A",
    fontWeight: "700",
    marginBottom: "5px",
  },

  sourceName: {
    display: "block",
    color: "#3E4435",
    fontSize: "14px",
  },

  officialButton: {
    border: "none",
    background: "#C496A1",
    color: "#3E4435",
    padding: "11px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  importantNotice: {
    marginTop: "27px",
    padding: "18px",
    background: "#EBE1C6",
    borderRadius: "11px",
    border: "1px solid #C8C1AA",
    color: "#62665D",
    lineHeight: "1.65",
    fontSize: "13px",
  },

  importantTitle: {
    color: "#3E4435",
    fontWeight: "700",
    marginBottom: "7px",
  },

  securityNotice: {
    marginTop: "16px",
    padding: "18px",
    background: "#E1E5DB",
    borderRadius: "11px",
    border: "1px solid #C8C1AA",
    color: "#596B5A",
    lineHeight: "1.65",
    fontSize: "13px",
  },

  securityTitle: {
    fontWeight: "700",
    color: "#3E4435",
    marginBottom: "7px",
  },

  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    background: "#F2EEE1",
    border: "1px solid #C8C1AA",
    borderRadius: "15px",
    padding: "55px 20px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    color: "#3E4435",
    fontSize: "20px",
  },

  emptyText: {
    margin: 0,
    color: "#81785A",
    fontSize: "13px",
  },

  bottomNotice: {
    marginTop: "32px",
    padding: "20px",
    background: "#596B5A",
    color: "#F7F1E3",
    borderRadius: "14px",
    lineHeight: "1.65",
    fontSize: "13px",
  },

  bottomNoticeTitle: {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "8px",
  },
};

export default BankServices;
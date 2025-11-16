"use client"
import { useTheme } from "@/components/ThemeContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LegalGuide() {
  const { data: session, status } = useSession();
  const { darkMode } = useTheme();
  const [language, setLanguage] = useState('en');

  // Comprehensive translations for all content
  const translations = {
    en: {
      pageTitle: "Legal Accessibility Guidelines",
      pageSubtitle: "Comprehensive guide to web accessibility compliance standards and legal requirements worldwide",
      scanButton: "Scan Your Website Now",
      dashboardButton: "View Dashboard",
      wcag: {
        title: "WCAG 2.1 AA Compliant",
        description: "Web Content Accessibility Guidelines (WCAG) 2.1 Level AA is the internationally recognized standard for web accessibility, developed by the World Wide Web Consortium (W3C). It provides a comprehensive framework for making web content accessible to people with disabilities.",
        principles: "Four Core Principles (POUR):",
        perceivable: "1. Perceivable",
        operable: "2. Operable", 
        understandable: "3. Understandable",
        robust: "4. Robust",
        perceivableItems: [
          "Text alternatives for images",
          "Captions and transcripts for videos", 
          "Color contrast ratio 4.5:1 (normal text)",
          "Color contrast ratio 3:1 (large text)",
          "Resizable text up to 200%",
          "Content distinguishable from background"
        ],
        operableItems: [
          "Full keyboard accessibility",
          "No seizure-inducing content",
          "Users have enough time to read content",
          "Clear navigation and page structure", 
          "Bypass blocks for repetitive content",
          "Focus indicators visible"
        ],
        understandableItems: [
          "Text is readable and understandable",
          "Content appears and operates predictably",
          "Input assistance provided",
          "Error identification and suggestions",
          "Labels or instructions for user input",
          "Language of page is identified"
        ],
        robustItems: [
          "Compatible with assistive technologies",
          "Valid HTML markup",
          "Proper semantic structure",
          "Works across different browsers",
          "Future-proof implementation", 
          "Screen reader compatibility"
        ],
        newCriteriaTitle: "WCAG 2.1 New Success Criteria (13 additional criteria):",
        levelA: "Level A:",
        levelAA: "Level AA:",
        levelAItems: [
          "Character Key Shortcuts",
          "Pointer Cancellation", 
          "Label in Name",
          "Motion Actuation"
        ],
        levelAAItems: [
          "Orientation",
          "Identify Input Purpose",
          "Reflow",
          "Non-text Contrast",
          "Text Spacing",
          "Content on Hover or Focus",
          "Status Messages"
        ],
        globalRecognition: "WCAG 2.1 AA is referenced in legislation across 40+ countries and is the foundation for most national accessibility laws."
      },
      ada: {
        title: "ADA Title III Ready",
        description: "Americans with Disabilities Act (ADA) Title III prohibits discrimination based on disability in places of public accommodation. While originally focused on physical spaces, courts increasingly apply it to digital environments.",
        legalFramework: "Legal Framework & Coverage:",
        coveredEntities: "Covered Entities:",
        coveredEntitiesList: [
          "Retail stores and shopping centers",
          "Hotels, restaurants, and entertainment venues",
          "Healthcare facilities and professional offices", 
          "Banks and financial institutions",
          "Educational institutions (private)",
          "Transportation services",
          "Insurance offices and real estate agencies"
        ],
        legalRequirements: "Legal Requirements:",
        legalRequirementsList: [
          "Equal access to goods and services",
          "Reasonable modifications to policies",
          "Effective communication with disabled persons",
          "Auxiliary aids when necessary",
          "No discrimination in full enjoyment"
        ],
        caseLawTitle: "Digital Accessibility Case Law:",
        targetCase: "Target Corp. (2006):",
        targetCaseDesc: "First major case establishing websites as places of public accommodation. Settlement required WCAG compliance.",
        dominosCase: "Domino&apos;s Pizza (2019):",
        dominosCaseDesc: "Supreme Court let stand ruling that websites must be accessible. Established precedent for digital accessibility under ADA.",
        recentTrends: "Recent Trends (2020-2024):",
        recentTrendsDesc: "Over 15,000 ADA website lawsuits filed. Average settlement ranges from $10,000 to $50,000 plus attorney fees.",
        complianceBest: "Compliance Best Practices:",
        technicalStandards: "Technical Standards",
        technicalStandardsDesc: "Follow WCAG 2.1 AA guidelines as the de facto standard referenced by courts",
        documentation: "Documentation", 
        documentationDesc: "Maintain accessibility audits, remediation plans, and user testing records",
        ongoingMonitoring: "Ongoing Monitoring",
        ongoingMonitoringDesc: "Regular testing with assistive technologies and disabled users",
        riskMitigation: "Proactive accessibility compliance significantly reduces litigation risk and demonstrates good faith effort to accommodate disabled users."
      },
      eu: {
        title: "EU EN 301 549 Standard",
        description: "European Standard EN 301 549 is the harmonized European standard that defines accessibility requirements for Information and Communication Technology (ICT) products and services across all EU member states.",
        legalFramework: "Legal Framework & Directives:",
        webDirective: "Web Accessibility Directive (2016/2102)",
        webDirectiveItems: [
          "Applies to public sector websites and mobile apps",
          "Mandatory compliance since September 2020",
          "Based on WCAG 2.1 Level AA",
          "Requires accessibility statements",
          "Annual monitoring and reporting"
        ],
        accessibilityAct: "European Accessibility Act (2019/882)",
        accessibilityActItems: [
          "Applies to private sector from June 2025",
          "Covers e-commerce, banking, transport",
          "Mandatory for digital services",
          "Harmonized accessibility requirements",
          "Enforcement through market surveillance"
        ],
        technicalRequirements: "Technical Requirements:",
        chapter9: "Chapter 9: Web Content (based on WCAG 2.1)",
        chapter9Desc: "Incorporates all WCAG 2.1 Level A and AA success criteria with additional EU-specific requirements:",
        chapter9Items: [
          "Enhanced keyboard navigation requirements",
          "Specific color contrast measurements",
          "Multilingual accessibility considerations",
          "Additional timing and session requirements"
        ],
        chapter11: "Chapter 11: Software and Mobile Applications",
        chapter11Items: [
          "Platform-specific accessibility APIs",
          "Native mobile app accessibility",
          "Assistive technology compatibility",
          "User preference settings respect"
        ],
        complianceObligations: "Compliance Obligations:",
        accessibilityStatement: "Accessibility Statement",
        accessibilityStatementDesc: "Detailed statement covering compliance status, non-accessible content, and feedback mechanisms",
        feedbackMechanism: "Feedback Mechanism",
        feedbackMechanismDesc: "Accessible way for users to report accessibility issues and request alternative formats",
        monitoringBody: "Monitoring Body",
        monitoringBodyDesc: "Each member state designates monitoring body for enforcement and periodic audits",
        enforcement: "Non-compliance can result in financial penalties, market restrictions, and legal action. The European Commission monitors implementation across all 27 member states."
      },
      india: {
        title: "India RPwD Act 2016",
        description: "The Rights of Persons with Disabilities Act, 2016 (RPwD Act) is India's comprehensive legislation that replaces the Persons with Disabilities Act, 1995. It aligns with the UN Convention on the Rights of Persons with Disabilities (UNCRPD).",
        legislativeFramework: "Legislative Framework:",
        recognizedDisabilities: "21 Recognized Disabilities",
        physicalDisabilities: "Physical Disabilities (7):",
        physicalDisabilitiesDesc: "Locomotor, leprosy cured, cerebral palsy, dwarfism, muscular dystrophy, acid attack victims",
        sensoryDisabilities: "Sensory Disabilities (2):",
        sensoryDisabilitiesDesc: "Blindness, low vision, hearing impairment", 
        intellectualMental: "Intellectual & Mental (4):",
        intellectualMentalDesc: "Intellectual disability, mental illness, autism, learning disabilities",
        others: "Others (8):",
        othersDesc: "Multiple sclerosis, Parkinson's, hemophilia, thalassemia, sickle cell disease",
        digitalAccessibility: "Digital Accessibility Mandate",
        digitalAccessibilityItems: [
          "All government websites must be accessible",
          "Public services in accessible formats",
          "Digital content accessibility guidelines",
          "Barrier-free access to information",
          "Sign language interpretation for videos",
          "Screen reader compatible interfaces"
        ],
        govGuidelines: "Government Guidelines & Implementation:",
        gigw: "Guidelines for Indian Government Websites (GIGW)",
        minimumRequirements: "Minimum Requirements:",
        minimumRequirementsItems: [
          "WCAG 2.0 Level A compliance",
          "Hindi and English language support",
          "Mobile-responsive design",
          "Text-to-speech functionality"
        ],
        enhancedFeatures: "Enhanced Features:",
        enhancedFeaturesItems: [
          "Font size adjustment options",
          "High contrast themes",
          "Keyboard navigation",
          "Audio descriptions for media"
        ],
        deptGuidelines: "Department of Empowerment of PwD Guidelines",
        deptGuidelinesItems: [
          "Accessibility audit requirements for government portals",
          "Training programs for web developers on accessibility",
          "Regular compliance monitoring and reporting",
          "User feedback mechanisms for accessibility issues",
          "Integration with Accessible India Campaign (Sugamya Bharat Abhiyan)"
        ],
        keyProvisions: "Key Provisions for Digital Accessibility:",
        section40: "Section 40 - Accessibility Standards",
        section40Desc: "Government shall formulate accessibility standards for physical environment, transportation, ICT and communications",
        section42: "Section 42 - Access to Electronic Media", 
        section42Desc: "Television programs to have subtitles and sign language interpretation for hearing impaired persons",
        section61: "Section 61 - Duties of Government",
        section61Desc: "Ensure accessibility of public buildings, transport, and ICT including websites",
        privateSector: "Private Sector Encouragement",
        privateSectorDesc: "Act encourages private entities to follow accessibility standards and provides incentives",
        nationalPolicy: "The Act mandates that accessibility should be integral to development programs. The Digital India initiative specifically includes digital accessibility as a key component for inclusive development."
      },
      cta: {
        title: "Ensure Global Compliance Today",
        description: "Our AI-powered accessibility scanner checks your website against all major international standards and provides detailed remediation guidance"
      }
    },
    hi: {
      pageTitle: "कानूनी पहुंच-योग्यता दिशानिर्देश",
      pageSubtitle: "वेब पहुंच-योग्यता अनुपालन मानकों और दुनिया भर की कानूनी आवश्यकताओं के लिए व्यापक गाइड",
      scanButton: "अभी अपनी वेबसाइट स्कैन करें",
      dashboardButton: "डैशबोर्ड देखें",
      wcag: {
        title: "WCAG 2.1 AA अनुपालित",
        description: "वेब कंटेंट एक्सेसिबिलिटी गाइडलाइन्स (WCAG) 2.1 लेवल AA वर्ल्ड वाइड वेब कंसॉर्टियम (W3C) द्वारा विकसित वेब एक्सेसिबिलिटी के लिए अंतर्राष्ट्रीय स्तर पर मान्यता प्राप्त मानक है। यह विकलांग लोगों के लिए वेब कंटेंट को सुलभ बनाने के लिए एक व्यापक ढांचा प्रदान करता है।",
        principles: "चार मूल सिद्धांत (POUR):",
        perceivable: "1. दृश्यमान",
        operable: "2. संचालनीय",
        understandable: "3. समझने योग्य", 
        robust: "4. मजबूत",
        perceivableItems: [
          "छवियों के लिए टेक्स्ट विकल्प",
          "वीडियो के लिए कैप्शन और ट्रांसक्रिप्ट",
          "कलर कंट्रास्ट अनुपात 4.5:1 (सामान्य टेक्स्ट)",
          "कलर कंट्रास्ट अनुपात 3:1 (बड़ा टेक्स्ट)",
          "200% तक आकार बदलने योग्य टेक्स्ट",
          "पृष्ठभूमि से अलग दिखने वाली सामग्री"
        ],
        operableItems: [
          "पूर्ण कीबोर्ड पहुंच",
          "दौरे पैदा करने वाली सामग्री नहीं",
          "उपयोगकर्ताओं के पास सामग्री पढ़ने के लिए पर्याप्त समय",
          "स्पष्ट नेविगेशन और पृष्ठ संरचना",
          "दोहराई जाने वाली सामग्री के लिए बाईपास ब्लॉक",
          "फोकस संकेतक दृश्यमान"
        ],
        understandableItems: [
          "टेक्स्ट पठनीय और समझने योग्य है",
          "सामग्री पूर्वानुमेय रूप से दिखाई देती और काम करती है",
          "इनपुट सहायता प्रदान की गई",
          "त्रुटि की पहचान और सुझाव",
          "उपयोगकर्ता इनपुट के लिए लेबल या निर्देश",
          "पृष्ठ की भाषा की पहचान की गई"
        ],
        robustItems: [
          "सहायक प्रौद्योगिकियों के साथ संगत",
          "वैध HTML मार्कअप",
          "उचित सिमैंटिक संरचना",
          "विभिन्न ब्राउज़रों में काम करता है",
          "भविष्य-प्रूफ कार्यान्वयन",
          "स्क्रीन रीडर संगतता"
        ],
        newCriteriaTitle: "WCAG 2.1 नए सफलता मापदंड (13 अतिरिक्त मापदंड):",
        levelA: "स्तर A:",
        levelAA: "स्तर AA:",
        levelAItems: [
          "कैरेक्टर की शॉर्टकट",
          "पॉइंटर रद्दीकरण",
          "नाम में लेबल",
          "गति सक्रियता"
        ],
        levelAAItems: [
          "अभिविन्यास",
          "इनपुट उद्देश्य की पहचान",
          "रीफ़्लो",
          "गैर-पाठ्य कंट्रास्ट",
          "पाठ स्पेसिंग",
          "होवर या फोकस पर सामग्री",
          "स्थिति संदेश"
        ],
        globalRecognition: "WCAG 2.1 AA को 40+ देशों के कानून में संदर्भित किया गया है और यह अधिकांश राष्ट्रीय पहुंच कानूनों की आधारशिला है।"
      },
      ada: {
        title: "ADA टाइटल III तैयार",
        description: "अमेरिकियों विकलांगता अधिनियम (ADA) टाइटल III सार्वजनिक आवास के स्थानों में विकलांगता के आधार पर भेदभाव को प्रतिबंधित करता है। मूल रूप से भौतिक स्थानों पर केंद्रित होने पर, न्यायालय इसे डिजिटल वातावरण में तेजी से लागू कर रहे हैं।",
        legalFramework: "कानूनी ढांचा और कवरेज:",
        coveredEntities: "कवर की गई संस्थाएं:",
        coveredEntitiesList: [
          "खुदरा स्टोर और शॉपिंग सेंटर",
          "होटल, रेस्तराँ और मनोरंजन स्थल",
          "स्वास्थ्य सुविधाएं और पेशेवर कार्यालय",
          "बैंक और वित्तीय संस्थान",
          "शैक्षणिक संस्थान (निजी)",
          "परिवहन सेवाएं",
          "बीमा कार्यालय और रियल एस्टेट एजेंसियां"
        ],
        legalRequirements: "कानूनी आवश्यकताएं:",
        legalRequirementsList: [
          "वस्तुओं और सेवाओं तक समान पहुंच",
          "नीतियों में उचित संशोधन",
          "विकलांग व्यक्तियों के साथ प्रभावी संचार",
          "आवश्यक होने पर सहायक उपकरण",
          "पूर्ण आनंद में कोई भेदभाव नहीं"
        ],
        caseLawTitle: "डिजिटल पहुंच केस लॉ:",
        targetCase: "टारगेट कॉर्प (2006):",
        targetCaseDesc: "वेबसाइटों को सार्वजनिक आवास के स्थान के रूप में स्थापित करने वाला पहला प्रमुख मामला। समझौते में WCAG अनुपालन की आवश्यकता थी।",
        dominosCase: "डोमिनोज़ पिज़्ज़ा (2019):",
        dominosCaseDesc: "सुप्रीम कोर्ट ने फैसले को बरकरार रखा कि वेबसाइटों को सुलभ होना चाहिए। ADA के तहत डिजिटल पहुंच के लिए मिसाल कायम की।",
        recentTrends: "हाल के रुझान (2020-2024):",
        recentTrendsDesc: "15,000 से अधिक ADA वेबसाइट मुकदमे दायर किए गए। औसत समझौता $10,000 से $50,000 तक वकील फीस के साथ।",
        complianceBest: "अनुपालन सर्वोत्तम प्रथाएं:",
        technicalStandards: "तकनीकी मानक",
        technicalStandardsDesc: "न्यायालयों द्वारा संदर्भित वास्तविक मानक के रूप में WCAG 2.1 AA दिशानिर्देशों का पालन करें",
        documentation: "प्रलेखन",
        documentationDesc: "पहुंच ऑडिट, सुधार योजनाएं और उपयोगकर्ता परीक्षण रिकॉर्ड बनाए रखें",
        ongoingMonitoring: "निरंतर निगरानी",
        ongoingMonitoringDesc: "सहायक प्रौद्योगिकियों और विकलांग उपयोगकर्ताओं के साथ नियमित परीक्षण",
        riskMitigation: "सक्रिय पहुंच अनुपालन मुकदमेबाजी जोखिम को काफी कम करता है और विकलांग उपयोगकर्ताओं को समायोजित करने के लिए सद्भावनापूर्ण प्रयास का प्रदर्शन करता है।"
      },
      eu: {
        title: "EU EN 301 549 मानक",
        description: "यूरोपीय मानक EN 301 549 सामंजस्यपूर्ण यूरोपीय मानक है जो सभी EU सदस्य राज्यों में सूचना और संचार प्रौद्योगिकी (ICT) उत्पादों और सेवाओं के लिए पहुंच आवश्यकताओं को परिभाषित करता है।",
        legalFramework: "कानूनी ढांचा और निर्देश:",
        webDirective: "वेब पहुंच निर्देश (2016/2102)",
        webDirectiveItems: [
          "सार्वजनिक क्षेत्र की वेबसाइटों और मोबाइल ऐप्स पर लागू",
          "सितंबर 2020 से अनिवार्य अनुपालन",
          "WCAG 2.1 स्तर AA पर आधारित",
          "पहुंच बयान की आवश्यकता",
          "वार्षिक निगरानी और रिपोर्टिंग"
        ],
        accessibilityAct: "यूरोपीय पहुंच अधिनियम (2019/882)",
        accessibilityActItems: [
          "जून 2025 से निजी क्षेत्र पर लागू",
          "ई-कॉमर्स, बैंकिंग, परिवहन को कवर करता है",
          "डिजिटल सेवाओं के लिए अनिवार्य",
          "सामंजस्यपूर्ण पहुंच आवश्यकताएं",
          "बाजार निगरानी के माध्यम से प्रवर्तन"
        ],
        technicalRequirements: "तकनीकी आवश्यकताएं:",
        chapter9: "अध्याय 9: वेब सामग्री (WCAG 2.1 पर आधारित)",
        chapter9Desc: "अतिरिक्त EU-विशिष्ट आवश्यकताओं के साथ सभी WCAG 2.1 स्तर A और AA सफलता मापदंड शामिल करता है:",
        chapter9Items: [
          "उन्नत कीबोर्ड नेविगेशन आवश्यकताएं",
          "विशिष्ट रंग कंट्रास्ट माप",
          "बहुभाषी पहुंच विचार",
          "अतिरिक्त समय और सत्र आवश्यकताएं"
        ],
        chapter11: "अध्याय 11: सॉफ्टवेयर और मोबाइल एप्लिकेशन",
        chapter11Items: [
          "प्लेटफॉर्म-विशिष्ट पहुंच APIs",
          "मूल मोबाइल ऐप पहुंच",
          "सहायक प्रौद्योगिकी संगतता",
          "उपयोगकर्ता प्राथमिकता सेटिंग्स का सम्मान"
        ],
        complianceObligations: "अनुपालन दायित्व:",
        accessibilityStatement: "पहुंच बयान",
        accessibilityStatementDesc: "अनुपालन स्थिति, गैर-सुलभ सामग्री, और फीडबैक तंत्र को कवर करने वाला विस्तृत बयान",
        feedbackMechanism: "फीडबैक तंत्र",
        feedbackMechanismDesc: "उपयोगकर्ताओं के लिए पहुंच मुद्दों की रिपोर्ट करने और वैकल्पिक प्रारूपों का अनुरोध करने का सुलभ तरीका",
        monitoringBody: "निगरानी निकाय",
        monitoringBodyDesc: "प्रत्येक सदस्य राज्य प्रवर्तन और आवधिक ऑडिट के लिए निगरानी निकाय नामित करता है",
        enforcement: "गैर-अनुपालन के परिणामस्वरूप वित्तीय जुर्माना, बाजार प्रतिबंध और कानूनी कार्रवाई हो सकती है। यूरोपीय आयोग सभी 27 सदस्य राज्यों में कार्यान्वयन की निगरानी करता है।"
      },
      india: {
        title: "भारत RPwD अधिनियम 2016", 
        description: "विकलांग व्यक्तियों के अधिकार अधिनियम, 2016 (RPwD अधिनियम) भारत का व्यापक कानून है जो विकलांग व्यक्ति अधिनियम, 1995 को प्रतिस्थापित करता है। यह विकलांग व्यक्तियों के अधिकारों पर संयुक्त राष्ट्र कन्वेंशन (UNCRPD) के साथ संरेखित होता है।",
        legislativeFramework: "विधायी ढांचा:",
        recognizedDisabilities: "21 मान्यता प्राप्त विकलांगताएं",
        physicalDisabilities: "शारीरिक विकलांगताएं (7):",
        physicalDisabilitiesDesc: "चलने-फिरने में अक्षम, कुष्ठ रोग मुक्त, मस्तिष्क पक्षाघात, बौनापन, पेशीय अपविकास, एसिड हमला पीड़ित",
        sensoryDisabilities: "संवेदी विकलांगताएं (2):",
        sensoryDisabilitiesDesc: "अंधापन, कम दृष्टि, सुनने की हानि",
        intellectualMental: "बौद्धिक और मानसिक (4):",
        intellectualMentalDesc: "बौद्धिक विकलांगता, मानसिक बीमारी, आत्मकेंद्रता, अधिगम अक्षमता",
        others: "अन्य (8):",
        othersDesc: "मल्टिपल स्क्लेरोसिस, पार्किंसन, हीमोफीलिया, थैलेसीमिया, सिकल सेल रोग",
        digitalAccessibility: "डिजिटल पहुंच आदेश",
        digitalAccessibilityItems: [
          "सभी सरकारी वेबसाइटें सुलभ होनी चाहिए",
          "सुलभ प्रारूप में सार्वजनिक सेवाएं",
          "डिजिटल सामग्री पहुंच दिशानिर्देश",
          "सूचना तक बाधा-मुक्त पहुंच",
          "वीडियो के लिए सांकेतिक भाषा व्याख्या",
          "स्क्रीन रीडर संगत इंटरफेस"
        ],
        govGuidelines: "सरकारी दिशानिर्देश और कार्यान्वयन:",
        gigw: "भारतीय सरकारी वेबसाइटों के लिए दिशानिर्देश (GIGW)",
        minimumRequirements: "न्यूनतम आवश्यकताएं:",
        minimumRequirementsItems: [
          "WCAG 2.0 स्तर A अनुपालन",
          "हिंदी और अंग्रेजी भाषा समर्थन",
          "मोबाइल-उत्तरदायी डिज़ाइन",
          "टेक्स्ट-टू-स्पीच कार्यक्षमता"
        ],
        enhancedFeatures: "बेहतर सुविधाएं:",
        enhancedFeaturesItems: [
          "फ़ॉन्ट आकार समायोजन विकल्प",
          "हाई कंट्रास्ट थीम",
          "कीबोर्ड नेविगेशन",
          "मीडिया के लिए ऑडियो विवरण"
        ],
        deptGuidelines: "विकलांग व्यक्तियों के सशक्तिकरण विभाग दिशानिर्देश",
        deptGuidelinesItems: [
          "सरकारी पोर्टलों के लिए पहुंच ऑडिट आवश्यकताएं",
          "वेब डेवलपर्स के लिए पहुंच पर प्रशिक्षण कार्यक्रम",
          "नियमित अनुपालन निगरानी और रिपोर्टिंग",
          "पहुंच मुद्दों के लिए उपयोगकर्ता फीडबैक तंत्र",
          "सुगम्य भारत अभियान के साथ एकीकरण"
        ],
        keyProvisions: "डिजिटल पहुंच के लिए मुख्य प्रावधान:",
        section40: "धारा 40 - पहुंच मानक",
        section40Desc: "सरकार भौतिक वातावरण, परिवहन, ICT और संचार के लिए पहुंच मानक तैयार करेगी",
        section42: "धारा 42 - इलेक्ट्रॉनिक मीडिया तक पहुंच",
        section42Desc: "श्रवण बाधित व्यक्तियों के लिए टेलीविजन कार्यक्रमों में उपशीर्षक और सांकेतिक भाषा व्याख्या होनी चाहिए",
        section61: "धारा 61 - सरकार के कर्तव्य",
        section61Desc: "सार्वजनिक भवन, परिवहन, और वेबसाइटों सहित ICT की पहुंच सुनिश्चित करना",
        privateSector: "निजी क्षेत्र प्रोत्साहन",
        privateSectorDesc: "अधिनियम निजी संस्थाओं को पहुंच मानकों का पालन करने के लिए प्रोत्साहित करता है और प्रोत्साहन प्रदान करता है",
        nationalPolicy: "अधिनियम यह आदेश देता है कि पहुंच विकास कार्यक्रमों का अभिन्न अंग होना चाहिए। डिजिटल इंडिया पहल में विशेष रूप से समावेशी विकास के मुख्य घटक के रूप में डिजिटल पहुंच शामिल है।"
      },
      cta: {
        title: "आज वैश्विक अनुपालन सुनिश्चित करें",
        description: "हमारा AI-संचालित पहुंच स्कैनर आपकी वेबसाइट को सभी प्रमुख अंतर्राष्ट्रीय मानकों के विरुद्ध जांचता है और विस्तृत सुधार मार्गदर्शन प्रदान करता है"
      }
    },
    gu: {
      pageTitle: "કાનૂની પહોંચ દિશાનિર્દેશો",
      pageSubtitle: "વેબ પહોંચ અનુપાલન ધોરણો અને વિશ્વભરની કાનૂની આવશ્યકતાઓ માટે વ્યાપક માર્ગદર્શિકા",
      scanButton: "હવે તમારી વેબસાઇટ સ્કેન કરો",
      dashboardButton: "ડેશબોર્ડ જુઓ",
      wcag: {
        title: "WCAG 2.1 AA અનુપાલિત",
        description: "વેબ કન્ટેન્ટ એક્સેસિબિલિટી ગાઇડલાઇન્સ (WCAG) 2.1 લેવલ AA વર્લ્ડ વાઇડ વેબ કન્સોર્ટિયમ (W3C) દ્વારા વિકસિત વેબ એક્સેસિબિલિટી માટે આંતરરાષ્ટ્રીય સ્તરે માન્યતા પ્રાપ્ત ધોરણ છે. તે વિકલાંગ લોકો માટે વેબ કન્ટેન્ટને સુલભ બનાવવા માટે વ્યાપક માળખું પૂરું પાડે છે.",
        principles: "ચાર મૂળ સિદ્ધાંતો (POUR):",
        perceivable: "1. દૃશ્યમાન",
        operable: "2. ચલાવવા યોગ્ય",
        understandable: "3. સમજી શકાય તેવું",
        robust: "4. મજબૂત",
        perceivableItems: [
          "છબીઓ માટે ટેક્સ્ટ વિકલ્પો",
          "વીડિયો માટે કેપ્શન અને ટ્રાન્સક્રિપ્ટ",
          "કલર કોન્ટ્રાસ્ટ રેશિયો 4.5:1 (સામાન્ય ટેક્સ્ટ)",
          "કલર કોન્ટ્રાસ્ટ રેશિયો 3:1 (મોટો ટેક્સ્ટ)",
          "200% સુધી કદ બદલાવી શકાય તેવો ટેક્સ્ટ",
          "બેકગ્રાઉન્ડથી અલગ દેખાતી સામગ્રી"
        ],
        operableItems: [
          "સંપૂર્ણ કીબોર્ડ પહોંચ",
          "દોરે લાવતી સામગ્રી નથી",
          "વપરાશકર્તાઓ પાસે સામગ્રી વાંચવા માટે પૂરતો સમય",
          "સ્પષ્ટ નેવિગેશન અને પેજ સ્ટ્રક્ચર",
          "પુનરાવર્તિત સામગ્રી માટે બાયપાસ બ્લોક્સ",
          "ફોકસ સૂચકાંકો દૃશ્યમાન"
        ],
        understandableItems: [
          "ટેક્સ્ટ વાંચવા અને સમજવા યોગ્ય છે",
          "સામગ્રી અનુમાનિત રીતે દેખાય અને કાર્ય કરે છે",
          "ઇનપુટ સહાય પ્રદાન કરવામાં આવી",
          "ભૂલ ઓળખ અને સૂચનો",
          "વપરાશકર્તા ઇનપુટ માટે લેબલ અથવા સૂચનાઓ",
          "પેજની ભાષા ઓળખવામાં આવી"
        ],
        robustItems: [
          "સહાયક તકનીકો સાથે સુસંગત",
          "માન્ય HTML માર્કઅપ",
          "યોગ્ય સિમેન્ટિક સ્ટ્રક્ચર",
          "વિવિધ બ્રાઉઝરમાં કામ કરે છે",
          "ભવિષ્ય-પ્રૂફ અમલીકરણ",
          "સ્ક્રીન રીડર સુસંગતતા"
        ],
        newCriteriaTitle: "WCAG 2.1 નવા સફળતા માપદંડ (13 વધારાના માપદંડ):",
        levelA: "લેવલ A:",
        levelAA: "લેવલ AA:",
        levelAItems: [
          "કેરેક્ટર કી શોર્ટકટ્સ",
          "પોઇન્ટર રદ કરવું",
          "નામમાં લેબલ",
          "ગતિ સક્રિયકરણ"
        ],
        levelAAItems: [
          "અભિગમ",
          "ઇનપુટ હેતુ ઓળખો",
          "રીફ્લો",
          "નોન-ટેક્સ્ટ કોન્ટ્રાસ્ટ",
          "ટેક્સ્ટ સ્પેસિંગ",
          "હોવર અથવા ફોકસ પર સામગ્રી",
          "સ્ટેટસ મેસેજ"
        ],
        globalRecognition: "WCAG 2.1 AA ને 40+ દેશોના કાયદામાં સંદર્ભિત કરવામાં આવ્યું છે અને તે મોટાભાગના રાષ્ટ્રીય પહોંચ કાયદાઓનો પાયો છે."
      },
      ada: {
        title: "ADA ટાઇટલ III તૈયાર", 
        description: "અમેરિકન્સ વિથ ડિસેબિલિટીઝ એક્ટ (ADA) ટાઇટલ III જાહેર આવાસના સ્થળોએ વિકલાંગતાના આધારે ભેદભાવને પ્રતિબંધિત કરે છે. મૂળ રૂપે ભૌતિક જગ્યાઓ પર કેન્દ્રિત હોવા છતાં, અદાલતો તેને ડિજિટલ વાતાવરણમાં વધુને વધુ લાગૂ કરે છે।",
        legalFramework: "કાનૂની માળખું અને કવરેજ:",
        coveredEntities: "આવરી લેવાયેલી સંસ્થાઓ:",
        coveredEntitiesList: [
          "રિટેલ સ્ટોર્સ અને શોપિંગ સેન્ટર્સ",
          "હોટેલ, રેસ્ટોરન્ટ અને મનોરંજન સ્થળો",
          "આરોગ્ય સુવિધાઓ અને વ્યાવસાયિક કચેરીઓ",
          "બેંકો અને નાણાકીય સંસ્થાઓ",
          "શૈક્ષણિક સંસ્થાઓ (ખાનગી)",
          "પરિવહન સેવાઓ",
          "વીમા કચેરીઓ અને રિયલ એસ્ટેટ એજન્સીઓ"
        ],
        legalRequirements: "કાનૂની જરૂરિયાતો:",
        legalRequirementsList: [
          "વસ્તુઓ અને સેવાઓમાં સમાન પહોંચ",
          "નીતિઓમાં વાજબી ફેરફારો",
          "વિકલાંગ વ્યક્તિઓ સાથે અસરકારક સંદેશાવ્યવહાર",
          "જરૂર પડે ત્યારે સહાયક સાધનો",
          "સંપૂર્ણ આનંદમાં કોઈ ભેદભાવ નહીં"
        ],
        caseLawTitle: "ડિજિટલ એક્સેસિબિલિટી કેસ લૉ:",
        targetCase: "ટાર્ગેટ કોર્પ (2006):",
        targetCaseDesc: "વેબસાઇટ્સને જાહેર આવાસના સ્થળો તરીકે સ્થાપિત કરતો પ્રથમ મુખ્ય કેસ. સેટલમેન્ટમાં WCAG અનુપાલન જરૂરી હતું.",
        dominosCase: "ડોમિનોઝ પિઝા (2019):",
        dominosCaseDesc: "સુપ્રીમ કોર્ટે ચુકાદો જાળવી રાખ્યો કે વેબસાઇટ્સ સુલભ હોવી જોઈએ. ADA હેઠળ ડિજિટલ એક્સેસિબિલિટી માટે પ્રેસિડન્ટ સ્થાપિત કર્યો.",
        recentTrends: "તાજેતરના વલણો (2020-2024):",
        recentTrendsDesc: "15,000 થી વધુ ADA વેબસાઇટ મુકદ્દમા દાખલ કરવામાં આવ્યા. એવરેજ સેટલમેન્ટ $10,000 થી $50,000 સુધી એટર્ની ફીસ સાથે.",
        complianceBest: "અનુપાલન શ્રેષ્ઠ પ્રથાઓ:",
        technicalStandards: "ટેકનિકલ સ્ટાન્ડર્ડ્સ",
        technicalStandardsDesc: "કોર્ટ દ્વારા સંદર્ભિત વાસ્તવિક માનક તરીકે WCAG 2.1 AA ગાઇડલાઇન્સનું પાલન કરો",
        documentation: "ડોક્યુમેન્ટેશન",
        documentationDesc: "એક્સેસિબિલિટી ઓડિટ્સ, રિમેડિયેશન પ્લાન્સ અને યુઝર ટેસ્ટિંગ રેકોર્ડ્સ જાળવો",
        ongoingMonitoring: "ચાલુ મોનિટરિંગ",
        ongoingMonitoringDesc: "સહાયક તકનીકો અને વિકલાંગ વપરાશકર્તાઓ સાથે નિયમિત ટેસ્ટિંગ",
        riskMitigation: "પ્રોએક્ટિવ એક્સેસિબિલિટી અનુપાલન મુકદ્દમાના જોખમને નોંધપાત્ર રીતે ઘટાડે છે અને વિકલાંગ વપરાશકર્તાઓને સમાવવા માટે સારા વિશ્વાસના પ્રયાસનું પ્રદર્શન કરે છે."
      },
      eu: {
        title: "EU EN 301 549 માનક",
        description: "યુરોપિયન સ્ટાન્ડર્ડ EN 301 549 એ સુમેળિત યુરોપિયન ધોરણ છે જે તમામ EU સભ્ય દેશોમાં માહિતી અને સંદેશાવ્યવહાર તકનીકી (ICT) ઉત્પાદનો અને સેવાઓ માટે પહોંચ આવશ્યકતાઓને વ્યાખ્યાયિત કરે છે।",
        legalFramework: "કાનૂની માળખું અને નિર્દેશો:",
        webDirective: "વેબ એક્સેસિબિલિટી ડિરેક્ટિવ (2016/2102)",
        webDirectiveItems: [
          "પબ્લિક સેક્ટરની વેબસાઇટ્સ અને મોબાઇલ એપ્સને લાગુ પડે છે",
          "સપ્ટેમ્બર 2020 થી ફરજિયાત અનુપાલન",
          "WCAG 2.1 લેવલ AA પર આધારિત",
          "એક્સેસિબિલિટી સ્ટેટમેન્ટની જરૂર",
          "વાર્ષિક મોનિટરિંગ અને રિપોર્ટિંગ"
        ],
        accessibilityAct: "યુરોપિયન એક્સેસિબિલિટી એક્ટ (2019/882)",
        accessibilityActItems: [
          "જૂન 2025 થી પ્રાઇવેટ સેક્ટરને લાગુ",
          "ઈ-કોમર્સ, બેંકિંગ, ટ્રાન્સપોર્ટ આવરી લે છે",
          "ડિજિટલ સેવાઓ માટે ફરજિયાત",
          "સુમેળિત એક્સેસિબિલિટી જરૂરિયાતો",
          "માર્કેટ સર્વેલન્સ દ્વારા અમલીકરણ"
        ],
        technicalRequirements: "ટેકનિકલ જરૂરિયાતો:",
        chapter9: "ચેપ્ટર 9: વેબ કન્ટેન્ટ (WCAG 2.1 પર આધારિત)",
        chapter9Desc: "વધારાની EU-વિશિષ્ટ જરૂરિયાતો સાથે તમામ WCAG 2.1 લેવલ A અને AA સફળતાના માપદંડોનો સમાવેશ કરે છે:",
        chapter9Items: [
          "ઉન્નત કીબોર્ડ નેવિગેશન જરૂરિયાતો",
          "વિશિષ્ટ કલર કોન્ટ્રાસ્ટ માપવા",
          "બહુભાષી એક્સેસિબિલિટી વિચારણાઓ",
          "વધારાની સમય અને સેશન જરૂરિયાતો"
        ],
        chapter11: "ચેપ્ટર 11: સોફ્ટવેર અને મોબાઇલ એપ્લિકેશન્સ",
        chapter11Items: [
          "પ્લેટફોર્મ-વિશિષ્ટ એક્સેસિબિલિટી APIs",
          "મૂળ મોબાઇલ એપ એક્સેસિબિલિટી",
          "સહાયક તકનીક સુસંગતતા",
          "યુઝર પ્રેફરન્સ સેટિંગ્સનો આદર"
        ],
        complianceObligations: "અનુપાલન જવાબદારીઓ:",
        accessibilityStatement: "એક્સેસિબિલિટી સ્ટેટમેન્ટ",
        accessibilityStatementDesc: "અનુપાલન સ્ટેટસ, બિન-સુલભ કન્ટેન્ટ અને ફીડબેક મિકેનિઝમ આવરી લેતું વિગતવાર સ્ટેટમેન્ટ",
        feedbackMechanism: "ફીડબેક મિકેનિઝમ",
        feedbackMechanismDesc: "યુઝર્સ માટે એક્સેસિબિલિટીના મુદ્દાઓની જાણ કરવા અને વૈકલ્પિક ફોર્મેટની વિનંતી કરવાનો સુલભ માર્ગ",
        monitoringBody: "મોનિટરિંગ બોડી",
        monitoringBodyDesc: "દરેક સભ્ય રાજ્ય અમલીકરણ અને સમયાંતરે ઓડિટ માટે મોનિટરિંગ બોડી નિયુક્ત કરે છે",
        enforcement: "બિન-અનુપાલનના પરિણામે નાણાકીય દંડ, બજાર પ્રતિબંધો અને કાનૂની કાર્યવાહી થઈ શકે છે. યુરોપિયન કમિશન તમામ 27 સભ્ય રાજ્યોમાં અમલીકરણ પર નજર રાખે છે."
      },
      india: {
        title: "ભારત RPwD અધિનિયમ 2016",
        description: "વિકલાંગ વ્યક્તિઓના અધિકાર અધિનિયમ, 2016 (RPwD અધિનિયમ) એ ભારતનો વ્યાપક કાયદો છે જે વિકલાંગ વ્યક્તિ અધિનિયમ, 1995 ને બદલે છે. તે વિકલાંગ વ્યક્તિઓના અધિકારો પર સંયુક્ત રાષ્ટ્ર સંમેલન (UNCRPD) સાથે સંરેખિત છે।",
        legislativeFramework: "વિધાનસભા માળખું:",
        recognizedDisabilities: "21 માન્યતા પ્રાપ્ત વિકલાંગતા",
        physicalDisabilities: "શારીરિક વિકલાંગતા (7):",
        physicalDisabilitiesDesc: "લોકોમોટર, કુષ્ઠ રોગ મુક્ત, સેરેબ્રલ પાલ્સી, દ્વાર્ફિઝમ, મસ્ક્યુલર ડિસ્ટ્રોફી, એસિડ એટેક પીડિત",
        sensoryDisabilities: "સંવેદનાત્મક વિકલાંગતા (2):",
        sensoryDisabilitiesDesc: "અંધત્વ, ઓછી દૃષ્ટિ, સાંભળવાની ખામી",
        intellectualMental: "બુદ્ધિગત અને માનસિક (4):",
        intellectualMentalDesc: "બૌદ્ધિક વિકલાંગતા, માનસિક બીમારી, ઓટિઝમ, શીખવાની અક્ષમતા",
        others: "અન્ય (8):",
        othersDesc: "મલ્ટિપલ સ્ક્લેરોસિસ, પાર્કિન્સન, હિમોફિલિયા, થેલેસેમિયા, સિકલ સેલ ડિઝિઝ",
        digitalAccessibility: "ડિજિટલ એક્સેસિબિલિટી આદેશ",
        digitalAccessibilityItems: [
          "તમામ સરકારી વેબસાઇટ્સ સુલભ હોવી જોઈએ",
          "સુલભ ફોર્મેટમાં જાહેર સેવાઓ",
          "ડિજિટલ કન્ટેન્ટ એક્સેસિબિલિટી ગાઇડલાઇન્સ",
          "માહિતીમાં અવરોધ-મુક્ત પહોંચ",
          "વીડિયો માટે સાંકેતિક ભાષાની વ્યાખ્યા",
          "સ્ક્રીન રીડર સુસંગત ઇન્ટરફેસ"
        ],
        govGuidelines: "સરકારી ગાઇડલાઇન્સ અને અમલીકરણ:",
        gigw: "ભારતીય સરકારી વેબસાઇટ્સ માટે ગાઇડલાઇન્સ (GIGW)",
        minimumRequirements: "ન્યૂનતમ જરૂરિયાતો:",
        minimumRequirementsItems: [
          "WCAG 2.0 લેવલ A અનુપાલન",
          "હિન્દી અને અંગ્રેજી ભાષા સપોર્ટ",
          "મોબાઇલ-રેસ્પોન્સિવ ડિઝાઇન",
          "ટેક્સ્ટ-ટુ-સ્પીચ ફંક્શનાલિટી"
        ],
        enhancedFeatures: "ઉન્નત સુવિધાઓ:",
        enhancedFeaturesItems: [
          "ફોન્ટ સાઇઝ એડજસ્ટમેન્ટ વિકલ્પો",
          "હાઇ કોન્ટ્રાસ્ટ થીમ્સ",
          "કીબોર્ડ નેવિગેશન",
          "મીડિયા માટે ઓડિયો વર્ણનો"
        ],
        deptGuidelines: "વિકલાંગ વ્યક્તિઓના સશક્તિકરણ વિભાગ ગાઇડલાઇન્સ",
        deptGuidelinesItems: [
          "સરકારી પોર્ટલ્સ માટે એક્સેસિબિલિટી ઓડિટ જરૂરિયાતો",
          "વેબ ડેવલપર્સ માટે એક્સેસિબિલિટી પર તાલીમ કાર્યક્રમો",
          "નિયમિત અનુપાલન મોનિટરિંગ અને રિપોર્ટિંગ",
          "એક્સેસિબિલિટી મુદ્દાઓ માટે યુઝર ફીડબેક મિકેનિઝમ",
          "સુગમ્ય ભારત અભિયાન સાથે એકીકરણ"
        ],
        keyProvisions: "ડિજિટલ એક્સેસિબિલિટી માટે મુખ્ય જોગવાઈઓ:",
        section40: "સેક્શન 40 - એક્સેસિબિલિટી સ્ટાન્ડર્ડ્સ",
        section40Desc: "સરકાર ભૌતિક વાતાવરણ, પરિવહન, ICT અને સંચાર માટે એક્સેસિબિલિટી સ્ટાન્ડર્ડ્સ ઘડશે",
        section42: "સેક્શન 42 - ઇલેક્ટ્રોનિક મીડિયામાં ઍક્સેસ",
        section42Desc: "ટેલિવિઝન પ્રોગ્રામ્સમાં સાંભળવાની ખામીવાળા લોકો માટે સબટાઇટલ અને સાંકેતિક ભાષાની વ્યાખ્યા હોવી જોઈએ",
        section61: "સેક્શન 61 - સરકારની ફરજો",
        section61Desc: "જાહેર ઇમારતો, પરિવહન અને વેબસાઇટ્સ સહિત ICT ની એક્સેસિબિલિટી સુનિશ્ચિત કરવી",
        privateSector: "ખાનગી ક્ષેત્ર પ્રોત્સાહન",
        privateSectorDesc: "અધિનિયમ ખાનગી સંસ્થાઓને એક્સેસિબિલિટી સ્ટાન્ડર્ડ્સ અનુસરવા પ્રોત્સાહિત કરે છે અને પ્રોત્સાહન પ્રદાન કરે છે",
        nationalPolicy: "અધિનિયમ આદેશ આપે છે કે એક્સેસિબિલિટી વિકાસ કાર્યક્રમોનો અભિન્ન ભાગ હોવો જોઈએ. ડિજિટલ ઇન્ડિયા પહેલમાં ખાસ કરીને સમાવેશી વિકાસના મુખ્ય ઘટક તરીકે ડિજિટલ એક્સેસિબિલિટીનો સમાવેશ કરે છે."
      },
      cta: {
        title: "આજે વૈશ્વિક અનુપાલન સુનિશ્ચિત કરો",
        description: "અમારું AI-સંચાલિત પહોંચ સ્કેનર તમારી વેબસાઇટને તમામ મુખ્ય આંતરરાષ્ટ્રીય ધોરણો સામે તપાસે છે અને વિગતવાર સુધારણા માર્ગદર્શન પ્રદાન કરે છે"
      }
    }
  };

  const currentTranslation = translations[language];

  if (status === "loading") {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff] mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className={`max-w-md mx-auto p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <div className="mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#00d4ff] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please sign in to access the detailed legal guidelines for web accessibility compliance.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/80 shadow-md transition-all duration-300 h-10 px-6 py-2"
              >
                Sign In to Continue
              </Link>
            </div>
            
            {/* Preview section */}
            <div className={`mt-12 p-6 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h2 className="text-xl font-semibold mb-4">Available Guidelines Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">{currentTranslation.wcag.title}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">{currentTranslation.ada.title}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">{currentTranslation.eu.title}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-75`}>
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="font-medium">{currentTranslation.india.title}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to read full details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className={`inline-flex rounded-lg border p-1 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'hi'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('gu')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'gu'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{currentTranslation.pageTitle}</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            {currentTranslation.pageSubtitle}
          </p>
        </div>

        <div className="grid gap-8">
          {/* WCAG 2.1 AA */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">{currentTranslation.wcag.title}</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentTranslation.wcag.description}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">{currentTranslation.wcag.principles}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">{currentTranslation.wcag.perceivable}</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentTranslation.wcag.perceivableItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">{currentTranslation.wcag.operable}</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentTranslation.wcag.operableItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">{currentTranslation.wcag.understandable}</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentTranslation.wcag.understandableItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold text-lg mb-2">{currentTranslation.wcag.robust}</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentTranslation.wcag.robustItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                <h4 className="font-semibold mb-3">{currentTranslation.wcag.newCriteriaTitle}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{currentTranslation.wcag.levelA}</p>
                    <ul className={`mt-1 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentTranslation.wcag.levelAItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">{currentTranslation.wcag.levelAA}</p>
                    <ul className={`mt-1 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentTranslation.wcag.levelAAItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <p className="text-sm font-medium">
                  <strong>Global Recognition:</strong> {currentTranslation.wcag.globalRecognition}
                </p>
              </div>
            </div>
          </div>

          {/* ADA Title III */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">{currentTranslation.ada.title}</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentTranslation.ada.description}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Legal Framework & Coverage:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Covered Entities:</h4>
                    <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Retail stores and shopping centers</li>
                      <li>• Hotels, restaurants, and entertainment venues</li>
                      <li>• Healthcare facilities and professional offices</li>
                      <li>• Banks and financial institutions</li>
                      <li>• Educational institutions (private)</li>
                      <li>• Transportation services</li>
                      <li>• Insurance offices and real estate agencies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Legal Requirements:</h4>
                    <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Equal access to goods and services</li>
                      <li>• Reasonable modifications to policies</li>
                      <li>• Effective communication with disabled persons</li>
                      <li>• Auxiliary aids when necessary</li>
                      <li>• No discrimination in full enjoyment</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'} border-l-4 border-red-500`}>
                <h4 className="font-semibold mb-3">Digital Accessibility Case Law:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Target Corp. (2006):</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>First major case establishing websites as places of public accommodation. Settlement required WCAG compliance.</p>
                  </div>
                  <div>
                    <p className="font-medium">Domino&apos;s Pizza (2019):</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Supreme Court let stand ruling that websites must be accessible. Established precedent for digital accessibility under ADA.</p>
                  </div>
                  <div>
                    <p className="font-medium">Recent Trends (2020-2024):</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Over 15,000 ADA website lawsuits filed. Average settlement ranges from $10,000 to $50,000 plus attorney fees.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Compliance Best Practices:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Technical Standards</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Follow WCAG 2.1 AA guidelines as the de facto standard referenced by courts</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Documentation</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Maintain accessibility audits, remediation plans, and user testing records</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Ongoing Monitoring</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Regular testing with assistive technologies and disabled users</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <p className="text-sm font-medium">
                  <strong>Risk Mitigation:</strong> Proactive accessibility compliance significantly reduces litigation risk and demonstrates good faith effort to accommodate disabled users.
                </p>
              </div>
            </div>
          </div>

          {/* EU EN 301 549 */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">{currentTranslation.eu.title}</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentTranslation.eu.description}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Legal Framework & Directives:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h4 className="font-semibold mb-3">Web Accessibility Directive (2016/2102)</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Applies to public sector websites and mobile apps</li>
                      <li>• Mandatory compliance since September 2020</li>
                      <li>• Based on WCAG 2.1 Level AA</li>
                      <li>• Requires accessibility statements</li>
                      <li>• Annual monitoring and reporting</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h4 className="font-semibold mb-3">European Accessibility Act (2019/882)</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Applies to private sector from June 2025</li>
                      <li>• Covers e-commerce, banking, transport</li>
                      <li>• Mandatory for digital services</li>
                      <li>• Harmonized accessibility requirements</li>
                      <li>• Enforcement through market surveillance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Requirements:</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold mb-2">Chapter 9: Web Content (based on WCAG 2.1)</h4>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Incorporates all WCAG 2.1 Level A and AA success criteria with additional EU-specific requirements:</p>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Enhanced keyboard navigation requirements</li>
                      <li>• Specific color contrast measurements</li>
                      <li>• Multilingual accessibility considerations</li>
                      <li>• Additional timing and session requirements</li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <h4 className="font-semibold mb-2">Chapter 11: Software and Mobile Applications</h4>
                    <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Platform-specific accessibility APIs</li>
                      <li>• Native mobile app accessibility</li>
                      <li>• Assistive technology compatibility</li>
                      <li>• User preference settings respect</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Compliance Obligations:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Accessibility Statement</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Detailed statement covering compliance status, non-accessible content, and feedback mechanisms</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Feedback Mechanism</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Accessible way for users to report accessibility issues and request alternative formats</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Monitoring Body</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Each member state designates monitoring body for enforcement and periodic audits</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className="text-sm font-medium">
                  <strong>Enforcement:</strong> Non-compliance can result in financial penalties, market restrictions, and legal action. The European Commission monitors implementation across all 27 member states.
                </p>
              </div>
            </div>
          </div>

          {/* India RPwD Act */}
          <div className={`p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
            <div className="flex items-center mb-6">
              <span className="text-green-500 text-2xl mr-3">✓</span>
              <h2 className="text-2xl font-bold">{currentTranslation.india.title}</h2>
            </div>
            <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentTranslation.india.description}
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Legislative Framework:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                    <h4 className="font-semibold mb-3">21 Recognized Disabilities</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <p className="font-medium">Physical Disabilities (7):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Locomotor, leprosy cured, cerebral palsy, dwarfism, muscular dystrophy, acid attack victims</p>
                      </div>
                      <div>
                        <p className="font-medium">Sensory Disabilities (2):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Blindness, low vision, hearing impairment</p>
                      </div>
                      <div>
                        <p className="font-medium">Intellectual & Mental (4):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Intellectual disability, mental illness, autism, learning disabilities</p>
                      </div>
                      <div>
                        <p className="font-medium">Others (8):</p>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Multiple sclerosis, Parkinson&apos;s, hemophilia, thalassemia, sickle cell disease</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <h4 className="font-semibold mb-3">Digital Accessibility Mandate</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• All government websites must be accessible</li>
                      <li>• Public services in accessible formats</li>
                      <li>• Digital content accessibility guidelines</li>
                      <li>• Barrier-free access to information</li>
                      <li>• Sign language interpretation for videos</li>
                      <li>• Screen reader compatible interfaces</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Government Guidelines & Implementation:</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                    <h4 className="font-semibold mb-2">Guidelines for Indian Government Websites (GIGW)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Minimum Requirements:</p>
                        <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <li>• WCAG 2.0 Level A compliance</li>
                          <li>• Hindi and English language support</li>
                          <li>• Mobile-responsive design</li>
                          <li>• Text-to-speech functionality</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Enhanced Features:</p>
                        <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <li>• Font size adjustment options</li>
                          <li>• High contrast themes</li>
                          <li>• Keyboard navigation</li>
                          <li>• Audio descriptions for media</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold mb-2">Department of Empowerment of PwD Guidelines</h4>
                    <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <li>• Accessibility audit requirements for government portals</li>
                      <li>• Training programs for web developers on accessibility</li>
                      <li>• Regular compliance monitoring and reporting</li>
                      <li>• User feedback mechanisms for accessibility issues</li>
                      <li>• Integration with Accessible India Campaign (Sugamya Bharat Abhiyan)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Key Provisions for Digital Accessibility:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Section 40 - Accessibility Standards</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Government shall formulate accessibility standards for physical environment, transportation, ICT and communications</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Section 42 - Access to Electronic Media</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Television programs to have subtitles and sign language interpretation for hearing impaired persons</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Section 61 - Duties of Government</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ensure accessibility of public buildings, transport, and ICT including websites</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h5 className="font-medium mb-2">Private Sector Encouragement</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Act encourages private entities to follow accessibility standards and provides incentives</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                <p className="text-sm font-medium">
                  <strong>National Policy:</strong> The Act mandates that accessibility should be integral to development programs. The Digital India initiative specifically includes digital accessibility as a key component for inclusive development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className={`mt-12 p-8 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg text-center`}>
          <h2 className="text-2xl font-bold mb-4">{currentTranslation.cta.title}</h2>
          <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentTranslation.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scanner"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/80 shadow-md transition-all duration-300 h-12 px-8 py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
              {currentTranslation.scanButton}
            </Link>
            <Link
              href="/dashboard"
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 h-12 px-8 py-2 ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
            >
              {currentTranslation.dashboardButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

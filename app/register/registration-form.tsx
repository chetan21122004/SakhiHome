"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { areaOptions, serviceOptions, submitApplication } from "@/lib/registry";

const translations = {
  en: {
    tag: "BECOME A SAKHIHOME PROFESSIONAL",
    title: "Your skills deserve a good opportunity.",
    intro:
      "Join a community that values your work. Tell us a little about yourself and our team will help you find a home that’s the right fit.",
    benefits: [
      "Work opportunities near your home",
      "A team that supports you",
      "Your details handled with care",
    ],
    quote: "Good work starts with the right connection.",
    quoteBy: "The SakhiHome promise",
    basic: "Your details",
    work: "Your work",
    heading: "Let’s get to know you",
    workHeading: "Find work that fits your life",
    sub: "A few simple details to help our team get in touch.",
    workSub: "Choose your skills, preferred area, and work timings.",
    name: "Full name",
    phone: "Mobile number",
    area: "Where would you like to work?",
    areaNames: areaOptions,
    services: "What work do you do?",
    serviceNames: serviceOptions,
    schedule: "Preferred work timings (optional)",
    schedulePlaceholder: "e.g. 7 AM to 11 AM",
    consent:
      "I agree that SakhiHome may contact me about my application and use these details to help find work opportunities.",
    next: "Continue",
    back: "Back",
    submit: "Send application",
    demo: "Your details are shared only with SakhiHome staff to review your application and help find work opportunities.",
    success: "You’re on the list!",
    successText:
      "Your application has been saved. Our team will contact you to complete registration and verification.",
    another: "Submit another application",
    dashboard: "View team workspace",
    serviceError: "Please select at least one service.",
    consentError: "Please agree before continuing.",
  },
  hi: {
    tag: "सखीहोम के साथ जुड़ें",
    title: "आपके हुनर को मिले सही अवसर।",
    intro:
      "हमारी टीम से जुड़ें। अपने बारे में बताएं और हम आपके लिए आस-पास काम ढूंढने में मदद करेंगे।",
    benefits: [
      "आपके घर के पास काम के अवसर",
      "आपकी मदद के लिए हमारी टीम",
      "आपकी जानकारी का ध्यान",
    ],
    quote: "अच्छे काम की शुरुआत सही साथ से होती है।",
    quoteBy: "सखीहोम का वादा",
    basic: "आपकी जानकारी",
    work: "आपका काम",
    heading: "आइए, आपको जानें",
    workHeading: "आपके लिए सही काम",
    sub: "हम आपसे संपर्क कर सकें, इसलिए ये जानकारी दें।",
    workSub: "अपना काम, इलाका और पसंद का समय चुनें।",
    name: "पूरा नाम",
    phone: "मोबाइल नंबर",
    area: "किस इलाके में काम करना चाहेंगे?",
    areaNames: [
      "हिंजवडी फेज 1",
      "हिंजवडी फेज 2",
      "हिंजवडी फेज 3",
      "वाकड",
      "बाणेर",
      "मारुंजी",
      "मेगापोलिस",
      "अन्य",
    ],
    services: "आप कौन सा काम करते हैं?",
    serviceNames: [
      "सफाई",
      "खाना बनाना",
      "बच्चों की देखभाल",
      "बुजुर्गों की देखभाल",
      "पूरे समय घरेलू मदद",
    ],
    schedule: "काम का पसंदीदा समय (वैकल्पिक)",
    schedulePlaceholder: "जैसे सुबह 7 से 11 बजे",
    consent:
      "मैं सहमत हूं कि सखीहोम मेरे आवेदन के बारे में मुझसे संपर्क कर सकता है और काम ढूंढने के लिए इस जानकारी का उपयोग कर सकता है।",
    next: "आगे बढ़ें",
    back: "वापस",
    submit: "आवेदन भेजें",
    demo: "आपकी जानकारी केवल सखीहोम की टीम के साथ साझा की जाती है, ताकि आपके आवेदन की समीक्षा कर काम ढूंढने में मदद की जा सके।",
    success: "आपका आवेदन मिल गया है!",
    successText:
      "आपका आवेदन सुरक्षित सहेज लिया गया है। हमारी टीम पंजीकरण और सत्यापन के लिए आपसे संपर्क करेगी।",
    another: "एक और आवेदन",
    dashboard: "टीम का डैशबोर्ड देखें",
    serviceError: "कृपया कम से कम एक काम चुनें।",
    consentError: "आगे बढ़ने से पहले सहमति दें।",
  },
  mr: {
    tag: "सखीहोमसोबत काम करा",
    title: "तुमच्या कौशल्याला मिळू दे योग्य संधी.",
    intro:
      "आमच्या समुदायात सामील व्हा. तुमची थोडी माहिती द्या आणि आमची टीम तुम्हाला जवळपास योग्य काम शोधण्यासाठी मदत करेल.",
    benefits: [
      "तुमच्या घराजवळ कामाच्या संधी",
      "तुमच्या मदतीसाठी आमची टीम",
      "तुमच्या माहितीची काळजी",
    ],
    quote: "चांगल्या कामाची सुरुवात योग्य सोबतीने होते.",
    quoteBy: "सखीहोमचे वचन",
    basic: "तुमची माहिती",
    work: "तुमचे काम",
    heading: "चला, तुमची ओळख करून घेऊ",
    workHeading: "तुमच्यासाठी योग्य काम",
    sub: "तुमच्याशी संपर्क साधण्यासाठी ही माहिती द्या.",
    workSub: "तुमचे कौशल्य, परिसर आणि वेळ निवडा.",
    name: "पूर्ण नाव",
    phone: "मोबाइल नंबर",
    area: "कोणत्या परिसरात काम करायचे आहे?",
    areaNames: [
      "हिंजवडी फेज 1",
      "हिंजवडी फेज 2",
      "हिंजवडी फेज 3",
      "वाकड",
      "बाणेर",
      "मारुंजी",
      "मेगापोलिस",
      "इतर",
    ],
    services: "तुम्ही कोणते काम करता?",
    serviceNames: [
      "साफसफाई",
      "स्वयंपाक",
      "बालसंगोपन",
      "वृद्धांची काळजी",
      "पूर्णवेळ घरकाम",
    ],
    schedule: "कामाची पसंतीची वेळ (ऐच्छिक)",
    schedulePlaceholder: "उदा. सकाळी 7 ते 11",
    consent:
      "माझ्या अर्जाबाबत संपर्क साधण्यासाठी आणि काम शोधण्यासाठी सखीहोमने ही माहिती वापरण्यास माझी संमती आहे.",
    next: "पुढे",
    back: "मागे",
    submit: "अर्ज पाठवा",
    demo: "तुमच्या अर्जाची तपासणी करून काम शोधण्यात मदत करण्यासाठी तुमची माहिती फक्त सखीहोम टीमसोबत शेअर केली जाते.",
    success: "तुमचा अर्ज मिळाला आहे!",
    successText:
      "तुमचा अर्ज सुरक्षित जतन केला आहे. नोंदणी आणि पडताळणीसाठी आमची टीम तुमच्याशी संपर्क साधेल.",
    another: "आणखी एक अर्ज",
    dashboard: "टीमचे डॅशबोर्ड पाहा",
    serviceError: "कृपया किमान एक काम निवडा.",
    consentError: "पुढे जाण्यापूर्वी संमती द्या.",
  },
};
export default function RegistrationForm() {
  const [sending, setSending] = useState(false);
  const [language, setLanguage] = useState<keyof typeof translations>("en");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Wakad",
    services: [] as string[],
    schedule: "",
    consent: false,
  });
  const t = translations[language];
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (step === 1) {
      setStep(2);
      return;
    }
    if (!form.services.length) {
      setError(t.serviceError);
      return;
    }
    if (!form.consent) {
      setError(t.consentError);
      return;
    }
    if (sending) return;
    setSending(true);
    try {
      await submitApplication({
        id: `AP-${crypto.randomUUID()}`,
        name: form.name.trim(),
        phone: form.phone,
        area: form.area,
        services: form.services,
        schedule: form.schedule,
        consent: true,
        language:
          language === "en"
            ? "English"
            : language === "hi"
              ? "Hindi"
              : "Marathi",
        status: "New",
      });
      setDone(true);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSending(false);
    }
  }
  return (
    <main className="rg-register" lang={language}>
      <header className="rg-register-top">
        <BrandLogo caption="GROWING TOGETHER" />
        <div className="rg-language-switch" aria-label="Application language">
          {(
            [
              ["en", "English"],
              ["hi", "हिंदी"],
              ["mr", "मराठी"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              aria-pressed={language === key}
              className={language === key ? "active" : ""}
              onClick={() => {
                setLanguage(key);
                setError("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <div className="rg-register-grid">
        <section className="rg-register-intro">
          <span className="rg-badge green">
            <Sparkles size={13} />
            {t.tag}
          </span>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
          {t.benefits.map((benefit, i) => {
            const Icon = [MapPin, HeartHandshake, ShieldCheck][i];
            return (
              <div key={benefit} className="rg-register-benefit">
                <Icon size={19} />
                <span>{benefit}</span>
              </div>
            );
          })}
          <div className="rg-register-quote">
            <p>“{t.quote}”</p>
            <span>{t.quoteBy}</span>
          </div>
        </section>
        <section className="rg-register-card">
          {done ? (
            <div className="rg-register-success" role="status">
              <CheckCircle2 size={53} />
              <h2>{t.success}</h2>
              <p>{t.successText}</p>
              <Link className="rg-btn primary" href="/admin">
                {t.dashboard}
                <ArrowRight size={16} />
              </Link>
              <button
                className="rg-register-back"
                onClick={() => {
                  setDone(false);
                  setStep(1);
                  setForm({
                    name: "",
                    phone: "",
                    area: "Wakad",
                    services: [],
                    schedule: "",
                    consent: false,
                  });
                }}
              >
                {t.another}
              </button>
            </div>
          ) : (
            <>
              <div className="rg-steps">
                <span className={`rg-step ${step === 1 ? "active" : ""}`}>
                  {step === 2 ? <CheckCircle2 size={14} /> : "1"}
                </span>
                {t.basic}
                <span className="rg-step-line" />
                <span className={`rg-step ${step === 2 ? "active" : ""}`}>
                  2
                </span>
                {t.work}
              </div>
              <h2>{step === 1 ? t.heading : t.workHeading}</h2>
              <p>{step === 1 ? t.sub : t.workSub}</p>
              <form className="rg-register-form" onSubmit={submit}>
                {step === 1 ? (
                  <>
                    <label className="rg-field">
                      <span>{t.name} *</span>
                      <input
                        autoComplete="name"
                        required
                        pattern=".*\S.*"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </label>
                    <label className="rg-field">
                      <span>{t.phone} *</span>
                      <input
                        autoComplete="tel"
                        inputMode="tel"
                        type="tel"
                        required
                        pattern="[0-9+ ()-]{10,16}"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </label>
                    <label className="rg-field">
                      <span>{t.area}</span>
                      <select
                        value={form.area}
                        onChange={(e) =>
                          setForm({ ...form, area: e.target.value })
                        }
                      >
                        {areaOptions.map((a, i) => (
                          <option value={a} key={a}>
                            {t.areaNames[i]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <fieldset>
                      <legend className="rg-field-label">{t.services} *</legend>
                      <div className="rg-checks">
                        {serviceOptions.map((s, i) => (
                          <label key={s}>
                            <input
                              type="checkbox"
                              checked={form.services.includes(s)}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  services: e.target.checked
                                    ? [...form.services, s]
                                    : form.services.filter((v) => v !== s),
                                })
                              }
                            />
                            {t.serviceNames[i]}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <label className="rg-field">
                      <span>{t.schedule}</span>
                      <input
                        value={form.schedule}
                        placeholder={t.schedulePlaceholder}
                        onChange={(e) =>
                          setForm({ ...form, schedule: e.target.value })
                        }
                      />
                    </label>
                    <label className="rg-register-consent">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) =>
                          setForm({ ...form, consent: e.target.checked })
                        }
                      />
                      <span>{t.consent}</span>
                    </label>
                  </>
                )}
                {error && (
                  <p role="alert" className="text-sm text-red-700">
                    {error}
                  </p>
                )}
                <div className="rg-register-actions">
                  {step === 2 && (
                    <button
                      type="button"
                      className="rg-btn"
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                    >
                      <ArrowLeft size={15} />
                      {t.back}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rg-btn primary"
                    disabled={sending}
                  >
                    {sending ? "…" : step === 1 ? t.next : t.submit}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </>
          )}
          <div className="rg-register-demo">{t.demo}</div>
        </section>
      </div>
    </main>
  );
}

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { categories } from "../data/categories";
import { packages } from "../data/packages";
import { siteConfig } from "../config/siteConfig";
import { enquiryEmailLinks, sendEnquiry, type Enquiry } from "../services/enquiryService";
import "./Chatbot.css";

type ChatMessage = { from: "bot" | "visitor"; text: string };
type EnquiryField = keyof Enquiry;

const enquirySteps: { field: EnquiryField; prompt: string; optional?: boolean }[] = [
  { field: "type", prompt: "What kind of shoot are you planning?" },
  { field: "date", prompt: "What date do you have in mind? You can type a date or choose Skip.", optional: true },
  { field: "name", prompt: "What name should we use?" },
  { field: "email", prompt: "What email address can we reach you at?" },
  { field: "phone", prompt: "What phone or WhatsApp number should we use? Choose Skip if you prefer not to share it.", optional: true },
  { field: "message", prompt: "Any venue, event details, or questions to include? Choose Skip if there is nothing else." },
];

const quickQuestions = ["What services do you offer?", "What are your prices?", "Where are you based?", "How do I book?"];
const emptyEnquiry = (): Enquiry => ({ name: "", email: "", phone: "", type: "", date: "", message: "" });

function answerQuestion(question: string) {
  const q = question.toLowerCase();
  if (/price|cost|package|rate|budget|how much/.test(q)) {
    return `Our starting packages are:\n${packages.map((pkg) => `${pkg.name}: ${pkg.price} (${pkg.features.join(", ")})`).join("\n")}\n\nFinal pricing can vary by date, location, and coverage. Start an enquiry for a tailored quote.`;
  }
  if (/service|shoot|photo|film|video|wedding|portrait|maternity|family|event|engagement/.test(q)) return `We photograph ${categories.map((category) => category.label).join(", ")}. Tell us what you have in mind and we'll guide you.`;
  if (/where|location|address|based|travel|destination/.test(q)) return `${siteConfig.location}. We are available for shoots across India.`;
  if (/book|booking|enquir|contact|availability|available|date/.test(q)) return "Choose 'Start an enquiry' and the chat will collect your shoot details, date, and contact information.";
  if (/deliver|when|turnaround|gallery|receive/.test(q)) return "Delivery timing depends on the event and selected coverage. Include your question in an enquiry and the studio will confirm the timeline.";
  if (/phone|call|whatsapp|email|instagram|social/.test(q)) return `Email ${siteConfig.email} or call ${siteConfig.phone}. You can also use the WhatsApp button after submitting an enquiry.`;
  if (/about|who|omkar|studio|photographer/.test(q)) return `${siteConfig.name} is led by Omkar Bhojane, a wedding and cinematography photographer based in Jaysingpur, capturing stories across India.`;
  return "I can answer questions about services, packages and prices, location, booking, and delivery. You can also start an enquiry and include your question for the studio.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: `Hi! I'm the ${siteConfig.name} assistant. Choose a question or start an enquiry.` },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<number | null>(null);
  const [enquiry, setEnquiry] = useState<Enquiry>(emptyEnquiry);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [error, setError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open, step, submitted, error]);

  const whatsappUrl = useMemo(() => {
    if (!submitted) return "";
    const body = [
      `New website enquiry for ${siteConfig.name}`,
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone / WhatsApp: ${enquiry.phone || "Not provided"}`,
      `Shoot: ${enquiry.type}`,
      `Preferred date: ${enquiry.date || "Not specified"}`,
      `Details: ${enquiry.message || "None"}`,
    ].join("\n");
    return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(body)}`;
  }, [enquiry, submitted]);

  function addBot(text: string) {
    setMessages((current) => [...current, { from: "bot", text }]);
  }

  function startEnquiry() {
    setSubmitted(false);
    setEmailDraft("");
    setError("");
    setEnquiry(emptyEnquiry());
    setStep(0);
    addBot(enquirySteps[0].prompt);
  }

  function handleFaq(question: string) {
    setMessages((current) => [...current, { from: "visitor", text: question }, { from: "bot", text: answerQuestion(question) }]);
  }

  async function submitEnquiry(nextEnquiry: Enquiry) {
    setSubmitting(true);
    setError("");
    try {
      const result = await sendEnquiry(nextEnquiry);
      setEnquiry(nextEnquiry);
      setStep(null);
      setSubmitted(true);
      setEmailDraft(result === "mailto" ? enquiryEmailLinks(nextEnquiry).default : "");
      addBot(result === "mailto"
        ? "Your answers are ready in an email draft. Tap the email button below to open it, then press Send in your email app."
        : "Thanks! Your enquiry was sent to the studio. You can also prepare a WhatsApp notification below.");
    } catch {
      setError("The enquiry could not be submitted. Please try again or contact us by email.");
      addBot("I couldn't submit that just now. Please try again, or email the studio directly.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAnswer(value: string) {
    const answer = value.trim();
    if (!answer || submitting) return;
    setInput("");
    if (step === null) {
      handleFaq(answer);
      return;
    }
    setMessages((current) => [...current, { from: "visitor", text: answer }]);
    const currentStep = enquirySteps[step];
    if (currentStep.field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer)) {
      addBot("That email address doesn't look complete. Please check it and enter it again.");
      return;
    }
    const skipped = currentStep.optional && answer.toLowerCase() === "skip";
    const nextEnquiry = { ...enquiry, [currentStep.field]: skipped ? "" : answer };
    setEnquiry(nextEnquiry);
    const nextStep = step + 1;
    if (nextStep < enquirySteps.length) {
      setStep(nextStep);
      addBot(enquirySteps[nextStep].prompt);
      return;
    }
    void submitEnquiry(nextEnquiry);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleAnswer(input);
  }

  return (
    <div className="chatbot">
      {open && (
        <section className="chatbot__panel" aria-label="Studio chat assistant">
          <header className="chatbot__header">
            <div><strong>{siteConfig.name}</strong><span>Guided assistant</span></div>
            <button type="button" className="chatbot__close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>
          <div className="chatbot__messages" ref={messagesRef} aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => <p key={index} className={`chatbot__message chatbot__message--${message.from}`}>{message.text}</p>)}
            {error && <p className="chatbot__error">{error}</p>}
            {submitted && emailDraft && <div className="chatbot__email-options"><span>Continue with email</span><a className="chatbot__email" href={emailDraft}>Default mail app</a><a className="chatbot__email" href={enquiryEmailLinks(enquiry).gmail} target="_blank" rel="noopener noreferrer">Gmail</a><a className="chatbot__email" href={enquiryEmailLinks(enquiry).outlook} target="_blank" rel="noopener noreferrer">Outlook</a></div>}
            {submitted && <a className="chatbot__whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Prepare WhatsApp notification</a>}
          </div>
          {step === null && !submitted && (
            <div className="chatbot__quick-actions">
              <button type="button" className="chatbot__start" onClick={startEnquiry}>Start an enquiry</button>
              {quickQuestions.map((question) => <button type="button" key={question} onClick={() => handleFaq(question)}>{question}</button>)}
            </div>
          )}
          {step !== null && step === 0 && (
            <div className="chatbot__quick-actions chatbot__quick-actions--categories">
              {categories.map((category) => <button type="button" key={category.id} onClick={() => handleAnswer(category.label)}>{category.label}</button>)}
            </div>
          )}
          {step !== null && enquirySteps[step].optional && (
            <div className="chatbot__quick-actions"><button type="button" onClick={() => handleAnswer("Skip")}>Skip this question</button></div>
          )}
          <form className="chatbot__form" onSubmit={handleSubmit}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={step === null ? "Ask a question..." : "Type your answer..."} aria-label="Type a message" disabled={submitting} />
            <button type="submit" disabled={!input.trim() || submitting}>{submitting ? "Sending..." : "Send"}</button>
          </form>
          <p className="chatbot__note">Predefined assistant; no AI responses. WhatsApp opens a message for you to send.</p>
        </section>
      )}
      <button type="button" className="chatbot__toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close chat" : "Open chat assistant"}>
        {open ? <span className="chatbot__toggle-close" aria-hidden="true">x</span> : <><svg className="chatbot__camera" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h3l1.4-2h7.2l1.4 2h3A1.5 1.5 0 0 1 21.5 9v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z" /><circle cx="12" cy="13.25" r="3.5" /><path d="M5.5 10.5h.01" /></svg><span>Chat with us</span></>}
      </button>
    </div>
  );
}

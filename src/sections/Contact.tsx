import { useState, FormEvent } from "react";
import { siteConfig } from "../config/siteConfig";
import { enquiryEmailLinks, sendEnquiry, type Enquiry } from "../services/enquiryService";
import { categories } from "../data/categories";

function ContactIcon({ kind }: { kind: "email" | "phone" | "whatsapp" | "location" | "instagram" | "youtube" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg className={`contact__icon contact__icon--${kind}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...common}>
    {kind === "email" && <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></>}
    {kind === "phone" && <path d="M7 3.8 4.8 5c-.9.5-.8 2.4.2 4.6 1.5 3.2 4.2 5.9 7.4 7.4 2.2 1 4.1 1.1 4.6.2l1.2-2.2-4-2-1.5 1.5a13 13 0 0 1-4.7-4.7l1.5-1.5-2-4Z" />}
    {kind === "whatsapp" && <><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .3.1.4.4l.7 1.6c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2 .2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.3.6-.1.5-.4 1.2-.9 1.5-.5.4-1.2.5-1.9.3-1-.2-2.3-.8-3.6-2-1.1-1-1.9-2.2-2.2-3.1-.3-.8-.2-1.5.2-2.1.2-.2.6-.5 1.1-.8Z" /></>}
    {kind === "location" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>}
    {kind === "instagram" && <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.7" r=".8" fill="currentColor" stroke="none" /></>}
    {kind === "youtube" && <><path d="M21 8.2a2.6 2.6 0 0 0-1.8-1.9C17.6 5.8 12 5.8 12 5.8s-5.6 0-7.2.5A2.6 2.6 0 0 0 3 8.2 27 27 0 0 0 2.6 12a27 27 0 0 0 .4 3.8 2.6 2.6 0 0 0 1.8 1.9c1.6.5 7.2.5 7.2.5s5.6 0 7.2-.5a2.6 2.6 0 0 0 1.8-1.9 27 27 0 0 0 .4-3.8 27 27 0 0 0-.4-3.8Z" /><path d="m10 15 5-3-5-3z" /></>}
  </svg>;
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [emailDraft, setEmailDraft] = useState("");
  const [emailOptions, setEmailOptions] = useState<ReturnType<typeof enquiryEmailLinks> | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const enquiry: Enquiry = { name: d.name, email: d.email, phone: d.phone, type: d.type, date: d.date, message: d.message };
      const r = await sendEnquiry(enquiry);
      const options = r === "mailto" ? enquiryEmailLinks(enquiry) : null;
      setEmailOptions(options);
      setEmailDraft(options?.default || "");
      setStatus(r);
      if (r === "sent") form.reset();
    } catch {
      setStatus("error");
    }
  }

  const socials = (["instagram", "youtube"] as const).map((key) => [key, siteConfig.social[key]] as const).filter(([, v]) => v);

  return (
    <section id="contact" className="section contact">
      <div className="contact__intro">
        <p className="eyebrow">A Note to Us</p>
        <h2>Let’s Begin Your Story.</h2>
        <p className="muted">Share a little about what you’re dreaming of. We’ll be in touch within two days.</p>
        <address className="contact__details">
          <div className="contact__detail"><ContactIcon kind="email" /><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
          <div className="contact__detail"><ContactIcon kind="phone" /><a href={`tel:${siteConfig.phone.replace(/ /g, "")}`}>{siteConfig.phone}</a></div>
          <div className="contact__detail"><ContactIcon kind="whatsapp" /><a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp us</a></div>
          <div className="contact__detail"><ContactIcon kind="location" /><span>{siteConfig.location}</span></div>
        </address>
        {socials.length > 0 && <ul className="social social--icons">{socials.map(([k, v]) => <li key={k}><a href={v} target="_blank" rel="noopener noreferrer"><ContactIcon kind={k} /><span>{k}</span></a></li>)}</ul>}
      </div>

      <form className="contact__form" onSubmit={submit}>
        <div className="contact__name-fields">
          <label>Name<input name="name" autoComplete="name" placeholder="Your name" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="Your email address" required /></label>
        </div>
        <label>Phone or WhatsApp <span className="optional">(optional)</span><input name="phone" autoComplete="tel" placeholder="How can we reach you?" /></label>
        <label>What are you planning?<select name="type" defaultValue="" required>
          <option value="" disabled>Choose a kind of story</option>
          {categories.map((c) => <option key={c.id}>{c.label}</option>)}
        </select></label>
        <label>Preferred date <span className="optional">(if you have one)</span><input name="date" type="date" aria-label="Preferred date" /></label>
        <label>Tell us a little more<textarea name="message" rows={3} placeholder="Your plans, ideas, or anything you’d like us to know" required /></label>
        <button className="btn" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Your Note"}</button>
        {status === "sent" && <p className="ok">Thank you. We’ll be in touch shortly.</p>}
        {status === "mailto" && <p className="ok">Your enquiry is ready to email. <a href={emailDraft}>Default mail app</a> | <a href={emailOptions?.gmail} target="_blank" rel="noopener noreferrer">Gmail</a> | <a href={emailOptions?.outlook} target="_blank" rel="noopener noreferrer">Outlook</a>. Choose an option, then press Send.</p>}
        {status === "error" && <p className="err">Something went wrong. Please email us directly.</p>}
      </form>
    </section>
  );
}

import { useState, FormEvent } from "react";
import { siteConfig } from "../config/siteConfig";
import { sendEnquiry } from "../services/enquiryService";
import { categories } from "../data/categories";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const r = await sendEnquiry({ name: d.name, email: d.email, phone: d.phone, type: d.type, date: d.date, message: d.message });
      setStatus(r);
      if (r === "sent") form.reset();
    } catch {
      setStatus("error");
    }
  }

  const socials = Object.entries(siteConfig.social).filter(([, v]) => v);

  return (
    <section id="contact" className="section contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Let's Plan Your Story.</h2>
        <p className="muted">Tell us a little about your day, your idea, or your dream shoot.</p>
        <p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><br />
          {siteConfig.phone}<br />
          {siteConfig.location}
        </p>
        {socials.length > 0 && (
          <ul className="social">
            {socials.map(([k, v]) => (
              <li key={k}><a href={v} target="_blank" rel="noopener noreferrer">{k}</a></li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={submit}>
        <input name="name" placeholder="Your name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone / WhatsApp" />
        <select name="type" defaultValue="" required>
          <option value="" disabled>Type of shoot</option>
          {categories.map((c) => <option key={c.id}>{c.label}</option>)}
        </select>
        <input name="date" type="date" aria-label="Preferred date" />
        <textarea name="message" rows={5} placeholder="Tell us about your story" required />
        <button className="btn" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Enquiry"}</button>
        {status === "sent" && <p className="ok">Thank you. We'll be in touch shortly.</p>}
        {status === "mailto" && <p className="ok">Your email app should open with the enquiry ready to send.</p>}
        {status === "error" && <p className="err">Something went wrong. Please email us directly.</p>}
      </form>
    </section>
  );
}

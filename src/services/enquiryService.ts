import { siteConfig } from "../config/siteConfig";

export interface Enquiry { name: string; email: string; phone: string; type: string; date: string; message: string; }

export async function sendEnquiry(e: Enquiry): Promise<"sent" | "mailto"> {
  if (siteConfig.enquiryEndpoint) {
    const res = await fetch(siteConfig.enquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(e),
    });
    if (!res.ok) throw new Error("Enquiry failed");
    return "sent";
  }
  const body = `Name: ${e.name}\nPhone: ${e.phone}\nType: ${e.type}\nDate: ${e.date}\n\n${e.message}`;
  window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    `Enquiry: ${e.type} — ${e.name}`
  )}&body=${encodeURIComponent(body)}`;
  return "mailto";
}

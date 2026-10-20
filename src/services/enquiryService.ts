import { siteConfig } from "../config/siteConfig";

export interface Enquiry { name: string; email: string; phone: string; type: string; date: string; message: string; }

export function enquiryEmailLinks(e: Enquiry) {
  const subject = `Enquiry: ${e.type} - ${e.name}`;
  const body = `Name: ${e.name}\nEmail: ${e.email}\nPhone: ${e.phone || "Not provided"}\nType: ${e.type}\nDate: ${e.date || "Not specified"}\n\n${e.message || "No additional details provided."}`;
  const to = encodeURIComponent(siteConfig.email);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return {
    default: `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodedSubject}&body=${encodedBody}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${encodedSubject}&body=${encodedBody}`,
  };
}

export async function sendEnquiry(e: Enquiry): Promise<"sent" | "mailto"> {
  if (!siteConfig.enquiryEndpoint) return "mailto";
  const res = await fetch(siteConfig.enquiryEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(e),
  });
  if (!res.ok) throw new Error("Enquiry failed");
  return "sent";
}

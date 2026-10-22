import { useEffect, useState } from "react";
import { siteConfig } from "../config/siteConfig";

const links = [
  ["About", "about"], ["Gallery", "gallery"], ["Films", "films"],
  ["Services", "services"], ["Packages", "packages"], ["Feedback", "feedback"], ["Contact", "contact"],
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header className={`nav ${solid || open ? "nav--solid" : ""}`}>
      <a href="#top" className="wordmark">{siteConfig.name}</a>
      <nav className={`nav__links ${open ? "is-open" : ""}`}>
        {links.map(([l, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{l}</a>
        ))}
        <a href="#contact" className="btn btn--small" onClick={() => setOpen(false)}>Enquire Now</a>
      </nav>
      <button className="nav__toggle" aria-label="Menu" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
    </header>
  );
}

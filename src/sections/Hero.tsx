import { useEffect, useState } from "react";
import { siteConfig } from "../config/siteConfig";
import { photos } from "../data/gallery";

export default function Hero() {
  const slides = photos.filter((p) => ["wedding", "pre-wedding", "engagement"].includes(p.categoryId)).slice(0, 5);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 3200);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  const override = siteConfig.heroImageOverride;
  return (
    <section id="top" className="hero">
      {override ? <img className="hero__img" src={override} alt="" fetchPriority="high" /> : slides.map((photo, i) =>
        <img key={photo.id} className={`hero__img ${i === active ? "hero__img--active" : ""}`} src={photo.src} alt="" fetchPriority={i === 0 ? "high" : "auto"} />
      )}
      <div className="hero__shade" />
      <div className="hero__content">
        {/* <p className="eyebrow eyebrow--light">{siteConfig.name}</p> */}
        <h1>We Capture the Moments That Become Your Forever.</h1>
        <p className="hero__copy">
          From life's quiet, fleeting moments to celebrations that bring everyone together, we create
          photographs and films that feel personal, timeless, and unmistakably yours.
        </p>
        <div className="hero__cta">
          <a href="#gallery" className="btn btn--light">Explore Our Stories</a>
          <a href="#contact" className="btn btn--ghost">Plan Your Shoot</a>
        </div>
      </div>
    </section>
  );
}

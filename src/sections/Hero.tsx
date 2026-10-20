import { siteConfig } from "../config/siteConfig";
import { heroImages } from "../data/gallery";

export default function Hero() {
  const img = siteConfig.heroImageOverride || heroImages[0]?.src || "";
  return (
    <section id="top" className="hero">
      {img && <img className="hero__img" src={img} alt="" fetchPriority="high" />}
      <div className="hero__shade" />
      <div className="hero__content">
        <p className="eyebrow eyebrow--light">{siteConfig.name}</p>
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

import { aboutImages } from "../data/gallery";
import { siteConfig } from "../config/siteConfig";
import Reveal from "../components/Reveal";

export default function About() {
  const img = aboutImages[0];
  return (
    <section id="about" className="section about">
      <Reveal className="about__text">
        <p className="eyebrow">About the Studio</p>
        <h2>More Than a Camera. A Way of Seeing.</h2>
        <p>We believe the most powerful photographs are felt before they are seen. Our approach is
          quiet and observant: we study light, listen for emotion, and give you gentle direction so
          you can simply be yourselves.</p>
        <p>Every story gets its own artistic direction, from palette and location to pacing and
          styling, so your gallery reads like an editorial, not a template. The result is imagery
          that stays timeless long after trends have passed.</p>
        <blockquote>{siteConfig.tagline}</blockquote>
        <p className="muted">{siteConfig.subTagline}</p>
      </Reveal>
      {img && (
        <Reveal className="about__media">
          <img src={img.src} alt={img.alt || "The studio at work"} width={img.width} height={img.height} loading="lazy" decoding="async" />
        </Reveal>
      )}
    </section>
  );
}

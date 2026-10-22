import { useState } from "react";
import { testimonials } from "../data/testimonials";
import { photos } from "../data/gallery";
import Lightbox from "../components/Lightbox";

export default function Testimonials() {
  const weddingPhotos = photos.filter((p) => p.categoryId === "wedding");
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section feedback" id="feedback">
      <div className="section__head">
        <p className="eyebrow">Kind Words</p>
        <h2>Stories We Hold Close.</h2>
        <p className="muted">A few words from the people who let us be part of their story.</p>
      </div>
      <div className="quotes">
        {testimonials.map((t, i) => {
          const photo = weddingPhotos.length ? weddingPhotos[i % weddingPhotos.length] : undefined;
          return (
            <article className="quote-card" key={t.name}>
              {photo && <button className="quote-card__image" onClick={() => setOpen(weddingPhotos.indexOf(photo))} aria-label={`View photographs from ${t.name}`}>
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                <span>View photographs</span>
              </button>}
              <blockquote>“{t.quote}”</blockquote>
              <p className="quote-card__name">{t.name}</p>
            </article>
          );
        })}
      </div>
      {open !== null && <Lightbox photos={weddingPhotos} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </section>
  );
}

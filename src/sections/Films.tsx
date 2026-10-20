import { useState } from "react";
import { films } from "../data/videos";

function FilmCard({ f }: { f: (typeof films)[number] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="film">
      <div className="film__frame">
        {playing ? (
          <video src={f.src} poster={f.poster || undefined} controls autoPlay playsInline />
        ) : (
          <button onClick={() => setPlaying(true)} aria-label={`Play ${f.title}`}>
            {f.poster ? <img src={f.poster} alt={f.title} loading="lazy" decoding="async" /> : <div className="film__blank" />}
            <span className="film__play">▶</span>
          </button>
        )}
      </div>
      <p className="eyebrow">{f.categoryLabel}</p>
      <h3>{f.title}</h3>
      {f.caption && <p className="muted">{f.caption}</p>}
    </article>
  );
}

export default function Films() {
  return (
    <section id="films" className="section section--dark">
      <div className="section__head">
        <p className="eyebrow eyebrow--light">Films</p>
        <h2>Motion, Memory & Music.</h2>
      </div>
      {films.length === 0 ? (
        <p className="empty">Films will appear here once videos are added to public/videos/.</p>
      ) : (
        <div className="films">{films.map((f) => <FilmCard key={f.src} f={f} />)}</div>
      )}
    </section>
  );
}

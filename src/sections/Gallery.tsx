import { useMemo, useState } from "react";
import { photos } from "../data/gallery";
import { categories } from "../data/categories";
import Lightbox from "../components/Lightbox";

function Tile({ p, onOpen }: { p: (typeof photos)[number]; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      className={`tile ${loaded ? "tile--loaded" : ""}`}
      style={{ aspectRatio: `${p.width} / ${p.height}` }}
      onClick={onOpen}
      aria-label={`Open ${p.alt}`}
    >
      <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
      <span className="tile__label">{p.categoryLabel}</span>
    </button>
  );
}

export default function Gallery() {
  const [active, setActive] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const available = useMemo(() => categories.filter((c) => photos.some((p) => p.categoryId === c.id)), []);
  const shown = useMemo(() => (active === "all" ? photos : photos.filter((p) => p.categoryId === active)), [active]);
  const activeLabel = categories.find((c) => c.id === active)?.label;

  return (
    <section id="gallery" className="section">
      <div className="section__head">
        <p className="eyebrow">Portfolio</p>
        <h2>Stories, Beautifully Told.</h2>
        <p className="muted">Every frame has a feeling. Every story has its own rhythm.</p>
      </div>

      <div className="filters" role="tablist">
        <button className={active === "all" ? "on" : ""} onClick={() => setActive("all")}>All</button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={active === c.id ? "on" : ""}
            onClick={() => setActive(c.id)}
            title={available.some((a) => a.id === c.id) ? "" : "No photographs yet"}
          >
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="empty">
          {active === "all" ? "No photographs have been added yet." : `New ${activeLabel} stories are coming soon.`}
        </p>
      ) : (
        <div className="masonry">
          {shown.map((p, i) => <Tile key={p.id} p={p} onOpen={() => setOpen(i)} />)}
        </div>
      )}

      {open !== null && <Lightbox photos={shown} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </section>
  );
}

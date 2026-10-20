import { useEffect } from "react";
import type { Photo } from "../data/gallery";

interface Props { photos: Photo[]; index: number; onClose: () => void; onChange: (i: number) => void; }

export default function Lightbox({ photos, index, onClose, onChange }: Props) {
  const p = photos[index];
  const prev = () => onChange((index - 1 + photos.length) % photos.length);
  const next = () => onChange((index + 1) % photos.length);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  });

  if (!p) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={p.src} alt={p.alt} width={p.width} height={p.height} />
        <figcaption>
          <span className="eyebrow">{p.categoryLabel}</span>
          {p.caption && <span>{p.caption}</span>}
          <span className="count">{index + 1} / {photos.length}</span>
        </figcaption>
      </figure>
      <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
    </div>
  );
}

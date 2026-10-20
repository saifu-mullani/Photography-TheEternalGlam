import manifest from "./media.generated.json";
import { categories } from "./categories";

export interface Photo {
  id: string; src: string; width: number; height: number;
  alt: string; caption: string; categoryId: string; categoryLabel: string;
}

type Raw = { src: string; width: number; height: number; alt: string; caption: string };
const images = manifest.images as unknown as Record<string, Raw[]>;
const base = import.meta.env.BASE_URL;
export const url = (p: string) => (p ? base + p : "");

export const photos: Photo[] = categories.flatMap((c) =>
  (images[c.folder] ?? []).map((i, n) => ({
    id: `${c.id}-${n}`,
    src: url(i.src),
    width: i.width,
    height: i.height,
    alt: i.alt || `${c.label} photograph ${n + 1}`,
    caption: i.caption,
    categoryId: c.id,
    categoryLabel: c.label,
  }))
);

export const heroImages = (images["hero"] ?? []).map((i) => ({ ...i, src: url(i.src) }));
export const aboutImages = (images["about"] ?? []).map((i) => ({ ...i, src: url(i.src) }));

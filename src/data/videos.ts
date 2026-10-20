import manifest from "./media.generated.json";
import { categories } from "./categories";
import { url } from "./gallery";

export interface Film { src: string; poster: string; title: string; caption: string; categoryLabel: string; }

type Raw = { category: string; src: string; poster: string; title: string; caption: string };

export const films: Film[] = (manifest.videos as unknown as Raw[]).map((v) => ({
  src: url(v.src),
  poster: url(v.poster),
  title: v.title,
  caption: v.caption,
  categoryLabel: categories.find((c) => c.folder === v.category)?.label ?? v.category,
}));

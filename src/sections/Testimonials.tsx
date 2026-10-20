import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="section">
      <div className="quotes">
        {testimonials.map((t) => (
          <figure key={t.name}>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

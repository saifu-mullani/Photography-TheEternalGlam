import { services } from "../data/services";

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="section__head">
        <p className="eyebrow">Services</p>
        <h2>Crafted for Every Chapter.</h2>
      </div>
      <ol className="services">
        {services.map((s, i) => (
          <li key={s.title}>
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p className="muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

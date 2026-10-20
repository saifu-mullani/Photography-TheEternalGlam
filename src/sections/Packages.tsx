import { packages } from "../data/packages";

export default function Packages() {
  return (
    <section id="packages" className="section section--tint">
      <div className="section__head">
        <p className="eyebrow">Packages</p>
        <h2>Thoughtfully Designed, Fully Customisable.</h2>
      </div>
      <div className="packages">
        {packages.map((p) => (
          <div key={p.name} className={`package ${p.featured ? "package--feat" : ""}`}>
            <h3>{p.name}</h3>
            <p className="price">{p.price}</p>
            <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            <a href="#contact" className="btn btn--small">Enquire</a>
          </div>
        ))}
      </div>
    </section>
  );
}

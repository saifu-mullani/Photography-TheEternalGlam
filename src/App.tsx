import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Gallery from "./sections/Gallery";
import Films from "./sections/Films";
import Services from "./sections/Services";
import Packages from "./sections/Packages";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Films />
        <Services />
        <Packages />
        <Testimonials />
        <Contact />
      </main>
      <Chatbot />
    </>
  );
}

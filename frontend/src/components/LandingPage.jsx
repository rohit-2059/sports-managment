import Header from "./Header";
import Hero from "./mvpblocks/gradient-hero";
import Features from "./mvpblocks/feature-2";
import Pricing from "./mvpblocks/designer-pricing";
import TestimonialsCarousel from "./mvpblocks/testimonials-carousel";
import FAQ from "./mvpblocks/faq-3";
import ContactUs from "./mvpblocks/contact-us-1";

function LandingPage({ onSwitchToLogin, onSwitchToRegister }) {
  return (
    <div className="scroll-smooth">
      <Header 
        onSwitchToLogin={onSwitchToLogin}
        onSwitchToRegister={onSwitchToRegister}
      />
      <Hero 
        onSwitchToLogin={onSwitchToLogin}
        onSwitchToRegister={onSwitchToRegister}
      />
      <Features />
      <Pricing />
      <TestimonialsCarousel />
      <FAQ />
      <ContactUs />
    </div>
  );
}

export default LandingPage;
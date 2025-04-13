import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>About HomeVista</h1>
      <p>
        <strong>HomeVista</strong> is a <strong>premium luxury real estate consultancy</strong> specializing in{" "}
        <strong>high-end residential and commercial properties</strong> in <strong>South Mumbai</strong> and{" "}
        <strong>Mumbai Suburban</strong>. Our approach is built on <strong>professionalism, trust, and delivering top-notch services</strong>.
      </p>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose HomeVista?</h2>
        <div className="why-grid">
          <div className="why-item">🏆 <strong>Expertise:</strong> 10+ years in the luxury real estate market.</div>
          <div className="why-item">🔍 <strong>Transparency:</strong> 100% honest and ethical dealings.</div>
          <div className="why-item">🌎 <strong>Global Network:</strong> Partnerships with top real estate brands worldwide.</div>
          <div className="why-item">📊 <strong>Data-Driven Insights:</strong> Advanced market analysis to guide your investments.</div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">🏠 Luxury Home Sales</div>
          <div className="service-card">🏢 Commercial Property Leasing</div>
          <div className="service-card">📊 Investment Consultancy</div>
          <div className="service-card">📜 Legal & Financial Advisory</div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission">
        <h2>Our Vision & Mission</h2>
        <p><strong>Vision:</strong> To set new benchmarks in the real estate space with global aspirations.</p>
        <p><strong>Mission:</strong> To deliver excellence and create a trusted brand for real estate advisory services in India.</p>
      </section>

      {/* Meet Our Team */}
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-container">
          <div className="team-member">
            <h3>Ayesha Ansari</h3>
            <p>Email: ayesha@homevista.com</p>
            <p>Phone: +91-987-654-3210</p>
          </div>
          <div className="team-member">
            <h3>Aaisha Fitwala</h3>
            <p>Email: aaisha@homevista.com</p>
            <p>Phone: +91-987-654-3211</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial">
          <p>"HomeVista helped me find my dream home in South Mumbai. Their professionalism and market knowledge are unmatched!"</p>
          <h4>— Rahul Mehta</h4>
        </div>
        <div className="testimonial">
          <p>"Excellent service and transparency. I trusted HomeVista with my real estate investments, and they delivered beyond expectations."</p>
          <h4>— Priya Kapoor</h4>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
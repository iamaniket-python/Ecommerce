import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/HeroBanner.css";

const slides = [
  {
    title: "Big Savings, Every Day",
    subtitle: "Shop from thousands of products at unbeatable prices",
    buttonText: "Shop Now",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "New Arrivals Just Landed",
    subtitle: "Check out the latest additions from your favorite sellers",
    buttonText: "Explore",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    title: "Become a Seller Today",
    subtitle: "Grow your business by reaching thousands of customers",
    buttonText: "Start Selling",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="hero-banner" style={{ background: slide.gradient }}>
      <div className="hero-content">
        <h1>{slide.title}</h1>
        <p>{slide.subtitle}</p>
        <Link to={slide.buttonText === "Start Selling" ? "/register" : "/"} className="hero-btn">
          {slide.buttonText}
        </Link>
      </div>

      <div className="hero-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`hero-dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
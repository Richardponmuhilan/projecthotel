// src/pages/Offers/OfferSection.jsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./OfferSection.css";

// sample images - adjust imports to match your project structure
import offer1 from "../../utils/images/card1.jpg";
import offer2 from "../../utils/images/card1.jpg";
import offer3 from "../../utils/images/card1.jpg";
import offer4 from "../../utils/images/card1.jpg"; // optional

const OFFERS = [
  { img: offer1, title: "Weekend Special", desc: "Flat 20% off on all biryanis this weekend!" },
  { img: offer2, title: "Happy Hours", desc: "Buy 1 get 1 free on cocktails, 5–7 PM daily." },
  { img: offer3, title: "Family Feast", desc: "Free dessert platter with family meals." },
  { img: offer4, title: "Lunch Combo", desc: "Starter + Main + Drink at a special price." },
];

const DESKTOP_SETTINGS = {
  dots: true,
  infinite: true,
  speed: 600,
  centerMode: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 992, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1 } }, // still desktop slider fallback
  ],
};

const MOBILE_SETTINGS = {
  dots: true,
  infinite: true,
  speed: 450,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false,
  adaptiveHeight: true,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default function OfferSection() {
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(max-width: 576px)").matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 576px)");
    const handler = (e) => setIsMobileView(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return (
    <section className="offer-section container my-5">
     <h2 className="offers-heading mb-4">Special Offers</h2>

      {/* Desktop slider */}
      {!isMobileView && (
        <Slider {...DESKTOP_SETTINGS} className="offers-slider-desktop">
          {OFFERS.map((o, i) => (
            <div key={i} className="slick-slide-inner">
              <article className="offer-card">
                <img src={o.img} alt={o.title} className="offer-img" />
                <div className="offer-content">
                  <h3 className="offer-title">{o.title}</h3>
                  <p className="offer-desc">{o.desc}</p>
                  {/* If you want a CTA per card:
                      <a className="offer-cta" href="#">Redeem</a> */}
                </div>
              </article>
            </div>
          ))}
        </Slider>
      )}

      {/* Mobile slider — different card layout */}
      {isMobileView && (
        <Slider {...MOBILE_SETTINGS} className="offers-slider-mobile">
          {OFFERS.map((o, i) => (
            <div key={i}>
              <article className="offer-card-mobile">
                <div className="offer-card-mobile-img">
                  <img src={o.img} alt={o.title} />
                </div>
                <div className="offer-card-mobile-body">
                  <h3 className="offer-title">{o.title}</h3>
                  <p className="offer-desc">{o.desc}</p>
                </div>
              </article>
            </div>
          ))}
        </Slider>
      )}<div className="d-flex justify-content-center mt-4">
      <a href="/offers" className="btn explore-offers-btn">
        Explore More Offers
      </a>
    </div>
    </section>
  );
}

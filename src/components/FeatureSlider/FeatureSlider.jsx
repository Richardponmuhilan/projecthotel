// src/components/FeatureSlider.jsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './FeatureSlider.css'
// images (adjust paths if necessary)
import card1 from "../../utils/images/card1.jpg";
import card2 from "../../utils/images/card2.jpg";
import card3 from "../../utils/images/card3.jpg";
import card4 from "../../utils/images/card4.jpg";
import card5 from "../../utils/images/card5.jpg";
import card6 from "../../utils/images/card6.jpg";

/* animation variants */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};
const cardVariant = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)", scale: 0.99 },
  show: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const DESKTOP_SETTINGS = {
  dots: true,
  infinite: true,
  speed: 600,
  centerMode: true,
  centerPadding: "40px",
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 2, centerMode: false, centerPadding: "0px" } },
    { breakpoint: 576, settings: { slidesToShow: 1, centerMode: false, centerPadding: "0px" } },
  ],
};

const MOBILE_SETTINGS = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false,
  centerPadding: "0px",
  autoplay: true,
  autoplaySpeed: 3000,
  adaptiveHeight: true,
};

/* feature data (self-contained) */
const FEATURES = [
  {
    img: card1,
    title: "Authentic Indian Cuisine",
    desc: "From spicy curries to fragrant biryanis — experience the rich, diverse flavors of India.",
  },
  {
    img: card2,
    title: "Refreshing Sips: Coffee & Mocktails",
    desc: "Start your day or refresh your evening with our premium Indian-style coffee and chilled mocktails.",
  },
  {
    img: card3,
    title: "Fine Drinks & Cocktails",
    desc: "Enjoy your meal with a curated selection of alcoholic beverages, classic cocktails and premium spirits.",
  },
  {
    img: card5,
    title: "Royal Indian Curries",
    desc: "Experience the richness of India made using traditional recipes.",
  },
  {
    img: card4,
    title: "Authentic Biryani",
    desc: "Indulge in fragrant basmati rice, aromatic spices, and tender meat.",
  },
  {
    img: card6,
    title: "Tandoori Delights",
    desc: "Enjoy smoky tandoor-grilled meats, and breads, cooked to perfection.",
  },
];

export default function FeatureSlider({ className = "" }) {
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(max-width: 576px)").matches;
  });

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
    <div className={`feature-slider-root ${className}`}>
      {isMobileView ? (
        <div className="features-slider-mobile-wrapper">
          <Slider {...MOBILE_SETTINGS} className="features-slider-mobile">
            {FEATURES.map((f, idx) => (
              <div key={f.img + idx} className="mobile-card">
                <div className="mobile-card-img">
                  <img src={f.img} alt={f.title} loading="lazy" />
                </div>
                <div className="mobile-card-body">
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.01 }}>
          <Slider {...DESKTOP_SETTINGS} className="features-slider-desktop">
            {FEATURES.map((f, idx) => (
              <motion.div key={f.img + idx} className="feature-card text-center" variants={cardVariant}>
                <img src={f.img} alt={f.title} className="card-bg-img" loading="lazy" />
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </Slider>
        </motion.div>
      )}
    </div>
  );
}

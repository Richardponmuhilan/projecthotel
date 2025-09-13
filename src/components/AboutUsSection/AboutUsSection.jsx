// src/components/AboutUsSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./AboutUsSection.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// images (adjust paths if necessary)
import AboutSectionImg from "../../utils/images/Homemade Tandoori Masala.jpg";
import card1 from "../../utils/images/card1.jpg";
import card2 from "../../utils/images/card2.jpg";
import card3 from "../../utils/images/card3.jpg";
import card4 from "../../utils/images/card4.jpg";
import card5 from "../../utils/images/card5.jpg";
import card6 from "../../utils/images/card6.jpg";
import BookingImg from "../../utils/images/card6.jpg"; // placeholder: background image for booking
import FeatureSlider from "../FeatureSlider/FeatureSlider.jsx"

// custom hook (adjust path if needed)
import { useTimeslots } from "../../hooks/useTimeslots";
import BookingForm from "../BookingForm/BookingForm";

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

const sliderSettings = {
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

/* Feature data to avoid duplication */
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

/* normalize server slot object (the API shape you provided) */
function normalizeSlotFromServer(item, index) {
  if (!item) return null;

  const startISO = item.startDate || item.start || item.time || null;

  if (!startISO) {
    if (typeof item === "string") {
      return { id: `${item}-${index}`, startISO: null, label: item, startTime: item, endTime: null, durationMin: 0, available: true, raw: item };
    }
    return null;
  }

  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return null;

  const durationMin = Number(item.duration) || 0;
  const end = new Date(start.getTime() + durationMin * 60000);

  const fmt = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const startLocal = fmt(start);
  const endLocal = durationMin > 0 ? fmt(end) : null;
  const label = endLocal ? `${startLocal} — ${endLocal}` : startLocal;

  const status = (item.status || "").toString().toUpperCase();
  const available = status === "AVAILABLE";

  return {
    id: item.id || `${startISO}-${index}`,
    startISO,
    label,
    startTime: startLocal,
    endTime: endLocal,
    durationMin,
    available,
    raw: item,
  };
}

/* component */
function AboutUsSection() {
  const today = new Date().toISOString().split("T")[0];
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // timeslots hook - auto loads for the selected date
  const { timeslots, loading: tsLoading, error: tsError, refresh: refreshTimeslots } = useTimeslots({ auto: true, date });

  useEffect(() => {
    setSelectedTime("");
  }, [date]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const normalizedSlots = useMemo(() => {
    if (!Array.isArray(timeslots)) return [];
    return timeslots.map((s, i) => normalizeSlotFromServer(s, i)).filter(Boolean);
  }, [timeslots]);

  /* === Mobile detection state === */
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

  const handleSubmitBooking = async (e) => {
    e && e.preventDefault && e.preventDefault();

    // basic validation
    if (!name.trim()) return alert("Please enter your name.");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return alert("Please enter a valid email address.");
    const mobileDigits = (mobile || "").replace(/\D/g, "");
    if (mobileDigits.length < 7 || mobileDigits.length > 15) return alert("Please enter a valid mobile number (7–15 digits).");

    if (!date) return alert("Please choose a date.");
    if (!selectedTime) return alert("Please choose a time slot.");
    if (!guests || guests < 1) return alert("Please select number of guests.");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobileDigits,
      guests,
      date,
      startISO: selectedTime,
      notes: notes.trim(),
    };

    // TODO: POST payload to your booking API endpoint (replace URL)
    // Example:
    // const res = await fetch(`${API_BASE}/book`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    // handle response/errors accordingly.

    setConfirmation({ ...payload, createdAt: new Date().toISOString() });
    alert(`Booking confirmed for ${payload.name} — ${payload.guests} guests on ${payload.date} at ${payload.startISO}`);
  };

  return (
    <section className="about-section">
      <div className="about-overlay">
        <div className="container my-5">
          <div className="row flex-column-reverse flex-lg-row align-items-center">
            {/* left about image */}
            <motion.div
              className="col-lg-6 d-flex justify-content-center"
              initial={{ opacity: 0, x: -300 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: false, amount: 0.01 }}
            >
              <img src={AboutSectionImg} className="about-section-img img-fluid mt-5 mt-lg-0 shadow" alt="about us" />
            </motion.div>

            {/* text */}
            <motion.div
              className="col-lg-6 d-flex flex-column justify-content-center aboutus-text"
              initial={{ opacity: 0, x: 350 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: false, amount: 0.01 }}
            >
              <h2 className="headline mb-4 mb-lg-5">
                <span className="white">Fresh.</span> <span className="highlight">Authentic</span> <span className="white">. Exquite</span>
              </h2>

              <h4 className="subhead mb-3">Bringing the true Essence of Indian Cuisine to your Table</h4>

              <p className="desc mb-4 mb-lg-5">
                Indian Spice House brings you the rich flavors of India, crafted with authentic spices and traditional recipes.
                Located in Piotrkowska 120, 90-006 Łódź, we offer a warm ambiance and a true Indian dining experience.
              </p>

              <Link to="/about">
                <button type="button" className="btn btn-dark btn-lg text-capitalize shadow">More about us</button>
              </Link>
            </motion.div>
          </div>

          {/* features slider */}
          <div className="features-section container my-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <FeatureSlider />
                <div className="d-flex justify-content-center mt-4">
                  <Link to="/order" className="btn booking-hero-cta">Order Now</Link>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Booking section ---------- */}
          <div className="booking-section container my-5">
            <div className="row booking-row">
              {/* left hero image (background) */}
              <motion.div
                className="col-lg-6 mb-4 mb-lg-0 booking-img-hero"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.01 }}
                style={{ backgroundImage: `url(${BookingImg})` }}
              >
                <div className="booking-img-overlay" />
                <div className="booking-hero-inner">
                  <div className="booking-hero-pre">Order Online Now</div>
                  <h2 className="booking-hero-title">
                    Satisfy Your Cravings
                    <br />
                    with Our Delectable
                    <br />
                    Indian Foods
                  </h2>
                  <Link to="/order" className="btn booking-hero-cta">Order Now</Link>
                </div>
              </motion.div>

              {/* right booking form — column set to d-flex so inner card can stretch to match image */}
              <BookingForm/>
            </div>
          </div>
          {/* end booking */}
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;

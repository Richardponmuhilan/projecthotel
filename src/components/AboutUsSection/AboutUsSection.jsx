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

// custom hook (adjust path if needed)
import { useTimeslots } from "../../hooks/useTimeslots";

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
                <button type="button" className="btn btn-dark btn-lg rounded-0 text-capitalize shadow">More about us</button>
              </Link>
            </motion.div>
          </div>

          {/* features slider */}
          <div className="features-section container my-5">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* responsive slider: render mobile-optimized slider when isMobileView === true */}
                {isMobileView ? (
                  <div className="features-slider-mobile-wrapper">
                    <Slider
                      {...{
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
                      }}
                      className="features-slider-mobile"
                    >
                      {FEATURES.map((f, idx) => (
                        <div key={f.img + idx} className="mobile-card">
                          <div className="mobile-card-img">
                            <img src={f.img} alt={f.title} />
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
                    <Slider {...sliderSettings} className="features-slider-desktop">
                      {FEATURES.map((f, idx) => (
                        <motion.div key={f.img + idx} className="feature-card text-center" variants={cardVariant}>
                          <img src={f.img} alt={f.title} className="card-bg-img" />
                          <h3 className="feature-title">{f.title}</h3>
                          <p className="feature-desc">{f.desc}</p>
                        </motion.div>
                      ))}
                    </Slider>
                  </motion.div>
                )}

                <div className="d-flex justify-content-center mt-4">
                  <Link to="/menu" className="btn booking-hero-cta">Order Now</Link>
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
                  <Link to="/menu" className="btn booking-hero-cta">Order Now</Link>
                </div>
              </motion.div>

              {/* right booking form — column set to d-flex so inner card can stretch to match image */}
              <motion.div
                className="col-lg-6 d-flex"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: false, amount: 0.01 }}
              >
                <div className="booking-card dark w-100">
                  <h3 className="mb-3">Reserve a Table</h3>
                  <p className="text-muted small mb-3">Choose your party size, date and preferred time slot.</p>

                  {/* scrollable form area */}
                  <form id="booking-form" className="booking-form" onSubmit={handleSubmitBooking}>
                    <div className="row">
                      {/* Name */}
                      <div className="col-12 mb-3">
                        <label className="form-label">Full name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      {/* Email & Mobile */}
                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="you@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label">Mobile</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+48 123 456 789"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>

                      {/* Guests & Date */}
                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label">Guests</label>
                        <select className="form-select" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-md-6 mb-3">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>

                      {/* Time slots */}
                      <div className="col-12 mb-3">
                        <label className="form-label">Time slot</label>

                        {tsLoading && <div className="mb-2"><small className="text-muted">Loading time slots…</small></div>}

                        {tsError && (
                          <div className="mb-2 d-flex align-items-center gap-2">
                            <small className="text-danger">Failed to load slots: {tsError}</small>
                            <button type="button" className="btn btn-sm btn-link" onClick={() => refreshTimeslots().catch(() => {})}>Retry</button>
                          </div>
                        )}

                        <div className="time-slots d-flex flex-wrap gap-2">
                          {normalizedSlots.length > 0 ? (
                            normalizedSlots.map((slot) => {
                              const value = slot.startISO || slot.startTime || slot.label;
                              const disabled = !slot.available;
                              const isActive = selectedTime === value;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => !disabled && setSelectedTime(value)}
                                  disabled={disabled}
                                  className={`time-slot-btn btn-sm ${isActive ? "active" : ""}`}
                                  title={!slot.available ? "Unavailable" : `Book ${slot.label}`}
                                >
                                  <div style={{ lineHeight: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{slot.startTime}</div>
                                    {slot.endTime && <div style={{ fontSize: 11 }}>{slot.endTime}</div>}
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            !tsLoading && (
                              <>
                                <small className="text-muted d-block mb-2">No slots available for this date.</small>
                                {["12:00","12:30","13:00","18:00","18:30","19:00"].map((s) => (
                                  <button key={s} type="button" onClick={() => setSelectedTime(s)} className={`time-slot-btn btn-sm ${selectedTime === s ? "active" : ""}`}>{s}</button>
                                ))}
                              </>
                            )
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="col-12 mb-3">
                        <label className="form-label">Notes (optional)</label>
                        <input type="text" className="form-control" placeholder="eg. birthday, high-chair, allergies..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
                    </div>
                  </form>

                  {/* footer pinned at bottom of card (buttons) */}
                  <div className="booking-footer">
                    <button
                      type="button"
                      className="btn btn-primary dark-cta"
                      onClick={() => document.getElementById("booking-form")?.requestSubmit()}
                    >
                      Confirm reservation
                    </button>

                    <button
                      type="button"
                      className="btn reset-btn"
                      onClick={() => { setGuests(2); setDate(today); setSelectedTime(""); setNotes(""); setName(''); setEmail(''); setMobile(''); refreshTimeslots().catch(()=>{}); }}
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      className="btn refresh-btn ms-auto"
                      onClick={() => refreshTimeslots().catch(() => {})}
                      title="Refresh available slots"
                    >
                      Refresh slots
                    </button>
                  </div>

                  {confirmation && (
                    <div className="mt-3 booking-confirmation alert alert-success">
                      <strong>Booked:</strong> {confirmation.name || confirmation.guests} — {confirmation.guests} guests — {confirmation.date} at {confirmation.startISO || confirmation.time}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
          {/* end booking */}
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;

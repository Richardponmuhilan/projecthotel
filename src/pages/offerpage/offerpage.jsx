// src/pages/Offers/OfferSection.jsx
import React, { useState } from "react";
import "./offerpage.css";

// sample images - adjust imports to match your project structure
import offer1 from "../../utils/images/card1.jpg";
import offer2 from "../../utils/images/card1.jpg";
import offer3 from "../../utils/images/card1.jpg";
import offer4 from "../../utils/images/card1.jpg";

const OFFERS = [
  { img: offer1, title: "Weekend Special", desc: "Flat 20% off on all biryanis this weekend!" },
  { img: offer2, title: "Happy Hours", desc: "Buy 1 get 1 free on cocktails, 5–7 PM daily." },
  { img: offer3, title: "Family Feast", desc: "Free dessert platter with family meals." },
  { img: offer4, title: "Lunch Combo", desc: "Starter + Main + Drink at a special price." },
];

const COUPONS = [
  { code: "SPICE20", summary: "20% off on orders above PLN 80", expires: "2025-12-31", note: "Valid for delivery & pickup." },
  { code: "HAPPYHOUR", summary: "Buy 1 Get 1 (drinks) 17:00-19:00", expires: "2025-09-30", note: "In-restaurant only." },
  { code: "FAMILY10", summary: "10% off Family Feast", expires: "2026-03-31", note: "Applies to family combos only." },
];

export default function OfferPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch {
      alert("Copy failed, please copy manually.");
    }
  };

  return (
    <section className={`offer-section container my-5 ${hoveredIndex !== null ? "card-hovered" : ""}`}>
      {/* Heading */}
      <div className="offer-heading-block">
        <h2 className="offers-heading mb-2">Special Offers</h2>
        <p className="offers-sub mb-4">Handpicked deals just for you — tap a code to copy and use it at checkout.</p>
      </div>

      {/* Offers Grid */}
      <div className="offers-grid" role="list">
        {OFFERS.map((o, i) => (
          <article
            className={`offer-card-grid ${hoveredIndex === i ? "active" : ""}`}
            role="listitem"
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="offer-card-media">
              <img src={o.img} alt={o.title} className="offer-card-img" />
            </div>
            <div className="offer-card-body">
              <h3 className="offer-card-title">{o.title}</h3>
              <p className="offer-card-desc">{o.desc}</p>
              <div className="offer-card-meta">
                <a className="offer-cta" href="/menu">Redeem Offer</a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Dim overlay (only active when a card is hovered) */}
      {hoveredIndex !== null && <div className="offers-dim-overlay" aria-hidden="true" />}

      {/* Explore button */}
  
      {/* Coupons */}
      <div className="coupons-wrapper mt-5">
        <h3 className="mb-3">Available Promo Codes</h3>
        <div className="coupons-grid">
          {COUPONS.map((c) => {
            const isCopied = copiedCode === c.code;
            return (
              <div className="coupon-card" key={c.code}>
                <div className="coupon-top">
                  <div className="coupon-code">{c.code}</div>
                  <button
                    type="button"
                    className={`btn btn-sm copy-btn ${isCopied ? "copied" : ""}`}
                    onClick={() => copyToClipboard(c.code)}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="coupon-body">
                  <div className="coupon-summary">{c.summary}</div>
                  <div className="coupon-note text-muted">{c.note}</div>
                </div>
                <div className="coupon-footer text-muted">
                  <small>Expires: {c.expires}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// src/components/OrderOnline/CheckoutModal.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import "../OrderOnline/CheckoutModal.css";

/* Leaflet imports for the map picker */
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

/* Fix default icon (React + Leaflet common workaround) */
const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/**
 * CheckoutModal
 * Props:
 *  - open: bool
 *  - onClose: () => void
 *  - onAddMore: () => void
 *  - onOrderPlaced: (payload) => void
 */
export default function CheckoutModal({
  open = false,
  onClose = () => {},
  onAddMore = () => {},
  onOrderPlaced = () => {},
}) {
  const { items = [], subtotal = 0, clearCart } = useCart();

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery"); // 'delivery' | 'pickup'
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'online' | 'cash'
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Map picker state
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState({ lat: 51.7592, lng: 19.4560 }); // default Łódź

  const nameRef = useRef(null);

  // Autofocus + scroll lock when open
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
      // small delay to allow mount/animation then focus
      setTimeout(() => {
        nameRef.current?.focus();
      }, 80);
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  const formatPrice = (value) => {
    try {
      return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
        maximumFractionDigits: 0,
      }).format(Number(value || 0));
    } catch {
      return `PLN ${Math.round(Number(value || 0))}`;
    }
  };

  const totalItemsCount = useMemo(() => items.reduce((s, it) => s + (Number(it.qty) || 0), 0), [items]);

  const validateForm = () => {
    if (!name.trim()) return { ok: false, field: "name" };
    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (phoneDigits.length < 7) return { ok: false, field: "phone" };
    if (email) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) return { ok: false, field: "email" };
    }
    if (deliveryMethod === "delivery") {
      if (!address.trim()) return { ok: false, field: "address" };
      if (!pincode.trim()) return { ok: false, field: "pincode" };
    }
    if (!items || items.length === 0) return { ok: false, field: "cart" };
    return { ok: true };
  };

  const buildOrderPayload = () => ({
    customer: { name: name.trim(), phone: phone.trim(), email: email.trim() },
    delivery: {
      type: deliveryMethod,
      address: deliveryMethod === "delivery" ? { street: address.trim(), landmark: landmark.trim(), pincode: pincode.trim(), lat: location.lat, lng: location.lng } : null,
      notes: null,
    },
    payment: { method: paymentMethod },
    items: items.map((it) => ({
      id: it.id,
      title: it.title,
      qty: it.qty,
      basePrice: it.basePrice,
      addOns: it.addOns || [],
      lineTotal: (Number(it.basePrice || 0) + (it.addOns || []).reduce((s, a) => s + Number(a.price || 0), 0)) * Number(it.qty || 0),
    })),
    totals: { subtotal, total: subtotal },
    createdAt: new Date().toISOString(),
  });

  const openConfirm = () => {
    const v = validateForm();
    if (!v.ok) {
      if (v.field === "cart") return alert("Your cart is empty.");
      if (v.field === "name") return alert("Please enter your name.");
      if (v.field === "phone") return alert("Please enter a valid phone number.");
      if (v.field === "address") return alert("Please enter a street address.");
      if (v.field === "pincode") return alert("Please enter a postal code.");
      return alert("Please complete the form.");
    }
    setShowConfirm(true);
  };

  const confirmAndPay = async () => {
    setLoading(true);
    const payload = buildOrderPayload();
    try {
      // TODO: integrate real payment here
      await new Promise((r) => setTimeout(r, 900));

      setLoading(false);
      setShowConfirm(false);

      clearCart();
      onOrderPlaced(payload);
      onClose();
      alert("Order placed successfully!");
    } catch (err) {
      setLoading(false);
      alert("Payment failed, please try again.");
    }
  };

  /* ---------------- Map marker helper ---------------- */
  function LocationMarker({ location, setLocation }) {
    const map = useMapEvents({
      click(e) {
        setLocation(e.latlng);
        map.flyTo(e.latlng, map.getZoom()); // center smoothly on click
      },
    });
  
    return (
      <Marker
        position={[location.lat, location.lng]}
        draggable
        eventHandlers={{
          dragend: (e) => {
            setLocation(e.target.getLatLng());
          },
        }}
      />
    );
  }

  /* ---------------- motion variants ---------------- */
  const backdropVariant = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const panelVariant = {
    hidden: { opacity: 0, scale: 0.98, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
    exit: { opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.16 } },
  };

  /* if not open, render nothing (prevent portal mount) */
  if (!open) return null;

  const modalContent = (
    <AnimatePresence>
      <>
        <motion.div
          className="checkout-modal-backdrop"
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => {
            if (!loading) onClose();
          }}
        />

        <motion.div
          className="checkout-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          variants={panelVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="checkout-content" aria-describedby="checkout-desc">
            <div className="checkout-header">
              <h3 id="checkout-title">Checkout</h3>
              <button
                className="modal-close"
                onClick={() => {
                  if (!loading) onClose();
                }}
                aria-label="Close checkout"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="checkout-body" id="checkout-desc">
              <div className="checkout-left">
                <h4>Customer details</h4>

                <label className="form-label">Full name *</label>
                <input ref={nameRef} className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" aria-required="true" />

                <label className="form-label">Phone *</label>
                <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+48 123 456 789" aria-required="true" />

                <label className="form-label">Email (optional)</label>
                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

                <h5 style={{ marginTop: 12 }}>Delivery method</h5>
                <div className="delivery-methods" role="radiogroup" aria-label="Delivery method">
                  <label className={`delivery-option ${deliveryMethod === "delivery" ? "active" : ""}`}>
                    <input
                      type="radio"
                      checked={deliveryMethod === "delivery"}
                      onChange={() => setDeliveryMethod("delivery")}
                      aria-checked={deliveryMethod === "delivery"}
                    />
                    <span>🚚 Delivery</span>
                  </label>

                  <label className={`delivery-option ${deliveryMethod === "pickup" ? "active" : ""}`}>
                    <input
                      type="radio"
                      checked={deliveryMethod === "pickup"}
                      onChange={() => setDeliveryMethod("pickup")}
                      aria-checked={deliveryMethod === "pickup"}
                    />
                    <span>🏠 Pickup</span>
                  </label>
                </div>

                {/* Address fields shown only for delivery */}
                {deliveryMethod === "delivery" && (
                  <div className="address-fields">
                    <div>
                      <label className="form-label">Street Address *</label>
                      <input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, building, apartment..." />
                    </div>

                    <div>
                      <label className="form-label">Landmark (optional)</label>
                      <input className="form-control" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Nearby landmark (e.g., mall, park)" />
                    </div>

                    <div>
                      <label className="form-label">Pincode *</label>
                      <input className="form-control" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Postal Code" />
                    </div>

                    <div>
                      <label className="form-label">Location</label>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          type="button"
                          className="btn-select-map"
                          onClick={() => setShowMap(true)}
                        >
                          📍 Select Location from Map
                        </button>
                        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                          {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "No location selected"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <h5 style={{ marginTop: 12 }}>Payment</h5>
                <div className="payment-methods" role="radiogroup" aria-label="Payment method">
                  <label className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}>
                    <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                    <span>💳 Card</span>
                  </label>

                  <label className={`payment-option ${paymentMethod === "online" ? "active" : ""}`}>
                    <input type="radio" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                    <span>🌐 Online Payment</span>
                  </label>

                  <label className={`payment-option ${paymentMethod === "cash" ? "active" : ""}`}>
                    <input type="radio" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                    <span>💵 Cash on Delivery / Pickup</span>
                  </label>
                </div>

                <div style={{ marginTop: 14 }}>
                  <button className="btn-proceed" onClick={openConfirm} disabled={loading}>
                    {loading ? "Processing…" : `Proceed to pay ${formatPrice(subtotal)}`}
                  </button>
                  <button className="btn-clear" style={{ marginLeft: 8 }} onClick={() => onClose()} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </div>

              <aside className="checkout-right">
                <h4>Order summary</h4>
                <div className="summary-list">
                  {items.length === 0 ? (
                    <div className="empty">Your cart is empty</div>
                  ) : (
                    items.map((it, i) => {
                      const addOnText = (it.addOns || []).map((a) => a.name).join(", ");
                      const lineTotal =
                        (Number(it.basePrice || 0) + (it.addOns || []).reduce((s, a) => s + Number(a.price || 0), 0)) *
                        Number(it.qty || 0);
                      return (
                        <div key={i} className="summary-line">
                          <div className="summary-left">
                            <div className="summary-title">
                              {it.title} <small className="muted">x{it.qty}</small>
                            </div>
                            {addOnText && <div className="summary-addons">{addOnText}</div>}
                          </div>
                          <div className="summary-right">{formatPrice(lineTotal)}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="summary-totals">
                  <div className="row">
                    <div>Items</div>
                    <div>{totalItemsCount}</div>
                  </div>
                  <div className="row total">
                    <div>Total</div>
                    <div>{formatPrice(subtotal)}</div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn-clear"
                      onClick={() => {
                        onAddMore();
                      }}
                      disabled={loading}
                    >
                      Add more items
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Confirm panel */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div className="confirm-panel-wrapper" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                <div className="confirm-panel">
                  <h4>Confirm your order</h4>
                  <div className="confirm-summary">
                    {items.map((it, idx) => {
                      const addOnText = (it.addOns || []).map((a) => a.name).join(", ");
                      const lineTotal =
                        (Number(it.basePrice || 0) + (it.addOns || []).reduce((s, a) => s + Number(a.price || 0), 0)) * Number(it.qty || 0);
                      return (
                        <div key={idx} className="confirm-line">
                          <div>
                            {it.title} x{it.qty}
                            {addOnText ? ` — ${addOnText}` : ""}
                          </div>
                          <div>{formatPrice(lineTotal)}</div>
                        </div>
                      );
                    })}
                    <div className="confirm-line total">
                      <div>Total</div>
                      <div>{formatPrice(subtotal)}</div>
                    </div>
                  </div>

                  <div className="confirm-actions">
                    <button className="btn-clear" onClick={() => setShowConfirm(false)} disabled={loading}>
                      Cancel
                    </button>
                    <button className="btn-proceed" onClick={confirmAndPay} disabled={loading}>
                      {loading ? "Processing…" : "Confirm & Pay"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Map modal (portal is same since outer is portal'd) */}
        {showMap && (
          <div className="map-modal-backdrop" onClick={() => setShowMap(false)}>
            <div className="map-modal" onClick={(e) => e.stopPropagation()}>
              <h4>Select your location</h4>

              <div style={{ height: 300, width: "100%", borderRadius: 8, overflow: "hidden" }}>
                <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  <LocationMarker location={location} setLocation={setLocation} />

                </MapContainer>
              </div>

              <div className="map-actions" style={{ marginTop: 12 }}>
                <button className="btn-clear" onClick={() => setShowMap(false)}>
                  Cancel
                </button>
                <button
                  className="btn-proceed"
                  onClick={() => {
                    // optional: set address to coords if you want auto-fill
                    // setAddress(`${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`);
                    setShowMap(false);
                    // small feedback
                    alert(`Location saved: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`);
                  }}
                >
                  Save Location
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

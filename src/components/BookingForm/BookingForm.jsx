import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTimeslots } from "../../hooks/useTimeslots";
import "./BookingForm.css";

function normalizeSlotFromServer(item, index) {
  if (!item) return null;
  const startISO = item.startDate || item.start || item.time || null;
  if (!startISO) return null;
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

function BookingForm({ today = new Date().toISOString().split("T")[0] }) {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const { timeslots, loading: tsLoading, error: tsError, refresh: refreshTimeslots } =
    useTimeslots({ auto: true, date });

  useEffect(() => setSelectedTime(""), [date]);

  const normalizedSlots = useMemo(() => {
    if (!Array.isArray(timeslots)) return [];
    return timeslots.map((s, i) => normalizeSlotFromServer(s, i)).filter(Boolean);
  }, [timeslots]);

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return alert("Please enter a valid email.");
    const mobileDigits = (mobile || "").replace(/\D/g, "");
    if (mobileDigits.length < 7 || mobileDigits.length > 15)
      return alert("Please enter a valid mobile number.");
    if (!date) return alert("Please choose a date.");
    if (!selectedTime) return alert("Please choose a time slot.");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobileDigits,
      guests,
      date,
      startISO: selectedTime,
      notes: notes.trim(),
    };
    setConfirmation({ ...payload, createdAt: new Date().toISOString() });
    alert(`Booking confirmed for ${payload.name} — ${payload.guests} guests on ${payload.date} at ${payload.startISO}`);
  };

  return (
    <motion.div
      className="col-lg-6 d-flex"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: false, amount: 0.1 }}
    >
      <div className="booking-card dark w-100">
        <h3 className="mb-3">Reserve a Table</h3>
        <p className="small mb-3">Choose your party size, date and preferred time slot.</p>

        <form id="booking-form" className="booking-form" onSubmit={handleSubmitBooking}>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Full name</label>
              <input type="text" className="form-control" placeholder="Your full name"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="you@domain.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label className="form-label">Mobile</label>
              <input type="tel" className="form-control" placeholder="+48 123 456 789"
                value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>

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
              <input type="date" className="form-control" min={today} value={date}
                onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Time slot</label>
              {tsLoading && <small className="text-muted d-block mb-2">Loading time slots…</small>}
              {tsError && <div className="mb-2 text-danger">Failed to load slots: {tsError}</div>}

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
                      >
                        <div style={{ lineHeight: 1 }}>
                          <div style={{ fontWeight: 600 }}>{slot.startTime}</div>
                          {slot.endTime && <div style={{ fontSize: 11 }}>{slot.endTime}</div>}
                        </div>
                      </button>
                    );
                  })
                ) : !tsLoading ? (
                  <small className="">No slots available for this date.</small>
                ) : null}
              </div>
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Notes (optional)</label>
              <input type="text" className="form-control" placeholder="eg. birthday, high-chair..."
                value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        </form>

        <div className="booking-footer">
          <button type="submit" form="booking-form" className="btn btn-primary dark-cta">Confirm reservation</button>
          <button
            type="button"
            className="btn reset-btn"
            onClick={() => { setGuests(2); setDate(today); setSelectedTime(""); setNotes(""); setName(''); setEmail(''); setMobile(''); refreshTimeslots().catch(()=>{}); }}
          >
            Reset
          </button>
          <button type="button" className="btn refresh-btn ms-auto" onClick={() => refreshTimeslots().catch(() => {})}>
            Refresh slots
          </button>
        </div>

        {confirmation && (
          <div className="mt-3 booking-confirmation alert alert-success">
            <strong>Booked:</strong> {confirmation.name} — {confirmation.guests} guests — {confirmation.date} at {confirmation.startISO}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BookingForm;

import React from "react";
import BookingForm from "../../components/BookingForm/BookingForm";
import "./ReservationPage.css";

function ReservationPage() {
  return (
    <div className="reservation-page">
      <header className="reservation-hero">
        <div className="reservation-hero-overlay">
          <h1 className="reservation-title">Reserve a Table</h1>
          <p className="reservation-subtitle">
            Book your spot in advance and enjoy authentic Indian flavors without the wait.
          </p>
        </div>
      </header>

      <main className="reservation-main container">
        <div className="reservation-content">
          <BookingForm />
        </div>
      </main>
    </div>
  );
}

export default ReservationPage;

import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";
import logo from '../../utils/images/indian_spice_house_logo.png';

function Footer() {
  return (
    <footer className="site-footer">
      {/* Top */}
      <div className="footer-top container">
        <div className="row">
          {/* Brand */}
          <div className="col-lg-4 col-md-6 mb-4">
          <Link to='/' className='navbar-brand text-success d-flex align-items-center'>
            <img
                src={logo}
                alt='Indian Spice House Logo'
                className='d-inline-block align-top'
                style={{ height: '80px', width: '50%' }} // adjust size as needed
              />
            </Link>
            <h3 className="footer-brand">Indian Spice House</h3>
            <p className="footer-tagline">
              Bringing the authentic taste of India to your table.
            </p>
            <div className="footer-social d-flex gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="me-2" />
                Piotrkowska 120, 90-006 Łódź, Poland
              </li>
              <li>
                <FaPhoneAlt className="me-2" />
                +48 123 456 789
              </li>
              <li>
                <FaEnvelope className="me-2" />
                info@indianspicehouse.com
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-heading">Opening Hours</h5>
            <ul className="footer-hours">
              <li>Mon - Fri: 11:00 AM - 10:00 PM</li>
              <li>Sat: 12:00 PM - 11:00 PM</li>
              <li>Sun: Closed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p className="m-0">
          © {new Date().getFullYear()} Indian Spice House. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

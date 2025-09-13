import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Footer from './components/Footer/Footer';
import OfferPage from './pages/offerpage/offerpage';
import logo from './utils/images/indian_spice_house_logo.png';
import OrderOnline from "./components/OrderOnline/OrderOnline";
import "leaflet/dist/leaflet.css";
import ReservationPage from './pages/ReservationPage/ReservationPage';
import ScrollToTop from './components/ScrollToTop';




function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // close mobile menu when route changes
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // helper to mark active link
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  

  return (
    <div id="app">
      <header className={`app-header ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="app-header-inner">
          <Link to="/" className="brand" aria-label="Home" onClick={() => setMobileOpen(false)}>
            <img
              src={logo}
              alt="Indian Spice House Logo"
              className="brand-logo"
            />
          
          </Link>

          <nav className="nav" aria-label="Primary navigation">
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/menu" className={`nav-item ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
            <Link to="/offers" className={`nav-item ${isActive('/offers') ? 'active' : ''}`}>Offers</Link>
            <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link to="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            <Link to="/book" className="cta">Book a table</Link>
            <Link to="/order" className="cta">Order Online</Link>
          </nav>

          <button
            className="hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            <span
              className="bar top"
              style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="bar mid"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="bar bottom"
              style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>

        {/* mobile menu */}
        <div className="mobile-menu" style={{ display: mobileOpen ? 'block' : 'none' }}>
  <Link 
    to="/" 
    className={`mobile-link ${isActive('/') ? 'active' : ''}`} 
    onClick={() => setMobileOpen(false)}
  >
    Home
  </Link>
  <Link 
    to="/menu" 
    className={`mobile-link ${isActive('/menu') ? 'active' : ''}`} 
    onClick={() => setMobileOpen(false)}
  >
    Menu
  </Link>
  <Link 
    to="/offers" 
    className={`mobile-link ${isActive('/offers') ? 'active' : ''}`} 
    onClick={() => setMobileOpen(false)}
  >
Offers  </Link>
  <Link 
    to="/about" 
    className={`mobile-link ${isActive('/about') ? 'active' : ''}`} 
    onClick={() => setMobileOpen(false)}
  >
    About
  </Link>
  <Link 
    to="/contact" 
    className={`mobile-link ${isActive('/contact') ? 'active' : ''}`} 
    onClick={() => setMobileOpen(false)}
  >
    Contact
  </Link>
  <Link 
    to="/book" 
    className="mobile-link"
    onClick={() => setMobileOpen(false)}
  >
   Book a table
  </Link>
  <Link 
    to="/order" 
    className="mobile-link"
    onClick={() => setMobileOpen(false)}
  >
   Order Online
  </Link>
  {/* <Link 
    to="/contact" 
    className="mobile-link cta" 
    onClick={() => setMobileOpen(false)}
  >
    Book a table
  </Link> */}
</div>

      </header>

      <main>
      <ScrollToTop/>
        <Routes>
      
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/offers' element={<OfferPage />} />
          <Route path="/order" element={<OrderOnline />} />
          <Route path="/book" element={<ReservationPage />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

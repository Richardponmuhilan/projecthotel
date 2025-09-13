import React from "react";
import "./About.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ImageGrid from "../../components/ImageGrid/ImageGrid";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import Reviews from "../../components/Reviews/Reviews";

// IMPORTANT: use FOUR DISTINCT images (do NOT reuse same file)
import Img1 from "../../utils/images/card1.jpg";
import Img2 from "../../utils/images/card2.jpg";
import Img3 from "../../utils/images/card3.jpg";
import Img4 from "../../utils/images/card4.jpg";

function About() {
  const gridImages = [
    { src: Img1, alt: "dining area" },
    { src: Img2, alt: "chef cooking" },
    { src: Img3, alt: "banana leaf" },
    { src: Img4, alt: "tandoori grill" },
  ];
  

  return (
    <div className="about-page">
      <header className="about-hero">
        <motion.div
          className="container h-100 d-flex align-items-center justify-content-center"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="about-hero-title">About Us</h1>
        </motion.div>
      </header>

      <div className="about-container container my-5">
        <div className="about-grid">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="about-heading">
              Bringing the true <span className="highlight">Essence</span> of Indian Cuisine to your Table
            </h2>
            <p className="about-desc">
              <b>Indian Spice House</b> brings you the rich flavors of India,
              crafted with authentic spices and traditional recipes. Located in
              the heart of Łódź at Piotrkowska 120, we offer a warm ambiance
              and a dining experience that transports you to the vibrant streets
              of India.
            </p>
            <p className="about-desc">
              From smoky <b>tandoori grills</b> to creamy <b>curries</b> and
              coastal specialties, our menu is a journey across India — prepared
              with care and served with heart.
            </p>
            <Link to="/contact">
                    <button
                      type="button"
                      className="btn btn-outline-light btn-lg text-capitalize mx-2 shadow"
                    >
                      Contact us
                    </button>
                  </Link>
          </motion.div>

          <motion.div
            className="about-imagegrid"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
          >
            <ImageGrid images={gridImages} />
          </motion.div>
        </div>

        <div className="about-stats">
          <div className="stat">
            <h3  className="highlight">15+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat">
            <h3  className="highlight">50+</h3>
            <p>Signature Dishes</p>
          </div>
          <div className="stat">
            <h3  className="highlight">1000+</h3>
            <p>Happy Customers</p>
          </div>
        </div>
      </div>

      <div className="about-gallery bg-dark text-light py-1">
        <ImageGallery />
      </div>
      <div className="about-reviews my-5">
        <Reviews />
      </div>
    </div>
  );
}

export default About;

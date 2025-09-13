import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ContactInfo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // detect mobile by width (adjust breakpoint to match your design)
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // animation variants
  const mobileVariants = {
    hidden: { opacity: 0, x: 0 },   // don't shift on mobile (optional)
    visible: { opacity: 1, x: 0 },
  };

  const desktopVariants = {
    hidden: { opacity: 0, x: -300 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="d-flex flex-column align-items-center"
      // if mobile: animate on mount, else: animate when in view
      {...(isMobile
        ? {
            variants: mobileVariants,
            initial: "hidden",
            animate: "visible",
            transition: { duration: 0.7, ease: "easeOut" },
          }
        : {
            variants: desktopVariants,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: false, amount: 0.15 }, // slightly larger amount
            transition: { duration: 0.8, ease: "easeOut" },
          })}
    >
      <h2 className="fs-1 mb-3 text-uppercase fw-bold">Where to find us</h2>
      <p className="mb-5">Piotrkowska 120, 90-006 Łódź</p>

      <h3 className="text-capitalize">Opening hours</h3>
      <p className="m-0">Mon - Thu: 12am - 21.30pm</p>
      <p className="m-0">Fri - Sat : 12 am - 22 pm</p>
      <p>Sunday: 12am - 21 pm</p>
    </motion.div>
  );
}

export default ContactInfo;

import React from "react";
import "./Reviews.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeftAlt, faQuoteRightAlt } from "@fortawesome/free-solid-svg-icons";

import reviews from "../../utils/reviews";

function Reviews() {
  return (
    <section className="reviews-section container my-5">
      <motion.div
        className="reviews-header text-center mb-5"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="reviews-title text-uppercase fw-bold">Customer Reviews</h2>
        <div className="reviews-underline" />
      </motion.div>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="reviews-swiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <motion.div
              className="review-card mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="review-text">
                <FontAwesomeIcon
                  icon={faQuoteLeftAlt}
                  size="sm"
                  className="quote-icon"
                />
                <p>{review.description}</p>
                <FontAwesomeIcon
                  icon={faQuoteRightAlt}
                  size="sm"
                  className="quote-icon"
                />
              </div>
              <div className="review-footer">
                <img
                  src={review.img}
                  alt={review.name}
                  className="review-img shadow"
                />
                <h5 className="review-name">{review.name}</h5>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Reviews;

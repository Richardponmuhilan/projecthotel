// src/components/ImageGallery.jsx
import React, { useState } from "react";
import "./ImageGallery.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

import { EffectCoverflow, Navigation, Thumbs, Autoplay } from "swiper/modules";

import ImageGallery1 from "../../utils/images/gallery1.jpg";
import ImageGallery2 from "../../utils/images/gallery2.jpg";
import ImageGallery3 from "../../utils/images/gallery3.jpg";
import ImageGallery4 from "../../utils/images/gallery4.jpg";
import ImageGallery5 from "../../utils/images/gallery5.jpg";
import ImageGallery6 from "../../utils/images/gallery6.jpg";
import ImageGallery7 from "../../utils/images/gallery7.jpg";
import ImageGallery8 from "../../utils/images/gallery8.jpg";
import ImageGallery9 from "../../utils/images/gallery9.jpg";
import ImageGallery10 from "../../utils/images/gallery10.jpg";

const images = [
  { src: ImageGallery1, alt: "Dish 1" },
  { src: ImageGallery2, alt: "Dish 2" },
  { src: ImageGallery3, alt: "Dish 3" },
  { src: ImageGallery4, alt: "Dish 4" },
  { src: ImageGallery5, alt: "Dish 5" },
  { src: ImageGallery6, alt: "Dish 6" },
  { src: ImageGallery7, alt: "Dish 7" },
  { src: ImageGallery8, alt: "Dish 8" },
  { src: ImageGallery9, alt: "Dish 9" },
  { src: ImageGallery10, alt: "Dish 10" },
];

export default function ImageGallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section className="gallery-section container my-5" aria-labelledby="gallery-heading">
      {/* Header */}
      <div className="gallery-header" id="gallery-heading">
        <div className="gallery-heading-inner">
          <h2 className="gallery-title">Our Gallery</h2>
          <p className="gallery-sub">A visual feast — taste the experience.</p>
        </div>
      </div>

      <div className="gallery-inner">
        <Swiper
          modules={[EffectCoverflow, Navigation, Thumbs, Autoplay]}    // <-- include Autoplay here
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
          autoplay={{
            delay: 2000,               // 2 seconds
            disableOnInteraction: false, // continue autoplay after user interacts
            pauseOnMouseEnter: true,     // pause when hovering (optional)
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 80,
            depth: 220,
            modifier: 1,
            slideShadows: false,
          }}
          thumbs={{ swiper: thumbsSwiper }}
          className="gallery-main"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} style={{ width: "360px" }}>
              <div className="slide-card" role="img" aria-label={img.alt}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="slide-overlay" />
                <div className="slide-caption">
                  <span>{img.alt}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="gallery-nav" aria-hidden="true">
            <button className="gallery-prev nav-btn" aria-label="Previous slide">‹</button>
            <button className="gallery-next nav-btn" aria-label="Next slide">›</button>
          </div>
        </Swiper>

        {/* thumbnails - do NOT include Autoplay here */}
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={12}
          slidesPerView={7}
          watchSlidesProgress={true}
          className="gallery-thumbs"
          breakpoints={{
            0: { slidesPerView: 3 },
            576: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            992: { slidesPerView: 7 },
          }}
        >
          {/* {images.map((img, i) => (
            <SwiperSlide key={`t-${i}`} className="thumb-slide" aria-hidden="true">
              <div className="thumb-inner">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            </SwiperSlide>
          ))} */}
        </Swiper>
      </div>
    </section>
  );
}

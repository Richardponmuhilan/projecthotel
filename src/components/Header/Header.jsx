import React from 'react';
import './Header.css';
import Carousel from 'react-bootstrap/Carousel';
import MenuBtn from '../MenuBtn/MenuBtn';
import { Link } from 'react-router-dom';

// ✅ Import images so Vite resolves them correctly
import img1 from '../../utils/images/break-fast-cor.png';
import img2 from '../../utils/images/corosule-2.jpg';
import img3 from '../../utils/images/gallery13.jpg';

function Header() {
  return (
    <header>
      <Carousel
        fade
        interval={5000}   // auto-slide every 5s
        controls={true}   // show prev/next buttons
        indicators={true} // show dots
        pause="hover"
        className="carousel-fade mt-5 mt-sm-0"
      >
        {/* Slide 1 */}
        <Carousel.Item
          className="carousel-item1 vh-100"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${img1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Carousel.Caption className="h-100 pb-0">
            <div className="row h-100">
              <div className="col-xl-7 d-flex flex-column align-items-center align-items-md-start justify-content-center mt-5">
                
                {/* ✅ Styled Heading */}
                <h2 className="carousel-heading text-center text-md-start">
                  A <span className="highlight-red">Taste</span> of India, Right <br />
                  in the <span className="highlight-orange">Heart of Łódź!</span>
                </h2>

                <div className="d-flex flex-column flex-sm-row mt-4">
                  <MenuBtn />
                  <Link to="/contact">
                    <button
                      type="button"
                      className="btn btn-outline-light btn-lg text-capitalize mx-2 shadow"
                    >
                      Contact us
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block"></div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 */}
        <Carousel.Item
          className="carousel-item2 vh-100"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.7)), url(${img2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Carousel.Caption className="h-100 pb-0">
            <div className="row h-100">
              <div className="col-xl-7 d-flex flex-column align-items-center align-items-md-start justify-content-center mt-5">
                
                {/* ✅ Same styled heading */}
                <h2 className="carousel-heading text-center text-md-start">
                  A <span className="highlight-red">Taste</span> of India, Right <br />
                  in the <span className="highlight-orange">Heart of Łódź!</span>
                </h2>

                <div className="d-flex flex-column flex-sm-row mt-4">
                  <MenuBtn />
                  <Link to="/contact">
                    <button
                      type="button"
                      className="btn btn-outline-light btn-lg  text-capitalize mx-2 shadow"
                    >
                      Contact us
                    </button>
                  </Link>
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block"></div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

    
      </Carousel>
    </header>
  );
}

export default Header;

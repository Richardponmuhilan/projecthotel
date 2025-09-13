import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AboutChef1Img from '../../utils/images/indian food.jpg';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import Reviews from '../../components/Reviews/Reviews';

function About() {
  return (
    <div className='about-page'>
      <header className='height-50 mt-5'>
        <motion.div 
          className="container h-100 d-flex align-items-center justify-content-center"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className='text-light'>About</h1>
        </motion.div>
      </header>

      <div className="container my-5">
        <div className="row">
          <motion.div 
            className="col-lg-6 d-flex flex-column justify-content-center mb-5 mb-lg-0"
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.01}}>
          
            <h1 className="highlight">Where Every Meal Tells a Story from India.</h1>
<p>
Welcome to Indian Spice House, your newest destination for authentic Indian cuisine in the heart of Łódź. Located at Piotrkowska 120, we are proud to bring the vibrant flavors, rich traditions, and warmth of Indian hospitality to Poland.

Our journey began with a passion to share the true essence of India — not just the taste, but the feeling. Every dish we serve is prepared with original Indian spices, traditional recipes, and the kind of care you’d find in a family kitchen.

From the smoky tandoori grills of Amritsar, the creamy curries of Delhi, to the spicy coastal dishes of Kerala and Goa, our menu is a flavorful trip across India.

Whether you're joining us for a quiet dinner, celebrating a special occasion, or grabbing a quick takeaway, we promise to serve you with flavor, freshness, and heart.

Come and experience India on a plate — right here in Łódź.</p>
            <Link to='/contact'>
              <button type='button' className='btn btn-success btn-lg rounded-0 text-capitalize mt-3 shadow'>Contact us</button>
            </Link>
          </motion.div>
          <motion.div 
            className="col-lg-6"
            initial={{ opacity: 0, x: 350 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.01 }}>
          
            <img src={AboutChef1Img} className='img-fluid' alt="our staff" />
          </motion.div>
        </div>
      </div>

      <div className="bg-dark text-light py-1">
        <ImageGallery />
      </div>

      <div className="my-5">
        <Reviews />
      </div>
    </div>
  )
}

export default About;
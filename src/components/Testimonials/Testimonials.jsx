import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    id: 0,
    name: 'Jennifer M.',
    location: 'Tampa, FL',
    project: 'Kitchen Remodel',
    rating: 5,
    text: 'Chad and the entire UBC team were absolutely incredible. They helped us every step of the way — from selecting the granite countertops and cabinets, to the final installation. The kitchen looks stunning and came in exactly on budget. No pressure, just pure professionalism.',
    initials: 'JM',
    color: '#7FA646',
  },
  {
    id: 1,
    name: 'Robert & Lisa T.',
    location: 'Clearwater, FL',
    project: 'Home Addition',
    rating: 5,
    text: 'We needed an addition after our family grew, and UBC made the permit process completely seamless. Julio managed every detail on-site and the craftsmanship is outstanding. Our new master suite blends perfectly with the rest of the house.',
    initials: 'RL',
    color: '#B8673E',
  },
  {
    id: 2,
    name: 'David S.',
    location: 'Tampa Bay, FL',
    project: 'Storm Damage Repair',
    rating: 5,
    text: 'After hurricane damage, we were overwhelmed with the "substantial damage" status on our permit. Rei and the team navigated all the complex requirements and got us back in our home ahead of schedule. They truly go above and beyond.',
    initials: 'DS',
    color: '#7FA646',
  },
  {
    id: 3,
    name: 'Amanda K.',
    location: 'St. Petersburg, FL',
    project: 'Bathroom Renovation',
    rating: 5,
    text: 'My master bathroom now looks like a luxury hotel spa! The glass shower they installed is beautiful, and the tile work is flawlessly precise. The team was professional, clean, and finished ahead of schedule. 10/10 would recommend.',
    initials: 'AK',
    color: '#B8673E',
  },
];

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={18} 
          className={i < rating ? 'star-filled' : 'star-empty'} 
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((active - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((active + 1) % testimonials.length);

  return (
    <section className="testimonials section" id="testimonials">
      <div className="container">
        <motion.div 
          className="testimonials-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">Client Reviews</div>
          <h2 className="section-title">
            What Our <span>Clients</span> Say
          </h2>
          <p className="section-subtitle" style={{margin: '16px auto 0'}}>
            Real stories from real homeowners across Tampa Bay — 5-star experiences, every time.
          </p>
        </motion.div>

        {/* Featured Testimonial Slider */}
        <div className="testimonial-slider-container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={active}
              className="testimonial-featured glass-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Quote size={80} className="featured-quote-icon" />
              <div className="featured-content">
                <StarRating rating={testimonials[active].rating} />
                <p className="featured-text">"{testimonials[active].text}"</p>
                <div className="featured-author">
                  <div className="author-avatar" style={{background: `linear-gradient(135deg, ${testimonials[active].color}, #444)`}}>
                    {testimonials[active].initials}
                  </div>
                  <div>
                    <div className="author-name">{testimonials[active].name}</div>
                    <div className="author-info">
                      <span className="author-project">{testimonials[active].project}</span>
                      <span className="author-sep">·</span>
                      <span className="author-location">{testimonials[active].location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="testi-nav-controls">
            <button className="testi-nav-btn" onClick={prev}><ChevronLeft size={24} /></button>
            <div className="testi-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testi-dot ${i === active ? 'active' : ''}`}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <button className="testi-nav-btn" onClick={next}><ChevronRight size={24} /></button>
          </div>
        </div>

        {/* Rating summary */}
        <motion.div 
          className="rating-summary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="rating-big">5.0</div>
          <div className="rating-detail">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="#f5c842" color="#f5c842" />)}
            </div>
            <div className="rating-text">Average Client Rating</div>
            <div className="rating-source">Based on verified reviews</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

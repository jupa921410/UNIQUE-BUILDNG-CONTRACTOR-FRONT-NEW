import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Shield, MapPin } from 'lucide-react';
import hero1 from '../../assets/hero1.png';
import hero2 from '../../assets/hero2.png';
import hero3 from '../../assets/hero3.png';
import logoMark from '../../assets/1x/logo.png';
import './Hero.css';

const slides = [
  {
    id: 0,
    image: hero1,
    badge: 'Quiet Luxury Renovations',
    headline: 'Distinctive Design',
    headlineGold: 'Superior Construction',
    sub: 'Kitchens, baths and full renovations built with intention and crafted to endure across Tampa Bay.',
    cta: 'Request a Consultation',
    ctaSecondary: 'View the Work',
  },
  {
    id: 1,
    image: hero2,
    badge: 'Kitchens & Baths',
    headline: 'Built with intention.',
    headlineGold: 'Crafted to endure.',
    sub: 'Premium full renovations featuring exquisite materials and distinctive design for your home.',
    cta: 'Request a Consultation',
    ctaSecondary: 'View the Work',
  },
  {
    id: 2,
    image: hero3,
    badge: 'Tampa Bay',
    headline: 'Quiet Luxury',
    headlineGold: 'Renovations',
    sub: 'Navy cabinetry, honed marble, and brushed brass. A home built to be lived in.',
    cta: 'Request a Consultation',
    ctaSecondary: 'View the Work',
  },
];

function AnimatedWords({ text, className = '' }) {
  return (
    <span className={className}>
      {text.split(' ').map((word, index) => (
        <motion.span
          className="hero-word"
          key={`${word}-${index}`}
          initial={{ y: '110%', opacity: 0, rotateX: -35 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            delay: 0.12 + index * 0.075,
            duration: 0.72,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-container">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slides[current].image}
            alt="Luxury home construction and remodeling"
            className="hero-bg-img"
            // Only one slide image is mounted at a time (AnimatePresence mode="wait")
            // and it is always in the viewport, so eager-load every slide to avoid
            // a blank frame / CLS when the slider advances.
            loading="eager"
            fetchPriority={current === 0 ? 'high' : 'auto'}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.25, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <div className="hero-light-overlay" aria-hidden="true" />
        <div className="hero-design-mark" aria-hidden="true">
          <img src={logoMark} alt="" className="hero-design-logo" />
        </div>
      </div>

      <div className="container hero-content-container">
        <div className="hero-content">


          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.74, ease: [0.16, 1, 0.3, 1] }}
              className="hero-text-wrapper"
            >
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.16, duration: 0.52 }}
                className="section-badge hero-badge"
              >
                {slides[current].badge}
              </motion.div>

              <h1 className="hero-title" >
                <AnimatedWords text={slides[current].headline} />
                <AnimatedWords text={slides[current].headlineGold} className="text-gradient hero-title-accent" />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.58 }}
                className="hero-subtitle"
              >
                {slides[current].sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.58 }}
                className="hero-cta-group"
              >
                <a href="#contact" className="btn btn-primary">
                  {slides[current].cta}
                  <ArrowRight size={20} />
                </a>
                <a href="#services" className="btn btn-secondary">
                  {slides[current].ctaSecondary}
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.86, duration: 0.68 }}
            className="hero-trust-indicators"
          >
            <div className="trust-item"><Shield className="text-green" size={18} /> License CBC1268844</div>
            <div className="trust-divider"></div>
            <div className="trust-item"><MapPin className="text-green" size={18} /> Tampa Bay</div>
          </motion.div>
        </div>
      </div>

      <div className="hero-nav-controls">
        <button className="nav-btn" onClick={handlePrev} aria-label="Previous slide"><ChevronLeft size={24} /></button>
        <div className="hero-indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`indicator-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        <button className="nav-btn" onClick={handleNext} aria-label="Next slide"><ChevronRight size={24} /></button>
      </div>
    </section>
  );
}

import ResponsiveImage from '../ResponsiveImage';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Layers3, PlayCircle, Spline } from 'lucide-react';
const logo1x = '/brand/logo-mini.svg';
import './ConstructionShowcase.css';

export default function ConstructionShowcase() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="construction-showcase section">
      <ResponsiveImage src={logo1x} alt="" className="construction-logo-mark" aria-hidden="true" />
      <div className="container construction-grid">
        <motion.div
          className="construction-copy"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-badge">Brand Identity</div>
          <h2 className="section-title">Building with <span>Purpose</span></h2>
          <p className="construction-text">
            At Unique Building Contractors, our purpose is to elevate the standard of living through exceptional craftsmanship. We don't just build structures; we create enduring spaces where families thrive and visions come to life with architectural integrity and 5-star precision.
          </p>

          <div className="construction-specs">
            <div className="construction-spec"><PlayCircle size={18} /><span>Transforming Visions into Legacies</span></div>
            <div className="construction-spec"><Spline size={18} /><span>Architectural Integrity & Quality</span></div>
            <div className="construction-spec"><Layers3 size={18} /><span>Commitment to Client Excellence</span></div>
          </div>

          <div className="construction-scroll-hint">
            <ArrowDown size={18} />
            <span>Discover our process below</span>
          </div>
        </motion.div>

        <motion.div
          className="construction-stage glass-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="construction-video-wrap">
            <div className="video-logo-overlay">
              <ResponsiveImage src={logo1x} alt="UBC Logo" className="video-overlay-logo" />
            </div>
            {!videoError ? (
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="brand-reveal-video"
                poster={logo1x}
                onError={() => setVideoError(true)}
              >
                <source src="/video.mp4" type="video/mp4" />
                <BrandFallback logo1x={logo1x} />
              </video>
            ) : (
              <BrandFallback logo1x={logo1x} />
            )}
            <div className="video-overlay-glow"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BrandFallback({ logo1x }) {
  return (
    <div className="video-fallback-content">
      <ResponsiveImage src={logo1x} alt="Unique Building Contractor" className="fallback-logo" />
    </div>
  );
}

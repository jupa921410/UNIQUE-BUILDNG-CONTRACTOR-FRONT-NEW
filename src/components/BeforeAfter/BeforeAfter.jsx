import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import beforeImg from '../../assets/before_kitchen.png';
import afterImg from '../../assets/after_kitchen.png';
import './BeforeAfter.css';

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <section className="before-after" id="portfolio">
      <div className="container">
        <motion.div 
          className="ba-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">Real Results</div>
          <h2 className="section-title">
            From Outdated to <span>Outstanding</span>
          </h2>
          <p className="section-subtitle" style={{margin: '0 auto'}}>
            See the difference our premium craftsmanship makes. Slide to compare this complete kitchen transformation in South Tampa, where we replaced cramped, dark layouts with bright, modern luxury.
          </p>
        </motion.div>

        <div className="ba-content">
          <motion.div 
            className="comparison-container"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* After Image (Background) */}
            <div className="img-after-wrapper">
              <img src={afterImg} alt="After remodeling" className="comp-img" />
              <div className="comp-label label-after">After</div>
            </div>

            {/* Before Image (Foreground, clipped) */}
            <div 
              className="img-before-wrapper" 
              style={{ width: `${sliderPos}%` }}
            >
              <img src={beforeImg} alt="Before remodeling" className="comp-img" />
              <div className="comp-label label-before">Before</div>
            </div>

            {/* Range Input (Invisible, for interaction) */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos} 
              onChange={(e) => setSliderPos(e.target.value)}
              className="comp-slider" 
              aria-label="Compare before and after"
            />

            {/* Custom Slider Handle */}
            <div className="slider-line" style={{ left: `${sliderPos}%` }}>
              <div className="slider-button">
                <ChevronLeft size={20} />
                <div className="slider-button-sep"></div>
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>

          {/* Project Details Card */}
          <motion.div 
            className="ba-details glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>Project: The Tampa Kitchen Renewal</h3>
            <ul className="ba-features">
              <li>
                <CheckCircle2 size={20} className="text-green ba-icon" />
                <span><strong>Demolition & Layout:</strong> Removed load-bearing wall to create an open concept layout.</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="text-green ba-icon" />
                <span><strong>Cabinetry:</strong> Installed custom, soft-close shaker cabinets extending to the ceiling.</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="text-green ba-icon" />
                <span><strong>Surfaces:</strong> Premium Calacatta quartz countertops with full waterfall island edge.</span>
              </li>
              <li>
                <CheckCircle2 size={20} className="text-green ba-icon" />
                <span><strong>Lighting:</strong> Under-cabinet LEDs, recessed ceiling lights, and modern pendant fixtures.</span>
              </li>
            </ul>
            <a href="#contact" className="btn btn-primary ba-btn">
              Discuss Your Project
              <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

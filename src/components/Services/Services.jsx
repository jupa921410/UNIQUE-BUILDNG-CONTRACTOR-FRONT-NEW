import ResponsiveImage from '../ResponsiveImage';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { ArrowRight } from 'lucide-react';
const logoMark = '/brand/logo-mini.svg';
import { servicesData } from '../../data/servicesData';
import './Services.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
};

export default function Services() {
  return (
    <section className="services section section-dark-800" id="services">
      <ResponsiveImage src={logoMark} alt="" className="services-brand-mark" aria-hidden="true" />
      <div className="container">
        {/* Header */}
        <motion.div 
          className="services-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">Our Expertise</div>
          <h2 className="section-title">
            Complete Construction <span>Solutions</span>
          </h2>
          <p className="section-subtitle" style={{margin: '0 auto'}}>
            From concept to completion — every project executed with precision, premium materials, and 5-star craftsmanship.
          </p>
        </motion.div>

        {/* Grid of Flip Cards */}
        <motion.div 
          className="services-flip-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {servicesData.map((svc) => (
            <motion.div
              key={svc.id}
              variants={itemVariants}
              className="flip-card"
            >
              <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front glass-card">
                  <div className="service-icon-wrap">
                    <div className="service-icon">{svc.icon}</div>
                  </div>
                  <div className="service-content-front">
                    <p className="service-subtitle">{svc.subtitle}</p>
                    <h3 className="service-title">{svc.title}</h3>
                  </div>
                  <div className="flip-hint">
                    <span>Hover to see more</span>
                  </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back">
                  <ResponsiveImage src={svc.image} alt={svc.title} className="back-img" />
                  <div className="back-overlay"></div>
                  <div className="back-content">
                    <h3 className="back-title">{svc.title}</h3>
                    <div className="service-tags">
                      {svc.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="service-tag">{tag}</span>
                      ))}
                    </div>
                    <Link to={`/services/${svc.id}`} className="btn btn-primary back-btn">
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="services-bottom"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="services-bottom-content">
            <h3>Ready to transform your property?</h3>
            <p>Get in touch with our experts to discuss your vision.</p>
          </div>
          <NavHashLink smooth to="/#contact" className="btn btn-primary">
            Schedule Free Consultation
            <ArrowRight size={20} />
          </NavHashLink>
        </motion.div>
      </div>
    </section>
  )
}

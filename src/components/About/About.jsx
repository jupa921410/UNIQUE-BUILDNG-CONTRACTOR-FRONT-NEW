import ResponsiveImage from '../ResponsiveImage';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Handshake, ShieldCheck, ArrowRight, Phone, MapPin } from 'lucide-react';
import aboutImg from '../../assets/about.png';
const logo1x = '/brand/logo-mini.svg';
import './About.css';

const values = [
  {
    icon: <Target size={24} className="text-green" />,
    title: 'Precision',
    desc: 'Every measurement, cut, and finish is executed with meticulous attention to detail.',
  },
  {
    icon: <Lightbulb size={24} className="text-green" />,
    title: 'Creativity',
    desc: 'We bring innovative design solutions that elevate your vision beyond expectations.',
  },
  {
    icon: <Handshake size={24} className="text-green" />,
    title: 'Transparency',
    desc: 'Clear communication from consultation to delivery — you\'re always in the loop.',
  },
  {
    icon: <ShieldCheck size={24} className="text-green" />,
    title: 'Excellence',
    desc: 'Premium materials and certified craftsmen on every project, every time.',
  },
];

export default function About() {
  return (
    <section className="about section section-dark" id="about">
      {/* Background Logo */}
      <ResponsiveImage src={logo1x} alt="" className="about-bg-logo" aria-hidden="true" />

      <div className="container">
        <div className="about-grid">
          {/* Image side */}
          <motion.div
            className="about-image-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="about-image-container">
              <ResponsiveImage src={aboutImg} alt="Unique Building Contractors team at work" className="about-img" />
              {/* Floating badge */}
              <motion.div
                className="about-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="badge-content">
                  <span className="badge-number">15+</span>
                  <span className="badge-text">Years of<br />Excellence</span>
                </div>
              </motion.div>
            </div>
            {/* Floating card */}
            <motion.div
              className="about-float-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="float-icon"><MapPin className="text-green" size={28} /></div>
              <div>
                <div className="float-title">Serving Tampa Bay</div>
                <div className="float-sub">Tampa · Clearwater · St. Pete</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <div className="about-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="section-badge"
            >
              About UBC
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-title"
            >
              Tampa Bay's Most <span>Trusted</span> Construction Partner
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-subtitle about-text"
            >
              Unique Building Contractors (UBC) is Tampa Bay's premier custom construction and remodeling firm. With our headquarters in New Port Richey, Florida, we bring unparalleled expertise, premium materials, and dedicated project management to every single project across the Tampa Bay and Clearwater area.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="about-text"
            >
              Led by <strong>Chad Nead, Julio Reyes and Reinay Rosete</strong>  and our expert construction managers, we take pride in being by your side from the initial free consultation through the final walkthrough. Every decision is made with your vision, budget, and timeline in mind.
            </motion.p>

            {/* Values grid */}
            <motion.div
              className="values-grid"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {values.map((val, i) => (
                <motion.div
                  key={i}
                  className="value-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                >
                  <div className="value-icon">{val.icon}</div>
                  <div>
                    <h4 className="value-title">{val.title}</h4>
                    <p className="value-desc">{val.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="about-cta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <a href="#contact" className="btn btn-primary">
                Free Consultation
                <ArrowRight size={20} />
              </a>
              <a href="tel:+18135237828" className="btn btn-secondary">
                <Phone size={20} className="text-green" />
                (813) 523-7828
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

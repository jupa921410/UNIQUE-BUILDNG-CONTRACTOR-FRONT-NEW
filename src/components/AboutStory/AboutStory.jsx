import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Award, Users, Heart, ArrowRight, Zap, Waves, Building2, Anchor, Quote } from 'lucide-react';
import aboutHeroImg from '../../assets/about.png';
import planImg from '../../assets/plan.jpg';
import afterKitchenImg from '../../assets/after_kitchen.png';
import './AboutStory.css';

const differentiators = [
  {
    icon: <Zap size={24} />,
    title: 'Full-Spectrum Expertise',
    desc: 'From structural remodeling, kitchen and bathroom renovations, and custom bathroom suites to premium high-end flooring installations — we handle every detail with mastery.'
  },
  {
    icon: <Users size={24} />,
    title: 'Residential & Commercial Versatility',
    desc: 'Whether you are a homeowner seeking a personalized transformation, or a large builder requiring consistent high-end execution, we deliver the same level of care.'
  },
  {
    icon: <Waves size={24} />,
    title: 'Coastal & Tampa Bay Specialization',
    desc: 'Deep regional knowledge allows us to deliver solutions perfectly suited to the Florida coastal environment while meeting or exceeding local building codes.'
  },
  {
    icon: <Heart size={24} />,
    title: 'Client-First Philosophy',
    desc: 'We prioritize clear communication and collaborative planning. Every project is approached with a deep understanding of your vision and lifestyle.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Proven Reliability',
    desc: 'Decades of combined experience, strong supplier relationships, and rigorous quality control throughout the Tampa Bay region.'
  }
];

const coastalCities = [
  'St. Petersburg', 'Clearwater', 'Bradenton', 'Largo', 'Seminole',
  'Pinellas Park', 'Gulfport', 'Safety Harbor', 'Oldsmar', 'Dunedin'
];

export default function AboutStory() {
  return (
    <div className="about-story-page">
      {/* 1. CINEMATIC HERO */}
      <section className="story-hero-redesign">
        <div className="story-hero-visual">
          <img src={aboutHeroImg} alt="UBC Team" className="hero-parallax-img" />
          <div className="hero-vignette"></div>
        </div>
        <div className="container">
          <motion.div
            className="hero-text-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <div className="section-badge gold">Our Story</div>
            <h1 className="hero-main-title">
              Crafting Legacies <span>Across Tampa Bay</span>
            </h1>
            <p className="hero-lead">
              Unique Building Contractors represents the next chapter of two established legacies in the building industry, merged into one powerful, unified company.
            </p>
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="stat-num">35+</span>
                <span className="stat-lab">Years Combined</span>
              </div>
              <div className="hero-stat">
                <span className="stat-num">5.0</span>
                <span className="stat-lab">Avg. Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="mouse"></div>
        </motion.div>
      </section>

      {/* 2. THE FOUNDERS & MERGER (Two Legacies) */}
      <section className="merger-depth section" id='aboutushistory'>
        <div className="container">
          <div className="merger-intro text-center">
            <h2 className="merger-main-heading">Two Legacies, <span>One Powerful Team</span></h2>
            <p className="merger-sub">How our combined skill sets create a unified standard of excellence.</p>
          </div>

          <div className="merger-split-layout">
            <motion.div
              className="legacy-profile-card glass-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="profile-icon"><Award size={40} className="text-green" /></div>
              <h3>Chad Nead</h3>
              <p className="profile-role">Owner & Remodeling Specialist</p>
              <div className="profile-desc">
                Chad brings over 20 years of hands-on experience as a trusted remodeling specialist. His expertise centers on complete kitchen and bathroom transformations, along with broad commercial and residential projects. His reputation is built on meticulous craftsmanship and results that consistently exceed expectations.
              </div>
            </motion.div>

            <div className="merger-connector">
              <div className="plus-sign">+</div>
              <div className="connector-line"></div>
            </div>

            <motion.div
              className="legacy-profile-card glass-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="profile-icon"><ShieldCheck size={40} className="text-green" /></div>
              <h3>Julio Reyes & Reinay Rosete</h3>
              <p className="profile-role">Specialized Construction Team</p>
              <div className="profile-desc">
                Contributing 15+ years of proven experience in high-end flooring and custom bathroom construction. Their work has earned the trust of major corporate builders and large-scale developers across the region, known for flawless execution and luxury finishes.
              </div>
            </motion.div>
          </div>

          <motion.div
            className="merger-conclusion"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>
              Together, we provide end-to-end services with greater efficiency, broader capabilities, and the highest standards of professionalism.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. COASTAL MASTERY */}
      <section className="coastal-mastery section">
        <div className="coastal-bg-overlay">
          <img src={planImg} alt="Architectural Plan" />
        </div>
        <div className="container">
          <div className="coastal-content-wrap">
            <div className="coastal-left">
              <div className="section-badge gold">Service Area</div>
              <h2 className="coastal-title">Masters of the <span>Coastal Lifestyle</span></h2>
              <p className="coastal-text">
                We serve the entire Tampa Bay area with specialized expertise in coastal and near-coastal municipalities. Our teams are intimately familiar with the unique challenges of Florida’s waterfront:
              </p>
              <ul className="coastal-perks">
                <li><Anchor size={18} /> Humidity & Flood-Zone Management</li>
                <li><Building2 size={18} /> Wind-Resistant Building Practices</li>
                <li><Heart size={18} /> Aesthetic Waterfront Life-Styles</li>
              </ul>
            </div>
            <div className="coastal-right">
              <div className="cities-cloud">
                {coastalCities.map((city, i) => (
                  <motion.span
                    key={city}
                    className="city-tag"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <MapPin size={12} /> {city}
                  </motion.span>
                ))}
                <span className="city-tag more">And beyond...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT SETS US APART */}
      <section className="edge-section section">
        <div className="container">
          <div className="edge-header text-center">
            <div className="section-badge">The UBC Advantage</div>
            <h2 className="section-title">What Sets <span>Us Apart</span></h2>
          </div>

          <div className="edge-grid-redesign">
            {differentiators.map((item, idx) => (
              <motion.div
                key={idx}
                className="edge-card-new"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="edge-card-inner">
                  <div className="edge-icon-circle">{item.icon}</div>
                  <div className="edge-content">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR COMMITMENT (Premium Redesign) */}
      <section className="commitment-final-luxury">
        <div className="commitment-bg">
          <img src={afterKitchenImg} alt="Finished Luxury Kitchen" className="commitment-bg-img" />
          <div className="commitment-overlay"></div>
        </div>

        <div className="container">
          <motion.div
            className="commitment-content-v2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="quote-icon-wrap">
              <Quote size={60} className="text-green opacity-50" />
            </div>

            <h2 className="commit-v2-title">Our <span>Commitment</span></h2>

            <div className="commit-v2-main">
              <p className="main-quote">
                "At Unique Building Contractors, we believe every build and renovation tells a unique story — one of transformation, quality, trust, and lasting value."
              </p>
            </div>

            <div className="commit-v2-details">
              <p>
                Whether your project is a single-room remodel, a luxury coastal bathroom, or a multi-unit commercial build, our merged team stands ready to deliver results that reflect our name: <strong>Truly Unique.</strong>
              </p>
            </div>

            <div className="commit-v2-footer">
              <div className="welcome-tag">Welcome to Unique Building Contractors</div>
              <div className="footer-accent-line"></div>
              <a href="#contact" className="btn btn-primary btn-large">
                Start Your Extraordinary Build
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

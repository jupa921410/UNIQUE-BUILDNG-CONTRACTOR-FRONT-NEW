import { motion } from 'framer-motion';
import { Building2, CalendarRange, ShieldCheck, Star, ArrowUpRight } from 'lucide-react';
import './Stats.css';

const stats = [
  {
    number: '500+',
    label: 'Projects Delivered',
    detail: 'Residential construction, remodels, and finish packages executed across Tampa Bay.',
    icon: <Building2 size={22} />,
  },
  {
    number: '15+',
    label: 'Years of Experience',
    detail: 'Field knowledge, permit coordination, and premium build execution under one team.',
    icon: <CalendarRange size={22} />,
  },
  {
    number: '5-Star',
    label: 'Client Reputation',
    detail: 'Consistent reviews driven by communication, detailing, and schedule discipline.',
    icon: <Star size={22} />,
  },
  {
    number: 'Licensed',
    label: 'And Fully Insured',
    detail: 'Professional coverage and compliant delivery for serious renovation and build work.',
    icon: <ShieldCheck size={22} />,
  },
];

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-shell">
          <motion.div
            className="stats-intro glass-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="stats-kicker">Built for Demanding Projects</span>
            <h2 className="stats-title">Measured credibility, not generic claims.</h2>
            <p className="stats-copy">
              Every number here reflects execution capacity: design coordination, construction management, and finish quality delivered with a contractor mindset.
            </p>
            <a href="/portfolio" className="stats-link">
              View Project Standards
              <ArrowUpRight size={18} />
            </a>
          </motion.div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.article
                key={stat.label}
                className="stat-card glass-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="stat-card-top">
                  <div className="stat-icon-wrap">{stat.icon}</div>
                  <span className="stat-number">{stat.number}</span>
                </div>
                <h3 className="stat-label">{stat.label}</h3>
                <p className="stat-detail">{stat.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

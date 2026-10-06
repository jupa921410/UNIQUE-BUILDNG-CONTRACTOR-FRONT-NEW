import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ChevronRight, ShieldCheck, Star } from 'lucide-react';
import logo from '../../assets/logo.svg';
import './Footer.css';

const footerServices = [
  { label: 'New Construction', id: 'new-construction' },
  { label: 'Remodeling', id: 'remodeling' },
  { label: 'Additions', id: 'additions' },
  { label: 'Kitchens & Bathrooms', id: 'kitchens-bathrooms' },
  { label: 'Flooring', id: 'flooring' },
  { label: 'Project Management', id: 'projectmanagement' },
];

const areas = [
  { name: 'Tampa, FL', slug: 'tampa-fl' },
  { name: 'Carrollwood, FL', slug: 'carrollwood-fl' },
  { name: 'Clearwater, FL', slug: 'clearwater-fl' },
  { name: 'St. Petersburg, FL', slug: 'st-petersburg-fl' },
  { name: 'Dunedin, FL', slug: 'dunedin-fl' },
  { name: 'Palm Harbor, FL', slug: 'palm-harbor-fl' },
  { name: 'Brandon, FL', slug: 'brandon-fl' },
  { name: 'Riverview, FL', slug: 'riverview-fl' },
  { name: 'Wesley Chapel, FL', slug: 'wesley-chapel-fl' },
  { name: 'Lutz, FL', slug: 'lutz-fl' },
  { name: 'Land O\' Lakes, FL', slug: 'land-o-lakes-fl' },
  { name: 'New Port Richey, FL', slug: 'new-port-richey-fl' },
  { name: 'Sarasota, FL', slug: 'sarasota-fl' },
];

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      {/* Top geometric shape */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <polygon points="0,0 1440,0 1440,60 720,0 0,40" fill="#f8f9fa" />
        </svg>
      </div>

      <div className="container">
        {/* Main footer grid */}
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <img
              src={logo}
              alt="Unique Building Contractors"
              className="footer-logo"
              style={{ height: '120px', width: 'auto' }}
              loading="lazy"
              decoding="async"
            />
            <p className="footer-tagline">
              Distinctive design, superior construction, delivered quietly.
              <br /> <span style={{ fontWeight: 'bold' }}>License: CBC1268844</span>
            </p>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links">
              {footerServices.map(service => (
                <li key={service.id}>
                  <Link to={`/services/${service.id}`} className="footer-link">
                    <ChevronRight size={14} className="footer-link-icon" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <Link to="/service-areas" style={{ color: 'inherit', textDecoration: 'none' }}>
                Service Areas
              </Link>
            </h4>
            <ul className="footer-links">
              {areas.map(a => (
                <li key={a.slug}>
                  <Link to={`/service-areas/${a.slug}`} className="footer-link">
                    <MapPin size={14} className="footer-link-icon" />
                    {a.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/service-areas" className="footer-link" style={{ color: '#10b981', fontWeight: 600 }}>
                  <ChevronRight size={14} className="footer-link-icon" />
                  View All Areas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact-items">
              <a href="tel:8135237828" className="footer-contact-item">
                <Phone size={16} className="text-green" />
                <span>813-523-7828</span>
              </a>
              <a href="mailto:sales@uniquebuildingcontractors.com" className="footer-contact-item">
                <Mail size={16} className="text-green" />
                <span>sales@uniquebuildingcontractors.com</span>
              </a>
              <div className="footer-contact-item">
                <MapPin size={16} className="text-green" />
                <span>Tampa, Florida</span>
              </div>
            </div>

            <Link to="/#contact" className="btn btn-primary footer-btn">
              Free Consultation
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Unique Building Contractors (UBC). All rights reserved. · Tampa, FL
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
            <Link to="/resources" className="footer-bottom-link">Resources</Link>
            <a href="/sitemap.xml" className="footer-bottom-link">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

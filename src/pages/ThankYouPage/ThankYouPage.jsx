import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import './ThankYouPage.css';

export default function ThankYouPage() {
  return (
    <div className="thank-you-page">
      <SEO
        title="Thank You — We'll Be in Touch Soon"
        description="Thank you for contacting Unique Building Contractors. We received your request and will follow up within 24 hours to discuss your remodeling project."
        noindex
      />

      <section className="thank-you-section section">
        <div className="container thank-you-container">
          <motion.div
            className="thank-you-card glass-card"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="ty-icon-wrap"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 size={72} className="ty-check" />
            </motion.div>

            <div className="ty-badge section-badge">Request Received</div>

            <h1 className="ty-heading">Thank You!</h1>
            <p className="ty-sub">
              We received your consultation request and will follow up with you
              within <strong>24 hours</strong> to discuss your project.
            </p>

            <div className="ty-next-steps">
              <h2 className="ty-next-title">What happens next</h2>
              <ol className="ty-steps">
                <li>
                  <span className="ty-step-num">1</span>
                  <div>
                    <strong>We review your request</strong>
                    <p>Our team reviews your project details and prepares relevant questions for our call.</p>
                  </div>
                </li>
                <li>
                  <span className="ty-step-num">2</span>
                  <div>
                    <strong>We reach out within 24 hours</strong>
                    <p>A UBC team member contacts you by phone or email to schedule your free consultation.</p>
                  </div>
                </li>
                <li>
                  <span className="ty-step-num">3</span>
                  <div>
                    <strong>Free consultation &amp; site visit</strong>
                    <p>We evaluate your space, discuss your goals, and provide honest guidance on scope and approach.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="ty-trust-bar">
              <div className="ty-trust-item">
                <CheckCircle2 size={18} className="text-green" />
                Florida Certified Building Contractor
              </div>
              <div className="ty-trust-item">
                <CheckCircle2 size={18} className="text-green" />
                License CBC1268844
              </div>
              <div className="ty-trust-item">
                <CheckCircle2 size={18} className="text-green" />
                Tampa Bay Service Area
              </div>
            </div>

            <div className="ty-actions">
              <a href="tel:+18135237828" className="btn btn-primary">
                <Phone size={18} />
                Call UBC Now — (813) 523-7828
              </a>
              <Link to="/" className="btn btn-secondary">
                Back to Home
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="ty-explore">
              <p>While you wait, explore what UBC can do for your home:</p>
              <div className="ty-explore-links">
                <Link to="/services/kitchens-bathrooms">Kitchen &amp; Bathroom Remodeling</Link>
                <Link to="/services/remodeling">Whole-Home Remodeling</Link>
                <Link to="/services/additions">Home Additions</Link>
                <Link to="/portfolio">Our Portfolio</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

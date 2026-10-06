import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import ServiceMap from './ServiceMap';
import { API_ENDPOINTS } from '../../config/api';
import './Contact.css';

const services = [
  'New Construction',
  'Remodeling',
  'Home Addition',
  'Kitchen',
  'Bathroom',
  'Flooring',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch(API_ENDPOINTS.CONTACT_FORM, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setStatus('sent');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="contact-grid">
          {/* Left: Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge">Get in Touch</div>
            <h2 className="section-title">
              Start Your Free <span>Consultation</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '40px' }}>
              Ready to transform your home? Reach out for a no-obligation consultation. Our team responds within 24 hours.
            </p>

            {/* Contact cards */}
            <div className="contact-cards">
              <a href="tel:8135237828" className="contact-card group">
                <div className="contact-card-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-card-content">
                  <div className="contact-card-label">Call Us Directly</div>
                  <div className="contact-card-value">813-523-7828</div>
                </div>
                <div className="contact-card-arrow">
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                </div>
              </a>

              <a href="mailto:sales@uniquebuildingcontractors.com" className="contact-card group">
                <div className="contact-card-icon"><Mail size={24} /></div>
                <div className="contact-card-content">
                  <div className="contact-card-label">Email Us</div>
                  <div className="contact-card-value">sales@uniquebuildingcontractors.com</div>
                </div>
                <div className="contact-card-arrow"><ArrowRight size={20} /></div>
              </a>


              <div className="contact-card">
                <div className="contact-card-icon">
                  <Clock size={24} />
                </div>
                <div className="contact-card-content">
                  <div className="contact-card-label">Response Time</div>
                  <div className="contact-card-value">Within 24 Hours</div>
                </div>
              </div>
            </div>

            <ServiceMap />

            {/* Free consult guarantee */}
            <div className="consult-guarantee glass-card">
              <div className="guarantee-icon"><CheckCircle2 size={40} className="text-green" /></div>
              <div>
                <div className="guarantee-title">100% Free Consultation</div>
                <div className="guarantee-text">No commitment. No pressure. Just honest expert advice for your project.</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="contact-form-wrap"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact-form-card glass-card">
              <div className="form-header">
                <h3>Request Your Free Quote</h3>
                <p>Fill out the form and we'll be in touch within 24 hours.</p>
              </div>

              {status === 'sent' ? (
                <motion.div
                  className="form-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 size={64} className="text-green success-icon" />
                  <h4>Message Sent!</h4>
                  <p>Thank you! We'll contact you within 24 hours to schedule your free consultation.</p>
                  <button className="btn btn-primary" onClick={() => setStatus(null)}>Send Another Message</button>
                </motion.div>
              ) : (
                <>
                  {status === 'error' && (
                    <motion.div
                      className="form-error-banner"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={20} />
                      <span>Something went wrong. Please try again or call us at <strong>813-523-7828</strong>.</span>
                    </motion.div>
                  )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="(813) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="service">Service Needed *</label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Tell Us About Your Project</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your project, timeline, and any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary form-submit"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="spinner"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Request — It's Free!
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <p className="form-privacy">
                    <Lock size={14} className="inline-icon" /> Your information is 100% private and never shared.
                  </p>
                </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

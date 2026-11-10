import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
const ServiceMap = lazy(() => import('./ServiceMap'));
import { API_ENDPOINTS } from '../../config/api';
import { trackFormConversion } from '../../config/conversions';
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

export default function Contact({ showSmsConsent = false }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [smsConsent, setSmsConsent] = useState('');
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConsentChange = (value) => {
    setSmsConsent(previous => previous === value ? '' : value);
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
        body: JSON.stringify(showSmsConsent
          ? { ...form, smsConsent: smsConsent === 'yes', smsConsentChoice: smsConsent || 'none' }
          : form),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setStatus('sent');
      trackFormConversion();
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
      setSmsConsent('');
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
              Request a private <span>consultation</span>
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '40px' }}>
              Ready to transform your home? Reach out for a no-obligation consultation. Our team responds within 24 hours.
            </p>

            {/* Contact cards */}
            <div className="contact-cards">
              <a href="tel:+18135237828" className="contact-card group">
                <div className="contact-card-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-card-content">
                  <div className="contact-card-label">Call Us Directly</div>
                  <div className="contact-card-value">(813) 523-7828</div>
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

            {typeof window !== 'undefined' ? <Suspense fallback={<p>Tampa Bay service area</p>}><ServiceMap /></Suspense> : <p>Serving Tampa Bay, Florida.</p>}

            {/* Free consult guarantee */}
            <div className="consult-guarantee glass-card">
              <div className="guarantee-icon"><CheckCircle2 size={40} className="text-green" /></div>
              <div>
                <div className="guarantee-title">Request a private consultation</div>
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
                <h3>Tell us about your project</h3>
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
                  <p>Thank you! We'll contact you within 24 hours to schedule your private consultation.</p>
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
                      <span>Something went wrong. Please try again or call us at <strong>(813) 523-7828</strong>.</span>
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

                  {showSmsConsent && (
                    <fieldset className="sms-consent">
                      <legend className="sms-consent-legend">Text Message Consent</legend>

                      <label className="sms-consent-option" htmlFor="sms-consent-yes">
                        <input
                          type="checkbox"
                          id="sms-consent-yes"
                          name="smsConsentYes"
                          checked={smsConsent === 'yes'}
                          onChange={() => handleConsentChange('yes')}
                        />
                        <span className="sms-consent-box" aria-hidden="true" />
                        <span>Yes, I consent to receive customer care messages from Unique Building contractors</span>
                      </label>

                      <label className="sms-consent-option" htmlFor="sms-consent-no">
                        <input
                          type="checkbox"
                          id="sms-consent-no"
                          name="smsConsentNo"
                          checked={smsConsent === 'no'}
                          onChange={() => handleConsentChange('no')}
                        />
                        <span className="sms-consent-box" aria-hidden="true" />
                        <span>No, I do not want to receive any text messages from Unique Building contractors</span>
                      </label>

                      <div className="sms-consent-disclosure">
                        <p>
                          Unique building contractors llc (doing business as Unique Building contractors) would
                          like your consent to send customer care text message communications from{' '}
                          <a href="tel:+18135237828">(813) 523-7828</a> to your mobile number listed above, in
                          response to your questions or to provide information relevant to your relationship
                          with us.
                        </p>
                        <p>
                          Consent is not a condition of purchase. Message frequency varies. Message and data
                          rates may apply. Reply &lsquo;STOP&rsquo; to unsubscribe at any time. Reply
                          &lsquo;HELP&rsquo; for assistance or more information. We do not share your mobile
                          opt-in information with anyone. Our combined Privacy Policy and Messaging Terms and
                          Conditions are available at{' '}
                          <a
                            href="https://www.uniquebuildingcontractors.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            id="sms-consent-privacy-link"
                          >
                            https://www.uniquebuildingcontractors.com/privacy
                          </a>
                          .
                        </p>
                      </div>
                    </fieldset>
                  )}

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

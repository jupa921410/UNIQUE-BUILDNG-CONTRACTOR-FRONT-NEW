import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, ArrowRight, Phone, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchShowcaseProjects } from '../../services/showcaseService';
import { projectCity, projectsForArea } from '../../data/projectContent';
import SEO, { cityPageSchema } from '../../components/SEO/SEO';
import { getCityData, getNearbyAreas } from '../../data/serviceAreasData';
import Contact from '../../components/Contact/Contact';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import './CityPage.css';


/* ── FAQ Accordion item ─────────────────────────────────────── */
function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cp-faq-item ${open ? 'open' : ''}`}>
      <button
        className="cp-faq-question"
        aria-expanded={open}
        id={`faq-q-${index}`}
        aria-controls={`faq-a-${index}`}
        onClick={() => setOpen(o => !o)}
      >
        {question}
        <ChevronDown size={18} className="cp-faq-chevron" />
      </button>
      <div
        className="cp-faq-answer"
        id={`faq-a-${index}`}
        role="region"
        aria-labelledby={`faq-q-${index}`}
        hidden={!open}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

/* ── Testimonial card ───────────────────────────────────────── */
function TestimonialCard({ testimonial }) {
  return (
    <div className="cp-testimonial glass-card">
      <blockquote className="cp-testi-text">"{testimonial.text}"</blockquote>
      <div className="cp-testi-author">
        <div
          className="cp-testi-avatar"
          style={{ background: `linear-gradient(135deg, ${testimonial.color}, #444)` }}
        >
          {testimonial.initials}
        </div>
        <div>
          <div className="cp-testi-name">{testimonial.name}</div>
          <div className="cp-testi-meta">
            {testimonial.project} · {testimonial.location}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function CityPage() {
  const { citySlug } = useParams();
  const cityData = getCityData(citySlug);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchShowcaseProjects()
      .then((list) => { if (!cancelled) setProjects(list); })
      .catch(() => { /* The prerendered list stays visible without JS data. */ });
    return () => { cancelled = true; };
  }, []);

  if (!cityData) {
    return <NotFoundPage />;
  }

  const nearbyAreas = getNearbyAreas(citySlug);
  const {
    city, state, slug, seoTitle, metaDescription, h1, intro,
    localContext, featuredServices, condoFocus, condoContent,
    testimonial, faqs, permitAuthority, localProjectsNote,
  } = cityData;

  const introParagraphs = intro.split('\n\n').filter(Boolean);

  return (
    <div className="city-page">
      <SEO
        title={seoTitle}
        description={metaDescription}
        path={`/service-areas/${slug}`}
        schema={cityPageSchema({ city, state, slug, h1, faqs })}
      />

      {/* ── BREADCRUMB ──────────────────────────────────────────── */}
      <nav className="cp-breadcrumb-bar" aria-label="Breadcrumb">
        <div className="container">
          <ol className="cp-breadcrumb">
            <li><Link to="/">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/service-areas">Service Areas</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{city}, {state}</li>
          </ol>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <ConceptHero imageAlt={`Architectural concept for home remodeling in ${city}, ${state}`} title={h1} label={city + ", " + state} description={introParagraphs[0]} cta="Plan your renovation" to={`/service-areas/${slug}#cp-cta-form`} />

      {/* ── SERVICES IN CITY ────────────────────────────────────── */}
      <section className="cp-services-section section section-dark" aria-labelledby="cp-services-heading">
        <div className="container">
          <div className="section-badge">Our Services</div>
          <h2 id="cp-services-heading" className="section-title">
            Our Remodeling Services <span>in {city}</span>
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 48 }}>
            Every service is available to {city} homeowners. All permits managed.
            All trades coordinated. One licensed contractor of record.
          </p>

          <div className="cp-services-grid">
            {featuredServices.map(({ id, label, desc }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/services/${id}`} className="cp-service-card glass-card">
                  <CheckCircle2 size={22} className="text-green" />
                  <div>
                    <div className="cp-service-label">{label}</div>
                    <div className="cp-service-desc">{desc}</div>
                  </div>
                  <ArrowRight size={18} className="cp-service-arrow" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCAL CONTEXT ───────────────────────────────────────── */}
      <section className="cp-local-section section" aria-labelledby="cp-local-heading">
        <div className="container cp-local-grid">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-badge">Local Knowledge</div>
            <h2 id="cp-local-heading" className="detail-heading">
              {localContext.heading}
            </h2>
            {introParagraphs.length > 1 && (
              <p className="cp-local-intro">{introParagraphs[1]}</p>
            )}
            <ul className="cp-local-list">
              {localContext.points.map((point, i) => (
                <li key={i}>
                  <CheckCircle2 size={18} className="text-green" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="cp-local-sidebar"
          >
            <div className="cp-sidebar-block glass-card">
              <h3>About Our {city} Projects</h3>
              <p>{localProjectsNote}</p>
              <div className="cp-sidebar-cta">
                <Link to="/portfolio" className="btn btn-secondary">
                  View Our Portfolio <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="cp-projects-note glass-card">
              <div className="cp-projects-icon">📋</div>
              <div>
                <div className="cp-projects-title">Recent Projects Near {city}</div>
                <div className="cp-projects-text">
                  We have completed projects across {city} and the surrounding Tampa Bay
                  region. Visit our portfolio for examples of recent work — and check
                  back as we add new completed projects.
                </div>
                {/* Filled at build time by scripts/generate-project-seo.mjs and at runtime from the API. */}
                <ul className="cp-projects-list" data-city-projects="true">
                  {projectsForArea(projects, slug).list.map(project => (
                    <li key={project.slug}>
                      <Link to={`/portfolio/${project.slug}`}>
                        {project.title}{projectCity(project) ? ` — ${projectCity(project)}, FL` : ''}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/portfolio" className="cp-projects-link">
                  View Portfolio <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONDO REMODELING (Clearwater & St. Pete only) ───────── */}
      {condoFocus && condoContent && (
        <section className="cp-condo-section section section-dark" aria-labelledby="cp-condo-heading">
          <div className="container">
            <div className="section-badge">Condo Remodeling</div>
            <h2 id="cp-condo-heading" className="section-title">
              {condoContent.heading}
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 48 }}>
              {condoContent.intro}
            </p>
            <div className="cp-condo-grid">
              {condoContent.items.map(({ icon, title, desc }) => (
                <motion.div
                  key={title}
                  className="cp-condo-item glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="cp-condo-icon">{icon}</div>
                  <h3 className="cp-condo-title">{title}</h3>
                  <p className="cp-condo-desc">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIAL ─────────────────────────────────────────── */}
      <section className="cp-testimonial-section section" aria-labelledby="cp-testi-heading">
        <div className="container cp-testi-container">
          <div>
            <div className="section-badge">Client Reviews</div>
            <h2 id="cp-testi-heading" className="detail-heading">
              What Tampa Bay Homeowners<br />Say About UBC
            </h2>
            <p className="cp-testi-note">
              Real reviews from verified clients across the Tampa Bay region.
            </p>
          </div>
          {testimonial ? <TestimonialCard testimonial={testimonial} /> : <p>Explore our portfolio and discuss your project with our team.</p>}
        </div>
      </section>

      {/* ── WHY CHOOSE UBC ──────────────────────────────────────── */}
      <section className="cp-why-section section section-dark" aria-labelledby="cp-why-heading">
        <div className="container">
          <div className="cp-why-grid">
            <div>
              <div className="section-badge">Why UBC</div>
              <h2 id="cp-why-heading" className="detail-heading">
                One Licensed Contractor<br />for {city} Homeowners
              </h2>
              <p className="cp-why-text">
                When you work with Unique Building Contractors, you hire a single Florida
                Certified Building Contractor who manages permits, trades, scheduling, and
                quality control from start to finish. No referral networks. No unverified
                sub-contractors. One team accountable to you.
              </p>
            </div>
            <div className="cp-why-items">
              {[
                { icon: '🏛️', title: 'Florida Certified', desc: 'License CBC1268844 — valid statewide, including ' + city },
                { icon: '📋', title: 'Permit Management', desc: `Permits filed with ${permitAuthority} — we manage the full application, review, and inspection process as contractor of record` },
                { icon: '🔧', title: 'Trade Coordination', desc: 'All trades scheduled and managed under one contract' },
                { icon: '💬', title: 'Single Point of Contact', desc: 'One consistent team member communicates with you throughout' },
                { icon: '🛡️', title: 'Fully Insured', desc: 'Proper insurance and documentation for every project' },
                { icon: '✅', title: 'Inspection Management', desc: `All ${permitAuthority} inspections scheduled, attended, and passed before project closeout` },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="cp-why-item glass-card">
                  <div className="cp-why-icon">{icon}</div>
                  <div>
                    <div className="cp-why-title">{title}</div>
                    <div className="cp-why-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────────── */}
      <section className="cp-faq-section section" aria-labelledby="cp-faq-heading">
        <div className="container cp-faq-container">
          <div className="text-center">
            <div className="section-badge">Questions</div>
            <h2 id="cp-faq-heading" className="section-title">
              Frequently Asked <span>Questions</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 48px' }}>
              Common questions from {city} homeowners about remodeling with UBC.
            </p>
          </div>
          <div className="cp-faq-list">
            {faqs.map((faq, i) => (
              <FaqItem key={i} {...faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEARBY SERVICE AREAS ────────────────────────────────── */}
      <section className="cp-nearby-section section section-dark" aria-labelledby="cp-nearby-heading">
        <div className="container">
          <div className="section-badge">Service Area</div>
          <h2 id="cp-nearby-heading" className="detail-heading">
            Nearby Service Areas
          </h2>
          <p className="cp-nearby-intro">
            UBC also serves these communities near {city}. Each area has its own
            dedicated page with local remodeling information.
          </p>
          <div className="cp-nearby-grid">
            {nearbyAreas.map(({ slug: nSlug, city: nCity }) => (
              <Link key={nSlug} to={`/service-areas/${nSlug}`} className="cp-nearby-card glass-card">
                <MapPin size={18} className="text-green" />
                <span>{nCity}, FL</span>
                <ArrowRight size={16} className="cp-nearby-arrow" />
              </Link>
            ))}
            <Link to="/service-areas" className="cp-nearby-card cp-nearby-all glass-card">
              <MapPin size={18} className="text-green" />
              <span>All Service Areas</span>
              <ArrowRight size={16} className="cp-nearby-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA + FORM ──────────────────────────────────────────── */}
      <section className="cp-cta-section section" id="cp-cta-form" aria-labelledby="cp-cta-heading">
        <div className="container cp-cta-container">
          <motion.div
            className="cp-cta-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge">Free Consultation</div>
            <h2 id="cp-cta-heading" className="section-title">
              Planning a Remodeling Project<br />
              <span>in {city}?</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 16px' }}>
              Request a free consultation with Unique Building Contractors.
              We'll review your project goals, walk your space, and provide
              honest guidance — no obligation, no pressure.
            </p>
            <div className="cp-cta-actions">
              <a href="tel:+18135237828" className="btn btn-terra">
                <Phone size={18} />
                Call UBC — (813) 523-7828
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Contact />
    </div>
  );
}

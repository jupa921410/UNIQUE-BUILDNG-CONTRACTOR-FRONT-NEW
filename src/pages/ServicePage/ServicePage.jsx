import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import Contact from '../../components/Contact/Contact';
import ProcessSteps from '../../components/ProcessSteps/ProcessSteps';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import villa from '../../assets/redesign/villa.png';
import './ServicePage.css';
import SEO, { breadcrumbSchema, faqSchema, serviceSchema, SITE_URL } from '../../components/SEO/SEO';
import { confirmedServiceAreas, serviceSeoData } from '../../data/serviceSeoData';
import { PHASE1_CITIES } from '../../data/serviceAreasData';

const CITY_LINKS = PHASE1_CITIES;

export default function ServicePage() {
  const { id } = useParams();
  const service = servicesData.find(s => s.id === id);
  const seo = serviceSeoData[id];
  const floatingHero = id === 'new-construction' || id === 'additions';

  if (!service) {
    return (
      <div className="service-not-found">
        <SEO title="Service Not Found" description="The requested construction service could not be found." noindex />
        <h2>Service not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="service-page">
      <SEO
        title={`${service.title} in Tampa Bay, FL`}
        description={service.desc}
        schema={[
          serviceSchema(service),
          { '@context': 'https://schema.org', '@type': 'WebPage', name: `${service.title} in Tampa Bay, FL`, url: `${SITE_URL}/services/${service.id}`, about: { '@id': `${SITE_URL}/#business` } },
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services' }, { name: service.title, path: `/services/${service.id}` }]),
          faqSchema(seo.faqs),
        ]}
      />
      <ConceptHero title={service.title} label={service.subtitle} description={service.desc} image={floatingHero ? villa : service.image} cutout={floatingHero} imageAlt={floatingHero ? 'Architectural inspiration for ' + service.title.toLowerCase() : service.title + " project in Tampa Bay, FL"} />

      <section className="service-details-section section">
        <div className="container">
          <div className="service-details-grid">
            <motion.div 
              className="service-details-main"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="detail-heading">Considered from start to finish</h2>
              <div className="detail-full-desc">
                {service.fullDesc.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="service-tags-group">
                {service.tags.map(tag => (
                  <span key={tag} className="service-tag-large">{tag}</span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="service-highlights-card glass-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3>Key Features</h3>
              <div className="highlights-list">
                {service.highlights.map((h, i) => (
                  <div key={i} className="highlight-item">
                    <CheckCircle2 size={24} className="text-green" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ProcessSteps serviceId={id} />

      <section className="service-seo-section section" aria-labelledby="service-area-heading">
        <div className="container service-seo-grid">
          <div>
            <div className="section-badge">Tampa Bay Contractor</div>
            <h2 id="service-area-heading" className="detail-heading">{service.title} Across Tampa Bay</h2>
            <p>{seo.intro}</p>
            <p>Unique Building Contractors is a Florida Certified Building Contractor (CBC1268844) serving {confirmedServiceAreas.join(', ')} and surrounding Tampa Bay communities.</p>
            <div className="service-related-links" aria-label="Related services">
              <Link to="/portfolio">View related projects</Link>
              {servicesData.filter(item => item.id !== id).slice(0, 3).map(item => <Link key={item.id} to={`/services/${item.id}`}>{item.title}</Link>)}
            </div>
          </div>
          <div className="service-faq glass-card">
            <h2>Frequently Asked Questions</h2>
            {seo.faqs.map(item => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve — bidirectional internal linking */}
      <section className="service-areas-section section section-dark" aria-labelledby="service-areas-cities-heading">
        <div className="container">
          <div className="section-badge">Service Coverage</div>
          <h2 id="service-areas-cities-heading" className="detail-heading">Areas We Serve</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 560, lineHeight: 1.7 }}>
            {service.title} services are available throughout the Tampa Bay region.
            Select your city for local remodeling information and details specific to your area.
          </p>
          <div className="service-cities-grid">
            {CITY_LINKS.map(({ slug, city }) => (
              <Link key={slug} to={`/service-areas/${slug}`} className="service-city-link glass-card">
                <span className="service-city-pin">📍</span>
                <span>{city}, FL</span>
                <ArrowRight size={14} className="service-city-arrow" />
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link to="/service-areas" className="btn btn-secondary">
              View All Service Areas <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}


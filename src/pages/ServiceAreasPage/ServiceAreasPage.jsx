import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';
import { PHASE1_CITIES } from '../../data/serviceAreasData';
import Contact from '../../components/Contact/Contact';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import './ServiceAreasPage.css';

const CITY_DESCRIPTIONS = {
  'tampa-fl':           'Full-service remodeling across all Tampa neighborhoods',
  'carrollwood-fl':     'Open-concept transformations & custom renovations in established Carrollwood',
  'riverview-fl':       'Kitchen, bathroom & additions for growing Riverview families',
  'brandon-fl':         'Whole-home renovations in Brandon\'s established communities',
  'clearwater-fl':      'Condo & home remodeling — waterfront & inland properties',
  'st-petersburg-fl':   'Condo remodeling, historic bungalows & downtown residences',
  'dunedin-fl':         'Coastal cottage remodeling, waterfront condos & FEMA-compliant additions',
  'palm-harbor-fl':     'Full-service remodeling for Palm Harbor\'s coastal homes',
  'wesley-chapel-fl':   'Builder-grade upgrades for Wesley Chapel\'s newer communities',
  'lutz-fl':            'Kitchen, bath & home additions across Hillsborough & Pasco',
  'land-o-lakes-fl':    'Master suite additions, lakefront renovations & custom upgrades',
  'new-port-richey-fl': 'Kitchen, bath & renovation for New Port Richey homeowners',
  'sarasota-fl':        'Premium remodeling for Sarasota\'s discerning homeowners',
};

const TRUST_ITEMS = [
  { label: 'Licensed Contractor',      detail: 'Florida CBC1268844' },
  { label: 'Insured',                  detail: 'Fully insured & documented' },
  { label: 'Tampa Bay Service Area',   detail: '10+ cities covered' },
  { label: 'Permitting Assistance',    detail: 'We manage all permits' },
  { label: 'Project Management',       detail: 'Single point of contact' },
  { label: 'Professional Remodeling',  detail: 'Residential & condo work' },
];

const SERVICES = [
  { id: 'kitchens-bathrooms', label: 'Kitchen Remodeling' },
  { id: 'kitchens-bathrooms', label: 'Bathroom Remodeling' },
  { id: 'remodeling',         label: 'Whole-Home Remodeling' },
  { id: 'additions',          label: 'Home Additions' },
  { id: 'flooring',           label: 'Flooring' },
  { id: 'projectmanagement',  label: 'Construction Management' },
  { id: 'new-construction',   label: 'New Construction' },
];

const hubSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/service-areas`,
  name: 'Tampa Bay Remodeling Contractor — Service Areas | Unique Building Contractors',
  url: `${SITE_URL}/service-areas`,
  description: 'Unique Building Contractors serves the entire Tampa Bay region. Florida Certified Building Contractor (CBC1268844) offering kitchen, bathroom, whole-home remodeling, home additions, flooring, and construction management.',
  about: { '@id': `${SITE_URL}/#business` },
  inLanguage: 'en-US',
};

export default function ServiceAreasPage() {
  return (
    <div className="service-areas-page">
      <SEO
        title="Service Areas — Tampa Bay Remodeling Contractor | Unique Building Contractors"
        description="Unique Building Contractors serves Tampa Bay: Tampa, Riverview, Brandon, Clearwater, St. Petersburg, Wesley Chapel, Lutz, Palm Harbor, New Port Richey, and Sarasota. Florida Certified Building Contractor CBC1268844."
        path="/service-areas"
        schema={[
          hubSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Service Areas', path: '/service-areas' },
          ]),
        ]}
      />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <ConceptHero title="Local knowledge. Lasting homes." label="Serving Tampa Bay, Florida" description="Construction and remodeling for the places we call home. Explore our Tampa Bay service areas and find the right approach for your neighborhood." cta="Find your neighborhood" to="/service-areas#sa-cities-heading" />

      {/* ── TRUST BAR ───────────────────────────────────────────────── */}
      <section className="sa-trust-section" aria-label="Trust indicators">
        <div className="container">
          <div className="sa-trust-grid">
            {TRUST_ITEMS.map(({ label, detail }) => (
              <div key={label} className="sa-trust-item">
                <CheckCircle2 size={20} className="text-green" />
                <div>
                  <div className="sa-trust-label">{label}</div>
                  <div className="sa-trust-detail">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY GRID ───────────────────────────────────────────────── */}
      <section className="sa-cities-section section" aria-labelledby="sa-cities-heading">
        <div className="container">
          <div className="sa-section-header text-center">
            <div className="section-badge">Our communities</div>
            <h2 id="sa-cities-heading" className="section-title">
              Cities We <span>Serve</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 60px' }}>
              Explore the neighborhoods we serve, with local information,
              services and guidance for your home.
            </p>
          </div>

          <div className="sa-cities-grid">
            {PHASE1_CITIES.map(({ slug, city }, i) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link to={`/service-areas/${slug}`} className="sa-city-card glass-card">
                  <div className="sa-city-card-pin">
                    <MapPin size={18} />
                  </div>
                  <h3 className="sa-city-name">{city}, FL</h3>
                  <p className="sa-city-desc">{CITY_DESCRIPTIONS[slug]}</p>
                  <div className="sa-city-cta">
                    View {city} page <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES WE OFFER ───────────────────────────────────────── */}
      <section className="sa-services-section section section-dark" aria-labelledby="sa-services-heading">
        <div className="container">
          <div className="sa-section-header text-center">
            <div className="section-badge">Our Services</div>
            <h2 id="sa-services-heading" className="section-title">
              What We <span>Build</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 60px' }}>
              Every service is available across our full Tampa Bay service area.
            </p>
          </div>
          <div className="sa-services-grid">
            {SERVICES.map(({ id, label }) => (
              <Link key={label} to={`/services/${id}`} className="sa-service-item glass-card">
                <CheckCircle2 size={20} className="text-green" />
                <span>{label}</span>
                <ArrowRight size={16} className="sa-service-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LICENSE / WHY UBC ───────────────────────────────────────── */}
      <section className="sa-why-section section" aria-labelledby="sa-why-heading">
        <div className="container sa-why-grid">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-badge">Why UBC</div>
            <h2 id="sa-why-heading" className="detail-heading">
              One Licensed Contractor.<br />All of Tampa Bay.
            </h2>
            <p className="sa-why-intro">
              Unique Building Contractors LLC is a Florida Certified Building Contractor,
              not a referral network or a sub-trade. When you hire UBC, you get a single
              licensed team managing every permit, trade, and inspection on your project —
              from initial planning through the final walkthrough.
            </p>
            <p className="sa-why-intro">
              Our license (CBC1268844) is valid statewide and authorizes us to pull permits
              in every county and municipality we serve — Hillsborough, Pinellas, Pasco,
              Sarasota, and beyond.
            </p>
            <Link to="/aboutus" className="btn btn-primary" style={{ marginTop: 32 }}>
              About Unique Building Contractors <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="sa-why-credentials glass-card"
          >
            <div className="sa-cred-block">
              <div className="sa-cred-label">Company</div>
              <div className="sa-cred-value">Unique Building Contractors LLC</div>
            </div>
            <div className="sa-cred-block">
              <div className="sa-cred-label">License Type</div>
              <div className="sa-cred-value">Florida Certified Building Contractor</div>
            </div>
            <div className="sa-cred-block">
              <div className="sa-cred-label">License Number</div>
              <div className="sa-cred-value sa-cred-highlight">CBC1268844</div>
            </div>
            <div className="sa-cred-block">
              <div className="sa-cred-label">Service Area</div>
              <div className="sa-cred-value">Tampa Bay Region, Florida</div>
            </div>
            <div className="sa-cred-block">
              <div className="sa-cred-label">Counties Served</div>
              <div className="sa-cred-value">Hillsborough · Pinellas · Pasco · Sarasota</div>
            </div>
            <div className="sa-cred-block">
              <div className="sa-cred-label">Contact</div>
              <div className="sa-cred-value">
                <a href="tel:+18135237828" className="sa-cred-phone">(813) 523-7828</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────── */}
      <Contact />
    </div>
  );
}

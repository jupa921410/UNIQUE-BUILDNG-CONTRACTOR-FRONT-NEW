import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import Contact from '../../components/Contact/Contact';
import { projectPhotos } from '../../data/projectPresentation';
const interior = projectPhotos.living;

export default function ContactPage() {
  return <main>
    <SEO title="Contact Us | Tampa Bay Construction & Remodeling" description="Contact Unique Building Contractors to discuss your Tampa Bay construction or remodeling project. Call (813) 523-7828 or request a free consultation." path="/contact" schema={[
      { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Unique Building Contractors', url: `${SITE_URL}/contact`, about: { '@id': `${SITE_URL}/#business` } },
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
    ]} />
    <ConceptHero title="Let’s talk about your project." label="Contact us" description="Tell us what you have in mind for your Tampa Bay home. Start with a conversation about your space, your priorities, and what comes next." image={interior} imageAlt="Completed home remodeling project" cutout={false} cta="Request a consultation" to="/contact#contact" />
    <Contact showSmsConsent />
    <div className="container" style={{ paddingBlock: 32 }}><p>Planning your first project? <Link to="/faq">Read our frequently asked questions</Link>.</p></div>
  </main>;
}

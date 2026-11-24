import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';
import Contact from '../../components/Contact/Contact';

export default function ContactPage() {
  return <main>
    <SEO title="Contact Unique Building Contractors | Clearwater, FL" description="Contact Unique Building Contractors: 4500 140th Ave N #214, Clearwater, FL 33762. Call (813) 523-7828, Mon–Fri 8 AM–4 PM, for a free estimate." path="/contact" schema={[
      { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Unique Building Contractors', url: `${SITE_URL}/contact`, about: { '@id': `${SITE_URL}/#business` } },
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
    ]} />
    <Contact showSmsConsent />
    <div className="container" style={{ paddingBlock: 32 }}><p>Planning your first project? <Link to="/faq">Read our frequently asked questions</Link>.</p></div>
  </main>;
}

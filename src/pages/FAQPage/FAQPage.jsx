import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema, faqSchema } from '../../components/SEO/SEO';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import { faqs } from '../../data/faqs';
import materials from '../../assets/redesign/materials.webp';
import './FAQPage.css';

export default function FAQPage() {
  return <main className="faq-page">
    <SEO title="Frequently Asked Questions" description="Answers to common questions about our Tampa Bay construction and remodeling services, consultations, estimates, project timelines, and client portal." path="/faq" schema={[faqSchema(faqs), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Frequently Asked Questions', path: '/faq' }])]} />
    <ConceptHero title="Frequently Asked Questions" label="Before we build" description="A few practical answers to help you plan your next construction or remodeling project with confidence." image={materials} imageAlt="Materials and finishes for planning a remodeling project" cutout={false} cta="Browse the answers" to="/faq#answers" />
    <section className="container section faq-content" id="answers" aria-labelledby="faq-heading">
      <div className="faq-intro"><h2 id="faq-heading">Your project starts with clarity.</h2><p>From the first conversation to planning the work, here are the questions we can help you answer.</p><Link to="/contact" className="design-button gold">Ask about your project</Link></div>
      <div className="faq-answers">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<p className="faq-more">Explore <Link to="/portfolio">our work</Link>, check <Link to="/service-areas">our service areas</Link>, or <Link to="/portal/login">sign in to the client portal</Link>.</p></div>
    </section>
  </main>;
}

import ResponsiveImage from '../../components/ResponsiveImage';
import { Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Ruler, ShieldCheck, MessageSquare } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import SEO from '../../components/SEO/SEO';
import { servicesData } from '../../data/servicesData';
import about from '../../assets/redesign/materials.webp';
import './Home.css';
const Testimonials = lazy(() => import('../../components/Testimonials/Testimonials'));
const Portfolio = lazy(() => import('../../components/Portfolio/Portfolio'));
const DesignShowcase = lazy(() => import('../../components/DesignShowcase/DesignShowcase'));
const HomeServiceAreas = lazy(() => import('../../components/HomeServiceAreas/HomeServiceAreas'));
const Contact = lazy(() => import('../../components/Contact/Contact'));
const serviceGallery = [
  { id: 'new-construction', size: 'featured', copy: 'A home shaped around your life, from the first plan to the finishing details.' },
  { id: 'remodeling', size: 'featured', copy: 'A fresh perspective on the home you love, with every space considered.' },
  { id: 'kitchens-bathrooms', size: 'standard', copy: 'Beautifully practical spaces for your everyday rituals.' },
  { id: 'condo-renovations', size: 'standard', copy: 'Thoughtful interiors, with the building details taken care of.' },
  { id: 'additions', size: 'standard', copy: 'More room to live, made to feel like it has always belonged.' },
  { id: 'flooring', size: 'compact', copy: 'The foundation of a well-finished room.' },
  { id: 'projectmanagement', size: 'compact', copy: 'One coordinated plan. A team that keeps you connected.' },
].map(item => ({ ...servicesData.find(service => service.id === item.id), ...item }));
const steps = [
  ['Let’s talk', 'Share your ideas, priorities and budget. We’ll help define the right approach for your home.'],
  ['Plan every detail', 'Coordinate the scope, materials and schedule before construction begins.'],
  ['Bring it to life', 'Our team manages the build with clear communication and care for your space.'],
  ['Welcome home', 'Walk through the finished work together and enjoy the next chapter of your home.'],
];
export default function Home() {
  const pageRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const page = pageRef.current;
    const observed = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('studio-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const discover = () => {
      page.querySelectorAll('.studio-values, .studio-section-heading, .studio-service, .studio-story-image, .studio-story-copy, .studio-step-grid article, .design-space-stage, .region-copy, .region-cities, .contact-header, .contact-form-card').forEach((element, index) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add('studio-reveal');
        element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
        observer.observe(element);
      });
    };
    discover();
    const mutations = new MutationObserver(discover);
    mutations.observe(page, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, []);
  return <main className="studio-home" ref={pageRef}>
    <SEO title="Tampa General Contractor & Home Remodeling" description="Licensed Tampa Bay general contractor for custom homes, remodeling, kitchens, bathrooms, additions and flooring. Request a free consultation." path="/" />
    <Hero />
    <div className="studio-values container"><span><Ruler size={20} /> Thoughtfully planned</span><span><ShieldCheck size={20} /> Licensed & insured</span><span><MessageSquare size={20} /> Personal communication</span><Link to="/aboutus">Meet Unique <ArrowUpRight size={18} /></Link></div>
    <section className="studio-expertise container" id="services">
      <div className="studio-section-heading"><div><span className="studio-caption">Your home. Your possibilities.</span><h2>A higher standard<br />for every space.</h2></div><p>Build from the ground up or rediscover the potential of your home. One dedicated team, from planning through completion.</p></div>
      <div className="studio-service-gallery">{serviceGallery.map(service => <Link to={`/services/${service.id}`} className={`studio-service-card studio-service-card--${service.size}`} key={service.id}>
        <div className="studio-service-visual"><ResponsiveImage src={service.image} alt={service.title + ' project detail'} loading="lazy" sizes={service.size === 'compact' ? '96px' : service.size === 'featured' ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw'} /></div>
        <div className="studio-service-details"><h3>{service.title}</h3><p>{service.copy}</p>{service.size !== 'compact' && <span className="studio-service-discover">Explore {service.title.toLowerCase()} <ArrowUpRight size={16} aria-hidden="true" /></span>}</div>
        {service.size === 'compact' && <ArrowUpRight className="studio-service-direction" size={21} aria-hidden="true" />}
      </Link>)}</div>
    </section>
    <section className="studio-story container"><div className="studio-story-image"><ResponsiveImage src={about} alt="Architectural concept with natural stone, walnut and brass finishes" loading="lazy" /><span>Built for the way you live.</span></div><div className="studio-story-copy"><span className="studio-caption">The Unique approach</span><h2>Good construction<br />starts with listening.</h2><p>A home is personal. So is the way we build it. We bring your ideas, practical needs and the details that matter together into one considered plan.</p><p>From custom homes to kitchen renovations, our Tampa Bay team guides you through the decisions and keeps you connected to the work.</p><Link to="/aboutus" className="design-button">Get to know us <ArrowUpRight size={18} /></Link></div></section>
    <Suspense fallback={<div className="section-loader" />}><Portfolio /><DesignShowcase /></Suspense>
    <section className="studio-process" id="process"><div className="container"><div className="studio-section-heading"><div><span className="studio-caption">From first conversation to final walkthrough</span><h2>A clear path home.</h2></div><Link to="/#contact" className="design-button gold">Let’s talk about your project <ArrowUpRight size={18} /></Link></div><div className="studio-step-grid">{steps.map(([title, copy], index) => <article key={title}><span className="studio-step-number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <section className="studio-financing" aria-labelledby="home-financing-heading">
      <div className="studio-financing-inner container">
      <div className="studio-financing-details">
        <span className="studio-financing-provider">Home improvement financing through <strong>GreenSky®</strong></span>
        <img className="studio-financing-art" src="/financing/home-financing-realistic.webp" alt="Architectural home model with dollar bills and gold coins representing home improvement financing" width="1200" height="800" loading="lazy" decoding="async" />
        <span className="studio-financing-image-note">A new perspective on what's possible.</span>
      </div>
      <div className="studio-financing-copy">
        <span className="studio-caption">Financing available</span>
        <h2 id="home-financing-heading">Make room for<br />your next project.</h2>
        <p>More ways to pay for the home you have in mind. Explore financing options through the GreenSky® consumer loan program for your eligible home improvements.</p>
        <ul className="studio-financing-highlights"><li>Explore plans for your project</li><li>Review rates and repayment terms</li><li>Prequalify online through GreenSky</li></ul>
        <Link to="/financing" className="design-button gold">Explore financing <ArrowUpRight size={20} aria-hidden="true" /></Link>
        <p className="studio-financing-disclaimer">Subject to credit approval. Rates and terms vary by plan and are determined by program lenders.</p>
      </div>
      </div>
    </section>
    <Suspense fallback={<div className="section-loader" />}><HomeServiceAreas /><Testimonials /><Contact /></Suspense>
  </main>;
}

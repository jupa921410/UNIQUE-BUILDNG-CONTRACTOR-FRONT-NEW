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
      <div className="studio-service-grid">{servicesData.map(service => <Link to={`/services/${service.id}`} className="studio-service" key={service.id}><ResponsiveImage src={service.image} alt={service.title + ' inspiration'} loading="lazy" /><div className="studio-service-copy"><h3>{service.title}</h3><span>{service.subtitle}</span></div><span className="studio-service-arrow"><ArrowUpRight size={20} /></span></Link>)}</div>
    </section>
    <section className="studio-story container"><div className="studio-story-image"><ResponsiveImage src={about} alt="Architectural concept with natural stone, walnut and brass finishes" loading="lazy" /><span>Built for the way you live.</span></div><div className="studio-story-copy"><span className="studio-caption">The Unique approach</span><h2>Good construction<br />starts with listening.</h2><p>A home is personal. So is the way we build it. We bring your ideas, practical needs and the details that matter together into one considered plan.</p><p>From custom homes to kitchen renovations, our Tampa Bay team guides you through the decisions and keeps you connected to the work.</p><Link to="/aboutus" className="design-button">Get to know us <ArrowUpRight size={18} /></Link></div></section>
    <Suspense fallback={<div className="section-loader" />}><Portfolio /><DesignShowcase /></Suspense>
    <section className="studio-process" id="process"><div className="container"><div className="studio-section-heading"><div><span className="studio-caption">From first conversation to final walkthrough</span><h2>A clear path home.</h2></div><Link to="/#contact" className="design-button gold">Let’s talk about your project <ArrowUpRight size={18} /></Link></div><div className="studio-step-grid">{steps.map(([title, copy], index) => <article key={title}><span className="studio-step-number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>
    <Suspense fallback={<div className="section-loader" />}><HomeServiceAreas /><Testimonials /><Contact /></Suspense>
  </main>;
}

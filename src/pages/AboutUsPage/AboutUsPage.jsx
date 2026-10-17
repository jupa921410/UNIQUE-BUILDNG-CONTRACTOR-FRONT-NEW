import ResponsiveImage from '../../components/ResponsiveImage';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, MessageSquare, Ruler } from 'lucide-react';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import OurTeams from '../../components/OurTeams/OurTeams';
import Contact from '../../components/Contact/Contact';
import SEO from '../../components/SEO/SEO';
import materials from '../../assets/redesign/materials.webp';
import { projectPhotos } from '../../data/projectPresentation';
const interior = projectPhotos.living;
import './AboutUsPage.css';
const values = [
  { icon: Ruler, title: 'Care in the details', copy: 'Thoughtful planning, considered materials and careful execution at every stage.' },
  { icon: MessageSquare, title: 'A personal partnership', copy: 'Clear communication and one team to help you make informed decisions.' },
  { icon: ShieldCheck, title: 'Built with confidence', copy: 'A licensed Florida building contractor coordinating permits, trades and the work.' },
];
export default function AboutUsPage() {
  return <main className="about-us-page">
    <SEO title="About Our Tampa Bay Construction Team" description="Meet the licensed professionals behind Unique Building Contractors and learn about our commitment to quality construction across Tampa Bay." />
    <ConceptHero title="People first. Homes for life." label="The people behind Unique" description="Construction expertise and a shared belief that your home deserves personal attention. Meet the team bringing your vision to life across Tampa Bay." image={interior} cutout={false}/>
    <section className="unique-story container section" id="aboutushistory"><div><span className="studio-caption">Our story</span><h2>Different strengths.<br/>One shared standard.</h2><p>Unique Building Contractors brings together experience in custom construction, remodeling, flooring and fine finishes. Our founders combine their specialties into one team, with one approach to planning, communication and craftsmanship.</p><p>We build for the people who live in the spaces we create. That starts with understanding your priorities, and continues through every decision, construction detail and final walkthrough.</p><Link to="/#contact" className="design-button">Meet us for a consultation <ArrowUpRight size={18}/></Link></div><figure><ResponsiveImage src={materials} alt="Architectural concept featuring limestone, walnut, brass and navy finishes" loading="lazy"/><figcaption>A considered palette. A cohesive home.</figcaption></figure></section>
    <section className="unique-value-section"><div className="container unique-value-grid">{values.map(({icon:Icon,title,copy})=><article key={title}><Icon size={25}/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <OurTeams/>
    <Contact/>
  </main>;
}

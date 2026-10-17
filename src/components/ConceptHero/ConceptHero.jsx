import ResponsiveImage from '../ResponsiveImage';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projectPhotos } from '../../data/projectPresentation';
const villa = projectPhotos.home;
import './ConceptHero.css';
export default function ConceptHero({ title, description, label = 'Unique Building Contractors', image = villa, imageAlt = 'Home exterior from our Tampa Bay project gallery', cutout = false, cta = 'Discuss your project', to = '/#contact', children }) {
  return <section className={`concept-hero ${cutout ? 'concept-cutout' : 'concept-interior'}`}>
    
    <div className="concept-inner"><div className="concept-copy"><span className="concept-label">{label}</span><h1>{title}</h1><p>{description}</p><Link className="design-button gold" to={to}>{cta}<ArrowUpRight size={18}/></Link>{children}</div><div className="concept-art"><ResponsiveImage src={image} alt={imageAlt} fetchPriority="high"/><span className="concept-image-caption">Project gallery</span></div></div>
  </section>;
}

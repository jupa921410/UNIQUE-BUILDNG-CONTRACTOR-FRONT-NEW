import ResponsiveImage from '../ResponsiveImage';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import villa from '../../assets/redesign/villa.png';
import './ConceptHero.css';
export default function ConceptHero({ title, description, label = 'Unique Building Contractors', image = villa, imageAlt = 'Architectural concept of a custom home', cutout = image === villa, cta = 'Discuss your project', to = '/#contact', children }) {
  return <section className={`concept-hero ${cutout ? 'concept-cutout' : 'concept-interior'}`}>
    
    <div className="concept-inner"><div className="concept-copy"><span className="concept-label">{label}</span><h1>{title}</h1><p>{description}</p><Link className="design-button gold" to={to}>{cta}<ArrowUpRight size={18}/></Link>{children}</div><div className="concept-art"><ResponsiveImage src={image} alt={imageAlt} fetchPriority="high"/><span className="concept-image-caption">{cutout ? 'Architectural inspiration' : 'Project gallery'}</span></div></div>
  </section>;
}

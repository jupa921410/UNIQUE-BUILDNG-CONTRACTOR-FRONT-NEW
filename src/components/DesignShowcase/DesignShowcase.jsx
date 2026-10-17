import ResponsiveImage from '../ResponsiveImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projectPhotos } from '../../data/projectPresentation';
const interior = projectPhotos.living;
const bathroom = projectPhotos.bathroom;
const flooring = projectPhotos.flooring;
import './DesignShowcase.css';
const spaces = [
  { name:'Kitchen', image:interior, title:'The heart of your home.', copy:'Natural stone, thoughtful storage and beautiful light. Bring function and character together in a kitchen made for your everyday life.', service:'kitchens-bathrooms' },
  { name:'Bathroom', image:bathroom, title:'A little room to unwind.', copy:'Calm materials, refined fixtures and considered layouts. Create a personal retreat with a bathroom designed around you.', service:'kitchens-bathrooms' },
  { name:'Living spaces', image:flooring, title:'Comfort, from the ground up.', copy:'Warm wood, seamless transitions and carefully selected finishes. Set the foundation for a home that feels complete.', service:'flooring' },
];
export default function DesignShowcase(){
 const [selected,setSelected]=useState(0); const space=spaces[selected];
 return <section className="design-showcase container section"><div className="studio-section-heading"><div><span className="studio-caption">Explore your possibilities</span><h2>Exceptional spaces.<br/>Everyday living.</h2></div><div className="design-space-tabs" role="group" aria-label="Choose an inspiration space">{spaces.map((item,index)=><button key={item.name} aria-pressed={selected===index} onClick={()=>setSelected(index)}>{item.name}</button>)}</div></div><div className="design-space-stage"><ResponsiveImage src={space.image} alt={space.name+' project in Tampa Bay, FL'} loading="lazy"/><span className="design-concept-note">Project gallery</span><div className="design-space-panel"><h3>{space.title}</h3><p>{space.copy}</p><Link to={`/services/${space.service}`}>Explore the service <ArrowUpRight size={18}/></Link></div></div></section>;
}

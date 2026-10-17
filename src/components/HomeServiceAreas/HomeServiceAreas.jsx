import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { PHASE1_CITIES } from '../../data/serviceAreasData';
import './HomeServiceAreas.css';
export default function HomeServiceAreas(){return <section className="region-section section" id="service-areas"><div className="container region-layout"><div className="region-copy"><MapPin size={27}/><span className="studio-caption">At home in Tampa Bay</span><h2>Local roots.<br/>A wider reach.</h2><p>Serving homeowners across Hillsborough, Pinellas and Pasco counties, with the local knowledge to guide your project.</p><Link className="design-button" to="/service-areas">Explore our service areas <ArrowUpRight size={18}/></Link></div><div className="region-cities">{PHASE1_CITIES.map(({slug,city})=><Link to={`/service-areas/${slug}`} key={slug}>{city}<ArrowUpRight size={15}/></Link>)}</div></div></section>}

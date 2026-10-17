import ResponsiveImage from '../ResponsiveImage';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, ArrowRight, MapPin, ShieldCheck, Ruler, Pause, Play } from 'lucide-react';
import { projectPhotos } from '../../data/projectPresentation';
const villa = projectPhotos.home;
const interior = projectPhotos.kitchen;
const exterior = projectPhotos.bathroom;
import './Hero.css';
const scenes = [
  { image: villa, title: 'Your vision. Beautifully built.', name: 'Custom homes', detail: 'A home designed around your life.', href: 'new-construction', cutout: false },
  { image: interior, title: 'Rediscover the art of home.', name: 'Kitchen & bath', detail: 'Considered materials. Thoughtful details.', href: 'kitchens-bathrooms', cutout: false },
  { image: exterior, title: 'Considered in every detail.', name: 'Bathroom remodeling', detail: 'Comfort and craftsmanship in every finish.', href: 'kitchens-bathrooms', cutout: false },
];
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const reducedMotion = useReducedMotion();
  const scene = scenes[current];
  const change = step => setCurrent(value => (value + step + scenes.length) % scenes.length);
  useEffect(() => {
    if (paused || interacting || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setCurrent(value => (value + 1) % scenes.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [current, paused, interacting, reducedMotion]);
  return <section className={`architecture-hero ${scene.cutout ? 'hero-model' : 'hero-immersive'}`} id="hero" aria-label="Unique Building Contractors" aria-roledescription="carousel"
    onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
    
    <div className="hero-horizon" aria-hidden="true" />
    <div className="architecture-copy">
      <span className="location-label"><MapPin size={14} /> {scene.name} in Tampa Bay</span>
      <h1 key={`title-${current}`} className="hero-text-enter">{scene.title}</h1>
      <p key={`copy-${current}`} className="hero-text-enter hero-copy-enter">{scene.detail} A dedicated construction team to bring your ideas to life, down to the last detail.</p>
      <div className="architecture-actions"><Link to="/#contact" className="design-button gold">Start your project <ArrowUpRight size={19}/></Link><Link to="/portfolio" className="hero-work-link">Discover our work <ArrowUpRight size={18}/></Link></div>
    </div>
    <div className="architecture-art"><div key={scene.image} className="hero-art-enter"><ResponsiveImage src={scene.image} alt={scene.name + ' project in Tampa Bay'} fetchPriority="high"/></div><span className="hero-concept-label">Project gallery</span></div>
    <div className="hero-discipline"><span>Design.</span><span>Detail.</span><span>Build.</span></div>
    <div className="architecture-bottom">
      <Link to={`/services/${scene.href}`} className="hero-feature"><div className="hero-feature-image"><ResponsiveImage src={scene.image} alt=""/></div><div><span>Explore the possibilities</span><h2>{scene.name}</h2><p>{scene.detail}</p></div><ArrowUpRight size={23}/></Link>
      <div className="hero-assurances"><div><ShieldCheck size={23}/><span>Licensed & insured<small>CBC1268844</small></span></div><div><Ruler size={23}/><span>Made for your home<small>From concept to completion</small></span></div></div>
      <div className="hero-controls"><div className="hero-pagination" role="group" aria-label="Select architectural inspiration">{scenes.map((item,index)=><button type="button" key={item.name} className={index===current?'selected':''} onClick={()=>setCurrent(index)} aria-label={item.name} aria-pressed={index===current}>{String(index+1).padStart(2,'0')}</button>)}</div><div className="hero-arrows"><button type="button" onClick={()=>change(-1)} aria-label="Previous inspiration"><ArrowLeft size={18}/></button><button type="button" onClick={()=>change(1)} aria-label="Next inspiration"><ArrowRight size={18}/></button>{!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>}</div></div>
    </div>
  </section>;
}

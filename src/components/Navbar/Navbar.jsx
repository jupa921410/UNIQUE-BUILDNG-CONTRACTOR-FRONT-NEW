import { useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

import { servicesData } from '../../data/servicesData';
import BrandLogo from '../BrandLogo/BrandLogo';
import './Navbar.css';
export default function Navbar() {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const servicesActive = /^\/(services|specialized)(\/|$)/.test(pathname);
  const close = () => { setOpen(false); menuRef.current?.querySelectorAll('details[open]').forEach(item => item.removeAttribute('open')); };
  return <header onKeyDown={event => { if (event.key === 'Escape') { close(); menuRef.current?.querySelector('.studio-menu')?.focus(); } }} ref={menuRef} className={`studio-nav ${pathname === '/' ? 'on-home' : ''}`}>
    <Link to="/" className="studio-brand" onClick={close} aria-label="Unique Building Contractors home"><BrandLogo /></Link>
    <nav id="main-navigation" aria-label="Main navigation" className={`studio-links ${open ? 'is-open' : ''}`}>
      <NavLink to="/" end onClick={close}>Home</NavLink>
      <NavLink to="/portfolio" onClick={close}>Our work</NavLink>
      <Link to="/blog" aria-current={/^\/blog(\/|$)/.test(pathname) ? 'page' : undefined} onClick={close}>Blog</Link>
      <details className="studio-services"><summary data-active={servicesActive || undefined}>Services</summary><div className="studio-dropdown">{servicesData.map(service => <NavLink key={service.id} to={`/services/${service.id}`} onClick={event => { close(); event.currentTarget.closest('details').removeAttribute('open'); }}>{service.title}</NavLink>)}<NavLink to="/specialized" onClick={close}>Specialized services</NavLink></div></details>
      <NavLink to="/aboutus" onClick={close}>About us</NavLink>
      <NavLink to="/service-areas" onClick={close}>Service areas</NavLink>
      <NavLink to="/financing" onClick={close}>Financing</NavLink>
      <NavLink to="/faq" onClick={close}>FAQ</NavLink>
      <NavLink to="/portal/login" onClick={close}>Client login</NavLink>
    </nav>
    <NavLink to="/contact" className="studio-start" onClick={close}>Contact us <ArrowUpRight size={17} /></NavLink>
    <button className="studio-menu" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation">{open ? <X /> : <Menu />}</button>
  </header>;
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, ChevronDown, Menu, X, User } from 'lucide-react'
import logo from '../../assets/logo-horizontal.svg'
import { servicesData } from '../../data/servicesData'
import './Navbar.css'

const navLinks = [
  { label: 'Home', href: '/#hero' },
  {
    label: 'Services',
    href: '/#services',
    isDropdown: true,
    dropdownType: 'mega'
  },
  {
    label: 'Service Areas',
    href: '/service-areas',
    isDropdown: true,
    dropdownType: 'simple',
    dropdownItems: [
      { label: 'All Service Areas (Hub)', href: '/service-areas' },
      { label: 'Tampa, FL', href: '/service-areas/tampa-fl' },
      { label: 'Carrollwood, FL', href: '/service-areas/carrollwood-fl' },
      { label: 'Clearwater, FL (Condos)', href: '/service-areas/clearwater-fl' },
      { label: 'St. Petersburg, FL', href: '/service-areas/st-petersburg-fl' },
      { label: 'Dunedin, FL', href: '/service-areas/dunedin-fl' },
      { label: 'Palm Harbor, FL', href: '/service-areas/palm-harbor-fl' },
      { label: 'Brandon, FL', href: '/service-areas/brandon-fl' },
      { label: 'Riverview, FL', href: '/service-areas/riverview-fl' },
      { label: 'Wesley Chapel, FL', href: '/service-areas/wesley-chapel-fl' },
      { label: 'Lutz, FL', href: '/service-areas/lutz-fl' },
      { label: 'Land O\' Lakes, FL', href: '/service-areas/land-o-lakes-fl' },
      { label: 'New Port Richey, FL', href: '/service-areas/new-port-richey-fl' },
      { label: 'Sarasota, FL', href: '/service-areas/sarasota-fl' }
    ]
  },
  {
    label: 'About',
    href: '/aboutus',
    isDropdown: true,
    dropdownType: 'simple',
    dropdownItems: [
      { label: 'Our Story', href: '/aboutus#aboutushistory' },
      { label: 'Our Teams', href: '/aboutus#ourteams' },
      { label: 'Our Process', href: '/#process' },
      { label: 'Specialized Services', href: '/specialized' }
    ]
  },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [dropdownOpen, setDropdownOpen] = useState(null) // Stores the href of the open dropdown

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      const current = navLinks
        .map((link) => link.href.split('#')[1])
        .findLast((id) => {
          const section = document.getElementById(id)
          return section && section.offsetTop - 140 <= window.scrollY
        })
      if (current) setActiveSection(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  const handleBrandClick = (e) => {
    setMenuOpen(false)
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`navbar-arch ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="nav-container container">
          {/* Logo */}

          <Link to="/" className="nav-brand" onClick={handleBrandClick} aria-label="Unique Building Contractors Home">
              <img
                src={logo}
                alt="Unique Building Contractors"
                className="logo-img-horizontal"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
          </Link>

          {/* Desktop Nav */}
          <div className="nav-main">
            <ul className="nav-list">
              {navLinks.map(link => (
                <li
                  key={link.href}
                  className={`nav-item ${link.isDropdown ? 'has-dropdown' : ''}`}
                  onMouseEnter={() => link.isDropdown && setDropdownOpen(link.href)}
                  onMouseLeave={() => link.isDropdown && setDropdownOpen(null)}
                >
                  <Link
                    to={link.href}
                    className={`nav-link-arch ${activeSection === link.href.split('#')[1] ? 'active' : ''}`}
                  >
                    {link.label}
                    {link.isDropdown && <ChevronDown size={14} className={`arrow ${dropdownOpen === link.href ? 'up' : ''}`} />}
                  </Link>

                  {link.isDropdown && link.dropdownType === 'mega' && (
                    <div className={`dropdown-mega ${dropdownOpen === link.href ? 'open' : ''}`}>
                      <div className="mega-inner">
                        {servicesData.map(service => (
                          <Link
                            key={service.id}
                            to={`/services/${service.id}`}
                            className="mega-item"
                            onClick={() => setDropdownOpen(null)}
                          >
                            <div className="mega-icon">{service.icon}</div>
                            <div className="mega-text">
                              <span className="mega-title">{service.title}</span>
                              <span className="mega-desc">{service.subtitle}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {link.isDropdown && link.dropdownType === 'simple' && (
                    <div className={`dropdown-simple ${dropdownOpen === link.href ? 'open' : ''}`}>
                      {link.dropdownItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.href}
                          className="simple-item"
                          onClick={() => setDropdownOpen(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <a href="tel:8135237828" className="action-phone">
              <Phone size={16} />
              813-523-7828
            </a>
            <Link to="/portal/login" className="action-client-login">
              <User size={15} />
              Client Login
            </Link>
            <Link to="/#contact" className="btn btn-primary nav-cta-btn">
              Free Consultation
            </Link>

            <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
              {menuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-nav-arch ${menuOpen ? 'active' : ''}`}>
        <div className="mobile-inner container">
          <div className="mobile-links-wrapper">
            {navLinks.map(link => (
              <div key={link.href} className="mobile-group">
                <Link
                  to={link.href}
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.isDropdown && link.dropdownType === 'mega' && (
                  <div className="mobile-sublinks">
                    {servicesData.map(s => (
                      <Link key={s.id} to={`/services/${s.id}`} onClick={() => setMenuOpen(false)}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                )}
                {link.isDropdown && link.dropdownType === 'simple' && (
                  <div className="mobile-sublinks">
                    {link.dropdownItems.map((item, idx) => (
                      <Link key={idx} to={item.href} onClick={() => setMenuOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mobile-footer">
            <a href="tel:8135237828" className="mobile-phone-link">
              <Phone size={20} />
              813-523-7828
            </a>
            <Link to="/portal/login" className="mobile-phone-link" onClick={() => setMenuOpen(false)}>
              <User size={18} />
              Client Login
            </Link>
            <Link to="/#contact" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
              Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

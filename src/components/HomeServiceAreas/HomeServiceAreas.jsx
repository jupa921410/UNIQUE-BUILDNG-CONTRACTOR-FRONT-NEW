import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';
import { serviceAreasData } from '../../data/serviceAreasData';
import './HomeServiceAreas.css';

export default function HomeServiceAreas() {
  const cities = Object.values(serviceAreasData);

  return (
    <section className="hsa-section section" id="service-areas">
      <div className="container">
        <div className="hsa-header text-center">
          <span className="section-subtitle">
            <MapPin size={16} className="inline-icon" /> Regional Coverage
          </span>
          <h2 className="section-title">
            Serving the Greater <span className="highlight">Tampa Bay Area</span>
          </h2>
          <p className="section-desc">
            As a licensed Florida Certified Building Contractor (<strong>CBC1268844</strong>), 
            Unique Building Contractors delivers premium custom builds, whole-home renovations, 
            and condo remodels across Hillsborough, Pinellas, and Pasco counties.
          </p>
        </div>

        <div className="hsa-grid">
          {cities.map((city) => {
            const firstPara = city.intro ? city.intro.split('\n')[0] : '';
            return (
              <Link
                key={city.slug}
                to={`/service-areas/${city.slug}`}
                className="hsa-card glass-card"
              >
                <div className="hsa-card-top">
                  <div className="hsa-icon-box">
                    <MapPin size={18} />
                  </div>
                  {city.condoFocus && (
                    <span className="hsa-badge condo">Condo Specialists</span>
                  )}
                  {city.slug === 'tampa-fl' && (
                    <span className="hsa-badge primary">Headquarters</span>
                  )}
                </div>

                <h3 className="hsa-city-name">{city.city}, {city.state || 'FL'}</h3>
                <p className="hsa-intro-snippet">{firstPara}</p>

                {city.localContext?.points && city.localContext.points.length > 0 && (
                  <div className="hsa-neighborhoods">
                    {city.localContext.points.slice(0, 2).map((pt, i) => (
                      <span key={i} className="hsa-nh-tag">
                        {pt.length > 45 ? `${pt.slice(0, 42)}...` : pt}
                      </span>
                    ))}
                  </div>
                )}

                <div className="hsa-card-footer">
                  <span className="hsa-link-text">Explore {city.city} Services</span>
                  <ArrowRight size={15} className="hsa-arrow" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="hsa-cta-box text-center">
          <div className="hsa-cta-info">
            <Building2 size={24} className="hsa-cta-icon" />
            <div>
              <h4>Don't see your specific neighborhood listed?</h4>
              <p>We work with homeowners and condo associations throughout the entire Tampa Bay metropolitan area.</p>
            </div>
          </div>
          <Link to="/service-areas" className="btn btn-primary hsa-hub-btn">
            View Interactive Map & All Service Areas <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

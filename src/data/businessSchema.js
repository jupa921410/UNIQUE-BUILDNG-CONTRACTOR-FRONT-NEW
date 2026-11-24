import { PHASE1_CITIES } from './serviceAreasData.js';

export const SITE_URL = 'https://www.uniquebuildingcontractors.com';

// Single source of truth for the public business NAP (name, address, phone)
// and office hours. Keep in sync with Google Business Profile, BBB, Houzz, etc.
export const BUSINESS_INFO = {
  legalName: 'Unique Building Contractors LLC',
  phone: '(813) 523-7828',
  phoneHref: 'tel:+18135237828',
  email: 'sales@uniquebuildingcontractors.com',
  streetAddress: '4500 140th Ave N #214',
  addressLocality: 'Clearwater',
  addressRegion: 'FL',
  postalCode: '33762',
  addressLine: '4500 140th Ave N #214, Clearwater, FL 33762',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4500+140th+Ave+N%2C+%23214%2C+Clearwater%2C+FL+33762',
  // U.S. Census geocoder result for 4500 140th Ave N, Clearwater, FL 33762.
  latitude: 27.8983,
  longitude: -82.695,
  license: 'CBC1268844',
  hours: [
    { days: 'Monday – Friday', time: '8:00 AM – 4:00 PM' },
    { days: 'Saturday – Sunday', time: 'Closed' },
  ],
  hoursText: 'Monday–Friday 8:00 AM–4:00 PM · Saturday & Sunday closed',
};

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GeneralContractor'],
  '@id': `${SITE_URL}/#business`,
  name: 'Unique Building Contractors', legalName: BUSINESS_INFO.legalName, alternateName: 'UBC', url: SITE_URL,
  logo: `${SITE_URL}/web-app-manifest-512x512.png`, image: `${SITE_URL}/meta.jpg`,
  telephone: '+1-813-523-7828', email: BUSINESS_INFO.email, priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_INFO.streetAddress,
    addressLocality: BUSINESS_INFO.addressLocality,
    addressRegion: BUSINESS_INFO.addressRegion,
    postalCode: BUSINESS_INFO.postalCode,
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: BUSINESS_INFO.latitude, longitude: BUSINESS_INFO.longitude },
  areaServed: PHASE1_CITIES.map(({ city, slug }) => ({ '@type': 'Place', name: `${city}, FL`, url: `${SITE_URL}/service-areas/${slug}` })),
  sameAs: [
    'https://share.google/O4LG4B88T9RAUiKDE',
    'https://www.facebook.com/profile.php?id=61577141914044',
    'https://www.instagram.com/uniquebuildingcontractors/',
    'https://www.tiktok.com/@uniquebuildingcontractor',
  ],
  hasMap: 'https://www.google.com/maps/place/Unique+Building+Contractors+llc/data=!4m2!3m1!1s0x0:0x9f23fe4a466eb85a',
  // Office hours confirmed by the owner (Nov 2026): Mon–Fri 8 AM–4 PM, closed weekends.
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '16:00' },
  ],
  identifier: { '@type': 'PropertyValue', name: 'Florida Certified Building Contractor License', value: BUSINESS_INFO.license },
};

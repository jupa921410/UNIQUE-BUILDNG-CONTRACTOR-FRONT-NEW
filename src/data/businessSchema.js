import { PHASE1_CITIES } from './serviceAreasData.js';

export const SITE_URL = 'https://www.uniquebuildingcontractors.com';
export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GeneralContractor'],
  '@id': `${SITE_URL}/#business`,
  name: 'Unique Building Contractors', alternateName: 'UBC', url: SITE_URL,
  logo: `${SITE_URL}/web-app-manifest-512x512.png`, image: `${SITE_URL}/meta.jpg`,
  telephone: '(813) 523-7828', email: 'sales@uniquebuildingcontractors.com', priceRange: '$$',
  areaServed: PHASE1_CITIES.map(({ city, slug }) => ({ '@type': 'Place', name: `${city}, FL`, url: `${SITE_URL}/service-areas/${slug}` })),
  sameAs: [
    'https://share.google/O4LG4B88T9RAUiKDE',
    'https://www.facebook.com/profile.php?id=61577141914044',
    'https://www.instagram.com/uniquebuildingcontractors/',
  ],
  hasMap: 'https://www.google.com/maps/place/Unique+Building+Contractors+llc/data=!4m2!3m1!1s0x0:0x9f23fe4a466eb85a',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00' },
  ],
  // Verified Google Business profile: "No location; deliveries and home services only."
  // Do not invent a street address, postal code or point coordinates for a service-area business.
  // Hours confirmed by the owner; Google currently has an incorrect AM closing time.
  identifier: { '@type': 'PropertyValue', name: 'Florida Certified Building Contractor License', value: 'CBC1268844' },
};

import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';
import './ResourcesPage.css';

const resources = [
  { id: 'kitchen-remodel-planning-tampa', title: 'Planning a Kitchen Remodel in Tampa', text: 'Start with how the room needs to function, then define cabinetry, surfaces, lighting, plumbing, appliances, and layout changes. Material lead times, permit review, inspections, and existing conditions all affect the final schedule and cost.' },
  { id: 'bathroom-remodel-planning', title: 'What to Consider Before a Bathroom Remodel', text: 'A practical bathroom plan considers ventilation, waterproofing, plumbing locations, safe clearances, storage, lighting, tile, fixtures, and durable finishes. Permit requirements depend on the work and local jurisdiction.' },
  { id: 'flooring-for-florida-homes', title: 'Choosing Flooring for a Florida Home', text: 'Compare moisture exposure, room use, subfloor condition, maintenance, comfort, and transitions—not appearance alone. Tile, engineered hardwood, luxury vinyl, laminate, and natural stone each suit different conditions.' },
  { id: 'home-addition-planning-florida', title: 'Planning a Home Addition in Florida', text: 'An addition must connect with the existing foundation, structure, roof, utilities, drainage, and architectural character. Zoning, plans, engineering, permits, inspections, and site conditions should be evaluated before construction.' },
  { id: 'remodeling-project-timeline', title: 'What Affects a Remodeling Timeline?', text: 'Scope, design decisions, permit review, inspections, material availability, trade sequencing, and concealed existing conditions can all change a schedule. A reliable timeline follows a defined scope rather than a generic promise.' },
  { id: 'selecting-a-florida-contractor', title: 'What to Know Before Remodeling in Florida', text: 'Confirm the contractor’s identity and license, define the written scope, understand responsibility for permits and inspections, document selections, and establish how schedule changes and project communication will be handled.' },
];

export default function ResourcesPage() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Construction and Remodeling Resources', url: `${SITE_URL}/resources`,
    about: { '@id': `${SITE_URL}/#business` },
  };
  return (
    <main className="resources-page section">
      <SEO title="Construction & Remodeling Resources" description="Practical planning guidance for Tampa Bay kitchen, bathroom, flooring, addition and home remodeling projects." schema={[schema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }])]} />
      <div className="container">
        <div className="section-badge">Planning Guides</div>
        <h1 className="section-title">Construction & <span>Remodeling Resources</span></h1>
        <p className="section-subtitle">Factual starting points for planning a Tampa Bay construction or remodeling project. Project-specific scope, pricing, schedules, and permit requirements require an individual evaluation.</p>
        <div className="resources-grid">
          {resources.map(resource => <article key={resource.id} id={resource.id} className="glass-card resource-card"><h2>{resource.title}</h2><p>{resource.text}</p></article>)}
        </div>
        <div className="resource-links"><Link to="/services/remodeling">Explore remodeling services</Link><Link to="/portfolio">View our portfolio</Link><Link to="/#contact">Discuss your project</Link></div>
      </div>
    </main>
  );
}

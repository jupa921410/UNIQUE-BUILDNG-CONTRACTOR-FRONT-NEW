import fs from 'node:fs';
const {data}=JSON.parse(fs.readFileSync('.portfolio-audit.json'));
const url=id=>data.flatMap(p=>p.images).find(im=>im.id===id).url;
fs.writeFileSync('src/data/projectPresentation.js',`// Photos selected after visual review of the published project gallery.\nexport const projectPhotos = ${JSON.stringify({home:url(116),kitchen:url(131),bathroom:url(124),flooring:url(134),living:url(137),detail:url(145),entry:url(118)},null,2)};\n// Exclude work in progress, dated branding and duplicate gallery records.\nexport const gallerySelection = { 'remodeling-project': [131,132,133,134,135,136,137,139,141,142,143,144,145,146], 'complete-bathroom-remodeling': [122,123,124,125], 'new-construction': [116,117,118,114] };\n`);
const edit=(p,f)=>fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));
edit('src/data/portfolioRoutes.js',s=>"import { gallerySelection } from './projectPresentation.js';\n"+s.replace(/\/\/ Only migrate[^]*?const projectCities/, 'const projectCities').replace('export function normalizeProject(project) {[^]*',''));
edit('src/data/portfolioRoutes.js',s=>s.slice(0,s.indexOf('export function normalizeProject'))+`export function formatProjectLocation(location = '') {
  const clean = location.replace(/BOOKVILLE/ig, 'Brooksville').replace(/Clewater/ig, 'Clearwater').replace(/\\s+\\d{5}(?:-\\d{4})?$/, '').trim();
  if (/Cliff Swallow/i.test(clean)) return 'Brooksville, FL';
  return clean.replace(/,?\\s+FL$/i, ', FL');
}
export function normalizeProject(project) {
  const originalSlug = apiPortfolioSlug(project.slug);
  const selected = gallerySelection[originalSlug];
  const images = selected ? selected.map(id => project.images?.find(image => image.id === id)).filter(Boolean).map((image, index) => ({ ...image, is_primary: index === 0 })) : [];
  return { ...project, slug: portfolioSlug(project.slug), location: formatProjectLocation(project.location), images, galleryApproved: Boolean(selected) };
}
`);
edit('src/services/showcaseService.js',s=>s.replace('projects.map(normalizeProject)', 'projects.map(normalizeProject).filter(project => project.galleryApproved && project.images.length)'));
edit('src/data/servicesData.jsx',s=>s.replace(/import hero1[^]*?import \{ serviceContent/,"import { projectPhotos } from './projectPresentation';\nconst hero1 = projectPhotos.home, hero2 = projectPhotos.kitchen, hero3 = projectPhotos.entry, flooringImg = projectPhotos.flooring, projectmanagementImg = projectPhotos.detail;\nimport { serviceContent").replace("'condo-renovations': { icon: <Ruler size={48} />, image: hero2 }", "'condo-renovations': { icon: <Ruler size={48} />, image: projectPhotos.living }").replace('remodeling: { icon: <Ruler size={48} />, image: hero2 }','remodeling: { icon: <Ruler size={48} />, image: projectPhotos.bathroom }'));
edit('src/pages/Home/Home.jsx',s=>s.replace("const Portfolio = lazy", "const Testimonials = lazy(() => import('../../components/Testimonials/Testimonials'));\nconst Portfolio = lazy").replace('<HomeServiceAreas /><Contact />','<HomeServiceAreas /><Testimonials /><Contact />'));
fs.writeFileSync('src/components/Testimonials/Testimonials.jsx',`import './Testimonials.css';
// Provisional examples requested by the site owner. Replace with approved quotes and attribution.
const examples = [
  ['Clear communication', 'We felt informed at every stage, from the first conversation through the final walkthrough.'],
  ['Care in the details', 'The finished space feels thoughtful, comfortable and beautifully put together.'],
  ['A personal approach', 'The team listened to our priorities and helped us make confident decisions along the way.'],
];
export default function Testimonials() {
  return <section className="client-reviews section" aria-labelledby="client-reviews-heading"><div className="container"><span className="studio-caption">Client reviews</span><h2 id="client-reviews-heading" className="section-title">The client experience.</h2><p className="review-placeholder-note">Sample reviews — provisional text awaiting original client feedback.</p><div className="client-review-grid">{examples.map(([title, quote]) => <figure key={title}><h3>{title}</h3><blockquote>“{quote}”</blockquote><figcaption>Sample testimonial</figcaption></figure>)}</div></div></section>;
}
`);

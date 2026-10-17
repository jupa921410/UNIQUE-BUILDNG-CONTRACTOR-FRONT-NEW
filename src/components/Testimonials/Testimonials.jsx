import './Testimonials.css';
// Provisional examples requested by the site owner. Replace with approved quotes and attribution.
const examples = [
  ['Clear communication', 'We felt informed at every stage, from the first conversation through the final walkthrough.'],
  ['Care in the details', 'The finished space feels thoughtful, comfortable and beautifully put together.'],
  ['A personal approach', 'The team listened to our priorities and helped us make confident decisions along the way.'],
];
export default function Testimonials() {
  return <section className="client-reviews section" aria-labelledby="client-reviews-heading"><div className="container"><span className="studio-caption">Client reviews</span><h2 id="client-reviews-heading" className="section-title">The client experience.</h2><p className="review-placeholder-note">Sample reviews � provisional text awaiting original client feedback.</p><div className="client-review-grid">{examples.map(([title, quote]) => <figure key={title}><h3>{title}</h3><blockquote>�{quote}�</blockquote><figcaption>Sample testimonial</figcaption></figure>)}</div></div></section>;
}

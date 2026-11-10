import { useRef, useState } from 'react';
import './Testimonials.css';

// Example portraits: replace the image paths below with client photos when ready.
const testimonials = [
  {
    name: 'James Miller',
    image: '/images/testimonials/james-miller.jpg',
    project: 'Kitchen Remodeling in Tampa',
    quote: 'Unique Building Contractors helped transform our Tampa kitchen into a space that works for our family. We love the cabinet layout, the extra storage, and the attention to the finishes.',
  },
  {
    name: 'Sarah Thompson',
    image: '/images/testimonials/sarah-thompson.jpg',
    project: 'Bathroom Remodeling in St. Petersburg',
    quote: 'We wanted a brighter, more comfortable bathroom in our St. Petersburg home. Unique Building Contractors helped bring our ideas together, and the spacious shower is our favorite part.',
  },
  {
    name: 'Michael Anderson',
    image: '/images/testimonials/michael-anderson.jpg',
    project: 'Flooring Installation in Tampa',
    quote: 'Our new floors made such a difference in our Tampa home. We appreciate the care Unique Building Contractors took with the installation, especially the transitions between rooms.',
  },
  {
    name: 'Emily Parker',
    image: '/images/testimonials/emily-parker.jpg',
    project: 'Interior Remodeling in Brandon',
    quote: 'We hired Unique Building Contractors to update our living room in Brandon. The space feels more open and welcoming, and we finally have a layout that suits how we use our home.',
  },
  {
    name: 'David Wilson',
    image: '/images/testimonials/david-wilson.jpg',
    project: 'Home Addition in Riverview',
    quote: 'Our family needed more room in our Riverview home. The addition blends beautifully with the existing house and gives us the extra living space we were hoping for.',
  },
  {
    name: 'Ashley Bennett',
    image: '/images/testimonials/ashley-bennett.jpg',
    project: 'Kitchen Renovation in Clearwater',
    quote: 'Our kitchen renovation in Clearwater gave us better storage and a much more practical layout. Working with Unique Building Contractors helped us turn our ideas into a kitchen we enjoy every day.',
  },
  {
    name: 'Robert Hayes',
    image: '/images/testimonials/robert-hayes.jpg',
    project: 'New Home Construction in Tampa Bay',
    quote: 'Building our home in Tampa Bay was a major milestone for us. We appreciated having the team at Unique Building Contractors explain each stage and keep us informed as the project progressed.',
  },
  {
    name: 'Jennifer Collins',
    image: '/images/testimonials/jennifer-collins.jpg',
    project: 'Home Remodeling in Hillsborough County',
    quote: 'We wanted to update several areas of our Hillsborough County home. Unique Building Contractors helped create a consistent look throughout the house, with spaces that feel more comfortable and connected.',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(null);
  const navigate = (direction) => {
    setActiveIndex(index => (index + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section className="home-testimonials" id="testimonials" aria-labelledby="testimonials-heading" aria-roledescription="carousel">
      <div className="container">
        <div className="studio-section-heading home-testimonials-heading">
          <div>
            <span className="studio-caption">Client testimonials</span>
            <h2 id="testimonials-heading">A home you'll love.<br />An experience that matters.</h2>
          </div>
          <p>Thoughtful work starts with a good relationship. Listening, keeping you informed and caring for the details are at the heart of our approach.</p>
        </div>
        <div className="home-testimonials-slider">
          <div
            className="home-testimonials-viewport"
            id="testimonial-slides"
            onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
            onTouchCancel={() => { touchStart.current = null; }}
            onTouchEnd={event => {
              if (touchStart.current === null) return;
              const distance = touchStart.current - event.changedTouches[0].clientX;
              touchStart.current = null;
              if (Math.abs(distance) > 50) navigate(distance > 0 ? 1 : -1);
            }}
          >
            <div className="home-testimonials-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {testimonials.map(({ name, project, quote, image }, index) => (
                <div className="home-testimonial-slide" key={name} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${testimonials.length}`} aria-hidden={index !== activeIndex} inert={index !== activeIndex}>
                  <figure className="home-testimonial">
                    <span className="home-testimonial-mark" aria-hidden="true">&ldquo;</span>
                    <blockquote><p>{quote}</p></blockquote>
                    <figcaption>
                      <img className="home-testimonial-avatar" src={image} alt="Illustrative portrait" width="72" height="72" loading="lazy" decoding="async" />
                      <span><strong>{name}</strong><span className="home-testimonial-project">{project}</span></span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
          <div className="home-testimonials-controls">
            <div className="home-testimonials-arrows">
              <button type="button" className="home-testimonials-arrow" onClick={() => navigate(-1)} aria-label="Previous testimonial" aria-controls="testimonial-slides"><span aria-hidden="true">&#8592;</span></button>
              <span className="home-testimonials-count" role="status" aria-live="polite" aria-atomic="true">{activeIndex + 1} / {testimonials.length}</span>
              <button type="button" className="home-testimonials-arrow" onClick={() => navigate(1)} aria-label="Next testimonial" aria-controls="testimonial-slides"><span aria-hidden="true">&#8594;</span></button>
            </div>
            <div className="home-testimonials-dots" role="group" aria-label="Choose a testimonial">
              {testimonials.map(({ name }, index) => <button type="button" key={name} className={`home-testimonials-dot${index === activeIndex ? ' is-active' : ''}`} onClick={() => setActiveIndex(index)} aria-label={`Show testimonial by ${name}`} aria-current={index === activeIndex ? 'true' : undefined} aria-controls="testimonial-slides" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import ResponsiveImage from '../ResponsiveImage';
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  MapPin,
  AlertCircle,
} from 'lucide-react';
const logoMark = '/brand/logo-mini.svg';
import {
  fetchShowcaseProjects,
  getPrimaryImage,
} from '../../services/showcaseService';
import './Portfolio.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

// â”€â”€ Skeleton card shown while loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SkeletonCard() {
  return (
    <div className="portfolio-card glass-card portfolio-card-skeleton">
      <div className="portfolio-card-image-wrap portfolio-skeleton-img" />
      <div className="portfolio-card-body">
        <div className="portfolio-skeleton-line short" />
        <div className="portfolio-skeleton-line" />
        <div className="portfolio-skeleton-line medium" />
      </div>
    </div>
  );
}

// â”€â”€ Single project card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProjectCard({ project, index }) {
  const imgUrl = getPrimaryImage(project);

  return (
    <motion.article
      className={`portfolio-card portfolio-card-${(index % 3) + 1} glass-card`}
      variants={fadeUp}
    >
      <div className="portfolio-card-image-wrap">
        {imgUrl ? (
          <ResponsiveImage
            src={imgUrl}
            alt={`${project.title}, ${project.location || "Tampa Bay FL"}`}
            className="portfolio-card-image"
            loading="lazy"
          />
        ) : (
          <div className="portfolio-card-no-image">
            <span>No Image</span>
          </div>
        )}
        {project.featured && (
          <span className="portfolio-card-featured-badge">Featured</span>
        )}
      </div>

      <div className="portfolio-card-body">
        <span className="portfolio-card-category">{project.category}</span>
        <h3 className="portfolio-card-title">{project.title}</h3>
        {project.description && (
          <p className="portfolio-card-desc">
            {project.description.length > 100
              ? `${project.description.slice(0, 97)}…`
              : project.description}
          </p>
        )}
        <div className="portfolio-card-footer">
          <span className="portfolio-card-location">
            <MapPin size={14} /> {project.location}
          </span>
          <Link
            to={`/portfolio/${project.slug}`}
            className="portfolio-card-link"
            aria-label={`View details for ${project.title}`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// â”€â”€ Main exported component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchShowcaseProjects()
      .then((all) => {
        if (cancelled) return;
        // Prefer featured projects, otherwise take the most recent 3
        const featured = all.filter((p) => p.featured);
        const preview = featured.length >= 1 ? featured.slice(0, 3) : all.slice(0, 3);
        setProjects(preview);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <section className="portfolio section" id="portfolio">
      <ResponsiveImage
        src={logoMark}
        alt=""
        className="portfolio-brand-mark"
        aria-hidden="true"
      />

      <div className="container">
        {/* â”€â”€ Header â”€â”€ */}
        <motion.div
          className="portfolio-header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="portfolio-header-main">
            <div className="section-badge">Our Work</div>
            <h2 className="section-title">
              Signature <span>Projects</span>
            </h2>
            <p className="section-subtitle">
              Selected transformations built to feel architectural, precise, and
              materially elevated across Tampa Bay.
            </p>
          </div>

          <div className="portfolio-intro-card glass-card">
            <span className="portfolio-intro-label">Portfolio Focus</span>
            <p>
              We design projects to read as complete environments, not isolated
              upgrades. Layout, finishes, lighting, and detailing are resolved as
              one system.
            </p>
          </div>
        </motion.div>

        {/* â”€â”€ Error state â”€â”€ */}
        {error && !loading && (
          <div className="portfolio-error">
            <AlertCircle size={22} />
            <span>Could not load projects. {error}</span>
          </div>
        )}

        {/* â”€â”€ Grid â”€â”€ */}
        <motion.div
          className="portfolio-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
        </motion.div>

        {/* â”€â”€ CTA â”€â”€ */}
        {!loading && !error && (
          <div className="portfolio-view-all">
            <Link to="/portfolio" className="portfolio-cta design-button">
              View all projects
              <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

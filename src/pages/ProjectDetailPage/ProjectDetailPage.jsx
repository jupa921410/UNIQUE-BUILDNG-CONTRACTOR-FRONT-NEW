import ResponsiveImage from '../../components/ResponsiveImage';
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  CalendarRange,
  Ruler,
  DollarSign,
  User2,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  fetchShowcaseProject,
  fetchShowcaseProjects,
  formatCompletionDate,
} from '../../services/showcaseService';
import {
  projectArea,
  projectBlocks,
  projectCity,
  projectImageAlt,
  projectMetaDescription,
  projectService,
  relatedProjects,
} from '../../data/projectContent';
import PanoramaViewer from '../../components/PanoramaViewer/PanoramaViewer';
import './ProjectDetailPage.css';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed:   { label: 'Completed',   icon: <CheckCircle2 size={14} />, className: 'status-completed' },
  in_progress: { label: 'In Progress', icon: <Clock size={14} />,        className: 'status-in-progress' },
  coming_soon: { label: 'Coming Soon', icon: <Sparkles size={14} />,     className: 'status-coming-soon' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`pdp-status-badge ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Image lightbox / gallery ───────────────────────────────────────────────
function MediaViewer({ item, location, projectTitle, alt }) {
  if (!item) return null;
  const caption = `${item.caption || projectTitle || 'Construction project'}, ${location || 'Tampa Bay FL'}`;

  switch (item.media_type) {
    case 'video':
      return (
        <div className="pdp-gallery-media-wrap">
          <video
            src={item.url}
            controls
            muted
            playsInline
            className="pdp-gallery-media"
            aria-label={caption}
          />
        </div>
      );

    case 'image_360':
      return (
        <div className="pdp-gallery-media-wrap pdp-gallery-360">
          {item.url ? (
            <PanoramaViewer key={item.url} src={item.url} title={caption} />
          ) : (
            <div className="pdp-gallery-media-empty">360° image not available</div>
          )}
          <div className="pdp-gallery-360-badge">🔄 360° View</div>
        </div>
      );

    case 'iframe':
      return (
        <div className="pdp-gallery-media-wrap pdp-gallery-iframe">
          {item.iframe_url ? (
            <iframe
              src={item.iframe_url}
              title={caption}
              className="pdp-gallery-media"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
            />
          ) : (
            <div className="pdp-gallery-media-empty">Embedded content not available</div>
          )}
        </div>
      );

    case 'image':
    default:
      return (
        <div className="pdp-gallery-media-wrap">
          {item.url ? (
            <ResponsiveImage
              src={item.url}
              alt={alt || caption}
              className="pdp-gallery-media"
            />
          ) : (
            <div className="pdp-gallery-media-empty">Image not available</div>
          )}
        </div>
      );
  }
}

function Gallery({ images, location, projectTitle, project }) {
  const [current, setCurrent] = useState(0);

  if (!images?.length) return null;

  const primaryIdx = images.findIndex((img) => img.is_primary);
  const ordered = primaryIdx > 0
    ? [images[primaryIdx], ...images.filter((_, i) => i !== primaryIdx)]
    : images;

  const prev = () => setCurrent((i) => (i - 1 + ordered.length) % ordered.length);
  const next = () => setCurrent((i) => (i + 1) % ordered.length);

  return (
    <div className="pdp-gallery">
      {/* Main media */}
      <div className="pdp-gallery-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={ordered[current].id ?? current}
            className="pdp-gallery-media-panel"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <MediaViewer item={ordered[current]} location={location} projectTitle={projectTitle} alt={project ? projectImageAlt(project, current, ordered[current]) : undefined} />
          </motion.div>
        </AnimatePresence>

        {ordered[current].caption && (
          <div className="pdp-gallery-caption">{ordered[current].caption}</div>
        )}

        {ordered.length > 1 && (
          <>
            <button className="pdp-gallery-nav prev" onClick={prev} aria-label="Previous media">
              <ChevronLeft size={22} />
            </button>
            <button className="pdp-gallery-nav next" onClick={next} aria-label="Next media">
              <ChevronRight size={22} />
            </button>
            <div className="pdp-gallery-counter">
              {current + 1} / {ordered.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {ordered.length > 1 && (
        <div className="pdp-gallery-thumbs">
          {ordered.map((item, i) => (
            <button
              key={item.id ?? i}
              className={`pdp-thumb ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to media ${i + 1}`}
            >
              {item.url ? (
                <ResponsiveImage src={item.url} alt={project ? projectImageAlt(project, i, item) : `Project photo ${i + 1}, ${location || 'Tampa Bay FL'}`} />
              ) : (
                <div className="pdp-thumb-placeholder">
                  {item.media_type === 'iframe'
                    ? 'Embed'
                    : item.media_type === 'video'
                    ? 'Video'
                    : item.media_type === 'image_360'
                    ? '360°'
                    : 'Media'}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Meta chip ─────────────────────────────────────────────────────────────
function MetaItem({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="pdp-meta-item">
      <div className="pdp-meta-icon">{icon}</div>
      <div>
        <span className="pdp-meta-label">{label}</span>
        <strong className="pdp-meta-value">{value}</strong>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { slug } = useParams();
  const initialProject = getInitialProject(slug);
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState(null);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchShowcaseProjects()
      .then((list) => { if (!cancelled) setAllProjects(list); })
      .catch(() => { /* Related links are optional. */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (project?.slug === slug) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProject(null);

    fetchShowcaseProject(slug)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug, project?.slug]);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <main className="pdp-page">
        <SEO title="Loading Project" description="Loading construction project details." noindex />
        <div className="container pdp-skeleton-wrap">
          <div className="pdp-skeleton-hero" />
          <div className="pdp-skeleton-body">
            <div className="pdp-skel-line short" />
            <div className="pdp-skel-line" />
            <div className="pdp-skel-line medium" />
          </div>
        </div>
      </main>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <main className="pdp-page">
        <SEO title="Project Not Found" description="The requested construction project could not be found." noindex />
        <div className="container pdp-error-wrap">
          <AlertCircle size={44} className="pdp-error-icon" />
          <h2>Project Not Found</h2>
          <p>{error}</p>
          <Link to="/portfolio" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  if (!project) return null;

  const featured = project.featured;
  const completionDate = formatCompletionDate(project.completion_date);
  const projectImage = project.images?.find((image) => image.is_primary)?.url || project.images?.[0]?.url;
  const city = projectCity(project);
  const heading = `${project.title}${city ? ` in ${city}, FL` : ''}`;
  const overview = projectBlocks(project.description);
  const projectDescription = projectMetaDescription(project);
  const service = projectService(project);
  const area = projectArea(project);
  const related = relatedProjects(project, allProjects);
  const imageSchemas = (project.images || []).filter(image => image.url && ['image', 'image_360'].includes(image.media_type)).map(image => ({
    '@context': 'https://schema.org', '@type': 'ImageObject', contentUrl: image.url,
    caption: image.caption || project.title, representativeOfPage: Boolean(image.is_primary),
  }));
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: projectDescription,
    url: `${SITE_URL}/portfolio/${slug}`,
    image: imageSchemas.map(image => image.contentUrl),
    locationCreated: project.location,
    creator: { '@id': `${SITE_URL}/#business` },
    dateCreated: project.completion_date,
  };

  return (
    <main className="pdp-page">
      <SEO
        title={`${project.title}${project.location ? ` — ${project.location}` : ''}`}
        description={projectDescription}
        image={projectImage}
        type="article"
        schema={[
          projectSchema,
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Portfolio', path: '/portfolio' }, { name: project.title, path: `/portfolio/${slug}` }]),
          ...imageSchemas,
        ]}
      />
      {/* ── Hero ── */}
      <section className="pdp-hero">
        <div className="container">
          {/* Breadcrumb */}
          <motion.nav
            className="pdp-breadcrumb"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/portfolio">Portfolio</Link>
            <span>/</span>
            <span>{project.title}</span>
          </motion.nav>

          <motion.div
            className="pdp-hero-content"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pdp-badges">
              <span className="section-badge">{project.category}</span>
              {featured && <span className="pdp-featured-badge"><Star size={13} /> Featured</span>}
              {project.project_status && <StatusBadge status={project.project_status} />}
            </div>
            <h1 className="section-title">{heading}</h1>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="pdp-content section">
        <div className="container pdp-layout">

          {/* ── LEFT: Gallery + description ── */}
          <motion.div
            className="pdp-main"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <Gallery images={project.images} location={project.location} projectTitle={project.title} project={project} />

            {overview.length > 0 && (
              <div className="pdp-description glass-card">
                <h2 className="pdp-section-heading">Project Overview</h2>
                {overview.map((block, index) => (block.type === 'ul'
                  ? <ul key={index} className="pdp-scope-list">{block.items.map(item => <li key={item}>{item}</li>)}</ul>
                  : <p key={index}>{block.text}</p>))}
              </div>
            )}

            <div className="pdp-description glass-card pdp-related">
              <h2 className="pdp-section-heading">Related Services</h2>
              <ul className="pdp-related-list">
                <li><Link to={service.path}>{service.name}</Link></li>
                {area
                  ? <li><Link to={`/service-areas/${area.slug}`}>Remodeling contractor in {area.city}, FL</Link></li>
                  : <li><Link to="/service-areas">Tampa Bay service areas</Link></li>}
              </ul>
              {related.length > 0 && (
                <>
                  <h2 className="pdp-section-heading">More Projects</h2>
                  <ul className="pdp-related-list">
                    {related.map(item => (
                      <li key={item.slug}>
                        <Link to={`/portfolio/${item.slug}`}>
                          {item.title}{projectCity(item) ? ` — ${projectCity(item)}, FL` : ''}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT: Sidebar ── */}
          <motion.aside
            className="pdp-sidebar"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            {/* Meta card */}
            <div className="pdp-meta-card glass-card">
              <h3 className="pdp-meta-heading">Project Details</h3>

              <div className="pdp-meta-grid">
                <MetaItem icon={<Tag size={18} />} label="Category" value={project.category} />
                <MetaItem icon={<MapPin size={18} />} label="Location" value={project.location} />
                <MetaItem icon={<CalendarRange size={18} />} label="Completed" value={completionDate} />
                <MetaItem icon={<User2 size={18} />} label="Client" value={project.client_name} />
                <MetaItem
                  icon={<Ruler size={18} />}
                  label="Square Feet"
                  value={project.square_feet ? `${project.square_feet.toLocaleString()} sq ft` : null}
                />
                <MetaItem icon={<DollarSign size={18} />} label="Value Range" value={project.value_range} />
                {project.project_status && STATUS_CONFIG[project.project_status] && (
                  <div className="pdp-meta-item">
                    <div className="pdp-meta-icon">
                      {STATUS_CONFIG[project.project_status].icon}
                    </div>
                    <div>
                      <span className="pdp-meta-label">Status</span>
                      <StatusBadge status={project.project_status} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA card */}
            <div className="pdp-cta-card glass-card">
              <h3>Interested in a Similar Project?</h3>
              <p>
                Let's discuss your vision and how we can bring it to life
                with the same level of craftsmanship and attention to detail.
              </p>
              <a href="/#contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get a Free Quote <ArrowUpRight size={18} />
              </a>
            </div>

            {/* Back link */}
            <Link to="/portfolio" className="pdp-back-link">
              <ArrowLeft size={16} /> Back to All Projects
            </Link>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}

function getInitialProject(slug) {
  if (typeof document === 'undefined') return null;
  const element = document.getElementById('ubc-project-data');
  if (!element?.textContent) return null;
  try {
    const project = JSON.parse(element.textContent);
    return project?.slug === slug ? project : null;
  } catch {
    return null;
  }
}

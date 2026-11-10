import ResponsiveImage from '../../components/ResponsiveImage';
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  MapPin,
  Ruler,
  DollarSign,
  Search,
  SlidersHorizontal,
  AlertCircle,
  Home,
  Building2,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import ConceptHero from '../../components/ConceptHero/ConceptHero';
import {
  fetchShowcaseProjects,
  getPrimaryImage,
} from '../../services/showcaseService';
import './PortfolioPage.css';
import SEO from '../../components/SEO/SEO';

// â”€â”€ Animation variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// â”€â”€ Category filter config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORIES = [
  { key: 'all', label: 'All Projects', icon: <Layers size={16} /> },
  { key: 'Residential', label: 'Residential', icon: <Home size={16} /> },
  { key: 'Commercial', label: 'Commercial', icon: <Building2 size={16} /> },
];

// â”€â”€ Status config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_CONFIG = {
  completed:    { label: 'Completed',    icon: <CheckCircle2 size={13} />, className: 'status-completed' },
  in_progress:  { label: 'In Progress',  icon: <Clock size={13} />,        className: 'status-in-progress' },
  coming_soon:  { label: 'Coming Soon',  icon: <Sparkles size={13} />,     className: 'status-coming-soon' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`pp-status-badge ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SkeletonCard() {
  return (
    <div className="pp-card pp-card-skeleton glass-card">
      <div className="pp-card-img pp-skeleton-img" />
      <div className="pp-card-body">
        <div className="pp-skeleton-line short" />
        <div className="pp-skeleton-line" />
        <div className="pp-skeleton-line medium" />
        <div className="pp-skeleton-line short" />
      </div>
    </div>
  );
}

// â”€â”€ Project card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProjectCard({ project }) {
  const imgUrl = getPrimaryImage(project);

  return (
    <motion.article className="pp-card glass-card" variants={fadeUp} layout>
      <Link to={`/portfolio/${project.slug}`} className="pp-card-inner">
        <div className="pp-card-img-wrap">
          {imgUrl ? (
            <ResponsiveImage
              src={imgUrl}
              alt={`${project.title}, ${project.location || "Tampa Bay FL"}`}
              className="pp-card-img"
              loading="lazy"
            />
          ) : (
            <div className="pp-card-no-img">No Image Available</div>
          )}
          <div className="pp-card-overlay">
            <span className="pp-card-view-btn">
              View Details <ArrowUpRight size={16} />
            </span>
          </div>
          {project.featured && (
            <span className="pp-card-featured">Featured</span>
          )}
          {project.project_status && (
            <span className="pp-status-badge-wrap">
              <StatusBadge status={project.project_status} />
            </span>
          )}
          <span className="pp-card-category-pill">{project.category}</span>
        </div>

        <div className="pp-card-body">
          <h3 className="pp-card-title">{project.title}</h3>
          {project.description && (
            <p className="pp-card-desc">
              {project.description.length > 110
                ? `${project.description.slice(0, 107)}…`
                : project.description}
            </p>
          )}

          <div className="pp-card-meta">
            {project.location && (
              <span>
                <MapPin size={13} /> {project.location}
              </span>
            )}
            {project.square_feet && (
              <span>
                <Ruler size={13} /> {project.square_feet.toLocaleString()} sq ft
              </span>
            )}
          </div>

          {project.value_range && (
            <div className="pp-card-value">
              <DollarSign size={14} />
              {project.value_range}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

// â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [search, setSearch] = useState('');

  // Fetch all projects once
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchShowcaseProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Derive results directly so filters and pagination update together.
  const filtered = (() => {
    let result = projects;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeStatus !== 'all') {
      result = result.filter((p) => p.project_status === activeStatus);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    return result;
  })();
  const totalPages = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * 6;
  const visibleProjects = filtered.slice(pageStart, pageStart + 6);
  const changePage = (nextPage) => {
    setPage(nextPage);
    document.getElementById('project-collection')?.scrollIntoView({ block: 'start' });
  };

  // Build unique categories from data for the filter bar
  const dynamicCategories = [
    CATEGORIES[0],
    ...Array.from(new Set(projects.map((p) => p.category)))
      .filter(Boolean)
      .map((cat) => {
        const preset = CATEGORIES.find((c) => c.key === cat);
        return preset ?? { key: cat, label: cat, icon: <Layers size={16} /> };
      }),
  ];

  return (
    <main className="portfolio-page">
      <SEO
        title="Tampa Bay Construction & Remodeling Portfolio"
        description="Explore completed home construction, remodeling, kitchen, bathroom and flooring projects by Unique Building Contractors across Tampa Bay."
      />
      {/* â”€â”€ Hero banner â”€â”€ */}
      <ConceptHero title="Crafted spaces. Real stories." label="Our portfolio" description="Explore our completed construction and renovation projects across Tampa Bay. See the spaces, details and craftsmanship behind each project." cta="Explore the projects" to="/portfolio#project-collection" />

      {/* â”€â”€ Filters â”€â”€ */}
      <section className="pp-filters-bar" id="project-collection">
        <div className="container pp-filters-inner">
          {/* Category chips */}
          <div className="pp-category-chips" role="group" aria-label="Filter by category">
            {dynamicCategories.map((cat) => (
              <button
                key={cat.key}
                id={`filter-${cat.key}`}
                className={`pp-chip ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => { setActiveCategory(cat.key); setPage(1); }}
              >
                {cat.icon}
                {cat.label}
                {cat.key !== 'all' && (
                  <span className="pp-chip-count">
                    {projects.filter((p) => p.category === cat.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Status filter chips */}
          <div className="pp-status-chips" role="group" aria-label="Filter by status">
            {[{ key: 'all', label: 'All Status', icon: <Layers size={14} /> },
              ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ key: k, label: v.label, icon: v.icon }))
            ].map((s) => (
              <button
                key={s.key}
                id={`status-filter-${s.key}`}
                className={`pp-chip pp-chip-status ${activeStatus === s.key ? 'active' : ''} ${s.key !== 'all' ? STATUS_CONFIG[s.key]?.className ?? '' : ''}`}
                onClick={() => { setActiveStatus(s.key); setPage(1); }}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="pp-search-wrap">
            <Search size={16} className="pp-search-icon" />
            <input
              id="portfolio-search"
              type="search"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pp-search-input"
              aria-label="Search projects"
            />
          </div>
        </div>
      </section>

      {/* â”€â”€ Results â”€â”€ */}
      <section className="pp-results section">
        <div className="container">
          {/* Count */}
          {!loading && !error && (
            <motion.p
              className="pp-result-count"
              role="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <SlidersHorizontal size={15} />
              {filtered.length > 0
                ? `Showing ${pageStart + 1}–${Math.min(pageStart + 6, filtered.length)} of ${filtered.length} projects`
                : '0 projects'}
            </motion.p>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="portfolio-error">
              <AlertCircle size={22} />
              <span>Could not load projects — {error}</span>
            </div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeStatus}-${search}-${currentPage}`}
              className="pp-grid"
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {loading
                ? [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
                : filtered.length > 0
                ? visibleProjects.map((p) => <ProjectCard key={p.id} project={p} />)
                : !error && (
                    <motion.div
                      className="pp-empty"
                      variants={fadeUp}
                    >
                      <span>No projects match your filter.</span>
                      <button
                        onClick={() => { setActiveCategory('all'); setActiveStatus('all'); setSearch(''); setPage(1); }}
                        className="pp-reset-btn"
                      >
                        Reset Filters
                      </button>
                    </motion.div>
                  )}
            </motion.div>
          </AnimatePresence>
          {!loading && !error && filtered.length > 0 && (
            <nav className="pp-pagination" aria-label="Portfolio pages">
              <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Previous</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(number => number === 1 || number === totalPages || Math.abs(number - currentPage) <= 1)
                .map((number, index, numbers) => (
                  <span className="pp-pagination-item" key={number}>
                    {index > 0 && number - numbers[index - 1] > 1 && <span aria-hidden="true">…</span>}
                    <button type="button" aria-label={`Page ${number}`} aria-current={number === currentPage ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>
                  </span>
                ))}
              <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next</button>
            </nav>
          )}
        </div>
      </section>

      {/* â”€â”€ CTA strip â”€â”€ */}
      <section className="pp-cta-strip">
        <div className="container pp-cta-inner">
          <div>
            <h2>Ready to Start Your Project?</h2>
            <p>Let's discuss how we can transform your space.</p>
          </div>
          <a href="/#contact" className="btn btn-primary">
            Get a Free Quote <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

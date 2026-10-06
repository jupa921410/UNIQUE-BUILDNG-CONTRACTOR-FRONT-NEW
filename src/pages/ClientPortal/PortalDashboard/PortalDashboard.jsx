import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, AlertCircle } from 'lucide-react';
import * as portalApi from '../../../services/portalApi';
import { usePortalAuth } from '../../../context/PortalAuthContext';
import SEO from '../../../components/SEO/SEO';
import './PortalDashboard.css';

const STATUS_LABEL = {
  planning: 'Planning', in_progress: 'In Progress', on_hold: 'On Hold',
  completed: 'Completed', cancelled: 'Cancelled',
};

export default function PortalDashboard() {
  const { client } = usePortalAuth();
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    portalApi.fetchProjects()
      .then((data) => { if (!cancelled) setProjects(data.data || []); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="portal-dashboard">
      <SEO title="My Projects" description="Your Unique Building Contractors projects." noindex />
      <h1>Welcome back{client?.first_name ? `, ${client.first_name}` : ''}</h1>
      <p className="portal-dashboard-sub">Here&apos;s an overview of your project{projects?.length === 1 ? '' : 's'}.</p>

      {error && <p className="portal-dashboard-error"><AlertCircle size={15} /> {error}</p>}

      {!projects && !error && <div className="portal-dashboard-loading">Loading your projects…</div>}

      {projects && !projects.length && (
        <div className="portal-empty-state">
          <Building2 size={28} />
          <p>No projects are linked to your account yet. Reach out to your project manager if you believe this is a mistake.</p>
        </div>
      )}

      <div className="portal-project-grid">
        {projects?.map((p) => (
          <Link to={`/portal/projects/${p.id}`} key={p.id} className="portal-project-card">
            <div className="portal-project-card-top">
              <span className={`portal-status-pill status-${p.status}`}>{STATUS_LABEL[p.status] || p.status}</span>
              {p.project_number && <span className="portal-project-number">#{p.project_number}</span>}
            </div>
            <h2>{p.name}</h2>
            {(p.city || p.state) && <p className="portal-project-location">{[p.address, p.city, p.state].filter(Boolean).join(', ')}</p>}

            <div className="portal-progress-bar">
              <div className="portal-progress-fill" style={{ width: `${p.progress_percent || 0}%` }} />
            </div>
            <p className="portal-progress-label">{p.progress_percent || 0}% complete · {p.tasks_summary?.completed || 0} of {p.tasks_summary?.total || 0} tasks done</p>

            <span className="portal-project-cta">View project <ArrowRight size={14} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

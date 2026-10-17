import ResponsiveImage from '../../../../components/ResponsiveImage';
import { MapPin, User, Calendar, TrendingUp } from 'lucide-react';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');

export default function OverviewTab({ project }) {
  return (
    <div className="portal-overview">
      <div className="portal-overview-grid">
        <div className="portal-overview-stat">
          <TrendingUp size={18} />
          <div>
            <p className="portal-overview-stat-value">{project.progress_percent || 0}%</p>
            <p className="portal-overview-stat-label">Complete</p>
          </div>
        </div>
        <div className="portal-overview-stat">
          <Calendar size={18} />
          <div>
            <p className="portal-overview-stat-value">{fmtDate(project.estimated_completion)}</p>
            <p className="portal-overview-stat-label">Est. completion</p>
          </div>
        </div>
        {project.vendor && (
          <div className="portal-overview-stat">
            <User size={18} />
            <div>
              <p className="portal-overview-stat-value">{project.vendor.name}</p>
              <p className="portal-overview-stat-label">Your contact</p>
            </div>
          </div>
        )}
        {(project.address || project.city) && (
          <div className="portal-overview-stat">
            <MapPin size={18} />
            <div>
              <p className="portal-overview-stat-value">{[project.address, project.city, project.state].filter(Boolean).join(', ')}</p>
              <p className="portal-overview-stat-label">Job site</p>
            </div>
          </div>
        )}
      </div>

      {project.description && (
        <>
          <h3 className="portal-section-title">About this project</h3>
          <p className="portal-overview-description">{project.description}</p>
        </>
      )}

      <h3 className="portal-section-title">Tasks</h3>
      {!project.tasks?.length ? (
        <p className="portal-empty-hint">No tasks recorded yet.</p>
      ) : (
        <ul className="portal-task-list">
          {project.tasks.map((t) => (
            <li key={t.id} className={`portal-task-item status-${t.status}`}>
              <span className="portal-task-dot" />
              <div>
                <p className="portal-task-name">{t.name}</p>
                {t.service && <p className="portal-task-service">{t.service}</p>}
              </div>
              <span className="portal-task-status">{t.status.replace('_', ' ')}</span>
            </li>
          ))}
        </ul>
      )}

      {!!project.progress_updates?.length && (
        <>
          <h3 className="portal-section-title">Recent progress</h3>
          <div className="portal-progress-feed">
            {project.progress_updates.slice(0, 6).map((u) => (
              <div key={u.id} className="portal-progress-feed-item">
                {u.images?.[0]?.url && <ResponsiveImage src={u.images[0].url} alt={u.title} />}
                <div>
                  <p className="portal-progress-feed-title">{u.title}</p>
                  <p className="portal-progress-feed-date">{fmtDate(u.recorded_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

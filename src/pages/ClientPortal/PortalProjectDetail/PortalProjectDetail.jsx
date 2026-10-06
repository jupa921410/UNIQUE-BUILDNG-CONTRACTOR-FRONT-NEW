import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import * as portalApi from '../../../services/portalApi';
import SEO from '../../../components/SEO/SEO';
import OverviewTab from './tabs/OverviewTab';
import FilesTab from './tabs/FilesTab';
import ContractTab from './tabs/ContractTab';
import WalkthroughTab from './tabs/WalkthroughTab';
import ChatTab from './tabs/ChatTab';
import InvoicesTab from './tabs/InvoicesTab';
import MaterialSelectionsTab from './tabs/MaterialSelectionsTab';
import './PortalProjectDetail.css';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'files', label: 'Files' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'contract', label: 'Contract' },
  { key: 'walkthrough', label: 'Walkthrough' },
  { key: 'materials', label: 'Material Selection' },
  { key: 'chat', label: 'Chat' },
];

export default function PortalProjectDetail() {
  // Keying by :id forces a full remount (fresh project/error/tab state) when
  // the client navigates from one project to another, instead of manually
  // resetting state inside an effect.
  const { id } = useParams();
  return <PortalProjectDetailView key={id} projectId={id} />;
}

function PortalProjectDetailView({ projectId }) {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');

  const reload = useCallback(() => {
    return portalApi.fetchProject(projectId)
      .then((data) => setProject(data.project))
      .catch((err) => setError(err.message));
  }, [projectId]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (error) {
    return (
      <div className="portal-project-error">
        <AlertCircle size={18} /> {error}
        <Link to="/portal">← Back to my projects</Link>
      </div>
    );
  }

  if (!project) {
    return <div className="portal-dashboard-loading">Loading project…</div>;
  }

  return (
    <div className="portal-project-detail">
      <SEO title={project.name} description={`Client portal for ${project.name}`} noindex />

      <Link to="/portal" className="portal-back-link"><ArrowLeft size={14} /> All projects</Link>
      <h1>{project.name}</h1>
      {project.project_number && <p className="portal-project-detail-number">#{project.project_number}</p>}

      <div className="portal-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`portal-tab-btn ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="portal-tab-panel">
        {tab === 'overview' && <OverviewTab project={project} />}
        {tab === 'files' && <FilesTab project={project} onChanged={reload} />}
        {tab === 'invoices' && <InvoicesTab project={project} />}
        {tab === 'contract' && <ContractTab project={project} />}
        {tab === 'walkthrough' && <WalkthroughTab project={project} />}
        {tab === 'materials' && <MaterialSelectionsTab project={project} />}
        {tab === 'chat' && <ChatTab project={project} />}
      </div>
    </div>
  );
}

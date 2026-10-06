import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import * as portalApi from '../../../../services/portalApi';
import InvoiceList from '../../PortalInvoices/InvoiceList';

export default function InvoicesTab({ project }) {
  const [invoices, setInvoices] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    portalApi.fetchInvoices(project.id)
      .then((data) => { if (!cancelled) setInvoices(data.data || []); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [project.id]);

  if (!invoices && !error) return <p className="portal-empty-hint">Loading invoices…</p>;
  if (error) return <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>;

  return (
    <div>
      <h3 className="portal-section-title">Project invoices</h3>
      <InvoiceList invoices={invoices} />
    </div>
  );
}

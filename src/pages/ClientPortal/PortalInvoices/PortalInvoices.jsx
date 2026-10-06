import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import * as portalApi from '../../../services/portalApi';
import SEO from '../../../components/SEO/SEO';
import InvoiceList from './InvoiceList';

export default function PortalInvoices() {
  const [invoices, setInvoices] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    portalApi.fetchInvoices()
      .then((data) => { if (!cancelled) setInvoices(data.data || []); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="portal-dashboard">
      <SEO title="My Invoices" description="Your Unique Building Contractors invoices." noindex />
      <h1>My invoices</h1>
      <p className="portal-dashboard-sub">Review your issued invoices and current balances.</p>
      {error && <p className="portal-dashboard-error"><AlertCircle size={15} /> {error}</p>}
      {!invoices && !error && <div className="portal-dashboard-loading">Loading your invoices…</div>}
      {invoices && <InvoiceList invoices={invoices} showProject />}
    </div>
  );
}

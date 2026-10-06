import { ExternalLink, FileText } from 'lucide-react';
import './PortalInvoices.css';

const LABELS = {
  sent: 'Sent', viewed: 'Viewed', approved: 'Approved', paid: 'Paid', cancelled: 'Cancelled',
};

const money = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD',
}).format(Number(value || 0));

const date = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString() : '—';

export default function InvoiceList({ invoices, showProject = false }) {
  if (!invoices.length) {
    return <p className="portal-empty-hint">No invoices are available for this {showProject ? 'account' : 'project'} yet.</p>;
  }

  return (
    <div className="portal-invoice-list">
      {invoices.map((invoice) => (
        <article className="portal-invoice-card" key={invoice.id}>
          <div className="portal-invoice-head">
            <div>
              <p className="portal-invoice-number"><FileText size={16} /> {invoice.invoice_number}</p>
              {showProject && invoice.project && <p className="portal-invoice-project">{invoice.project.name}</p>}
            </div>
            <span className={`portal-contract-status status-${invoice.is_overdue ? 'cancelled' : invoice.status}`}>
              {invoice.is_overdue ? 'Overdue' : (LABELS[invoice.status] || invoice.status)}
            </span>
          </div>

          <div className="portal-invoice-summary">
            <span>Issued <strong>{date(invoice.issue_date)}</strong></span>
            <span>Due <strong>{date(invoice.due_date)}</strong></span>
            <span>Total <strong>{money(invoice.total)}</strong></span>
            <span>Balance <strong>{money(invoice.balance_due)}</strong></span>
          </div>

          {!!invoice.items?.length && (
            <ul className="portal-invoice-items">
              {invoice.items.map((item) => (
                <li key={item.id}><span>{item.description}</span><strong>{money(item.total)}</strong></li>
              ))}
            </ul>
          )}

          {invoice.notes && <p className="portal-invoice-notes">{invoice.notes}</p>}
          <a className="portal-invoice-open" href={invoice.public_url} target="_blank" rel="noreferrer">
            Open printable invoice <ExternalLink size={14} />
          </a>
        </article>
      ))}
    </div>
  );
}

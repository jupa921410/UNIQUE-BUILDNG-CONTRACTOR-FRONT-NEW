import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileSignature } from 'lucide-react';
import * as portalApi from '../../../../services/portalApi';
import SignaturePad from '../../../../components/SignaturePad/SignaturePad';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[char]));

const money = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD',
}).format(Number(value || 0));

function openPrintableContract(quote, project) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const items = quote.items.map((item) => `
    <tr>
      <td>${escapeHtml(item.description)}${item.is_optional ? ' <small>(Optional)</small>' : ''}</td>
      <td class="right">${escapeHtml(item.quantity)}</td>
      ${quote.show_item_prices ? `<td class="right">${money(item.total)}</td>` : ''}
    </tr>`).join('');
  const signature = quote.signature_data
    ? `<img class="signature" src="${quote.signature_data}" alt="Client signature">`
    : '';
  const signedAt = quote.responded_at ? new Date(quote.responded_at).toLocaleString() : '';

  printWindow.document.write(`<!doctype html>
    <html lang="en"><head><meta charset="utf-8"><title>Contract ${escapeHtml(quote.quote_number)}</title>
    <style>
      @page { margin: 18mm; } * { box-sizing: border-box; } body { color:#172033; font: 12px Arial, sans-serif; line-height:1.5; }
      header { border-bottom:3px solid #8cb63c; padding-bottom:16px; margin-bottom:22px; } h1 { margin:0 0 4px; font-size:25px; } h2 { font-size:16px; margin:28px 0 10px; }
      .muted { color:#64748b; } .meta { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:18px 0; } .box { border:1px solid #e5e7eb; border-radius:6px; padding:12px; }
      table { width:100%; border-collapse:collapse; } th { background:#f8fafc; text-align:left; font-size:10px; text-transform:uppercase; padding:8px; } td { border-bottom:1px solid #e5e7eb; padding:9px 8px; vertical-align:top; } .right { text-align:right; }
      .total { margin-top:14px; text-align:right; font-size:15px; font-weight:800; } .contract { margin-top:22px; padding:16px; border:1px solid #e5e7eb; border-radius:6px; } .signature { display:block; max-height:75px; max-width:220px; margin-top:8px; }
      small { color:#64748b; } @media print { body { font-size:11px; } }
    </style></head><body>
      <header><h1>Contract / Proposal</h1><strong>Unique Building Contractors</strong><div class="muted">${escapeHtml(quote.quote_number)} · ${escapeHtml(project.name)}</div></header>
      <section class="meta"><div class="box"><strong>Project</strong><br>${escapeHtml(project.name)}${project.project_number ? `<br><span class="muted">#${escapeHtml(project.project_number)}</span>` : ''}</div>
      <div class="box"><strong>Status</strong><br>${escapeHtml(quote.status)}${quote.valid_until ? `<br><span class="muted">Valid until ${escapeHtml(quote.valid_until)}</span>` : ''}</div></section>
      <h2>Scope & items</h2><table><thead><tr><th>Description</th><th class="right">Qty</th>${quote.show_item_prices ? '<th class="right">Total</th>' : ''}</tr></thead><tbody>${items}</tbody></table>
      ${quote.show_item_prices ? `<p class="total">Total: ${money(quote.accepted_total ?? quote.total)}</p>` : ''}
      ${quote.rendered_contract ? `<section class="contract">${quote.rendered_contract}</section>` : ''}
      ${quote.terms ? `<section class="contract"><strong>Terms</strong><br>${escapeHtml(quote.terms)}</section>` : ''}
      ${quote.responded_name ? `<section class="contract"><strong>Digital signature</strong><br>Signed by ${escapeHtml(quote.responded_name)}${signedAt ? ` on ${escapeHtml(signedAt)}` : ''}${signature}</section>` : ''}
    </body></html>`);
  printWindow.document.close();
  window.setTimeout(() => printWindow.print(), 250);
  return true;
}

export default function ContractTab({ project }) {
  const [quote, setQuote] = useState(undefined); // undefined = loading, null = none
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [respondedName, setRespondedName] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [signature, setSignature] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [printError, setPrintError] = useState('');

  useEffect(() => {
    portalApi.fetchContract(project.id)
      .then((data) => {
        setQuote(data.quote);
        if (data.quote) {
          const initial = {};
          data.quote.items.forEach((i) => { if (i.is_optional) initial[i.id] = Boolean(i.client_selected); });
          setSelected(initial);
        }
      })
      .catch((err) => setError(err.message));
  }, [project.id]);

  if (quote === undefined && !error) return <p className="portal-empty-hint">Loading contract…</p>;
  if (error) return <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>;
  if (!quote) return <p className="portal-empty-hint">No contract or proposal is available for signature yet.</p>;

  const optionalItems = quote.items.filter((i) => i.is_optional);
  const requiredItems = quote.items.filter((i) => !i.is_optional);
  const isSigned = quote.status === 'accepted' || quote.status === 'rejected';

  const submit = async (action) => {
    if (action === 'accept' && (!respondedName.trim() || !agreement || !signature)) {
      setError('Please type your full name, sign, and confirm the agreement checkbox.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([id]) => Number(id));
      const data = await portalApi.signContract(project.id, {
        action,
        responded_name: respondedName,
        selected_items: selectedIds,
        signature_data: action === 'accept' ? signature : undefined,
        agreement: action === 'accept' ? 1 : undefined,
      });
      setQuote(data.quote);
    } catch (err) {
      setError(err.message || 'Could not submit your response.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPdf = () => {
    setPrintError('');
    if (!openPrintableContract(quote, project)) {
      setPrintError('Your browser blocked the print window. Please allow pop-ups for this site and try again.');
    }
  };

  return (
    <div>
      <span className={`portal-contract-status status-${quote.status}`}>{quote.status}</span>
      <h3 className="portal-section-title">{quote.quote_number}</h3>
      <div className="portal-contract-actions">
        <button type="button" className="btn btn-secondary" onClick={downloadPdf}>
          <Download size={15} /> Save / Print PDF
        </button>
        <span>Select “Save as PDF” in the print window.</span>
      </div>
      {printError && <p className="portal-inline-error"><AlertCircle size={15} /> {printError}</p>}

      {!!requiredItems.length && (
        <table className="portal-contract-items">
          <thead><tr><th>Description</th><th>Qty</th>{quote.show_item_prices && <th>Total</th>}</tr></thead>
          <tbody>
            {requiredItems.map((i) => (
              <tr key={i.id}><td>{i.description}</td><td>{i.quantity}</td>{quote.show_item_prices && <td>${Number(i.total).toFixed(2)}</td>}</tr>
            ))}
          </tbody>
        </table>
      )}

      {!!optionalItems.length && (
        <>
          <p style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '8px' }}>Optional items — select what you&apos;d like to include:</p>
          <table className="portal-contract-items">
            <tbody>
              {optionalItems.map((i) => (
                <tr key={i.id}>
                  <td style={{ width: 30 }}>
                    <input
                      type="checkbox"
                      disabled={isSigned}
                      checked={Boolean(selected[i.id])}
                      onChange={(e) => setSelected({ ...selected, [i.id]: e.target.checked })}
                    />
                  </td>
                  <td>{i.description}</td>
                  {quote.show_item_prices && <td>${Number(i.total).toFixed(2)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {quote.show_item_prices && (
        <p style={{ textAlign: 'right', fontWeight: 800, marginBottom: 20 }}>
          Total: ${Number(quote.accepted_total ?? quote.total).toFixed(2)}
        </p>
      )}

      {quote.rendered_contract && (
        <div className="portal-contract-body" dangerouslySetInnerHTML={{ __html: quote.rendered_contract }} />
      )}

      {isSigned ? (
        <p className="portal-inline-success">
          <CheckCircle2 size={15} />
          {quote.status === 'accepted' ? 'Accepted' : 'Declined'} by {quote.responded_name} on {new Date(quote.responded_at).toLocaleString()}
        </p>
      ) : (
        <div className="portal-sign-block">
          <label>Type your full legal name</label>
          <input type="text" value={respondedName} onChange={(e) => setRespondedName(e.target.value)} placeholder="Full name" />

          <label>Signature</label>
          <SignaturePad onChange={setSignature} />

          <label className="portal-agreement-check">
            <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
            I have reviewed this contract/proposal and agree to its terms.
          </label>

          {error && <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" disabled={submitting} onClick={() => submit('accept')}>
              <FileSignature size={15} /> {submitting ? 'Submitting…' : 'Sign & Accept'}
            </button>
            <button className="btn btn-secondary" disabled={submitting} onClick={() => submit('reject')}>Decline</button>
          </div>
        </div>
      )}
    </div>
  );
}

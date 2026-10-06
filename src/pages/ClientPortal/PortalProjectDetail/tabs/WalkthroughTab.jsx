import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ClipboardCheck } from 'lucide-react';
import * as portalApi from '../../../../services/portalApi';
import SignaturePad from '../../../../components/SignaturePad/SignaturePad';

export default function WalkthroughTab({ project }) {
  const [checklist, setChecklist] = useState(undefined);
  const [error, setError] = useState('');
  const [respondedName, setRespondedName] = useState('');
  const [signature, setSignature] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    portalApi.fetchWalkthrough(project.id)
      .then((data) => setChecklist(data.checklist))
      .catch((err) => setError(err.message));
  }, [project.id]);

  const grouped = useMemo(() => {
    if (!checklist) return [];
    const byArea = {};
    checklist.items.forEach((item) => {
      const key = item.area || 'General';
      if (!byArea[key]) byArea[key] = [];
      byArea[key].push(item);
    });
    return Object.entries(byArea);
  }, [checklist]);

  if (checklist === undefined && !error) return <p className="portal-empty-hint">Loading walkthrough checklist…</p>;
  if (error && !checklist) return <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>;
  if (!checklist) return <p className="portal-empty-hint">No walkthrough checklist has been created for this project yet.</p>;

  const isSigned = checklist.status === 'completed';
  const allChecked = checklist.items.every((i) => i.is_checked);

  const toggleItem = async (item, isChecked) => {
    // optimistic update
    setChecklist({ ...checklist, items: checklist.items.map((i) => (i.id === item.id ? { ...i, is_checked: isChecked } : i)) });
    try {
      await portalApi.updateWalkthroughItem(item.id, { is_checked: isChecked });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateNote = async (item, note) => {
    setChecklist({ ...checklist, items: checklist.items.map((i) => (i.id === item.id ? { ...i, client_notes: note } : i)) });
  };

  const saveNote = async (item) => {
    try {
      await portalApi.updateWalkthroughItem(item.id, { is_checked: item.is_checked, client_notes: item.client_notes });
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = async () => {
    if (!respondedName.trim() || !signature) {
      setError('Please type your full name and sign before completing the walkthrough.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = await portalApi.signWalkthrough(project.id, { responded_name: respondedName, signature_data: signature });
      setChecklist(data.checklist);
    } catch (err) {
      setError(err.message || 'Could not submit sign-off.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="portal-section-title">{checklist.title}</h3>

      {grouped.map(([area, items]) => (
        <div key={area} className="portal-checklist-area">
          <p className="portal-checklist-area-title">{area}</p>
          {items.map((item) => (
            <div key={item.id} className="portal-checklist-item">
              <input
                type="checkbox"
                disabled={isSigned}
                checked={item.is_checked}
                onChange={(e) => toggleItem(item, e.target.checked)}
              />
              <div style={{ flex: 1 }}>
                <p className="portal-checklist-item-label">{item.label}</p>
                {item.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '2px 0 0' }}>{item.description}</p>}
                {!isSigned && (
                  <input
                    className="portal-checklist-item-note"
                    placeholder="Add a note (optional)"
                    value={item.client_notes || ''}
                    onChange={(e) => updateNote(item, e.target.value)}
                    onBlur={() => saveNote(item)}
                  />
                )}
                {isSigned && item.client_notes && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Note: {item.client_notes}</p>}
              </div>
            </div>
          ))}
        </div>
      ))}

      {isSigned ? (
        <p className="portal-inline-success">
          <CheckCircle2 size={15} /> Signed off by {checklist.client_responded_name} on {new Date(checklist.completed_at).toLocaleString()}
        </p>
      ) : (
        <div className="portal-sign-block">
          {!allChecked && <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 12 }}>Check off every item before signing.</p>}
          <label>Type your full legal name</label>
          <input type="text" value={respondedName} onChange={(e) => setRespondedName(e.target.value)} placeholder="Full name" />
          <label>Signature</label>
          <SignaturePad onChange={setSignature} />
          {error && <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>}
          <button className="btn btn-primary" disabled={submitting || !allChecked} onClick={submit}>
            <ClipboardCheck size={15} /> {submitting ? 'Submitting…' : 'Sign Off Walkthrough'}
          </button>
        </div>
      )}
    </div>
  );
}

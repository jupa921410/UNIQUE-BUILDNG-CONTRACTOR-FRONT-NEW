import ResponsiveImage from '../../../../components/ResponsiveImage';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Palette } from 'lucide-react';
import * as portalApi from '../../../../services/portalApi';
import SignaturePad from '../../../../components/SignaturePad/SignaturePad';

export default function SelectionsTab({ project }) {
  const [areas, setAreas] = useState(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    portalApi.fetchSelections(project.id)
      .then((data) => setAreas(data.areas))
      .catch((err) => setError(err.message));
  }, [project.id]);

  if (areas === undefined && !error) return <p className="portal-empty-hint">Loading color &amp; finish selections…</p>;
  if (error && !areas) return <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>;
  if (!areas?.length) return <p className="portal-empty-hint">No selection areas have been set up for this project yet.</p>;

  const updateArea = (updatedArea) => setAreas(areas.map((a) => (a.id === updatedArea.id ? updatedArea : a)));

  return (
    <div>
      <h3 className="portal-section-title">Color &amp; Finish Selections</h3>
      {areas.map((area) => (
        <SelectionAreaCard key={area.id} area={area} onUpdate={updateArea} />
      ))}
    </div>
  );
}

function SelectionAreaCard({ area, onUpdate }) {
  const [items, setItems] = useState(area.items);
  const [respondedName, setRespondedName] = useState('');
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isConfirmed = area.status === 'confirmed';

  const setItem = (id, patch) => setItems(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const saveItem = async (item) => {
    try {
      await portalApi.updateSelectionItem(item.id, {
        selection_value: item.selection_value || '',
        color_hex: item.color_hex || '',
        client_notes: item.client_notes || '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadImage = async (item, file) => {
    try {
      const data = await portalApi.updateSelectionItem(item.id, { reference_image: file });
      setItem(item.id, { reference_image_url: data.item.reference_image_url });
    } catch (err) {
      setError(err.message);
    }
  };

  const confirm = async () => {
    if (!respondedName.trim() || !signature) {
      setError('Please type your full name and sign to confirm these selections.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = await portalApi.confirmSelectionArea(area.id, { responded_name: respondedName, signature_data: signature });
      onUpdate(data.area);
    } catch (err) {
      setError(err.message || 'Could not confirm this area.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-selection-card">
      <div className="portal-selection-card-head">
        <h4>{area.name}</h4>
        <span className={`portal-contract-status status-${isConfirmed ? 'accepted' : 'sent'}`}>{area.status}</span>
      </div>

      {items.map((item) => (
        <div key={item.id} className="portal-selection-row">
          <label>{item.category}</label>
          {isConfirmed ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.color_hex && <span style={{ width: 16, height: 16, borderRadius: '50%', background: item.color_hex, border: '1px solid #ccc' }} />}
              {item.selection_value || <em style={{ color: 'var(--text-light)' }}>—</em>}
            </span>
          ) : (
            <input
              type="text"
              placeholder="Your selection (product/color name)"
              value={item.selection_value || ''}
              onChange={(e) => setItem(item.id, { selection_value: e.target.value })}
              onBlur={() => saveItem(items.find((i) => i.id === item.id))}
            />
          )}
          {!isConfirmed && (
            <input
              type="color"
              value={item.color_hex || '#ffffff'}
              onChange={(e) => { setItem(item.id, { color_hex: e.target.value }); }}
              onBlur={() => saveItem(items.find((i) => i.id === item.id))}
              title="Optional exact color"
            />
          )}
          {item.reference_image_url && <ResponsiveImage src={item.reference_image_url} alt="" className="portal-selection-thumb" />}
          {!isConfirmed && (
            <label style={{ fontSize: '0.72rem', color: 'var(--green-dark)', cursor: 'pointer', fontWeight: 700 }}>
              +photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && uploadImage(item, e.target.files[0])} />
            </label>
          )}
        </div>
      ))}

      {isConfirmed ? (
        <p className="portal-inline-success" style={{ marginTop: 14 }}>
          <CheckCircle2 size={15} /> Confirmed by {area.client_responded_name} on {new Date(area.confirmed_at).toLocaleString()}
        </p>
      ) : (
        <div className="portal-sign-block">
          <label>Type your full legal name</label>
          <input type="text" value={respondedName} onChange={(e) => setRespondedName(e.target.value)} placeholder="Full name" />
          <label>Signature</label>
          <SignaturePad onChange={setSignature} />
          {error && <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>}
          <button className="btn btn-primary" disabled={submitting} onClick={confirm}>
            <Palette size={15} /> {submitting ? 'Confirming…' : `Confirm "${area.name}" Selections`}
          </button>
        </div>
      )}
    </div>
  );
}

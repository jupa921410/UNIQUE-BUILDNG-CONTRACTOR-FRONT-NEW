import { useState } from 'react';
import './MaterialSelectionForm.css';

export default function MaterialSelectionForm({ selection, answers, onChange, disabled, references = {} }) {
    const [active, setActive] = useState(selection.form_schema[0]?.id);
    const section = selection.form_schema.find(s => s.id === active) || selection.form_schema[0];
    const fields = selection.form_schema.flatMap(s => s.groups.flatMap(g => g.fields));
    const filled = fields.filter(f => answers[f.key] !== '' && answers[f.key] != null && answers[f.key] !== false).length;
    const labels = ['2 Panel Square', '2 Panel Round', '6 Panel', 'Flat', 'Louver'];
    return (
        <div className="material-form">
            <p className="material-notice">* Subject to additional charge. Unselected items will be finalized with your Project Manager.</p>
            <p className="material-progress">{filled} fields filled · {selection.form_schema.length} sections · You can save and return later.</p>
            <div className="material-layout">
                <nav className="material-nav" aria-label="Material selection sections">
                    {selection.form_schema.map(s => <button type="button" key={s.id} onClick={() => setActive(s.id)} aria-current={active === s.id ? 'step' : undefined}>{s.title}</button>)}
                </nav>
                <div className="material-section">
                    <h2>{section.title}</h2>
                    {section.note && <p>{section.note}</p>}
                    {references[section.id] && <details className="material-reference">
                        <summary>View profile / style reference</summary>
                        <div className={section.id === 'doors' ? 'material-door-images' : ''}>
                            {references[section.id].map((url, i) => <figure key={url}>
                                <a href={url} target="_blank" rel="noreferrer"><img src={url} alt={section.id === 'doors' ? labels[i] : section.title + ' reference'} /></a>
                                {section.id === 'doors' && <figcaption>{labels[i]}</figcaption>}
                            </figure>)}
                        </div>
                    </details>}
                    {section.groups.map((g, index) => <fieldset key={section.id + index} disabled={disabled} className="material-group">
                        <legend>{g.title}</legend>
                        <div className="material-fields">
                            {g.fields.map(field => <label key={field.key} className={field.type === 'checkbox' ? 'material-checkbox' : field.type === 'textarea' ? 'material-wide' : ''}>
                                {field.type === 'checkbox' ? <>
                                    <input type="checkbox" checked={Boolean(answers[field.key])} onChange={e => onChange(field.key, e.target.checked)} />
                                    <span>{field.label}</span>
                                </> : <>
                                    <span>{field.label}</span>
                                    {field.type === 'textarea'
                                        ? <textarea rows={3} maxLength={5000} value={answers[field.key] ?? ''} onChange={e => onChange(field.key, e.target.value)} />
                                        : <input type="text" maxLength={255} value={answers[field.key] ?? ''} onChange={e => onChange(field.key, e.target.value)} />}
                                </>}
                            </label>)}
                        </div>
                    </fieldset>)}
                    <div className="material-actions">
                        <button type="button" disabled={selection.form_schema.indexOf(section) === 0} onClick={() => setActive(selection.form_schema[selection.form_schema.indexOf(section)-1].id)}>Previous section</button>
                        <button type="button" disabled={selection.form_schema.indexOf(section) === selection.form_schema.length-1} onClick={() => setActive(selection.form_schema[selection.form_schema.indexOf(section)+1].id)}>Next section</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MaterialSignatures({ selection }) {
    return <div className="material-signatures">
        {selection.client_signed_at && <section><h3>Client signature</h3><p>{selection.client_name} · {new Date(selection.client_signed_at).toLocaleString()}</p>
            <img src={selection.client_signature} alt="Client signature" /></section>}
        {selection.staff_signed_at && <section><h3>UBC electronic signature</h3><p className="material-typed-signature">{selection.staff_name}</p>
            <p>{selection.staff_title} · {new Date(selection.staff_signed_at).toLocaleString()}</p></section>}
        {selection.status === 'submitted' && <p>Client signed. Awaiting UBC countersignature.</p>}
        {selection.status === 'confirmed' && <p>Confirmed by both parties. Changes must be recorded in a new change order.</p>}
    </div>;
}

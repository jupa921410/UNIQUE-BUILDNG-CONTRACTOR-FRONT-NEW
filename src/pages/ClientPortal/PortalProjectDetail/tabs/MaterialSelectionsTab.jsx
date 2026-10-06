import { useEffect, useState } from 'react';
import * as portalApi from '../../../../services/portalApi';
import MaterialSelectionForm, { MaterialSignatures } from '../../../../components/MaterialSelection/MaterialSelectionForm';
import SignaturePad from '../../../../components/SignaturePad/SignaturePad';

const CATEGORY_LABELS = {
    finishes: 'Interior Finishes',
    flooring: 'Flooring & Tile',
    windows_doors: 'Windows & Exterior Doors',
    plumbing: 'Plumbing',
    kitchen: 'Kitchen',
    bathroom: 'Bathroom',
    countertops: 'Countertops',
    lighting: 'Lighting & Electrical',
    systems: 'Systems & Safety',
};

export default function MaterialSelectionsTab({ project }) {
    const [records,setRecords] = useState(null);
    const [selected,setSelected] = useState(null);
    const [error,setError] = useState('');
    const [revision,setRevision] = useState(0);
    useEffect(() => {
        let cancelled = false;
        portalApi.fetchMaterialSelections(project.id).then(data => { if(!cancelled) setRecords(data.data); }).catch(e=>{ if(!cancelled) setError(e.message); });
        return ()=>{ cancelled=true; };
    },[project.id,revision]);
    if(selected) return <SelectionEditor key={selected} project={project} id={selected} onBack={()=>{setSelected(null);setRevision(v=>v+1);}} />;
    return <div className="material-page">
        <h2>Material Selection</h2>
        <p>Choose the finishes and materials for your project, one category at a time. Save your progress and return any time before signing.</p>
        {error && <p role="alert" className="material-error">{error}</p>}
        {!records && !error && <p role="status">Loading material selections…</p>}
        {records?.length===0 && <p>No material selection forms have been prepared yet. Contact your Project Manager.</p>}
        {records?.map(s=><section key={s.id} className="material-group">
            <h3>{s.title}</h3><p>{s.kind==='selection' && s.category && CATEGORY_LABELS[s.category] ? CATEGORY_LABELS[s.category]+' · ' : ''}{s.status==='submitted'?'Signed — awaiting UBC':s.status==='confirmed'?'Confirmed by both parties':'Draft — ready to complete'}{s.parent_id ? ' · Change order for #'+s.parent_id : ''}</p>
            <button type="button" className="material-button" onClick={()=>setSelected(s.id)}>{s.status==='draft'?'Complete form':'View selections'}</button>
        </section>)}
    </div>;
}

function SelectionEditor({ project,id,onBack }) {
    const [record,setRecord]=useState(null);
    const [references,setReferences]=useState({});
    const [answers,setAnswers]=useState({});
    const [dirty,setDirty]=useState(false);
    const [error,setError]=useState('');
    const [message,setMessage]=useState('');
    const [busy,setBusy]=useState(false);
    const [name,setName]=useState('');
    const [signature,setSignature]=useState(null);
    const [agreement,setAgreement]=useState(false);
    const [conflict,setConflict]=useState(false);
    useEffect(()=>{
        let cancelled=false;
        portalApi.fetchMaterialSelection(project.id,id).then(data=>{
            if(!cancelled){setRecord(data.selection);setAnswers(data.selection.answers||{});setReferences(data.references);}
        }).catch(e=>{if(!cancelled)setError(e.message);});
        return ()=>{cancelled=true;};
    },[project.id,id]);
    useEffect(()=>{
        const warn=e=>{if(dirty){e.preventDefault();e.returnValue='';}};
        window.addEventListener('beforeunload',warn);
        return ()=>window.removeEventListener('beforeunload',warn);
    },[dirty]);
    const back=()=>{if(!dirty||confirm('Leave without saving your changes?'))onBack();};
    const save=async(sign=false)=>{
        if(sign && (!name.trim()||!signature||!agreement)){setError('Enter your full name, draw your signature and confirm the acknowledgment.');return;}
        if(sign && !confirm('Sign and send these selections to UBC? The signed form will be locked.'))return;
        setBusy(true);setError('');setMessage('');
        try{
            const payload={answers,version:record.version};
            const data=sign
                ? await portalApi.signMaterialSelection(project.id,id,{...payload,name,signature,agreement})
                : await portalApi.saveMaterialSelection(project.id,id,payload);
            setRecord(data.selection);setAnswers(data.selection.answers);setDirty(false);setMessage(data.message);
        }catch(e){setError(e.message);if(e.status===409)setConflict(true);}
        finally{setBusy(false);}
    };
    if(!record)return <div><button className="material-button" onClick={back}>← All forms</button><p role={error?'alert':'status'}>{error||'Loading form…'}</p></div>;
    return <div className="material-page">
        <button type="button" className="material-button" disabled={busy} onClick={back}>← All forms</button>
        <h1>{record.title}</h1>
        <p>{project.name} · Form #{record.id} · {record.status}</p>
        {error&&<p role="alert" className="material-error">{error}</p>}
        {conflict&&<p>Please copy any unsaved entries you need, then return to the form list and reopen this form to load the latest version.</p>}
        {message&&<p role="status" className="material-success">{message}</p>}
        <MaterialSelectionForm selection={record} answers={answers} references={references} disabled={busy||record.status!=='draft'||conflict}
            onChange={(key,value)=>{setAnswers(v=>({...v,[key]:value}));setDirty(true);setMessage('');}} />
        {record.status==='draft'&&<div className="material-actions">
            <button type="button" className="material-primary" disabled={busy||conflict} onClick={()=>save()}>{busy?'Saving…':'Save draft'}</button><span>{dirty?'Unsaved changes':'Saved'}</span>
        </div>}
        <section className="material-acknowledgment">
            <h3>{record.kind==='change_order'?'Change order approval':'Client acknowledgment of selections'}</h3>
            <ol>{record.acknowledgment.map((text,i)=><li key={i}>{text}</li>)}</ol>
            {record.status==='draft'&&<fieldset disabled={busy||conflict}>
                <label>Full name<input className="material-input" maxLength={255} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" /></label>
                <p>Draw your signature</p><SignaturePad onChange={setSignature} />
                <label><input type="checkbox" checked={agreement} onChange={e=>setAgreement(e.target.checked)} /> I have reviewed all sections and agree to the acknowledgment above.</label>
                <div className="material-actions"><button type="button" className="material-primary" disabled={busy||conflict} onClick={()=>save(true)}>Sign & send to UBC</button></div>
            </fieldset>}
        </section>
        <MaterialSignatures selection={record} />
    </div>;
}

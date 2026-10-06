import { useRef, useState } from 'react';
import { UploadCloud, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import * as portalApi from '../../../../services/portalApi';

const fmtSize = (bytes) => {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** unit).toFixed(unit ? 1 : 0)} ${units[unit]}`;
};

export default function FilesTab({ project, onChanged }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const upload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setStatus('uploading');
    setError('');
    try {
      await portalApi.uploadDocuments(project.id, files);
      setStatus('done');
      await onChanged();
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Upload failed. Please try again.');
    }
  };

  const remove = async (doc) => {
    if (!confirm(`Delete "${doc.title || doc.original_name}"? This can't be undone.`)) return;
    try {
      await portalApi.deleteDocument(doc.id);
      await onChanged();
    } catch (err) {
      setError(err.message || 'Could not delete this file.');
    }
  };

  const download = async (doc) => {
    setDownloadingId(doc.id);
    setError('');
    try {
      await portalApi.downloadDocument(doc);
    } catch (err) {
      setError(err.message || 'Could not download this file.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <h3 className="portal-section-title">Files &amp; Photos</h3>
      <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '-6px', marginBottom: '18px' }}>
        Share documents or photos with your project team — inspection reports, HOA approvals, reference photos, anything they should see.
      </p>

      <div
        className={`portal-dropzone ${dragOver ? 'is-dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
      >
        <UploadCloud size={26} />
        <p style={{ margin: '8px 0 0', fontWeight: 700, fontSize: '0.86rem' }}>Click to upload or drag files here</p>
        <p className="portal-dropzone-files">PDF, JPG, PNG, WEBP, HEIC, DOC — up to 20 MB each, 10 files at a time</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {status === 'uploading' && <p className="portal-inline-success"><CheckCircle2 size={15} /> Uploading…</p>}
      {status === 'done' && <p className="portal-inline-success"><CheckCircle2 size={15} /> Uploaded successfully.</p>}
      {status === 'error' && <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>}

      {!project.documents?.length ? (
        <p className="portal-empty-hint">No files yet.</p>
      ) : (
        <ul className="portal-file-list">
          {project.documents.map((doc) => (
            <li key={doc.id} className="portal-file-item">
              <span className="portal-file-icon">{doc.extension || 'file'}</span>
              <div>
                <p className="portal-file-name">{doc.title || doc.original_name}</p>
                <p className="portal-file-meta">{fmtSize(doc.size)} · {new Date(doc.created_at).toLocaleDateString()}</p>
              </div>
              <div className="portal-file-actions">
                <button type="button" onClick={() => download(doc)} disabled={downloadingId === doc.id}>
                  {downloadingId === doc.id ? 'Downloading…' : 'Download'}
                </button>
                {doc.uploaded_by_client_id && <button onClick={() => remove(doc)}><Trash2 size={13} /></button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

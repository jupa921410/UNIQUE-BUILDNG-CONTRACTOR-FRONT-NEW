import { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, AlertCircle } from 'lucide-react';
import * as portalApi from '../../../../services/portalApi';

const POLL_INTERVAL_MS = 8000;

export default function ChatTab({ project }) {
  const [messages, setMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const lastIdRef = useRef(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function poll() {
      try {
        const data = await portalApi.fetchMessages(project.id, lastIdRef.current || undefined);
        if (cancelled) return;
        if (data.messages.length) {
          setMessages((prev) => [...prev, ...data.messages]);
          lastIdRef.current = data.messages[data.messages.length - 1].id;
          portalApi.markMessagesRead(project.id, lastIdRef.current).catch(() => {});
        }
        setLoaded(true);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [project.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim() && !attachment) return;
    setSending(true);
    setError('');
    try {
      const data = await portalApi.sendMessage(project.id, { body, attachment });
      setMessages((prev) => [...prev, data.message]);
      lastIdRef.current = data.message.id;
      setBody('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Could not send your message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="portal-chat">
      <div className="portal-chat-messages" ref={listRef}>
        {!loaded && !messages.length && <p className="portal-empty-hint">Loading conversation…</p>}
        {loaded && !messages.length && <p className="portal-empty-hint">No messages yet — say hello to your project team!</p>}
        {messages.map((m) => (
          <div key={m.id} className={`portal-chat-bubble from-${m.sender_type}`}>
            <p className="portal-chat-meta">{m.sender_name} · {new Date(m.created_at).toLocaleString()}</p>
            {m.body && <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.body}</p>}
            {m.attachment_url && (
              <a href={m.attachment_url} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 4, fontSize: '0.78rem', fontWeight: 700 }}>
                📎 {m.attachment_name}
              </a>
            )}
          </div>
        ))}
      </div>

      {error && <p className="portal-inline-error"><AlertCircle size={15} /> {error}</p>}

      <form className="portal-chat-form" onSubmit={submit}>
        <label className="portal-chat-attach" title="Attach a file">
          <Paperclip size={17} style={{ cursor: 'pointer', color: 'var(--text-light)' }} />
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setAttachment(e.target.files[0] || null)}
          />
        </label>
        <textarea
          rows={1}
          placeholder="Message your project team…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e); } }}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || (!body.trim() && !attachment)}>
          <Send size={15} />
        </button>
      </form>
      {attachment && <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 6 }}>Attached: {attachment.name}</p>}
    </div>
  );
}

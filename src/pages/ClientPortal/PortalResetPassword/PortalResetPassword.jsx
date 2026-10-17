import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { KeyRound, AlertCircle } from 'lucide-react';
import { usePortalAuth } from '../../../context/PortalAuthContext';
import SEO from '../../../components/SEO/SEO';
import BrandLogo from '../../../components/BrandLogo/BrandLogo';
import '../PortalLogin/PortalAuth.css';

export default function PortalResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const { completePasswordSetup } = usePortalAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const email = searchParams.get('email') || '';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setError('This link is missing your email address. Please request a new one.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await completePasswordSetup({ token, email, ...form });
      navigate('/portal', { replace: true });
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Could not set your password. The link may have expired.');
    }
  };

  return (
    <div className="portal-auth-page">
      <SEO title="Set Your Password" description="Set your Unique Building Contractors client portal password." noindex />
      <div className="portal-auth-card">
        <div className="portal-auth-brand"><BrandLogo /></div>
        <h1>Set Your Password</h1>
        <p className="portal-auth-sub">Choose a password to activate your client portal account{email ? ` for ${email}` : ''}.</p>

        <form onSubmit={handleSubmit} className="portal-auth-form">
          <label>
            New password
            <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange} autoComplete="new-password" />
          </label>
          <label>
            Confirm password
            <input type="password" name="password_confirmation" required minLength={8} value={form.password_confirmation} onChange={handleChange} autoComplete="new-password" />
          </label>

          {status === 'error' && <p className="portal-auth-error"><AlertCircle size={15} /> {error}</p>}

          <button type="submit" className="btn btn-primary portal-auth-submit" disabled={status === 'sending'}>
            <KeyRound size={16} />
            {status === 'sending' ? 'Saving…' : 'Set password & log in'}
          </button>
        </form>

        <Link to="/portal/login" className="portal-auth-link">← Back to login</Link>
      </div>
    </div>
  );
}

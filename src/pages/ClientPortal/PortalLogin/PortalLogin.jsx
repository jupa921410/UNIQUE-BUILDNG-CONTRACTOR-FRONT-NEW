import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { usePortalAuth } from '../../../context/PortalAuthContext';
import SEO from '../../../components/SEO/SEO';
import logo from '../../../assets/1x/logo.png';
import './PortalAuth.css';

export default function PortalLogin() {
  const { login } = usePortalAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from || '/portal';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Could not log in. Please try again.');
    }
  };

  return (
    <div className="portal-auth-page">
      <SEO title="Client Login" description="Log in to your Unique Building Contractors client portal." noindex />
      <div className="portal-auth-card">
        <img src={logo} alt="Unique Building Contractors" className="portal-auth-logo" />
        <h1>Client Portal</h1>
        <p className="portal-auth-sub">Log in to track your project, sign documents, choose finishes and chat with your team.</p>

        <form onSubmit={handleSubmit} className="portal-auth-form">
          <label>
            Email
            <input type="email" name="email" required value={form.email} onChange={handleChange} autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" name="password" required value={form.password} onChange={handleChange} autoComplete="current-password" />
          </label>

          {status === 'error' && (
            <p className="portal-auth-error"><AlertCircle size={15} /> {error}</p>
          )}

          <button type="submit" className="btn btn-primary portal-auth-submit" disabled={status === 'sending'}>
            <LogIn size={16} />
            {status === 'sending' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <Link to="/portal/forgot-password" className="portal-auth-link">Forgot your password?</Link>
        <Link to="/" className="portal-auth-back">← Back to the main site</Link>
      </div>
    </div>
  );
}

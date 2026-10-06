import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as portalApi from '../../../services/portalApi';
import SEO from '../../../components/SEO/SEO';
import logo from '../../../assets/1x/logo.png';
import '../PortalLogin/PortalAuth.css';

export default function PortalForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await portalApi.forgotPassword(email);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Could not send the reset link. Please try again.');
    }
  };

  return (
    <div className="portal-auth-page">
      <SEO title="Reset Password" description="Reset your Unique Building Contractors client portal password." noindex />
      <div className="portal-auth-card">
        <img src={logo} alt="Unique Building Contractors" className="portal-auth-logo" />
        <h1>Reset Password</h1>
        <p className="portal-auth-sub">Enter your account email and we&apos;ll send you a link to set a new password.</p>

        {status === 'sent' ? (
          <p className="portal-auth-success"><CheckCircle2 size={15} /> If that email is registered, a reset link is on its way.</p>
        ) : (
          <form onSubmit={handleSubmit} className="portal-auth-form">
            <label>
              Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            {status === 'error' && <p className="portal-auth-error"><AlertCircle size={15} /> {error}</p>}
            <button type="submit" className="btn btn-primary portal-auth-submit" disabled={status === 'sending'}>
              <Mail size={16} />
              {status === 'sending' ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <Link to="/portal/login" className="portal-auth-link">← Back to login</Link>
      </div>
    </div>
  );
}

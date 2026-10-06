import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePortalAuth } from '../../context/PortalAuthContext';
import logo from '../../assets/1x/logo.png';
import './PortalLayout.css';

export default function PortalLayout({ children }) {
  const { client, logout } = usePortalAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/portal/login', { replace: true });
  };

  return (
    <div className="portal-shell">
      <header className="portal-topbar">
        <Link to="/portal" className="portal-brand">
          <img src={logo} alt="Unique Building Contractors" />
          <span>Client Portal</span>
        </Link>

        <button
          className="portal-menu-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`portal-topbar-actions ${menuOpen ? 'is-open' : ''}`}>
          <Link to="/portal" className="portal-nav-link" onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={16} />
            <span>My Projects</span>
          </Link>
          <Link to="/portal/invoices" className="portal-nav-link" onClick={() => setMenuOpen(false)}>
            <span>My Invoices</span>
          </Link>
          {client && (
            <span className="portal-client-name" title={client.email}>
              {client.full_name || client.first_name}
            </span>
          )}
          <button type="button" className="portal-logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </nav>
      </header>

      <main className="portal-main">{children}</main>

      <footer className="portal-footer">
        <p>&copy; {new Date().getFullYear()} Unique Building Contractors — Client Portal</p>
        <a href="tel:+18135237828">813-523-7828</a>
      </footer>
    </div>
  );
}

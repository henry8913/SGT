import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? { fontWeight: 600, opacity: 1 } : {};

  const navLinks = [
    { to: '/dashboard', label: 'Progetti' },
    { to: '/formule', label: 'Formule' },
    { to: '/settings/profili', label: 'Impostazioni' },
    { to: '/settings/password', label: 'Password' },
    ...(user.is_admin ? [{ to: '/admin/users', label: 'Admin' }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <nav style={{
        background: 'var(--primary)',
        color: '#fff',
        padding: '0 20px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/dashboard" style={{
            color: '#fff', fontWeight: 700, fontSize: 20, textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}>
            SGT
          </Link>
          <div className="hide-mobile" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                fontSize: 13, transition: 'all 0.2s', ...isActive(l.to),
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }} className="hide-mobile">
            {user.username}
          </span>
          <button onClick={handleLogout} className="btn btn-sm" style={{
            background: 'rgba(255,255,255,0.12)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            Esci
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', color: '#fff', fontSize: 24,
              cursor: 'pointer', padding: 4,
              display: 'none',
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          background: 'var(--primary-dark)',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14,
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {user.username}
          </div>
        </div>
      )}

      <main className="container page" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}

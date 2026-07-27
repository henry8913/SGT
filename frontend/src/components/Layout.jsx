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

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Progetti' },
    { to: '/formule', label: 'Formule' },
    { to: '/settings/password', label: 'Password' },
    ...(user.is_admin ? [{ to: '/admin/users', label: 'Admin' }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gray-bg)' }}>
      <nav style={{
        background: '#FFB300',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="" style={{ width: 28, height: 28 }} />
            <span style={{ color: '#1a1a2e', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>SGT</span>
          </Link>
          <div className="hide-mobile" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: isActive(l.to) ? '#1a1a2e' : 'rgba(26,26,46,0.65)',
                textDecoration: 'none', fontSize: 13, fontWeight: isActive(l.to) ? 700 : 500,
                transition: 'color 0.2s', padding: '4px 0',
                borderBottom: isActive(l.to) ? '2px solid #1a1a2e' : '2px solid transparent',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="hide-mobile" style={{ fontSize: 12, color: 'rgba(26,26,46,0.5)' }}>
            {user.username}
          </span>
          <button onClick={handleLogout} style={{
            background: 'rgba(26,26,46,0.08)', color: '#1a1a2e',
            border: 'none', padding: '5px 14px',
            borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>
            Esci
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: '#1a1a2e', fontSize: 24, cursor: 'pointer', padding: 4, display: 'none' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ background: '#FFB300', padding: '12px 24px' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              display: 'block', color: isActive(l.to) ? '#1a1a2e' : 'rgba(26,26,46,0.65)',
              textDecoration: 'none', padding: '8px 0', fontSize: 14, fontWeight: isActive(l.to) ? 700 : 500,
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px solid rgba(26,26,46,0.15)', fontSize: 12, color: 'rgba(26,26,46,0.5)' }}>
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

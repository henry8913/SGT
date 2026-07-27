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
        background: '#212529',
        color: '#fff',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '3px solid #FFB300',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="" style={{ width: 28, height: 28 }} />
            <span style={{ color: '#FFB300', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>SGT</span>
          </Link>
          <div className="hide-mobile" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: isActive(l.to) ? '#FFB300' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none', fontSize: 13, fontWeight: isActive(l.to) ? 600 : 400,
                transition: 'color 0.2s', padding: '4px 0',
                borderBottom: isActive(l.to) ? '2px solid #FFB300' : '2px solid transparent',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="hide-mobile" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {user.username}
          </span>
          <button onClick={handleLogout} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.2)', padding: '5px 14px',
            borderRadius: 4, cursor: 'pointer', fontSize: 12, transition: 'all 0.2s',
          }}>
            Esci
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: '#FFB300', fontSize: 24, cursor: 'pointer', padding: 4, display: 'none' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ background: '#212529', padding: '12px 24px', borderBottom: '2px solid #FFB300' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              display: 'block', color: isActive(l.to) ? '#FFB300' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none', padding: '8px 0', fontSize: 14, fontWeight: isActive(l.to) ? 600 : 400,
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
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

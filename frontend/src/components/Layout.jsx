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
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Progetti' },
    { to: '/verifica', label: 'Verifica' },
    { to: '/settings/profili', label: 'Profili' },
    { to: '/settings/password', label: 'Password' },
    ...(user.is_admin ? [
      { to: '/admin/users', label: 'Admin' },
      { to: '/admin/coefficienti', label: 'Coefficienti' },
    ] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gray-bg)' }}>
      <nav style={{
        background: '#fff',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '3px solid #D4A017',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="" style={{ width: 30, height: 30 }} />
            <span style={{ color: '#1e1e2e', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>SGT</span>
          </Link>
          <div className="hide-mobile" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: isActive(l.to) ? '#D4A017' : '#6b7280',
                textDecoration: 'none', fontSize: 13, fontWeight: isActive(l.to) ? 700 : 500,
                transition: 'color 0.2s', padding: '18px 0',
                borderBottom: isActive(l.to) ? '2px solid #D4A017' : '2px solid transparent',
                marginBottom: '-2px',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="hide-mobile" style={{ fontSize: 12, color: '#9ca3af' }}>{user.username}</span>
          <button onClick={handleLogout} className="btn btn-sm btn-ghost">Esci</button>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', color: '#1e1e2e', fontSize: 22, cursor: 'pointer', padding: 4, display: 'none' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 98 }} />
          <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: '#fff', padding: '12px 24px', zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
                display: 'block', color: isActive(l.to) ? '#D4A017' : '#1e1e2e',
                textDecoration: 'none', padding: '12px 0', fontSize: 15, fontWeight: isActive(l.to) ? 700 : 500,
                borderBottom: '1px solid #f3f4f6',
              }}>
                {l.label}
              </Link>
            ))}
            <div style={{ paddingTop: 12, fontSize: 12, color: '#9ca3af' }}>{user.username}</div>
          </div>
        </>
      )}

      <main className="container page" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}

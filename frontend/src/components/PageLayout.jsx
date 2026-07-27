import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function PageLayout({ title, subtitle, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pages = [
    { to: '/', label: 'Home' },
    { to: '/come-funziona', label: 'Come funziona' },
    { to: '/piani', label: 'Piani' },
    { to: '/chi-siamo', label: 'Chi siamo' },
    { to: '/blog', label: 'Blog' },
    { to: '/contatto', label: 'Contatto' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav style={{
        background: '#fff', padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '3px solid #D4A017',
        maxWidth: 1200, margin: '0 auto', width: '100%',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/favicon.svg" alt="" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: '#1e1e2e' }}>SGT</span>
        </Link>
        <div className="hide-mobile" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {pages.map(p => (
            <Link key={p.to} to={p.to} style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              {p.label}
            </Link>
          ))}
          <Link to="/login" className="btn btn-dark btn-sm" style={{ color: '#fff', textDecoration: 'none' }}>Accedi</Link>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', display: 'none', color: '#1e1e2e' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ background: '#fff', padding: '12px 24px', borderBottom: '2px solid #D4A017' }}>
          {pages.map(p => (
            <Link key={p.to} to={p.to} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '8px 0', color: '#6b7280', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
              {p.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '8px 0', fontWeight: 600, color: '#1e1e2e' }}>Accedi</Link>
        </div>
      )}

      <div style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d42 100%)',
        color: '#fff', padding: '60px 24px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 36, color: '#fff', marginBottom: 8 }}>{title}</h1>
        {subtitle && <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: 600, margin: '0 auto' }}>{subtitle}</p>}
      </div>

      {children}

      <footer style={{ background: '#1e1e2e', color: '#9ca3af', padding: '40px 24px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            {pages.map(p => (
              <Link key={p.to} to={p.to} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 13 }}>{p.label}</Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
            © 2026 — SGT. Stabilità delle Gru a Torre. KG 26.5.
          </div>
        </div>
      </footer>
    </div>
  );
}

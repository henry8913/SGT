import PageLayout from '../components/PageLayout';
import { Link } from 'react-router-dom';

export default function Home() {
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
          {[
            { to: '/', label: 'Home' },
            { to: '/come-funziona', label: 'Come funziona' },
            { to: '/piani', label: 'Piani' },
            { to: '/chi-siamo', label: 'Chi siamo' },
            { to: '/blog', label: 'Blog' },
            { to: '/contatto', label: 'Contatto' },
          ].map(p => (
            <Link key={p.to} to={p.to} style={{ color: '#6b7280', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              {p.label}
            </Link>
          ))}
          <Link to="/login" className="btn btn-dark btn-sm" style={{ color: '#fff', textDecoration: 'none' }}>Accedi</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d42 100%)',
        color: '#fff', padding: '80px 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(212,160,23,0.15)', color: '#D4A017',
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A017', display: 'inline-block' }} />
              KG 26.5 — Software di calcolo stabilità
            </div>
            <h1 style={{ fontSize: 42, color: '#fff', lineHeight: 1.15, marginBottom: 16, fontWeight: 800 }}>
              Verifica di stabilità<br />
              <span style={{ color: '#D4A017' }}>gru a torre</span>
            </h1>
            <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Dal foglio Excel al SaaS. Inserisci i dati, calcola automaticamente baricentri, vento,
              stabilità Q/D, carichi ralla e diagramma di carico secondo le normative C25/FEM.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/come-funziona" className="btn btn-yellow" style={{ padding: '12px 28px', fontSize: 15, color: '#fff' }}>
                Come funziona
              </Link>
              <Link to="/contatto" className="btn btn-ghost" style={{ padding: '12px 28px', fontSize: 15, background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Contattaci
              </Link>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: '#6b7280' }}>
              La verifica finale della conformità resta responsabilità del tecnico qualificato.
            </p>
          </div>
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <img src="/img/cover.png" alt="SGT Dashboard"
              style={{ width: '100%', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
      </section>

      {/* Sezioni veloci */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {[
            { icon: '📊', title: '55.000+ formule', desc: 'Importa automaticamente le formule dal tuo file Excel', link: '/come-funziona' },
            { icon: '⚡', title: '8 step di calcolo', desc: 'Da baricentri a diagramma di carico, tutto automatico', link: '/come-funziona' },
            { icon: '🔒', title: 'Dati isolati', desc: 'Ogni utente ha il proprio spazio, progetti privati e sicuri', link: '/chi-siamo' },
            { icon: '📋', title: 'Risultati chiari', desc: 'Dashboard, tabelle e grafici con esito OK/KO immediato', link: '/come-funziona' },
          ].map(s => (
            <Link key={s.title} to={s.link} style={{
              padding: 24, background: '#f9fafb', borderRadius: 10,
              textDecoration: 'none', color: 'inherit', display: 'block',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: '#f9fafb' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Pronto a iniziare?</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
          Contattaci per un preventivo o una demo. Ti risponderemo in 24 ore.
        </p>
        <Link to="/contatto" className="btn btn-yellow" style={{ padding: '12px 32px', fontSize: 15, color: '#fff' }}>
          Richiedi informazioni
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e1e2e', color: '#9ca3af', padding: '40px 24px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/come-funziona', label: 'Come funziona' },
              { to: '/piani', label: 'Piani' },
              { to: '/chi-siamo', label: 'Chi siamo' },
              { to: '/blog', label: 'Blog' },
              { to: '/contatto', label: 'Contatto' },
            ].map(p => (
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

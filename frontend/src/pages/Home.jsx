import { Link } from 'react-router-dom';
import { useState } from 'react';

const faqs = [
  { q: "Cos'è SGT?", a: "SGT (Stabilità delle Gru a Torre) è un software SaaS per la verifica di stabilità delle gru a torre secondo le normative C25/FEM. Un motore di calcolo Python, sviluppato con l'ingegnere, esegue tutte le verifiche in modo automatico e trasparente." },
  { q: 'Come si usa?', a: 'Segui il wizard a 6 passi: inserisci i dati della macchina, geometria, masse, curve carico, aree vento e coefficienti. Il sistema calcola automaticamente tutti gli step e mostra i risultati in dashboard chiare.' },
  { q: 'Come vengono gestite le formule di calcolo?', a: "La struttura logica dei calcoli è scritta e versionata direttamente nel motore Python. I coefficienti numerici (margini di sicurezza, soglie, costanti) sono configurabili dall'amministratore da un pannello dedicato, con flusso di bozza e pubblicazione." },
  { q: 'Quanto costa?', a: "Contattaci per un preventivo personalizzato. Offriamo piani mensili, annuali e enterprise con possibilità di installazione su proprio server." },
  { q: 'I miei dati sono sicuri?', a: 'Sì. Ogni utente ha il proprio spazio isolato. I progetti sono visibili solo al proprietario. Password crittografate con bcrypt. Architettura multi-tenant.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

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
      {/* Navbar */}
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
            <Link key={p.to} to={p.to} style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none' }}>{p.label}</Link>
          ))}
          {token ? (
            <Link to="/dashboard" className="btn btn-dark btn-sm" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <Link to="/login" className="btn btn-dark btn-sm" style={{ color: '#fff', textDecoration: 'none' }}>Accedi</Link>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', display: 'none', color: '#1e1e2e' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 98
          }} />
          <div style={{
            position: 'fixed', top: 64, left: 0, right: 0, background: '#fff',
            padding: '12px 24px', zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            {pages.map(p => (
              <Link key={p.to} to={p.to} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '12px 0', color: '#1e1e2e', fontSize: 15, textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}>
                {p.label}
              </Link>
            ))}
            {token ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', fontWeight: 700, color: '#D4A017', fontSize: 15 }}>Dashboard</Link>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', fontWeight: 700, color: '#D4A017', fontSize: 15 }}>Accedi</Link>
            )}
          </div>
        </>
      )}

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d42 100%)', color: '#fff', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 480px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,160,23,0.15)', color: '#D4A017', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4A017', display: 'inline-block' }} />
              KG 26.5 — Software di calcolo stabilità
            </div>
            <h1 style={{ fontSize: 44, color: '#fff', lineHeight: 1.15, marginBottom: 16, fontWeight: 800 }}>
              Verifica di stabilità<br />
              <span style={{ color: '#D4A017' }}>gru a torre</span>
            </h1>
            <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
              Dal foglio Excel al SaaS. Inserisci i dati della gru, il sistema calcola automaticamente
              baricentri, vento, stabilità C25-Q/D, carichi ralla e diagramma di carico.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/come-funziona" className="btn btn-yellow" style={{ padding: '12px 28px', fontSize: 15, color: '#fff' }}>Come funziona</Link>
              <Link to="/contatto" className="btn btn-ghost" style={{ padding: '12px 28px', fontSize: 15, background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Contattaci
              </Link>
            </div>
          </div>
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <img src="/img/cover.png" alt="SGT Dashboard" style={{ width: '100%', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', background: '#D4A017' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
          <div><div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>8</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Step di calcolo</div></div>
          <div><div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>Python</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Motore di calcolo</div></div>
          <div><div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>23</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Coefficienti configurabili</div></div>
          <div><div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>6</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Passi wizard</div></div>
        </div>
      </section>

      {/* Quick cards */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { icon: '🐍', title: 'Motore di calcolo Python', desc: 'Baricentri, vento, stabilità C25-Q/D, carichi ralla e diagramma eseguiti da moduli Python, versionati con git.', link: '/come-funziona' },
            { icon: '⚡', title: '8 step automatici', desc: 'Da baricentri a diagramma di carico. Il backend esegue tutto in sequenza, senza intervento manuale.', link: '/come-funziona' },
            { icon: '🔍', title: 'Coefficienti configurabili', desc: 'Soglie e margini numerici modificabili dal pannello admin con flusso di bozza e pubblicazione.', link: '/come-funziona' },
            { icon: '📊', title: 'Trasparenza totale', desc: 'Ogni passo di calcolo è consultabile nel frontend e ogni verifica è riproducibile.', link: '/come-funziona' },
          ].map(s => (
            <Link key={s.title} to={s.link} style={{ padding: 24, background: '#f9fafb', borderRadius: 10, textDecoration: 'none', color: 'inherit', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Target audience */}
      <section style={{ padding: '60px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 40 }}>A chi è rivolto</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '🏗️', title: 'Noleggiatori di gru', desc: 'Certifica la stabilità delle tue macchine prima di ogni installazione in cantiere. Riduci i tempi di preparazione.' },
              { icon: '🔧', title: 'Installatori e manutentori', desc: 'Verifica la conformità alle normative C25/FEM durante installazione e manutenzione periodica delle gru.' },
              { icon: '📋', title: 'Uffici tecnici', desc: 'Prepara i dossier di stabilità per i clienti e gli enti di certificazione con pochi clic.' },
              { icon: '✅', title: 'Certificatori e collaudatori', desc: 'Verifica e certifica la stabilità delle gru secondo normativa con strumenti digitali moderni.' },
            ].map(p => (
              <div key={p.title} style={{ background: '#fff', padding: 28, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>{p.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 40 }}>Perché scegliere SGT</h2>
        <div style={{ display: 'grid', gap: 20, maxWidth: 700, margin: '0 auto' }}>
          {[
            { icon: '🐍', title: 'Motore di calcolo Python', desc: 'La struttura logica dei calcoli è scritta nel codice Python e versionata con git. Sviluppato progressivamente con il tuo ingegnere.' },
            { icon: '🔍', title: 'Trasparenza totale dei calcoli', desc: 'Ogni step di calcolo è consultabile nel frontend (pagina Verifica). I coefficienti numerici sono configurabili dal pannello admin.' },
            { icon: '🎚️', title: 'Bozza e pubblicazione', desc: 'L\'admin modifica i coefficienti in bozza e li pubblica in modo esplicito: il motore usa solo i valori pubblicati, con storico versioni.' },
            { icon: '📱', title: 'Accessibile ovunque', desc: 'SaaS via browser. Docker sul server. Funziona da qualsiasi dispositivo. Sempre aggiornato.' },
            { icon: '🔒', title: 'Sicurezza e isolamento', desc: 'Ogni utente ha il proprio spazio. Progetti visibili solo al proprietario. Password crittografate. Architettura multi-tenant.' },
            { icon: '📋', title: 'Risultati chiari e professionali', desc: 'Dashboard stabilità Q/D, carichi ralla, diagramma carico. Tabelle, grafici e indicatori OK/KO. Pronti per il dossier.' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 40 }}>Domande frequenti</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 8, marginBottom: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '14px 18px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: '#1e1e2e' }}>
                {f.q}
                <span style={{ color: '#D4A017', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : '' }}>▼</span>
              </button>
              {openFaq === i && <div style={{ padding: '0 18px 14px', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Richiedi informazioni</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>Contattaci per un preventivo personalizzato o una demo del software.</p>
        <Link to="/contatto" className="btn btn-yellow" style={{ padding: '12px 32px', fontSize: 15, color: '#fff' }}>Richiedi preventivo</Link>
      </section>

      {/* Footer */}
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

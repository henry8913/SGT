import { Link } from 'react-router-dom';
import { useState } from 'react';

const faqs = [
  { q: 'Cos\'è SGT?', a: 'SGT (Stabilità delle Gru a Torre) è un software SaaS per la verifica di stabilità delle gru a torre secondo le normative C25/FEM. Trasforma il foglio di calcolo Excel in un\'applicazione web moderna.' },
  { q: 'Come si usa?', a: 'Segui il wizard a 6 passi: inserisci i dati della macchina, la geometria del braccio, le masse, le curve di carico, le aree vento e i coefficienti di stabilità. Il sistema calcola automaticamente tutti gli step e mostra i risultati.' },
  { q: 'Posso importare le formule dal mio file Excel?', a: 'Sì. Dalla sezione Impostazioni puoi caricare il tuo file .xlsm aggiornato. Le 55.000+ formule vengono importate automaticamente.' },
  { q: 'Quanto costa?', a: 'Contattaci per un preventivo personalizzato in base alle tue esigenze. Offriamo licenze annuali e canoni mensili.' },
  { q: 'I miei dati sono sicuri?', a: 'Sì. Ogni utente ha il proprio spazio isolato. I progetti sono visibili solo al proprietario. Le credenziali sono crittografate con bcrypt.' },
  { q: 'Serve una connessione internet?', a: 'Per la versione SaaS sì, serve una connessione internet. È disponibile anche una versione standalone per installazione locale.' },
];

const steps = [
  { num: 1, title: 'Caratteristiche macchina', desc: 'Inserisci sbraccio, carichi, altezze e diametri funi della gru.' },
  { num: 2, title: 'Geometria braccio', desc: 'Quote geometriche e profili degli elementi strutturali del braccio.' },
  { num: 3, title: 'Masse proprie', desc: 'Masse di carrello, argani, quadri, funi e tutti i componenti.' },
  { num: 4, title: 'Curve di carico', desc: 'Carichi massimi per ogni raggio da 5m a 65m.' },
  { num: 5, title: 'Aree vento', desc: 'Coefficienti aree vento per braccio, rotazione, controbraccio e carico.' },
  { num: 6, title: 'Coefficienti stabilità', desc: 'Parametri di sicurezza, pressioni e coefficienti parziali.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#fff' }}>
      {/* Navigation */}
      <nav style={{
        background: '#fff', padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '3px solid #D4A017',
        maxWidth: 1200, margin: '0 auto', width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/favicon.svg" alt="" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: '#1e1e2e' }}>SGT</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#come-funziona" style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Come funziona</a>
          <a href="#faq" style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>FAQ</a>
          <a href="#contatto" style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Contatto</a>
          <Link to="/login" style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>Accedi</Link>
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
              <a href="#come-funziona" className="btn btn-yellow" style={{ padding: '12px 28px', fontSize: 15, color: '#fff' }}>
                Come funziona
              </a>
              <a href="#contatto" className="btn btn-ghost" style={{ padding: '12px 28px', fontSize: 15, background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Contattaci
              </a>
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

      {/* How it works */}
      <section id="come-funziona" style={{ padding: '80px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, marginBottom: 8 }}>Come funziona</h2>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
            Wizard a 6 passi. Inserisci i dati, il sistema calcola tutto automaticamente.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {steps.map(s => (
              <div key={s.num} style={{
                background: '#fff', padding: 28, borderRadius: 12,
                border: '1px solid #e5e7eb', textAlign: 'left',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: '#D4A017', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 18, marginBottom: 16,
                }}>{s.num}</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calcolo automatico section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 28, marginBottom: 12 }}>Calcolo automatico in 8 step</h2>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                Dopo aver inserito i dati, il backend esegue in sequenza tutti i calcoli
                richiesti dalle normative C25/FEM, da baricentri a diagramma di carico.
              </p>
              <div style={{ display: 'grid', gap: 8 }}>
                {['Baricentri', 'Aree vento', 'Vento', 'Stabilità C25-Q', 'Stabilità C25-D', 'Curve di carico', 'Carichi ralla e base', 'Diagramma di carico'].map((s, i) => (
                  <div key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', background: '#f9fafb', borderRadius: 6,
                    fontSize: 13,
                  }}>
                    <span style={{ color: '#D4A017', fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 32 }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Esempio di risultati: Stabilità C25-Q</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ fontSize: 12, minWidth: 400 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 8, fontSize: 10 }}>Cond.</th>
                      <th style={{ padding: 8, fontSize: 10 }}>V (kg)</th>
                      <th style={{ padding: 8, fontSize: 10 }}>Mr (kgm)</th>
                      <th style={{ padding: 8, fontSize: 10 }}>Coef. Sic.</th>
                      <th style={{ padding: 8, fontSize: 10 }}>Esito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['P01', 'P02', 'P03', 'P04', 'P05'].map(c => (
                      <tr key={c}>
                        <td style={{ padding: 8, fontWeight: 600 }}>{c}</td>
                        <td style={{ padding: 8 }}>52.400</td>
                        <td style={{ padding: 8 }}>285.000</td>
                        <td style={{ padding: 8, fontWeight: 600 }}>1.32</td>
                        <td style={{ padding: 8 }}>
                          <span className="badge badge-ok">OK</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: 12, fontSize: 11, color: '#9ca3af' }}>Dati indicativi. I risultati reali dipendono dai valori inseriti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Per chi è SGT */}
      <section style={{ padding: '80px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>Per chi è SGT</h2>
          <p style={{ color: '#6b7280', fontSize: 15, textAlign: 'center', marginBottom: 48 }}>
            Progettato per i professionisti del sollevamento e della certificazione gru.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '🏗️', title: 'Noleggiatori di gru', desc: 'Aziende di noleggio che devono certificare la stabilità delle proprie macchine prima di ogni installazione in cantiere.' },
              { icon: '🔧', title: 'Installatori e manutentori', desc: 'Tecnici che installano e manutengono gru a torre e devono verificare la conformità alle normative C25/FEM.' },
              { icon: '📋', title: 'Uffici tecnici', desc: 'Ingegneri e progettisti che preparano i dossier di stabilità per i clienti e gli enti di certificazione.' },
              { icon: '✅', title: 'Certificatori e collaudatori', desc: 'Enti e professionisti che devono verificare e certificare la stabilità delle gru secondo normativa.' },
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
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, textAlign: 'center', marginBottom: 48 }}>Perché scegliere SGT</h2>
          <div style={{ display: 'grid', gap: 32, maxWidth: 700, margin: '0 auto' }}>
            {[
              { icon: '⚡', title: '55.000+ formule importate dall\'Excel', desc: 'Le stesse formule del tuo foglio di calcolo, automaticamente importate dal file .xlsm. Nessuna ricodifica manuale.' },
              { icon: '📊', title: 'Risultati chiari e consultabili', desc: 'Dashboard di stabilità, carichi ralla e diagramma di carico con tabelle, grafici e indicatori OK/KO.' },
              { icon: '🔍', title: 'Formule visibili e verificabili', desc: 'Ogni formula è visibile e può essere controllata. Ingegneri e tecnici possono verificare la correttezza dei calcoli.' },
              { icon: '🔄', title: 'Aggiornamento formule da Excel', desc: 'Il tuo ingegnere modifica l\'Excel, carica il file aggiornato e il SaaS si sincronizza. Nessuna programmazione richiesta.' },
              { icon: '🔒', title: 'Dati isolati e sicuri', desc: 'Ogni utente vede solo i propri progetti. Le password sono crittografate con bcrypt. Infrastruttura multi-tenant.' },
              { icon: '📱', title: 'Accessibile ovunque', desc: 'SaaS via browser. Docker sul server. Funziona da qualsiasi dispositivo senza installazione.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', background: '#1e1e2e', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#D4A017' }}>55.031</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Formule importate</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#D4A017' }}>8</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Step di calcolo</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#D4A017' }}>18</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Fogli Excel</div>
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#D4A017' }}>6</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Passi wizard</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 40 }}>Domande frequenti</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 8, marginBottom: 8,
              border: '1px solid #e5e7eb', overflow: 'hidden',
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', padding: '14px 18px', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 14, fontWeight: 600, color: '#1e1e2e',
              }}>
                {f.q}
                <span style={{ color: '#D4A017', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : '' }}>▼</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 18px 14px', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contatto" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, marginBottom: 12 }}>Richiedi informazioni</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
            Contattaci per un preventivo personalizzato o una demo del software.
          </p>
          <a href="mailto:info@sgt.henrydev.it" className="btn btn-yellow" style={{ padding: '12px 32px', fontSize: 15, color: '#fff' }}>
            Contattaci
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e1e2e', color: '#9ca3af', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <img src="/favicon.svg" alt="" style={{ width: 28, height: 28 }} />
                <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>SGT</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                Stabilità delle Gru a Torre. Software di calcolo secondo le normative C25/FEM.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Prodotto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <a href="#come-funziona" style={{ color: '#9ca3af' }}>Come funziona</a>
                <a href="/login" style={{ color: '#9ca3af' }}>Accedi</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Azienda</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <a href="#faq" style={{ color: '#9ca3af' }}>FAQ</a>
                <a href="#contatto" style={{ color: '#9ca3af' }}>Contatto</a>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Contatti</h4>
              <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div>info@sgt.henrydev.it</div>
                <div>KG 26.5</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, fontSize: 12, textAlign: 'center' }}>
            © 2026 — SGT. Stabilità delle Gru a Torre. KG 26.5.
          </div>
        </div>
      </footer>
    </div>
  );
}

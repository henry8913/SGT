import { useState } from 'react';
import PageLayout from '../components/PageLayout';

export default function Contatto() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageLayout title="Contatto" subtitle="Richiedi informazioni, un preventivo o una demo personalizzata">
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px' }}>
        <div className="grid-2" style={{ gap: 40, alignItems: 'start' }}>
          {/* Form */}
          <div>
            {sent ? (
              <div style={{ textAlign: 'center', padding: 48, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📨</div>
                <h3 style={{ marginBottom: 8 }}>Richiesta inviata!</h3>
                <p style={{ color: '#6b7280', fontSize: 14 }}>Ti risponderemo al più presto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Nome e Cognome *</label>
                  <input required placeholder="Il tuo nome" style={{ background: '#fff' }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Email *</label>
                  <input type="email" required placeholder="email@esempio.it" style={{ background: '#fff' }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Azienda</label>
                  <input placeholder="La tua azienda" style={{ background: '#fff' }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Telefono</label>
                  <input type="tel" placeholder="+39 123 456 7890" style={{ background: '#fff' }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Tipo richiesta</label>
                  <select style={{ background: '#fff' }}>
                    <option>Informazioni generali</option>
                    <option>Richiesta preventivo</option>
                    <option>Richiesta demo</option>
                    <option>Supporto tecnico</option>
                    <option>Altro</option>
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Messaggio *</label>
                  <textarea rows={5} required placeholder="Cosa possiamo fare per te?" style={{ background: '#fff' }} />
                </div>
                <button type="submit" className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', color: '#fff', padding: '12px' }}>
                  Invia richiesta
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 32, border: '1px solid #e5e7eb', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>Info contatto</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>📧</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Email</div>
                    <a href="mailto:info@sgt.henrydev.it" style={{ color: '#6b7280', fontSize: 13 }}>info@sgt.henrydev.it</a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>🌐</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Web</div>
                    <a href="https://sgt.henrydev.it" style={{ color: '#6b7280', fontSize: 13 }}>sgt.henrydev.it</a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>🏗️</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Prodotto da</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>KG 26.5 — Stabilità delle Gru a Torre</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 32, color: '#fff' }}>
              <h3 style={{ color: '#D4A017', fontSize: 18, marginBottom: 12 }}>Richiedi una demo</h3>
              <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                Prenota una demo personalizzata di 30 minuti. Ti mostreremo il wizard,
                il calcolo automatico e le dashboard di risultati. Senza impegno.
              </p>
              <a href="mailto:info@sgt.henrydev.it?subject=Richiesta demo SGT" className="btn btn-yellow" style={{ color: '#fff', width: '100%', justifyContent: 'center' }}>
                Richiedi demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

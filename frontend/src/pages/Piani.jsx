import PageLayout from '../components/PageLayout';

const plans = [
  {
    nome: 'Mensile',
    prezzo: 'Contattaci',
    desc: 'Per chi vuole provare il software senza impegno annuale. Flessibilità massima, disdici quando vuoi.',
    features: [
      'Accesso completo al wizard 6 passi',
      'Calcoli di stabilità C25-Q e C25-D',
      'Carichi ralla e base',
      'Diagramma di carico con grafico',
      'Motore di calcolo Python',
      'Coefficienti configurabili',
      'Supporto email',
      '1 utente incluso',
    ],
  },
  {
    nome: 'Annuale',
    prezzo: 'Contattaci',
    desc: 'Il piano più conveniente per uso professionale continuativo. Risparmi rispetto al mensile.',
    features: [
      'Tutto del piano Mensile',
      'Pannello coefficienti admin',
      'Storico versioni coefficienti',
      'Utenti multipli (fino a 5)',
      'Supporto prioritario',
      'Backup dati settimanale',
      'SLA 24h',
      'Report e statistiche',
    ],
    evidenza: true,
  },
  {
    nome: 'Enterprise',
    prezzo: 'Contattaci',
    desc: 'Per aziende con esigenze personalizzate, installazione on-premise e supporto dedicato.',
    features: [
      'Tutto del piano Annuale',
      'Installazione su tuo server',
      'Personalizzazioni interfaccia',
      'API dedicate per integrazione',
      'SLA 4h',
      'Formazione team (fino a 2 giornate)',
      'Certificazioni e compliance',
      'Account manager dedicato',
    ],
  },
];

const confronto = [
  { feature: 'Wizard 6 passi', mensile: '✓', annuale: '✓', enterprise: '✓' },
  { feature: 'Calcolo stabilità Q/D', mensile: '✓', annuale: '✓', enterprise: '✓' },
  { feature: 'Carichi ralla e diagramma', mensile: '✓', annuale: '✓', enterprise: '✓' },
  { feature: 'Motore di calcolo Python', mensile: '✓', annuale: '✓', enterprise: '✓' },
  { feature: 'Verifica step nel frontend', mensile: '✓', annuale: '✓', enterprise: '✓' },
  { feature: 'Pannello coefficienti admin', mensile: '—', annuale: '✓', enterprise: '✓' },
  { feature: 'Utenti multipli', mensile: '—', annuale: '5', enterprise: 'Illimitati' },
  { feature: 'Supporto', mensile: 'Email', annuale: 'Prioritario', enterprise: 'Dedicato 4h' },
  { feature: 'Backup dati', mensile: '—', annuale: '✓', enterprise: '✓' },
  { feature: 'Installazione on-premise', mensile: '—', annuale: '—', enterprise: '✓' },
  { feature: 'API dedicate', mensile: '—', annuale: '—', enterprise: '✓' },
  { feature: 'Formazione team', mensile: '—', annuale: '—', enterprise: '✓' },
];

export default function Piani() {
  return (
    <PageLayout title="Piani e prezzi" subtitle="Scegli il piano più adatto alle tue esigenze">
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 60 }}>
          {plans.map(p => (
            <div key={p.nome} style={{
              background: '#fff', borderRadius: 12, padding: 32,
              border: p.evidenza ? '2px solid #D4A017' : '1px solid #e5e7eb',
              boxShadow: p.evidenza ? '0 4px 20px rgba(212,160,23,0.12)' : 'none',
              position: 'relative',
            }}>
              {p.evidenza && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#D4A017', color: '#fff', padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>Più richiesto</div>}
              <h3 style={{ fontSize: 20, marginBottom: 4 }}>{p.nome}</h3>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1e1e2e', marginBottom: 8 }}>{p.prezzo}</div>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}><span style={{ color: '#D4A017', fontWeight: 700 }}>✓</span> {f}</div>
                ))}
              </div>
              <a href="mailto:info@sgt.henrydev.it" className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', color: '#fff' }}>Richiedi preventivo</a>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, textAlign: 'center', marginBottom: 32 }}>Confronto completo</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Funzionalità</th><th style={{ textAlign: 'center' }}>Mensile</th><th style={{ textAlign: 'center', background: '#fff8e1' }}>Annuale</th><th style={{ textAlign: 'center' }}>Enterprise</th></tr>
            </thead>
            <tbody>
              {confronto.map(r => (
                <tr key={r.feature}>
                  <td style={{ fontWeight: 500 }}>{r.feature}</td>
                  <td style={{ textAlign: 'center', color: r.mensile === '✓' ? '#16a34a' : '#d1d5db' }}>{r.mensile}</td>
                  <td style={{ textAlign: 'center', color: r.annuale === '✓' ? '#16a34a' : '#d1d5db', background: '#fffdf5' }}>{r.annuale}</td>
                  <td style={{ textAlign: 'center', color: r.enterprise === '✓' ? '#16a34a' : '#d1d5db' }}>{r.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageLayout>
  );
}

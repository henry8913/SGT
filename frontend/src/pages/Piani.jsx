import PageLayout from '../components/PageLayout';

export default function Piani() {
  return (
    <PageLayout title="Piani" subtitle="Scegli il piano più adatto alle tue esigenze">
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
          {[
            {
              nome: 'Mensile',
              prezzo: 'Contattaci',
              desc: 'Per chi vuole provare il software senza impegno annuale.',
              features: ['Accesso completo al wizard', 'Calcoli di stabilità Q/D', 'Carichi ralla e diagramma', '55.000+ formule', 'Supporto email'],
            },
            {
              nome: 'Annuale',
              prezzo: 'Contattaci',
              desc: 'Il piano più conveniente per uso professionale continuativo.',
              features: ['Tutto del piano Mensile', 'Import formule da Excel', 'Utenti multipli', 'Supporto prioritario', 'Backup dati'],
              evidenza: true,
            },
            {
              nome: 'Enterprise',
              prezzo: 'Contattaci',
              desc: 'Per aziende con esigenze personalizzate e installazione on-premise.',
              features: ['Tutto del piano Annuale', 'Installazione su tuo server', 'Personalizzazioni', 'SLA dedicato', 'Formazione team'],
            },
          ].map(p => (
            <div key={p.nome} style={{
              background: '#fff', borderRadius: 12, padding: 32,
              border: p.evidenza ? '2px solid #D4A017' : '1px solid #e5e7eb',
              boxShadow: p.evidenza ? '0 4px 20px rgba(212,160,23,0.15)' : 'none',
              position: 'relative',
            }}>
              {p.evidenza && <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: '#D4A017', color: '#fff', padding: '4px 16px', borderRadius: 999,
                fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
              }}>Più richiesto</div>}
              <h3 style={{ fontSize: 20, marginBottom: 4 }}>{p.nome}</h3>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1e1e2e', marginBottom: 8 }}>{p.prezzo}</div>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: '#D4A017' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <a href="mailto:info@sgt.henrydev.it" className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', color: '#fff' }}>
                Richiedi preventivo
              </a>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

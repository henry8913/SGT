import PageLayout from '../components/PageLayout';

const steps = [
  { num: 1, title: 'Caratteristiche macchina', desc: 'Inserisci i dati principali della gru: sbraccio massimo, carichi utili, altezze e diametri delle funi.' },
  { num: 2, title: 'Geometria braccio', desc: 'Quote geometriche, interassi verticali/orizzontali e profili degli elementi strutturali.' },
  { num: 3, title: 'Masse proprie', desc: 'Masse di carrello, argani, quadri, funi e tutti i componenti con relative posizioni.' },
  { num: 4, title: 'Curve di carico', desc: 'Carichi massimi sollevabili per ogni raggio da 5m a 65m, per tiro II e II/IV.' },
  { num: 5, title: 'Aree vento', desc: 'Coefficienti aree vento per braccio, rotazione centrale, controbraccio e carico utile.' },
  { num: 6, title: 'Coefficienti stabilità', desc: 'Interasse carro, masse torre, pressioni vento e coefficienti di sicurezza parziali.' },
];

const calcSteps = [
  'Baricentri', 'Aree vento calcolate', 'Vento', 'Stabilità C25-Q',
  'Stabilità C25-D', 'Curve di carico', 'Carichi ralla e base', 'Diagramma di carico',
];

export default function ComeFunziona() {
  return (
    <PageLayout title="Come funziona" subtitle="Dal dato al risultato in 6 passi">
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ fontSize: 22, marginBottom: 32, textAlign: 'center' }}>Wizard a 6 passi</h2>
        <div style={{ display: 'grid', gap: 16, marginBottom: 60 }}>
          {steps.map(s => (
            <div key={s.num} style={{ display: 'flex', gap: 16, padding: 20, background: '#f9fafb', borderRadius: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#D4A017', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{s.num}</div>
              <div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, marginBottom: 24, textAlign: 'center' }}>Calcolo automatico in 8 step</h2>
        <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Dopo aver completato il wizard, il backend esegue automaticamente tutti i calcoli in sequenza.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {calcSteps.map((s, i) => (
            <div key={s} style={{
              padding: 16, background: '#f9fafb', borderRadius: 8,
              textAlign: 'center', fontSize: 13, fontWeight: 500,
              borderTop: '3px solid #D4A017',
            }}>
              <div style={{ color: '#D4A017', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{String(i + 1).padStart(2, '0')}</div>
              {s}
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

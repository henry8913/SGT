import PageLayout from '../components/PageLayout';

const steps = [
  { num: 1, title: 'Caratteristiche macchina', desc: 'Inserisci sbraccio massimo (65 m), carichi utili (1800 kg punta, 10000 kg max), altezze, diametri funi. Sono i dati base della gru da cui parte tutto il calcolo.' },
  { num: 2, title: 'Geometria braccio', desc: 'Quote geometriche complete: interassi verticali/orizzontali in mm, nomi profili per ogni elemento (es. Tubolare quadro 160x160x16), tipologia sezione e coordinate struttura reticolare.' },
  { num: 3, title: 'Masse proprie', desc: 'Masse di tutti i componenti: carrello, argani, quadri, funi. Ogni massa ha la sua posizione in metri e un flag di utilizzo (\"-\" se non usato).' },
  { num: 4, title: 'Curve di carico', desc: 'Carichi massimi sollevabili per ogni raggio da 5m a 65m, distinti per tiro II e tiro II/IV. I dati vengono inseriti dall\'utente.' },
  { num: 5, title: 'Aree vento', desc: 'Coefficienti aree vento per quattro sottopagine: A_b (braccio), A_rc (rotazione centrale), A_cb (controbraccio), A_Pu (carico utile). Con coordinate centri di spinta.' },
  { num: 6, title: 'Coefficienti stabilità', desc: 'Interasse carro, numero rinvii, masse torre, coefficienti eccentricità, pressione vento normativa e coefficienti parziali di sicurezza J30, J35, J37, J329.' },
];

const calcSteps = [
  { step: 'Baricentri', desc: 'Calcolo del centro di gravità di tutti i componenti usando masse e posizioni.', dipende: 'Masse proprie + Macchina' },
  { step: 'Aree vento calcolate', desc: 'Calcolo delle aree vento effettive a partire dalla geometria del braccio e dai profili.', dipende: 'Geometria + Proprietà beam' },
  { step: 'Vento', desc: 'Calcolo delle forze del vento usando le aree calcolate e la pressione normativa.', dipende: 'Aree vento + coefficienti stabilità' },
  { step: 'Stabilità C25-Q', desc: 'Verifica di stabilità in configurazione quadrata per tutte le 12 condizioni (P01..P12).', dipende: 'Baricentri + Vento + coefficienti' },
  { step: 'Stabilità C25-D', desc: 'Verifica di stabilità in configurazione diagonale.', dipende: 'Stab Q + Baricentri + Vento' },
  { step: 'Curve di carico', desc: 'Calcolo delle curve di carico massime per ogni raggio.', dipende: 'Macchina + Masse + input curve' },
  { step: 'Carichi ralla e base', desc: 'Calcolo di V, Mr, Mw, Mtot, T per le condizioni P01, P02, P03.', dipende: 'Stab Q + Stab D + Vento' },
  { step: 'Diagramma di carico', desc: 'Generazione del diagramma carico/raggio con tabella e grafico.', dipende: 'Curve carico + Masse + Macchina' },
];

export default function ComeFunziona() {
  return (
    <PageLayout title="Come funziona" subtitle="Dal dato al risultato: il flusso completo di calcolo">
      {/* Wizard */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>Wizard a 6 passi</h2>
        <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          L'utente inserisce i dati seguendo un ordine preciso, passaggio dopo passaggio.
        </p>
        <div style={{ display: 'grid', gap: 16 }}>
          {steps.map(s => (
            <div key={s.num} style={{ display: 'flex', gap: 16, padding: 20, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#D4A017', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{s.num}</div>
              <div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calcolo automatico */}
      <section style={{ padding: '60px 24px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>Calcolo automatico in 8 step</h2>
          <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Dopo aver completato il wizard, clicca "Calcola". Il backend esegue in sequenza tutti gli step.
          </p>
          <div style={{ display: 'grid', gap: 16 }}>
            {calcSteps.map((s, i) => (
              <div key={s.step} style={{ display: 'flex', gap: 16, padding: 20, background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#1e1e2e', color: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.step}</h3>
                  <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>{s.desc}</p>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Dipende da: {s.dipende}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coefficienti */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Motore Python e coefficienti</h2>
        <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.7 }}>
          La struttura logica dei calcoli è scritta nel codice Python dei moduli, versionata con git
          e sviluppata progressivamente insieme all'ingegnere strutturista. I coefficienti numerici
          (margini di sicurezza, soglie, costanti) sono configurabili da un pannello riservato
          all'amministratore, con flusso di bozza e pubblicazione e storico delle versioni.
        </p>
      </section>
    </PageLayout>
  );
}

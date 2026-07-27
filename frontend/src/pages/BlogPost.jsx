import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const allPosts = [
  {
    slug: 'verifica-di-stabilita-gru',
    title: "Cos'è la verifica di stabilità di una gru a torre?",
    content: `
      La verifica di stabilità è un passaggio obbligatorio per garantire che la gru rimanga in equilibrio in ogni condizione di carico e vento.

      Secondo la normativa C25/FEM, devono essere verificate sia la configurazione a quadrato (Q) che quella in diagonale (D), considerando 12 condizioni di carico ciascuna (P01..P12).

      ## Le condizioni di carico

      Ogni condizione rappresenta una diversa combinazione di carico, vento e posizione del carrello:
      - **P01-P04**: Carico nominale con vento in servizio
      - **P05-P08**: Carico nominale con vento fuori servizio
      - **P09-P12**: Carico ridotto con vento massimo

      Per ogni condizione vengono calcolati:
      - V (kg) — Carico verticale sulla ralla
      - Mr (kgm) — Momento ribaltante
      - Mw (kgm) — Momento vento
      - Mtot (kgm) — Momento totale
      - T (kg) — Trazione

      Il coefficiente di sicurezza deve essere ≥ 1.1 secondo normativa.

      ## Il wizard SGT

      Con SGT, inserisci i dati della gru nei 6 passi del wizard e il sistema calcola automaticamente tutte le condizioni di stabilità, mostrando i risultati in una dashboard chiara con indicatori OK/KO.
    `,
    date: '15 Luglio 2026',
    read: '5 min',
    tags: ['Normativa', 'C25/FEM'],
  },
  {
    slug: 'da-excel-a-saas',
    title: 'Dal foglio Excel al SaaS: 55.031 formule trasformate',
    content: `
      Abbiamo analizzato il file Excel di calcolo stabilità, estratto tutte le formule da 18 fogli di lavoro e le abbiamo importate in un database SQLite.

      ## Il processo

      1. Analisi del file Excel: identificazione di ogni cella con formula
      2. Estrazione automatica di 55.031 formule da 18 fogli
      3. Importazione nel database con associazione a step e campo
      4. Verifica della corrispondenza esatta al 100%

      ## Il risultato

      Il motore di calcolo di SGT non ha formule hardcoded: legge le formule dal database e le valuta dinamicamente. Questo significa che:
      - Le formule sono identiche all'originale Excel
      - Puoi verificarle una per una dal frontend
      - Puoi aggiornarle semplicemente ricaricando il file Excel

      ## Vantaggi per l'ingegnere

      L'ingegnere continua a lavorare con Excel, il suo strumento di fiducia. Quando modifica il file, lo carica su SGT e il sistema si sincronizza automaticamente. Nessuna programmazione richiesta.
    `,
    date: '8 Luglio 2026',
    read: '4 min',
    tags: ['Tecnologia', 'SaaS'],
  },
  {
    slug: 'normativa-c25-fem',
    title: 'Normativa C25/FEM: come certificare la stabilità di una gru',
    content: `
      La normativa C25/FEM definisce i requisiti per la verifica di stabilità delle gru a torre. È il riferimento tecnico per costruttori, installatori e certificatori.

      ## Cosa richiede la normativa

      - **Coefficienti di sicurezza minimi**: il rapporto tra momento stabilizzante e momento ribaltante deve essere ≥ 1.1
      - **Condizioni di carico**: devono essere verificate 12 condizioni (P01..P12) per ogni configurazione (quadrato e diagonale)
      - **Vento**: devono essere considerate sia le condizioni di vento in servizio (0.3 kN/m²) che fuori servizio (variabile in base all'altezza)
      - **Azioni**: carico utile, vento, neve, azioni dinamiche di avviamento e frenata

      ## Come SGT aiuta

      SGT implementa automaticamente tutti i calcoli richiesti dalla normativa:
      - Calcolo pressione vento normativa con PW_NORMA(q_ref, h)
      - Verifica stabilità in configurazione Q e D
      - Calcolo momenti e trazioni su torre e ralla
      - Generazione del diagramma di carico

      Le funzioni DLL Windows (PW_NORMA, MW_TORRE, TW_TORRE, ecc.) sono state reimplementate in Python puro, garantendo la stessa precisione di calcolo.
    `,
    date: '28 Giugno 2026',
    read: '6 min',
    tags: ['Normativa', 'Sicurezza'],
  },
  {
    slug: 'wizard-6-passi',
    title: 'Wizard a 6 passi: come inserire i dati per il calcolo',
    content: `
      Il wizard di SGT guida l'utente attraverso 6 passaggi fondamentali per il calcolo di stabilità.

      ## I 6 passi

      1. **Caratteristiche macchina**: sbraccio, carichi utili, altezze, diametri funi
      2. **Geometria braccio**: quote, profili, interassi, coordinate
      3. **Masse proprie**: componenti con masse e posizioni
      4. **Curve di carico**: carichi per raggio, tiro II e II/IV
      5. **Aree vento**: coefficienti per braccio, rotazione, controbraccio, carico
      6. **Coefficienti stabilità**: parametri di sicurezza, pressioni

      ## Input utente vs calcoli automatici

      I campi con sfondo grigio chiaro sono input utente (ex celle blu dell'Excel).
      I campi calcolati (ex formule nere) mostrano il pulsante [fx] per visualizzare la formula.

      ## Dopo il wizard

      Completati i 6 passi, clicca "Calcola" e il backend esegue automaticamente tutti gli 8 step di calcolo, da baricentri a diagramma di carico.
    `,
    date: '20 Giugno 2026',
    read: '3 min',
    tags: ['Guida', 'Wizard'],
  },
  {
    slug: 'digitalizzare-calcolo-stabilita',
    title: 'Perché digitalizzare il calcolo di stabilità?',
    content: `
      Il foglio Excel per il calcolo di stabilità è uno strumento potente ma ha limiti significativi.

      ## I limiti dell'Excel

      - **Difficile da condividere**: file inviati per email, versioni che si moltiplicano
      - **Accesso limitato**: funziona solo su PC con Excel installato
      - **Errori di versione**: modifiche non tracciate, rischi di usare il file sbagliato
      - **Backup assente**: se il file si corrompe, i dati sono persi

      ## I vantaggi del SaaS

      - **Accesso da qualsiasi dispositivo** — browser, tablet, telefono
      - **Dati sempre aggiornati** — unica versione, sempre disponibile
      - **Collaborazione** — più utenti, stesso progetto
      - **Backup automatico** — dati sicuri su volume persistente
      - **Formule trasparenti** — visibili e verificabili con un clic

      Con SGT mantieni la stessa precisione di calcolo dell'Excel, aggiungendo accessibilità, sicurezza e collaborazione.
    `,
    date: '10 Giugno 2026',
    read: '4 min',
    tags: ['Business', 'Produttività'],
  },
  {
    slug: 'dll-rimpiazzate-python',
    title: 'DLL Windows rimpiazzate da Python: PW_NORMA, MW_TORRE e le altre',
    content: `
      L'Excel originale utilizzava 5 DLL Windows per funzioni normative. Le abbiamo reimplementate in Python puro.

      ## Le funzioni DLL

      - **PW_NORMA(q_ref, h)**: pressione vento normativa secondo C25/FEM
      - **MW_TORRE(m, e, ecc)**: momento vento su torre (in servizio)
      - **MW_OUT_TORRE(h, ecc, q)**: momento vento su torre (fuori servizio)
      - **TW_TORRE(m, e, ecc)**: tiro/trazione su torre (in servizio)
      - **TW_OUT_TORRE(h, ecc, q)**: tiro/trazione su torre (fuori servizio)

      ## Come funziona

      Le formule nel database chiamano queste funzioni normalmente:
      \`PW_NORMA(J329, M10)\`

      Il parser riconosce i nomi delle funzioni built-in e chiama l'implementazione Python corrispondente.

      ## Vantaggi

      - Nessuna dipendenza da DLL Windows
      - Funziona su qualsiasi piattaforma (Linux, macOS, Windows)
      - Le funzioni sono modificabili nel codice Python
      - Le formule che le chiamano rimangono identiche all'originale
    `,
    date: '1 Giugno 2026',
    read: '5 min',
    tags: ['Tecnologia', 'Python'],
  },
];

export default function BlogPost() {
  const { slug } = useParams();
  const post = allPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <PageLayout title="Articolo non trovato" subtitle="Torna al blog">
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Link to="/blog" className="btn btn-ghost">← Torna al blog</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={post.title} subtitle={`${post.date} · ${post.read}`}>
      <article style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {post.tags.map(t => (
            <span key={t} style={{ padding: '2px 10px', background: '#f9fafb', borderRadius: 999, fontSize: 11, color: '#6b7280', border: '1px solid #e5e7eb' }}>{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.9, color: '#374151' }}>
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('- **')) {
              const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
              if (match) return <div key={i} style={{ marginLeft: 16, marginBottom: 4 }}><strong>{match[1]}</strong>: {match[2]}</div>;
            }
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: 12 }}>{line}</p>;
          })}
        </div>
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
          <Link to="/blog" className="btn btn-ghost">← Torna al blog</Link>
        </div>
      </article>
    </PageLayout>
  );
}

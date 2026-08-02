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
    title: 'Dal foglio Excel al SaaS: il motore Python',
    content: `
      Il calcolo di stabilità è passato da un file Excel con DLL esterne a un motore di calcolo Python, versionato con git e sviluppato progressivamente insieme all'ingegnere strutturista.

      ## Il processo

      1. Analisi del foglio di calcolo originale come riferimento per capire cosa implementare
      2. Scrittura della struttura logica di ogni step (baricentri, vento, stabilità, ...) nei moduli Python
      3. Configurazione dei coefficienti numerici (margini, soglie, costanti) da pannello admin
      4. Verifica dei risultati passo per passo con l'ingegnere

      ## Il risultato

      Il motore di calcolo di SGT esegue le verifiche direttamente in Python, senza importare formule dinamiche. Questo significa che:
      - La struttura logica è versionata e testabile
      - I coefficienti numerici sono configurabili dall'admin con flusso di bozza e pubblicazione
      - Ogni step di calcolo è consultabile nel frontend

      ## Vantaggi per l'ingegnere

      L'ingegnere e il team definiscono insieme, passo dopo passo, ogni modulo di calcolo. I coefficienti numerici possono essere tarati dal pannello amministratore senza toccare il codice.
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

      I dati inseriti dall'utente (macchina, geometria, masse, curve, aree vento, coefficienti) vengono salvati
      nel progetto e usati dal motore Python per calcolare ogni step. La pagina Verifica permette di consultare
      input e risultati di ogni step, passo per passo.

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
      - **Calcoli trasparenti** — ogni step è consultabile e i coefficienti sono configurabili dall'admin

      Con SGT mantieni la stessa precisione di calcolo dell'Excel, aggiungendo accessibilità, sicurezza e collaborazione.
    `,
    date: '10 Giugno 2026',
    read: '4 min',
    tags: ['Business', 'Produttività'],
  },
  {
    slug: 'dll-rimpiazzate-python',
    title: 'DLL Windows rimpiazzate da Python: pressione del vento e le altre',
    content: `
      L'Excel originale utilizzava DLL Windows per alcune funzioni normative (pressione del vento, momenti su torre).
      Nel motore Python di SGT queste funzioni sono reimplementate direttamente nei moduli di calcolo, senza dipendenze esterne.

      ## Le funzioni normative

      - **Pressione del vento normativa** (C25/FEM): legge a tratti in base all'altezza, con fattori configurabili
      - **Momenti del vento** sul braccio e sulla torre
      - **Tiri/trazioni** in configurazione in servizio e fuori servizio

      ## Come funziona

      Ogni funzione è implementata in un modulo Python del motore. I fattori e le soglie numeriche
      (es. pressione di riferimento, coefficienti) sono letti dalla tabella coefficienti e sono
      configurabili dal pannello amministratore, con flusso di bozza e pubblicazione.

      ## Vantaggi

      - Nessuna dipendenza da DLL Windows
      - Funziona su qualsiasi piattaforma (Linux, macOS, Windows)
      - Le funzioni sono versionate con git insieme al resto del motore
      - I coefficienti numerici sono tarabili dall'admin senza toccare il codice
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

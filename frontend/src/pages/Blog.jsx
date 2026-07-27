import PageLayout from '../components/PageLayout';

const posts = [
  {
    title: "Cos'è la verifica di stabilità di una gru a torre?",
    excerpt: 'La verifica di stabilità è un passaggio obbligatorio per garantire che la gru rimanga in equilibrio in ogni condizione di carico e vento. Secondo la normativa C25/FEM, devono essere verificate sia la configurazione a quadrato (Q) che quella in diagonale (D), considerando 12 condizioni di carico ciascuna (P01..P12).',
    date: '15 Luglio 2026',
    read: '5 min',
    tags: ['Normativa', 'C25/FEM'],
  },
  {
    title: 'Dal foglio Excel al SaaS: 55.031 formule trasformate',
    excerpt: 'Abbiamo analizzato il file Excel di calcolo stabilità, estratto tutte le formule da 18 fogli di lavoro e le abbiamo importate in un database SQLite. Il risultato: 55.031 formule perfettamente identiche all\'originale, accessibili via API e modificabili dal frontend. L\'ingegnere continua a lavorare con Excel, il SaaS si sincronizza.',
    date: '8 Luglio 2026',
    read: '4 min',
    tags: ['Tecnologia', 'SaaS'],
  },
  {
    title: 'Normativa C25/FEM: come certificare la stabilità di una gru',
    excerpt: 'La normativa C25/FEM definisce i requisiti per la verifica di stabilità delle gru a torre. I coefficienti di sicurezza minimi, le condizioni di carico da considerare (carico utile, vento in servizio e fuori servizio, neve, azioni dinamiche) e i metodi di calcolo per i momenti ribaltanti e stabilizzanti.',
    date: '28 Giugno 2026',
    read: '6 min',
    tags: ['Normativa', 'Sicurezza'],
  },
  {
    title: 'Wizard a 6 passi: come inserire i dati per il calcolo',
    excerpt: 'Il wizard di SGT guida l\'utente attraverso 6 passaggi: caratteristiche macchina (sbraccio, carichi), geometria braccio (quote, profili), masse proprie (componenti), curve di carico (raggi), aree vento (coefficienti) e coefficienti stabilità. Ogni passo corrisponde a un foglio dell\'Excel originale.',
    date: '20 Giugno 2026',
    read: '3 min',
    tags: ['Guida', 'Wizard'],
  },
  {
    title: 'Perché digitalizzare il calcolo di stabilità?',
    excerpt: 'Il foglio Excel per il calcolo di stabilità è uno strumento potente ma ha limiti: difficile da condividere, soggetto a errori di versione, accessibile solo da chi ha Excel installato. La versione SaaS risolve questi problemi mantenendo la stessa precisione di calcolo e offrendo accesso da qualsiasi dispositivo.',
    date: '10 Giugno 2026',
    read: '4 min',
    tags: ['Business', 'Produttività'],
  },
  {
    title: 'DLL Windows rimpiazzate da Python: PW_NORMA, MW_TORRE e le altre',
    excerpt: 'L\'Excel originale utilizzava 5 DLL Windows per funzioni normative (PW_NORMA per pressione vento, MW_TORRE e MW_OUT_TORRE per momenti vento su torre, TW_TORRE e TW_OUT_TORRE per trazioni). Le abbiamo reimplementate in Python puro, senza bisogno di decompilazione. Le formule che le chiamano funzionano identiche.',
    date: '1 Giugno 2026',
    read: '5 min',
    tags: ['Tecnologia', 'Python'],
  },
];

export default function Blog() {
  return (
    <PageLayout title="Blog" subtitle="Articoli, guide e novità sul mondo della stabilità delle gru a torre">
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gap: 24 }}>
          {posts.map(p => (
            <article key={p.title} style={{
              background: '#fff', borderRadius: 10, padding: 28,
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#9ca3af', alignItems: 'center' }}>
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.read} lettura</span>
              </div>
              <h2 style={{ fontSize: 18, marginBottom: 8 }}>{p.title}</h2>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{p.excerpt}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    padding: '2px 10px', background: '#f9fafb', borderRadius: 999,
                    fontSize: 11, color: '#6b7280', border: '1px solid #e5e7eb',
                  }}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

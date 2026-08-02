import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const posts = [
  {
    slug: 'verifica-di-stabilita-gru',
    title: "Cos'è la verifica di stabilità di una gru a torre?",
    excerpt: 'La verifica di stabilità è un passaggio obbligatorio per garantire che la gru rimanga in equilibrio in ogni condizione di carico e vento. Secondo la normativa C25/FEM, devono essere verificate sia la configurazione a quadrato (Q) che quella in diagonale (D).',
    date: '15 Luglio 2026',
    read: '5 min',
    tags: ['Normativa', 'C25/FEM'],
  },
  {
    slug: 'da-excel-a-saas',
    title: 'Dal foglio Excel al SaaS: il motore Python',
    excerpt: 'Il calcolo di stabilità è passato da un file Excel con DLL esterne a un motore Python versionato con git e sviluppato progressivamente con l\'ingegnere strutturista. I coefficienti numerici sono configurabili da pannello admin.',
    date: '8 Luglio 2026',
    read: '4 min',
    tags: ['Tecnologia', 'SaaS'],
  },
  {
    slug: 'normativa-c25-fem',
    title: 'Normativa C25/FEM: come certificare la stabilità di una gru',
    excerpt: 'La normativa C25/FEM definisce i requisiti per la verifica di stabilità delle gru a torre. I coefficienti di sicurezza minimi, le condizioni di carico da considerare e i metodi di calcolo per i momenti ribaltanti e stabilizzanti.',
    date: '28 Giugno 2026',
    read: '6 min',
    tags: ['Normativa', 'Sicurezza'],
  },
  {
    slug: 'wizard-6-passi',
    title: 'Wizard a 6 passi: come inserire i dati per il calcolo',
    excerpt: 'Il wizard di SGT guida l\'utente attraverso 6 passaggi: caratteristiche macchina, geometria braccio, masse proprie, curve di carico, aree vento e coefficienti stabilità.',
    date: '20 Giugno 2026',
    read: '3 min',
    tags: ['Guida', 'Wizard'],
  },
  {
    slug: 'digitalizzare-calcolo-stabilita',
    title: 'Perché digitalizzare il calcolo di stabilità?',
    excerpt: 'Il foglio Excel per il calcolo di stabilità ha limiti: difficile da condividere, soggetto a errori di versione, accessibile solo da chi ha Excel. La versione SaaS risolve questi problemi mantenendo la stessa precisione di calcolo.',
    date: '10 Giugno 2026',
    read: '4 min',
    tags: ['Business', 'Produttività'],
  },
  {
    slug: 'dll-rimpiazzate-python',
    title: 'DLL Windows rimpiazzate da Python: PW_NORMA, MW_TORRE e le altre',
    excerpt: 'L\'Excel originale utilizzava DLL Windows per funzioni normative. Nel motore Python di SGT sono reimplementate direttamente nei moduli di calcolo, con fattori configurabili da pannello admin.',
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
            <Link key={p.slug} to={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <article style={{
                background: '#fff', borderRadius: 10, padding: 28,
                border: '1px solid #e5e7eb', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D4A017'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#9ca3af', alignItems: 'center' }}>
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.read} lettura</span>
                </div>
                <h2 style={{ fontSize: 18, marginBottom: 8, color: '#1e1e2e' }}>{p.title}</h2>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{p.excerpt}</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ padding: '2px 10px', background: '#f9fafb', borderRadius: 999, fontSize: 11, color: '#6b7280', border: '1px solid #e5e7eb' }}>{t}</span>
                  ))}
                  <span style={{ fontSize: 12, color: '#D4A017', marginLeft: 'auto', fontWeight: 600 }}>Leggi →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

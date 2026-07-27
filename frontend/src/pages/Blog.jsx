import PageLayout from '../components/PageLayout';

const posts = [
  { title: 'Cos\'è la verifica di stabilità di una gru a torre?', excerpt: 'La verifica di stabilità è un passaggio obbligatorio per garantire la sicurezza della gru in ogni condizione di carico e vento. Ecco cosa prevede la normativa C25/FEM.', date: 'Luglio 2026', read: '5 min' },
  { title: 'Dal foglio Excel al SaaS: la trasformazione digitale', excerpt: 'Come abbiamo trasformato 55.000 formule da un file Excel in un\'applicazione web moderna, mantenendo la stessa precisione di calcolo.', date: 'Giugno 2026', read: '4 min' },
  { title: 'Normativa C25/FEM: cosa cambia per la sicurezza delle gru', excerpt: 'Panoramica della normativa C25/FEM per la stabilità delle gru a torre e come il software SGT aiuta a rispettarla.', date: 'Maggio 2026', read: '6 min' },
];

export default function Blog() {
  return (
    <PageLayout title="Blog" subtitle="Articoli, guide e novità sul mondo della stabilità delle gru a torre">
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          {posts.map(p => (
            <div key={p.title} style={{
              background: '#fff', borderRadius: 10, padding: 24,
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12, color: '#9ca3af' }}>
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.read}</span>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{p.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{p.excerpt}</p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, color: '#9ca3af', fontSize: 13 }}>Nuovi articoli in arrivo.</p>
      </section>
    </PageLayout>
  );
}

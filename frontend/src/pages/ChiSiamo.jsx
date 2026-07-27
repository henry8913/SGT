import PageLayout from '../components/PageLayout';

export default function ChiSiamo() {
  return (
    <PageLayout title="Chi siamo" subtitle="KG 26.5 — Soluzioni per il calcolo di stabilità delle gru a torre">
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img src="/favicon.svg" alt="" style={{ width: 72, height: 72, marginBottom: 16 }} />
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>La nostra storia</h2>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>
            SGT nasce dall'esperienza di KG 26.5 nel settore del sollevamento e della certificazione
            di stabilità delle gru a torre. Il tradizionale foglio Excel di calcolo, utilizzato per
            anni dai tecnici del settore, è stato trasformato in un software web moderno e accessibile.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 24, marginBottom: 48 }}>
          {[
            { nome: 'Admin & Developer', ruolo: 'Sviluppo e manutenzione della piattaforma', iniziali: 'AD' },
            { nome: 'Team Tecnico KG 26.5', ruolo: 'Ingegneri esperti in stabilità e certificazione gru', iniziali: 'KG' },
          ].map(m => (
            <div key={m.nome} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 20, background: '#f9fafb', borderRadius: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>{m.iniziali}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.nome}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{m.ruolo}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 32, textAlign: 'center' }}>
          <h3 style={{ marginBottom: 12 }}>Contattaci</h3>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
            Per informazioni, preventivi o demo: info@sgt.henrydev.it
          </p>
          <a href="mailto:info@sgt.henrydev.it" className="btn btn-yellow" style={{ color: '#fff' }}>Scrivici</a>
        </div>
      </section>
    </PageLayout>
  );
}

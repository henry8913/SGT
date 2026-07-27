import PageLayout from '../components/PageLayout';

export default function ChiSiamo() {
  return (
    <PageLayout title="Chi siamo" subtitle="KG 26.5 — Soluzioni per il calcolo di stabilità delle gru a torre">
      {/* Storia */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>La nostra storia</h2>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8 }}>
            SGT nasce dall'esperienza decennale di <strong>KG 26.5</strong> nel settore del sollevamento
            e della certificazione di stabilità delle gru a torre. Il tradizionale foglio Excel di calcolo,
            utilizzato per anni dai tecnici del settore con oltre 55.000 formule, è stato trasformato in
            un software web moderno, accessibile da qualsiasi dispositivo.
          </p>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8, marginTop: 12 }}>
            L'obiettivo è semplice: mantenere la precisione e l'affidabilità del calcolo Excel, offrendo
            un'interfaccia moderna, collaborativa e sempre aggiornata. Il tuo ingegnere continua a lavorare
            con Excel, il SaaS si sincronizza automaticamente.
          </p>
        </div>

        {/* Team */}
        <h2 style={{ fontSize: 22, textAlign: 'center', marginBottom: 32 }}>Il team</h2>
        <div style={{ display: 'grid', gap: 20, marginBottom: 48 }}>
          {[
            { nome: 'Amministratore SGT', ruolo: 'Sviluppo e gestione della piattaforma', bio: 'Responsabile dello sviluppo, del deploy e della manutenzione del SaaS. Gestisce gli utenti e l\'infrastruttura.', iniziali: 'AD' },
            { nome: 'Team Tecnico KG 26.5', ruolo: 'Ingegneri esperti in stabilità e certificazione gru', bio: 'Il team di ingegneri che ha progettato e verificato le formule di calcolo. Anni di esperienza nel settore del sollevamento e della certificazione C25/FEM.', iniziali: 'KG' },
          ].map(m => (
            <div key={m.nome} style={{ background: '#f9fafb', borderRadius: 12, padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#D4A017', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{m.iniziali}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{m.nome}</div>
                <div style={{ color: '#D4A017', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{m.ruolo}</div>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Valori */}
        <h2 style={{ fontSize: 22, textAlign: 'center', marginBottom: 32 }}>I nostri valori</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            { icon: '🎯', titolo: 'Precisione', desc: 'Ogni calcolo deve essere accurato e verificabile. Le formule sono le stesse del foglio Excel originale.' },
            { icon: '🔍', titolo: 'Trasparenza', desc: 'Tutte le formule sono visibili e controllabili dal frontend. L\'ingegnere verifica ogni passaggio.' },
            { icon: '🔄', titolo: 'Evoluzione', desc: 'Dal foglio Excel al SaaS. Manteniamo il meglio del passato con la potenza del moderno.' },
            { icon: '🤝', titolo: 'Collaborazione', desc: 'Il tuo ingegnere lavora con Excel, tu usi il SaaS. Due strumenti, un unico risultato.' },
          ].map(v => (
            <div key={v.titolo} style={{ textAlign: 'center', padding: 24, background: '#f9fafb', borderRadius: 10 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 6 }}>{v.titolo}</h3>
              <p style={{ color: '#6b7280', fontSize: 13 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Contatto diretto */}
        <div style={{ background: '#1e1e2e', borderRadius: 12, padding: 40, textAlign: 'center', color: '#fff' }}>
          <h3 style={{ color: '#fff', fontSize: 20, marginBottom: 12 }}>Contattaci</h3>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            Per informazioni, preventivi o una demo personalizzata del software.
          </p>
          <a href="mailto:info@sgt.henrydev.it" className="btn btn-yellow" style={{ color: '#fff', padding: '12px 28px' }}>
            info@sgt.henrydev.it
          </a>
        </div>
      </section>
    </PageLayout>
  );
}

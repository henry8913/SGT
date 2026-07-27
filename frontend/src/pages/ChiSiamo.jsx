import PageLayout from '../components/PageLayout';

const team = [
  {
    nome: 'Mario G.',
    ruolo: 'CEO & Co-Founder',
    bio: 'Ingegnere meccanico con anni di esperienza nei cantieri e nella certificazione di stabilità delle gru a torre. Porta la voce del cliente all\'interno del software e garantisce che ogni calcolo rispecchi fedelmente le reali esigenze del settore del sollevamento.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    nome: 'Elena F.',
    ruolo: 'QA & Certification Specialist',
    bio: 'Responsabile della verifica dei calcoli di stabilità e della conformità alle normative C25/FEM. Monitora costantemente la correttezza delle 55.000+ formule importate dall\'Excel. Il suo obiettivo: zero errori, massima affidabilità.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    nome: 'Henry G.',
    ruolo: 'CTO & Co-Founder',
    bio: 'Ha fondato SGT insieme a Mario, trasformando il foglio Excel di calcolo stabilità in un SaaS moderno. Scrive il codice, progetta l\'architettura e supervisiona ogni dettaglio tecnico della piattaforma. Appassionato di automazione e qualità del software.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    nome: 'Sofia R.',
    ruolo: 'Sales & Customer Success',
    bio: 'Gestisce le relazioni con i clienti e cura lo sviluppo commerciale di SGT. Accompagna ogni azienda dalla prima demo fino all\'attivazione, garantendo che il software risponda perfettamente alle esigenze di certificazione di stabilità.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face&q=80',
  },
];

const stats = [
  { value: '15+', label: 'Anni di esperienza nel settore' },
  { value: '55.031', label: 'Formule di calcolo importate' },
  { value: '18', label: 'Fogli Excel integrati' },
  { value: '100%', label: 'Trasparenza dei calcoli' },
];

const values = [
  { icon: '🎯', title: 'Precisione', desc: 'Costruiamo strumenti affidabili: ogni calcolo è verificato e corrisponde esattamente alle formule del foglio Excel originale. Nessuna approssimazione.' },
  { icon: '🔍', title: 'Trasparenza', desc: 'Output spiegabili, nessuna black box. Ogni formula è visibile con un clic sul pulsante [fx]. L\'ingegnere vede il dato e verifica la correttezza.' },
  { icon: '👤', title: 'Human-in-the-loop', desc: 'Il software calcola, l\'ingegnere verifica. La responsabilità della conformità resta del tecnico qualificato. Le formule sono modificabili e controllabili.' },
  { icon: '🔒', title: 'Sicurezza', desc: 'Tenant isolati, autenticazione robusta, password crittografate. I progetti e i dati di ogni utente restano privati e protetti.' },
];

export default function ChiSiamo() {
  return (
    <PageLayout title="Chi siamo" subtitle="KG 26.5 — Soluzioni per il calcolo di stabilità delle gru a torre">
      {/* Hero section */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>Software per il calcolo di stabilità,<br />controllo all'ingegnere</h2>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8 }}>
            SGT nasce per eliminare il lavoro ripetitivo dalla verifica di stabilità delle gru a torre,
            mantenendo il controllo totale del tecnico su ogni calcolo. Il tradizionale foglio Excel
            con oltre 55.000 formule è stato trasformato in un SaaS moderno, accessibile da qualsiasi dispositivo.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20,
          background: '#1e1e2e', borderRadius: 12, padding: '32px 24px', marginBottom: 48,
          textAlign: 'center',
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#D4A017' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Why SGT exists */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Perché esiste SGT</h2>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8, marginBottom: 12 }}>
            Nei cantieri e negli uffici tecnici, la verifica di stabilità delle gru a torre è uno dei
            documenti più critici: decine di parametri da inserire, formule da verificare, condizioni
            di carico da controllare, coefficienti di sicurezza da rispettare.
          </p>
          <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8 }}>
            Questo lavoro richiede ore di ingegneria qualificata, è soggetto a errori di trascrizione
            e rallenta la certificazione della macchina. SGT digitalizza l'intero processo, mantenendo
            la stessa precisione del calcolo Excel e aggiungendo accessibilità, collaborazione e trasparenza.
          </p>
        </div>

        {/* Team */}
        <h2 style={{ fontSize: 22, marginBottom: 8, textAlign: 'center' }}>Il team</h2>
        <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 40 }}>
          Un team affiatato di ingegneri software, specialisti di calcolo e professionisti del sollevamento.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginBottom: 48 }}>
          {team.map(m => (
            <div key={m.nome} style={{ display: 'flex', gap: 20, background: '#f9fafb', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
              <img src={m.img} alt={m.nome} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{m.nome}</div>
                <div style={{ color: '#D4A017', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{m.ruolo}</div>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Small team note */}
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 24, marginBottom: 48, textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: 8 }}>Piccolo team, alta specializzazione</h3>
          <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
            SGT è sviluppato da un team compatto di ingegneri software e professionisti con esperienza
            nel settore del sollevamento e della certificazione gru. Crediamo nel software ben fatto,
            nelle iterazioni rapide e nel contatto diretto con chi usa il prodotto.
          </p>
        </div>

        {/* Valori */}
        <h2 style={{ fontSize: 22, textAlign: 'center', marginBottom: 32 }}>I nostri valori</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 48 }}>
          {values.map(v => (
            <div key={v.title} style={{ textAlign: 'center', padding: 28, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>{v.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

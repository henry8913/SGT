import { useState } from 'react';
import PageLayout from '../components/PageLayout';

export default function Contatto() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageLayout title="Contatto" subtitle="Richiedi informazioni, un preventivo o una demo">
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: 48, background: '#f9fafb', borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📨</div>
            <h3 style={{ marginBottom: 8 }}>Richiesta inviata!</h3>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Ti risponderemo al più presto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Nome</label>
              <input required placeholder="Il tuo nome" style={{ background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Email</label>
              <input type="email" required placeholder="email@esempio.it" style={{ background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Azienda</label>
              <input placeholder="KG 26.5" style={{ background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Messaggio</label>
              <textarea rows={5} required placeholder="Cosa possiamo fare per te?" style={{ background: '#fff' }} />
            </div>
            <button type="submit" className="btn btn-yellow" style={{ width: '100%', justifyContent: 'center', color: '#fff' }}>
              Invia richiesta
            </button>
            <p style={{ marginTop: 12, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
              Oppure scrivici a info@sgt.henrydev.it
            </p>
          </form>
        )}
      </section>
    </PageLayout>
  );
}

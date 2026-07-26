import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calculate } from '../../api/client';

export default function Stabilita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stabQ, setStabQ] = useState(null);
  const [stabD, setStabD] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await calculate.results(id);
        for (const r of res.data) {
          const dati = typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati;
          if (r.step === 'stabilita_q') setStabQ(dati);
          if (r.step === 'stabilita_d') setStabD(dati);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const renderTable = (title, data) => {
    if (!data) return null;
    return (
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>{title}</h3>
        <div style={{ background: data.overall_esito === 'OK' ? '#e8f5e9' : '#ffebee', padding: '8px 16px', borderRadius: 4, marginBottom: 12, display: 'inline-block', fontSize: 14 }}>
          Esito complessivo: <strong>{data.overall_esito}</strong>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Cond.</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>V (kg)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Mr (kgm)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Mw (kgm)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Mtot (kgm)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>T (kg)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Coeff. Sic.</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Esito</th>
              </tr>
            </thead>
            <tbody>
              {data.conditions?.map(c => (
                <tr key={c.condition_id} style={{ background: c.esito === 'OK' ? '#fff' : '#fff3e0' }}>
                  <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{c.condition_id}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.v?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.mr?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.mw?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.mtot?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.t?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{c.safety_coefficient}</td>
                  <td style={{
                    padding: 8, border: '1px solid #ddd', fontWeight: 600,
                    color: c.esito === 'OK' ? '#2e7d32' : '#c62828',
                  }}>{c.esito}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(`/progetto/${id}/carichi`)} style={{ padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Carichi Ralla
        </button>
        <button onClick={() => navigate(`/progetto/${id}/diagramma`)} style={{ padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Diagramma Carico
        </button>
      </div>

      {!stabQ && !stabD && <p style={{ color: '#999' }}>Nessun risultato disponibile. Esegui il calcolo dal wizard.</p>}
      {renderTable('Stabilità C25 - Configurazione Quadrato (Q)', stabQ)}
      {renderTable('Stabilità C25 - Configurazione Diagonale (D)', stabD)}
    </div>
  );
}

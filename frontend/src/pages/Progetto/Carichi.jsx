import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calculate } from '../../api/client';

export default function Carichi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carichi, setCarichi] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await calculate.results(id);
        for (const r of res.data) {
          if (r.step === 'carichi_ralla') {
            setCarichi(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati);
          }
        }
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate(`/progetto/${id}/stabilita`)} style={{ padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Dashboard Stabilità
        </button>
        <button onClick={() => navigate(`/progetto/${id}/diagramma`)} style={{ padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Diagramma Carico
        </button>
      </div>

      <h2 style={{ marginBottom: 16 }}>Carichi Ralla e Base</h2>

      {!carichi ? (
        <p style={{ color: '#999' }}>Nessun risultato disponibile.</p>
      ) : (
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
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Mtot OUT/IN</th>
              </tr>
            </thead>
            <tbody>
              {carichi.conditions?.map(c => (
                <tr key={c.condition_id}>
                  <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{c.condition_id}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.v?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.mr?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.mw?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.mtot?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{c.t?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{c.mtot_out_in_ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

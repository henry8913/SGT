import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { calculate } from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Diagramma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagramma, setDiagramma] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await calculate.results(id);
        for (const r of res.data) {
          if (r.step === 'diagramma') {
            setDiagramma(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati);
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
        <button onClick={() => navigate(`/progetto/${id}/carichi`)} style={{ padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Carichi Ralla
        </button>
      </div>

      <h2 style={{ marginBottom: 16 }}>Diagramma di Carico</h2>

      {!diagramma ? (
        <p style={{ color: '#999' }}>Nessun risultato disponibile.</p>
      ) : (
        <>
          <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Grafico carico / raggio</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={diagramma.points || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="raggio" label={{ value: 'Raggio (m)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Carico (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="carico_max" fill="#1a237e" name="Carico max" />
                <Bar dataKey="carico_effettivo" fill="#4caf50" name="Carico effettivo" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ overflowX: 'auto', background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginBottom: 16 }}>Tabella carico / raggio</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Raggio (m)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Carico max (kg)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Carico effettivo (kg)</th>
                </tr>
              </thead>
              <tbody>
                {diagramma.points?.map((p, i) => (
                  <tr key={i}>
                    <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{p.raggio}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.carico_max?.toLocaleString()}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.carico_effettivo?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

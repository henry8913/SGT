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
      <div className="page-header flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1>Diagramma di Carico</h1>
          <p>Grafico e tabella carico / raggio</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/progetto/${id}/stabilita`)} className="btn btn-ghost btn-sm">Stabilità</button>
          <button onClick={() => navigate(`/progetto/${id}/carichi`)} className="btn btn-ghost btn-sm">Carichi</button>
        </div>
      </div>

      {!diagramma ? (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-secondary)' }}>
          Nessun risultato disponibile.
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">Grafico carico / raggio</div>
            <div className="card-body">
              <div style={{ width: '100%', height: 400, overflowX: 'auto' }}>
                <div style={{ minWidth: 500, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diagramma.points || []} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="raggio" label={{ value: 'Raggio (m)', position: 'insideBottom', offset: -10 }} tick={{ fontSize: 12 }} />
                      <YAxis label={{ value: 'Carico (kg)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="carico_max" fill="#D4A017" name="Carico max" radius={[4,4,0,0]} />
                      <Bar dataKey="carico_effettivo" fill="var(--accent)" name="Carico effettivo" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Tabella carico / raggio</div>
            <div className="card-body">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Raggio (m)</th>
                      <th>Carico max (kg)</th>
                      <th>Carico effettivo (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagramma.points?.map((p, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{p.raggio}</td>
                        <td>{p.carico_max?.toLocaleString()}</td>
                        <td>{p.carico_effettivo?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

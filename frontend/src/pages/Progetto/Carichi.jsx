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
      <div className="page-header flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1>Carichi Ralla e Base</h1>
          <p>V, Mr, Mw, Mtot, T per condizioni P01, P02, P03</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/progetto/${id}/stabilita`)} className="btn btn-ghost btn-sm">Stabilità</button>
          <button onClick={() => navigate(`/progetto/${id}/diagramma`)} className="btn btn-ghost btn-sm">Diagramma</button>
        </div>
      </div>

      {!carichi ? (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-secondary)' }}>
          Nessun risultato disponibile.
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cond.</th>
                    <th>V (kg)</th>
                    <th>Mr (kgm)</th>
                    <th>Mw (kgm)</th>
                    <th>Mtot (kgm)</th>
                    <th>T (kg)</th>
                    <th>Mtot OUT/IN</th>
                  </tr>
                </thead>
                <tbody>
                  {carichi.conditions?.map(c => (
                    <tr key={c.condition_id}>
                      <td style={{ fontWeight: 600 }}>{c.condition_id}</td>
                      <td>{c.v?.toLocaleString()}</td>
                      <td>{c.mr?.toLocaleString()}</td>
                      <td>{c.mw?.toLocaleString()}</td>
                      <td>{c.mtot?.toLocaleString()}</td>
                      <td>{c.t?.toLocaleString()}</td>
                      <td style={{ fontWeight: 600 }}>{c.mtot_out_in_ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

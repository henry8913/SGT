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
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  const renderTable = (title, data) => {
    if (!data) return null;
    return (
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header flex justify-between items-center">
          <span>{title}</span>
          <span className={`badge ${data.overall_esito === 'OK' ? 'badge-ok' : 'badge-ko'}`}>
            {data.overall_esito === 'OK' ? '✔ OK' : '✘ KO'}
          </span>
        </div>
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
                  <th>Coeff. Sic.</th>
                  <th>Esito</th>
                </tr>
              </thead>
              <tbody>
                {data.conditions?.map(c => (
                  <tr key={c.condition_id}>
                    <td style={{ fontWeight: 600 }}>
                      {c.condition_id}
                    </td>
                    <td>{c.v?.toLocaleString()}</td>
                    <td>{c.mr?.toLocaleString()}</td>
                    <td>{c.mw?.toLocaleString()}</td>
                    <td>{c.mtot?.toLocaleString()}</td>
                    <td>{c.t?.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{c.safety_coefficient}</td>
                    <td>
                      <span className={`badge ${c.esito === 'OK' ? 'badge-ok' : 'badge-ko'}`}>
                        {c.esito}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1>Stabilità</h1>
          <p>Dashboard stabilità Q + D</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/progetto/${id}/carichi`)} className="btn btn-ghost btn-sm">Carichi Ralla</button>
          <button onClick={() => navigate(`/progetto/${id}/diagramma`)} className="btn btn-ghost btn-sm">Diagramma Carico</button>
        </div>
      </div>
      {!stabQ && !stabD && <p style={{ color: 'var(--text-secondary)', padding: 32, textAlign: 'center' }}>Nessun risultato. Esegui il calcolo dal wizard.</p>}
      {renderTable('Configurazione Quadrato (Q)', stabQ)}
      {renderTable('Configurazione Diagonale (D)', stabD)}
    </div>
  );
}

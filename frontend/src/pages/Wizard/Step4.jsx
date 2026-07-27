import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadCurves } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

const radii = Array.from({ length: 13 }, (_, i) => 5 + i * 5);

export default function Step4() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [curves, setCurves] = useState([]);

  useEffect(() => {
    if (projectId) loadCurves.list(projectId).then(r => setCurves(r.data)).catch(() => {});
  }, [projectId]);

  const getCurve = (tipo, raggio) => curves.find(c => c.tipo === tipo && c.raggio_m === raggio);
  const setCurve = (tipo, raggio, value) => {
    const existing = curves.findIndex(c => c.tipo === tipo && c.raggio_m === raggio);
    const payload = { tipo, raggio_m: raggio, carico_kg: value ? parseFloat(value) : null };
    if (existing >= 0) { const u = [...curves]; u[existing] = { ...u[existing], ...payload }; setCurves(u); }
    else setCurves(prev => [...prev, payload]);
  };

  const saveAll = async () => {
    for (const c of curves) {
      if (c.id) await loadCurves.update(projectId, c.id, c).catch(() => {});
      else await loadCurves.create(projectId, c).catch(() => {});
    }
    navigate(`/nuovo-progetto/step-5?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Curve di carico" description="Carichi massimi per ogni raggio">
      <div className="card">
        <div className="card-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Raggio (m)</th><th>Tiro II (kg)</th><th>Tiro II/IV (kg)</th></tr>
              </thead>
              <tbody>
                {radii.map(r => (
                  <tr key={r}>
                    <td style={{ fontWeight: 600 }}>{r}</td>
                    <td><input type="number" value={getCurve('II', r)?.carico_kg ?? ''} onChange={e => setCurve('II', r, e.target.value)} style={{ background: '#fffdf5' }} /></td>
                    <td><input type="number" value={getCurve('II/IV', r)?.carico_kg ?? ''} onChange={e => setCurve('II/IV', r, e.target.value)} style={{ background: '#fffdf5' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 justify-between" style={{ marginTop: 24 }}>
            <button onClick={() => navigate(`/nuovo-progetto/step-3?projectId=${projectId}`)} className="btn btn-ghost">← Indietro</button>
            <button onClick={saveAll} className="btn btn-crane">Salva e continua →</button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

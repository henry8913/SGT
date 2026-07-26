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

  const getCurve = (tipo, raggio) => {
    return curves.find(c => c.tipo === tipo && c.raggio_m === raggio);
  };

  const setCurve = (tipo, raggio, value) => {
    const existing = curves.findIndex(c => c.tipo === tipo && c.raggio_m === raggio);
    const payload = { tipo, raggio_m: raggio, carico_kg: value ? parseFloat(value) : null };
    if (existing >= 0) {
      const updated = [...curves];
      updated[existing] = { ...updated[existing], ...payload };
      setCurves(updated);
    } else {
      setCurves(prev => [...prev, payload]);
    }
  };

  const saveAll = async () => {
    for (const c of curves) {
      if (c.id) await loadCurves.update(projectId, c.id, c).catch(() => {});
      else await loadCurves.create(projectId, c).catch(() => {});
    }
    navigate(`/nuovo-progetto/step-5?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Curve di carico" description="Inserisci i carichi massimi per ogni raggio">
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Raggio (m)</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Tiro II (kg)</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Tiro II/IV (kg)</th>
            </tr>
          </thead>
          <tbody>
            {radii.map(r => (
              <tr key={r}>
                <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{r}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  <input type="number"
                    value={getCurve('II', r)?.carico_kg ?? ''}
                    onChange={e => setCurve('II', r, e.target.value)}
                    style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, background: '#f9f9f9', boxSizing: 'border-box' }}
                  />
                </td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  <input type="number"
                    value={getCurve('II/IV', r)?.carico_kg ?? ''}
                    onChange={e => setCurve('II/IV', r, e.target.value)}
                    style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, background: '#f9f9f9', boxSizing: 'border-box' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate(`/nuovo-progetto/step-3?projectId=${projectId}`)} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Indietro
          </button>
          <button onClick={saveAll} style={{ padding: '10px 20px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Salva e continua
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}

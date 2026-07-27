import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { masses } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

export default function Step3() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (projectId) masses.list(projectId).then(r => setItems(r.data)).catch(() => {});
  }, [projectId]);

  const addItem = () => setItems(prev => [...prev, { componente: '', massa_kg: '', braccio_m: '', utilizzato: true }]);
  const updateItem = (idx, key, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    setItems(updated);
  };

  const saveAll = async () => {
    for (const item of items) {
      const payload = { ...item, massa_kg: item.massa_kg ? parseFloat(item.massa_kg) : null, braccio_m: item.braccio_m ? parseFloat(item.braccio_m) : null };
      if (item.id) await masses.update(projectId, item.id, payload).catch(() => {});
      else await masses.create(projectId, payload).catch(() => {});
    }
    navigate(`/nuovo-progetto/step-4?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Masse proprie" description="Masse dei componenti della gru">
      <div className="card">
        <div className="card-body">
          <button onClick={addItem} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>+ Aggiungi massa</button>
          {items.length === 0 && <p style={{ color: 'var(--gray)', fontSize: 14 }}>Nessuna massa inserita.</p>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Componente</th><th>Massa (kg)</th><th>Braccio (m)</th><th>Usato</th></tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td><input value={item.componente} onChange={e => updateItem(i, 'componente', e.target.value)} placeholder="Carrello" style={{ background: '#fff' }} /></td>
                    <td><input type="number" value={item.massa_kg} onChange={e => updateItem(i, 'massa_kg', e.target.value)} placeholder="kg" style={{ background: '#fff' }} /></td>
                    <td><input type="number" value={item.braccio_m} onChange={e => updateItem(i, 'braccio_m', e.target.value)} placeholder="m" style={{ background: '#fff' }} /></td>
                    <td><input type="checkbox" checked={item.utilizzato} onChange={e => updateItem(i, 'utilizzato', e.target.checked)} style={{ width: 'auto' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 justify-between" style={{ marginTop: 24 }}>
            <button onClick={() => navigate(`/nuovo-progetto/step-2?projectId=${projectId}`)} className="btn btn-ghost">← Indietro</button>
            <button onClick={saveAll} className="btn btn-yellow">Salva e continua →</button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

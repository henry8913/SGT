import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { geometry } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

export default function Step2() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (projectId) geometry.list(projectId).then(r => setItems(r.data)).catch(() => {});
  }, [projectId]);

  const addItem = () => setItems(prev => [...prev, { modulo: '', elemento: '', profilo: '', interasse_vert_sx: '', interasse_vert_dx: '' }]);

  const updateItem = (idx, key, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    setItems(updated);
  };

  const saveAll = async () => {
    for (const item of items) {
      if (item.id) await geometry.update(projectId, item.id, item).catch(() => {});
      else await geometry.create(projectId, item).catch(() => {});
    }
    navigate(`/nuovo-progetto/step-3?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Geometria braccio" description="Quote geometriche e profili degli elementi strutturali">
      <div className="card">
        <div className="card-body">
          <button onClick={addItem} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>+ Aggiungi elemento</button>
          {items.length === 0 && <p style={{ color: 'var(--gray)', fontSize: 14 }}>Nessun elemento inserito.</p>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Modulo</th><th>Elemento</th><th>Profilo</th><th>Int. V. SX</th><th>Int. V. DX</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td><input value={item.modulo} onChange={e => updateItem(i, 'modulo', e.target.value)} placeholder="ELB13" style={{ background: '#fff' }} /></td>
                    <td><input value={item.elemento} onChange={e => updateItem(i, 'elemento', e.target.value)} placeholder="C16" style={{ background: '#fff' }} /></td>
                    <td><input value={item.profilo} onChange={e => updateItem(i, 'profilo', e.target.value)} placeholder="Tubolare 160x160x16" style={{ background: '#fff' }} /></td>
                    <td><input value={item.interasse_vert_sx} onChange={e => updateItem(i, 'interasse_vert_sx', e.target.value)} placeholder="mm" style={{ background: '#fff' }} /></td>
                    <td><input value={item.interasse_vert_dx} onChange={e => updateItem(i, 'interasse_vert_dx', e.target.value)} placeholder="mm" style={{ background: '#fff' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 justify-between" style={{ marginTop: 24 }}>
            <button onClick={() => navigate(`/nuovo-progetto/step-1?projectId=${projectId}`)} className="btn btn-ghost">← Indietro</button>
            <button onClick={saveAll} className="btn btn-accent">Salva e continua →</button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

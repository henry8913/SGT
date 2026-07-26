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

  const addItem = () => {
    setItems(prev => [...prev, { modulo: '', elemento: '', profilo: '', interasse_vert_sx: '', interasse_vert_dx: '' }]);
  };

  const updateItem = (idx, key, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    setItems(updated);
  };

  const saveAll = async () => {
    for (const item of items) {
      if (item.id) {
        await geometry.update(projectId, item.id, item).catch(() => {});
      } else {
        await geometry.create(projectId, item).catch(() => {});
      }
    }
    navigate(`/nuovo-progetto/step-3?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Geometria braccio" description="Inserisci le quote geometriche e i profili degli elementi strutturali">
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <button onClick={addItem} style={{ marginBottom: 16, padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Aggiungi elemento
        </button>
        {items.length === 0 && <p style={{ color: '#999', fontSize: 14 }}>Nessun elemento inserito. Aggiungi un elemento geometrico.</p>}
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input placeholder="Modulo" value={item.modulo} onChange={e => updateItem(i, 'modulo', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 100 }} />
            <input placeholder="Elemento" value={item.elemento} onChange={e => updateItem(i, 'elemento', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 100 }} />
            <input placeholder="Profilo" value={item.profilo} onChange={e => updateItem(i, 'profilo', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 200 }} />
            <input placeholder="Interasse V. SX" value={item.interasse_vert_sx} onChange={e => updateItem(i, 'interasse_vert_sx', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 120 }} />
            <input placeholder="Interasse V. DX" value={item.interasse_vert_dx} onChange={e => updateItem(i, 'interasse_vert_dx', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 120 }} />
          </div>
        ))}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate(`/nuovo-progetto/step-1?projectId=${projectId}`)} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
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

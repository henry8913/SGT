import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { windAreas } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

const parts = ['braccio', 'rotazione', 'controbraccio', 'carico'];

export default function Step5() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (projectId) windAreas.list(projectId).then(r => setItems(r.data)).catch(() => {});
  }, [projectId]);

  const addItem = () => {
    setItems(prev => [...prev, { parte: 'braccio', parametro: '', valore: '', coordinata_x: '', coordinata_y: '' }]);
  };

  const updateItem = (idx, key, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    setItems(updated);
  };

  const saveAll = async () => {
    for (const item of items) {
      const payload = {
        ...item,
        valore: item.valore ? parseFloat(item.valore) : null,
        coordinata_x: item.coordinata_x ? parseFloat(item.coordinata_x) : null,
        coordinata_y: item.coordinata_y ? parseFloat(item.coordinata_y) : null,
      };
      if (item.id) await windAreas.update(projectId, item.id, payload).catch(() => {});
      else await windAreas.create(projectId, payload).catch(() => {});
    }
    navigate(`/nuovo-progetto/step-6?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Aree vento" description="Coefficienti aree vento per braccio, rotazione, controbraccio e carico">
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <button onClick={addItem} style={{ marginBottom: 16, padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Aggiungi area vento
        </button>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <select value={item.parte} onChange={e => updateItem(i, 'parte', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
              {parts.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input placeholder="Parametro" value={item.parametro} onChange={e => updateItem(i, 'parametro', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 120 }} />
            <input placeholder="Valore" type="number" value={item.valore} onChange={e => updateItem(i, 'valore', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 100 }} />
            <input placeholder="Xcs" type="number" value={item.coordinata_x} onChange={e => updateItem(i, 'coordinata_x', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 80 }} />
            <input placeholder="Ycs" type="number" value={item.coordinata_y} onChange={e => updateItem(i, 'coordinata_y', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 80 }} />
          </div>
        ))}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate(`/nuovo-progetto/step-4?projectId=${projectId}`)} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
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

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

  const addItem = () => {
    setItems(prev => [...prev, { componente: '', massa_kg: '', braccio_m: '', utilizzato: true }]);
  };

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
    <StepWrapper title="Masse proprie" description="Inserisci le masse dei componenti della gru">
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <button onClick={addItem} style={{ marginBottom: 16, padding: '8px 16px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Aggiungi massa
        </button>
        {items.length === 0 && <p style={{ color: '#999', fontSize: 14 }}>Nessuna massa inserita.</p>}
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input placeholder="Componente" value={item.componente} onChange={e => updateItem(i, 'componente', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 180 }} />
            <input placeholder="Massa (kg)" type="number" value={item.massa_kg} onChange={e => updateItem(i, 'massa_kg', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 100 }} />
            <input placeholder="Braccio (m)" type="number" value={item.braccio_m} onChange={e => updateItem(i, 'braccio_m', e.target.value)}
              style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 100 }} />
            <label style={{ fontSize: 13 }}>
              <input type="checkbox" checked={item.utilizzato} onChange={e => updateItem(i, 'utilizzato', e.target.checked)} />
              {' '}Usato
            </label>
          </div>
        ))}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate(`/nuovo-progetto/step-2?projectId=${projectId}`)} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
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

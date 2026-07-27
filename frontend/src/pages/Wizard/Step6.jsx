import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { stability } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

const defaultParams = [
  { parametro: 'M3', label: 'Interasse carro (m)', placeholder: '4.5' },
  { parametro: 'M5', label: 'N. rinvii tiro II', placeholder: '2' },
  { parametro: 'M7', label: 'N. rinvii tiro IV', placeholder: '2' },
  { parametro: 'J38', label: 'Massa torre 1 (kg)', placeholder: '250' },
  { parametro: 'J39', label: 'Massa torre 2 (kg)', placeholder: '125' },
  { parametro: 'J40', label: 'Massa torre 3 (kg)', placeholder: '879' },
  { parametro: 'R11', label: 'Pressione vento riferimento (kg/m²)', placeholder: '100' },
  { parametro: 'J30', label: 'Coeff. parziale sicurezza J30', placeholder: '1.1' },
  { parametro: 'J35', label: 'Coeff. parziale sicurezza J35', placeholder: '1.2' },
  { parametro: 'J37', label: 'Coeff. parziale sicurezza J37', placeholder: '1.3' },
  { parametro: 'J329', label: 'Coeff. parziale sicurezza J329', placeholder: '1.5' },
];

export default function Step6() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (projectId) {
      stability.list(projectId).then(r => {
        if (r.data.length > 0) setItems(r.data);
      }).catch(() => {});
    }
  }, [projectId]);

  const getVal = (param) => {
    const found = items.find(i => i.parametro === param);
    return found ? (found.valore ?? '') : '';
  };

  const setVal = (param, value) => {
    const existing = items.findIndex(i => i.parametro === param);
    const payload = { parametro: param, valore: value ? parseFloat(value) : null };
    if (existing >= 0) {
      const updated = [...items];
      updated[existing] = { ...updated[existing], ...payload };
      setItems(updated);
    } else {
      setItems(prev => [...prev, payload]);
    }
  };

  const saveAll = async () => {
    for (const item of items) {
      if (item.id) await stability.update(projectId, item.id, item).catch(() => {});
      else await stability.create(projectId, item).catch(() => {});
    }
    navigate(`/nuovo-progetto/calcola?projectId=${projectId}`);
  };

  return (
    <StepWrapper title="Coefficienti stabilità" description="Parametri e coefficienti per il calcolo di stabilità C25">
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {defaultParams.map(p => (
            <div key={p.parametro}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#333' }}>{p.label}</label>
              <input type="number" step="any"
                value={getVal(p.parametro)}
                onChange={e => setVal(p.parametro, e.target.value)}
                placeholder={p.placeholder}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, background: '#f9f9f9', boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate(`/nuovo-progetto/step-5?projectId=${projectId}`)} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Indietro
          </button>
          <button onClick={saveAll} style={{ padding: '10px 20px', background: #1e1e2e, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Salva e calcola
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}

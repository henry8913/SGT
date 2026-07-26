import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { machine } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

const fields = [
  { key: 'sbraccio_max', label: 'Sbraccio massimo (m)', placeholder: '65' },
  { key: 'carico_punta_tiro2', label: 'Carico utile punta tiro II (kg)', placeholder: '1800' },
  { key: 'carico_punta_tiro24', label: 'Carico utile punta tiro II/IV (kg)', placeholder: '1800' },
  { key: 'carico_max_tiro2', label: 'Carico utile max tiro II (kg)', placeholder: '10000' },
  { key: 'escursione_carrello_tiro2', label: 'Escursione carrello tiro II (m)', placeholder: '16' },
  { key: 'carico_max_tiro24', label: 'Carico utile max tiro II/IV (kg)', placeholder: '10000' },
  { key: 'escursione_carrello_tiro24', label: 'Escursione carrello tiro II/IV (m)', placeholder: '16' },
  { key: 'altezza_max', label: 'Altezza massima sotto gancio (m)', placeholder: '70' },
  { key: 'diametro_funi_sollevamento', label: 'Diametro funi sollevamento (mm)', placeholder: '16' },
  { key: 'diametro_fune_carrello', label: 'Diametro fune carrello (mm)', placeholder: '12' },
];

export default function Step1() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [data, setData] = useState({});

  useEffect(() => {
    if (projectId) {
      machine.get(projectId).then(r => setData(r.data)).catch(() => {});
    }
  }, [projectId]);

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value ? parseFloat(value) : null }));
  };

  const handleSave = async () => {
    if (projectId) {
      await machine.update(projectId, data).catch(() => machine.create(projectId, data));
      navigate(`/nuovo-progetto/step-2?projectId=${projectId}`);
    }
  };

  return (
    <StepWrapper title="Caratteristiche macchina" description="Inserisci le caratteristiche principali della gru KG 26.5">
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#333' }}>{f.label}</label>
              <input
                type="number" step="any"
                value={data[f.key] ?? ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4,
                  fontSize: 14, background: '#f9f9f9', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#e0e0e0', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Annulla
          </button>
          <button onClick={handleSave} style={{ padding: '10px 20px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Salva e continua
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}

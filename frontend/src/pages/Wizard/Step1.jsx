import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { machine } from '../../api/client';
import StepWrapper from '../../components/StepWrapper';

const fields = [
  { key: 'sbraccio_max', label: 'Sbraccio massimo (m)', placeholder: '65', col: '1fr 2fr' },
  { key: 'carico_punta_tiro2', label: 'Carico utile punta tiro II (kg)', placeholder: '1800', col: '1fr 2fr' },
  { key: 'carico_punta_tiro24', label: 'Carico utile punta tiro II/IV (kg)', placeholder: '1800', col: '1fr 2fr' },
  { key: 'carico_max_tiro2', label: 'Carico utile max tiro II (kg)', placeholder: '10000', col: '1fr 2fr' },
  { key: 'escursione_carrello_tiro2', label: 'Escursione carrello tiro II (m)', placeholder: '16', col: '1fr 2fr' },
  { key: 'carico_max_tiro24', label: 'Carico utile max tiro II/IV (kg)', placeholder: '10000', col: '1fr 2fr' },
  { key: 'escursione_carrello_tiro24', label: 'Escursione carrello tiro II/IV (m)', placeholder: '16', col: '1fr 2fr' },
  { key: 'altezza_max', label: 'Altezza massima sotto gancio (m)', placeholder: '70', col: '1fr 2fr' },
  { key: 'diametro_funi_sollevamento', label: 'Diametro funi sollevamento (mm)', placeholder: '16', col: '1fr 2fr' },
  { key: 'diametro_fune_carrello', label: 'Diametro fune carrello (mm)', placeholder: '12', col: '1fr 2fr' },
];

export default function Step1() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [data, setData] = useState({});

  useEffect(() => {
    if (projectId) machine.get(projectId).then(r => setData(r.data)).catch(() => {});
  }, [projectId]);

  const handleChange = (key, value) => setData(prev => ({ ...prev, [key]: value ? parseFloat(value) : null }));

  const handleSave = async () => {
    if (projectId) {
      await machine.update(projectId, data).catch(() => machine.create(projectId, data));
      navigate(`/nuovo-progetto/step-2?projectId=${projectId}`);
    }
  };

  return (
    <StepWrapper title="Caratteristiche macchina" description="Inserisci i dati principali della gru">
      <div className="card">
        <div className="card-body">
          <div className="grid-2" style={{ gap: 20 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#212529' }}>
                  {f.label}
                </label>
                <input type="number" step="any" value={data[f.key] ?? ''}
                  onChange={e => handleChange(f.key, e.target.value)} placeholder={f.placeholder}
                  style={{ background: '#fffdf5' }} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-between" style={{ marginTop: 28 }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost">Annulla</button>
            <button onClick={handleSave} className="btn btn-crane">Salva e continua →</button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

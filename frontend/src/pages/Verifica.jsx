import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { projects, machine, masses, loadCurves, windAreas, stability, geometry, formulas as formulasApi } from '../api/client';

const STEPS = [
  { key: 'macchina', label: '1. Caratteristiche macchina', desc: 'Verifica i dati base della gru' },
  { key: 'baricentri', label: '2. Baricentri', desc: 'Calcolo del centro di gravità' },
  { key: 'aree_vento', label: '3. Aree vento', desc: 'Coefficienti aree vento' },
  { key: 'vento', label: '4. Vento', desc: 'Forze del vento sulla gru' },
  { key: 'stabilita_q', label: '5. Stabilità C25-Q', desc: 'Verifica configurazione quadrato' },
  { key: 'stabilita_d', label: '6. Stabilità C25-D', desc: 'Verifica configurazione diagonale' },
  { key: 'carichi_ralla', label: '7. Carichi ralla', desc: 'Carichi su ralla e base' },
  { key: 'diagramma', label: '8. Diagramma carico', desc: 'Diagramma carico/raggio' },
];

export default function Verifica() {
  const navigate = useNavigate();
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formulas, setFormulas] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    projects.list().then(r => setProjectsList(r.data)).catch(() => {});
  }, []);

  const loadStepData = async (projectId, stepKey) => {
    setLoading(true);
    try {
      if (stepKey === 'macchina') {
        const res = await machine.get(projectId);
        setFormulas([{ campo: 'Dati macchina', formula: 'Input utente (valori blu)', valore: JSON.stringify(res.data, null, 2) }]);
      } else {
        let res;
        if (stepKey === 'baricentri') res = await formulasApi.list('baricentri');
        else if (stepKey === 'aree_vento') res = await formulasApi.list('aree_vento');
        else if (stepKey === 'vento') res = await formulasApi.list('vento');
        else if (stepKey === 'stabilita_q') res = await formulasApi.list('stabilita_q');
        else if (stepKey === 'stabilita_d') res = await formulasApi.list('stabilita_d');
        else if (stepKey === 'carichi_ralla') res = await formulasApi.list('carichi_ralla');
        else if (stepKey === 'diagramma') res = await formulasApi.list('diagramma');
        else res = { data: [] };

        const apiFormulas = res.data || [];

        try {
          const calcRes = await api.post(`/projects/${projectId}/calcola`);
          setResults(calcRes.data);
        } catch (err) {
          console.error('Calc error:', err);
        }

        setFormulas(apiFormulas.slice(0, 200));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleProjectSelect = async (projectId) => {
    setSelectedProject(projectId);
    setCurrentStep(0);
    await loadStepData(projectId, STEPS[0].key);
  };

  const goToStep = async (idx) => {
    setCurrentStep(idx);
    setFormulas([]);
    await loadStepData(selectedProject, STEPS[idx].key);
  };

  const saveFormula = async (id, newFormula) => {
    try {
      await formulasApi.update(id, { formula: newFormula });
      setEditId(null);
      await loadStepData(selectedProject, STEPS[currentStep].key);
    } catch (err) { alert('Errore durante il salvataggio della formula'); }
  };

  const stepKey = STEPS[currentStep]?.key;
  const stepResults = results?.[stepKey];

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Step by step: inserisci i valori, vedi le formule, controlla i risultati</p>
      </div>

      <div className="msg msg-info" style={{ marginBottom: 20 }}>
        <strong>💡 Come funziona:</strong> Seleziona un progetto, poi naviga gli step uno alla volta.
        Per ogni step vedi: input (valori blu) → formule applicate → risultati calcolati.
        Verifica la correttezza dei valori e passa allo step successivo.
      </div>

      {/* Project selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13 }}>Seleziona progetto</label>
          {projectsList.length === 0 ? (
            <p style={{ color: 'var(--gray)', fontSize: 13 }}>Nessun progetto disponibile. Creane uno dal wizard.</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {projectsList.map(p => (
                <button key={p.id} onClick={() => handleProjectSelect(p.id)}
                  style={{
                    padding: '8px 16px', borderRadius: 6, border: '1.5px solid',
                    borderColor: selectedProject === p.id ? '#D4A017' : '#e5e7eb',
                    background: selectedProject === p.id ? '#fffdf5' : '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: selectedProject === p.id ? 600 : 400,
                  }}>
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Step navigator */}
          <div className="card">
            <div className="card-header">Step</div>
            <div style={{ padding: 8 }}>
              {STEPS.map((s, i) => (
                <button key={s.key} onClick={() => goToStep(i)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px',
                    background: i === currentStep ? '#1e1e2e' : 'transparent',
                    color: i === currentStep ? '#fff' : '#1e1e2e',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                    fontWeight: i === currentStep ? 600 : 400, marginBottom: 4,
                  }}>
                  {s.label}
                  <div style={{ fontSize: 11, color: i === currentStep ? 'rgba(255,255,255,0.6)' : '#9ca3af', marginTop: 2 }}>
                    {s.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="card">
              <div className="card-header">
                <span>{STEPS[currentStep]?.label}</span>
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>
                  {formulas.length > 0 ? `${formulas.length} formule` : loading ? 'Caricamento...' : 'Nessuna formula'}
                </span>
              </div>
              <div className="card-body">
                {loading ? (
                  <p style={{ color: 'var(--gray)', textAlign: 'center', padding: 24 }}>Caricamento in corso...</p>
                ) : (
                  <>
                    {/* Step description */}
                    <div style={{ marginBottom: 20, fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                      {STEPS[currentStep]?.desc}. Verifica che i dati in ingresso siano corretti,
                      controlla le formule applicate e confronta i risultati attesi.
                    </div>

                    {/* Input values */}
                    <h3 style={{ fontSize: 14, marginBottom: 8, color: '#D4A017' }}>📥 Input (valori blu)</h3>
                    <div style={{
                      background: '#fffdf5', border: '1px solid #e5e7eb', borderRadius: 6,
                      padding: 12, marginBottom: 20, fontSize: 12, fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto',
                    }}>
                      {stepKey === 'macchina'
                        ? JSON.stringify(results?.macchina || {}, null, 2)
                        : 'Valori inseriti nel wizard per questo step. Clicca su "Modifica input" per cambiarli.'}
                    </div>

                    {/* Formulas */}
                    <h3 style={{ fontSize: 14, marginBottom: 8, color: '#D4A017' }}>📐 Formule applicate</h3>
                    <div className="table-wrap" style={{ marginBottom: 20, maxHeight: 300, overflowY: 'auto' }}>
                      <table style={{ fontSize: 12 }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                          <tr>
                            <th style={{ width: 60 }}>Cella</th>
                            <th>Formula</th>
                            {user.is_admin && <th style={{ width: 60 }}>Azioni</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {formulas.slice(0, 50).map(f => (
                            <tr key={f.id || f.campo}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{f.campo}</td>
                              <td>
                                {editId === f.id ? (
                                  <div className="flex gap-2">
                                    <input value={editText} onChange={e => setEditText(e.target.value)}
                                      style={{ flex: 1, padding: 4, border: '1.5px solid var(--yellow)', borderRadius: 3, fontSize: 11, fontFamily: 'monospace' }} />
                                    <button onClick={() => saveFormula(f.id, editText)} className="btn btn-xs btn-dark">Salva</button>
                                    <button onClick={() => setEditId(null)} className="btn btn-xs btn-ghost">X</button>
                                  </div>
                                ) : (
                                  <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{f.formula}</code>
                                )}
                              </td>
                              {user.is_admin && (
                                <td>
                                  <button onClick={() => { setEditId(f.id); setEditText(f.formula); }}
                                    className="btn btn-xs btn-ghost" title="Modifica formula">✏</button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {formulas.length > 50 && (
                            <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray)', fontSize: 11, padding: 12 }}>
                              + {formulas.length - 50} formule (mostrate prime 50)
                            </td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Results */}
                    <h3 style={{ fontSize: 14, marginBottom: 8, color: '#D4A017' }}>📊 Risultati calcolati</h3>
                    {stepResults ? (
                      <div style={{
                        background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6,
                        padding: 12, fontSize: 12, fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto',
                      }}>
                        {JSON.stringify(stepResults, null, 2)}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--gray)', fontSize: 13, padding: 12 }}>
                        Clicca "Esegui calcolo" per vedere i risultati di questo step.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3" style={{ marginTop: 20 }}>
                      {currentStep > 0 && (
                        <button onClick={() => goToStep(currentStep - 1)} className="btn btn-ghost btn-sm">
                          ← Step precedente
                        </button>
                      )}
                      <button onClick={async () => {
                        await handleProjectSelect(selectedProject);
                      }} className="btn btn-dark btn-sm">
                        🔄 Esegui calcolo
                      </button>
                      <button onClick={() => navigate(`/nuovo-progetto/step-1?projectId=${selectedProject}`)}
                        className="btn btn-yellow btn-sm">
                        ✏ Modifica input
                      </button>
                      {currentStep < STEPS.length - 1 && (
                        <button onClick={() => goToStep(currentStep + 1)} className="btn btn-ghost btn-sm">
                          Step successivo →
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

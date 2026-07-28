import { useState, useEffect } from 'react';
import api, { projects, formulas as formulasApi } from '../api/client';

const STEPS = [
  { key: 'macchina', label: '1. Caratteristiche macchina', desc: 'Input: sbraccio, carichi, altezze' },
  { key: 'baricentri', label: '2. Baricentri', desc: 'Calcolo centro di gravità' },
  { key: 'aree_vento', label: '3. Aree vento', desc: 'Coefficienti aree vento' },
  { key: 'vento', label: '4. Vento', desc: 'Forze del vento sulla gru' },
  { key: 'stabilita_q', label: '5. Stabilità C25-Q', desc: 'Verifica configurazione quadrato' },
  { key: 'stabilita_d', label: '6. Stabilità C25-D', desc: 'Verifica configurazione diagonale' },
  { key: 'carichi_ralla', label: '7. Carichi ralla', desc: 'Carichi su ralla e base' },
  { key: 'diagramma', label: '8. Diagramma carico', desc: 'Diagramma carico/raggio' },
];

export default function Verifica() {
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [cells, setCells] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [saving, setSaving] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    projects.list().then(r => setProjectsList(r.data)).catch(() => {});
  }, []);

  const stepKey = STEPS[currentStep]?.key;

  const loadStep = async (projectId, step) => {
    setLoading(true);
    setResults(null);
    setEditId(null);
    try {
      const res = await formulasApi.list(step);
      setCells(res.data || []);

      // Load existing results
      const resR = await api.get(`/projects/${projectId}/risultati`);
      for (const r of resR.data) {
        if (r.step === step) {
          setResults(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati);
        }
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleProjectSelect = async (projectId) => {
    setSelectedProject(projectId);
    setCurrentStep(0);
    setInputValues({});
    await loadStep(projectId, STEPS[0].key);
  };

  const goToStep = async (idx) => {
    setCurrentStep(idx);
    setInputValues({});
    await loadStep(selectedProject, STEPS[idx].key);
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const res = await api.post(`/projects/${selectedProject}/calcola`);
      const data = res.data;

      // Re-load results
      const resR = await api.get(`/projects/${selectedProject}/risultati`);
      for (const r of resR.data) {
        if (r.step === stepKey) {
          setResults(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati);
        }
      }
    } catch (err) {
      alert('Errore durante il calcolo: ' + (err.response?.data?.detail || err.message));
    }
    setCalculating(false);
  };

  const saveFormula = async (id, newFormula) => {
    try {
      await formulasApi.update(id, { formula: newFormula });
      setEditId(null);
      await loadStep(selectedProject, stepKey);
    } catch (err) { alert('Errore salvataggio formula'); }
  };

  const inputs = cells.filter(c => c.cell_type === 'input');
  const formulas = cells.filter(c => c.cell_type === 'formula');
  const constants = cells.filter(c => c.cell_type === 'constant');

  const resultsValues = results?.values || {};

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Step by step: modifica input → calcola → controlla output → correggi se serve</p>
      </div>

      {/* Project selector */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>1. Seleziona un progetto</label>
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
        </div>
      </div>

      {selectedProject && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Step navigator */}
          <div className="card">
            <div className="card-header" style={{ fontSize: 12 }}>Step</div>
            <div style={{ padding: 8 }}>
              {STEPS.map((s, i) => (
                <button key={s.key} onClick={() => goToStep(i)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                    background: i === currentStep ? '#1e1e2e' : 'transparent',
                    color: i === currentStep ? '#fff' : '#1e1e2e',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                    fontWeight: i === currentStep ? 600 : 400, marginBottom: 2,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="card">
            <div className="card-header">
              <span>{STEPS[currentStep]?.label}</span>
              <span style={{ fontSize: 11, color: 'var(--gray)' }}>
                {cells.length} celle
              </span>
            </div>
            <div className="card-body">
              {loading ? (
                <p style={{ color: 'var(--gray)', textAlign: 'center', padding: 24 }}>Caricamento...</p>
              ) : (
                <>
                  {/* Step description + actions */}
                  <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: 'var(--gray)' }}>{STEPS[currentStep]?.desc}</div>
                    <div className="flex gap-2">
                      {currentStep > 0 && (
                        <button onClick={() => goToStep(currentStep - 1)} className="btn btn-ghost btn-xs">← Prec</button>
                      )}
                      <button onClick={handleCalculate} disabled={calculating} className="btn btn-dark btn-sm">
                        {calculating ? 'Calcolo...' : '▶ Calcola step'}
                      </button>
                      {currentStep < STEPS.length - 1 && (
                        <button onClick={() => goToStep(currentStep + 1)} className="btn btn-ghost btn-xs">Succ →</button>
                      )}
                    </div>
                  </div>

                  {/* INPUT cells */}
                  {inputs.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 13, color: '#0070C0', marginBottom: 8 }}>
                        📥 Input utente ({inputs.length})
                      </h3>
                      <div className="table-wrap" style={{ maxHeight: 250, overflowY: 'auto' }}>
                        <table style={{ fontSize: 11 }}>
                          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr><th style={{ width: 60, color: '#0070C0' }}>Cella</th><th style={{ width: 80 }}>Valore</th><th>Formula / Note</th></tr>
                          </thead>
                          <tbody>
                            {inputs.map(c => (
                              <tr key={c.id || c.campo} style={{ background: '#eef7ff' }}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0070C0', fontSize: 11 }}>{c.campo}</td>
                                <td>
                                  <input type="text" defaultValue={c.default_value || ''}
                                    style={{ width: 80, padding: '3px 6px', fontSize: 11, fontFamily: 'monospace', border: '1px solid #0070C0', background: '#fff' }}
                                    onChange={e => setInputValues({...inputValues, [c.campo]: e.target.value})} />
                                </td>
                                <td style={{ fontSize: 10, color: '#6b7280' }}>{c.sheet}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* FORMULA cells */}
                  {formulas.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 13, marginBottom: 8 }}>
                        📐 Formule ({formulas.length})
                      </h3>
                      <div className="table-wrap" style={{ maxHeight: 400, overflowY: 'auto' }}>
                        <table style={{ fontSize: 11 }}>
                          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr>
                              <th style={{ width: 60 }}>Cella</th>
                              <th>Formula</th>
                              <th style={{ width: 80 }}>Risultato</th>
                              {user.is_admin && <th style={{ width: 40 }}>✏</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {formulas.map(f => {
                              const calcVal = resultsValues[f.campo];
                              return (
                              <tr key={f.id || f.campo}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 11 }}>{f.campo}</td>
                                <td>
                                  {editId === f.id ? (
                                    <div className="flex gap-2">
                                      <input value={editText} onChange={e => setEditText(e.target.value)}
                                        style={{ flex: 1, padding: 3, border: '1.5px solid var(--yellow)', borderRadius: 3, fontSize: 11, fontFamily: 'monospace' }} />
                                      <button onClick={() => saveFormula(f.id, editText)} className="btn btn-xs btn-dark">Ok</button>
                                      <button onClick={() => setEditId(null)} className="btn btn-xs btn-ghost">X</button>
                                    </div>
                                  ) : (
                                    <code style={{ fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' }}>{f.formula}</code>
                                  )}
                                </td>
                                <td style={{
                                  fontFamily: 'monospace', fontWeight: 600, fontSize: 12,
                                  color: calcVal !== undefined ? '#1e1e2e' : '#d1d5db',
                                }}>
                                  {calcVal !== undefined ? (typeof calcVal === 'number' ? calcVal.toLocaleString() : calcVal) : '—'}
                                </td>
                                {user.is_admin && (
                                  <td>
                                    <button onClick={() => { setEditId(f.id); setEditText(f.formula); }}
                                      className="btn btn-xs btn-ghost">✏</button>
                                  </td>
                                )}
                              </tr>
                            );})}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* CONSTANT cells */}
                  {constants.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <h3 style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                        🔒 Costanti ({constants.length})
                      </h3>
                      <div className="table-wrap" style={{ maxHeight: 150, overflowY: 'auto' }}>
                        <table style={{ fontSize: 11 }}>
                          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr><th style={{ width: 60, color: '#6b7280' }}>Cella</th><th>Valore</th></tr>
                          </thead>
                          <tbody>
                            {constants.map(c => (
                              <tr key={c.id || c.campo} style={{ background: '#fafafa' }}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 11, color: '#6b7280' }}>{c.campo}</td>
                                <td style={{ fontSize: 11, color: '#6b7280' }}>{c.default_value || c.formula}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Results summary */}
                  {results && (
                    <div className="msg msg-success">
                      ✅ Calcolo eseguito. {formulas.length} formule processate.
                      {results.cells && <span> ({results.cells} celle calcolate)</span>}
                    </div>
                  )}

                  {cells.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 32, color: 'var(--gray)', fontSize: 13 }}>
                      Nessun dato per questo step. Vai su <strong>Impostazioni → Carica Excel</strong> per importare le formule.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

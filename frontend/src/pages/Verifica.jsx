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
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploading, setUploading] = useState(false);
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

      // Load existing input values from project tables
      const newInputs = {};

      try {
        const machineRes = await api.get(`/projects/${projectId}/machine`);
        if (machineRes.data) {
          Object.entries(machineRes.data).forEach(([key, val]) => {
            if (val !== null && val !== undefined && key !== 'id' && key !== 'project_id' && key !== 'created_at') {
              newInputs[key] = String(val);
            }
          });
        }
      } catch (e) {}

      try {
        const stabRes = await api.get(`/projects/${projectId}/stability`);
        stabRes.data.forEach(p => {
          if (p.valore !== null) newInputs[p.parametro] = String(p.valore);
        });
      } catch (e) {}

      try {
        const massesRes = await api.get(`/projects/${projectId}/masses`);
        massesRes.data.forEach((m, i) => {
          if (m.massa_kg !== null) newInputs[`Q${i + 1}`] = String(m.massa_kg);
          if (m.braccio_m !== null) newInputs[`T${i + 1}`] = String(m.braccio_m);
        });
      } catch (e) {}

      try {
        const curvesRes = await api.get(`/projects/${projectId}/load-curves`);
        curvesRes.data.forEach((c, i) => {
          if (c.carico_kg !== null) newInputs[`R${i + 1}`] = String(c.carico_kg);
        });
      } catch (e) {}

      try {
        const windRes = await api.get(`/projects/${projectId}/wind-areas`);
        windRes.data.forEach((a, i) => {
          if (a.valore !== null) newInputs[`V${i + 1}`] = String(a.valore);
        });
      } catch (e) {}

      setInputValues(newInputs);

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

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const res = await api.post('/formulas/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg(`✅ ${res.data.message}`);
      setUploadFile(null);
      if (selectedProject) await loadStep(selectedProject, stepKey);
    } catch (err) {
      setUploadMsg(`❌ ${err.response?.data?.detail || 'Errore'}`);
    }
    setUploading(false);
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      // Save input values to project tables first
      if (stepKey === 'macchina' || stepKey === 'baricentri') {
        const machineData = {};
        inputs.forEach(c => {
          if (inputValues[c.campo]) {
            machineData[c.campo] = parseFloat(inputValues[c.campo]) || 0;
          }
        });
        if (Object.keys(machineData).length > 0) {
          await api.put(`/projects/${selectedProject}/machine`, machineData);
        }
      }

      // Save stability params
      if (['stabilita_q', 'stabilita_d', 'vento', 'carichi_ralla'].includes(stepKey)) {
        for (const [key, val] of Object.entries(inputValues)) {
          if (val) {
            const existing = await api.get(`/projects/${selectedProject}/stability`);
            const found = existing.data.find(p => p.parametro === key);
            if (found) {
              await api.put(`/projects/${selectedProject}/stability/${found.id}`, { valore: parseFloat(val) || 0 });
            } else {
              await api.post(`/projects/${selectedProject}/stability`, { parametro: key, valore: parseFloat(val) || 0 });
            }
          }
        }
      }

      // Save masses
      if (stepKey === 'masse') {
        for (const [key, val] of Object.entries(inputValues)) {
          if (val) {
            const existing = await api.get(`/projects/${selectedProject}/masses`);
            const found = existing.data.find(m => m.componente === key);
            if (found) {
              await api.put(`/projects/${selectedProject}/masses/${found.id}`, { massa_kg: parseFloat(val) || 0 });
            } else {
              await api.post(`/projects/${selectedProject}/masses`, { componente: key, massa_kg: parseFloat(val) || 0 });
            }
          }
        }
      }

      // Calculate
      const res = await api.post(`/projects/${selectedProject}/calcola`);

      // Re-load results
      const resR = await api.get(`/projects/${selectedProject}/risultati`);
      for (const r of resR.data) {
        if (r.step === stepKey) {
          setResults(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati);
        }
      }
    } catch (err) {
      alert('Errore: ' + (err.response?.data?.detail || err.message));
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

  const inputs = cells.filter(c => (c.cell_type || 'formula') === 'input');
  const formulas = cells.filter(c => (c.cell_type || 'formula') === 'formula');
  const constants = cells.filter(c => (c.cell_type || '') === 'constant');

  const resultsValues = results?.values || {};

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Step by step: modifica input → calcola → controlla output → correggi se serve</p>
      </div>

      {/* Project selector */}
      {/* Upload Excel section */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>📂 Carica Excel aggiornato:</span>
          <input type="file" accept=".xlsm,.xlsx" onChange={e => setUploadFile(e.target.files[0])} style={{ fontSize: 12, flex: 1, minWidth: 150, padding: 4 }} />
          <button onClick={handleUpload} disabled={!uploadFile || uploading} style={{
            padding: '6px 14px', borderRadius: 4, border: 'none',
            background: !uploadFile ? '#e5e7eb' : '#D4A017', color: !uploadFile ? '#9ca3af' : '#fff',
            cursor: !uploadFile ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {uploading ? 'Caricamento...' : 'Carica e importa'}
          </button>
          {uploadMsg && <span style={{ fontSize: 12 }}>{uploadMsg}</span>}
        </div>
      </div>

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

                  {/* CARICA VALORI — all cells with editable values */}
                  {cells.length > 0 && (
                    <div style={{ marginBottom: 20, background: '#fffdf5', border: '1.5px solid #D4A017', borderRadius: 8, padding: 16 }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
                        <h3 style={{ fontSize: 14, color: '#1e1e2e', margin: 0 }}>
                          📋 Valori di test — {STEPS[currentStep]?.label}
                        </h3>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>
                          {cells.filter(c => c.cell_type === 'input').length > 0
                            ? `${cells.filter(c => c.cell_type === 'input').length} input rilevati`
                            : 'Nessun input rilevato — carica Excel per abilitare'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                        Inserisci i valori blu (input) per questo step. Poi clicca <strong>"Calcola step"</strong> per vedere i risultati.
                      </p>
                      <div className="table-wrap" style={{ maxHeight: 300, overflowY: 'auto' }}>
                        <table style={{ fontSize: 11 }}>
                          <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#fffdf5' }}>
                            <tr>
                              <th style={{ width: 60, color: '#D4A017' }}>Cella</th>
                              <th style={{ width: 80 }}>Valore input</th>
                              <th>Formula / Tipo</th>
                              <th style={{ width: 60 }}>Risultato</th>
                              {user.is_admin && <th style={{ width: 30 }}>✏</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {cells.map(c => {
                              const isInput = (c.cell_type || '') === 'input';
                              const isConst = (c.cell_type || '') === 'constant';
                              const calcVal = resultsValues[c.campo];
                              return (
                              <tr key={c.id || c.campo} style={{ background: isInput ? '#eef7ff' : isConst ? '#fafafa' : '#fff' }}>
                                <td style={{
                                  fontFamily: 'monospace', fontWeight: 600, fontSize: 11,
                                  color: isInput ? '#0070C0' : isConst ? '#6b7280' : '#1e1e2e',
                                }}>{c.campo}</td>
                                <td>
                                  {isInput || !isConst ? (
                                    <input type="text"
                                      value={inputValues[c.campo] !== undefined ? inputValues[c.campo] : (c.default_value || '')}
                                      placeholder={isInput ? 'valore input' : '—'}
                                      style={{
                                        width: 90, padding: '3px 6px', fontSize: 11, fontFamily: 'monospace',
                                        border: isInput ? '1.5px solid #0070C0' : '1px solid #e5e7eb',
                                        background: '#fff',
                                      }}
                                      onChange={e => setInputValues({...inputValues, [c.campo]: e.target.value})} />
                                  ) : (
                                    <span style={{ color: '#6b7280', fontSize: 11 }}>{c.default_value || c.formula}</span>
                                  )}
                                </td>
                                <td>
                                  <span style={{
                                    display: 'inline-block', padding: '1px 5px', borderRadius: 3, fontSize: 9, fontWeight: 600,
                                    background: isInput ? '#0070C0' : isConst ? '#e5e7eb' : '#fff',
                                    color: isInput ? '#fff' : isConst ? '#6b7280' : '#1e1e2e',
                                    border: isInput ? 'none' : isConst ? '1px solid #d1d5db' : '1px solid #1e1e2e',
                                    marginRight: 4,
                                  }}>{isInput ? 'IN' : isConst ? 'CO' : 'FX'}</span>
                                  <code style={{ fontSize: 10, fontFamily: 'monospace', color: '#6b7280' }}>{c.formula}</code>
                                </td>
                                <td style={{
                                  fontFamily: 'monospace', fontWeight: 700, fontSize: 12,
                                  color: calcVal !== undefined ? (isInput ? '#0070C0' : '#1e1e2e') : '#d1d5db',
                                }}>
                                  {calcVal !== undefined ? (typeof calcVal === 'number' ? calcVal.toLocaleString() : calcVal) : '—'}
                                </td>
                                {user.is_admin && (
                                  <td>
                                    <button onClick={() => { setEditId(c.id); setEditText(c.formula); }}
                                      className="btn btn-xs btn-ghost" style={{ padding: '1px 4px', fontSize: 10 }}>✏</button>
                                  </td>
                                )}
                              </tr>
                            );})}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex gap-2" style={{ marginTop: 12 }}>
                        <button onClick={handleCalculate} disabled={calculating} className="btn btn-dark btn-sm">
                          {calculating ? 'Calcolo...' : '💾 Salva valori e calcola'}
                        </button>
                        <span style={{ fontSize: 11, color: '#9ca3af', alignSelf: 'center' }}>
                          I valori vengono salvati nel progetto e usati per il calcolo
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Edit inline is handled in the Valori di test table above */}

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

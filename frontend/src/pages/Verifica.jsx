import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { projects, formulas as formulasApi } from '../api/client';

const STEPS = [
  { key: 'macchina', label: 'Caratteristiche macchina', desc: 'Sbraccio, carichi, altezze macchina' },
  { key: 'geometria', label: 'Geometria braccio', desc: 'Dimensioni e profili elementi braccio' },
  { key: 'masse', label: 'Masse proprie', desc: 'Masse e baricentri componenti' },
  { key: 'baricentri', label: 'Baricentri', desc: 'Calcolo centro di gravità complessivo' },
  { key: 'aree_vento', label: 'Aree vento', desc: 'Coefficienti e aree esposizione vento' },
  { key: 'vento', label: 'Vento', desc: 'Forze del vento sulla gru' },
  { key: 'curve_carico', label: 'Curve di carico', desc: 'Portate massime per raggio' },
  { key: 'stabilita_q', label: 'Stabilità C25-Q', desc: 'Verifica configurazione quadrato' },
  { key: 'stabilita_d', label: 'Stabilità C25-D', desc: 'Verifica configurazione diagonale' },
  { key: 'carichi_ralla', label: 'Carichi ralla', desc: 'Carichi su ralla e base' },
  { key: 'diagramma', label: 'Diagramma carico', desc: 'Diagramma carico/raggio' },
];

const MACHINE_CELL_MAP = {
  sbraccio_max: 'S3',
  carico_punta_tiro2: 'S4',
  carico_punta_tiro24: 'S5',
  carico_max_tiro2: 'S6',
  escursione_carrello_tiro2: 'S7',
  carico_max_tiro24: 'S8',
  escursione_carrello_tiro24: 'S9',
  altezza_max: 'S10',
  diametro_funi_sollevamento: 'S11',
  diametro_fune_carrello: 'S12',
};

const CELL_TO_MACHINE_MAP = Object.fromEntries(
  Object.entries(MACHINE_CELL_MAP).map(([k, v]) => [v, k])
);

export default function Verifica() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    projects.list().then(r => setProjectsList(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const urlProjectId = searchParams.get('projectId');
    if (urlProjectId && projectsList.length > 0) {
      const id = parseInt(urlProjectId);
      if (!selectedProject && projectsList.some(p => p.id === id)) {
        handleProjectSelect(id);
      }
    }
  }, [projectsList]);

  const stepKey = STEPS[currentStep]?.key;

  const loadStep = async (projectId, step) => {
    setLoading(true);
    setResults(null);
    setEditId(null);
    try {
      const res = await formulasApi.list(step);
      setCells(res.data || []);

      const newInputs = {};
      try {
        const machineRes = await api.get(`/projects/${projectId}/machine`);
        if (machineRes.data) {
          Object.entries(machineRes.data).forEach(([key, val]) => {
            if (val !== null && val !== undefined && !['id', 'project_id', 'created_at'].includes(key)) {
              const cell = MACHINE_CELL_MAP[key] || key;
              newInputs[cell] = String(val);
            }
          });
        }
      } catch (e) {}
      try {
        const stabRes = await api.get(`/projects/${projectId}/stability`);
        stabRes.data.forEach(p => { if (p.valore !== null) newInputs[p.parametro] = String(p.valore); });
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
        curvesRes.data.forEach((c, i) => { if (c.carico_kg !== null) newInputs[`R${i + 1}`] = String(c.carico_kg); });
      } catch (e) {}
      try {
        const windRes = await api.get(`/projects/${projectId}/wind-areas`);
        windRes.data.forEach((a, i) => { if (a.valore !== null) newInputs[`V${i + 1}`] = String(a.valore); });
      } catch (e) {}
      try {
        const geomRes = await api.get(`/projects/${projectId}/geometry`);
        if (Array.isArray(geomRes.data)) {
          geomRes.data.forEach((g, i) => {
            if (g.lunghezza !== null) newInputs[`L${i + 16}`] = String(g.lunghezza);
          });
        }
      } catch (e) {}

      setInputValues(newInputs);

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
      if (stepKey === 'macchina' || stepKey === 'baricentri') {
        const machineData = {};
        cells.forEach(c => {
          if (inputValues[c.campo]) {
            const field = CELL_TO_MACHINE_MAP[c.campo] || c.campo;
            machineData[field] = parseFloat(inputValues[c.campo]) || 0;
          }
        });
        if (Object.keys(machineData).length > 0) {
          await api.put(`/projects/${selectedProject}/machine`, machineData);
        }
      }
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
      if (stepKey === 'masse') {
        const massesData = [];
        cells.forEach(c => {
          if (inputValues[c.campo]) {
            const idx = parseInt(c.campo.match(/\d+/)?.[0] || '1') - 1;
            if (!massesData[idx]) massesData[idx] = {};
            if (c.campo.startsWith('Q')) massesData[idx].massa_kg = parseFloat(inputValues[c.campo]) || 0;
            if (c.campo.startsWith('T')) massesData[idx].braccio_m = parseFloat(inputValues[c.campo]) || 0;
          }
        });
        for (let i = 0; i < massesData.length; i++) {
          if (massesData[i]) {
            try {
              const existing = await api.get(`/projects/${selectedProject}/masses`);
              if (existing.data[i]) {
                await api.put(`/projects/${selectedProject}/masses/${existing.data[i].id}`, massesData[i]);
              } else {
                await api.post(`/projects/${selectedProject}/masses`, massesData[i]);
              }
            } catch (e) {
              await api.post(`/projects/${selectedProject}/masses`, massesData[i]);
            }
          }
        }
      }
      if (stepKey === 'curve_carico') {
        const curvesData = [];
        cells.forEach(c => {
          if (inputValues[c.campo] && c.campo.startsWith('R')) {
            const idx = parseInt(c.campo.match(/\d+/)?.[0] || '1') - 1;
            if (!curvesData[idx]) curvesData[idx] = {};
            curvesData[idx].carico_kg = parseFloat(inputValues[c.campo]) || 0;
          }
        });
        for (let i = 0; i < curvesData.length; i++) {
          if (curvesData[i]) {
            try {
              const existing = await api.get(`/projects/${selectedProject}/load-curves`);
              if (existing.data[i]) {
                await api.put(`/projects/${selectedProject}/load-curves/${existing.data[i].id}`, curvesData[i]);
              } else {
                await api.post(`/projects/${selectedProject}/load-curves`, curvesData[i]);
              }
            } catch (e) {
              await api.post(`/projects/${selectedProject}/load-curves`, curvesData[i]);
            }
          }
        }
      }

      await api.post(`/projects/${selectedProject}/calcola`);
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

  const resultsValues = results?.values || {};

  const inputs = cells.filter(c => (c.cell_type || 'formula') === 'input');
  const formulas_count = cells.filter(c => (c.cell_type || 'formula') === 'formula').length;
  const constants_count = cells.filter(c => (c.cell_type || '') === 'constant').length;

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Step by step: controlla input, formule e risultati come nell'Excel</p>
      </div>

      {/* Project selector */}
      <div className="card" style={{ marginBottom: 20, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Progetto:</span>
        <select
          value={selectedProject || ''}
          onChange={e => handleProjectSelect(parseInt(e.target.value))}
          style={{ width: 'auto', minWidth: 200, background: '#fff', padding: '6px 10px' }}
        >
          <option value="">Seleziona progetto...</option>
          {projectsList.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {selectedProject && (
          <button onClick={() => navigate(`/nuovo-progetto/step-1?projectId=${selectedProject}`)}
            className="btn btn-ghost btn-xs">✏ Modifica input nel wizard</button>
        )}
      </div>

      {selectedProject && (
        <>
          {/* Step bar (like wizard) */}
          <div className="step-bar" style={{ marginBottom: 24, minWidth: 700, overflowX: 'auto' }}>
            {STEPS.map((s, i) => (
              <button key={s.key} onClick={() => goToStep(i)}
                className={`step-item ${i < currentStep ? 'step-done' : i === currentStep ? 'step-current' : 'step-pending'}`}
                style={{ border: 'none', cursor: 'pointer', textAlign: 'center' }}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 13, color: 'var(--gray)' }}>{STEPS[currentStep]?.desc}</span>
              <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 12 }}>
                {cells.length} celle ({inputs.length} input, {formulas_count} formule, {constants_count} costanti)
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCalculate} disabled={calculating} className="btn btn-dark btn-sm">
                {calculating ? 'Calcolo...' : '▶ Calcola step'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
          ) : cells.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)', fontSize: 13 }}>
              Nessun dato per questo step. Vai su <strong>Impostazioni → Carica Excel</strong> per importare le formule.
            </div>
          ) : (
            <div className="card">
              <div className="table-wrap" style={{ maxHeight: 550, overflowY: 'auto' }}>
                {(() => {
                  const groups = {};
                  cells.forEach(c => {
                    const m = c.campo.match(/(\d+)/);
                    if (!m) return;
                    const r = parseInt(m[1]);
                    if (!groups[r]) groups[r] = [];
                    groups[r].push(c);
                  });
                  Object.values(groups).forEach(arr => {
                    arr.sort((a, b) => {
                      const ca = a.campo.match(/^([A-Z]+)/)[1];
                      const cb = b.campo.match(/^([A-Z]+)/)[1];
                      return ca.length !== cb.length ? ca.length - cb.length : ca.localeCompare(cb);
                    });
                  });
                  const sortedRows = Object.entries(groups).sort(([a],[b]) => parseInt(a)-parseInt(b));

                  return (
                    <table style={{ fontSize: 11 }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                          <th style={{ width: 24 }}>#</th>
                          <th style={{ width: 55, color: '#D4A017' }}>Cella</th>
                          <th style={{ width: 36 }}>T</th>
                          <th style={{ minWidth: 260 }}>Etichetta</th>
                          <th style={{ minWidth: 90 }}>Valore / Input</th>
                          <th>Dettaglio</th>
                          <th style={{ width: 75 }}>Risultato</th>
                          {user.is_admin && <th style={{ width: 30 }}>✏</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRows.map(([rowNum, rowCells]) => {
                          const labelCells = rowCells.filter(c => c.cell_type === 'label');
                          const valueCells = rowCells.filter(c => c.cell_type !== 'label');
                          const firstInput = valueCells.find(c => c.cell_type === 'input');
                          const hasInput = valueCells.some(c => c.cell_type === 'input');

                          return valueCells.map((c, ci) => {
                            const isInput = c.cell_type === 'input';
                            const isConst = c.cell_type === 'constant';
                            const calcVal = resultsValues?.[c.campo];
                            const isEditing = editId === c.id;
                            const rowLabel = c.label || (labelCells.length > 0 ? labelCells.map(l => l.default_value || l.formula).join(' ').trim() : '');
                            const showRowNum = ci === 0;

                            return (
                            <tr key={c.id || c.campo}
                              style={{
                                background: isInput ? '#E3F0FF' : isConst ? '#fafafa' : '#fff',
                                borderBottom: '1px solid #eef2f6',
                              }}>
                              <td style={{ color: '#9ca3af', fontSize: 10, fontFamily: 'monospace', textAlign: 'center' }}>
                                {showRowNum && <span>{rowNum}</span>}
                              </td>
                              <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 10, color: isInput ? '#0070C0' : '#1e1e2e' }}>
                                {c.campo}
                              </td>
                              <td>
                                {isInput ? (
                                  <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, background: '#0070C0', color: '#fff' }}>IN</span>
                                ) : isConst ? (
                                  <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, background: '#e5e7eb', color: '#6b7280', border: '1px solid #d1d5db' }}>CO</span>
                                ) : (
                                  <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, border: '1.5px solid #1e1e2e' }}>FX</span>
                                )}
                              </td>
                              <td style={{ color: '#374151', fontSize: 12, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rowLabel}>
                                {rowLabel}
                              </td>
                              <td>
                                {isInput ? (
                                  <input type="text"
                                    value={inputValues[c.campo] !== undefined ? inputValues[c.campo] : (c.default_value || '')}
                                    placeholder="0"
                                    style={{
                                      width: '100%', minWidth: 80, maxWidth: 140, padding: '3px 6px', fontSize: 12, fontFamily: 'monospace', fontWeight: 600,
                                      border: '2px solid #0070C0', borderRadius: 4, background: '#F0F7FF', color: '#0070C0', boxSizing: 'border-box',
                                    }}
                                    onChange={e => { const v = e.target.value; setInputValues({...inputValues, [c.campo]: v}); }} />
                                ) : isConst ? (
                                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: '#6b7280', padding: '4px 0' }}>
                                    {c.default_value || c.formula}
                                  </span>
                                ) : (
                                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 500, color: '#6b7280', padding: '4px 0' }}>
                                    {c.formula}
                                  </span>
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <div className="flex gap-2" style={{ alignItems: 'center' }}>
                                    <input value={editText} onChange={e => setEditText(e.target.value)}
                                      style={{ flex: 1, padding: 3, border: '1.5px solid var(--yellow)', borderRadius: 3, fontSize: 10, fontFamily: 'monospace', minWidth: 120 }} />
                                    <button onClick={() => saveFormula(c.id, editText)} className="btn btn-xs btn-dark">Ok</button>
                                    <button onClick={() => setEditId(null)} className="btn btn-xs btn-ghost">X</button>
                                  </div>
                                ) : (
                                  <code style={{ fontSize: 10, fontFamily: 'monospace', color: isConst || isInput ? '#6b7280' : '#1e1e2e', wordBreak: 'break-all' }}>
                                    {isConst || isInput ? (c.default_value || c.formula) : c.formula}
                                  </code>
                                )}
                              </td>
                              <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
                                {isInput ? (
                                  <span style={{ color: '#0070C0' }}>
                                    {inputValues[c.campo] !== undefined ? inputValues[c.campo] : (c.default_value || '')}
                                  </span>
                                ) : isConst ? (
                                  <span style={{ color: '#1e1e2e' }}>
                                    {c.default_value || c.formula}
                                  </span>
                                ) : calcVal !== undefined ? (
                                  <span style={{ color: '#1e1e2e' }} title={`Formula: ${c.formula}`}>
                                    <span style={{ fontSize: 9, opacity: 0.5, marginRight: 2 }}>ƒx</span>
                                    {typeof calcVal === 'number' ? calcVal.toLocaleString() : calcVal}
                                  </span>
                                ) : (
                                  <span style={{ color: '#d1d5db' }}>—</span>
                                )}
                              </td>
                              {user.is_admin && (
                                <td>
                                  {!isConst && (
                                    <button onClick={() => { setEditId(c.id); setEditText(c.formula); }}
                                      className="btn btn-xs btn-ghost" style={{ padding: '1px 4px', fontSize: 10 }}>✏</button>
                                  )}
                                </td>
                              )}
                            </tr>
                          );});
                        })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
              <div className="flex gap-3 items-center" style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
                {currentStep > 0 && (
                  <button onClick={() => goToStep(currentStep - 1)} className="btn btn-ghost btn-sm">← Precedente</button>
                )}
                {currentStep < STEPS.length - 1 && (
                  <button onClick={() => goToStep(currentStep + 1)} className="btn btn-ghost btn-sm">Successivo →</button>
                )}
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  Step {currentStep + 1} di {STEPS.length}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

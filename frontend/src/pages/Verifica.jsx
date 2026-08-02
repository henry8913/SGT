import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { projects, formulas as formulasApi } from '../api/client';

const STEPS = [
  { key: 'macchina',      sheet: 'Caratteristiche_macchina',  label: 'Caratteristiche macchina' },
  { key: 'geometria',     sheet: 'Geometria_braccio',          label: 'Geometria braccio' },
  { key: 'masse',         sheet: 'Masse_proprie',              label: 'Masse proprie' },
  { key: 'baricentri',    sheet: 'Baricentri',                 label: 'Baricentri' },
  { key: 'aree_vento',    sheet: 'A_b',                        label: 'Aree vento - A_b' },
  { key: 'aree_vento',    sheet: 'A_rc',                       label: 'Aree vento - A_rc' },
  { key: 'aree_vento',    sheet: 'A_cb',                       label: 'Aree vento - A_cb' },
  { key: 'aree_vento',    sheet: 'A_Pu',                       label: 'Aree vento - A_Pu' },
  { key: 'vento',         sheet: 'Vento',                      label: 'Vento' },
  { key: 'stabilita_q',   sheet: 'Stabilità C25-Q',            label: 'Stabilità C25-Q' },
  { key: 'stabilita_d',   sheet: 'Stabilità C25-D',            label: 'Stabilità C25-D' },
  { key: 'carichi_ralla', sheet: 'Carrichi ralla e base - C25',label: 'Carichi ralla' },
  { key: 'curve_carico',  sheet: 'Curve_di_carico II',         label: 'Curve carico II' },
  { key: 'curve_carico',  sheet: 'Curve_di_carico II IV',      label: 'Curve carico II/IV' },
  { key: 'diagramma',     sheet: 'Diagramma di carico',        label: 'Diagramma carico' },
];

const MACHINE_CELL_MAP = {
  sbraccio_max: 'S3', carico_punta_tiro2: 'S4', carico_punta_tiro24: 'S5',
  carico_max_tiro2: 'S6', escursione_carrello_tiro2: 'S7', carico_max_tiro24: 'S8',
  escursione_carrello_tiro24: 'S9', altezza_max: 'S10', diametro_funi_sollevamento: 'S11', diametro_fune_carrello: 'S12',
};

const CELL_TO_MACHINE_MAP = Object.fromEntries(Object.entries(MACHINE_CELL_MAP).map(([k, v]) => [v, k]));

export default function Verifica() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [cells, setCells] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [pendingInputs, setPendingInputs] = useState({});
  const saveRef = useRef(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { projects.list().then(r => setProjectsList(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    const urlProjectId = searchParams.get('projectId');
    if (urlProjectId && projectsList.length > 0) {
      const id = parseInt(urlProjectId);
      if (!selectedProject && projectsList.some(p => p.id === id)) handleProjectSelect(id);
    }
  }, [projectsList]);

  const currentStepDef = STEPS[currentStep];
  const stepKey = currentStepDef?.key;
  const stepSheet = currentStepDef?.sheet;

  const loadStep = useCallback(async (projectId, idx) => {
    const sd = STEPS[idx];
    setLoading(true); setResults(null); setEditId(null); setPendingInputs({});
    try {
      const res = await formulasApi.list({ sheet: sd.sheet });
      setCells(res.data || []);

      const newInputs = {};
      try {
        const machineRes = await api.get(`/projects/${projectId}/machine`);
        if (machineRes.data) Object.entries(machineRes.data).forEach(([key, val]) => {
          if (val !== null && val !== undefined && !['id', 'project_id', 'created_at'].includes(key))
            newInputs[MACHINE_CELL_MAP[key] || key] = String(val);
        });
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
        const geomRes = await api.get(`/projects/${projectId}/geometry`);
        if (Array.isArray(geomRes.data)) geomRes.data.forEach((g, i) => { if (g.lunghezza !== null) newInputs[`L${i + 16}`] = String(g.lunghezza); });
      } catch (e) {}

      setInputValues(newInputs);

      const resR = await api.get(`/projects/${projectId}/risultati`);
      for (const r of resR.data) { if (r.step === sd.key) setResults(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati); }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  const saveStepData = async (values) => {
    const vals = values || inputValues;
    if (!selectedProject || !stepKey) return;
    if (stepKey === 'macchina' || stepKey === 'baricentri') {
      const mData = {};
      cells.forEach(c => {
        if (vals[c.campo] !== undefined) { const v = parseFloat(vals[c.campo]); if (!isNaN(v)) mData[CELL_TO_MACHINE_MAP[c.campo] || c.campo] = v; }
      });
      if (Object.keys(mData).length) await api.put(`/projects/${selectedProject}/machine`, mData);
    }
    if (['stabilita_q', 'stabilita_d', 'vento', 'carichi_ralla'].includes(stepKey)) {
      for (const [key, val] of Object.entries(vals)) {
        if (val !== undefined && val !== '') { const v = parseFloat(val); if (!isNaN(v)) {
          const existing = await api.get(`/projects/${selectedProject}/stability`);
          const found = existing.data.find(p => p.parametro === key);
          if (found) await api.put(`/projects/${selectedProject}/stability/${found.id}`, { valore: v });
          else await api.post(`/projects/${selectedProject}/stability`, { parametro: key, valore: v });
        }}
      }
    }
    if (stepKey === 'masse') {
      const mData = [];
      cells.forEach(c => {
        if (vals[c.campo] !== undefined) {
          const idx = parseInt(c.campo.match(/\d+/)?.[0] || '1') - 1;
          if (!mData[idx]) mData[idx] = {};
          const v = parseFloat(vals[c.campo]);
          if (!isNaN(v)) { if (c.campo.startsWith('Q')) mData[idx].massa_kg = v; if (c.campo.startsWith('T')) mData[idx].braccio_m = v; }
        }
      });
      for (let i = 0; i < mData.length; i++) { if (mData[i]) { try {
        const existing = await api.get(`/projects/${selectedProject}/masses`);
        if (existing.data[i]) await api.put(`/projects/${selectedProject}/masses/${existing.data[i].id}`, mData[i]);
        else await api.post(`/projects/${selectedProject}/masses`, mData[i]);
      } catch (e) { await api.post(`/projects/${selectedProject}/masses`, mData[i]); } } }
    }
    if (stepKey === 'geometria') {
      for (const [key, val] of Object.entries(vals)) {
        if (val !== undefined && val !== '' && key.startsWith('L')) {
          const v = parseFloat(val); if (!isNaN(v)) { try {
            const existing = await api.get(`/projects/${selectedProject}/geometry`);
            const idx = parseInt(key.match(/\d+/)?.[0] || '0') - 16;
            if (existing.data[idx]) await api.put(`/projects/${selectedProject}/geometry/${existing.data[idx].id}`, { lunghezza: v });
          } catch (e) {} }
        }
      }
    }
    if (stepKey === 'aree_vento') {
      for (const [key, val] of Object.entries(vals)) {
        if (val !== undefined && val !== '' && key.startsWith('V')) {
          const v = parseFloat(val); if (!isNaN(v)) { try {
            const existing = await api.get(`/projects/${selectedProject}/wind-areas`);
            const idx = parseInt(key.match(/\d+/)?.[0] || '0') - 1;
            if (existing.data[idx]) await api.put(`/projects/${selectedProject}/wind-areas/${existing.data[idx].id}`, { valore: v });
            else await api.post(`/projects/${selectedProject}/wind-areas`, { parte: stepSheet?.split('_').pop()?.toLowerCase() || '', valore: v });
          } catch (e) {} }
        }
      }
    }
    if (stepKey === 'curve_carico') {
      const cData = [];
      cells.forEach(c => {
        if (vals[c.campo] !== undefined && c.campo.startsWith('R')) {
          const idx = parseInt(c.campo.match(/\d+/)?.[0] || '1') - 1;
          if (!cData[idx]) cData[idx] = {};
          const v = parseFloat(vals[c.campo]); if (!isNaN(v)) cData[idx].carico_kg = v;
        }
      });
      for (let i = 0; i < cData.length; i++) { if (cData[i]) { try {
        const existing = await api.get(`/projects/${selectedProject}/load-curves`);
        if (existing.data[i]) await api.put(`/projects/${selectedProject}/load-curves/${existing.data[i].id}`, cData[i]);
        else await api.post(`/projects/${selectedProject}/load-curves`, cData[i]);
      } catch (e) { await api.post(`/projects/${selectedProject}/load-curves`, cData[i]); } } }
    }
  };

  const recalculate = async (pid, targetStepKey) => {
    const sk = targetStepKey || stepKey;
    setStatus('calculating');
    try {
      await api.post(`/projects/${pid || selectedProject}/calcola`);
      const resR = await api.get(`/projects/${pid || selectedProject}/risultati`);
      for (const r of resR.data) { if (r.step === sk) setResults(typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati); }
      setStatus('done');
      setTimeout(() => setStatus(s => s === 'done' ? 'idle' : s), 2500);
    } catch (err) { console.error('Calc error:', err); setStatus('idle'); }
  };

  const confirmInput = async (campo) => {
    const val = pendingInputs[campo];
    if (val === undefined) return;
    const newInputs = { ...inputValues, [campo]: val };
    setInputValues(newInputs);
    setPendingInputs(prev => { const n = { ...prev }; delete n[campo]; return n; });
    setStatus('saving');
    try {
      await saveStepData(newInputs);
      setStatus('saved');
      setTimeout(() => {
        setStatus('calculating');
        recalculate(selectedProject, stepKey);
      }, 300);
    } catch (e) { setStatus('idle'); }
  };

  const cancelInput = (campo) => {
    setPendingInputs(prev => { const n = { ...prev }; delete n[campo]; return n; });
  };

  const handleProjectSelect = async (projectId) => {
    setSelectedProject(projectId); setCurrentStep(0); setInputValues({});
    loadStep(projectId, 0);
  };

  const goToStep = async (idx) => {
    setCurrentStep(idx); setInputValues({});
    loadStep(selectedProject, idx);
  };

  const saveFormula = async (id, newFormula) => {
    try {
      await formulasApi.update(id, { formula: newFormula }); setEditId(null);
      const res = await formulasApi.list({ sheet: stepSheet }); setCells(res.data || []);
      await saveStepData();
      await recalculate(selectedProject, stepKey);
    } catch (err) { alert('Errore salvataggio formula'); }
  };

  const resultsValues = results?.values || {};
  const inputs = cells.filter(c => (c.cell_type || 'formula') === 'input');
  const formulaCells = cells.filter(c => (c.cell_type || 'formula') === 'formula');
  const constants = cells.filter(c => (c.cell_type || '') === 'constant');

  const groups = {};
  cells.forEach(c => { const m = c.campo.match(/(\d+)/); if (!m) return; const r = parseInt(m[1]); if (!groups[r]) groups[r] = []; groups[r].push(c); });
  Object.values(groups).forEach(arr => { arr.sort((a, b) => { const ca = a.campo.match(/^([A-Z]+)/)[1]; const cb = b.campo.match(/^([A-Z]+)/)[1]; return ca.length !== cb.length ? ca.length - cb.length : ca.localeCompare(cb); }); });
  const sortedRows = Object.entries(groups).sort(([a],[b]) => parseInt(a)-parseInt(b));

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Specchio esatto del file Excel — modifica input/formule, i risultati si aggiornano</p>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Progetto:</span>
        <select value={selectedProject || ''} onChange={e => handleProjectSelect(parseInt(e.target.value))}
          style={{ width: 'auto', minWidth: 200, background: '#fff', padding: '6px 10px' }}>
          <option value="">Seleziona progetto...</option>
          {projectsList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {selectedProject && (
        <>
          <div className="step-bar" style={{ marginBottom: 24, minWidth: 700, overflowX: 'auto' }}>
            {STEPS.map((s, i) => (
              <button key={s.sheet} onClick={() => goToStep(i)}
                className={`step-item ${i < currentStep ? 'step-done' : i === currentStep ? 'step-current' : 'step-pending'}`}
                style={{ border: 'none', cursor: 'pointer', textAlign: 'center' }}>{s.label}</button>
            ))}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 13, color: 'var(--gray)' }}>{stepSheet}</span>
              <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 12 }}>{cells.length} celle ({inputs.length} input, {formulaCells.length} formule, {constants.length} costanti)</span>
            </div>
            <div style={{
              fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
              color: status === 'calculating' ? '#D4A017' : status === 'done' ? '#16a34a' : status === 'saving' ? '#0070C0' : '#6b7280',
              fontWeight: status === 'done' ? 600 : 400,
            }}>
              {status === 'saving' && <><span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #0070C0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Salvataggio...</>}
              {status === 'calculating' && <><span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #D4A017', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Calcolo formule...</>}
              {status === 'done' && <><span style={{ color: '#16a34a' }}>✓</span> Formule aggiornate</>}
              {status === 'idle' && (Object.keys(pendingInputs).length > 0 ? '✎ Modifiche in sospeso' : '')}
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
          ) : cells.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)', fontSize: 13 }}>
              Nessun dato per questo foglio.
            </div>
          ) : (
            <div className="card">
              <div className="table-wrap" style={{ maxHeight: 550, overflowY: 'auto' }}>
                <table style={{ fontSize: 11 }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ width: 24 }}>#</th>
                      <th style={{ width: 55, color: '#D4A017' }}>Cella</th>
                      <th style={{ width: 36 }}>T</th>
                      <th style={{ minWidth: 260 }}>Etichetta</th>
                      <th style={{ minWidth: 120 }}>Valore / Input</th>
                      <th style={{ minWidth: 120 }}>Dettaglio {user.is_admin && <span style={{ fontWeight: 400, fontSize: 9, color: '#9ca3af' }}>(clicca formula per modificare)</span>}</th>
                      <th style={{ width: 90 }}>Risultato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map(([rowNum, rowCells]) => {
                      const labelCells = rowCells.filter(c => c.cell_type === 'label');
                      const valueCells = rowCells.filter(c => c.cell_type !== 'label');
                      return valueCells.map((c, ci) => {
                        const isInput = c.cell_type === 'input' || c.cell_type === 'constant';
                        const isFormula = c.cell_type === 'formula';
                        const calcVal = resultsValues?.[c.campo];
                        const isEditing = editId === c.id;
                        const rowLabel = c.label || (labelCells.length > 0 ? labelCells.map(l => l.default_value || l.formula).join(' ').trim() : '');
                        const showRowNum = ci === 0;
                        const curVal = inputValues[c.campo] !== undefined ? inputValues[c.campo] : (c.default_value || '');
                        const pendingVal = pendingInputs[c.campo];
                        const hasPending = pendingVal !== undefined;
                        const displayVal = hasPending ? pendingVal : curVal;

                        return (
                        <tr key={c.id || c.campo}
                          style={{ background: isInput ? '#E3F0FF' : '#fff', borderBottom: '1px solid #eef2f6' }}>
                          <td style={{ color: '#9ca3af', fontSize: 10, fontFamily: 'monospace', textAlign: 'center' }}>{showRowNum && <span>{rowNum}</span>}</td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 10, color: isInput ? '#0070C0' : '#1e1e2e' }}>{c.campo}</td>
                          <td>{isInput ? <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, background: '#0070C0', color: '#fff' }}>IN</span>
                            : <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, border: '1.5px solid #1e1e2e' }}>FX</span>}</td>
                          <td style={{ color: '#374151', fontSize: 12, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rowLabel}>{rowLabel || c.campo}</td>
                          <td>
                            {isInput ? (
                              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                <input type="text"
                                  value={displayVal}
                                  placeholder="0"
                                  style={{
                                    flex: 1, minWidth: 70, maxWidth: 110, padding: '3px 6px', fontSize: 12, fontFamily: 'monospace', fontWeight: 600,
                                    border: hasPending ? '2px solid #D4A017' : '2px solid #0070C0', borderRadius: 4,
                                    background: hasPending ? '#FFFDE7' : '#F0F7FF', color: '#0070C0', boxSizing: 'border-box',
                                  }}
                                  onChange={e => setPendingInputs(prev => ({...prev, [c.campo]: e.target.value}))} />
                                {hasPending ? (
                                  <>
                                    <button onClick={() => confirmInput(c.campo)} className="btn btn-xs btn-dark" style={{ padding: '2px 6px', fontSize: 10 }}>Ok</button>
                                    <button onClick={() => cancelInput(c.campo)} className="btn btn-xs btn-ghost" style={{ padding: '2px 6px', fontSize: 10 }}>X</button>
                                  </>
                                ) : null}
                              </div>
                            ) : (
                              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 500, color: '#6b7280', padding: '4px 0' }}>{c.formula}</span>
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
                              <code onClick={() => { if (user.is_admin && isFormula) { setEditId(c.id); setEditText(c.formula); } }}
                                style={{
                                  fontSize: 10, fontFamily: 'monospace', color: '#1e1e2e', wordBreak: 'break-all',
                                  cursor: user.is_admin && isFormula ? 'pointer' : 'default',
                                  textDecoration: user.is_admin && isFormula ? 'underline dotted #9ca3af' : 'none',
                                }}>
                                {isInput ? displayVal : c.formula}
                              </code>
                            )}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
                            {isInput ? (
                              <span style={{ color: '#0070C0' }}>{displayVal}</span>
                            ) : calcVal !== undefined ? (
                              <span style={{ color: '#1e1e2e' }} title={`Formula: ${c.formula}`}>
                                <span style={{ fontSize: 9, opacity: 0.5, marginRight: 2 }}>ƒx</span>
                                {typeof calcVal === 'number' ? calcVal.toLocaleString() : calcVal}
                              </span>
                            ) : (
                              <span style={{ color: '#d1d5db' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );});
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3 items-center" style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
                {currentStep > 0 && <button onClick={() => goToStep(currentStep - 1)} className="btn btn-ghost btn-sm">← Precedente</button>}
                {currentStep < STEPS.length - 1 && <button onClick={() => goToStep(currentStep + 1)} className="btn btn-ghost btn-sm">Successivo →</button>}
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Foglio {currentStep + 1} di {STEPS.length}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

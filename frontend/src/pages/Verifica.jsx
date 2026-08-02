import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { projects, calculate } from '../api/client';

const STEPS = [
  { key: 'macchina', label: 'Caratteristiche macchina' },
  { key: 'geometria', label: 'Geometria braccio' },
  { key: 'masse', label: 'Masse proprie' },
  { key: 'baricentri', label: 'Baricentri' },
  { key: 'aree_vento', label: 'Aree vento' },
  { key: 'vento', label: 'Vento' },
  { key: 'stabilita_q', label: 'Stabilità C25-Q' },
  { key: 'stabilita_d', label: 'Stabilità C25-D' },
  { key: 'curve_carico', label: 'Curve di carico' },
  { key: 'carichi_ralla', label: 'Carichi ralla' },
  { key: 'diagramma', label: 'Diagramma carico' },
];

const MACHINE_FIELDS = [
  { key: 'sbraccio_max', label: 'Sbraccio massimo (m)' },
  { key: 'carico_punta_tiro2', label: 'Carico utile punta · tiro II (kg)' },
  { key: 'carico_punta_tiro24', label: 'Carico utile punta · tiro II/IV (kg)' },
  { key: 'carico_max_tiro2', label: 'Carico max · tiro II (kg)' },
  { key: 'escursione_carrello_tiro2', label: 'Escursione carrello · tiro II (m)' },
  { key: 'carico_max_tiro24', label: 'Carico max · tiro II/IV (kg)' },
  { key: 'escursione_carrello_tiro24', label: 'Escursione carrello · tiro II/IV (m)' },
  { key: 'altezza_max', label: 'Altezza max sotto gancio (m)' },
  { key: 'diametro_funi_sollevamento', label: 'Diametro funi sollevamento (mm)' },
  { key: 'diametro_fune_carrello', label: 'Diametro fune carrello (mm)' },
];

const RESULT_STEPS = ['baricentri', 'vento', 'stabilita_q', 'stabilita_d', 'carichi_ralla', 'diagramma'];

export default function Verifica() {
  const [searchParams] = useSearchParams();
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');

  const [machine, setMachine] = useState(null);
  const [geometry, setGeometry] = useState([]);
  const [masses, setMasses] = useState([]);
  const [windAreas, setWindAreas] = useState([]);
  const [loadCurves, setLoadCurves] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => { projects.list().then(r => setProjectsList(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    const urlProjectId = searchParams.get('projectId');
    if (urlProjectId && projectsList.length > 0) {
      const id = parseInt(urlProjectId);
      if (!selectedProject && projectsList.some(p => p.id === id)) handleProjectSelect(id);
    }
  }, [projectsList]);

  const stepKey = STEPS[currentStep]?.key;

  const loadProject = useCallback(async (projectId) => {
    setLoading(true); setStatus('idle');
    try {
      const [m, g, ms, wa, lc, rr] = await Promise.all([
        api.get(`/projects/${projectId}/machine`).catch(() => ({ data: null })),
        api.get(`/projects/${projectId}/geometry`).catch(() => ({ data: [] })),
        api.get(`/projects/${projectId}/masses`).catch(() => ({ data: [] })),
        api.get(`/projects/${projectId}/wind-areas`).catch(() => ({ data: [] })),
        api.get(`/projects/${projectId}/load-curves`).catch(() => ({ data: [] })),
        api.get(`/projects/${projectId}/risultati`).catch(() => ({ data: [] })),
      ]);
      setMachine(m.data || {});
      setGeometry(Array.isArray(g.data) ? g.data : []);
      setMasses(Array.isArray(ms.data) ? ms.data : []);
      setWindAreas(Array.isArray(wa.data) ? wa.data : []);
      setLoadCurves(Array.isArray(lc.data) ? lc.data : []);
      const resMap = {};
      for (const r of rr.data || []) {
        resMap[r.step] = typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati;
      }
      setResults(resMap);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  const handleProjectSelect = async (projectId) => {
    setSelectedProject(projectId);
    setCurrentStep(0);
    loadProject(projectId);
  };

  const recalculate = async () => {
    setStatus('calculating');
    try {
      await calculate.run(selectedProject);
      const rr = await calculate.results(selectedProject);
      const resMap = {};
      for (const r of rr.data || []) {
        resMap[r.step] = typeof r.dati === 'string' ? JSON.parse(r.dati) : r.dati;
      }
      setResults(resMap);
      setStatus('done');
      setTimeout(() => setStatus(s => (s === 'done' ? 'idle' : s)), 2500);
    } catch (err) {
      console.error('Calc error:', err);
      setStatus('idle');
    }
  };

  const saveMachine = async () => {
    if (!machine) return;
    setStatus('saving');
    try {
      await api.put(`/projects/${selectedProject}/machine`, machine);
      setStatus('saved');
      setTimeout(() => { recalculate(); }, 300);
    } catch (e) { setStatus('idle'); }
  };

  const saveGeometry = async () => {
    setStatus('saving');
    try {
      for (const g of geometry) {
        if (g.id) await api.put(`/projects/${selectedProject}/geometry/${g.id}`, { lunghezza: g.lunghezza, profilo: g.profilo });
        else await api.post(`/projects/${selectedProject}/geometry`, g).catch(() => {});
      }
      setStatus('saved');
      setTimeout(() => { recalculate(); }, 300);
    } catch (e) { setStatus('idle'); }
  };

  const saveMasses = async () => {
    setStatus('saving');
    try {
      for (const m of masses) {
        const payload = { massa_kg: m.massa_kg, braccio_m: m.braccio_m, utilizzato: m.utilizzato };
        if (m.id) await api.put(`/projects/${selectedProject}/masses/${m.id}`, payload);
        else await api.post(`/projects/${selectedProject}/masses`, payload).catch(() => {});
      }
      setStatus('saved');
      setTimeout(() => { recalculate(); }, 300);
    } catch (e) { setStatus('idle'); }
  };

  const saveWindAreas = async () => {
    setStatus('saving');
    try {
      for (const a of windAreas) {
        const payload = { valore: a.valore, coordinata_x: a.coordinata_x, coordinata_y: a.coordinata_y };
        if (a.id) await api.put(`/projects/${selectedProject}/wind-areas/${a.id}`, payload);
        else await api.post(`/projects/${selectedProject}/wind-areas`, { parte: a.parte, parametro: a.parametro, ...payload }).catch(() => {});
      }
      setStatus('saved');
      setTimeout(() => { recalculate(); }, 300);
    } catch (e) { setStatus('idle'); }
  };

  const saveLoadCurves = async () => {
    setStatus('saving');
    try {
      for (const c of loadCurves) {
        const payload = { carico_kg: c.carico_kg };
        if (c.id) await api.put(`/projects/${selectedProject}/load-curves/${c.id}`, payload);
        else await api.post(`/projects/${selectedProject}/load-curves`, { raggio_m: c.raggio_m, tipo: c.tipo, ...payload }).catch(() => {});
      }
      setStatus('saved');
      setTimeout(() => { recalculate(); }, 300);
    } catch (e) { setStatus('idle'); }
  };

  const num = (e) => (e.target.value === '' ? null : parseFloat(e.target.value));

  const renderResultsTable = (title, data, columns) => {
    if (!data) return null;
    return (
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">{title}</div>
        <div className="card-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {columns.map(c => <td key={c.key} style={c.bold ? { fontWeight: 600 } : undefined}>{row[c.key]?.toLocaleString?.() ?? row[c.key] ?? '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    const res = results[stepKey];
    switch (stepKey) {
      case 'macchina':
        return (
          <div className="card">
            <div className="card-header">Caratteristiche macchina</div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {MACHINE_FIELDS.map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#333' }}>{f.label}</label>
                    <input type="number" step="any" value={machine[f.key] ?? ''}
                      onChange={e => setMachine({ ...machine, [f.key]: num(e) })}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, background: '#F0F7FF', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <button onClick={saveMachine} className="btn btn-dark btn-sm">Salva e ricalcola</button>
              </div>
            </div>
          </div>
        );
      case 'geometria':
        return (
          <div className="card">
            <div className="card-header">Geometria braccio</div>
            <div className="card-body">
              {geometry.length === 0 ? <p style={{ color: 'var(--gray)', fontSize: 13 }}>Nessun elemento geometrico inserito.</p> : (
                <div className="table-wrap">
                  <table style={{ fontSize: 13 }}>
                    <thead>
                      <tr><th>Elemento</th><th>Modulo</th><th>Profilo</th><th>Lunghezza (m)</th></tr>
                    </thead>
                    <tbody>
                      {geometry.map((g, i) => (
                        <tr key={g.id || i}>
                          <td>{g.elemento || '—'}</td>
                          <td>{g.modulo || '—'}</td>
                          <td><input value={g.profilo ?? ''} onChange={e => { const n = [...geometry]; n[i] = { ...g, profilo: e.target.value }; setGeometry(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12 }} /></td>
                          <td><input type="number" step="any" value={g.lunghezza ?? ''} onChange={e => { const n = [...geometry]; n[i] = { ...g, lunghezza: num(e) }; setGeometry(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12 }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <button onClick={saveGeometry} className="btn btn-dark btn-sm">Salva e ricalcola</button>
              </div>
            </div>
          </div>
        );
      case 'masse':
        return (
          <div className="card">
            <div className="card-header">Masse proprie</div>
            <div className="card-body">
              {masses.length === 0 ? <p style={{ color: 'var(--gray)', fontSize: 13 }}>Nessuna massa inserita.</p> : (
                <div className="table-wrap">
                  <table style={{ fontSize: 13 }}>
                    <thead>
                      <tr><th>Componente</th><th>Massa (kg)</th><th>Braccio (m)</th><th>Utilizzato</th></tr>
                    </thead>
                    <tbody>
                      {masses.map((m, i) => (
                        <tr key={m.id || i}>
                          <td style={{ fontWeight: 600 }}>{m.componente || '—'}</td>
                          <td><input type="number" step="any" value={m.massa_kg ?? ''} onChange={e => { const n = [...masses]; n[i] = { ...m, massa_kg: num(e) }; setMasses(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12, width: 100 }} /></td>
                          <td><input type="number" step="any" value={m.braccio_m ?? ''} onChange={e => { const n = [...masses]; n[i] = { ...m, braccio_m: num(e) }; setMasses(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12, width: 100 }} /></td>
                          <td><input type="checkbox" checked={!!m.utilizzato} onChange={e => { const n = [...masses]; n[i] = { ...m, utilizzato: e.target.checked }; setMasses(n); }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <button onClick={saveMasses} className="btn btn-dark btn-sm">Salva e ricalcola</button>
              </div>
            </div>
          </div>
        );
      case 'aree_vento':
        return (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">Aree esposte al vento</div>
              <div className="card-body">
                {windAreas.length === 0 ? <p style={{ color: 'var(--gray)', fontSize: 13 }}>Nessuna area vento inserita.</p> : (
                  <div className="table-wrap">
                    <table style={{ fontSize: 13 }}>
                      <thead>
                        <tr><th>Parte</th><th>Parametro</th><th>Valore</th><th>Xcs</th><th>Ycs</th></tr>
                      </thead>
                      <tbody>
                        {windAreas.map((a, i) => (
                          <tr key={a.id || i}>
                            <td style={{ fontWeight: 600 }}>{a.parte}</td>
                            <td>{a.parametro || '—'}</td>
                            <td><input type="number" step="any" value={a.valore ?? ''} onChange={e => { const n = [...windAreas]; n[i] = { ...a, valore: num(e) }; setWindAreas(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12, width: 100 }} /></td>
                            <td><input type="number" step="any" value={a.coordinata_x ?? ''} onChange={e => { const n = [...windAreas]; n[i] = { ...a, coordinata_x: num(e) }; setWindAreas(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12, width: 90 }} /></td>
                            <td><input type="number" step="any" value={a.coordinata_y ?? ''} onChange={e => { const n = [...windAreas]; n[i] = { ...a, coordinata_y: num(e) }; setWindAreas(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12, width: 90 }} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={{ marginTop: 20 }}>
                  <button onClick={saveWindAreas} className="btn btn-dark btn-sm">Salva e ricalcola</button>
                </div>
              </div>
            </div>
            {res && renderResultsTable('Risultato aree vento', [
              { label: 'A_b', value: res.a_b }, { label: 'A_rc', value: res.a_rc }, { label: 'A_cb', value: res.a_cb },
              { label: 'A_Pu', value: res.a_pu }, { label: 'Xcs tot', value: res.xcs_total }, { label: 'Ycs tot', value: res.ycs_total },
            ], [
              { key: 'label', label: 'Parte' },
              { key: 'value', label: 'Valore', bold: true },
            ])}
          </>
        );
      case 'curve_carico':
        return (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">Curve di carico</div>
              <div className="card-body">
                {loadCurves.length === 0 ? <p style={{ color: 'var(--gray)', fontSize: 13 }}>Nessuna curva di carico inserita.</p> : (
                  <div className="table-wrap">
                    <table style={{ fontSize: 13 }}>
                      <thead>
                        <tr><th>Tipo</th><th>Raggio (m)</th><th>Carico max (kg)</th></tr>
                      </thead>
                      <tbody>
                        {loadCurves.map((c, i) => (
                          <tr key={c.id || i}>
                            <td style={{ fontWeight: 600 }}>{c.tipo}</td>
                            <td>{c.raggio_m}</td>
                            <td><input type="number" step="any" value={c.carico_kg ?? ''} onChange={e => { const n = [...loadCurves]; n[i] = { ...c, carico_kg: num(e) }; setLoadCurves(n); }} style={{ background: '#fff', padding: '4px 6px', fontSize: 12, width: 100 }} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={{ marginTop: 20 }}>
                  <button onClick={saveLoadCurves} className="btn btn-dark btn-sm">Salva e ricalcola</button>
                </div>
              </div>
            </div>
            {res?.points && renderResultsTable('Risultato curve di carico', res.points, [
              { key: 'raggio', label: 'Raggio (m)' },
              { key: 'carico_max', label: 'Carico max (kg)' },
            ])}
          </>
        );
      case 'baricentri':
        return res && renderResultsTable('Baricentri', [
          { label: 'X baricentro', value: res.x_cg }, { label: 'Y baricentro', value: res.y_cg }, { label: 'Z baricentro', value: res.z_cg },
          { label: 'Massa totale', value: res.total_mass }, { label: 'Momento X', value: res.moment_x },
          { label: 'Momento Y', value: res.moment_y }, { label: 'Momento Z', value: res.moment_z },
        ], [
          { key: 'label', label: 'Grandezza' },
          { key: 'value', label: 'Valore', bold: true },
        ]);
      case 'vento':
        return res && renderResultsTable('Vento', [
          { label: 'Pressione normativa', value: res.p_norma }, { label: 'F braccio', value: res.fw_braccio }, { label: 'F rotazione', value: res.fw_rotazione },
          { label: 'F controbraccio', value: res.fw_controbraccio }, { label: 'F carico', value: res.fw_carico },
          { label: 'F totale', value: res.fw_total }, { label: 'Momento vento', value: res.moment_wind },
        ], [
          { key: 'label', label: 'Grandezza' },
          { key: 'value', label: 'Valore', bold: true },
        ]);
      case 'stabilita_q':
      case 'stabilita_d':
        return res && renderResultsTable(stepKey === 'stabilita_q' ? 'Stabilità C25-Q' : 'Stabilità C25-D', res.conditions || [], [
          { key: 'condition_id', label: 'Cond.', bold: true }, { key: 'v', label: 'V (kg)' }, { key: 'mr', label: 'Mr (kgm)' },
          { key: 'mw', label: 'Mw (kgm)' }, { key: 'mtot', label: 'Mtot (kgm)' }, { key: 't', label: 'T (kg)' },
          { key: 'safety_coefficient', label: 'Coeff. Sic.', bold: true }, { key: 'esito', label: 'Esito' },
        ]);
      case 'carichi_ralla':
        return res && renderResultsTable('Carichi ralla', res.conditions || [], [
          { key: 'condition_id', label: 'Cond.', bold: true }, { key: 'v', label: 'V (kg)' }, { key: 'mr', label: 'Mr (kgm)' },
          { key: 'mw', label: 'Mw (kgm)' }, { key: 'mtot', label: 'Mtot (kgm)' }, { key: 't', label: 'T (kg)' },
          { key: 'mtot_out_in_ratio', label: 'Mtot OUT/IN', bold: true },
        ]);
      case 'diagramma':
        return res && renderResultsTable('Diagramma di carico', res.points || [], [
          { key: 'raggio', label: 'Raggio (m)' }, { key: 'carico_max', label: 'Carico max (kg)' }, { key: 'carico_effettivo', label: 'Carico effettivo (kg)' },
        ]);
      default:
        return null;
    }
  };

  const isResultOnly = RESULT_STEPS.includes(stepKey);
  const hasResult = !!results[stepKey];

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Inserisci i dati del progetto, il motore Python calcola ogni step</p>
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
              <button key={s.key} onClick={() => setCurrentStep(i)}
                className={`step-item ${i < currentStep ? 'step-done' : i === currentStep ? 'step-current' : 'step-pending'}`}
                style={{ border: 'none', cursor: 'pointer', textAlign: 'center' }}>{s.label}</button>
            ))}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 13, color: 'var(--gray)' }}>{STEPS[currentStep].label}</span>
              {isResultOnly && <span style={{ fontSize: 12, color: hasResult ? '#16a34a' : '#9ca3af', marginLeft: 12 }}>
                {hasResult ? '✓ risultato calcolato' : 'nessun risultato'}
              </span>}
            </div>
            <div style={{
              fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
              color: status === 'calculating' ? '#D4A017' : status === 'done' ? '#16a34a' : status === 'saving' ? '#0070C0' : '#6b7280',
              fontWeight: status === 'done' ? 600 : 400,
            }}>
              {status === 'saving' && <><span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #0070C0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Salvataggio...</>}
              {status === 'calculating' && <><span className="spinner" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #D4A017', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Calcolo...</>}
              {status === 'done' && <><span style={{ color: '#16a34a' }}>✓</span> Calcolo completato</>}
            </div>
            <button onClick={recalculate} className="btn btn-dark btn-sm">⟳ Ricalcola tutti gli step</button>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
          ) : (
            renderStepContent() || (
              <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)', fontSize: 13 }}>
                Nessun risultato per questo step. Completa i passi di input e premi "Ricalcola".
              </div>
            )
          )}

          <div className="flex gap-3 items-center" style={{ padding: '16px 0' }}>
            {currentStep > 0 && <button onClick={() => setCurrentStep(currentStep - 1)} className="btn btn-ghost btn-sm">← Precedente</button>}
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: '#9ca3af' }}>Step {currentStep + 1} di {STEPS.length}</span>
            {currentStep < STEPS.length - 1 && <button onClick={() => setCurrentStep(currentStep + 1)} className="btn btn-ghost btn-sm">Successivo →</button>}
          </div>
        </>
      )}
    </div>
  );
}

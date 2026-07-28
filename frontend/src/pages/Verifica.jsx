import { useState, useEffect } from 'react';
import { formulas as formulasApi } from '../api/client';

const STEP_INFO = {
  baricentri: { label: 'Baricentri', color: '#e3f2fd', ordine: 1 },
  aree_vento: { label: 'Aree vento', color: '#fce4ec', ordine: 2 },
  vento: { label: 'Vento', color: '#f3e5f5', ordine: 3 },
  stabilita_q: { label: 'Stabilità C25-Q', color: '#e8f5e9', ordine: 4 },
  stabilita_d: { label: 'Stabilità C25-D', color: '#fff3e0', ordine: 5 },
  curve_carico: { label: 'Curve di carico', color: '#f1f8e9', ordine: 6 },
  carichi_ralla: { label: 'Carichi ralla', color: '#e0f7fa', ordine: 7 },
  diagramma: { label: 'Diagramma carico', color: '#fbe9e7', ordine: 8 },
  macchina: { label: 'Caratteristiche macchina', color: '#ede7f6', ordine: 0 },
  geometria: { label: 'Geometria braccio', color: '#e0f2f1', ordine: 0 },
  masse: { label: 'Masse proprie', color: '#fce4ec', ordine: 0 },
  profili: { label: 'Profil beam', color: '#efebe9', ordine: 0 },
};

export default function Verifica() {
  const [allFormulas, setAllFormulas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stepFilter, setStepFilter] = useState('baricentri');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadFormulas(); }, []);

  useEffect(() => {
    let result = allFormulas;
    if (stepFilter) result = result.filter(f => f.step === stepFilter);
    if (search) result = result.filter(f =>
      f.formula.toLowerCase().includes(search.toLowerCase()) ||
      f.campo.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [stepFilter, search, allFormulas]);

  const loadFormulas = async () => {
    try {
      const res = await formulasApi.list(stepFilter);
      setAllFormulas(res.data);
      setFiltered(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadFormulas(); }, [stepFilter]);

  const saveFormula = async (id) => {
    try {
      await formulasApi.update(id, { formula: editText });
      setEditId(null);
      loadFormulas();
    } catch (err) { alert('Errore'); }
  };

  const steps = Object.entries(STEP_INFO).sort((a, b) => a[1].ordine - b[1].ordine);

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Verifica calcolo</h1>
        <p>Controlla step per step tutte le formule importate dall'Excel</p>
      </div>

      <div className="msg msg-info" style={{ marginBottom: 20 }}>
        <strong>🔍 Come funziona:</strong> Seleziona uno step dal menu qui sotto.
        Vedi tutte le formule di quello step, i valori in ingresso e i risultati.
        Se trovi un errore, correggi il file Excel e ricaricalo da <strong>Impostazioni → Carica Excel</strong>.
      </div>

      {/* Step selector */}
      <div className="flex gap-2 flex-wrap" style={{ marginBottom: 24 }}>
        {steps.map(([key, info]) => (
          <button
            key={key}
            onClick={() => setStepFilter(key)}
            style={{
              padding: '8px 18px', borderRadius: 999, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: stepFilter === key ? 700 : 500,
              background: stepFilter === key ? '#1e1e2e' : info.color,
              color: stepFilter === key ? '#fff' : '#1e1e2e',
              transition: 'all 0.2s',
            }}
          >
            {info.label}
            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
              ({allFormulas.filter(f => f.step === key).length.toLocaleString()})
            </span>
          </button>
        ))}
      </div>

      {/* Info step */}
      <div style={{
        background: '#f9fafb', borderRadius: 8, padding: '12px 16px', marginBottom: 16,
        fontSize: 13, color: '#6b7280', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <span>{STEP_INFO[stepFilter]?.label} — <strong>{filtered.length.toLocaleString()}</strong> formule</span>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cerca nella formula o cella..."
          style={{ width: 250, padding: '6px 10px', fontSize: 12, background: '#fff' }}
        />
      </div>

      {/* Tabella formule */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrap" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <table style={{ fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ width: 60 }}>Foglio</th>
                <th style={{ width: 60 }}>Cella</th>
                <th>Formula</th>
                <th style={{ width: 60 }}>Excel ref</th>
                {user.is_admin && <th style={{ width: 60 }}>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td style={{ fontSize: 10, color: '#6b7280' }}>{f.sheet}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{f.campo}</td>
                  <td>
                    {editId === f.id ? (
                      <div className="flex gap-2">
                        <input value={editText} onChange={e => setEditText(e.target.value)}
                          style={{ flex: 1, padding: 4, border: '1.5px solid var(--yellow)', borderRadius: 3, fontSize: 11, fontFamily: 'monospace' }} />
                        <button onClick={() => saveFormula(f.id)} className="btn btn-xs btn-dark">Salva</button>
                        <button onClick={() => setEditId(null)} className="btn btn-xs btn-ghost">X</button>
                      </div>
                    ) : (
                      <code style={{ fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {f.formula}
                      </code>
                    )}
                  </td>
                  <td style={{ fontSize: 10, color: '#9ca3af' }}>{f.id ? 'Excel' : '—'}</td>
                  {user.is_admin && (
                    <td>
                      <button onClick={() => { setEditId(f.id); setEditText(f.formula); }}
                        className="btn btn-xs btn-ghost" title="Modifica">✏</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

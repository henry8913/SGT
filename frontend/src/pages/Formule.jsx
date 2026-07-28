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
  profili: { label: 'Profili beam', color: '#efebe9', ordine: 0 },
};
const SHEET_COLORS = Object.fromEntries(Object.entries(STEP_INFO).map(([k, v]) => [k, v.color]));

export default function Formule() {
  const [allFormulas, setAllFormulas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stepFilter, setStepFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadFormulas();
  }, []);

  useEffect(() => {
    let result = allFormulas;
    if (stepFilter) result = result.filter(f => f.step === stepFilter);
    if (search) result = result.filter(f =>
      f.formula.toLowerCase().includes(search.toLowerCase()) ||
      f.campo.toLowerCase().includes(search.toLowerCase()) ||
      (f.label || '').toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [stepFilter, search, allFormulas]);

  const loadFormulas = async () => {
    try {
      const res = await formulasApi.list();
      setAllFormulas(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveFormula = async (id) => {
    try {
      await formulasApi.update(id, { formula: editText });
      setEditId(null);
      loadFormulas();
    } catch (err) {
      alert('Errore durante il salvataggio');
    }
  };

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Formule</h1>
        <p>{allFormulas.length > 0 ? `${allFormulas.length.toLocaleString()} formule caricate dal file Excel` : 'Caricamento...'}</p>
      </div>

      <div className="msg msg-info" style={{ marginBottom: 20 }}>
        <strong>🔍 Verifica calcolo.</strong> Seleziona uno step qui sotto per vedere tutte le formule.
        Confronta con il file Excel originale. Se trovi un errore, correggi l'Excel e carica il file
        aggiornato da <strong>Impostazioni → Carica Excel</strong>.
      </div>

      {/* Step pills */}
      <div className="flex gap-2 flex-wrap" style={{ marginBottom: 16 }}>
        <button onClick={() => setStepFilter('')} style={{
          padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: stepFilter === '' ? 700 : 500,
          background: stepFilter === '' ? '#1e1e2e' : '#e5e7eb',
          color: stepFilter === '' ? '#fff' : '#1e1e2e',
        }}>
          Tutti
        </button>
        {Object.entries(STEP_INFO).sort((a, b) => a[1].ordine - b[1].ordine).map(([key, info]) => (
          <button key={key} onClick={() => setStepFilter(key)} style={{
            padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: stepFilter === key ? 700 : 500,
            background: stepFilter === key ? '#1e1e2e' : info.color,
            color: stepFilter === key ? '#fff' : '#1e1e2e',
          }}>
            {info.label}
            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
              ({allFormulas.filter(f => f.step === key).length.toLocaleString()})
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap" style={{ marginBottom: 20, alignItems: 'center' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cerca formula, cella, label..." style={{ flex: 1, minWidth: 200, background: '#fff' }} />
        <span style={{ fontSize: 13, color: 'var(--gray)' }}>
          {filtered.length.toLocaleString()} formule
        </span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrap" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <table style={{ fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th>Step</th>
                <th>Foglio</th>
                <th>Cella</th>
                <th>Label</th>
                <th>Formula</th>
                <th>Origine</th>
                {user.is_admin && <th>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} style={{ background: (SHEET_COLORS[f.step] || '') + '30' }}>
                  <td style={{ fontWeight: 600 }}>{f.step}</td>
                  <td style={{ fontSize: 11 }}>{f.sheet}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{f.campo}</td>
                  <td style={{ fontSize: 11 }}>{f.label}</td>
                  <td>
                    {editId === f.id ? (
                      <div className="flex gap-2">
                        <input value={editText} onChange={e => setEditText(e.target.value)}
                          style={{ flex: 1, padding: 4, border: '1.5px solid var(--yellow)', borderRadius: 3, fontSize: 11, fontFamily: 'monospace' }} />
                        <button onClick={() => saveFormula(f.id)} className="btn btn-xs btn-yellow">Salva</button>
                        <button onClick={() => setEditId(null)} className="btn btn-xs btn-ghost">X</button>
                      </div>
                    ) : (
                      <code style={{ fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {f.formula}
                      </code>
                    )}
                  </td>
                  <td style={{ fontSize: 10, color: 'var(--gray)' }}>{f.id ? 'Excel' : 'manuale'}</td>
                  {user.is_admin && (
                    <td>
                      <button onClick={() => { setEditId(f.id); setEditText(f.formula); }}
                        className="btn btn-xs btn-ghost" title="Modifica formula">
                        ✏
                      </button>
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

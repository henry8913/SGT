import { useState, useEffect } from 'react';
import { formulas as formulasApi } from '../api/client';

const SHEET_COLORS = {
  baricentri: '#e3f2fd', aree_vento: '#fce4ec', vento: '#f3e5f5',
  stabilita_q: '#e8f5e9', stabilita_d: '#fff3e0', carichi_ralla: '#e0f7fa',
  curve_carico: '#f1f8e9', diagramma: '#fbe9e7', macchina: '#ede7f6',
  geometria: '#e0f2f1', masse: '#fce4ec', profili: '#efebe9',
};

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

  const steps = [...new Set(allFormulas.map(f => f.step))].sort();

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Formule</h2>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        {allFormulas.length > 0 ? `${allFormulas.length.toLocaleString()} formule caricate dal file Excel` : 'Caricamento...'}
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select
          value={stepFilter}
          onChange={e => setStepFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
        >
          <option value="">Tutti gli step</option>
          {steps.map(s => (
            <option key={s} value={s}>{s} ({allFormulas.filter(f => f.step === s).length.toLocaleString()})</option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca formula, cella, label..."
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, flex: 1, minWidth: 200 }}
        />
        <span style={{ padding: '8px 0', fontSize: 13, color: '#666' }}>
          {filtered.length.toLocaleString()} risultati
        </span>
      </div>

      <div style={{ background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ position: 'sticky', top: 0, background: '#f5f5f5', zIndex: 1 }}>
              <tr>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left', width: 80 }}>Step</th>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left', width: 100 }}>Foglio</th>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left', width: 60 }}>Cella</th>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Label</th>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Formula</th>
                {user.is_admin && <th style={{ padding: 8, border: '1px solid #ddd', width: 80 }}>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} style={{ background: SHEET_COLORS[f.step] || '#fff' }}>
                  <td style={{ padding: 6, border: '1px solid #ddd', fontWeight: 600 }}>{f.step}</td>
                  <td style={{ padding: 6, border: '1px solid #ddd', fontSize: 11 }}>{f.sheet}</td>
                  <td style={{ padding: 6, border: '1px solid #ddd', fontFamily: 'monospace' }}>{f.campo}</td>
                  <td style={{ padding: 6, border: '1px solid #ddd', fontSize: 11 }}>{f.label}</td>
                  <td style={{ padding: 6, border: '1px solid #ddd' }}>
                    {editId === f.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          style={{ flex: 1, padding: 4, border: '1px solid #1a237e', borderRadius: 2, fontSize: 11, fontFamily: 'monospace' }}
                        />
                        <button onClick={() => saveFormula(f.id)} style={{ padding: '4px 8px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 11 }}>
                          Salva
                        </button>
                        <button onClick={() => setEditId(null)} style={{ padding: '4px 8px', background: '#e0e0e0', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 11 }}>
                          X
                        </button>
                      </div>
                    ) : (
                      <code style={{ fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {f.formula}
                      </code>
                    )}
                  </td>
                  {user.is_admin && (
                    <td style={{ padding: 6, border: '1px solid #ddd' }}>
                      <button
                        onClick={() => { setEditId(f.id); setEditText(f.formula); }}
                        style={{ padding: '4px 8px', background: '#e8eaf6', border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 11 }}
                      >
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

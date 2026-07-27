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
      <div className="page-header page-header-accent">
        <h1>Formule</h1>
        <p>{allFormulas.length > 0 ? `${allFormulas.length.toLocaleString()} formule caricate dal file Excel` : 'Caricamento...'}</p>
      </div>

      <div className="msg msg-info" style={{ marginBottom: 20 }}>
        <strong>🔍 Solo visualizzazione.</strong> Le formule vengono importate automaticamente dal file Excel
        tramite la sezione <strong>Impostazioni → Carica Excel</strong>.
        {user.is_admin && ' Se noti un errore, correggi direttamente nel file Excel e ricaricalo.'}
      </div>

      <div className="flex gap-3 flex-wrap" style={{ marginBottom: 20 }}>
        <select value={stepFilter} onChange={e => setStepFilter(e.target.value)} style={{ width: 'auto', minWidth: 200, background: '#fff' }}>
          <option value="">Tutti gli step</option>
          {steps.map(s => (
            <option key={s} value={s}>{s} ({allFormulas.filter(f => f.step === s).length.toLocaleString()})</option>
          ))}
        </select>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cerca formula, cella, label..." style={{ flex: 1, minWidth: 200, background: '#fff' }} />
        <span style={{ padding: '8px 0', fontSize: 13, color: 'var(--gray)' }}>
          {filtered.length.toLocaleString()} risultati
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

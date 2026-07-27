import { useState } from 'react';
import { formulas } from '../api/client';

export default function FormulaPopover({ step, campo, label, currentValue }) {
  const [open, setOpen] = useState(false);
  const [formula, setFormula] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadFormula = async () => {
    try {
      const res = await formulas.list(step);
      const found = res.data.find(f => f.campo === campo);
      setFormula(found);
      if (found) setEditText(found.formula);
    } catch (err) { setFormula(null); }
    setOpen(true);
  };

  const saveFormula = async () => {
    if (!formula) {
      await formulas.create({ step, campo, label: label || campo, formula: editText, sheet: step });
    } else {
      await formulas.update(formula.id, { formula: editText });
    }
    setFormula({ ...formula, formula: editText });
    setEditMode(false);
  };

  return (
    <>
      <button onClick={loadFormula} title="Mostra formula" className="btn btn-xs btn-ghost" style={{ marginLeft: 4 }}>
        fx
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => { setOpen(false); setEditMode(false); }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: 520 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="card-header flex justify-between items-center">
              <div>
                <strong>{label || campo}</strong>
                <span style={{ fontSize: 11, color: 'var(--steel-light)', marginLeft: 8 }}>{step} — {campo}</span>
              </div>
              <button onClick={() => { setOpen(false); setEditMode(false); }} className="btn btn-xs btn-ghost" style={{ fontSize: 16, lineHeight: 1 }}>×</button>
            </div>
            <div className="card-body">
              {formula ? (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Formula:</div>
                    {editMode ? (
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        style={{ width: '100%', padding: 8, border: '1px solid var(--primary-light)', borderRadius: 4, fontSize: 13, fontFamily: 'monospace', minHeight: 60, boxSizing: 'border-box' }}
                      />
                    ) : (
                      <code style={{ display: 'block', padding: 10, background: 'var(--bg)', borderRadius: 4, fontSize: 13, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        = {formula.formula}
                      </code>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Dipende da: {formula.dipende_da ? JSON.parse(formula.dipende_da).join(', ') : 'nessuna dipendenza'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Valore corrente: <strong style={{ color: 'var(--text)' }}>{currentValue ?? '—'}</strong>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>
                  Nessuna formula salvata per questo campo.
                  {user.is_admin && <span> Puoi aggiungerne una.</span>}
                </div>
              )}

              <div className="flex gap-2" style={{ marginTop: 16 }}>
                {!formula && !editMode && user.is_admin && (
                  <button onClick={() => setEditMode(true)} className="btn btn-ghost btn-sm">+ Aggiungi formula</button>
                )}
                {editMode && user.is_admin && (
                  <>
                    <button onClick={saveFormula} className="btn btn-yellow btn-sm">Salva</button>
                    <button onClick={() => setEditMode(false)} className="btn btn-ghost btn-sm">Annulla</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

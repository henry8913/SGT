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
    } catch (err) {
      setFormula(null);
    }
    setOpen(true);
  };

  const saveFormula = async () => {
    if (!formula) {
      await formulas.create({
        step, campo, label: label || campo,
        formula: editText, sheet: step,
      });
    } else {
      await formulas.update(formula.id, { formula: editText });
    }
    setFormula({ ...formula, formula: editText });
    setEditMode(false);
  };

  return (
    <>
      <button
        onClick={loadFormula}
        title="Mostra formula"
        style={{
          background: '#e8eaf6', border: 'none', borderRadius: 4,
          padding: '2px 6px', cursor: 'pointer', fontSize: 11,
          color: '#1a237e', marginLeft: 4,
        }}
      >
        fx
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.3)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => { setOpen(false); setEditMode(false); }}
        >
          <div
            style={{
              background: '#fff', padding: 24, borderRadius: 8,
              minWidth: 400, maxWidth: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <strong style={{ fontSize: 16 }}>{label || campo}</strong>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                  {step} — {campo}
                </div>
              </div>
              <button
                onClick={() => { setOpen(false); setEditMode(false); }}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}
              >
                ×
              </button>
            </div>

            {formula ? (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Formula:</div>
                  {editMode ? (
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{
                        width: '100%', padding: 8, border: '1px solid #1a237e',
                        borderRadius: 4, fontSize: 13, fontFamily: 'monospace',
                        minHeight: 60, boxSizing: 'border-box',
                      }}
                    />
                  ) : (
                    <code style={{
                      display: 'block', padding: 8, background: '#f5f5f5',
                      borderRadius: 4, fontSize: 13, fontFamily: 'monospace',
                    }}>
                      = {formula.formula}
                    </code>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                  Dipende da: {formula.dipende_da ? JSON.parse(formula.dipende_da).join(', ') : 'nessuna dipendenza'}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Valore corrente: <strong>{currentValue ?? '—'}</strong>
                </div>
              </div>
            ) : (
              <div style={{ color: '#999', fontSize: 13, marginBottom: 12 }}>
                Nessuna formula salvata per questo campo.
              </div>
            )}

            {!formula && !editMode && (
              <button onClick={() => setEditMode(true)} style={{
                padding: '6px 12px', background: '#e8eaf6', border: 'none',
                borderRadius: 4, cursor: 'pointer', fontSize: 13,
              }}>
                + Aggiungi formula
              </button>
            )}

            {editMode && user.is_admin && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={saveFormula} style={{
                  padding: '8px 16px', background: '#1a237e', color: '#fff',
                  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13,
                }}>
                  Salva
                </button>
                <button onClick={() => setEditMode(false)} style={{
                  padding: '8px 16px', background: '#e0e0e0', border: 'none',
                  borderRadius: 4, cursor: 'pointer', fontSize: 13,
                }}>
                  Annulla
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

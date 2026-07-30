import { useState, useEffect } from 'react';
import api, { formulas as formulasApi } from '../../api/client';
import ExcelUpload from './ExcelUpload';

export default function SettingsProfili() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCells();
  }, []);

  const loadCells = async () => {
    setLoading(true);
    try {
      const res = await formulasApi.list({ step: 'profili' });
      setCells(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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
    <div>
      <h2 style={{ marginBottom: 16 }}>Impostazioni</h2>

      <div style={{ marginBottom: 24 }}>
        <ExcelUpload onUploadComplete={loadCells} />
      </div>

      <h3 style={{ marginBottom: 12 }}>Libreria Profili</h3>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        Dati estratti dal foglio <strong>Proprietà_beam</strong> dell'Excel.
        Per aggiornare, carica il file Excel aggiornato sopra.
      </p>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
      ) : cells.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)', fontSize: 13 }}>
          Nessun dato. Carica un file Excel con il foglio Proprietà_beam.
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
                  <th style={{ minWidth: 90 }}>Valore</th>
                  <th>Dettaglio</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map(([rowNum, rowCells]) => {
                  const labelCells = rowCells.filter(c => c.cell_type === 'label');
                  const valueCells = rowCells.filter(c => c.cell_type !== 'label');

                  return valueCells.map((c, ci) => {
                    const isInput = c.cell_type === 'input';
                    const isConst = c.cell_type === 'constant';
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
                        {rowLabel || c.campo}
                      </td>
                      <td>
                        {isConst || isInput ? (
                          <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: isInput ? '#0070C0' : '#6b7280' }}>
                            {c.default_value || c.formula}
                          </span>
                        ) : (
                          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 500, color: '#6b7280' }}>
                            {c.formula}
                          </span>
                        )}
                      </td>
                      <td>
                        <code style={{ fontSize: 10, fontFamily: 'monospace', color: isConst || isInput ? '#6b7280' : '#1e1e2e', wordBreak: 'break-all' }}>
                          {isConst || isInput ? (c.default_value || c.formula) : c.formula}
                        </code>
                      </td>
                    </tr>
                  );});
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid #e5e7eb', fontSize: 11, color: '#9ca3af' }}>
            {cells.length} celle totali dal foglio Proprietà_beam
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import api, { formulas as formulasApi } from '../../api/client';
import ExcelUpload from './ExcelUpload';

export default function SettingsProfili() {
  const [profiles, setProfiles] = useState([]);
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, cellsRes] = await Promise.all([
        api.get('/profiles'),
        formulasApi.list({ step: 'profili' }),
      ]);
      setProfiles(profRes.data || []);
      setCells(cellsRes.data || []);
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
        <ExcelUpload onUploadComplete={loadData} />
      </div>

      <h3 style={{ marginBottom: 12 }}>Libreria Profili</h3>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        Profili strutturali dal foglio Excel <strong>Proprietà_beam</strong>.
        Per aggiornare, carica il file Excel aggiornato sopra.
      </p>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
      ) : profiles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)', fontSize: 13 }}>
          Nessun profilo nel catalogo. Carica un Excel con il foglio Proprietà_beam.
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Profilo</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Area (mm²)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>IY (mm⁴)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>IZ (mm⁴)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>HY (mm³)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>BZ (mm³)</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{p.nome}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.area_mm2?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.iy_mm4?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.iz_mm4?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.hy_mm3?.toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{p.bz_mm3?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowRaw(!showRaw)}
          style={{
            background: 'none', border: '1px solid #d1d5db', borderRadius: 4, padding: '6px 14px',
            cursor: 'pointer', fontSize: 12, color: '#374151',
          }}>
          {showRaw ? 'Nascondi' : 'Mostra'} celle raw da Proprietà_beam ({cells.length} celle)
        </button>
      </div>

      {showRaw && cells.length > 0 && (
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
                    const isInput = c.cell_type === 'input' || c.cell_type === 'constant';
                    const rowLabel = c.label || (labelCells.length > 0 ? labelCells.map(l => l.default_value || l.formula).join(' ').trim() : '');
                    const showRowNum = ci === 0;

                    return (
                    <tr key={c.id || c.campo}
                      style={{ background: isInput ? '#E3F0FF' : '#fff', borderBottom: '1px solid #eef2f6' }}>
                      <td style={{ color: '#9ca3af', fontSize: 10, fontFamily: 'monospace', textAlign: 'center' }}>
                        {showRowNum && <span>{rowNum}</span>}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 10, color: isInput ? '#0070C0' : '#1e1e2e' }}>
                        {c.campo}
                      </td>
                      <td>
                        {isInput ? (
                          <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, background: '#0070C0', color: '#fff' }}>IN</span>
                        ) : (
                          <span style={{ display: 'inline-block', padding: '1px 3px', borderRadius: 2, fontSize: 8, fontWeight: 700, border: '1.5px solid #1e1e2e' }}>FX</span>
                        )}
                      </td>
                      <td style={{ color: '#374151', fontSize: 12, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={rowLabel}>
                        {rowLabel || c.campo}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: isInput ? '#0070C0' : '#6b7280', padding: '4px 0' }}>
                          {c.default_value || c.formula}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: 10, fontFamily: 'monospace', color: isInput ? '#6b7280' : '#1e1e2e', wordBreak: 'break-all' }}>
                          {c.formula}
                        </code>
                      </td>
                    </tr>
                  );});
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

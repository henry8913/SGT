import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moduleDocs } from '../../api/client';

const PROVVISORIO_LABEL = 'Provvisorio — coefficienti di default, non ancora validati dall\'ingegnere';

export default function MotoreCalcolo() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [saved, setSaved] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await moduleDocs.get();
      setModules(res.data?.modules || []);
      const noteMap = {};
      for (const m of res.data?.modules || []) {
        for (const c of m.campi) {
          noteMap[`${m.key}|${c.campo}`] = c.nota || '';
        }
      }
      setNotes(noteMap);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveNote = async (modulo, campo) => {
    try {
      await moduleDocs.saveNote({ modulo, campo, nota: notes[`${modulo}|${campo}`] || '' });
      setSaved('✓ Nota salvata');
      setTimeout(() => setSaved(''), 2000);
    } catch (err) {
      setSaved('✗ Errore nel salvataggio della nota');
    }
  };

  const confermaModulo = async (modulo) => {
    if (!window.confirm(`Confermare il modulo "${modulo}" come validato dall'ingegnere?`)) return;
    try {
      await moduleDocs.conferma(modulo);
      setSaved('✓ Modulo confermato: i risultati non saranno più provvisori');
      setTimeout(() => setSaved(''), 2500);
      await load();
    } catch (err) {
      setSaved('✗ Errore nella conferma');
    }
  };

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Motore di calcolo</h1>
        <p>Documentazione degli 8 moduli calcolati — formule, coefficienti e note. Solo informativo, nessuna modifica al calcolo da qui.</p>
      </div>

      <div className="msg msg-info" style={{ marginBottom: 20 }}>
        <strong>ℹ️ Come funziona.</strong> La struttura logica di ogni formula è scritta nel codice Python
        (file indicato per ogni modulo) e versionata con git. Qui trovi la formula in notazione leggibile,
        i coefficienti collegati (modificabili da <Link to="/admin/coefficienti">Coefficienti</Link>) e una nota
        libera per segnalare correzioni allo sviluppatore. Le correzioni vere si fanno sempre nel codice.
      </div>

      {saved && <div className="msg" style={{ marginBottom: 16, background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '10px 14px', borderRadius: 6, fontSize: 13 }}>{saved}</div>}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
      ) : modules.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Nessun modulo documentato.</div>
      ) : modules.map(m => (
        <div className="card" style={{ marginBottom: 24 }} key={m.key}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontWeight: 700 }}>{m.nome}</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {m.confermato ? (
                <span className="badge" style={{ background: '#16a34a', color: '#fff' }}>✓ Confermato</span>
              ) : (
                <>
                  <span className="badge" title={PROVVISORIO_LABEL} style={{ background: '#D4A017', color: '#fff' }}>⚠ Provvisorio</span>
                  <button onClick={() => confermaModulo(m.key)} className="btn btn-xs btn-dark">Conferma modulo</button>
                </>
              )}
              <code style={{ fontSize: 11, color: 'var(--steel-light)', fontFamily: 'monospace' }}>{m.file}</code>
            </div>
          </div>
          <div className="card-body">
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>{m.descrizione}</p>
            <div className="table-wrap" style={{ overflowX: 'auto' }}>
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ width: 180 }}>Campo</th>
                    <th>Formula (notazione leggibile)</th>
                    <th style={{ minWidth: 200 }}>Coefficienti</th>
                    <th style={{ minWidth: 260 }}>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {m.campi.map(c => (
                    <tr key={c.campo}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>{c.campo}</td>
                      <td>
                        <code style={{ fontSize: 12, fontFamily: 'monospace', color: '#1e1e2e', background: '#f5f5f5', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                          {c.formula}
                        </code>
                      </td>
                      <td>
                        {c.coefficienti.length === 0 ? (
                          <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
                        ) : (
                          <div className="flex gap-2 flex-wrap" style={{ alignItems: 'center' }}>
                            {c.coefficienti.map(coef => (
                              <Link key={coef.id} to="/admin/coefficienti"
                                title={`Modifica il coefficiente ${coef.nome}`}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  padding: '3px 8px', borderRadius: 999, fontSize: 11,
                                  background: coef.ha_bozza ? '#FFF8E1' : '#eef2f7',
                                  border: `1px solid ${coef.ha_bozza ? '#D4A017' : '#d1d5db'}`,
                                  color: '#1e1e2e', textDecoration: 'none', fontWeight: 600, fontFamily: 'monospace',
                                }}>
                                {coef.nome} = {coef.valore_pubblicato}
                                {coef.ha_bozza && <span style={{ color: '#D4A017', fontSize: 10 }}>●</span>}
                              </Link>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                          <textarea
                            value={notes[`${m.key}|${c.campo}`] || ''}
                            onChange={e => setNotes({ ...notes, [`${m.key}|${c.campo}`]: e.target.value })}
                            placeholder="Nota per lo sviluppatore (es. formula da rivedere: manca il fattore di forma)..."
                            rows={2}
                            style={{ flex: 1, minWidth: 180, background: '#fff', fontSize: 12, resize: 'vertical', lineHeight: 1.4 }}
                          />
                          <button onClick={() => saveNote(m.key, c.campo)} className="btn btn-xs btn-dark" style={{ whiteSpace: 'nowrap' }}>Salva</button>
                        </div>
                        {c.nota_modificato_da && (
                          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                            ultima modifica: {c.nota_modificato_da}
                            {c.nota_modificato_il ? ` · ${new Date(c.nota_modificato_il).toLocaleString('it-IT')}` : ''}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

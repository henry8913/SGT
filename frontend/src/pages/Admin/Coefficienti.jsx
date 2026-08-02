import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { coefficients as coeffApi } from '../../api/client';

const MODULES = ['baricentri', 'aree_vento', 'vento', 'stabilita_q', 'stabilita_d', 'curve_carico', 'carichi_ralla', 'diagramma'];

export default function Coefficienti() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({});
  const [msg, setMsg] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newCoeff, setNewCoeff] = useState({ modulo: '', nome: '', descrizione: '', valore: '' });

  const [moduloFilter, setModuloFilter] = useState(searchParams.get('modulo') || '');
  const [statoFilter, setStatoFilter] = useState(searchParams.get('stato') || 'tutti');
  const [q, setQ] = useState(searchParams.get('q') || '');

  const load = async () => {
    setLoading(true);
    try {
      const res = await coeffApi.list();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const p = {};
    if (moduloFilter) p.modulo = moduloFilter;
    if (statoFilter && statoFilter !== 'tutti') p.stato = statoFilter;
    if (q) p.q = q;
    setSearchParams(p, { replace: true });
  }, [moduloFilter, statoFilter, q]);

  const resetFilters = () => {
    setModuloFilter('');
    setStatoFilter('tutti');
    setQ('');
    setSearchParams({}, { replace: true });
  };

  const isDraft = (c) => c.valore_bozza !== null && c.valore_bozza !== undefined;

  const filteredItems = items.filter(c => {
    if (moduloFilter && c.modulo !== moduloFilter) return false;
    if (statoFilter === 'bozza' && !isDraft(c)) return false;
    if (statoFilter === 'pubblicati' && isDraft(c)) return false;
    if (q) {
      const needle = q.toLowerCase();
      const hay = `${c.nome} ${c.descrizione || ''} ${c.modulo}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const filteredModuli = [...new Set(filteredItems.map(c => c.modulo))];

  const saveDraft = async (id) => {
    const raw = drafts[id];
    if (raw === undefined || raw === '') return;
    const v = Number(raw);
    if (!Number.isFinite(v)) { setMsg('⚠ Inserisci un numero valido'); return; }
    try {
      await coeffApi.updateDraft(id, { valore_bozza: v });
      setMsg('✓ Bozza salvata. Ricorda di pubblicarla.');
      await load();
    } catch (err) {
      setMsg('✗ Errore nel salvataggio della bozza');
    }
  };

  const publish = async (id) => {
    try {
      await coeffApi.publish(id);
      setMsg('✓ Coefficiente pubblicato e attivo nel motore di calcolo.');
      await load();
    } catch (err) {
      setMsg('✗ Errore durante la pubblicazione');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Eliminare questo coefficiente?')) return;
    try {
      await coeffApi.remove(id);
      setMsg('✓ Coefficiente eliminato');
      await load();
    } catch (err) {
      setMsg('✗ Errore durante l\'eliminazione');
    }
  };

  const create = async () => {
    const v = Number(newCoeff.valore);
    if (!newCoeff.modulo || !newCoeff.nome || !Number.isFinite(v)) {
      setMsg('⚠ Compila modulo, nome e un valore numerico valido');
      return;
    }
    try {
      await coeffApi.create({ modulo: newCoeff.modulo, nome: newCoeff.nome, descrizione: newCoeff.descrizione, valore: v });
      setMsg('✓ Coefficiente creato');
      setNewCoeff({ modulo: '', nome: '', descrizione: '', valore: '' });
      setShowNew(false);
      await load();
    } catch (err) {
      setMsg('✗ ' + (err.response?.data?.detail || 'Errore nella creazione'));
    }
  };

  const selectStyle = { width: 'auto', minWidth: 150, background: '#fff', padding: '6px 10px' };

  return (
    <div>
      <div className="page-header page-header-accent">
        <h1>Coefficienti di calcolo</h1>
        <p>Solo numeri: le formule restano nel codice. La bozza non è attiva finché non pubblichi.</p>
      </div>

      {msg && (
        <div className="msg" style={{ marginBottom: 16, background: msg.startsWith('✓') ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${msg.startsWith('✓') ? '#BBF7D0' : '#FECACA'}`, color: msg.startsWith('✓') ? '#15803D' : '#B91C1C', padding: '10px 14px', borderRadius: 6, fontSize: 13 }}>
          {msg}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <div className="flex gap-3 flex-wrap" style={{ alignItems: 'center' }}>
          <select value={moduloFilter} onChange={e => setModuloFilter(e.target.value)} style={selectStyle}>
            <option value="">Tutti i moduli</option>
            {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={statoFilter} onChange={e => setStatoFilter(e.target.value)} style={selectStyle}>
            <option value="tutti">Tutti gli stati</option>
            <option value="bozza">Con bozza da pubblicare</option>
            <option value="pubblicati">Pubblicati</option>
          </select>
          <input type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder="Cerca nome o descrizione..." style={{ flex: 1, minWidth: 200, background: '#fff' }} />
          <span style={{ fontSize: 12, color: 'var(--gray)', whiteSpace: 'nowrap' }}>
            {filteredItems.length} risultati
          </span>
          {(moduloFilter || statoFilter !== 'tutti' || q) && (
            <button onClick={resetFilters} className="btn btn-ghost btn-sm">Azzera filtri</button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <button onClick={() => setShowNew(!showNew)} className="btn btn-dark btn-sm">
          {showNew ? 'Chiudi' : '+ Nuovo coefficiente'}
        </button>
        <button onClick={load} className="btn btn-ghost btn-sm">Aggiorna</button>
      </div>

      {showNew && (
        <div className="card" style={{ marginBottom: 24, padding: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Nuovo coefficiente</h3>
          <div className="flex gap-3 flex-wrap" style={{ alignItems: 'center' }}>
            <input placeholder="Modulo (es. vento)" value={newCoeff.modulo} onChange={e => setNewCoeff({ ...newCoeff, modulo: e.target.value })}
              style={{ width: 140, background: '#fff' }} />
            <input placeholder="Nome (es. coeff_x)" value={newCoeff.nome} onChange={e => setNewCoeff({ ...newCoeff, nome: e.target.value })}
              style={{ width: 180, background: '#fff' }} />
            <input type="number" step="any" placeholder="Valore" value={newCoeff.valore} onChange={e => setNewCoeff({ ...newCoeff, valore: e.target.value })}
              style={{ width: 110, background: '#fff' }} />
            <input placeholder="Descrizione" value={newCoeff.descrizione} onChange={e => setNewCoeff({ ...newCoeff, descrizione: e.target.value })}
              style={{ flex: 1, minWidth: 180, background: '#fff' }} />
            <button onClick={create} className="btn btn-yellow btn-sm">Crea</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
      ) : filteredModuli.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Nessun coefficiente corrisponde ai filtri.</div>
      ) : filteredModuli.map(modulo => (
        <div className="card" style={{ marginBottom: 24 }} key={modulo}>
          <div className="card-header" style={{ fontWeight: 700 }}>{modulo}</div>
          <div className="card-body">
            <div className="table-wrap" style={{ overflowX: 'auto' }}>
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrizione</th>
                    <th>Pubblicato (attivo)</th>
                    <th>Bozza</th>
                    <th>Stato</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.filter(c => c.modulo === modulo).map(c => {
                    const draft = isDraft(c);
                    const localDraft = drafts[c.id];
                    return (
                      <tr key={c.id} style={{ background: draft ? '#FFFDF0' : '#fff' }}>
                        <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>{c.nome}</td>
                        <td style={{ fontSize: 12, color: '#6b7280', maxWidth: 260 }}>{c.descrizione || '—'}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.valore_pubblicato}</td>
                        <td>
                          <input type="number" step="any"
                            value={localDraft !== undefined ? localDraft : (c.valore_bozza ?? '')}
                            onChange={e => setDrafts({ ...drafts, [c.id]: e.target.value })}
                            placeholder={c.valore_pubblicato}
                            style={{ width: 110, padding: '4px 8px', background: '#fff', border: draft ? '1.5px solid #D4A017' : '1px solid #ddd', borderRadius: 4, fontFamily: 'monospace' }}
                          />
                        </td>
                        <td>
                          {draft ? (
                            <span className="badge" style={{ background: '#D4A017', color: '#fff' }}>● Bozza da pubblicare</span>
                          ) : (
                            <span className="badge" style={{ background: '#e5e7eb', color: '#6b7280' }}>Pubblicato</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2" style={{ alignItems: 'center' }}>
                            <button onClick={() => saveDraft(c.id)} className="btn btn-xs btn-ghost">Salva bozza</button>
                            <button onClick={() => publish(c.id)} className="btn btn-xs btn-dark" disabled={!draft}>Pubblica</button>
                            <button onClick={() => remove(c.id)} className="btn btn-xs btn-ghost" title="Elimina">✕</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

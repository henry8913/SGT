import { useState, useEffect } from 'react';
import api from '../../api/client';

export default function SettingsProfili() {
  const [profiles, setProfiles] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, convRes] = await Promise.all([
        api.get('/profiles'),
        api.get('/profiles/conversions'),
      ]);
      setProfiles(profRes.data || []);
      setConversions(convRes.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Impostazioni</h2>

      {conversions.length > 0 && (
        <div className="card" style={{ marginBottom: 24, background: '#F7F9FC', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: 10, fontSize: 15 }}>Conversione mm2 - m2 e mm4 - m4</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: 8, border: '1px solid #dde3ea', textAlign: 'left' }}>Grandezza</th>
                <th style={{ padding: 8, border: '1px solid #dde3ea' }}>Unità mm</th>
                <th style={{ padding: 8, border: '1px solid #dde3ea' }}>Unità m</th>
                <th style={{ padding: 8, border: '1px solid #dde3ea' }}>Fattore</th>
                <th style={{ padding: 8, border: '1px solid #dde3ea' }}>Esempio (mm)</th>
                <th style={{ padding: 8, border: '1px solid #dde3ea' }}>Esempio (m)</th>
              </tr>
            </thead>
            <tbody>
              {conversions.map(c => (
                <tr key={c.id}>
                  <td style={{ padding: 8, border: '1px solid #dde3ea', fontWeight: 600 }}>{c.grandezza}</td>
                  <td style={{ padding: 8, border: '1px solid #dde3ea', textAlign: 'center' }}>{c.unita_mm}</td>
                  <td style={{ padding: 8, border: '1px solid #dde3ea', textAlign: 'center' }}>{c.unita_m}</td>
                  <td style={{ padding: 8, border: '1px solid #dde3ea', textAlign: 'right', fontFamily: 'monospace' }}>×{c.fattore.toLocaleString('it-IT')}</td>
                  <td style={{ padding: 8, border: '1px solid #dde3ea', textAlign: 'right', fontFamily: 'monospace' }}>{c.riferimento_mm?.toLocaleString('it-IT')}</td>
                  <td style={{ padding: 8, border: '1px solid #dde3ea', textAlign: 'right', fontFamily: 'monospace' }}>{c.riferimento_m?.toLocaleString('it-IT', { maximumFractionDigits: 10 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 10, color: '#64748b', fontSize: 12 }}>
            I valori sono espressi in mm², mm⁴ e mm; i fattori di conversione
            in m², m⁴ e metri sono ×10⁻⁶, ×10⁻¹² e ×10⁻³.
          </p>
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>Libreria Profili</h3>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        Profili strutturali (libreria globale, condivisa da tutti i progetti).
      </p>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>Caricamento...</div>
      ) : profiles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--gray)', fontSize: 13 }}>
          Nessun profilo nella libreria.
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="table-wrap" style={{ maxHeight: 600, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 8, border: '1px solid #ddd', textAlign: 'left' }}>Profilo</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Rif.</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Area (mm²)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>IY (mm⁴)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>IZ (mm⁴)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>HY (mm)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>BZ (mm)</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>kg/m</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: 8, border: '1px solid #ddd', fontWeight: 600 }}>{p.nome}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center', color: '#9ca3af', fontFamily: 'monospace' }}>{p.riferimento ?? '–'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'right', fontFamily: 'monospace' }}>{p.area_mm2 != null ? p.area_mm2.toLocaleString('it-IT') : '–'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'right', fontFamily: 'monospace' }}>{p.iy_mm4 != null ? p.iy_mm4.toLocaleString('it-IT') : '–'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'right', fontFamily: 'monospace' }}>{p.iz_mm4 != null ? p.iz_mm4.toLocaleString('it-IT') : '–'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'right', fontFamily: 'monospace' }}>{p.hy_mm ?? '–'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'right', fontFamily: 'monospace' }}>{p.bz_mm ?? '–'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'right', fontFamily: 'monospace' }}>{p.peso_kg_m != null ? p.peso_kg_m : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 10, color: '#64748b', fontSize: 12 }}>
            {profiles.length} profili nella libreria globale.
          </p>
        </div>
      )}
    </div>
  );
}

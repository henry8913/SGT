import { useState, useEffect } from 'react';
import api from '../../api/client';
import ExcelUpload from './ExcelUpload';

export default function SettingsProfili() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const res = await api.get('/profiles');
      setProfiles(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Impostazioni</h2>

      {user.is_admin && (
        <div style={{ marginBottom: 24 }}>
          <ExcelUpload />
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>Libreria Profili</h3>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Catalogo profili strutturali (ex Proprietà_beam). Catalogo globale condiviso tra tutti i progetti.
      </p>
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        {loading ? (
          <p style={{ color: '#999' }}>Caricamento...</p>
        ) : profiles.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>Nessun profilo nel catalogo.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}

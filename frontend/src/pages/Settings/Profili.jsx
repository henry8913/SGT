export default function SettingsProfili() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Libreria Profili</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Catalogo profili strutturali (ex Proprietà_beam). Qui puoi gestire i profili disponibili.
      </p>
      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
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
            <tr>
              <td style={{ padding: 8, border: '1px solid #ddd', fontStyle: 'italic', color: '#999' }} colSpan={6}>
                Nessun profilo inserito. Funzionalità in sviluppo.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

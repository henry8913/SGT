import { useState } from 'react';
import api from '../../api/client';

export default function ExcelUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/formulas/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(`Errore (${status || 'rete'}): ${detail || 'Errore durante il caricamento'}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <h3 style={{ marginBottom: 12 }}>Carica file Excel (.xlsm)</h3>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
        Carica il file <strong>Stabilità.xlsm</strong> aggiornato. Le formule verranno importate
        automaticamente nel database, sovrascrivendo quelle esistenti.
      </p>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: 12, borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: 12, borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
          ✅ {result.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="file"
          accept=".xlsm,.xlsx"
          onChange={e => setFile(e.target.files[0])}
          style={{ fontSize: 13, flex: 1 }}
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: '10px 20px',
            background: !file || loading ? '#ccc' : '#1a237e',
            color: '#fff', border: 'none', borderRadius: 4,
            cursor: !file || loading ? 'not-allowed' : 'pointer',
            fontSize: 13, whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Caricamento...' : 'Carica e importa'}
        </button>
      </div>
    </div>
  );
}

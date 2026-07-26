import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { calculate } from '../../api/client';

export default function Calcola() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runCalculation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await calculate.run(projectId);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore durante il calcolo');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>Calcolo in corso</h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Esegue tutti gli step di calcolo: baricentri, aree vento, vento, stabilità Q/D, carichi ralla, diagramma carico.
      </p>

      {!result && !loading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <button onClick={runCalculation} style={{
            padding: '14px 32px', background: '#1a237e', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer',
          }}>
            Avvia calcolo
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 48, color: '#1a237e' }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Calcolo in corso...</div>
          <div style={{ fontSize: 13, color: '#999' }}>Elaborazione step di stabilità</div>
        </div>
      )}

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: 16, borderRadius: 6, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: 16, borderRadius: 6, marginBottom: 24 }}>
            Calcolo completato! {result.steps_completed?.length || 0} step eseguiti.
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate(`/progetto/${projectId}/stabilita`)}
              style={{ padding: '10px 20px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Dashboard Stabilità
            </button>
            <button onClick={() => navigate(`/progetto/${projectId}/carichi`)}
              style={{ padding: '10px 20px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Carichi Ralla
            </button>
            <button onClick={() => navigate(`/progetto/${projectId}/diagramma`)}
              style={{ padding: '10px 20px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Diagramma Carico
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

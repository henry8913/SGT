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
      <div className="page-header page-header-accent">
        <h1>Calcolo</h1>
        <p>Esegue tutti gli step: baricentri, aree vento, vento, stabilità Q/D, carichi ralla, diagramma</p>
      </div>

      {!result && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <button onClick={runCalculation} className="btn btn-accent" style={{ fontSize: 16, padding: '14px 36px' }}>
            ▶ Avvia calcolo
          </button>
          <p style={{ marginTop: 12, color: 'var(--gray)', fontSize: 13 }}>
            Il calcolo può richiedere alcuni secondi
          </p>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 14, color: '#212529', marginBottom: 8 }}>Calcolo in corso...</div>
          <div style={{ fontSize: 12, color: 'var(--gray)' }}>Elaborazione step di stabilità</div>
        </div>
      )}

      {error && <div className="msg msg-error">{error}</div>}

      {result && (
        <div>
          <div className="msg msg-success">
            Calcolo completato! {result.steps_completed?.length || 0} step eseguiti.
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate(`/progetto/${projectId}/stabilita`)} className="btn btn-accent">
              Dashboard Stabilità
            </button>
            <button onClick={() => navigate(`/progetto/${projectId}/carichi`)} className="btn btn-ghost">
              Carichi Ralla
            </button>
            <button onClick={() => navigate(`/progetto/${projectId}/diagramma`)} className="btn btn-ghost">
              Diagramma Carico
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

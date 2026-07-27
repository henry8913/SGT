import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await auth.login(form);
      localStorage.setItem('token', res.data.access_token);
      const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify({ username: form.username, is_admin: payload.admin === true }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenziali non valide');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gray-bg)', padding: 20,
    }}>
      <div style={{
        background: '#fff', padding: 48, borderRadius: 16,
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        width: '100%', maxWidth: 400,
        borderTop: '4px solid #D4A017',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/favicon.svg" alt="SGT" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <h1 style={{ fontSize: 26, color: '#1e1e2e', marginBottom: 2, letterSpacing: '-0.5px' }}>SGT</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Stabilità delle Gru a Torre</p>
          <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 4 }}>KG 26.5</p>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#1e1e2e' }}>Username</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Il tuo username" required />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#1e1e2e' }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-dark" style={{ width: '100%', padding: '12px 20px', fontSize: 15, justifyContent: 'center' }}>
            Accedi
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#d1d5db' }}>
          Stabilità delle Gru a Torre — KG 26.5
        </p>
      </div>
    </div>
  );
}

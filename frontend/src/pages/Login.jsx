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
      localStorage.setItem('user', JSON.stringify({ username: form.username, is_admin: payload.admin }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Errore di login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    }}>
      <div style={{
        background: '#fff', padding: 40, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        width: 360,
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 8, color: '#1a237e' }}>SGT</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 24, fontSize: 14 }}>
          Stabilità delle Gru a Torre
        </p>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: 8, borderRadius: 4, marginBottom: 16, fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#333' }}>Username</label>
            <input
              type="text" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#333' }}>Password</label>
            <input
              type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
              required
            />
          </div>
          <button type="submit" style={{
            width: '100%', padding: 10, background: '#1a237e', color: '#fff',
            border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer',
          }}>
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}

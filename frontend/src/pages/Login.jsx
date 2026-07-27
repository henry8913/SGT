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
      const isAdmin = payload.admin === true;
      localStorage.setItem('user', JSON.stringify({ username: form.username, is_admin: isAdmin }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenziali non valide');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, #0d47a1 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        padding: 48,
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: 400,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'var(--primary)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, color: '#fff', fontSize: 24, fontWeight: 700,
          }}>
            S
          </div>
          <h1 style={{ fontSize: 24, color: 'var(--primary)', marginBottom: 4 }}>SGT</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Stabilità delle Gru a Torre
          </p>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Il tuo username"
              required
              style={{ background: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              style={{ background: '#fff' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{
            width: '100%', padding: '12px 20px', fontSize: 15,
            justifyContent: 'center', borderRadius: 6,
          }}>
            Accedi
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--steel-light)' }}>
          KG 26.5 — Software di calcolo stabilità
        </p>
      </div>
    </div>
  );
}

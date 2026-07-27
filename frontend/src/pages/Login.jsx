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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #212529 0%, #343A40 50%, #212529 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        padding: 48,
        borderRadius: 12,
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        width: '100%',
        maxWidth: 400,
        borderTop: '4px solid #FFB300',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/favicon.svg" alt="SGT" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <h1 style={{ fontSize: 24, color: '#212529', marginBottom: 4, letterSpacing: '-0.5px' }}>SGT</h1>
          <p style={{ color: '#6C757D', fontSize: 14 }}>Stabilità delle Gru a Torre</p>
          <p style={{ color: '#adb5bd', fontSize: 11, marginTop: 4 }}>KG 26.5</p>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#212529' }}>
              Username
            </label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Il tuo username" required />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#212529' }}>
              Password
            </label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-accent" style={{
            width: '100%', padding: '12px 20px', fontSize: 15,
            justifyContent: 'center', borderRadius: 6, fontWeight: 700,
          }}>
            Accedi
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#adb5bd' }}>
          Stabilità delle Gru a Torre — KG 26.5
        </p>
      </div>
    </div>
  );
}

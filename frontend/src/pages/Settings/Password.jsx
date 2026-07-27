import { useState } from 'react';
import api from '../../api/client';

export default function Password() {
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChange = async () => {
    setMsg({ type: '', text: '' });
    if (form.new_password !== form.confirm) {
      setMsg({ type: 'error', text: 'Le password non coincidono' });
      return;
    }
    if (form.new_password.length < 6) {
      setMsg({ type: 'error', text: 'La password deve essere almeno 6 caratteri' });
      return;
    }
    try {
      await api.put('/auth/password', {
        old_password: form.old_password,
        new_password: form.new_password,
      });
      setForm({ old_password: '', new_password: '', confirm: '' });
      setMsg({ type: 'success', text: 'Password cambiata con successo!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Errore' });
    }
  };

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <h3 style={{ marginBottom: 16 }}>Cambia Password</h3>

      {msg.text && (
        <div style={{
          padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 13,
          background: msg.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: msg.type === 'success' ? '#2e7d32' : '#c62828',
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 350 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }}>Password attuale</label>
          <input type="password" value={form.old_password}
            onChange={e => setForm({...form, old_password: e.target.value})}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }}>Nuova password</label>
          <input type="password" value={form.new_password}
            onChange={e => setForm({...form, new_password: e.target.value})}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }}>Conferma nuova password</label>
          <input type="password" value={form.confirm}
            onChange={e => setForm({...form, confirm: e.target.value})}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <button onClick={handleChange} style={{
          padding: '10px 20px', background: '#1e1e2e', color: '#fff',
          border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14,
        }}>
          Cambia password
        </button>
      </div>
    </div>
  );
}

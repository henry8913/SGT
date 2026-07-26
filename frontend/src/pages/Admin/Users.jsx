import { useState } from 'react';
import { auth } from '../../api/client';

export default function AdminUsers() {
  const [form, setForm] = useState({ email: '', username: '', password: '', is_admin: false });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const createUser = async () => {
    setMsg({ type: '', text: '' });
    try {
      await auth.register(form);
      setForm({ email: '', username: '', password: '', is_admin: false });
      setMsg({ type: 'success', text: 'Utente creato con successo!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Errore durante la creazione' });
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Gestione Utenti</h2>

      {msg.text && (
        <div style={{
          padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 13,
          background: msg.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: msg.type === 'success' ? '#2e7d32' : '#c62828',
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: 16 }}>Crea nuovo utente</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }}>Email</label>
            <input placeholder="email@esempio.it" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }}>Username</label>
            <input placeholder="username" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }}>Password</label>
            <input type="password" placeholder="••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={form.is_admin}
              onChange={e => setForm({...form, is_admin: e.target.checked})} />
            Amministratore
          </label>
          <button onClick={createUser} style={{
            padding: '10px 20px', background: '#1a237e', color: '#fff',
            border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14,
          }}>
            Crea utente
          </button>
        </div>
      </div>
    </div>
  );
}

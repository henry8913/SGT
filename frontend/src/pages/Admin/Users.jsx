import { useState, useEffect } from 'react';
import { projects, auth } from '../../api/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', username: '', password: '', is_admin: false });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    projects.list().then(() => {}).catch(() => {});
  };

  const createUser = async () => {
    try {
      await auth.register(form);
      setForm({ email: '', username: '', password: '', is_admin: false });
      alert('Utente creato!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Errore');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Gestione Utenti</h2>

      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Crea nuovo utente</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 200 }} />
          <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 150 }} />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 150 }} />
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={form.is_admin} onChange={e => setForm({...form, is_admin: e.target.checked})} />
            {' '}Admin
          </label>
          <button onClick={createUser} style={{ padding: '8px 16px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Crea
          </button>
        </div>
      </div>

      <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>
        La lista utenti sarà disponibile nella prossima versione.
      </p>
    </div>
  );
}

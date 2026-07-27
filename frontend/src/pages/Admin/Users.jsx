import { useState, useEffect } from 'react';
import api, { auth } from '../../api/client';

export default function AdminUsers() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const createUser = async () => {
    setMsg({ type: '', text: '' });
    try {
      await auth.register({ ...form, is_admin: false });
      setForm({ email: '', username: '', password: '' });
      setMsg({ type: 'success', text: 'Utente creato con successo!' });
      loadUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Errore' });
    }
  };

  const deleteUser = async (userId, username) => {
    if (!confirm(`Eliminare l'utente "${username}"?`)) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Errore');
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

      <div style={{ background: '#fff', padding: 24, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
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
          <div style={{ fontSize: 12, color: '#666', background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
            L'utente potrà cambiarsi la password dopo il primo accesso.
            Non potrà creare altri utenti — questa è una funzione solo tua.
          </div>
          <button onClick={createUser} style={{
            padding: '10px 20px', background: '#1a237e', color: '#fff',
            border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14,
          }}>
            Crea utente
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ padding: 16, margin: 0, borderBottom: '1px solid #eee' }}>Utenti registrati</h3>
        {users.length === 0 ? (
          <p style={{ padding: 24, color: '#999', textAlign: 'center' }}>Nessun utente.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Username</th>
                <th style={{ padding: 10, border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Creato il</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: 10, border: '1px solid #ddd', fontWeight: 600 }}>{u.username}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{u.email}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd', fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString('it-IT')}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd', textAlign: 'center' }}>
                    <button onClick={() => deleteUser(u.id, u.username)}
                      style={{ padding: '4px 10px', background: '#ffebee', border: 'none', borderRadius: 3, cursor: 'pointer', color: '#c62828', fontSize: 12 }}>
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

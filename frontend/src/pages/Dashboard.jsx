import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    const res = await projects.list();
    setList(res.data);
  };

  const createProject = async () => {
    if (!newName.trim()) return;
    const res = await projects.create({ name: newName });
    setNewName('');
    navigate(`/nuovo-progetto/step-1?projectId=${res.data.id}`);
  };

  const deleteProject = async (id) => {
    if (!confirm('Eliminare questo progetto?')) return;
    await projects.delete(id);
    loadProjects();
  };

  const duplicateProject = async (id) => {
    await projects.duplicate(id);
    loadProjects();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>I tuoi progetti</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text" value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome nuovo progetto..."
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, width: 250 }}
            onKeyDown={(e) => e.key === 'Enter' && createProject()}
          />
          <button onClick={createProject} style={{
            padding: '8px 16px', background: '#1a237e', color: '#fff',
            border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>
            + Nuovo
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
          Nessun progetto. Creane uno nuovo per iniziare.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {list.map((p) => (
            <div key={p.id} style={{
              background: '#fff', padding: '16px 20px', borderRadius: 6,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  Creato: {new Date(p.created_at).toLocaleDateString('it-IT')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/nuovo-progetto/step-1?projectId=${p.id}`)}
                  style={{ padding: '6px 12px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
                  Wizard
                </button>
                <button onClick={() => navigate(`/progetto/${p.id}/stabilita`)}
                  style={{ padding: '6px 12px', background: '#e8eaf6', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
                  Risultati
                </button>
                <button onClick={() => duplicateProject(p.id)}
                  style={{ padding: '6px 12px', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, color: '#2e7d32' }}>
                  Duplica
                </button>
                <button onClick={() => deleteProject(p.id)}
                  style={{ padding: '6px 12px', background: '#ffebee', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, color: '#c62828' }}>
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await projects.list();
      setList(res.data);
    } catch (err) { console.error(err); }
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
      <div className="page-header flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1>I tuoi progetti</h1>
          <p>Gestisci le verifiche di stabilità</p>
        </div>
        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome nuovo progetto..."
            style={{ width: 240, background: '#fff' }}
            onKeyDown={(e) => e.key === 'Enter' && createProject()}
          />
          <button onClick={createProject} className="btn btn-primary">
            + Nuovo progetto
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🏗️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Nessun progetto ancora.</p>
          <p style={{ color: 'var(--steel-light)', fontSize: 13, marginTop: 4 }}>Creane uno nuovo per iniziare una verifica di stabilità.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {list.map((p) => (
            <div key={p.id} className="card">
              <div className="card-body" style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--steel-light)' }}>
                    Creato il {new Date(p.created_at).toLocaleDateString('it-IT')}
                  </div>
                </div>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  <button onClick={() => navigate(`/nuovo-progetto/step-1?projectId=${p.id}`)}
                    className="btn btn-ghost btn-sm">
                    Wizard
                  </button>
                  <button onClick={() => navigate(`/progetto/${p.id}/stabilita`)}
                    className="btn btn-ghost btn-sm">
                    Risultati
                  </button>
                  <button onClick={() => duplicateProject(p.id)}
                    className="btn btn-ghost btn-sm">
                    Duplica
                  </button>
                  <button onClick={() => deleteProject(p.id)}
                    className="btn btn-sm btn-danger">
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

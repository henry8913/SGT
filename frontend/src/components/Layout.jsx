import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{
        background: '#1a237e', color: '#fff', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56,
      }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textDecoration: 'none' }}>
            SGT
          </Link>
          <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Progetti</Link>
          <Link to="/settings/profili" style={{ color: '#fff', textDecoration: 'none' }}>Impostazioni</Link>
          {user.is_admin && (
            <Link to="/admin/users" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>{user.username}</span>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid #fff', color: '#fff',
            padding: '4px 12px', borderRadius: 4, cursor: 'pointer',
          }}>
            Logout
          </button>
        </div>
      </nav>
      <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}

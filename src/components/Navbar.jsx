import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Ana Sayfa' },
    { path: '/equipment', label: 'Ekipmanlar' },
    { path: '/breakdowns', label: 'Arızalar' },
    { path: '/stock', label: 'Stok' },
    { path: '/predictions', label: 'Risk Analizi' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.topRow}>
        <div style={styles.brand}>
          <div style={styles.logoDot} />
          <span style={styles.title}>BAKIM YÖNETİM</span>
        </div>
        <div style={styles.userInfo}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Çıkış</button>
        </div>
      </div>
      <div style={styles.menuRow}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.menuItemActive : {}),
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#0f1626',
    borderBottom: '1px solid #1e293f',
    fontFamily: "'Inter', sans-serif",
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#38bdf8',
    boxShadow: '0 0 8px #38bdf8',
  },
  title: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    color: '#e2e8f0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userEmail: {
    fontSize: '12px',
    color: '#64748b',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  menuRow: {
    display: 'flex',
    overflowX: 'auto',
    padding: '0 18px 12px',
    gap: '6px',
  },
  menuItem: {
    backgroundColor: 'transparent',
    color: '#8291ab',
    border: 'none',
    padding: '7px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  menuItemActive: {
    backgroundColor: '#1b2440',
    color: '#38bdf8',
    fontWeight: '600',
  },
};

export default Navbar;
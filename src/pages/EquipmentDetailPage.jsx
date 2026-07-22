import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

function EquipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [breakdowns, setBreakdowns] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const [eqRes, maintRes, breakRes] = await Promise.all([
          api.get(`/equipment/${id}`),
          api.get('/maintenance-records'),
          api.get('/breakdown-reports'),
        ]);

        setEquipment(eqRes.data);
        setMaintenanceRecords(maintRes.data.filter(m => m.equipment?.id === Number(id)));
        setBreakdowns(breakRes.data.filter(b => b.equipment?.id === Number(id)));
      } catch (err) {
        console.error('Detay çekilirken hata:', err);
      } finally {
        setYukleniyor(false);
      }
    };
    veriGetir();
  }, [id]);

  const durumRenk = (durum) => {
    switch (durum) {
      case 'AKTIF': return '#4ade80';
      case 'BAKIMDA': return '#fbbf24';
      case 'ARIZALI': return '#f87171';
      case 'DEVRE_DISI': return '#64748b';
      default: return '#8291ab';
    }
  };

  if (yukleniyor) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.content}><p style={styles.loadingText}>Yükleniyor...</p></div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.content}><p style={styles.loadingText}>Ekipman bulunamadı.</p></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <button onClick={() => navigate('/equipment')} style={styles.backBtn}>← Ekipmanlara Dön</button>

        <div style={styles.headerCard}>
          <div style={styles.headerTop}>
            <h2 style={styles.name}>{equipment.ad}</h2>
            <span style={{ ...styles.badge, color: durumRenk(equipment.durum), borderColor: durumRenk(equipment.durum) }}>
              {equipment.durum}
            </span>
          </div>
          <div style={styles.infoGrid}>
            <div>
              <span style={styles.infoLabel}>Tip</span>
              <span style={styles.infoValue}>{equipment.tip || '—'}</span>
            </div>
            <div>
              <span style={styles.infoLabel}>Konum</span>
              <span style={styles.infoValue}>{equipment.konum || '—'}</span>
            </div>
            <div>
              <span style={styles.infoLabel}>Kurulum Tarihi</span>
              <span style={styles.infoValue}>{equipment.kurulumTarihi || '—'}</span>
            </div>
            <div>
              <span style={styles.infoLabel}>Son Bakım</span>
              <span style={styles.infoValue}>{equipment.sonBakimTarihi || '—'}</span>
            </div>
          </div>
        </div>

        <p style={styles.sectionTitle}>Açık / Geçmiş Arızalar ({breakdowns.length})</p>
        {breakdowns.length === 0 ? (
          <p style={styles.emptyText}>Bu ekipmana ait arıza kaydı yok.</p>
        ) : (
          <div style={styles.list}>
            {breakdowns.map((b) => (
              <div key={b.id} style={styles.smallCard}>
                <div style={styles.smallCardTop}>
                  <span style={styles.smallCardTitle}>{b.aciklama}</span>
                  <span style={styles.smallBadge}>{b.durum}</span>
                </div>
                <span style={styles.smallCardMeta}>Öncelik: {b.oncelik}</span>
              </div>
            ))}
          </div>
        )}

        <p style={styles.sectionTitle}>Bakım Geçmişi ({maintenanceRecords.length})</p>
        {maintenanceRecords.length === 0 ? (
          <p style={styles.emptyText}>Bu ekipmana ait bakım kaydı yok.</p>
        ) : (
          <div style={styles.list}>
            {maintenanceRecords.map((m) => (
              <div key={m.id} style={styles.smallCard}>
                <div style={styles.smallCardTop}>
                  <span style={styles.smallCardTitle}>{m.tip}</span>
                  <span style={styles.smallCardMeta}>{m.tarih?.split('T')[0]}</span>
                </div>
                <span style={styles.smallCardMeta}>{m.aciklama}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0b1120',
    fontFamily: "'Inter', sans-serif",
  },
  content: {
    padding: '24px 18px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#38bdf8',
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '16px',
  },
  headerCard: {
    backgroundColor: '#131b2e',
    border: '1px solid #1e293f',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '24px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  name: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
  },
  badge: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    padding: '3px 8px',
    borderRadius: '20px',
    border: '1px solid',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  infoLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '3px',
  },
  infoValue: {
    display: 'block',
    fontSize: '14px',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#8291ab',
    letterSpacing: '0.5px',
    marginBottom: '10px',
    marginTop: '4px',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '13px',
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  smallCard: {
    backgroundColor: '#131b2e',
    border: '1px solid #1e293f',
    borderRadius: '10px',
    padding: '12px 14px',
  },
  smallCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  smallCardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  smallBadge: {
    fontSize: '10px',
    color: '#8291ab',
    backgroundColor: '#1b2440',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  smallCardMeta: {
    fontSize: '12px',
    color: '#8291ab',
  },
};

export default EquipmentDetailPage;
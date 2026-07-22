import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

function EquipmentListPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [formAcik, setFormAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ad: '',
    tip: '',
    konum: '',
    kurulumTarihi: '',
    durum: 'AKTIF',
  });

  const veriGetir = async () => {
    try {
      const res = await api.get('/equipment');
      setEquipmentList(res.data);
    } catch (err) {
      console.error('Ekipmanlar çekilirken hata:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    veriGetir();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setKaydediliyor(true);
    try {
      await api.post('/equipment', form);
      setForm({ ad: '', tip: '', konum: '', kurulumTarihi: '', durum: 'AKTIF' });
      setFormAcik(false);
      veriGetir();
    } catch (err) {
      alert('Ekipman eklenirken hata oluştu');
    } finally {
      setKaydediliyor(false);
    }
  };

  const durumRenk = (durum) => {
    switch (durum) {
      case 'AKTIF': return '#4ade80';
      case 'BAKIMDA': return '#fbbf24';
      case 'ARIZALI': return '#f87171';
      case 'DEVRE_DISI': return '#64748b';
      default: return '#8291ab';
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div>
            <p style={styles.eyebrow}>EKİPMAN YÖNETİMİ</p>
            <h2 style={styles.heading}>Tüm Ekipmanlar</h2>
          </div>
          <button style={styles.addBtn} onClick={() => setFormAcik(!formAcik)}>
            {formAcik ? 'İptal' : '+ Yeni Ekipman'}
          </button>
        </div>

        {formAcik && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              name="ad"
              placeholder="Ekipman adı"
              value={form.ad}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="tip"
              placeholder="Tip (örn. Kompresör)"
              value={form.tip}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              name="konum"
              placeholder="Konum"
              value={form.konum}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              name="kurulumTarihi"
              type="date"
              value={form.kurulumTarihi}
              onChange={handleChange}
              style={styles.input}
            />
            <select name="durum" value={form.durum} onChange={handleChange} style={styles.input}>
              <option value="AKTIF">AKTIF</option>
              <option value="BAKIMDA">BAKIMDA</option>
              <option value="ARIZALI">ARIZALI</option>
              <option value="DEVRE_DISI">DEVRE_DISI</option>
            </select>
            <button type="submit" style={styles.saveBtn} disabled={kaydediliyor}>
              {kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}

        {yukleniyor ? (
          <p style={styles.loadingText}>Yükleniyor...</p>
        ) : equipmentList.length === 0 ? (
          <p style={styles.loadingText}>Henüz kayıtlı ekipman yok.</p>
        ) : (
          <div style={styles.list}>
            {equipmentList.map((eq) => (
              <div
                key={eq.id}
                style={styles.card}
                onClick={() => navigate(`/equipment/${eq.id}`)}
              >
                <div style={styles.cardTop}>
                  <span style={styles.cardName}>{eq.ad}</span>
                  <span style={{ ...styles.badge, color: durumRenk(eq.durum), borderColor: durumRenk(eq.durum) }}>
                    {eq.durum}
                  </span>
                </div>
                <div style={styles.cardMeta}>
                  <span>{eq.tip || '—'}</span>
                  <span style={styles.dot}>•</span>
                  <span>{eq.konum || '—'}</span>
                </div>
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
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  eyebrow: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    color: '#38bdf8',
    margin: '0 0 4px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: 0,
  },
  addBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  form: {
    backgroundColor: '#131b2e',
    border: '1px solid #1e293f',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    backgroundColor: '#0b1120',
    border: '1px solid #253150',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
  },
  saveBtn: {
    backgroundColor: '#38bdf8',
    color: '#0b1120',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    backgroundColor: '#131b2e',
    border: '1px solid #1e293f',
    borderRadius: '12px',
    padding: '14px 16px',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  cardName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  badge: {
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    padding: '3px 8px',
    borderRadius: '20px',
    border: '1px solid',
  },
  cardMeta: {
    fontSize: '12px',
    color: '#8291ab',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    color: '#334155',
  },
};

export default EquipmentListPage;
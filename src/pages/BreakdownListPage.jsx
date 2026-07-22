import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function BreakdownListPage() {
  const [breakdowns, setBreakdowns] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [faultCodes, setFaultCodes] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [formAcik, setFormAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [form, setForm] = useState({
    equipmentId: '',
    faultCodeId: '',
    oncelik: 'ORTA',
    aciklama: '',
  });

  const veriGetir = async () => {
    try {
      const [breakRes, eqRes, faultRes] = await Promise.all([
        api.get('/breakdown-reports'),
        api.get('/equipment'),
        api.get('/fault-codes'),
      ]);
      setBreakdowns(breakRes.data.sort((a, b) => new Date(b.tarih) - new Date(a.tarih)));
      setEquipmentList(eqRes.data);
      setFaultCodes(faultRes.data);
    } catch (err) {
      console.error('Veri çekilirken hata:', err);
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
      await api.post('/breakdown-reports', {
        equipment: { id: Number(form.equipmentId) },
        faultCode: form.faultCodeId ? { id: Number(form.faultCodeId) } : null,
        tarih: new Date().toISOString(),
        aciklama: form.aciklama,
        oncelik: form.oncelik,
        durum: 'BEKLEMEDE',
      });
      setForm({ equipmentId: '', faultCodeId: '', oncelik: 'ORTA', aciklama: '' });
      setFormAcik(false);
      veriGetir();
    } catch (err) {
      alert('Arıza bildirilirken hata oluştu');
    } finally {
      setKaydediliyor(false);
    }
  };

  const oncelikRenk = (oncelik) => {
    switch (oncelik) {
      case 'KRITIK': return '#f87171';
      case 'YUKSEK': return '#fb923c';
      case 'ORTA': return '#fbbf24';
      case 'DUSUK': return '#4ade80';
      default: return '#8291ab';
    }
  };

  const durumRenk = (durum) => {
    return durum === 'COZULDU' ? '#4ade80' : durum === 'INCELENIYOR' ? '#38bdf8' : '#fbbf24';
  };

  const ekipmanAdi = (eq) => equipmentList.find(e => e.id === eq?.id)?.ad || eq?.ad || 'Bilinmiyor';

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div>
            <p style={styles.eyebrow}>ARIZA YÖNETİMİ</p>
            <h2 style={styles.heading}>Arıza Bildirimleri</h2>
          </div>
          <button style={styles.addBtn} onClick={() => setFormAcik(!formAcik)}>
            {formAcik ? 'İptal' : '+ Arıza Bildir'}
          </button>
        </div>

        {formAcik && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <select name="equipmentId" value={form.equipmentId} onChange={handleChange} style={styles.input} required>
              <option value="">Ekipman seç</option>
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.ad}</option>
              ))}
            </select>

            <select name="faultCodeId" value={form.faultCodeId} onChange={handleChange} style={styles.input}>
              <option value="">Arıza kodu seç (opsiyonel)</option>
              {faultCodes.map((fc) => (
                <option key={fc.id} value={fc.id}>{fc.kod} — {fc.aciklama}</option>
              ))}
            </select>

            <select name="oncelik" value={form.oncelik} onChange={handleChange} style={styles.input}>
              <option value="DUSUK">Düşük</option>
              <option value="ORTA">Orta</option>
              <option value="YUKSEK">Yüksek</option>
              <option value="KRITIK">Kritik</option>
            </select>

            <textarea
              name="aciklama"
              placeholder="Arıza açıklaması"
              value={form.aciklama}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
              required
            />

            <button type="submit" style={styles.saveBtn} disabled={kaydediliyor}>
              {kaydediliyor ? 'Gönderiliyor...' : 'Arızayı Bildir'}
            </button>
          </form>
        )}

        {yukleniyor ? (
          <p style={styles.loadingText}>Yükleniyor...</p>
        ) : breakdowns.length === 0 ? (
          <p style={styles.loadingText}>Henüz arıza bildirimi yok.</p>
        ) : (
          <div style={styles.list}>
            {breakdowns.map((b) => (
              <div key={b.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.cardEquip}>{ekipmanAdi(b.equipment)}</span>
                  <span style={{ ...styles.badge, color: durumRenk(b.durum), borderColor: durumRenk(b.durum) }}>
                    {b.durum}
                  </span>
                </div>
                <p style={styles.cardDesc}>{b.aciklama}</p>
                <div style={styles.cardMeta}>
                  <span style={{ ...styles.priorityDot, backgroundColor: oncelikRenk(b.oncelik) }} />
                  <span>{b.oncelik}</span>
                  <span style={styles.dot}>•</span>
                  <span>{b.tarih?.split('T')[0]}</span>
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
  page: { minHeight: '100vh', backgroundColor: '#0b1120', fontFamily: "'Inter', sans-serif" },
  content: { padding: '24px 18px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  eyebrow: { fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: '#38bdf8', margin: '0 0 4px' },
  heading: { fontSize: '20px', fontWeight: '700', color: '#e2e8f0', margin: 0 },
  addBtn: {
    backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px',
    padding: '9px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  form: {
    backgroundColor: '#131b2e', border: '1px solid #1e293f', borderRadius: '12px',
    padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px',
  },
  input: {
    backgroundColor: '#0b1120', border: '1px solid #253150', borderRadius: '8px',
    padding: '10px 12px', color: '#e2e8f0', fontSize: '14px', fontFamily: "'Inter', sans-serif",
  },
  saveBtn: {
    backgroundColor: '#38bdf8', color: '#0b1120', border: 'none', borderRadius: '8px',
    padding: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  loadingText: { color: '#64748b', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: {
    backgroundColor: '#131b2e', border: '1px solid #1e293f', borderRadius: '12px', padding: '14px 16px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  cardEquip: { fontSize: '14px', fontWeight: '600', color: '#f1f5f9' },
  badge: {
    fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px', padding: '3px 8px',
    borderRadius: '20px', border: '1px solid',
  },
  cardDesc: { fontSize: '13px', color: '#cbd5e1', margin: '0 0 8px' },
  cardMeta: { fontSize: '12px', color: '#8291ab', display: 'flex', alignItems: 'center', gap: '6px' },
  priorityDot: { width: '7px', height: '7px', borderRadius: '50%' },
  dot: { color: '#334155' },
};

export default BreakdownListPage;
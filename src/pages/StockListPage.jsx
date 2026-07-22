import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function StockListPage() {
  const [stockList, setStockList] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [formAcik, setFormAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const [form, setForm] = useState({
    parcaAdi: '',
    parcaKodu: '',
    miktar: '',
    kritikSeviye: '',
    birimFiyat: '',
  });

  const veriGetir = async () => {
    try {
      const res = await api.get('/stock-items');
      setStockList(res.data);
    } catch (err) {
      console.error('Stok çekilirken hata:', err);
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
      await api.post('/stock-items', {
        parcaAdi: form.parcaAdi,
        parcaKodu: form.parcaKodu,
        miktar: Number(form.miktar),
        kritikSeviye: Number(form.kritikSeviye),
        birimFiyat: Number(form.birimFiyat),
      });
      setForm({ parcaAdi: '', parcaKodu: '', miktar: '', kritikSeviye: '', birimFiyat: '' });
      setFormAcik(false);
      veriGetir();
    } catch (err) {
      alert('Stok kalemi eklenirken hata oluştu');
    } finally {
      setKaydediliyor(false);
    }
  };

  const kritikMi = (item) => item.miktar <= item.kritikSeviye;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div>
            <p style={styles.eyebrow}>ENVANTER</p>
            <h2 style={styles.heading}>Stok Kalemleri</h2>
          </div>
          <button style={styles.addBtn} onClick={() => setFormAcik(!formAcik)}>
            {formAcik ? 'İptal' : '+ Yeni Parça'}
          </button>
        </div>

        {formAcik && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input name="parcaAdi" placeholder="Parça adı" value={form.parcaAdi} onChange={handleChange} style={styles.input} required />
            <input name="parcaKodu" placeholder="Parça kodu (örn. RUL-6205)" value={form.parcaKodu} onChange={handleChange} style={styles.input} />
            <input name="miktar" type="number" placeholder="Mevcut miktar" value={form.miktar} onChange={handleChange} style={styles.input} required />
            <input name="kritikSeviye" type="number" placeholder="Kritik seviye" value={form.kritikSeviye} onChange={handleChange} style={styles.input} required />
            <input name="birimFiyat" type="number" step="0.01" placeholder="Birim fiyat (₺)" value={form.birimFiyat} onChange={handleChange} style={styles.input} required />
            <button type="submit" style={styles.saveBtn} disabled={kaydediliyor}>
              {kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}

        {yukleniyor ? (
          <p style={styles.loadingText}>Yükleniyor...</p>
        ) : stockList.length === 0 ? (
          <p style={styles.loadingText}>Henüz stok kalemi yok.</p>
        ) : (
          <div style={styles.list}>
            {stockList.map((item) => (
              <div key={item.id} style={{ ...styles.card, ...(kritikMi(item) ? styles.cardCritical : {}) }}>
                <div style={styles.cardTop}>
                  <span style={styles.cardName}>{item.parcaAdi}</span>
                  {kritikMi(item) && <span style={styles.criticalBadge}>KRİTİK</span>}
                </div>
                <div style={styles.cardMeta}>
                  <span>{item.parcaKodu || '—'}</span>
                  <span style={styles.dot}>•</span>
                  <span>{item.birimFiyat} ₺/adet</span>
                </div>
                <div style={styles.stockBar}>
                  <div style={styles.stockBarTrack}>
                    <div
                      style={{
                        ...styles.stockBarFill,
                        width: `${Math.min(100, (item.miktar / (item.kritikSeviye * 3)) * 100)}%`,
                        backgroundColor: kritikMi(item) ? '#f87171' : '#4ade80',
                      }}
                    />
                  </div>
                  <span style={styles.stockCount}>{item.miktar} adet</span>
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
  cardCritical: {
    borderColor: '#7f1d1d',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  cardName: { fontSize: '15px', fontWeight: '600', color: '#f1f5f9' },
  criticalBadge: {
    fontSize: '10px', fontWeight: '700', color: '#f87171', border: '1px solid #7f1d1d',
    borderRadius: '20px', padding: '3px 8px',
  },
  cardMeta: {
    fontSize: '12px', color: '#8291ab', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px',
  },
  dot: { color: '#334155' },
  stockBar: { display: 'flex', alignItems: 'center', gap: '10px' },
  stockBarTrack: {
    flex: 1, height: '6px', backgroundColor: '#1e293f', borderRadius: '4px', overflow: 'hidden',
  },
  stockBarFill: { height: '100%', borderRadius: '4px' },
  stockCount: { fontSize: '12px', fontWeight: '600', color: '#cbd5e1', minWidth: '55px', textAlign: 'right' },
};

export default StockListPage;
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function PredictionPage() {
  const [predictions, setPredictions] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const [predRes, eqRes] = await Promise.all([
          api.get('/predictions'),
          api.get('/equipment'),
        ]);
        const sirali = predRes.data.sort((a, b) => (b.arizaOlasiligi || 0) - (a.arizaOlasiligi || 0));
        setPredictions(sirali);
        setEquipmentList(eqRes.data);
      } catch (err) {
        console.error('Tahminler çekilirken hata:', err);
      } finally {
        setYukleniyor(false);
      }
    };
    veriGetir();
  }, []);

  const ekipmanAdi = (eq) => equipmentList.find(e => e.id === eq?.id)?.ad || 'Bilinmiyor';

  const riskSeviyesi = (olasilik) => {
    if (olasilik >= 0.7) return { label: 'YÜKSEK RİSK', color: '#f87171' };
    if (olasilik >= 0.4) return { label: 'ORTA RİSK', color: '#fbbf24' };
    return { label: 'DÜŞÜK RİSK', color: '#4ade80' };
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <p style={styles.eyebrow}>MAKİNE ÖĞRENMESİ</p>
        <h2 style={styles.heading}>Arıza Riski Tahmini</h2>
        <p style={styles.description}>
          Geçmiş bakım ve sensör verilerine dayanarak ekipmanların arızalanma olasılığı.
        </p>

        {yukleniyor ? (
          <p style={styles.loadingText}>Yükleniyor...</p>
        ) : predictions.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Henüz tahmin verisi yok</p>
            <p style={styles.emptyText}>
              ML modeli çalıştırıldığında, ekipmanların arıza riskleri burada listelenecek.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {predictions.map((p) => {
              const risk = riskSeviyesi(p.arizaOlasiligi || 0);
              return (
                <div key={p.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={styles.cardName}>{ekipmanAdi(p.equipment)}</span>
                    <span style={{ ...styles.badge, color: risk.color, borderColor: risk.color }}>
                      {risk.label}
                    </span>
                  </div>

                  <div style={styles.probRow}>
                    <div style={styles.probBarTrack}>
                      <div
                        style={{
                          ...styles.probBarFill,
                          width: `${(p.arizaOlasiligi || 0) * 100}%`,
                          backgroundColor: risk.color,
                        }}
                      />
                    </div>
                    <span style={styles.probValue}>
                      {((p.arizaOlasiligi || 0) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div style={styles.cardMeta}>
                    {p.tahminiArizaTarihi && <span>Tahmini tarih: {p.tahminiArizaTarihi}</span>}
                    {p.guvenSkoru && (
                      <>
                        <span style={styles.dot}>•</span>
                        <span>Güven skoru: {(p.guvenSkoru * 100).toFixed(0)}%</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0b1120', fontFamily: "'Inter', sans-serif" },
  content: { padding: '24px 18px' },
  eyebrow: { fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: '#38bdf8', margin: '0 0 4px' },
  heading: { fontSize: '20px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 6px' },
  description: { fontSize: '13px', color: '#8291ab', margin: '0 0 20px', lineHeight: 1.5 },
  loadingText: { color: '#64748b', fontSize: '14px' },
  emptyState: {
    backgroundColor: '#131b2e', border: '1px dashed #253150', borderRadius: '12px',
    padding: '32px 20px', textAlign: 'center',
  },
  emptyTitle: { fontSize: '14px', fontWeight: '600', color: '#cbd5e1', margin: '0 0 6px' },
  emptyText: { fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: {
    backgroundColor: '#131b2e', border: '1px solid #1e293f', borderRadius: '12px', padding: '14px 16px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  cardName: { fontSize: '15px', fontWeight: '600', color: '#f1f5f9' },
  badge: {
    fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px', padding: '3px 8px',
    borderRadius: '20px', border: '1px solid',
  },
  probRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  probBarTrack: {
    flex: 1, height: '8px', backgroundColor: '#1e293f', borderRadius: '4px', overflow: 'hidden',
  },
  probBarFill: { height: '100%', borderRadius: '4px' },
  probValue: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '700',
    color: '#e2e8f0', minWidth: '38px', textAlign: 'right',
  },
  cardMeta: { fontSize: '12px', color: '#8291ab', display: 'flex', alignItems: 'center', gap: '6px' },
  dot: { color: '#334155' },
};

export default PredictionPage;
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function DashboardPage() {
  const [ekipmanSayisi, setEkipmanSayisi] = useState(0);
  const [acikArizaSayisi, setAcikArizaSayisi] = useState(0);
  const [kritikStokSayisi, setKritikStokSayisi] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const [ekipmanRes, arizaRes, stokRes] = await Promise.all([
          api.get('/equipment'),
          api.get('/breakdown-reports'),
          api.get('/stock-items'),
        ]);

        setEkipmanSayisi(ekipmanRes.data.length);
        setAcikArizaSayisi(arizaRes.data.filter(a => a.durum !== 'COZULDU').length);
        setKritikStokSayisi(stokRes.data.filter(s => s.miktar <= s.kritikSeviye).length);
      } catch (err) {
        console.error('Veri çekilirken hata:', err);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();
  }, []);

  const cards = [
    {
      label: 'Toplam Ekipman',
      value: ekipmanSayisi,
      accent: '#38bdf8',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
    {
      label: 'Açık Arıza',
      value: acikArizaSayisi,
      accent: '#fbbf24',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: 'Kritik Stok',
      value: kritikStokSayisi,
      accent: '#f87171',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <p style={styles.eyebrow}>GENEL BAKIŞ</p>
        <h2 style={styles.heading}>Sistem Durumu</h2>

        {yukleniyor ? (
          <p style={styles.loadingText}>Yükleniyor...</p>
        ) : (
          <div style={styles.cardStack}>
            {cards.map((card) => (
              <div key={card.label} style={styles.card}>
                <div style={{ ...styles.iconChip, color: card.accent, backgroundColor: `${card.accent}1a` }}>
                  {card.icon}
                </div>
                <div style={styles.cardText}>
                  <span style={styles.cardValue}>{card.value}</span>
                  <span style={styles.cardLabel}>{card.label}</span>
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
    margin: '0 0 20px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  },
  cardStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    backgroundColor: '#131b2e',
    border: '1px solid #1e293f',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  iconChip: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '26px',
    fontWeight: '700',
    color: '#f1f5f9',
    lineHeight: 1.1,
  },
  cardLabel: {
    fontSize: '12px',
    color: '#8291ab',
    marginTop: '2px',
  },
};

export default DashboardPage;
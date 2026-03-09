import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import B2bHeader from '../../components/utils/b2bHeader'
import { Box } from '@mui/joy'
import { NavbarDivData } from '../../utils/DummyData';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HotelIcon from '@mui/icons-material/Hotel';
import MosqueIcon from '@mui/icons-material/Mosque';

const cardData = [
  {
    badge: 'Economy',
    hotels: [
      { name: 'MANARA BADAYA', address: '850-900 MTR/ MISFALAH KUBRI ROAD - shuttle', icon: <HotelIcon sx={{ color: '#FFD600', mr: 1 }} /> },
      { name: 'MANAZIL MARJAN', address: 'OMAR BIN ABDUL AZIZ ROAD/ - shuttle', icon: <MosqueIcon sx={{ color: '#FFD600', mr: 1 }} /> },
    ],
    price: '193,000',
    live: true,
    bestSeller: true,
  },
  {
    badge: 'Economy',
    hotels: [
      { name: 'MANZIL AL FATEH', address: '700-800 MTR / AL GHAZA SIDE - shuttle', icon: <HotelIcon sx={{ color: '#FFD600', mr: 1 }} /> },
      { name: 'SAFA TOWER', address: '700-800 MTR / BEAR MASJID BILAL - shuttle', icon: <MosqueIcon sx={{ color: '#FFD600', mr: 1 }} /> },
    ],
    price: '196,000',
    live: true,
    bestSeller: false,
  },
  {
    badge: 'Economy',
    hotels: [
      { name: 'RUSHD AL MAJD', address: '500-600 MTR / IBRAHIM KHALIL ROAD- shuttle', icon: <HotelIcon sx={{ color: '#FFD600', mr: 1 }} /> },
      { name: 'MAJOOM AL MADINAH', address: '500 MTR / ALI IBN ABI TALIB ROAD - shuttle', icon: <MosqueIcon sx={{ color: '#FFD600', mr: 1 }} /> },
    ],
    price: '203,500',
    live: false,
    bestSeller: false,
  },
  {
    badge: 'Economy',
    hotels: [
      { name: 'DIWAB AL BAIT', address: '500-600 MTR / IBRAHIM KHALIL ROAD - shuttle', icon: <HotelIcon sx={{ color: '#FFD600', mr: 1 }} /> },
      { name: 'ANWAAR TAQWA', address: '500 MTR / BAB AL SALAM ROAD - shuttle', icon: <MosqueIcon sx={{ color: '#FFD600', mr: 1 }} /> },
    ],
    price: '203,500',
  },
];

const featureList = [
  [
    { label: 'Flights', icon: <CheckCircleIcon sx={{ color: '#FFD600', fontSize: 20, mr: 0.5 }} /> },
    { label: 'Visa', icon: <CheckCircleIcon sx={{ color: '#FFD600', fontSize: 20, mr: 0.5 }} /> },
  ],
  [
    { label: 'Hotel', icon: <CheckCircleIcon sx={{ color: '#FFD600', fontSize: 20, mr: 0.5 }} /> },
    { label: 'Transport', icon: <CheckCircleIcon sx={{ color: '#FFD600', fontSize: 20, mr: 0.5 }} /> },
  ],
];

const badgeStyle = {
  display: 'inline-block',
  background: '#ede9fe', // light purple
  color: '#185ea5', // Al-Saboor purple
  fontWeight: 700,
  fontSize: 14,
  borderRadius: 16,
  padding: '2px 18px',
  marginBottom: 8,
  letterSpacing: 0.5,
  boxShadow: '0 2px 8px 0 #ede9fe',
};

const liveChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  background: '#f0fdf4', // lighter green
  color: '#059669',
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 12,
  padding: '2px 10px',
  marginLeft: 8,
  marginBottom: 8,
  gap: 0.5,
};

const bestSellerStyle = {
  display: 'inline-block',
  background: 'linear-gradient(90deg, #fffbe6 60%, #fff 100%)',
  color: '#bfa100', // gold text
  fontWeight: 700,
  fontSize: 13,
  borderRadius: 12,
  padding: '2px 12px',
  marginLeft: 8,
  marginBottom: 8,
  boxShadow: '0 2px 8px 0 #FFD60022',
};

const cardBoxStyle = {
  borderRadius: 3,
  boxShadow: '0 2px 12px 0 #ede9fe',
  background: 'linear-gradient(135deg, #fff 90%, #f8fafc 100%)',
  border: '1.5px solid #ede9fe',
  transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 8px 32px 0 #FFD60033',
    borderColor: '#FFD600',
    transform: 'translateY(-4px) scale(1.03)',
  },
  p: 3,
  minWidth: 260,
  maxWidth: 340,
  m: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'relative',
};

const hotelTitleStyle = {
  display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 18, color: '#222', mb: 0.5, fontFamily: 'Poppins, sans-serif',
};
const hotelAddressStyle = {
  fontSize: 13, color: '#666', fontWeight: 400, marginBottom: 8, marginLeft: 2,
};
const priceStyle = {
  mt: 1, fontWeight: 800, fontSize: 24, color: '#222', letterSpacing: 1, fontFamily: 'Poppins, sans-serif',
};
const priceRsStyle = {
  color: '#185ea5', fontWeight: 700, fontSize: 16, marginRight: 4, fontFamily: 'Poppins, sans-serif',
};
const bookBtnStyle = (color) => ({
  width: '100%',
  padding: '10px 0',
  background: '#fff',
  color: '#185ea5',
  border: `2px solid #185ea5`,
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 17,
  cursor: 'pointer',
  marginTop: 16,
  boxShadow: '0 2px 8px 0 #ede9fe',
  transition: 'background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s',
  outline: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: '#FFD600',
    color: '#185ea5',
    borderColor: '#FFD600',
    boxShadow: '0 4px 16px 0 #FFD60033',
    transform: 'scale(1.03)',
  },
});

const Umrahb2b = () => {
  const location = useLocation();
  const [activeDiv, setActiveDiv] = useState(0);
  const [activeOption, setActiveOption] = useState(1);
  const [showDiv, setShowDiv] = useState(false)

  useEffect(() => {
    if (location.pathname === '/b2b/umrah') {
      setActiveOption(1);
    }
  }, [location.pathname]);

  return (
    <Box sx={{
      display: "flex", justifyContent: "center", flexDirection: "column", width: "100%",
      backgroundColor: "#ebebeb",
      height: "auto",
      paddingBottom: "100px"
    }}>
      <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} showDiv={showDiv} />
      <Box sx={{ width: "100%", height: "auto", mt: "25px", display: "flex", justifyContent: "space-evenly" }}>
        <Box sx={{
          width: showDiv ? "95%" : "90%", minHeight: 320, display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center",
        }}>
          {/* Three Professional Cards in a Row */}
          <Box sx={{ width: '100%', py: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: { xs: 'center', md: 'center' },
              }}
            >
              {cardData.slice(0, 3).map((card, idx) => (
                <Box
                  key={idx}
                  sx={{
                    background: '#fff',
                    borderRadius: 18,
                    boxShadow: '0 4px 24px 0 #185ea508',
                    border: 'none',
                    minWidth: 300,
                    maxWidth: 320,
                    flex: '1 1 300px',
                    p: 3,
                    m: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 8px 24px 0 #FFD60022',
                      transform: 'translateY(-4px) scale(1.015)',
                    },
                  }}
                  tabIndex={0}
                  onClick={() => alert(`Viewing details for ${card.hotels[0].name}`)}
                >
                  {/* Badge Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1, gap: 1 }}>
                    <Box sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: '#ede9fe',
                      color: '#185ea5',
                      fontWeight: 600,
                      fontSize: 15,
                      borderRadius: 12,
                      px: 2,
                      py: 0.5,
                      letterSpacing: 0.5,
                    }}>{card.badge}</Box>
                  </Box>
                  {/* Hotel Info */}
                  {card.hotels.map((hotel, hidx) => (
                    <Box key={hidx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      {hotel.icon}
                      <Box sx={{ fontWeight: 700, fontSize: 18, color: '#222', ml: 1, mr: 1 }}>{hotel.name}</Box>
                    </Box>
                  ))}
                  {card.hotels.map((hotel, hidx) => (
                    <Box key={hidx + '-address'} sx={{ fontSize: 13, color: '#444', fontWeight: 400, mb: 0.5, ml: 4 }}>{hotel.address}</Box>
                  ))}
                  {/* Features */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px 8px', mt: 1, mb: 1, width: '100%' }}>
                    {featureList.flat().map((f, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon sx={{ color: '#FFD600', fontSize: 18 }} />
                        <Box sx={{ fontWeight: 600, color: '#222', fontSize: 15 }}>{f.label}</Box>
                      </Box>
                    ))}
                  </Box>
                  {/* Price */}
                  <Box sx={{ mt: 1, mb: 0, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Box sx={{ color: '#222', fontWeight: 700, fontSize: 17 }}>RS.</Box>
                    <Box sx={{ fontWeight: 700, fontSize: 24, color: '#222', letterSpacing: 1, fontFamily: 'Poppins, sans-serif' }}>{card.price}</Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Pulse animation for LIVE dot */}
      <style>{`
                @keyframes pulse {
                  0% { box-shadow: 0 0 6px 2px #22c55e55; opacity: 1; }
                  100% { box-shadow: 0 0 12px 6px #22c55e33; opacity: 0.7; }
                }
            `}</style>
    </Box>
  )
}


export default Umrahb2b

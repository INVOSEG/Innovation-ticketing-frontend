import { Box, Button, Input, Option, Select, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import B2bHeader from '../../components/utils/b2bHeader';
import { NavbarDivData } from '../../utils/DummyData';
import B2BheaderV2 from '../../components/utils/B2BheaderV2';
import ProfileMainInfo from './ProfileMainInfo';
import Card from '@mui/joy/Card';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UserMainInfo from './UserMainInfo';
import Markup from './Markup';
import SubUser from './SubUser';
import { useSelector } from 'react-redux';

const tabIcons = [
  <PersonIcon />, <GroupIcon />, <LockIcon />, <TrendingUpIcon />, <PeopleAltIcon />, <BarChartIcon />
];

const Profile = () => {
  const userData = useSelector((state) => state.user.loginUser);
  const [names, setNames] = useState([{ name: "My Profile" }])
  const users = [{ name: "Asad Mehmood", username: "asad" }, { name: "Usman Iqbal", username: "usman" }, { name: "Ahsan Usman", username: "ahsan" }]

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDiv, setActiveDiv] = useState(4);
  const [activeOption, setActiveOption] = useState(0);

  useEffect(() => {
    if (userData?.role === "agency") {
      setNames([{ name: "My Profile" }, { name: "Agent Management" }]) // , { name: "Mark-up" }, { name: "Sub User Usage Limit" }
    } else if (userData?.role !== "agency") {
      setNames([{ name: "My Profile" }])
    }
  }, [userData?.id])

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
      <B2BheaderV2 divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} />


      <Box sx={{ width: { xs: "100%", lg: "70%" }, minHeight: '80vh', display: "flex", justifyContent: "center", alignItems: "flex-start", margin: '40px auto', background: 'none' }}>
        {/* Sidebar */}
        <Box sx={{
          width: "260px",
          minWidth: '220px',
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: 0,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          p: 0,
          m: 0,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}>
          {names.map((nam, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: "100%",
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-between',
                px: 2.5,
                cursor: "pointer",
                borderLeft: activeIndex === index ? "4px solid #185ea5" : "4px solid transparent",
                background: activeIndex === index ? "#f7f2fa" : "#fff",
                color: activeIndex === index ? "#185ea5" : "#222",
                fontWeight: activeIndex === index ? 600 : 400,
                fontSize: '15px',
                borderBottom: '1px solid #f0f0f0',
                transition: 'all 0.2s',
                '&:hover': {
                  background: '#f7f2fa',
                  color: '#185ea5',
                },
              }}
            >
              <span>{nam.name}</span>
              <CreditCardIcon sx={{ fontSize: 18, color: activeIndex === index ? '#185ea5' : '#bdbdbd', ml: 2 }} />
            </Box>
          ))}
        </Box>
        {/* Main Content */}
        <Box sx={{
          flex: 1,
          minWidth: 0,
          width: '100%',
          maxWidth: 900,
          mx: { xs: 'auto', md: 0 },
          ml: { xs: 0, md: 7 }, // Increased gap (theme spacing * 7 = 56px)
        }}>
          {activeIndex === 0 && <ProfileMainInfo />}
          {activeIndex === 1 && userData?.role === "agency" && <UserMainInfo />}
          {activeIndex === 2 && userData?.role === "agency" && <Markup />}
          {activeIndex === 3 && userData?.role === "agency" && (
            <>
              <SubUser />
              <Box sx={{ my: 3 }} />
            </>
          )}
          {/* Other tab content can go here for activeIndex 2, 4, etc. */}
        </Box>
      </Box>
    </Box>
  )
}

export default Profile
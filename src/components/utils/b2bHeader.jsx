import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, Divider, Input, Option, Select, Table, Typography, Tooltip, ListItemContent, List, ListItem, ListItemButton, ListItemDecorator } from '@mui/joy'
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LogoutModal from '../modals/LogoutModal';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { setLoginUser } from '../../redux/reducer/userSlice';
import { setDashboardOption } from '../../redux/reducer/dashboardSlice';
import AlasamLogo from "../../images/alasamLogo.png";
import { getAgencyById, getStaffDetailById } from '../../server/api';
import moment from 'moment';
import HotelIcon from '@mui/icons-material/Hotel';
import GppGoodIcon from '@mui/icons-material/GppGood';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FeedIcon from '@mui/icons-material/Feed';
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ReceiptIcon from '@mui/icons-material/Receipt';
import MosqueIcon from '@mui/icons-material/Mosque';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTicketFilterValues } from '../../context/ticketFilterValues';
import { HomeMaxOutlined } from '@mui/icons-material';

const currencyList = [{ value: "USD", title: "$" }, { value: "EUR", title: "€" }, { value: "PKR", title: "Rs" }, { value: "RMB", title: "¥" }]


const B2bHeader = ({ divs, activeDiv, setActiveDiv, setActiveOption, activeOption, showDiv, hidePromotion, isPnr }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user.loginUser);
    const { resetFiltersState } = useTicketFilterValues()

    const [showPrice, setShowPrice] = useState(false)
    const [showAgent, setShowAgent] = useState(false)
    const [openLogout, setOpenLogout] = useState(false)
    const [isShowAgencyLabel, setIsShowAgencyLabel] = useState(false);
    const [cashLimit, setCashLimit] = useState(null)
    const [currencyToShow, setCurrencyToShow] = useState('$')
    const [agencyName, setAgencyName] = useState(null)
    const [allocatedBalance, setAllocatedBalance] = useState(0)

    function getCurrentDateTime() {
        const currentDate = new Date();
        return currentDate.toISOString();
    }


    const fetchAgency = async () => {
        if (!userData?.agency_id) return;
        const agencyData = await getAgencyById(userData?.agency_id);

        if (agencyData?.status === "success") {
            const currencyLabel = currencyList.find(item => item.value === agencyData?.result?.currency || agencyData?.result?.defaultCurrency)
            setIsShowAgencyLabel(agencyData?.result?.showLabel);
            setCashLimit(agencyData?.result?.cashLimit);
            setCurrencyToShow(currencyLabel ? currencyLabel?.title : '$')
            setAgencyName(agencyData?.result?.agencyName || agencyData?.result?.affiliateName)
        }
    }

    const fetchStaffDetail = async () => {
        try {
            const staffData = await getStaffDetailById(userData?.id);
            setAllocatedBalance(staffData?.result?.allocatedBalance ? staffData?.result?.allocatedBalance : 0)
        } catch (error) {
            console.log('Error in Fetch Staff Detail:', error)
        }
    }

    const handleLogout = () => {
        setOpenLogout(false)
        dispatch(setLoading(true));

        // Show loading for 3 seconds
        setTimeout(() => {
            resetFiltersState();
            dispatch(setLoginUser(null));
            dispatch(setDashboardOption("User Management"));
            dispatch(setLoading(false));
            // Optionally, you can redirect or perform any other action after logout
        }, 3000); // 3000 milliseconds = 3 seconds
    };

    const handleBalance = () => {
        setShowPrice(!showPrice)
    }
    const handleAgent = () => {
        setShowAgent(!showAgent)
    }

    const buttons = [
        {
            label: "Flight", icon: <FlightTakeoffIcon />
        },
        {
            label: "Umrah", icon: <MosqueIcon />
        },
        {
            label: "Visa", icon: <FeedIcon />
        },
        {
            label: "Hotels", icon: <HotelIcon />
        },
        {
            label: "Bills", icon: <ReceiptIcon />
        },
        {
            label: "Insurance", icon: <GppGoodIcon />
        },
        {
            label: "Medical Tourism", icon: <MedicalInformationIcon />
        }, {
            label: "Support", icon: <SupportAgentIcon />
        },
    ];

    useEffect(() => {
        fetchAgency()
        fetchStaffDetail()
    }, [])

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box sx={{
                    width: "100%",
                    // backgroundImage: `url(${require('../../images/bg.png')})`,
                    // backgroundRepeat: "no-repeat",
                    // backgroundSize: "cover",
                    // backgroundPosition: "center",
                    backgroundColor: "white",
                    display: "flex", flexDirection: "column", alignItems: "center"
                }}>
                    <Box sx={{ width: { sm: "100%", md: "85%", lg: "100%" }, height: "65%", display: "flex", justifyContent: "space-between", boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1)', }}>
                        <Box sx={{ height: "100%", width: "250px", display: "flex", justifyContent: "left", alignItems: "center", }}>

                            <img
                                src={AlasamLogo}
                                alt="Asam-logo"
                                width="200.812px"
                                height="110px"
                                loading="lazy"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate('/b2b/searchticket')}
                            />
                        </Box>
                        <Box sx={{ width: { xs: "70%", lg: "40%" }, height: "100%", display: "flex", alignItems: "center", justifyContent: "space-evenly", mt: 2, mr: 4 }}>
                            <Box sx={{ width: "55%", height: "95%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }} onMouseLeave={() => setShowAgent(false)}>
                                <Box sx={{ height: "70%", width: "95%", display: "flex" }}>
                                    <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "18px" },
                                                fontWeight: "500",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            {agencyName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            Agent Code: {userData?.agentCode ? userData?.agentCode : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: "20%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Box
                                            onMouseEnter={() => setShowAgent(true)}
                                            sx={{
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "5px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 9L0.736861 0.749999L10.2631 0.75L5.5 9Z" fill="black" />
                                            </svg>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ height: "30%", width: "95%", mt: "5px" }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "9px", sm: "10px", md: "11px", lg: "12.5px" },
                                            fontWeight: "400",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}
                                    >
                                        Last Login: {userData?.lastLogin ? `${moment(userData?.lastLogin)?.format('MMM DD YYYY')} | ${moment(userData?.lastLogin)?.format('hh:mm A')}` : `${moment(getCurrentDateTime())?.format('MMM DD YYYY')} | ${moment(getCurrentDateTime())?.format('hh:mm A')}`}
                                    </Typography>
                                </Box>

                                {showAgent &&
                                    <Box sx={{ width: "250px", height: "auto", backgroundColor: "white", position: "absolute", top: 40, left: 0, borderRadius: "15px", zIndex: 9999, display: "flex", flexDirection: "column", boxShadow: "0px 0px 6px 0px rgb(0,0,0,6)" }}>
                                        <List>
                                            {[
                                                { label: "My Bookings", icon: <AirplaneTicketIcon /> },
                                                { label: "Accounts", icon: <AccountBalanceIcon /> },
                                                { label: "Sales", icon: <MonetizationOnIcon /> },
                                                { label: "My Profile", icon: <AccountCircleIcon /> },
                                                { label: "Logout", icon: <LogoutIcon /> },
                                            ].map((item, index) => (
                                                <ListItem key={index} onClick={() => {
                                                    if (item.label === "Logout") {
                                                        setOpenLogout(true);
                                                    } else if (item.label === "My Profile") {
                                                        navigate("/b2b/profile");
                                                    } else if (item.label === "My Bookings") {
                                                        navigate("/b2b/flight-booking");
                                                    } else if (item.label === "Sales") {
                                                        navigate("/b2b/sale-report");
                                                    } else if (item.label === "Accounts") {
                                                        navigate("/b2b/account");
                                                    }
                                                }}>
                                                    <ListItemButton>
                                                        <ListItemDecorator>{item.icon}</ListItemDecorator>
                                                        <ListItemContent>{item.label}</ListItemContent>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                }
                            </Box>

                            <Divider orientation="vertical" sx={{ height: "80%", marginRight: "15px" }} />

                            <Box sx={{ width: "45%", height: "95%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                                <Box sx={{ height: "70%", width: "100%", display: "flex" }}>
                                    <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'flex-start' }}>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "18px" },
                                                fontWeight: "400",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            Main Balance
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: { xs: "12px", sm: "13px", md: "14px", lg: "16px" },
                                                fontWeight: "600",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            RS. {allocatedBalance}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{ width: "20%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        onMouseEnter={() => setShowPrice(true)}
                                        onMouseLeave={() => setShowPrice(false)}
                                    >
                                        <Box sx={{ width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "5px", cursor: "pointer" }}>
                                            <svg width="15" height="15" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.5 9L0.736861 0.749999L10.2631 0.75L5.5 9Z" fill="black" />
                                            </svg>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ height: "30%", width: "100%", mt: "5px", display: "flex", justifyContent: "flex-start" }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "9px", sm: "10px", md: "11px", lg: "12.5px" },
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}
                                    >
                                        {
                                            userData?.role === "super_admin"
                                                ? "Admin Dashboard"
                                                : userData?.role === "agency"
                                                    ? "Agency Dashboard"
                                                    : userData?.role === "sale" || userData?.role === "SPO"
                                                        ? "Sales Dashboard"
                                                        : "Dashboard"
                                        }: {userData?.firstName}
                                    </Typography>
                                </Box>

                                {showPrice &&
                                    <Box sx={{ width: "350px", height: "auto", backgroundColor: "white", position: "absolute", top: 40, right: 0, borderRadius: "15px", zIndex: 9999, display: "flex", flexDirection: "column", boxShadow: "0px 0px 6px 0px rgb(0,0,0,6)" }}>
                                        <List sx={{ p: 0 }}>
                                            <ListItem sx={{ backgroundColor: "skyblue", borderBottom: "1px solid lightgrey", borderRadius: "15px 15px 0px 0px" }}>
                                                <ListItemContent>Total Balance:</ListItemContent>
                                                <ListItemContent sx={{ textAlign: "right" }}>RS. {allocatedBalance}</ListItemContent>
                                            </ListItem>
                                            <ListItem sx={{ borderBottom: "1px solid lightgrey" }}>
                                                <ListItemContent>Common :</ListItemContent>
                                                <ListItemContent sx={{ textAlign: "right" }}>N/A</ListItemContent>
                                            </ListItem>
                                            <ListItem sx={{ borderBottom: "1px solid lightgrey" }}>
                                                <ListItemContent>Balance: </ListItemContent>
                                                <ListItemContent sx={{ textAlign: "right" }}>RS. {allocatedBalance}</ListItemContent>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemContent>Pending Dues : </ListItemContent>
                                                <ListItemContent sx={{ textAlign: "right" }}>N/A</ListItemContent>
                                            </ListItem>
                                        </List>
                                    </Box>
                                }
                            </Box>
                        </Box>

                    </Box>

                    {!showDiv && (
                        <>

                            {/* <Box sx={{ backgroundColor: "#FFFFFF", height: "6rem", width: { xs: "80%", lg: "65%" }, borderRadius: "50px", display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: "10px", boxShadow: "10px 10px 10px rgb(0,0,0,0.3)", mt: 2 }}>
                        {buttons.map((button, index) => (
                            <Box style={{ cursor: "pointer" }} key={index} onClick={() => {
                                if (!index == 0) {
                                    console.log("object")
                                    // setActiveOption(index)
                                    alert('Coming soon')
                                } else {
                                    console.log("not working")
                                    console.log(index)

                                }


                            }} >
                                {button.icon}
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        color: activeOption === index ? "white" : "#185ea5",
                                        backgroundColor: activeOption === index ? "#185ea5" : "white",
                                        padding: activeOption === index ? "8px" : "0px",
                                        borderRadius: activeOption === index ? "8px" : "0px",
                                    }}
                                >
                                    {button.label}
                                </Typography>
                            </Box>
                        ))}


                    </Box> */}

                            {/* <Box sx={{ backgroundColor: "#036bb0", height: "7rem", width: { xs: "80%", lg: "100%" }, display: "flex", justifyContent: "flex-start", alignItems: "center", mt: { xs: "20px", lg: "10px" } }}>
                                {buttons.map((button, index) => (
                                    <Box style={{ cursor: "pointer", margin: "0px 0px 0px 75px" }} key={index} onClick={() => {
                                        if (index === 0) {
                                            setActiveOption(index)
                                            navigate("/b2b/searchticket")
                                        } else if (index === 1) {
                                            setActiveOption(index)
                                            navigate("/b2b/umrah")
                                        } else {
                                            setActiveOption(index)
                                            navigate('/b2b/under-discussion')
                                        }
                                    }} >
                                        {React.cloneElement(button.icon, {
                                            sx: {
                                                color: activeOption === index ? "#fecf40" : "white",
                                                width: "50px", height: "40px"
                                            },
                                        })}
                                        <Box sx={{
                                            borderBottom: activeOption === index ? "4px solid #fecf40" : "", paddingBottom: "5px"
                                        }}>
                                            <Typography
                                                sx={{
                                                    textAlign: "center",
                                                    color: activeOption === index ? "#fecf40" : "white",
                                                    borderRadius: activeOption === index ? "8px" : "0px",
                                                }}
                                            >
                                                {button.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}


                            </Box> */}

                            {/* {!isPnr && (
                        <marquee style={{ backgroundColor: "transparent", color: "white", padding: "10px", fontSize: "22px", marginTop: "10px" }}>Welcome to Al-Saboor Portal </marquee>
                    )} */}
                            {activeDiv != 0 && (
                                <Box sx={{ width: { xs: "90%", lg: "70%" }, height: "10rem", display: "flex", justifyContent: "space-between", alignItems: "center", margin: "50px 0px 20px 0px" }}>
                                    {divs.map((div, index) => (
                                        <Box
                                            // key={index}
                                            // onClick={() => {
                                            //     if(index == 1){
                                            //         navigate("/b2b/pnr")

                                            //     }else {
                                            //         alert('Coming soon')               
                                            //         console.log("not working")
                                            //         console.log(index)

                                            //     }
                                            // }}

                                            sx={{
                                                width: "18%",
                                                height: "80%",
                                                borderRadius: "15px",
                                                border: "2px solid #185ea5",
                                                color: "#185ea5",
                                                backgroundColor: "white",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "10px",
                                                flexDirection: "column",


                                            }}
                                        ><img
                                                src={require(`../../images/${div.icon}`)}
                                                alt={div.label}
                                                height="50"
                                                width="50"
                                            />


                                            <Typography sx={{
                                                border: "1px solid #185ea5", padding: "10px", border: activeDiv == index ? "none" : "2px solid #185ea5",
                                                color: activeDiv == index ? "white" : "#185ea5",
                                                backgroundColor: activeDiv == index ? "#185ea5" : "white", borderRadius: "25px",
                                                boxShadow: "5px 5px 20px 5px rgb(0,0,0,0.3)",
                                                width: "75%", textAlign: "center",
                                                cursor: 'pointer'
                                            }} key={index}
                                                onClick={() => {
                                                    if (index == 0) {
                                                        navigate("/b2b/searchticket")
                                                    } else if (index == 1) {
                                                        navigate("/b2b/sale-report")
                                                    } else if (index == 2) {
                                                        navigate("/b2b/pnr")
                                                    } else if (index == 3) {
                                                        navigate("/b2b/flight-booking")
                                                    } else {
                                                        navigate('/b2b/travel-calender')
                                                        // navigate('/b2b/under-discussion')
                                                        // console.log("not working")
                                                        // console.log(index)

                                                    }
                                                }}>{div.label}</Typography>
                                        </Box>
                                    ))}


                                </Box>
                            )}

                        </>
                    )}

                    {hidePromotion && !isPnr && (

                        <Box sx={{ width: { xs: "90%", lg: "70%" }, height: "10rem", display: "flex", justifyContent: "space-evenly", alignItems: "center", margin: "10px 0px 0px 0px" }}>

                            {divs.map((div, index) =>

                                <Box

                                    sx={{
                                        width: "18%",
                                        height: "80%",
                                        borderRadius: "15px",
                                        border: "2px solid #185ea5",
                                        color: "#185ea5",
                                        backgroundColor: "white",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexDirection: "column"

                                    }}
                                ><img
                                        src={require(`../../images/${div.icon}`)}
                                        alt={div.label}
                                        height="50"
                                        width="50"
                                    />
                                    <Typography sx={{
                                        border: "1px solid #185ea5", padding: "10px", border: activeDiv == index ? "none" : "2px solid #185ea5",
                                        color: activeDiv == index ? "white" : "#185ea5",
                                        backgroundColor: activeDiv == index ? "#185ea5" : "white", borderRadius: "25px",
                                        boxShadow: "5px 5px 20px 5px rgb(0,0,0,0.3)",
                                        width: "75%", textAlign: "center",
                                        cursor: 'pointer'
                                    }} key={index}
                                        onClick={() => {
                                            if (index == 0) {
                                                navigate("/b2b/searchticket")
                                            } else if (index == 1) {
                                                navigate("/b2b/sale-report")
                                            } else if (index == 2) {
                                                navigate("/b2b/pnr")
                                            } else if (index == 3) {
                                                navigate("/b2b/flight-booking")
                                            } else {
                                                navigate('/b2b/travel-calender')
                                            }
                                        }}
                                    >{div.label}</Typography>
                                </Box>



                            )}


                        </Box>
                    )}


                    <LogoutModal open={openLogout} setOpen={setOpenLogout} handleLogout={handleLogout} />
                </Box>
            </Box>

        </>
    )
}

export default B2bHeader

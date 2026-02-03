import { Box, Divider, List, ListItem, ListItemButton, ListItemContent, ListItemDecorator, Stack, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import AlasamLogo from "../../images/alasamLogo.png";
import moment from 'moment';
import HotelIcon from '@mui/icons-material/Hotel';
import GppGoodIcon from '@mui/icons-material/GppGood';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FeedIcon from '@mui/icons-material/Feed';
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CarRentalIcon from '@mui/icons-material/CarRental';
import MosqueIcon from '@mui/icons-material/Mosque';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { Home, HomeMaxOutlined, KeyboardArrowRight } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useTicketFilterValues } from '../../context/ticketFilterValues';
import { getAgencyById, getStaffDetailById } from '../../server/api';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { setLoginUser } from '../../redux/reducer/userSlice';
import { setDashboardOption } from '../../redux/reducer/dashboardSlice';
import LogoutModal from '../modals/LogoutModal';

const B2BheaderV2 = () => {
    const currencyList = [{ value: "USD", title: "$" }, { value: "EUR", title: "€" }, { value: "PKR", title: "Rs" }, { value: "RMB", title: "¥" }]
    const buttons = [
        {
            label: "Flight", icon: <FlightTakeoffIcon />
        },
        {
            label: "Hotels", icon: <HotelIcon />
        },
        {
            label: "Umrah", icon: <MosqueIcon />
        },
        {
            label: "Transfers", icon: <DirectionsBusFilledIcon />
        },
        {
            label: "Car Rental", icon: <CarRentalIcon />
        },
        {
            label: "Visa", icon: <FeedIcon />
        },

        {
            label: "Insurance", icon: <GppGoodIcon />
        },

    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resetFiltersState } = useTicketFilterValues()
    const userData = useSelector((state) => state.user.loginUser);

    const [cashLimit, setCashLimit] = useState(null)
    const [showPrice, setShowPrice] = useState(false)
    const [showAgent, setShowAgent] = useState(false)
    const [agencyName, setAgencyName] = useState(null)
    const [activeOption, setActiveOption] = useState(0);
    const [openLogout, setOpenLogout] = useState(false);
    const [currencyToShow, setCurrencyToShow] = useState('$')
    const [allocatedBalance, setAllocatedBalance] = useState(0)
    const [isShowAgencyLabel, setIsShowAgencyLabel] = useState(false);
    const [staffData, setStaffData] = useState(null);


    const handleBalance = () => {
        setShowPrice(!showPrice)
    }
    const handleAgent = () => {
        setShowAgent(!showAgent)
    }

    function getCurrentDateTime() {
        const currentDate = new Date();
        return currentDate.toISOString();
    }

    const fetchAgency = async () => {
        if (!userData?.agency_id) return;

        const agencyData = await getAgencyById(userData?.agency_id);

        if (agencyData?.status === "success") {
            const currencyLabel = currencyList.find(
                item =>
                    item.value === agencyData?.result?.currency ||
                    item.value === agencyData?.result?.defaultCurrency
            );

            setIsShowAgencyLabel(agencyData?.result?.showLabel);
            setCashLimit(agencyData?.result?.cashLimit);
            setCurrencyToShow(currencyLabel ? currencyLabel.title : '$');

            // ✅ Only set agency name if staffData does NOT already have it
            if (!staffData?.result?.agencyName) {
                setAgencyName(
                    agencyData?.result?.agencyName ||
                    agencyData?.result?.affiliateName
                );
            } else {
                setAgencyName(staffData?.result?.agencyName)
            }
        }
    };



    const fetchStaffDetail = async () => {
        try {
            const response = await getStaffDetailById(userData?.id);
            setStaffData(response); // store full response
            setAllocatedBalance(response?.result?.allocatedBalance || 0);
        } catch (error) {
            console.log('Error in Fetch Staff Detail:', error);
        }
    };


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

    useEffect(() => {
        if (!userData?.id) return;

        const init = async () => {
            await fetchStaffDetail();
        };

        init();
    }, [userData?.id]);

    useEffect(() => {
        if (!staffData) return;

        fetchAgency();
    }, [staffData]);

    return (
        <>
            <Box sx={{
                height: "6rem", width: "100%", alignItems: "center", justifyContent: "center", display: "flex"
            }}>
                <Box sx={{ width: { sm: "100%", md: "90%", lg: "85%" }, height: "75%", display: "flex", justifyContent: "space-between" }}>
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
                    <Box sx={{ width: { xs: "70%", lg: "40%" }, height: "100%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
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

                        <Box sx={{ width: "49%", height: "95%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
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

            </Box>
            {/* <Box sx={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#036bb0" }}>
                <Box sx={{ height: "3.5rem", width: "80%", display: "flex", justifyContent: "flex-start", alignItems: "center", gap: { sm: "50px", md: "60px", lg: "70px" } }}>
                    {buttons.map((button, index) => (
                        <Box style={{ cursor: "pointer" }} key={index} onClick={() => {
                            if (!index == 0) {
                                console.log("object")
                                setActiveOption(index)
                                // setActiveDiv(index)
                                navigate('/b2b/under-discussion')
                            } else {
                                console.log("not working")
                                console.log(index)
                                setActiveOption(index)
                                navigate("/b2b/searchticket")

                            }


                        }} >
                            {React.cloneElement(button.icon, {
                                sx: {
                                    color: activeOption === index ? "#fecf40" : "white",
                                    width: "35px", height: "30px",
                                },
                            })}
                            <Box sx={{
                                borderBottom: activeOption === index ? "4px solid #fecf40" : "10px"
                            }}>
                                <Typography
                                    sx={{
                                        textAlign: "center",
                                        color: activeOption === index ? "#fecf40" : "white",
                                        // padding: activeOption === index ? "2px" : "0px",
                                        borderRadius: activeOption === index ? "8px" : "0px",
                                        fontSize: "12px",
                                        fontWeight: 400

                                    }}
                                >
                                    {button.label}
                                </Typography>
                            </Box>
                        </Box>
                    ))}

                    </Box>
                    </Box> */}
            <LogoutModal open={openLogout} setOpen={setOpenLogout} handleLogout={handleLogout} />
        </>
    )
}

export default B2BheaderV2

import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import B2bHeader from '../../components/utils/b2bHeader'
import { Box } from '@mui/joy'
import { NavbarDivData } from '../../utils/DummyData';


const InformationRequired = () => {
    const location = useLocation();
    const [activeDiv, setActiveDiv] = useState(0);
    const [activeOption, setActiveOption] = useState(0);
    const [showDiv, setShowDiv] = useState(false)

    useEffect(() => {
        if (location.pathname === '/b2b/umrah') {
            setActiveOption(1); // Umrah
        } else if (location.pathname === '/b2b/searchticket') {
            setActiveOption(0); // Flight
        }
        // Add more conditions for other tabs if needed
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
                    width: showDiv ? "95%" : "67%", height: "60vh", display: "flex", justifyContent: "center",
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        position: "relative", width: "100%", display: "flex", justifyContent: "center",
                        alignItems: 'center',
                        backgroundColor: "white",
                        boxShadow: "5px 5px 20px 5px rgb(0,0,0,0.3)",
                        borderRadius: "20px",
                        height: "20vh"
                    }}>


                        <h1>Instruction and Flow required!</h1>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default InformationRequired

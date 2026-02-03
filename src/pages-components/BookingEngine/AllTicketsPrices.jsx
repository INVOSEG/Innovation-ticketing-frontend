import React, { useEffect, useState } from "react";
import Stack from '@mui/joy/Stack';
import { Box, Chip } from "@mui/joy";
import { formatDate } from "../../components/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FlightIcon from '@mui/icons-material/Flight';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CustomNextArrow = ({ onClick, isDisabled }) => {
    return (
        <div className="custom-arrow next" style={{ top: '45px', left: '10px', position: 'absolute', cursor: 'pointer', display: isDisabled && 'none', zIndex: 10 }} onClick={onClick}>
            <ArrowBackIosIcon />
        </div>
    );
};

const CustomPrevArrow = ({ onClick, isDisabled }) => {
    return (
        <div className="custom-arrow prev" style={{ right: '8px', top: '45px', position: 'absolute', cursor: 'pointer', display: isDisabled && 'none', zIndex: 10 }} onClick={onClick}>
            <ArrowForwardIosIcon />
        </div>
    );
};

function getScreenSizeCategory() {
    const width = window.innerWidth;

    if (width < 600) {
        return 'x-small';  // Small screen (mobile)
    } else if (width >= 600 && width < 736) {
        return 'small'; // Medium screen (tablet)
    } else if (width >= 736 && width < 900) {
        return 'medium'; // Medium screen (tablet)
    } else if (width >= 900 && width < 1020) {
        return 'small'; // Medium screen (tablet)
    } else if (width >= 1020 && width < 1500) {
        return 'medium'; // Medium screen (tablet)
    } else if (width >= 1500 && width < 1800) {
        return 'large'; // Medium screen (tablet)
    } else {
        return 'x-large';  // Large screen (desktop)
    }
}


const AllTicketsPrices = ({ flightTickets, filterFlightsByArCode, selectedArCode }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [chunkSize, setChunkSize] = useState(5)
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (current, next) => setCurrentSlide(next),
        nextArrow: <CustomPrevArrow isDisabled={currentSlide >= Math.ceil(flightTickets.length / 5) - 1} />,
        prevArrow: <CustomNextArrow isDisabled={currentSlide === 0} />,
    };

    console.log('flightTickets:', flightTickets?.sort((a, b) => parseFloat(a.totalFare) - parseFloat(b.totalFare)))

    const renderChips = (flights) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {flights.map((flight) => (
                <Chip
                    key={flight.id}
                    variant={selectedArCode === flight.arCode ? "solid" : "plain"}
                    color={selectedArCode === flight.arCode && "primary"}
                    // sx={theme => ({
                    //     background: theme.colorSchemes.light.palette.primary[500],
                    // })}
                    sx={{
                        p: 1,
                        m: 1.5,
                        boxShadow: selectedArCode === flight.arCode ? '0px 8px 16px rgba(0, 0, 0, 0.2)' : '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'box-shadow 0.3s ease-in-out',
                        backgroundColor: selectedArCode === flight.arCode ? '#185ea5 !important' : 'transparent',

                        borderRadius: '10px',
                        '&:hover': {
                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                            background: 'red'
                        },
                        // '&.css-zppa0s-JoyChip-action': {
                        //     backgroundColor: '#185ea5 !important',
                        // }
                    }}
                    onClick={() => filterFlightsByArCode(flight.arCode)}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            // flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            // p: 2,
                            width: '13.5em',
                        }}
                    >
                        {console.log(flight, 'FLIGHT')}
                        {/* <FlightIcon sx={{ fontSize: '50px', color: 'goldenrod' }} /> */}
                        <img src={flight.logo} width={60} height={60} />
                        <Box sx={{ width: '6em', marginLeft: '10px' }}>
                            {/* <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 1 }}><CalendarMonthIcon />{formatDate(flight.departure?.departureTime)}</p> */}
                            <p style={{ fontSize: '15px', margin: 1 }}>{flight?.arCode}</p>
                            <b style={{ fontSize: '12px' }}><span style={{ marginRight: '1px' }}>RS.</span>{flight.passengerTotalFare}</b>
                        </Box>
                    </Box>
                </Chip>
            ))
            }
        </Box >
    );

    function updateChunkSize() {
        const screenSize = getScreenSizeCategory();

        switch (screenSize) {
            case 'x-small':
                setChunkSize(1);
                break;
            case 'small':
                setChunkSize(2);
                break;
            case 'medium':
                setChunkSize(3);
                break;
            case 'large':
                setChunkSize(4);
                break;
            case 'x-large':
                setChunkSize(5);
                break;
        }
    }

    // console.group('HIIII', updateChunkSize())

    const flightChunks = [];
    for (let i = 0; i < flightTickets.length; i += chunkSize) {
        flightChunks.push(flightTickets.slice(i, i + chunkSize));
    }

    useEffect(() => {
        updateChunkSize(); // Initial chunk size update

        // Add event listener to update chunk size on window resize
        const handleResize = () => {
            updateChunkSize();
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Stack
            spacing={2}
            direction="row"
            flexWrap="wrap"
            sx={{ width: '100%', border: '1px solid #CCD6E0', borderRadius: 'md', mb: 3 }}
        >
            <Box
                sx={{
                    // overflowX: 'auto', // Enables horizontal scrolling
                    whiteSpace: 'nowrap', // Prevents chips from wrapping
                    flexGrow: 1, // Allows Box to take full width
                    padding: '8px 0',
                    width: 100,
                    // '&::-webkit-scrollbar': {
                    //     height: '4px',
                    // },
                    // '&::-webkit-scrollbar-thumb': {
                    //     background: '#888', // Customize scrollbar thumb color
                    //     borderRadius: '2px',
                    // },
                    // '&::-webkit-scrollbar-thumb:hover': {
                    //     background: '#555', // Customize scrollbar thumb color on hover
                    // },
                }}
            >
                <Slider {...settings}>
                    {flightChunks.map((chunk, index) => (
                        <div key={index}>
                            {renderChips(
                                chunk.sort((a, b) => a.departure?.departureTime - b.departure?.departureTime)
                            )}
                        </div>
                    ))}
                </Slider>
            </Box>

            <Box sx={{ width: '100%' }}>

            </Box>
        </Stack>
    );
};

export default AllTicketsPrices;

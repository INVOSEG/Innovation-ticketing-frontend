import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { Card, CardContent, Chip, CircularProgress, Divider, List, ListItem, Stack, Typography } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { extractTime, formatDate, formatDuration } from '../utils';
import { viewItinary } from '../../server/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonIcon from '@mui/icons-material/Person'
import { removeLastWord } from '../../utils/HelperFunctions';


function formatDateOrTime(dateString, type) {
    // Check the type and return either the date or time
    if (type === "date") {
        return dateString.split('T')[0]; // Extract date in "YYYY-MM-DD" format
    } else if (type === "time") {
        return dateString.split('T')[1]; // Extract time in "HH:mm:ss" format
    } else {
        return "N/A";
    }
}


const Header = ({ setState }) => {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <Typography level="h1">Details</Typography>
                <CloseIcon onClick={() => setState(false)} sx={{ cursor: 'pointer', fontSize: '30px' }} />
            </Box>
        </>
    )
}

const FlightTab = ({ flight, isAmadus }) => {
    console.log(flight)
    return (
        <>
            {flight ? flight?.map((item, index) => (
                <Box key={index} sx={{ border: '1px solid black', borderRadius: '20px', marginTop: index !== 0 && '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="h4">{isAmadus ? item?.departure?.iataCode : item?.fromAirportCode}</Typography>
                            <Typography sx={{fontSize: '11px'}}>{isAmadus ? item?.departure?.iataCode : item?.fromAirport?.name}</Typography>
                            <Typography sx={{fontSize: '11px'}}>{isAmadus ? item?.departure?.iataCode : item?.fromAirport?.city}</Typography>
                            <Typography sx={{fontSize: '11px'}}>{isAmadus ? item?.departure?.iataCode : item?.fromAirport?.country}</Typography>


                            <Typography level="title-sm" color="neutral" sx={{mt:2}}>{isAmadus ? formatDateOrTime(item?.departure?.at, "date") : item?.departureDate}</Typography>
                        </Box>

                        <Box>
                            <ArrowForwardIcon sx={{ fontSize: '30px' }} />
                        </Box>

                        <Box>
                            <Typography level="h4" sx={{ textAlign: 'right' }}>{isAmadus ? item?.arrival?.iataCode : item?.toAirportCode}</Typography>
                             <Typography level="body1" sx={{ textAlign: 'right', fontSize: '11px' }}>{isAmadus ? item?.arrival?.iataCode : item?.toAirport?.name}</Typography>
                            <Typography level="body1" sx={{ textAlign: 'right', fontSize: '11px' }}>{isAmadus ? item?.arrival?.iataCode : item?.toAirport?.city}</Typography>
                            <Typography level="body1" sx={{ textAlign: 'right', fontSize: '11px' }}>{isAmadus ? item?.arrival?.iataCode : item?.toAirport?.country}</Typography>

                            <Typography level="title-sm" color="neutral" sx={{ textAlign: 'right', mt:2}}>{isAmadus ? formatDateOrTime(item?.arrival?.at, "date") : item?.arrivalDate}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="h3">{isAmadus ? formatDateOrTime(item?.departure?.at, "time") : item?.departureTime}</Typography>
                        </Box>

                        {/* <Box>
                            <Typography level="title-md">{formatDuration(item?.elapsedTime)}</Typography>
                        </Box> */}

                        <Box>
                            <Typography level="h3" sx={{ textAlign: 'right' }}>{isAmadus ? formatDateOrTime(item?.arrival?.at, "time") : item?.arrivalTime}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Airline</Typography>
                            <Typography level="title-lg">{isAmadus ? item?.carrierCode : item?.airlineName}</Typography>
                        </Box>

                        <Box>

                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Flight Number</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{isAmadus ? item?.carrierCode : item?.airlineCode}-{isAmadus ? item?.number : item?.flightNumber}</Typography>
                        </Box>
                    </Box>


                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Aircraft Type</Typography>
                            <Typography level="title-lg">{isAmadus ? "N/A" : item?.aircraftTypeName ? item?.aircraftTypeName : 'N/A'}</Typography>
                        </Box>

                        <Box>

                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Cabin</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{isAmadus ? item?.co2Emissions?.[0]?.cabin : item?.cabinTypeName ? item?.cabinTypeName : "N/A"}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Terminal</Typography>
                            <Typography level="title-lg">{isAmadus ? item?.arrival?.terminal : item?.departureTerminalName ? item?.departureTerminalName : "N/A"}</Typography>
                        </Box>

                        <Box>

                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Aircraft Code</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{isAmadus ? item?.aircraft?.code : item?.aircraftTypeCode ? item?.aircraftTypeCode : "N/A"}</Typography>
                        </Box>
                    </Box> */}
                </Box>
            )) : (
                <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography level='h1'>No Data Available</Typography>
                </Box>
            )}
        </>
    )
}

const TravelerDetail = ({ travelers, isAmadus }) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 2,
            }}
        >
            {travelers ? travelers.map((traveler, index) => (
                <Card key={index} variant="outlined">
                    <CardContent>
                        <Typography level="title-lg">{isAmadus ? traveler?.name?.firstName : removeLastWord(traveler.givenName)} {isAmadus ? traveler?.name?.lastName : traveler.surname}</Typography>
                        <Chip
                            size="sm"
                            variant="soft"
                            color={traveler?.identityDocuments?.[0]?.gender === 'MALE' || traveler?.gender === "MALE" ? 'primary' : traveler?.identityDocuments?.[0]?.gender === 'FEMALE' || traveler?.gender === "FEMALE" ? 'warning' : 'success'}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            {isAmadus ? traveler?.gender : traveler?.identityDocuments?.[0]?.gender}
                        </Chip>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: 'small' }} />
                                <Typography level="body-sm">
                                    Born: {isAmadus ? traveler?.dateOfBirth : traveler?.identityDocuments?.[0]?.birthDate}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CreditCardIcon sx={{ fontSize: 'small' }} />
                                <Typography level="body-sm">{isAmadus ? traveler?.documents?.[0]?.documentType : traveler?.identityDocuments?.[0]?.documentType}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ fontSize: 'small' }} />
                                <Typography level="body-sm">NO.: {isAmadus ? traveler?.documents?.[0]?.number : traveler?.identityDocuments?.[0]?.documentNumber}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )) : (
                <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography level='h1'>No Data Available</Typography>
                </Box>
            )}
        </Box>
    )
}

export default function ViewBooking({ state, setState, toggleDrawer, api, id }) {

    const [resData, setResData] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const viewFlightDetail = () => {
        setIsLoading(true); // Start loading indicator

        // Make the API call
        viewItinary(id, (api === "amadeus" || api === "amadus") ? "flights" : api)
            .then((res) => {
                if (res?.status === "fail") {
                    // If the response has a status 'fail', handle it accordingly
                    console.error("Error:", res.message);
                    setResData(null);  // Clear previous data or set it as appropriate
                } else {
                    // Handle success case
                    console.log(res?.result);
                    setResData((api === "amadeus" || api === "amadus") ? res?.result?.data : res?.result?.data);  // Set response data
                }
            })
            .catch((error) => {
                // Handle network or other unexpected errors
                console.error("API call failed:", error);
                setResData(null);  // Handle error appropriately
            })
            .finally(() => {
                setIsLoading(false); // Stop loading indicator
            });
    };


    React.useEffect(() => {
        viewFlightDetail()
    }, [])

    return (
        <React.Fragment>
            <Drawer
                // key={anchor}
                anchor="right"
                open={state}
                onClose={toggleDrawer(false)}
                size="lg"
            >
                <Header {...{ setState }} />
                {isLoading ? (
                    <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress
                            color="primary"
                            size="md"
                            value={40}
                        />
                    </Box>
                ) : !resData ? (
                    <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography level='h1'>No Data Available</Typography>
                    </Box>
                ) : (
                    <Tabs aria-label="Basic tabs" defaultValue={0}>
                        <TabList>
                            <Tab>Flight</Tab>
                            <Tab>Traveler</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <FlightTab {...{ flight: resData?.type === "flight-order" ? resData?.flightOffers[0]?.itineraries?.[0]?.segments : resData?.flights, isAmadus: resData?.type === "flight-order" }} />
                        </TabPanel>
                        <TabPanel value={1}>
                            <TravelerDetail {...{ travelers: resData?.travelers, isAmadus: resData?.type === "flight-order" }} />
                        </TabPanel>
                    </Tabs>
                )}
            </Drawer>
        </React.Fragment>
    );
}

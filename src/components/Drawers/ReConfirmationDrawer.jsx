import * as React from 'react';
import { Card, CardContent, Grid, Stack, Typography, Box, Drawer, CircularProgress } from '@mui/joy';
import { removeSeconds } from '../../utils/HelperFunctions';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AppButton from '../common/AppButton';
import FareRules from '../modals/FareRules';
import { issueTicket, issueTicketOffline, modifyPnr } from '../../server/api';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';

const Header = ({ setState }) => {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <Typography level="h1">Re-confirmation</Typography>
                <CloseIcon onClick={() => setState(false)} sx={{ cursor: 'pointer', fontSize: '30px' }} />
            </Box>
        </>
    )
}

const FlightInfo = ({ flight, isReturn, logo, name, index, fareOffers }) => (
    <>
        <Grid container spacing={2} >
            <Grid xs={3} sx={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #CDD7E1' }}>
                {(isReturn || (index !== 0 && index)) ? (
                    <>
                        {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
                        {logo && <img src={logo} width={70} height={70} alt={flight?.airlineName} />}
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography level="body-sm">{flight?.airlineCode}-{flight?.flightNumber}</Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
                        {logo && <img src={logo} width={70} height={70} alt={flight?.airlineName} />}
                        <Box sx={{ marginLeft: '10px' }}>
                            <Typography level="title-lg">{flight?.airlineName}</Typography>
                            <Typography level="body-sm">{flight?.airlineCode}-{flight?.flightNumber}</Typography>
                        </Box>
                    </>
                )}

            </Grid>
            <Grid xs={6}>
                <Box sx={{ position: 'relative', height: 80, display: 'flex', alignItems: 'center' }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <line
                            x1="15%"
                            y1="50%"
                            x2="40%"
                            y2="50%"
                            stroke="#999"
                            strokeWidth="2"
                            strokeDasharray="4,4"  // Makes the line dotted
                        />
                        <line
                            x1="60%"
                            y1="50%"
                            x2="85%"
                            y2="50%"
                            stroke="#999"
                            strokeWidth="2"
                            strokeDasharray="4,4"  // Makes the line dotted
                        />
                    </svg>
                    <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                        <Stack alignItems="center">
                            <Typography level="h4">{removeSeconds(flight?.departureTime)}</Typography>
                            <Typography level="body-xs">{flight?.fromAirportCode}</Typography>
                            <Typography level="body-sm">{flight?.departureDate}</Typography>

                        </Stack>
                        <Stack alignItems="center">
                            {isReturn ? (
                                <>
                                    <AirplanemodeActiveIcon sx={{ transform: 'rotate(270deg)', fontSize: '20px', color: 'goldenrod' }} />
                                    {/* <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography> */}
                                </>
                            ) : (
                                <>
                                    <AirplanemodeActiveIcon sx={{ transform: 'rotate(90deg)', fontSize: '20px', color: 'goldenrod' }} />
                                    {/* <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography> */}
                                </>
                            )}
                        </Stack>
                        <Stack alignItems="center">
                            <Typography level="h4">{removeSeconds(flight?.arrivalTime)}</Typography>
                            {/* <FlightLandIcon /> */}
                            <Typography level="body-xs">{flight?.toAirportCode}</Typography>
                            <Typography level="body-sm">{flight?.arrivalDate}</Typography>

                        </Stack>
                    </Stack>
                </Box>
            </Grid>
            <Grid xs={3} sx={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #CDD7E1', borderBottom: '1px solid #CDD7E1' }}>
                <img src={`${require('../../images/baggage.jpg')}`} width={70} height={120} alt={flight?.airlineName} />
                <Box sx={{ marginLeft: '10px' }}>
                    <Typography level="h4">Baggage Detail</Typography>
                    <Typography level="body-md"><b>CHECK IN:</b> {fareOffers?.[0]?.checkedBaggageAllowance?.totalWeightInKilograms} KG</Typography>
                    {(fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]?.maximumWeightInKilograms || fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]?.maximumWeightInKilograms) && (
                        <Typography level="body-md"><b>CABIN:</b> {fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]?.maximumWeightInKilograms ? fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]?.maximumWeightInKilograms : fareOffers?.[0]?.cabinBaggageAllowance?.totalWeightInKilograms ? fareOffers?.[0]?.cabinBaggageAllowance?.totalWeightInKilograms : 'N/A'} KG</Typography>
                    )}
                </Box>

            </Grid>
        </Grid>


    </>
);

export default function ReConfirmationDrawer({ state, setState, toggleDrawer, flight, travelers }) {

    const loading = useSelector((state) => state.loading.loading);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openModal, setOpenModal] = React.useState(false);
    // const [isLoading, setIsLoading] = React.useState(false);

    const handleModal = (fareRules) => {
        if (fareRules) {
            setOpenModal({ value: true, fareRules })
        } else {
            enqueueSnackbar("Fare Rules not found!", {
                variant: "error",
            });
        }
    }

    console.log("FLIGHT:", flight)

    const handleSubmit = () => {
        dispatch(setLoading(true))
        enqueueSnackbar(`Processing Your Offline PNR Ticket!`, { variant: "info" });
        // const body = {
        //     data: flight,
        //     documentDetails: travelers.map((traveler, index) => ({
        //         number: traveler.documentNo || "",
        //         expiryDate: traveler.passportExpiryDate
        //             ? traveler.passportExpiryDate.toISOString().split("T")[0]
        //             : null,
        //         issuanceCountry: traveler.passportIssuanceCountry,
        //         validityCountry: traveler.passportIssuanceCountry,
        //         nationality: traveler.nationality,
        //         documentType: traveler?.documentType === "National ID" ? "NATIONAL_ID_CARD" : traveler?.documentType?.toUpperCase(),
        //         holder: true,
        //         gender: traveler?.gender?.toUpperCase(),
        //         dateOfBirth: traveler.dob ? traveler.dob.toISOString().split("T")[0] : null
        //     }))
        // }

        // modifyPnr('/sabre', body).then((response) => {
        //     console.log(response);
        //     if (response?.status === 'success') {
        //         setIsLoading(false)
        //         enqueueSnackbar(response?.message, { variant: "success" });
        //         setState(false)
        //         navigate(-1)
        //     } else {
        //         setIsLoading(false)
        //         enqueueSnackbar(response?.message, { variant: "error" });
        //     }
        // }).catch((error) => {
        //     console.log(error);
        //     enqueueSnackbar(`Something went wrong!`, { variant: "error" });
        //     setIsLoading(false)
        // })

        const body = {
            pnr: flight.bookingId,
            travelers: travelers.map((traveler, index) => ({
                number: traveler?.documentNo || "",
                expiryDate: traveler?.passportExpiryDate
                    ? traveler?.passportExpiryDate.toISOString().split("T")[0]
                    : null,
                issuanceCountry: traveler?.passportIssuanceCountry,
                validityCountry: traveler?.passportIssuanceCountry,
                nationality: traveler?.nationality,
                documentType: traveler?.documentType === "National ID" ? "NATIONAL_ID_CARD" : traveler?.documentType?.toUpperCase(),
                holder: true,
                gender: traveler?.gender?.toUpperCase(),
                dateOfBirth: traveler?.dob ? traveler?.dob?.toISOString()?.split("T")?.[0] : null
            })),
            bookingType: "offline",
            flight: flight,
            referenceNumber: flight?.flights?.[0]?.confirmationId,
            totalPrice: flight?.fares?.[0]?.totals?.total
        };

        issueTicketOffline(body, '/sabre').then((response) => {
            console.log(response);
            if (response?.status === 'success') {
                dispatch(setLoading(false))
                enqueueSnackbar(response?.message, { variant: "success" });
                setState(false)
                navigate(-1)
            } else {
                dispatch(setLoading(false))
                enqueueSnackbar(response?.message, { variant: "error" });
            }
        }).catch((error) => {
            console.log(error);
            enqueueSnackbar(error || `Something went wrong!`, { variant: "error" });
            dispatch(setLoading(false))
        })

        console.log(body)
    }

    if (loading) {
        return <CircularProgress color="neutral" size="md" />
    }

    return (
        <React.Fragment>
            <Drawer
                // key={anchor}
                anchor="right"
                open={state}
                onClose={toggleDrawer(false)}
                size="lg"
            >
                <Box sx={{ bgcolor: '#eaeaea', height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <Box>
                        <Header {...{ setState }} />
                        <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', bgcolor: '#fff', borderRadius: '15px', margin: '10px', padding: '10px', marginBottom: '30px' }}>
                            <Box>
                                <Typography level="title-md">Onward</Typography>
                                <Typography level="title-md">{flight?.journeys?.[0]?.departureDate}</Typography>
                            </Box>

                            <Box>
                                {flight?.journeys ? flight?.journeys?.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <Typography level="h3" sx={{ marginRight: '10px' }}>{item?.firstAirportCode}</Typography>
                                        <ArrowForwardIcon sx={{ fontSize: '25px' }} />
                                        <Typography level="h3" sx={{ marginLeft: '10px' }}>{item?.lastAirportCode}</Typography>
                                    </Box>
                                )) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <Typography level="h3" sx={{ marginRight: '10px' }}>N/A</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box>
                                <Typography level="body-lg">{flight?.journeys?.[0]?.numberOfFlights && flight?.journeys?.[0]?.numberOfFlights - 1 ? flight?.journeys?.[0]?.numberOfFlights - 1 : 'No'} Stop</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box>
                                    <Typography level="title-md">CRS PNR</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography level="title-md">{flight?.bookingId}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ marginLeft: '10px' }}>
                                    <Typography level="title-md">Airline PNR</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography level="title-md">{flight?.flights?.[0]?.confirmationId}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Typography level="body-lg" sx={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={() => handleModal(flight?.fareRules)}>Fare Rules</Typography>
                            </Box>
                        </Box>

                        <Card variant="outlined" sx={{
                            // bgcolor: 'neutral.softBg',
                            m: 1,
                            marginBottom: '30px',
                            '&:hover': {
                                boxShadow: 'lg',
                                borderColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
                            },
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                                    <Box sx={{ width: "95%" }}>
                                        {flight?.flights?.map((item, index) => (
                                            <FlightInfo flight={item} isReturn={false} index={index} logo={item?.logo} fareOffers={flight?.fareOffers} />
                                        ))}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card >
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px' }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: "bold",
                                borderTop: "1px solid #ddd",
                                mr: 2,
                            }}
                        >
                            <Typography level="body-md" sx={{ marginRight: '5px' }}>Total:</Typography>
                            <Typography level="body-md">{flight?.payments?.flightTotals?.[0]?.currencyCode} {flight?.payments?.flightTotals?.[0]?.total}</Typography>
                        </Box>
                        <AppButton onClick={() => handleSubmit()} sx={{ mt: 2 }} disabled={loading} text={loading ? "Loading..." : "Confirm"} />
                    </Box>
                </Box>
            </Drawer>

            {openModal?.value && (
                <FareRules {...{ setOpen: setOpenModal, open: openModal?.value, fareRule: openModal?.fareRules }} />
            )}
        </React.Fragment>
    );
}

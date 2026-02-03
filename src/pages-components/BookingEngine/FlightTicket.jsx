import * as React from 'react';
import { Card, CircularProgress, CardContent, Chip, Stack, Typography, IconButton, Divider, Box, Grid, Button, Tooltip, Sheet } from '@mui/joy';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDate, formatDuration, extractTime } from '../../components/utils';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NoMealsIcon from '@mui/icons-material/NoMeals';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import LuggageIcon from '@mui/icons-material/Luggage';
import NoLuggageIcon from '@mui/icons-material/NoLuggage';
import { useSelector } from 'react-redux';
import { getUpselling, revalidateAmadus, revalidateSabre } from '../../server/api';
import { getRevalidateSabreUrl } from '../../utils/HelperFunctions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import FlightDetail from '../../components/Drawers/FlightDetail';
import { useTicketFilterValues } from '../../context/ticketFilterValues';
import WatchLaterIcon from '@mui/icons-material/WatchLater';


const FlightInfo = ({ flight, isReturn, logo, name, index, apiName }) => (
  <>
    <Grid container spacing={2} >
      <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #CDD7E1' }}>
        {(isReturn || (index !== 0 && index)) ? (
          <>
            {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
            <img src={logo} width={70} height={70} alt={name} />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography level="body-sm">{flight?.marketing}-{flight?.marketingFlightNumber}</Typography>
              <Typography level="body-sm">{flight?.marketing === flight?.operatingLogo?.arCode ? "" : "Operated By " + flight?.operatingLogo?.ar}</Typography>
            </Box>
          </>
        ) : (
          <>
            {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
            <img src={logo} width={70} height={70} alt={name} />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography level="title-lg">{name}</Typography>
              <Typography level="body-sm">{flight?.marketing}-{flight?.marketingFlightNumber}</Typography>
              <Typography level="body-sm">{flight?.marketing === flight?.operatingLogo?.arCode ? "" : "Operated By " + flight?.operatingLogo?.ar}</Typography>
            </Box>
          </>
        )}

      </Grid>
      <Grid xs={8}>

        {/* For Sabre as our layover time is coming in second object so we are rendering it on top so it will be between 1st and 2nd object */}
        {(apiName === "sabre") && flight?.layoverTime && (
          <Sheet
            variant="soft"
            color="primary"
            sx={{
              p: 2,
              borderRadius: "md",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <WatchLaterIcon />
            <Typography level="body-md" sx={{ fontWeight: "md" }}>
              {flight?.layoverTime}
            </Typography>
            <Typography level="body-md">layover in {flight.departureLocation}</Typography>
          </Sheet>
        )}

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
              <Typography level="h4">{extractTime(flight?.departureTime)}</Typography>
              <Typography level="body-xs">{flight?.departureLocation}</Typography>
              <Typography level="body-sm">{formatDate(flight?.departureTime)}</Typography>

            </Stack>
            <Stack alignItems="center">
              {isReturn ? (
                <>
                  <AirplanemodeActiveIcon sx={{ transform: 'rotate(270deg)', fontSize: '20px', color: 'goldenrod' }} />
                  <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography>
                </>
              ) : (
                <>
                  <AirplanemodeActiveIcon sx={{ transform: 'rotate(90deg)', fontSize: '20px', color: 'goldenrod' }} />
                  <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography>
                </>
              )}
            </Stack>
            <Stack alignItems="center">
              <Typography level="h4">{extractTime(flight?.arrivalTime)}</Typography>
              {/* <FlightLandIcon /> */}
              <Typography level="body-xs">{flight?.arrivalLocation}</Typography>
              <Typography level="body-sm">{formatDate(flight?.arrivalTime)}</Typography>

            </Stack>
          </Stack>
        </Box>

        {/* For Amadeus as flight layover is coming in first object */}
        {(apiName === "amadus" || apiName === "amadeus") && flight?.layoverTime && (
          <Sheet
            variant="soft"
            color="primary"
            sx={{
              p: 2,
              borderRadius: "md",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <WatchLaterIcon />
            <Typography level="body-md" sx={{ fontWeight: "md" }}>
              {flight?.layoverTime}
            </Typography>
            <Typography level="body-md">layover in {flight.arrivalLocation}</Typography>
          </Sheet>
        )}

      </Grid>
    </Grid>


  </>
);

const FlightInfoMultiCity = ({ flight, isReturn, logo, name, index, api }) => (
  <>
    <Grid container spacing={2} >
      <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #CDD7E1' }}>
        {(isReturn || (index !== 0 && index)) ? (
          <>
            {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
            <img src={logo} width={70} height={70} alt={name} />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography level="body-sm">{flight?.marketing}-{flight?.marketingFlightNumber}</Typography>
            </Box>
          </>
        ) : (
          <>
            {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
            <img src={logo} width={70} height={70} alt={name} />
            <Box sx={{ marginLeft: '10px' }}>
              <Typography level="title-lg">{name}</Typography>
              <Typography level="body-sm">{flight?.marketing}-{flight?.marketingFlightNumber}</Typography>
            </Box>
          </>
        )}

      </Grid>
      <Grid xs={8}>
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
              <Typography level="h4">{(api === "amadus" || api === "amadeus") ? extractTime(flight?.departureTime) : extractTime(flight?.departure?.time)}</Typography>
              <Typography level="body-xs">{(api === "amadus" || api === "amadeus") ? flight?.departureLocation : flight?.departure?.airport}</Typography>
              <Typography level="body-sm">{(api === "amadus" || api === "amadeus") ? formatDate(flight?.departureTime) : formatDate(flight?.departure?.date)}</Typography>

            </Stack>
            <Stack alignItems="center">
              {isReturn ? (
                <>
                  <AirplanemodeActiveIcon sx={{ transform: 'rotate(270deg)', fontSize: '20px', color: 'goldenrod' }} />
                  <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography>
                </>
              ) : (
                <>
                  <AirplanemodeActiveIcon sx={{ transform: 'rotate(90deg)', fontSize: '20px', color: 'goldenrod' }} />
                  <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography>
                </>
              )}
            </Stack>
            <Stack alignItems="center">
              <Typography level="h4">{(api === "amadus" || api === "amadeus") ? extractTime(flight?.arrivalTime) : extractTime(flight?.arrival?.time)}</Typography>
              {/* <FlightLandIcon /> */}
              <Typography level="body-xs">{(api === "amadus" || api === "amadeus") ? flight?.arrivalLocation : flight?.arrival?.airport}</Typography>
              <Typography level="body-sm">{(api === "amadus" || api === "amadeus") ? formatDate(flight?.arrivalTime) : formatDate(flight?.arrival?.date)}</Typography>

            </Stack>
          </Stack>
        </Box>
      </Grid>
    </Grid>


  </>
);


const SingleBrandedFareGrid = ({ item, flight, copyToClipboard, loading, toggleDrawer, handleViewFlightDetails, tripType }) => {
  return (
    <Grid container sx={{ mb: 2, mt: 4, backgroundColor: '#ffffff', alignItems: 'center' }}>
      {/* Brand Name */}
      <Grid item xs={4} sm={4} md={4}>
        <Box sx={{ padding: '20px', height: '100%' }}>
          <Typography level="h4" noWrap variant="plain" sx={{ textTransform: 'uppercase' }}>
            {item?.brandName?.[0]}
          </Typography>
          <Typography level="body-xs" noWrap variant="plain" sx={{ color: 'grey', textTransform: 'uppercase' }}>
            {`(${item?.data?.[0]?.bookingCode})`}
          </Typography>
        </Box>
      </Grid>

      {/* Seat, Refundable, Meal, Baggage */}
      <Grid item xs={4} sm={4} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
          {item?.seats && (
            <Tooltip title="Available Seats" variant="solid">
              <Chip
                color="primary"
                size="sm"
                variant="outlined"
                sx={{ marginLeft: '5px', cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AirlineSeatReclineExtraIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                  <Typography>{item?.seats}</Typography>
                </Box>
              </Chip>
            </Tooltip>
          )}

          {/* {flight.api === 'sabre' && (
            <Tooltip title={!item?.refundable ? 'Refundable' : 'Not Refundable'} variant="solid">
              <Chip
                color={!item?.refundable ? "success" : "danger"}
                size="sm"
                variant="outlined"
                sx={{ marginLeft: '5px', cursor: 'pointer' }}
              >
                <Typography sx={{ color: !item?.refundable ? 'green' : 'red' }}>
                  {!item?.refundable ? 'R' : 'N'}
                </Typography>
              </Chip>
            </Tooltip>
          )} */}

          {item?.meal ? (
            <Tooltip title="Meal Included" variant="solid">
              <RestaurantIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
            </Tooltip>
          ) : (
            <Tooltip title="No Meal Included" variant="solid">
              <NoMealsIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
            </Tooltip>
          )}

          {item?.baggage && item?.baggage?.[0]?.allowanceDetail?.weight !== 0 && (
            <Tooltip title={item?.baggage?.[0]?.allowanceDetail ? `${item?.baggage?.[1]?.allowanceDetail?.pieceCount} PC ${item?.baggage?.[0]?.allowanceDetail?.weight && item?.baggage?.[0]?.allowanceDetail?.unit ? `: ${item?.baggage?.[0]?.allowanceDetail?.weight} ${item?.baggage?.[0]?.allowanceDetail?.unit}` : ''}` : "Baggage Included"} variant="solid">
              <LuggageIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
            </Tooltip>
          )}
        </Box>
      </Grid>

      {/* Flight Details Button */}
      {/* <Grid item xs={2} sm={2} md={2}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDrawer(true, flight?.api, flight?.itineraries, flight?.uuid, item?.data?.[0]?.bookingCode, tripType, item?.totalFare)}>
          <p style={{ color: 'blue', marginRight: "5px" }}>Flight Details</p>
          <RemoveRedEyeIcon sx={{ fontSize: '24px', color: 'blue' }} />
        </Box>
      </Grid> */}

      {/* Total Fare */}
      <Grid item xs={4} sm={4} md={4}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
          <Typography color="neutral" level="title-sm">RS.</Typography>
          <Typography color="neutral" level="h3" noWrap variant="plain">{item?.totalFare}</Typography>
        </Box>
      </Grid>

      {/* Select Button and Copy Icon */}
      {/* <Grid item xs={2} sm={2} md={2}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Box sx={{ mr: 1 }}>
            {loading?.value && loading?.code === item?.data?.[0]?.bookingCode && item?.totalFare === loading?.totalFare ? (
              <Button color="primary" loading={false} variant="solid" sx={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <CircularProgress />
              </Button>
            ) : (
              <IconButton onClick={() => handleViewFlightDetails(flight?.api, flight?.itineraries, flight?.uuid, item?.data?.[0]?.bookingCode, tripType, item?.totalFare, item, flight)} variant="solid" color="primary" sx={{ padding: '10px' }}>

                Select
              </IconButton>
            )}
          </Box>

          <Tooltip title="Copy Itinerary" variant="solid">
            <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(flight, item?.totalFare)} />
          </Tooltip>
        </Box>
      </Grid> */}
    </Grid>
  )
}

export default function FlightTicketCard({ flight, filteredFlightTickets, setFilteredFlightTickets, brandedFare, isReviewTicket, singleBrandedFare }) {
  const [loading, setLoading] = React.useState(false);
  const [isloadingAmadeus, setIsLoadingAmadeus] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const [showAllAmdeus, setShowAllAmdeus] = React.useState(false);
  const [otherBrandedFare, setOtherBrandedFare] = React.useState(null);
  const [state, setState] = React.useState(false);
  const {
    tripType,
    markupPreference,
    markupvalue
  } = useTicketFilterValues()

  const navigate = useNavigate()

  const handleViewMoreClick = () => {
    setShowAll(!showAll);
  };

  const { enqueueSnackbar } = useSnackbar();

  const showLable = useSelector(state => state?.user?.loginUser?.showLable)

  function setNewValidateObj(filteredFlightTickets, setFilteredFlightTickets, revalidateRes, body) {
    const indexOfObject = filteredFlightTickets?.findIndex((obj) => obj.uuid === body.uuid);
    const newObject = { ...revalidateRes?.result?.ticket[0], brandedFare: body?.brandedFare, ...body }

    if (indexOfObject !== -1 && revalidateRes?.status === "success") {
      // Create a new array with the updated object at the found index
      const updatedData = [
        ...filteredFlightTickets.slice(0, indexOfObject),        // Elements before the target index
        newObject,                 // The updated object
        ...filteredFlightTickets.slice(indexOfObject + 1)       // Elements after the target index
      ];

      // Update the state with the new array
      setFilteredFlightTickets(updatedData);
    }
  }

  const handleViewFlightDetails = async (api, body, uuid, code, tripType, totalFare, brandedFare, flight) => {
    let state;
    try {
      setLoading({ value: true, code, totalFare });
      if (api === "amadeus" || api === "amadus") {
        const revalidateRes = await revalidateAmadus({ flightOffers: body, uuid, type: tripType })

        if (revalidateRes?.result) {
          state = revalidateRes;
          setNewValidateObj(filteredFlightTickets, setFilteredFlightTickets, revalidateRes, { ...flight, uuid })
          navigate("/booking", { state: { flight: revalidateRes?.result?.ticket?.[0], tripType } });
          // navigate("/v2/booking", { state: { flight: revalidateRes?.result?.ticket?.[0], tripType } });
        } else {
          enqueueSnackbar("No Ticket Available!", {
            variant: "error",
          });
        }
      } else if (api === "sabre") {
        const body = getRevalidateSabreUrl(flight, code);
        const response = await revalidateSabre({ adult: flight?.extra?.adult?.count || 0, children: flight?.extra?.child?.count || 0, infants: flight?.extra?.infants?.count || 0, OriginDestinationInformation: body, uuid, type: tripType })

        if (response?.result) {
          state = response;
          setNewValidateObj(filteredFlightTickets, setFilteredFlightTickets, response, flight)
          navigate("/booking", { state: { flight: response?.result?.ticket?.[0], tripType, brandedFare: [brandedFare] } });
          // navigate("/v2/booking", { state: { flight: response?.result?.ticket?.[0], tripType, brandedFare: [brandedFare] } });
        } else {
          enqueueSnackbar("No Ticket Available!", {
            variant: "error",
          });
        }
      }
    } catch (error) {
      console.log(error)
      enqueueSnackbar("No Ticket Available!", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const formatFlightData = (flightData, airlineName, fare, apiType, isMultiCity, returnFlightData) => {
    if (isMultiCity) {
      const formattedFlights = flightData.map(dep => {
        // Format the departure and arrival times
        const departureDate = new Date(apiType === "sabre" ? dep.departure?.date : dep.departureTime);
        const arrivalDate = new Date(apiType === "sabre" ? dep.arrival?.date : dep.arrivalTime);

        // Get day, month, year, and time for both departure and arrival
        const departureDay = departureDate.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
        const departureTime = departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const arrivalDay = arrivalDate.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
        const arrivalTime = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Calculate duration (in hours and minutes) from elapsedTime
        const durationMatch = dep.elapsedTime.match(/PT(\d+)H(\d+)M/);
        const hours = durationMatch ? durationMatch[1].padStart(2, '0') : '00';
        const minutes = durationMatch ? durationMatch[2].padStart(2, '0') : '00';
        const duration = `${hours} Hrs ${minutes} Mins`;


        // Format the flight string
        return `
    Flight: ${dep.logo.code} ${dep.marketing} ${dep.marketingFlightNumber}
    From: ${apiType === "sabre" ? dep.departure?.airport : dep.departureLocation} | ${apiType === "sabre" ? dep.departure?.date : departureDay} ${apiType === "sabre" ? extractTime(dep?.departure?.time) : departureTime}
    To: ${apiType === "sabre" ? dep.arrival?.airport : dep.arrivalLocation} | ${apiType === "sabre" ? dep.arrival?.date : arrivalDay} ${apiType === "sabre" ? extractTime(dep?.arrival?.time) : arrivalTime}
    Duration: ${duration}
    Fare: Rs.${fare}`;
      }).join("\n")

      return formattedFlights;
    } else {
      const formattedFlights = flightData.map((dep, index) => {
        // Format the departure and arrival times
        const departureDate = new Date(dep.departureTime);
        const arrivalDate = new Date(dep.arrivalTime);

        // Get day, month, year, and time for both departure and arrival
        const departureDay = departureDate.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
        const departureTime = departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const arrivalDay = arrivalDate.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
        const arrivalTime = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Calculate duration (in hours and minutes) from elapsedTime
        const durationMatch = dep.elapsedTime.match(/PT(\d+)H(\d+)M/);
        const hours = durationMatch ? durationMatch[1].padStart(2, '0') : '00';
        const minutes = durationMatch ? durationMatch[2].padStart(2, '0') : '00';
        const duration = `${hours} Hrs ${minutes} Mins`;


        // Format the flight string
        return `
    Flight: ${(apiType === "amadus" || apiType === "amadeus") && dep?.logo?.ar ? dep?.logo?.ar : airlineName} ${dep.marketing} ${dep.marketingFlightNumber}
    From: ${dep.departureLocation} | ${departureDay} ${departureTime}
    To: ${dep.arrivalLocation} | ${arrivalDay} ${arrivalTime}
    Duration: ${duration}
    ${flightData?.length > 1 && index !== 0 ? `Fare: Rs.${fare}` : flightData?.length === 1 ? `Fare: Rs.${fare}` : ''}`;
      }).join("\n")

      return formattedFlights;
    }
  };

  const copyToClipboard = (flightData, totalFare) => {
    const formattedFlightInfo = formatFlightData(flightData?.flights ? flightData?.flights : flightData?.departure, flightData?.arCode, totalFare ? totalFare : flight?.passengerTotalFare, flightData?.api, flightData?.flights ? true : false)

    let formattedReturnFlightData = "";
    if (flightData?.return) {
      formattedReturnFlightData = formatFlightData(flightData?.flights ? flightData?.flights : flightData?.return, flightData?.arCode, totalFare ? totalFare : flight?.passengerTotalFare, flightData?.api, flightData?.flights ? true : false);
    }

    const newFormattedFlights = formattedFlightInfo + (formattedReturnFlightData ? "\n\nReturn Flights:\n" + formattedReturnFlightData : "");

    navigator.clipboard.writeText(newFormattedFlights)
      .then(() => {
        enqueueSnackbar("Flight data copied to clipboard!", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        enqueueSnackbar("Failed to copy flight data.", {
          variant: "error",
        });
      });
  }

  const toggleDrawer = (open, api, body, uuid, code, tripType, totalFare) => async (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    if (!open) {
      setState(false);
      return;
    }

    let data;
    try {
      setLoading({ value: true, code, totalFare });
      if (api === "amadeus" || api === "amadus") {
        const revalidateRes = await revalidateAmadus({ flightOffers: body, uuid, type: tripType })
        data = revalidateRes;
        setNewValidateObj(filteredFlightTickets, setFilteredFlightTickets, revalidateRes, flight)
      } else if (api === "sabre") {
        const body = getRevalidateSabreUrl(flight, code, tripType);
        const response = await revalidateSabre({ adult: flight?.extra?.adult?.count || 0, children: flight?.extra?.child?.count || 0, infants: flight?.extra?.infants?.count || 0, OriginDestinationInformation: body, uuid, type: tripType })

        data = response;
        setNewValidateObj(filteredFlightTickets, setFilteredFlightTickets, response, flight)
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false);
      if (data?.status !== "fail" && data) {
        setState({ value: open, data: { ...data?.result?.ticket[0], brandedFare: flight?.brandedFare?.find(item => item?.data?.[0]?.bookingCode === code) } });
      } else if (data) {
        enqueueSnackbar(data?.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar('No Ticket Available', {
          variant: "error",
        });
      }
    }
  };

  const handleViewMoreClickAmadus = async (itineraries) => {
    if (showAllAmdeus) {
      setShowAllAmdeus(false)
    } else {
      setIsLoadingAmadeus(true)
      try {
        let body;
        if (markupPreference && markupvalue) {
          body = {
            staffMarkupValue: markupvalue,
            staffMarkupType: markupPreference,
            "upselling": {
              "data": {
                "type": "flight-offers-upselling",
                "flightOffers": [itineraries]
              }
            }
          }
        } else {
          body = {
            "upselling": {
              "data": {
                "type": "flight-offers-upselling",
                "flightOffers": [itineraries]
              }
            }
          }
        }

        const res = await getUpselling(body);
        setOtherBrandedFare(res?.result?.ticket)
        setShowAllAmdeus(true)
        setIsLoadingAmadeus(false)
      } catch (error) {
        console.log(error)
        setIsLoadingAmadeus(false)
      }
    }
  }

  function getPieceCount(data) {
    let pieceCount = 1; // Default value is 1 if not found

    // Loop through the data array to find the first allowance with pieceCount
    for (let item of data) {
      const allowance = item.allowanceDetail;
      if (allowance.pieceCount) {
        pieceCount = allowance.pieceCount; // If pieceCount exists, set it
        break; // Exit loop once the first pieceCount is found
      }
    }

    return pieceCount;
  }

  function formatAllowanceData(data) {
    let baggage = '';  // To store baggage info (weight + unit)
    let cabin = '';    // To store cabin info (piece count)
    let baggageCount = getPieceCount(data);

    // Loop through the data array
    data.forEach((item, index) => {
      const allowance = item.allowanceDetail;

      // Check if the item contains baggage details (weight and unit)
      if (allowance.weight && allowance.unit && index === 0) {
        const weight = allowance.weight;
        const unit = allowance.unit;

        // If pieceCount is provided, show that for baggage
        baggage = `${baggageCount} PC : ${weight} ${unit}`;
      }
    });

    // Return formatted string based on available data
    // if (baggage && cabin) {
    //   return `${baggage}, ${cabin}`;
    // } else 
    if (baggage) {
      return baggage;  // Only baggage
    } else if (cabin) {
      return cabin;  // Only cabin
    }
    return 'Baggage Included';
  }

  return (
    <Card variant="outlined" sx={{
      bgcolor: 'neutral.softBg',
      mb: 2,
      '&:hover': {
        boxShadow: 'lg',
        borderColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
      },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          <Box sx={{ width: "95%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Chip
                variant="soft"
                color={flight?.api === "sabre" ? "success" : "primary"}
                startDecorator={<WorkspacePremiumRoundedIcon />}
                size="md"
                sx={{ visibility: !showLable && 'hidden' }}
              >
                {flight?.api}
              </Chip>
              {/* 
              <Stack direction="row" justifyContent="flex-end" alignItems="center">

                <Tooltip title="Copy Itinerary" variant="solid">
                  <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(flight)} />
                </Tooltip>
              </Stack> */}
            </Stack>

            {Array.isArray(flight.departure) ? (
              <>
                {flight.departure?.map((item, index) => (
                  <FlightInfo flight={item} isReturn={false} logo={item.logo ? item.logo.logo : flight.logo} name={item.logo ? item.logo.ar : flight.arCode} index={index} apiName={flight?.api} />
                ))}
              </>
            ) : flight?.flights ? (
              <>
                {flight.flights?.map((item, index) => (
                  <React.Fragment key={index}>
                    <FlightInfoMultiCity flight={item} isReturn={false} logo={item.logo ? item.logo.logo : flight.logo} name={item.logo ? item.logo.code : flight.arCode} api={flight?.api} />
                  </React.Fragment>
                ))}
              </>
            ) : (
              <FlightInfo flight={flight.departure} isReturn={false} logo={flight.logo} name={flight.arCode} />
            )}

            {Array.isArray(flight.return) ? (
              <>
                {flight.return?.map((item, index) => (
                  <React.Fragment key={index}>
                    {index === 0 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                    <FlightInfo flight={item} isReturn={true} logo={item.logo ? item.logo.logo : flight.logo} name={item.logo ? item.logo.ar : flight.arCode} index={index} apiName={flight?.api} />
                  </React.Fragment>
                ))}
              </>
            ) : flight.return ? (
              <React.Fragment>
                <Divider sx={{ my: 2 }} />
                <FlightInfo flight={flight.return} isReturn={true} logo={flight.logo} name={flight.arCode} />
              </React.Fragment>
            ) : (
              <></>
            )}

            {
              !isReviewTicket && flight?.brandedFare?.slice(0, showAll ? flight?.brandedFare?.length : 2)?.map((item, index) => (
                <Grid key={index} container sx={{ mb: 2, mt: index === 0 && 4, backgroundColor: '#ffffff', alignItems: 'center' }}>
                  {/* Brand Name */}
                  <Grid item xs={2} sm={2} md={3}>
                    <Box sx={{ padding: '20px', height: '100%' }}>
                      <Typography level="h4" noWrap variant="plain" sx={{ textTransform: 'uppercase' }}>
                        {item?.brandName?.[0]}
                      </Typography>
                      <Typography level="body-xs" noWrap variant="plain" sx={{ color: 'grey', textTransform: 'uppercase' }}>
                        {`(${item?.data?.[0]?.bookingCode})`}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Seat, Refundable, Meal, Baggage */}
                  <Grid item xs={2} sm={2} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
                      {item?.seats && (
                        <Tooltip title="Available Seats" variant="solid">
                          <Chip
                            color="primary"
                            size="sm"
                            variant="outlined"
                            sx={{ marginLeft: '5px', cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AirlineSeatReclineExtraIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                              <Typography>{item?.seats}</Typography>
                            </Box>
                          </Chip>
                        </Tooltip>
                      )}

                      {flight.api === 'sabre' && (
                        <Tooltip title={!item?.refundable ? 'Refundable' : 'Not Refundable'} variant="solid">
                          <Chip
                            color={!item?.refundable ? "success" : "danger"}
                            size="sm"
                            variant="outlined"
                            sx={{ marginLeft: '5px', cursor: 'pointer' }}
                          >
                            <Typography sx={{ color: !item?.refundable ? 'green' : 'red' }}>
                              {!item?.refundable ? 'R' : 'N'}
                            </Typography>
                          </Chip>
                        </Tooltip>
                      )}

                      {item?.meal ? (
                        <Tooltip title="Meal Included" variant="solid">
                          <RestaurantIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="No Meal Included" variant="solid">
                          <NoMealsIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Tooltip>
                      )}

                      {item?.baggage && item?.baggage?.[0]?.allowanceDetail?.weight !== 0 && (
                        <Tooltip title={item?.baggage?.[0]?.allowanceDetail ? `${item?.baggage?.[1]?.allowanceDetail?.pieceCount} PC : ${item?.baggage?.[0]?.allowanceDetail?.weight} ${item?.baggage?.[0]?.allowanceDetail?.unit}` : "Baggage Included"} variant="solid">
                          <LuggageIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Tooltip>
                      )}
                    </Box>
                  </Grid>

                  {/* Flight Details Button */}
                  {/* <Grid item xs={2} sm={2} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDrawer(true, flight?.api, flight?.itineraries, flight?.uuid, flight?.brandedFare[index]?.data?.[0]?.bookingCode, tripType, item?.totalFare)}>
                      <p style={{ color: 'blue', marginRight: "5px" }}>Flight Details</p>
                      <RemoveRedEyeIcon sx={{ fontSize: '24px', color: 'blue' }} />
                    </Box>
                  </Grid> */}

                  {/* Total Fare */}
                  <Grid item xs={2} sm={2} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                      <Typography color="neutral" level="title-sm">RS.</Typography>
                      <Typography color="neutral" level="h3" noWrap variant="plain">{item?.totalFare}</Typography>
                    </Box>
                  </Grid>

                  {/* Select Button and Copy Icon */}
                  {/* <Grid item xs={2} sm={2} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ mr: 1 }}>
                        {loading?.value && loading?.code === flight?.brandedFare[index]?.data?.[0]?.bookingCode && item?.totalFare === loading?.totalFare ? (
                          <Button color="primary" loading={false} variant="solid" sx={{ paddingLeft: '30px', paddingRight: '30px' }}>
                            <CircularProgress />
                          </Button>
                        ) : (
                          <IconButton onClick={() => handleViewFlightDetails(flight?.api, flight?.itineraries, flight?.uuid, flight?.brandedFare[index]?.data?.[0]?.bookingCode, tripType, item?.totalFare, flight?.brandedFare[index], flight)} variant="solid" color="primary" sx={{ padding: '10px' }}>

                            Select
                          </IconButton>
                        )}
                      </Box>

                      <Tooltip title="Copy Itinerary" variant="solid">
                        <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(flight, item?.totalFare)} />
                      </Tooltip>
                    </Box>
                  </Grid> */}
                </Grid>
              ))
            }
            {!isReviewTicket && (flight?.api === "amadus" || flight?.api === "amadeus") && flight?.itineraries && !showAllAmdeus && !isReviewTicket && (

              <Grid container sx={{ mb: 2, mt: 4, backgroundColor: '#ffffff', alignItems: 'center' }}>
                {/* Brand Name */}
                <Grid item xs={2} sm={2} md={3}>
                  <Box sx={{ padding: '20px', height: '100%' }}>
                    <Typography
                      level="h4"
                      noWrap
                      variant="plain"
                      sx={{ textTransform: 'uppercase' }}
                    >
                      {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFareLabel ? flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFareLabel : flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin}
                    </Typography>
                    <Typography
                      level="body-xs"
                      noWrap
                      variant="plain"
                      sx={{ color: 'grey', textTransform: 'uppercase' }}
                    >
                      {`(${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class})`}
                    </Typography>
                  </Box>
                </Grid>

                {/* Seat, Refundable, Meal, Baggage */}
                <Grid item xs={2} sm={2} md={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
                    {flight?.itineraries?.numberOfBookableSeats && (
                      <Tooltip title="Available Seats" variant="solid">
                        <Chip
                          color="primary"
                          size="sm"
                          variant="outlined"
                          sx={{ marginLeft: '5px', cursor: 'pointer' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AirlineSeatReclineExtraIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                            <Typography>{flight?.itineraries?.numberOfBookableSeats}</Typography>
                          </Box>
                        </Chip>
                      </Tooltip>
                    )}

                    {(flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags) && (
                      <Tooltip title={flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags ? <Box>
                        <Typography sx={{ color: 'white' }}>
                          Checked : {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight} {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weightUnit}
                        </Typography>
                        {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags?.weight && (
                          <Typography
                            component="span"
                            sx={{ display: 'block', marginTop: '4px', color: 'white' }} // Adding a small gap for better readability
                          >
                            Cabin : {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags?.weight} {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags?.weightUnit}
                          </Typography>
                        )}
                      </Box> : 'Baggage Included'} variant="solid">
                        <LuggageIcon sx={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }} />
                      </Tooltip>
                    )}
                  </Box>
                </Grid>

                {/* Flight Details Button */}
                {/* <Grid item xs={2} sm={2} md={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDrawer(true, flight?.api, flight?.itineraries, flight?.uuid, flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class, tripType, flight?.passengerTotalFare)}>
                    <p style={{ color: 'blue', marginRight: "5px" }}>Flight Details</p>
                    <RemoveRedEyeIcon sx={{ fontSize: '24px', color: 'blue' }} />
                  </Box>
                </Grid> */}

                {/* Total Fare */}
                <Grid item xs={2} sm={2} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Typography
                      color="neutral"
                      level="title-sm"
                    >
                      RS.
                    </Typography>
                    <Typography
                      color="neutral"
                      level="h3"
                      noWrap
                      variant="plain"
                    >
                      {flight?.passengerTotalFare}
                    </Typography>
                  </Box>
                </Grid>

                {/* Select Button and Copy Icon */}
                {/* <Grid item xs={2} sm={2} md={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Box sx={{ mr: 1 }}>
                      {loading?.value && loading?.code === flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class && loading?.totalFare === flight?.passengerTotalFare ? (
                        <Button
                          color="primary"
                          loading={false}
                          variant="solid"
                          sx={{ paddingLeft: '30px', paddingRight: '30px' }}
                        >
                          <CircularProgress />
                        </Button>
                      ) : (
                        <IconButton onClick={() => handleViewFlightDetails(flight?.api, flight?.itineraries, flight?.uuid, flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class, tripType, flight?.passengerTotalFare, flight)} variant="solid" color="primary" sx={{ padding: '10px' }}>
                          Select
                        </IconButton>
                      )}
                    </Box>
                    <Tooltip title="Copy Itinerary" variant="solid">
                      <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(flight)} />
                    </Tooltip>
                  </Box>
                </Grid> */}
              </Grid>
            )}

            {!isReviewTicket && (flight?.api === "amadus" || flight?.api === "amadeus") && otherBrandedFare && showAllAmdeus && otherBrandedFare?.map((item, index) => (
              <Grid key={index} container sx={{ mb: 2, mt: index === 0 && 4, backgroundColor: '#ffffff', alignItems: 'center' }}>
                {/* Brand Name */}
                <Grid item xs={2} sm={2} md={3}>
                  <Box sx={{ padding: '20px', height: '100%' }}>
                    <Typography
                      level="h4"
                      noWrap
                      variant="plain"
                      sx={{ textTransform: 'uppercase' }}
                    >
                      {item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFare ? item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFare : item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin}
                    </Typography>
                    <Typography
                      level="body-xs"
                      noWrap
                      variant="plain"
                      sx={{ color: 'grey', textTransform: 'uppercase' }}
                    >
                      {`(${item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class})`}
                    </Typography>
                  </Box>
                </Grid>

                {/* Seat, Refundable, Meal, Baggage */}
                <Grid item xs={2} sm={2} md={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
                    {item?.itineraries?.numberOfBookableSeats && (
                      <Tooltip title="Available Seats" variant="solid">
                        <Chip
                          color="primary"
                          size="sm"
                          variant="outlined"
                          sx={{ marginLeft: '5px', cursor: 'pointer' }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AirlineSeatReclineExtraIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                            <Typography>{item?.itineraries?.numberOfBookableSeats}</Typography>
                          </Box>
                        </Chip>
                      </Tooltip>
                    )}

                    {(item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags) && (
                      <Tooltip title={item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags ? <Box>
                        <Typography sx={{ color: 'white' }}>
                          Checked : {item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight} {item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weightUnit}
                        </Typography>
                        {item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags?.weight && (
                          <Typography
                            component="span"
                            sx={{ display: 'block', marginTop: '4px', color: 'white' }} // Adding a small gap for better readability
                          >
                            Cabin : {item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags?.weight} {item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags?.weightUnit}
                          </Typography>
                        )}
                      </Box> : 'Baggage Included'} variant="solid">
                        <LuggageIcon sx={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }} />
                      </Tooltip>
                    )}
                  </Box>
                </Grid>

                {/* Flight Details Button */}
                {/* <Grid item xs={2} sm={2} md={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDrawer(true, item?.api, item?.itineraries, flight?.uuid, item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class, tripType, item?.passengerTotalFare)}>
                    <p style={{ color: 'blue', marginRight: "5px" }}>Flight Details</p>
                    <RemoveRedEyeIcon sx={{ fontSize: '24px', color: 'blue' }} />
                  </Box>
                </Grid> */}

                {/* Total Fare */}
                <Grid item xs={2} sm={2} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Typography color="neutral" level="title-sm">RS.</Typography>
                    <Typography color="neutral" level="h3" noWrap variant="plain">{item?.passengerTotalFare}</Typography>
                  </Box>
                </Grid>

                {/* Select Button and Copy Icon */}
                {/* <Grid item xs={2} sm={2} md={2}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Box sx={{ mr: 1 }}>
                      {loading?.value && loading?.code === item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class && loading?.totalFare === item?.passengerTotalFare ? (
                        <Button
                          color="primary"
                          loading={false}
                          variant="solid"
                          sx={{ paddingLeft: '30px', paddingRight: '30px' }}
                        >
                          <CircularProgress />
                        </Button>
                      ) : (
                        <IconButton onClick={() => handleViewFlightDetails(item?.api, item?.itineraries, flight?.uuid, item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class, tripType, item?.passengerTotalFare, item)} variant="solid" color="primary" sx={{ padding: '10px' }}>
                          Select
                        </IconButton>
                      )}
                    </Box>
                    <Tooltip title="Copy Itinerary" variant="solid">
                      <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(item)} />
                    </Tooltip>
                  </Box>
                </Grid> */}
              </Grid>
            ))}

            {!isReviewTicket && (flight?.brandedFare?.length - 2) > 0 && (

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  color="warning"
                  loading={false}
                  onClick={() => handleViewMoreClick()}
                  variant="solid"
                  endDecorator={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {showAll ? 'Show less fare' : `+${flight?.brandedFare?.length - 2} more fare`}
                </Button>
              </Box>
            )}

            {!isReviewTicket && (flight?.api === "amadus" || flight?.api === "amadeus") && flight?.isUpsellOffer && (

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isloadingAmadeus ? (
                  <Button
                    color="warning"
                    loading={false}
                    variant="solid"
                    sx={{ width: '12%' }}
                  >
                    <CircularProgress />
                  </Button>
                ) : (
                  <Button
                    color="warning"
                    loading={false}
                    onClick={() => handleViewMoreClickAmadus(flight?.itineraries)}
                    variant="solid"
                    endDecorator={showAllAmdeus ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {showAllAmdeus ? 'Show less fare' : `View More Fare`}
                  </Button>
                )}
              </Box>
            )}

            {
              !isReviewTicket && brandedFare?.slice(0, showAll ? flight?.brandedFare?.length : 2)?.map((item, index) => (
                <Grid key={index} container sx={{ mb: 2, mt: index === 0 && 4, backgroundColor: '#ffffff', alignItems: 'center' }}>
                  {/* Brand Name */}
                  <Grid item xs={2} sm={2} md={3}>
                    <Box sx={{ padding: '20px', height: '100%' }}>
                      <Typography level="h4" noWrap variant="plain" sx={{ textTransform: 'uppercase' }}>
                        {item?.brandName?.[0]}
                      </Typography>
                      <Typography level="body-xs" noWrap variant="plain" sx={{ color: 'grey', textTransform: 'uppercase' }}>
                        {`(${item?.data?.[0]?.bookingCode})`}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Seat, Refundable, Meal, Baggage */}
                  <Grid item xs={2} sm={2} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
                      {item?.seats && (
                        <Tooltip title="Available Seats" variant="solid">
                          <Chip
                            color="primary"
                            size="sm"
                            variant="outlined"
                            sx={{ marginLeft: '5px', cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AirlineSeatReclineExtraIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                              <Typography>{item?.seats}</Typography>
                            </Box>
                          </Chip>
                        </Tooltip>
                      )}

                      {flight.api === 'sabre' && (
                        <Tooltip title={!item?.refundable ? 'Refundable' : 'Not Refundable'} variant="solid">
                          <Chip
                            color={!item?.refundable ? "success" : "danger"}
                            size="sm"
                            variant="outlined"
                            sx={{ marginLeft: '5px', cursor: 'pointer' }}
                          >
                            <Typography sx={{ color: !item?.refundable ? 'green' : 'red' }}>
                              {!item?.refundable ? 'R' : 'N'}
                            </Typography>
                          </Chip>
                        </Tooltip>
                      )}

                      {item?.meal ? (
                        <Tooltip title="Meal Included" variant="solid">
                          <RestaurantIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="No Meal Included" variant="solid">
                          <NoMealsIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Tooltip>
                      )}

                      {console.log('ITEM:', item?.data[0]?.baggageInformation)}

                      {item?.baggage && (
                        <Tooltip title={item?.data[0]?.baggageInformation?.[0]?.allowanceDetail ? formatAllowanceData(item?.data[0]?.baggageInformation) : 'Baggage Included'} variant="solid">
                          <LuggageIcon sx={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }} />
                        </Tooltip>
                      )}
                    </Box>
                  </Grid>

                  {/* Flight Details Button */}
                  {/* <Grid item xs={2} sm={2} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDrawer(true, flight?.api, flight?.itineraries, flight?.uuid, brandedFare[index]?.data?.[0]?.bookingCode, tripType, item?.totalFare)}>
                      <p style={{ color: 'blue', marginRight: "5px" }}>Flight Details</p>
                      <RemoveRedEyeIcon sx={{ fontSize: '24px', color: 'blue' }} />
                    </Box>
                  </Grid> */}

                  {/* Total Fare */}
                  <Grid item xs={2} sm={2} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                      <Typography color="neutral" level="title-sm">RS.</Typography>
                      <Typography color="neutral" level="h3" noWrap variant="plain">{item?.totalFare}</Typography>
                    </Box>
                  </Grid>

                  {/* Select Button and Copy Icon */}
                  <Grid item xs={2} sm={2} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <Tooltip title="Copy Itinerary" variant="solid">
                        <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(flight, item?.totalFare)} />
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              ))
            }

            {
              (flight?.api === "amadus" || flight?.api === "amadeus") && isReviewTicket && flight?.itineraries &&
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px', mb: 2, mt: 4 }}>
                <Box>
                  <Typography
                    level="h4"
                    noWrap
                    variant="plain"
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFare ? flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.brandedFare : flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin}
                  </Typography>
                  <Typography
                    level="body-xs"
                    noWrap
                    variant="plain"
                    sx={{ color: 'grey', textTransform: 'uppercase' }}
                  >
                    {`(${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class})`}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {flight?.itineraries?.numberOfBookableSeats && (
                    <Tooltip title="Available Seats" variant="solid">
                      <Chip
                        color="primary"
                        size="sm"
                        variant="outlined"
                        sx={{ marginLeft: '5px', cursor: 'pointer' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AirlineSeatReclineExtraIcon sx={{ fontSize: '20px', cursor: 'pointer' }} />
                          <Typography>{flight?.itineraries?.numberOfBookableSeats}</Typography>
                        </Box>
                      </Chip>
                    </Tooltip>
                  )}

                  {(flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags) && (
                    <Tooltip title={flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags ? `${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight} ${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weightUnit} ` : 'Baggage Included'} variant="solid">
                      <LuggageIcon sx={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }} />
                    </Tooltip>
                  )}
                </Box>

                {/* <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={toggleDrawer(true, flight?.api, flight?.itineraries, flight?.uuid, flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class, tripType, flight?.passengerTotalFare)}>
                  <p style={{ color: 'blue', marginRight: "5px" }}>Flight Details</p>
                  <RemoveRedEyeIcon sx={{ fontSize: '24px', color: 'blue' }} />
                </Box> */}

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <Typography
                    color="neutral"
                    level="title-sm"
                  >
                    RS.
                  </Typography>
                  <Typography
                    color="neutral"
                    level="h3"
                    noWrap
                    variant="plain"
                  >
                    {flight?.passengerTotalFare}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Tooltip title="Copy Itinerary" variant="solid">
                    <ContentCopyIcon sx={{ cursor: 'pointer' }} onClick={() => copyToClipboard(flight)} />
                  </Tooltip>
                </Box>
              </Box>
            }

            {
              isReviewTicket && singleBrandedFare && (
                <SingleBrandedFareGrid item={singleBrandedFare} loading={loading} flight={flight} copyToClipboard={copyToClipboard} toggleDrawer={toggleDrawer} handleViewFlightDetails={handleViewFlightDetails} tripType={tripType} />
              )
            }

          </Box>
        </Box>
      </CardContent>
      {state?.value && (
        <FlightDetail {...{ state: state?.value, setState, toggleDrawer, flight: state?.data }} />
      )}
    </Card >
  );
}
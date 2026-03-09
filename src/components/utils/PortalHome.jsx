import { Box, Button, Card, Checkbox, Chip, FormControl, FormLabel, Input, List, ListItem, ListItemDecorator, MenuItem, Modal, Option, Radio, RadioGroup, Select, Sheet, Stack, Textarea, Tooltip, Typography } from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { FormControlLabel } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationDropdown from './LocationDropdown';
import DatePicker from './DatePicker';
import { useNavigate } from 'react-router-dom';
import B2BheaderV2 from './B2BheaderV2';
import { useTicketFilterValues } from '../../context/ticketFilterValues';
import { enqueueSnackbar } from 'notistack';
import { addSearch, deleteRecentSearch, getAllAirlines, getFlightRules, getFlightsData, getRecentSearch, getSabreFlightsData, getSabreFlightsDataMultiCity, multiCityAmedus, searchCityCode } from '../../server/api';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/reducer/loaderSlice';
import Multicity from './Multicity';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Grid, keyframes } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AppTextArea from '../common/AppTextArea';
import { formatDate } from "../../components/utils";
import FlightRulesModal from '../modals/FlightRules';
import FlightTicketCard from '../../pages-components/BookingEngine/FlightTicket';
import AllTicketsPrices from '../../pages-components/BookingEngine/AllTicketsPrices';
import BookingFilters from '../../pages-components/BookingEngine/BookingFilters';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import moment from 'moment';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const DashboardItem = ({ icon, title, color }) => {
  const [props, set] = useSpring(() => ({
    transform: 'scale(1)',
    config: { mass: 1, tension: 300, friction: 15 }
  }));

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <animated.div
        style={props}
        onMouseEnter={() => set({ transform: 'scale(1.05)' })}
        onMouseLeave={() => set({ transform: 'scale(1)' })}
      >
        <Card sx={{
          p: 2,
          width: 160,
          height: 100,
          backdropFilter: 'blur(12px)',
          // backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backgroundColor: "#faf5f9",


          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '5px 8px 20px rgba(80, 85, 153, 0.37)',

          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            background: `linear-gradient(45deg, ${color} 0%,rgb(240, 229, 229) 100%)`,
            width: '200%',
            height: '200%',
            opacity: 0.1,
            animation: `${gradient} 15s ease infinite`,
            transition: '0.5s all'
          }
        }}>
          <Box sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            color: 'white'
          }}>
            <Box sx={{
              animation: `${float} 4s ease-in-out infinite`,
              mb: 3
            }}>
              {React.cloneElement(icon, {
                sx: {
                  fontSize: '3.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }
              })}
            </Box>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {title}
            </Typography>
          </Box>
        </Card>
      </animated.div>
    </Grid>
  );
};

function PortalHome() {
  const options = ["One Way", "Round Trip", "Multi City"];
  const leftButtons = [
    {
      label: "TRAVEL CALENDER", icon: 'calender.png', color: "#f9fbed"
    },
    // {
    //   label: "GROUP BOOKING", icon: 'group.png', color: "#eefefb"
    // },

    {
      label: "IMPORT PNR", icon: 'ticket.png', color: "#eaf3ff"
    },
    {
      label: "FLIGHT BOOKINGS", icon: 'plane.png', color: "#e2ffbda1"
    },
    {
      label: "SALES REPORT", icon: 'increase.png', color: "#eceaff"
    },
    {
      label: "SUPPORT", icon: 'support.png', color: "#faeffc"
    },
  ];

  const {
    setAdultsCount, setChildrenCount, setInfantsCount,
    resetFilters,
    setArrivalCity,
    setDepartureCity,
    setDepartureDate,
    setFlightTickets,
    setMulticityFlights,
    setSelectedArCode,
    adultsCount,
    childrenCount,
    infantsCount,
    flightTickets,
    departureCity,
    arrivalCity,
    departureDate,
    currencyPreference,
    airLinePreference,
    ticketClass,
    ticketCount,
    flightPriceRange,
    flightStops,
    selectedArCode,
    multicityFlights,
    directFlight,
    setDirectFlight,
    nearByAirport,
    setNearByAirport,
    setAirLinePreference,
    resetFiltersState,
    returnDate,
    setReturnDate,
    tripType,
    setTripType,
    onwardClass,
    setOnwardClass,
    returnClass,
    setReturnClass,
    toLocation,
    setToLocation,
    fromLocation,
    setFromLocation,
    departDate,
    setDepartDate,
    setIsAlreadyAdded,
    gdsSelection,
    setGdsSelection,
    selectedAirlines, setSelectedAirlines
  } = useTicketFilterValues()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const adultsRef = useRef()
  const toBoxRef = useRef(null);
  const departRef = useRef(null);
  const returnRef = useRef(null);
  const fromBoxRef = useRef(null);
  const dropdownRef = useRef(null);

  const [routes, setRoutes] = useState([
    ['LHE', 'KHI'],
    ['KHI', 'ISL'],
    ['MCT', 'SYD', 'DXB'],
    ['DXB', 'RYD'],
    ['LHE', 'ISL', 'BUD'],
  ]);

  // For Multi City
  const [flightSegments, setFlightSegments] = useState([
    {
      from: { code: 'LHE', name: 'Lahore' },
      to: { code: 'JED', name: 'King Abdulaziz International' },
      depart: new Date(),
    },
    {
      from: { code: 'JED', name: 'King Abdulaziz International' },
      to: { code: '', name: 'Select a City' },
      depart: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [children, setChildren] = useState(0);
  const [baggage, setBaggage] = useState(false)
  const [showDiv, setShowDiv] = useState(false)
  const [allTickets, setAllTickets] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerms, setSearchTerms] = useState({}); // For Multi City
  const [noticeBoard, setNoticeBoard] = useState(false)
  const [selected, setSelected] = useState("One Way");
  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [tripOption, setTripOption] = useState("One Way");
  const [openFlightRule, setOpenFlightRule] = useState(false)
  const [isAirlinesOpen, setIsAirlinesOpen] = useState(false);
  const [airlineText, setAirlineText] = useState("All Airlines")
  const [airlineList, setAirlineList] = useState([])
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [recentSearchesData, setRecentSearchesData] = useState([])
  const [selectedFlightRules, setSelectedFlightRules] = useState([])
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [filteredFlightTickets, setFilteredFlightTickets] = useState([])
  const [airlines, setAirlines] = useState([])
  const [showAirlinePopover, setShowAirlinePopover] = useState(false);
  const [returnDateDuplicate, setReturnDateDuplicate] = useState(new Date());
  const [activeDropdown, setActiveDropdown] = useState({ type: null, index: null });  // For Multi City

  const fetchAllAirlines = async () => {
    const res = await getAllAirlines();
    setAirlineList(res?.result)
    setSelectedAirlines(res?.result?.map(item => item))
    setAirlines(res?.result)
  }

  const handleFromDropdownToggle = () => {
    setIsFromDropdownOpen(!isFromDropdownOpen);
    setIsToDropdownOpen(false);
  };

  const handleToDropdownToggle = () => {
    setIsToDropdownOpen(!isToDropdownOpen);
    setIsFromDropdownOpen(false);
  };

  const handleLocationSelect = (location, type, segmentIndex) => {
    if (tripType !== "Multi City") {
      if (type === 'from') {
        setFromLocation(location);
      } else {
        setToLocation(location);
      }
    }
  };

  const handleDepartToggle = () => {
    setIsDepartOpen(!isDepartOpen);
    setIsReturnOpen(false);
  };

  const handleReturnToggle = () => {
    setIsReturnOpen(!isReturnOpen);
    setIsDepartOpen(false);
  };

  const getCityLabel = async (inputValue) => {
    const response = await searchCityCode(inputValue);

    if (response) {
      return response?.result?.find(item => item?.id?.toLowerCase() == inputValue.toLowerCase())
    } else {
      return {}
    }
  }

  const formatDateV2 = (dateInput) => {
    if (!dateInput) return '';

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (isNaN(date)) return '';

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month}'${year.toString().slice(-2)}`;
  };

  const formatDayOfWeek = (date) => {
    let dateInput = typeof date === 'string' ? new Date(date) : date;
    return dateInput?.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const addCityLabelsToSearchObj = async (searchObj) => {
    const modifiedMultiCityArray = await Promise.all(
      searchObj?.legs?.map(async (leg) => {
        const sourceLabel = await getCityLabel(leg.source);
        const destinationLabel = await getCityLabel(leg.destination);

        return {
          from: {
            code: leg.source,
            name: sourceLabel?.name
          },
          to: {
            code: leg.destination,
            name: destinationLabel?.name
          },
          depart: new Date(leg.date),
        };
      })
    );

    console.log(modifiedMultiCityArray)
    return modifiedMultiCityArray;
  };

  const handleTripTypeChange = (e) => {
    const selected = e.target.value;
    setSelected(selected);
    setTripType(selected);
    setTripOption(selected);
    setReturnDateDuplicate(new Date());
    setReturnDate(new Date())
  };

  const handleSearchTciket = () => {
    if (tripType == "Multi City") {
      handleSearch()
    } else {
      handleSearch(undefined, undefined, true)
    }
  }

  const handleSearch = (name, selectedDate, isTravelerSame) => {
    // setAirLinePreference(null)
    resetFilters()
    if (tripType === "Multi City") {
      handleMulticitySearch();
    } else {
      handleSingleOrRoundTripSearch(undefined, undefined, name, selectedDate, isTravelerSame);
    }
  };

  const handleAddSearch = async (returnDatePara, selectedDatePara, adultsCountPara, childrenCountPara, infantsCountPara) => {
    let body;
    console.log(returnDatePara)
    if (tripOption === "Round Trip" && returnDatePara) {
      const returnDateFormated = moment(returnDatePara).format('YYYY-MM-DD');

      body = {
        "legs": [
          {
            "source": fromLocation?.code,
            "destination": toLocation?.code,
            "date": formatDate(selectedDatePara ? selectedDatePara : departureDate),
            "returnDate": returnDateFormated,
          },
        ],
        "tripType": tripOption,
        "adult": adultsCountPara,
        "child": childrenCountPara,
        "infant": infantsCountPara
      }
    } else if (tripOption == "Multi City") {
      body = {
        "legs": flightSegments?.map((item) => ({
          "source": item?.from?.code,
          "destination": item?.to?.code,
          "date": formatDate(item?.depart),
        })),
        "tripType": tripOption,
        "adult": adultsCountPara,
        "child": childrenCountPara,
        "infant": infantsCountPara
      }
    } else if (tripOption == "One Way") {
      body = {
        "legs": [
          {
            "source": fromLocation?.code,
            "destination": toLocation?.code,
            "date": formatDate(selectedDatePara ? selectedDatePara : departureDate),
          }
        ],
        "tripType": tripOption,
        "adult": adultsCountPara,
        "child": childrenCountPara,
        "infant": infantsCountPara
      }
    }

    const res = await addSearch(body)
  }

  const filterFlightsWithLowestFare = (flights) => {
    const result = [];
    const arCodeMap = new Map();

    flights.forEach(flight => {
      const existingFlight = arCodeMap.get(flight.arCode);

      if (!existingFlight || parseInt(flight.totalFare) < parseInt(existingFlight.totalFare)) {
        arCodeMap.set(flight.arCode, flight);
      }
    });

    arCodeMap.forEach(flight => {
      result.push(flight);
    });

    return result;
  };

  const handleMulticitySearch = (markupValue, staffMarkupType, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara, searchObj) => {
    if (flightSegments.some(flight => !flight.from || !flight.to || !flight.depart) && searchObj?.length) {
      enqueueSnackbar("Please fill in all required fields for multicity flights.", {
        variant: "error",
      });
      return;
    }

    if (searchObj?.legs?.length) {
      addCityLabelsToSearchObj(searchObj)
        .then(updatedSearchObj => {
          setFlightSegments(updatedSearchObj)
          setMulticityFlights(updatedSearchObj)
        })
        .catch(error => {
          console.error('Error adding city labels:', error);
        });

      setAdults(searchObj?.adult);
      setInfants(searchObj?.infant);
      setChildren(searchObj?.child);
      setTripType(searchObj?.tripType);
      setSelected(searchObj?.tripType);
      setAdultsCount(searchObj?.adult);
      setTripOption(searchObj?.tripType);
      setInfantsCount(searchObj?.infant);
      setChildrenCount(searchObj?.child);
    }

    let lightStops = false;

    if (directFlight && !nearByAirport) {
      lightStops = 0; // If directFlight is true, set flightStops to 1
    } else if ((nearByAirport && !directFlight) || (nearByAirport && directFlight)) {
      lightStops = false; // If nearByAirport is true and directFlight is false, set flightStops to false
    } else if (nearByAirport && flightStops) {
      lightStops = false; // If both nearByAirport and flightStops are true, set flightStops to false
    } else if (directFlight && flightStops) {
      lightStops = flightStops; // If directFlight is true and flightStops exists, show flightStops
    }

    let multicitySearchParams, multicitySearchParamsForAmedus, body, AmedusBody
    // Create the formatted multicity flight search parameters

    if (searchObj?.legs?.length) {
      multicitySearchParams = searchObj.legs.map((flight, index) => ({
        RPH: (index + 1).toString(),
        DepartureDateTime: `${formatDate(flight.date)}T00:00:00`,
        OriginLocation: { LocationCode: flight.source },
        DestinationLocation: { LocationCode: flight.destination }
      }));
    } else {
      multicitySearchParams = flightSegments.map((flight, index) => ({
        RPH: (index + 1).toString(),
        DepartureDateTime: `${formatDate(flight.depart)}T00:00:00`,
        OriginLocation: { LocationCode: flight.from.code },
        DestinationLocation: { LocationCode: flight.to.code }
      }));
    }

    if (searchObj?.legs?.length) {
      multicitySearchParamsForAmedus = searchObj.legs.map((flight, index) => ({
        id: (index + 1).toString(),
        departureDateTimeRange: { date: formatDate(flight.date) },
        originLocationCode: flight.source,
        destinationLocationCode: flight.destination
      }));
    } else {
      multicitySearchParamsForAmedus = flightSegments.map((flight, index) => ({
        id: (index + 1).toString(),
        departureDateTimeRange: { date: formatDate(flight.depart) },
        originLocationCode: flight.from.code,
        destinationLocationCode: flight.to.code
      }));
    }

    console.log("multicitySearchParams:", multicitySearchParams)

    // dispatch(setLoading(true));

    if (searchObj?.legs?.length) {
      body = {
        multicityFlights: multicitySearchParams,
        adultsCount: searchObj?.adult,
        childrenCount: searchObj?.child,
        infantsCount: searchObj?.infant,
        currencyPreference: currencyPreferencePara ? currencyPreferencePara : currencyPreference,
        airLinePreference: airLinePreferencePara ? airLinePreferencePara : airLinePreference,
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: flightStop ? flightStop : false,
        staffMarkupValue: markupValue,
        staffMarkupType
      };
    } else {
      body = {
        multicityFlights: multicitySearchParams,
        adultsCount,
        childrenCount,
        infantsCount,
        currencyPreference: currencyPreferencePara ? currencyPreferencePara : currencyPreference,
        airLinePreference: airLinePreferencePara ? airLinePreferencePara : airLinePreference,
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: lightStops,
        staffMarkupValue: markupValue,
        staffMarkupType
      };
    }

    if (searchObj?.legs?.length) {
      AmedusBody = {
        multicityFlights: multicitySearchParamsForAmedus,
        adultsCount: searchObj?.adult,
        childrenCount: searchObj?.child,
        infantsCount: searchObj?.infant,
        staffMarkupValue: markupValue,
        staffMarkupType,
        flightStops: flightStop ? flightStop : false,
        currencyPreference: currencyPreferencePara ? currencyPreferencePara : currencyPreference,
        airLinePreference: airLinePreferencePara ? airLinePreferencePara : airLinePreference,
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
      }
    } else {
      AmedusBody = {
        multicityFlights: multicitySearchParamsForAmedus,
        adultsCount,
        childrenCount,
        infantsCount,
        staffMarkupValue: markupValue,
        staffMarkupType,
        flightStops: lightStops,
        currencyPreference: currencyPreferencePara ? currencyPreferencePara : currencyPreference,
        airLinePreference: airLinePreferencePara ? airLinePreferencePara : airLinePreference,
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
      }
    }

    setMulticityFlights(flightSegments)
    if (!searchObj?.legs?.length) {
      handleAddSearch(null, null, adultsCount, childrenCount, infantsCount)
    }
    setIsAlreadyAdded(true)
    setAirLinePreference(airlineText === "All Airlines" ? [] : selectedAirlines)
    navigate("/flights")
    // getSabreFlightsDataMultiCity(body)
    //   .then(sabreApiResult => {
    //     const sabreResult = sabreApiResult?.result.ticket || [];
    //     const allTickets = [...sabreResult];
    //     setFlightTickets(allTickets)

    //     const filteredData = filterFlightsWithLowestFare(allTickets) || [];
    //     setAllTickets(filteredData)
    //     setFilteredFlightTickets(allTickets)

    //     if (!isAddSearch && (nearByAirport && !directFlight)) {
    //       
    //     }

    //     if (sabreResult?.length === 0) {
    //       enqueueSnackbar("No flight tickets found for Sabre multicity search. Please wait for other GDS!", {
    //         variant: "info",
    //       });
    //     }

    //     if (sabreResult?.length !== 0) {
    //       dispatch(setLoading(false));

    //       // setShowDiv(true)

    //       // enqueueSnackbar("Successfully loaded all GDS!", {
    //       //   variant: "success",
    //       // });
    //     }

    //     multiCityAmedus(AmedusBody)
    //       .then(apiResult => {
    //         const amedusResult = apiResult?.result.tickets || []
    //         const allTickets = [...sabreResult, ...amedusResult];
    //         setFlightTickets(allTickets)

    //         const filteredData = filterFlightsWithLowestFare(allTickets) || [];
    //         setAllTickets(filteredData)
    //         setFilteredFlightTickets(allTickets)
    //         navigate("/flights")

    //         if (allTickets?.length !== 0) {
    //           dispatch(setLoading(false));

    //           // enqueueSnackbar("Successfully loaded all GDS!", {
    //           //   variant: "success",
    //           // });
    //         }
    //       })
    //       .catch(error => {
    //         console.error("Error fetching multicity flights:", error);
    //         // dispatch(setLoading(false));

    //         // enqueueSnackbar(error?.message || "Failed to fetch multicity flight data. Please try again.", {
    //         //   variant: "error",
    //         // });
    //         dispatch(setLoading(false));
    //       });

    //     if (allTickets?.length === 0) {
    //       enqueueSnackbar("No flight tickets found for Sabre multicity search. Please try different search criteria.", {
    //         variant: "info",
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.error("Error fetching multicity flights:", error);
    //     dispatch(setLoading(false));
    //     enqueueSnackbar(error?.message || "Failed to fetch multicity flight data. Please try again.", {
    //       variant: "error",
    //     });
    //   }).finally(() => {
    //     enqueueSnackbar("Successfully loaded all GDS!", {
    //       variant: "success",
    //     });
    //   })
  };

  const handleSingleOrRoundTripSearch = async (markupValue, staffMarkupType, name, selectedDate, isTravelerSame, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara, searchObj) => {
    if (
      // !(departureCity || searchObj?.legs?.[0]?.source) ||
      // !(arrivalCity || searchObj?.legs?.[0]?.destination) ||
      // !(departureDate || selectedDate || searchObj?.legs?.length) ||
      // (tripOption === "Round Trip" && !(returnDate || selectedDate || searchObj?.legs?.length))

      !(fromLocation || searchObj?.legs?.[0]?.source) ||
      !(toLocation || searchObj?.legs?.[0]?.destination) ||
      !(departDate || selectedDate || searchObj?.legs?.length) ||
      (tripType === "Round Trip" && !(returnDate || selectedDate || searchObj?.legs?.length))
    ) {
      enqueueSnackbar("Please fill in all required fields.", {
        variant: "error",
      });
      return;
    }

    if (adultsCount === 0) {
      enqueueSnackbar("Please select travelers.", {
        variant: "error",
      });
      return;
    }

    let lightStops = false;

    if (directFlight && !nearByAirport) {
      lightStops = 0; // If directFlight is true, set flightStops to 1
    } else if ((nearByAirport && !directFlight) || (nearByAirport && directFlight)) {
      lightStops = false; // If nearByAirport is true and directFlight is false, set flightStops to false
    } else if (nearByAirport && flightStops) {
      lightStops = false; // If both nearByAirport and flightStops are true, set flightStops to false
    } else if (directFlight && flightStops) {
      lightStops = flightStops; // If directFlight is true and flightStops exists, show flightStops
    }

    // If it's a "One Way" trip, set the return date to null
    let finalReturnDate = tripOption === "One Way" ? null : returnDate;

    if (tripOption === "Round Trip") {
      // Validate that the return date is not before the departure date
      if (new Date(selectedDate ? selectedDate : returnDate) < new Date(departureDate)) {
        enqueueSnackbar("Return date cannot be before the departure date.", {
          variant: "error",
        });
        return;
      }
      finalReturnDate = formatDate(selectedDate ? selectedDate : returnDate);
    }

    if (isAddSearch) {
      // dispatch(setLoading(true));
    }

    if (searchObj?.legs?.length) {
      const departureLabel = await getCityLabel(searchObj?.legs?.[0]?.source);
      const arrivalLabel = await getCityLabel(searchObj?.legs?.[0]?.destination)

      setTripType(searchObj?.tripType);
      setTripOption(searchObj?.tripType);
      setDepartureCity({ value: searchObj?.legs?.[0]?.source, label: `${departureLabel?.name} (${departureLabel?.id})` });
      setArrivalCity({ value: searchObj?.legs?.[0]?.destination, label: `${arrivalLabel?.name} (${arrivalLabel?.id})` });
      setFromLocation({ code: searchObj?.legs?.[0]?.source, name: departureLabel?.name })
      setToLocation({ code: searchObj?.legs?.[0]?.destination, name: arrivalLabel?.name })
      setDepartureDate(searchObj?.legs?.[0]?.date ? new Date(searchObj.legs[0].date) : new Date())
      setDepartDate(searchObj?.legs?.[0]?.date ? new Date(searchObj.legs[0].date) : new Date())
      setReturnDateDuplicate(searchObj?.legs?.[0]?.returnDate ? new Date(searchObj.legs[0].returnDate) : null)
      setReturnDate(searchObj?.legs?.[0]?.returnDate ? new Date(searchObj.legs[0].returnDate) : null)
      setInfantsCount(searchObj?.infant);
      setAdultsCount(searchObj?.adult);
      setChildrenCount(searchObj?.child);
      setInfants(searchObj?.infant);
      setAdults(searchObj?.adult);
      setChildren(searchObj?.child);
      setSelected(searchObj?.tripType);
    }

    let searchParams

    if (searchObj?.legs?.length) {
      searchParams = {
        startDate: formatDate(searchObj?.legs?.[0]?.date),
        endDate: searchObj?.legs?.[0]?.returnDate ? formatDate(searchObj?.legs?.[0]?.returnDate) : null,
        arrival: searchObj?.legs?.[0]?.destination,
        departure: searchObj?.legs?.[0]?.source,
        adultsCount: searchObj?.adult,
        childrenCount: searchObj?.child,
        infantsCount: searchObj?.infant,
      };
    } else {
      searchParams = {
        startDate: formatDate(name === "departureDate" ? selectedDate : departureDate),
        endDate: finalReturnDate,
        arrival: toLocation?.code,
        departure: fromLocation?.code,
        adultsCount,
        childrenCount,
        infantsCount,
        currencyPreference: currencyPreferencePara ? currencyPreferencePara : currencyPreference,
        airLinePreference: airlineText === "All Airlines" ? [] : selectedAirlines,
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: lightStops,
        staffMarkupValue: markupValue,
        staffMarkupType,
        travelClass: onwardClass,
        // returnTravelClass: name === "returnDate" && returnClass
      };
    }

    let mergedTickets = [];
    if (!searchObj?.legs?.length) {
      handleAddSearch(tripOption === "Round Trip" ? returnDate : null, name === "departureDate" ? selectedDate : departureDate, adultsCount, childrenCount, infantsCount)
    }
    setAirLinePreference(airlineText === "All Airlines" ? [] : selectedAirlines)
    setIsAlreadyAdded(true)
    navigate("/flights")

    // // Function to handle API responses
    // const handleApiResponse = (apiName, data) => {
    //   if (data && data.result && data.result.ticket) {
    //     mergedTickets = [...mergedTickets, ...data.result.ticket];
    //   }
    // };

    // // Function to handle API errors
    // const handleApiError = (apiName, error) => {
    //   console.error(`Error fetching flights from ${apiName} API:`, error);
    //   // enqueueSnackbar(`Failed to fetch data from ${apiName} API. Please try again.`, {
    //   //   variant: "warning",
    //   // });
    // };

    // getSabreFlightsData(searchParams)
    //   .then(data => handleApiResponse("Sabre", data))
    //   .catch(error => handleApiError("Sabre", error))
    //   .finally(() => {
    //     // Dispatch the merged tickets and set loading to false
    //     setFlightTickets(mergedTickets)
    //     const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
    //     setAllTickets(filteredData)
    //     setFilteredFlightTickets(mergedTickets)
    //     if (isTravelerSame) {
    //       setShowDiv(true);
    //     }

    //     if (!isAddSearch && (nearByAirport && !directFlight)) {
    //       
    //     }


    //     if (mergedTickets?.length !== 0) {
    //       dispatch(setLoading(false));

    //       // if (tripOption === "multiCity") {
    //       //   enqueueSnackbar("Successfully loaded for Sabre. Please wait for other GDS", {
    //       //     variant: "info",
    //       //   });
    //       // }
    //     }

    //     if (searchObj?.legs?.length && mergedTickets?.length) {
    //       dispatch(setLoading(false));
    //       setShowDiv(true);
    //     }

    //     // if (tripOption === "Round Trip") {
    //     //   dispatch(setLoading(false));

    //     //   setShowDiv(true)

    //     //   enqueueSnackbar("Successfully loaded all GDS!", {
    //     //     variant: "success",
    //     //   });
    //     // }

    //     // Comment the following lines of Amadeus API
    //     getFlightsData(searchParams,)
    //       .then(data => handleApiResponse("Amadeus", data))
    //       .catch(error => handleApiError("Amadeus", error))
    //       .finally(() => {
    //         setFlightTickets(mergedTickets)
    //         dispatch(setLoading(false));
    //         const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
    //         setAllTickets(filteredData)
    //         setFilteredFlightTickets(mergedTickets)

    //         navigate("/flights")

    //         if (searchObj?.legs?.length && mergedTickets?.length) {
    //           dispatch(setLoading(false));
    //           setShowDiv(true);
    //         } else if (mergedTickets?.length === 0 && searchObj?.legs?.length) {
    //           dispatch(setLoading(false));
    //           enqueueSnackbar("No Ticket Found!", {
    //             variant: "warning",
    //           });
    //         }

    //         // if (mergedTickets?.length === 0) {
    //         //   enqueueSnackbar("No flight tickets found. Please try different search criteria.", {
    //         //     variant: "info",
    //         //   });
    //         // }
    //         // if (mergedTickets?.length !== 0 && tripOption === "multiCity") {
    //         //   enqueueSnackbar("Successfully loaded all GDS!", {
    //         //     variant: "success",
    //         //   });
    //         // }
    //       });
    //   });
  };

  const handleDateChange = (name, selectedDate) => {
    if (selectedDate === "departureDate") {
      setDepartDate(name)
      setDepartureDate(name)

      if (tripType === "Round Trip") {
        const nextWeek = new Date(name);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setReturnDate(nextWeek);
        setReturnDateDuplicate(nextWeek);
      }
    } else if (selectedDate === "returnDate") {
      setReturnDateDuplicate(name)
      setReturnDate(name)
    }


  };

  // Handle close icon click (Deselect all airlines)
  const handleCloseClick = (e) => {
    e?.stopPropagation();
    setSelectedAirlines([]);
    setAirlineText("Select Airlines")
  };

  // Handle airline selection
  const handleAirlineSelect = () => {
    if (airlineText == "Select Airlines") {
      setIsAirlinesOpen(true)
    }
    else {
      setIsAirlinesOpen(false)
      if (airlineText == "All Airlines") {
        enqueueSnackbar("Please click the × (cross) button to remove this filter.", {
          variant: "info",
        });
      }
    }
  };

  const handleCloseDropdown = () => {
    setSearchQuery('')
    setIsAirlinesOpen(false)
  }

  const handleIndividualAirlineSelect = (e, airlineName) => {
    if (selectedAirlines?.find((item) => item?.arCode === airlineName?.arCode)) {
      setSelectedAirlines(prev => prev.filter(name => name?.arCode !== airlineName?.arCode));
    } else {
      setSelectedAirlines(prev => [...prev, airlineName]);
    }
    setIsAirlinesOpen(false);
  };

  // Handle "All Airlines" checkbox
  const handleAllAirlinesSelect = () => {
    handleCloseDropdown()
    const isAllSelected = selectedAirlines?.length === airlineList?.length;
    setSelectedAirlines(isAllSelected ? [] : airlineList);
    setAirlineText(isAllSelected ? "Select Airlines" : "All Airlines");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter airlines based on search query
  const filteredAirlines = airlineList?.filter(airline =>
    airline.ar?.toLowerCase()?.includes(searchQuery?.trim()?.toLowerCase())
  );

  const handleTicketSelect = ({ flight }) => {

    navigate("/booking", { state: { flight } });
    // navigate("/v2/booking", { state: { flight } });
  };

  const handleBack = () => {
    setShowDiv(false)
    setFlightTickets([])
    setAllTickets([]);
    setFilteredFlightTickets([])
    setDirectFlight(false);
    setNearByAirport(true);
    setReturnDate(new Date());
    setReturnDateDuplicate(new Date());
    setSelected('One Way');
    setTripOption("One Way");
    setTripType('One Way');
  }

  const handleBaggage = () => {
    setBaggage(!baggage)
  }

  const handleRuleClick = async (flightOffers) => {

    const body = {
      flightOffers: flightOffers
    }
    try {
      dispatch(setLoading(true))
      const res = await getFlightRules(body)
      setSelectedFlightRules(res.result)
      setOpenFlightRule(true)
      dispatch(setLoading(false))
    }
    catch (error) {
      dispatch(setLoading(false))
      console.log("error in fetching flight rule", error)

    }
    finally {
      dispatch(setLoading(false))
    }
  }

  const filterFlightsByArCode = (arCode) => {
    // Initialize an array to store the filtered flights
    let filteredFlights = [];

    if (arCode !== selectedArCode) {
      flightTickets.forEach(flight => {
        // If the flight's arCode matches the provided arCode
        if (flight.arCode === arCode) {
          filteredFlights.push(flight);
        }
      });

      setFilteredFlightTickets(filteredFlights)
      setSelectedArCode(arCode)
    } else {
      setFilteredFlightTickets(flightTickets)
      setSelectedArCode(null)
    }
    // // Return the filtered list of flights with the lowest totalFare for the given arCode
    // return filteredFlights;
  };

  const refetchData = (markupValue, staffMarkupType, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara) => {
    if (tripOption === "Multi City") {
      handleMulticitySearch(markupValue, staffMarkupType, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara);

    } else {
      handleSingleOrRoundTripSearch(markupValue, staffMarkupType, null, null, null, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara);
    }
  }

  const getTravelerLabel = () => {
    const labels = [];

    if (adults) {
      labels.push(
        <span key="adults">
          <Typography component="span" fontWeight={700} fontSize="16px" display="inline">
            {adults}
          </Typography>{' '}
          Adult{adults > 1 ? 's' : ''}
        </span>
      );
    }

    if (children) {
      labels.push(
        <span key="children">
          <Typography component="span" fontWeight={700} fontSize="16px" display="inline">
            {children}
          </Typography>{' '}
          Child{children > 1 ? 'ren' : ''}
        </span>
      );
    }

    if (infants) {
      labels.push(
        <span key="infants">
          <Typography component="span" fontWeight={700} fontSize="16px" display="inline">
            {infants}
          </Typography>{' '}
          Infant{infants > 1 ? 's' : ''}
        </span>
      );
    }

    if (labels?.length === 0) return 'Select Traveller';

    return (
      <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        {labels.map((label, i) => (
          <span key={i}>
            {label}
            {i < labels?.length - 1 && ', '}
          </span>
        ))}
      </span>
    );
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSelect = (setter) => (val) => {
    setter(val);
  };

  const renderOptions = (max, value, setter, setterContext) => (
    <Box display="flex" gap={1} mt={1}>
      {[...Array(max + 1)].map((_, i) => (
        <Button
          key={i}
          variant={value === i ? "solid" : "outlined"}
          color="neutral"
          size="sm"
          onClick={() => { setter(i); setterContext(i) }}
        >
          {i}
        </Button>
      ))}
    </Box>
  );

  const fetchGetRecentSearch = async () => {
    try {
      const res = await getRecentSearch()
      setRecentSearchesData(res.result)
    }
    catch (error) {
      console.log("error fetching agency sales data", error)

    }
  }

  const handleRemove = (indexToRemove, id) => {
    deleteRecentSearch(id)
      .then((res) => {
        enqueueSnackbar(res?.message, {
          variant: "success",
        });
        setRoutes((prev) => prev.filter((_, index) => index !== indexToRemove));
        fetchGetRecentSearch()
      })
      .catch((err) => {
        console.error('Failed to delete:', err);
        enqueueSnackbar(err, {
          variant: "error",
        });
      });

  };

  const handleRecentSearch = (recentData) => {
    // setAirLinePreference(null)
    resetFilters();

    if (recentData?.tripType === "Multi City") {
      handleMulticitySearch(undefined, undefined, true, undefined, undefined, undefined, undefined, recentData);
    } else {
      handleSingleOrRoundTripSearch(undefined, undefined, null, null, null, true, undefined, undefined, undefined, undefined, recentData);
    }
  }

  useEffect(() => {
    fetchGetRecentSearch()

    if (!showDiv) {
      resetFiltersState()
      setTripOption('One Way')
    }
  }, [showDiv])

  useEffect(() => {
    setReturnDate(new Date());
    setReturnDateDuplicate(new Date());
    setOnwardClass('Economy');
    setReturnClass('Economy');
    setGdsSelection('Sabre');
    fetchAllAirlines()
  }, [])

  return (
    <Box sx={{ width: '100%', height: "auto", display: "flex", alignContent: "center", flexDirection: "column" }}>
      <B2BheaderV2 />
      <Box sx={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", backgroundColor: "#79717e17" }}>
        <Box sx={{ width: { sm: "95%", md: "90%", lg: "85%" }, height: "auto", mt: 2 }}>
          <Box sx={{ width: "100%", height: "auto", mt: "10px", display: "flex", justifyContent: "space-around", gap: "30px" }}>
            <Box sx={{ width: { sm: "57.5%", md: "57.5%", lg: "55%" }, display: "flex", flexDirection: "column", gap: "5px", mb: showDiv && "25px" }}>
              <Box sx={{
                position: "relative", width: "100%", display: "flex", justifyContent: "center",
                backgroundColor: "white",
                boxShadow: "5px 5px 20px 5px rgb(0,0,0,0.3)",
                borderRadius: "20px",
                height: "auto",
              }}>


                <Box sx={{ display: "flex", flexDirection: "column", height: "auto", width: { xs: "100%", lg: "100%" }, pl: "20px", mb: "10px", backgroundColor: "white", borderRadius: "20px" }}>

                  {!showDiv && (
                    <Box>
                      <Typography sx={{ fontSize: "30px", fontWeight: "500", fontFamily: "Poppins", mb: 0.5 }} >Search Flights</Typography>

                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 1 }}>
                    {options.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: 'success',
                              },
                            }}
                          />
                        }
                        label={option}
                        labelPlacement="end"
                        sx={{
                          m: 0,
                          p: "5px",
                          borderRadius: '20px',
                          bgcolor: selected === option ? '#f7ebf5' : 'transparent',
                          border: '1px solid lightgrey',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',

                        }}
                        checked={selected === option}
                        onChange={handleTripTypeChange}
                        value={option}
                      />
                    ))}
                  </Box>


                  {tripType !== "Multi City" ?
                    (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          bgcolor: 'background.surface',
                          width: "98%",
                          borderRadius: 'sm',
                          minHeight: "120px",
                          maxHeight: "auto",
                          mt: 1
                        }}
                      >
                        <Box sx={{ width: "60%", display: "flex", borderRadius: 'lg', border: "1px solid lightgrey", p: 2, height: "75px", alignItems: "center" }}>
                          {/* FROM Container */}
                          <Box ref={fromBoxRef} sx={{ width: "48%" }} onClick={handleFromDropdownToggle}>
                            <Typography color="text.tertiary" sx={{ mb: 0.5, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                              FROM
                            </Typography>
                            <Typography fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "18px", md: "21px", lg: "24px" } }}>
                              {fromLocation.code}
                            </Typography>
                            <Typography color="text.tertiary" sx={{ fontSize: { sm: "9px", md: "11px", lg: "12px" }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fromLocation.name}
                            </Typography>
                          </Box>

                          {/* Divider */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: "4%", height: "100%", borderRight: "2px solid grey", position: "relative" }}>
                            <Box
                              sx={{
                                position: "absolute",
                                left: "35%",
                                top: "35%",
                                zIndex: 9999,
                                cursor: "pointer",
                                transition: "transform 0.2s ease-in-out",
                                '&:hover': {
                                  transform: "scale(1.3)",
                                },
                                bgcolor: 'background.surface',
                              }}
                              onClick={handleSwapLocations}
                            >
                              <SwapHorizIcon sx={{ height: "30px", width: "30px" }} />
                            </Box>
                          </Box>

                          {/* TO Container */}
                          <Box ref={toBoxRef} sx={{ width: "48%", pl: "20px" }} onClick={handleToDropdownToggle}>
                            <Typography color="text.tertiary" sx={{ mb: 0.5, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                              TO
                            </Typography>
                            <Typography fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "18px", md: "21px", lg: "24px" } }}>
                              {toLocation.code}
                            </Typography>
                            <Typography color="text.tertiary" sx={{ fontSize: { sm: "9px", md: "11px", lg: "12px" }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {toLocation.name}
                            </Typography>
                          </Box>

                          {/* FROM Dropdown */}
                          <LocationDropdown
                            isOpen={isFromDropdownOpen}
                            onClose={() => setIsFromDropdownOpen(false)}
                            onLocationSelect={(location) => handleLocationSelect(location, 'from')}
                            anchorEl={fromBoxRef.current}
                            title="Select Departure Location"
                            initialLocation={fromLocation}
                            type={"from"}


                          />

                          {/* TO Dropdown */}
                          <LocationDropdown
                            isOpen={isToDropdownOpen}
                            onClose={() => setIsToDropdownOpen(false)}
                            onLocationSelect={(location) => handleLocationSelect(location, 'to')}
                            anchorEl={toBoxRef.current}
                            title="Select Destination Location"
                            initialLocation={toLocation}
                            type={"to"}



                          />
                        </Box>


                        <Box sx={{ width: "40%", display: "flex", borderRadius: "lg", border: "1px solid lightgrey", p: 2, height: "75px", alignItems: "center" }}>
                          {/* Depart Section */}
                          <Box ref={departRef} sx={{ width: "50%" }} onClick={handleDepartToggle}>
                            <Typography color="text.tertiary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              {' DEPART'}
                            </Typography>
                            <Typography fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "16px", md: "18px", lg: "22px" } }}>
                              {formatDateV2(departDate)}
                            </Typography>
                            <Typography color="text.tertiary" sx={{ fontSize: { sm: "9px", md: "12px", lg: "14px" } }}>
                              {formatDayOfWeek(departDate)}
                            </Typography>
                          </Box>

                          <Box sx={{ border: "1px solid lightgrey" }} ></Box>

                          {/* Return Section */}
                          <Box ref={returnRef} sx={{ width: "50%", pl: "10px" }} onClick={() => {
                            handleReturnToggle()
                            if (tripType === "One Way") {
                              setTripType("Round Trip")
                              setSelected("Round Trip")
                              setReturnDateDuplicate(new Date(departDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                              setReturnDate(new Date(departDate.getTime() + 7 * 24 * 60 * 60 * 1000))
                            }
                          }}>
                            <Typography color="text.tertiary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {' RETURN'}
                            </Typography>
                            {tripType === "One Way" ? (
                              <Typography fontWeight="500" sx={{ mb: 0.5, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                                Book a round trip
                              </Typography>
                            ) : (
                              <>
                                <Typography fontSize="24px" fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "16px", md: "18px", lg: "22px" } }}>
                                  {formatDateV2(returnDate)}
                                </Typography>
                                <Typography color="text.tertiary" sx={{ fontSize: { sm: "10px", md: "12px", lg: "14px" } }}>
                                  {formatDayOfWeek(returnDate)}
                                </Typography>
                              </>
                            )}
                          </Box>

                          {/* Depart Date Picker */}
                          <DatePicker
                            isOpen={isDepartOpen}
                            onClose={() => setIsDepartOpen(false)}
                            onDateSelect={handleDateChange}
                            selectedDate={departDate}
                            title="Select Departure Date"
                            name="departureDate"
                            openDatePicker={true}
                            minDate={new Date()}
                          />

                          {/* Return Date Picker */}
                          <DatePicker
                            isOpen={isReturnOpen}
                            onClose={() => setIsReturnOpen(false)}
                            onDateSelect={handleDateChange}
                            selectedDate={returnDate}
                            title="Select Return Date"
                            name="returnDate"
                            openDatePicker={true}
                            minDate={departDate}
                          />
                        </Box>
                      </Box>
                    ) :
                    (
                      <>
                        {tripType === 'Multi City' &&
                          <>
                            <Multicity {...{ flightSegments, setFlightSegments, activeDropdown, setActiveDropdown, searchTerms, setSearchTerms, setMulticityFlights }} />
                          </>
                        }
                      </>
                    )}

                  {!showDiv && (
                    <Box>
                      <Box sx={{
                        display: "flex",
                        borderRadius: "15px",
                        border: "1px solid rgb(209, 197, 197)",
                        width: "93.5%",
                        alignItems: "center",
                        height: "2.75rem",
                        mt: tripType === "Multi City" ? "5px" : 0,
                        position: "relative",
                        overflow: "visible"
                      }}>
                        <Typography sx={{ marginRight: "20px", fontSize: { sm: "11px", md: "13px", lg: "14px" }, ml: "10px", whiteSpace: "nowrap" }}>
                          Airline preferences
                        </Typography>

                        <Box sx={{ position: 'relative', display: "flex", flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Main Select Button */}
                            <Typography
                              sx={{
                                borderRadius: "20px",
                                backgroundColor: "#f7ebf5",
                                minWidth: "fit-content",
                                height: "2rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px",
                                px: 2,
                                color: "black",
                                fontSize: "13px",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                              }}
                              onClick={handleAirlineSelect}
                            >
                              {selectedAirlines?.length === 0
                                ? "Select Airlines"
                                : selectedAirlines?.length === airlines?.length
                                  ? "All Airlines"
                                  : `${selectedAirlines?.length} Selected`}
                              {selectedAirlines?.length > 0 && (
                                <CancelIcon
                                  sx={{ color: "#185ea5", fontSize: "16px" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCloseClick(e);
                                  }}
                                />
                              )}
                            </Typography>

                            {/* Show first airline if not all selected */}
                            {selectedAirlines?.length > 0 && selectedAirlines?.length !== airlines?.length && (
                              <Box
                                sx={{ position: "relative" }}
                                onMouseEnter={() => setShowAirlinePopover(true)}
                                onMouseLeave={() => setShowAirlinePopover(false)}
                              >
                                <Typography
                                  sx={{
                                    borderRadius: "20px",
                                    backgroundColor: "#f7ebf5",
                                    height: "2rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "5px",
                                    px: 1.5,
                                    color: "black",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {selectedAirlines[0]?.ar}
                                  <CancelIcon
                                    sx={{ color: '#185ea5', cursor: 'pointer', fontSize: '14px' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedAirlines(selectedAirlines.filter(airline => airline?.arCode !== selectedAirlines[0]?.arCode));
                                    }}
                                  />
                                </Typography>

                                {/* Popover showing all selected airlines */}
                                {showAirlinePopover && selectedAirlines?.length > 1 && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: '35px',
                                      left: '0',
                                      minWidth: '250px',
                                      maxWidth: '350px',
                                      backgroundColor: 'white',
                                      borderRadius: '8px',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                      zIndex: 2000,
                                      p: 2,
                                    }}
                                  >
                                    <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "13px" }}>
                                      Selected Airlines ({selectedAirlines?.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '200px', overflowY: 'auto' }}>
                                      {selectedAirlines.map((airline) => (
                                        <Typography
                                          key={airline.arCode}
                                          sx={{
                                            borderRadius: "15px",
                                            backgroundColor: "#f7ebf5",
                                            height: "1.8rem",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "5px",
                                            px: 1.5,
                                            color: "black",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap"
                                          }}
                                        >
                                          {airline.ar}
                                          <CancelIcon
                                            sx={{ color: '#185ea5', cursor: 'pointer', fontSize: '14px' }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedAirlines(selectedAirlines.filter(a => a?.arCode !== airline?.arCode));
                                            }}
                                          />
                                        </Typography>
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            )}

                            {/* Show "+X more" badge if more than 1 selected */}
                            {selectedAirlines?.length > 1 && selectedAirlines?.length !== airlines?.length && (
                              <Box
                                sx={{ position: "relative" }}
                                onMouseEnter={() => setShowAirlinePopover(true)}
                                onMouseLeave={() => setShowAirlinePopover(false)}
                              >
                                <Typography
                                  sx={{
                                    borderRadius: "20px",
                                    backgroundColor: "#e3f2fd",
                                    height: "2rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    px: 1.5,
                                    color: "#185ea5",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  +{selectedAirlines?.length - 1} more
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Airline Dropdown - Must be direct child of relative positioned parent */}
                          {isAirlinesOpen && (
                            <Box
                              ref={dropdownRef}
                              sx={{
                                position: 'absolute',
                                top: '45px',
                                left: '0',
                                width: '320px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 9999,
                                p: 2,
                              }}
                            >
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>Search Airlines</Typography>
                                <CancelIcon
                                  onClick={handleCloseDropdown}
                                  sx={{ cursor: "pointer", height: "20px", width: "20px", color: "#666" }}
                                />
                              </Box>
                              <Input
                                placeholder="Search Airlines"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                sx={{ mb: 2 }}
                                fullWidth
                              />
                              <List sx={{ maxHeight: "250px", overflowY: "auto" }}>
                                <ListItem sx={{ py: 0.5 }}>
                                  <Checkbox
                                    checked={selectedAirlines?.length === airlines?.length}
                                    onChange={handleAllAirlinesSelect}
                                    sx={{ py: 0 }}
                                  />
                                  <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>All Airlines</Typography>
                                </ListItem>
                                {filteredAirlines.map(airline => (
                                  <ListItem key={airline.arCode} sx={{ py: 0.5 }}>
                                    <Checkbox
                                      checked={!!selectedAirlines?.find((item) => item?.arCode === airline.arCode)}
                                      onChange={(e) => handleIndividualAirlineSelect(e, airline)}
                                      sx={{ py: 0 }}
                                    />
                                    <Typography sx={{ fontSize: "13px" }}>{airline.ar} [{airline.arCode}]</Typography>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </Box>

                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  borderRadius: '50%',
                                  backgroundColor: '#fff0fd',
                                  color: 'black',
                                  padding: '5px',
                                  marginLeft: "5px",
                                },
                                '&.Mui-checked': {
                                  color: 'black',
                                  marginLeft: "5px",
                                },
                              }}
                              defaultChecked
                            />
                          }
                          label={
                            <Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px", fontSize: { sm: "10px", md: "12px", lg: "14px" }, whiteSpace: "nowrap" }}>
                              Low Cost Airlines
                            </Typography>
                          }
                        />
                      </Box>
                      <Box sx={{ display: "flex", borderRadius: "15px", width: "93.5%", marginTop: "10px", backgroundColor: "#f7ebf5", height: "2.75rem", alignItems: "center" }}>

                        {tripType !== "Multi City" &&
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{
                                  '& .MuiSvgIcon-root': {
                                    backgroundColor: '#185ea5',
                                    color: 'white',
                                  },
                                  '&.Mui-checked': {
                                    color: '#185ea5',

                                  },
                                  marginLeft: "20px",

                                }}
                                defaultChecked
                                checked={directFlight}
                                onChange={() => { setDirectFlight(prevState => !prevState) }}

                              />
                            }
                            label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px", fontSize: "14px" }}>Direct Flight</Typography>}
                          />
                        }


                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  backgroundColor: '#185ea5',
                                  color: 'white',

                                },
                                '&.Mui-checked': {
                                  color: '#185ea5',

                                },
                                marginLeft: "20px",


                              }}
                              checked={nearByAirport}
                              onChange={() => { setNearByAirport(prevState => !prevState) }}
                            />
                          }
                          label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px", fontSize: "14px" }}>Nearby Airports</Typography>}
                        />
                      </Box>
                    </Box>)}

                  <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Card sx={{ p: 1, border: "none" }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ gap: 1.5 }}>
                        {/* Traveller Select */}
                        <Box position="relative">
                          <FormControl>

                            <FormLabel sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}> Travellers
                              <Chip sx={{ ml: "5px", fontWeight: 600, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>{parseInt(adults) + parseInt(children) + parseInt(infants)}</Chip>
                            </FormLabel>
                            <Select
                              open={open}
                              onClick={() => {
                                setOpen(!open);
                                setTimeout(() => {
                                  adultsRef.current?.click();
                                }, 0);
                              }}
                              value={` ${adults}  Adult${adults > 1 ? "s" : ""}`}

                              onClose={() => setOpen(false)}
                              placeholder={getTravelerLabel()}
                              size="sm"

                              sx={{
                                textTransform: 'capitalize',
                                border: 'none',
                                boxShadow: 'none',
                                backgroundColor: 'transparent',
                                '&:hover': { backgroundColor: 'transparent' },
                                '&.Mui-focused': { backgroundColor: 'transparent', boxShadow: 'none' },

                              }}
                              indicator={null}
                              endDecorator={<ArrowDropDownIcon />}
                            >

                              <Option value="select" sx={{ position: "relative" }} >
                                <Stack direction="column" onClick={(e) => { e.stopPropagation() }} >
                                  <Typography level="title-sm">Adults</Typography>
                                  {renderOptions(8, adults, setAdults, setAdultsCount)}

                                  <Typography level="title-sm" mt={2}>Children 2–12 Years</Typography>
                                  {renderOptions(9, children, setChildren, setChildrenCount)}

                                  <Typography level="title-sm" mt={2}>Infants 0–23 Months</Typography>
                                  {renderOptions(9, infants, setInfants, setInfantsCount)}
                                </Stack>
                                <Button onClick={() => { setOpen(!open) }} variant='plain' size='sm' style={{ position: "absolute", top: "0px", right: "5px", width: "20px" }}><CloseIcon /></Button>
                              </Option>
                            </Select>
                          </FormControl>
                        </Box>

                        {/*  
          {/* Onward Class Select */}
                        {/* {(tripType === "Round Trip" || tripType === "One Way") && (
                          
                        )} */}

                        <FormControl>
                          <FormLabel sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>Cabin Class  </FormLabel>

                          <Select
                            value={onwardClass}
                            onChange={(e, val) => setOnwardClass(val)}
                            size="sm"
                            placeholder={onwardClass?.charAt(0).toUpperCase() + onwardClass?.slice(1)}
                            sx={{ textTransform: 'capitalize', border: "none", boxShadow: 'none', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' }, '&.Mui-focused': { backgroundColor: 'transparent', boxShadow: 'none' } }}
                            indicator={null}
                            endDecorator={<ArrowDropDownIcon />}
                          >
                            {["Economy", "Premium", "Business", "First"].map((opt) => (
                              <Option key={opt} value={opt} sx={{ p: 1, width: "200px" }}
                              >
                                <ListItemDecorator>
                                  <Radio
                                    checked={onwardClass === opt}
                                    tabIndex={-1}
                                    size="sm"
                                    variant="outlined"
                                  />
                                </ListItemDecorator>
                                {opt}
                              </Option>
                            ))}
                          </Select>
                        </FormControl>

                        {/* Return Class Select (if round trip) */}
                        {/* {tripType === "Round Trip" && (
                          <FormControl>
                            <FormLabel sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>  Return Cabin Class  </FormLabel>
                            <Select
                              value={returnClass}
                              onChange={(e, val) => setReturnClass(val)}
                              size="sm"
                              defaultValue={"First"}
                              sx={{ textTransform: 'capitalize', border: "none", boxShadow: 'none', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' }, '&.Mui-focused': { backgroundColor: 'transparent', boxShadow: 'none', } }}
                              indicator={null}
                              endDecorator={<ArrowDropDownIcon />}
                            >
                              {["Economy", "Premium", "Business", "First"].map((opt) => (
                                <Option key={opt} value={opt} sx={{ p: 1, width: "200px" }}>
                                  <ListItemDecorator>
                                    <Radio
                                      checked={returnClass === opt}
                                      tabIndex={-1}
                                      size="sm"
                                      variant="outlined"
                                    />
                                  </ListItemDecorator>
                                  {opt}
                                </Option>
                              ))}
                            </Select>
                          </FormControl>
                        )} */}

                        {/* GDS Select */}
                        {/* <FormControl>
                          <FormLabel sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}> Select GDS  </FormLabel>
                          <Select
                            value={gdsSelection}
                            onChange={(e, val) => setGdsSelection(val)}
                            size="sm"
                            defaultValue={"Both"}
                            sx={{ textTransform: 'capitalize', border: "none", boxShadow: 'none', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'transparent' }, '&.Mui-focused': { backgroundColor: 'transparent', boxShadow: 'none', } }}
                            indicator={null}
                            endDecorator={<ArrowDropDownIcon />}
                          >
                            {["Sabre", "Amadeus", "Both"].map((opt) => (
                              <Option key={opt} value={opt} sx={{ p: 1, width: "200px" }}>
                                <ListItemDecorator>
                                  <Radio
                                    checked={gdsSelection === opt}
                                    tabIndex={-1}
                                    size="sm"
                                    variant="outlined"
                                  />
                                </ListItemDecorator>
                                {opt}
                              </Option>
                            ))}
                          </Select>
                        </FormControl> */}
                      </Stack>
                    </Card>

                    <Button
                      onClick={handleSearchTciket}
                      sx={{
                        backgroundColor: "#036bb0",
                        color: "white",
                        width: { sm: "90px", md: "120px", lg: "150px" },
                        height: "35px",
                        borderRadius: { sm: "10px", md: "20px", lg: "20px" },
                        border: "none",
                        fontSize: { sm: "10px", md: "14px", lg: "18px" },
                        fontWeight: "400",
                        marginRight: { sm: "10px", md: "15px", lg: "20px" },
                      }}
                    >
                      Search Flight
                    </Button>
                  </Box>
                </Box>
              </Box>


              {/* <ImportPNRv2/> */}

              {
                !showDiv && (
                  <>
                    <marquee style={{ marginTop: "10px", fontWeight: "500", fontSize: "18px" }}>10% discounts on all Emirates flight till 21 April 2025. Contact alsaboor47@gmail.com for more information.</marquee>
                    <Box sx={{ display: "flex", width: "100%", height: "10rem", justifyContent: "space-evenly", alignItems: "center", gap: "20px", mb: "10px" }}>


                      <Box sx={{
                        height: "80%", width: "32%", borderRadius: "10px",
                        backgroundImage: `url("https://live.staticflickr.com/65535/52139118848_feafeab5ee_b.jpg")`
                        , backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",

                      }}>

                      </Box>
                      <Box sx={{
                        height: "80%", width: "32%", borderRadius: "10px",
                        backgroundImage: `url("https://i.haberglobal.com.tr/storage/files/images/2024/06/05/1-vzph.jpg")`
                        , backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}>
                      </Box>
                      <Box sx={{
                        height: "80%", width: "32%", borderRadius: "10px",
                        backgroundImage: `url("https://cdn.al-ain.com/images/2019/10/15/143-105656-passengers-emirates-russia_700x400.png")`
                        , backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",

                      }}>

                      </Box>
                    </Box>
                  </>
                )
              }

            </Box>

            {!showDiv && (
              <>
                <Box sx={{ display: 'flex', width: { sm: "42.5%", md: "42.5%", lg: "45%" }, alignItems: "flex-start", mb: 2 }}>

                  <Box sx={{ width: { sm: "65%", md: "65%", lg: "55%" }, height: "auto", display: "flex", alignItems: "center", flexDirection: "column", gap: "20px" }}>
                    {/* <Box sx={{ display: "flex", alignItems: "center", gap: "10px", height: "30px", }}>
                      <Typography sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" }, fontWeight: "500", fontFamily: "Poppins", color: "#9d4a49" }} >How to use Al-Saboor Portal</Typography>
                      <FlightTakeoffIcon sx={{ width: { sm: "20px", md: "20px", lg: "30px" }, height: { sm: "20px", md: "20px", lg: "30px" } }} />

                    </Box> */}

                    <Box sx={{ width: "100%", height: "auto", display: "flex", gap: "20px", justifyContent: "center", }}>

                      <Box sx={{ width: { xs: "90%", lg: "80%" }, height: "auto", display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>

                        {/* {items.map((item, index) => (
<DashboardItem key={index} {...item} />
))} */}



                        {leftButtons?.map((div, index) => (
                          <Box
                            key={index}
                            onClick={() => {
                              if (index === 0) {
                                navigate("/b2b/travel-calender");
                              } else if (index === 1) {
                                navigate("/b2b/pnr");
                              } else if (index === 2) {
                                navigate("/b2b/flight-booking");
                              } else if (index === 3) {
                                navigate("/b2b/sale-report");
                              } else {
                                alert("Coming soon!");
                                console.log(index);
                              }
                            }}
                            sx={{
                              width: index === leftButtons?.length - 1 ? "100%" : { xs: "45%", lg: "45%" },
                              height: { xs: "auto", lg: "30%" },
                              borderRadius: "15px",
                              color: "#185ea5",
                              backgroundColor: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              gap: "5px",
                              fontFamily: "Expedia Sans",
                              cursor: "pointer",
                              boxShadow: "2px 2px 10px 2px rgb(0, 0, 0, 0.2)",
                              marginBottom: "10px", // optional spacing
                            }}
                          >
                            <img
                              src={require(`../../images/${div.icon}`)}
                              alt={div.label}
                              height="50"
                              width="50"
                            />
                            <Typography
                              sx={{
                                padding: "0px",
                                color: "#185ea5",
                                width: "70%",
                                textAlign: "center",
                                fontSize: { xs: "10px", lg: "14px" },
                              }}
                            >
                              {div.label}
                            </Typography>
                          </Box>
                        ))}




                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "auto", width: "100%", borderRadius: "10px", gap: "5px", cursor: "pointer" }} onClick={() => setNoticeBoard(true)}>
                          <Typography sx={{ fontSize: "16px", fontWeight: "500", fontFamily: "Poppins", color: "#9d4a49" }} >Notice Board</Typography>
                          <AssignmentIcon style={{ width: "30px", height: "30px", color: "#b3b33d" }} />
                        </Box>

                        <Modal
                          open={noticeBoard}
                          onClose={() => setNoticeBoard(false)}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                          }}
                        >
                          <Box
                            sx={{
                              width: { sm: '65vw', md: '70vh', lg: '75vh' },
                              height: { sm: '65vh', md: '70vh', lg: '75vh' },
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: "relative",
                              mx: "auto"
                            }}
                          >
                            <img
                              src={require(`../../images/notice.png`)}
                              alt="Notice Board"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                height: { sm: "70%", md: "70%", lg: "70%" },
                                width: { sm: "50%", md: "52.5%", lg: "55%" },
                                top: { xs: "15%", sm: "18%" },
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            >
                              <Typography
                                sx={{
                                  textAlign: "center",
                                  fontSize: { xs: "12px", sm: "16px", md: "18px", lg: "20px" },
                                  fontWeight: "700"
                                }}
                              >
                                Notice Board
                              </Typography>

                              <AppTextArea
                                sx={{
                                  my: 1,
                                  maxRows: { xs: 8, sm: 12, md: 14, lg: 16 },
                                  fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "15px" },
                                  height: "100%",

                                }}
                                value={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}
                              />

                              <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                  sx={{ my: 1, fontSize: { xs: "12px", sm: "14px" } }}
                                  onClick={() => setNoticeBoard(false)}
                                >
                                  Acknowledge
                                </Button>
                              </Box>
                            </Box>
                          </Box>

                        </Modal>


                      </Box>



                    </Box>

                  </Box>

                  <Box sx={{ width: { sm: "35%", md: "35%", lg: "45%" }, height: "auto", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: "20px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px", height: "30px", }}>
                      <Typography sx={{ fontSize: { sm: "10px", md: "12px", lg: "16px" }, fontWeight: "500", fontFamily: "Poppins", color: "#9d4a49" }} >Recent Searches</Typography>
                      <ScheduleIcon sx={{ width: { sm: "20px", md: "20px", lg: "30px" }, height: { sm: "20px", md: "20px", lg: "30px" } }} />

                    </Box>

                    <Box sx={{ width: "95%", display: "flex", flexDirection: "column", gap: "10px" }}>

                      {recentSearchesData?.map((item, index) => {
                        const legs = item?.legs;
                        if (legs && legs?.length > 1) {
                          const sourcesAndDestinations = `${legs[0].source} - ${legs.map((leg) => leg.destination).join(' - ')}`;
                          const dates = legs.map((leg) => moment(leg.date).format('YYYY-MM-DD')).join(' - ');

                          return (
                            <Box
                              key={index}
                              sx={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: { sm: "4px", md: "6px", lg: "8px" },
                                boxShadow: "5px 5px 5px rgb(206, 199, 219)",
                                cursor: "pointer",
                                height: "100%"

                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 1,
                                  width: "100%",
                                  height: "100%"
                                }}
                                onClick={() => handleRecentSearch(item)}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1, width: "50%", alignItems: "center" }}>
                                  <Typography
                                    sx={{
                                      wordWrap: 'break-word',
                                      whiteSpace: 'normal',
                                      maxWidth: { sm: "80px", md: "100px", lg: "120px" },
                                      overflowWrap: 'break-word',
                                      fontSize: { sm: "8px", md: "10px", lg: "12px" }
                                    }}
                                  >
                                    {legs[0].source}
                                  </Typography>
                                  {legs.map((item, i) => (
                                    <React.Fragment key={i}>
                                      {i !== legs?.length && (
                                        <Typography><ArrowRightAltIcon /></Typography>
                                      )}
                                      <Typography
                                        sx={{
                                          wordWrap: 'break-word',
                                          whiteSpace: 'normal',
                                          maxWidth: { sm: "80px", md: "100px", lg: "120px" },
                                          overflowWrap: 'break-word',
                                          fontSize: { sm: "8px", md: "10px", lg: "12px" }
                                        }}
                                      >
                                        {item?.destination}
                                      </Typography>
                                    </React.Fragment>
                                  ))}
                                </Box>
                                <Box sx={{
                                  width: "50%", height: "auto", display: "flex", alignItems: "center", flexWrap: 'wrap', justifyContent: "center", gap: "2px"
                                }}>

                                  {legs.map((item, i) => (
                                    <React.Fragment key={i}>
                                      <Typography sx={{ fontSize: { sm: "8px", md: "10px", lg: "12px" } }}>
                                        {moment(item?.date).format('YYYY-MM-DD')}
                                      </Typography>
                                      {i !== legs?.length - 1 && (
                                        <Typography><ArrowRightAltIcon /></Typography>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </Box>
                                <IconButton onClick={(e) => { e.stopPropagation(); handleRemove(index, item?._id) }} size="sm" variant="plain">
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          )
                        } else if (legs && legs?.length === 1) {
                          return (
                            <Box
                              key={index}
                              sx={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: { sm: "4px", md: "6px", lg: "8px" },
                                boxShadow: "5px 5px 5px rgb(206, 199, 219)",
                                cursor: "pointer",
                                height: "100%"

                              }}
                              onClick={() => handleRecentSearch(item)}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 1,
                                  width: "100%",
                                  height: "100%"
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1, width: "50%", alignItems: "center" }}>
                                  <Typography
                                    sx={{
                                      wordWrap: 'break-word',
                                      whiteSpace: 'normal',
                                      maxWidth: { sm: "80px", md: "100px", lg: "120px" },
                                      overflowWrap: 'break-word',
                                      fontSize: { sm: "8px", md: "10px", lg: "12px" }
                                    }}
                                  >
                                    {legs[0]?.source}
                                  </Typography>

                                  <Typography><ArrowRightAltIcon /></Typography>

                                  <Typography
                                    sx={{
                                      wordWrap: 'break-word',
                                      whiteSpace: 'normal',
                                      maxWidth: { sm: "80px", md: "100px", lg: "120px" },
                                      overflowWrap: 'break-word',
                                      fontSize: { sm: "8px", md: "10px", lg: "12px" }
                                    }}
                                  >
                                    {legs[0]?.destination}
                                  </Typography>
                                </Box>
                                <Box sx={{
                                  width: "50%", height: "auto", display: "flex", alignItems: "center", flexWrap: 'wrap', justifyContent: "center", gap: "2px"
                                }}>
                                  <Typography sx={{ fontSize: { sm: "8px", md: "10px", lg: "12px" } }}>{moment(legs[0]?.date).format('YYYY-MM-DD')}</Typography>
                                  {legs[0]?.returnDate &&
                                    <Typography><ArrowRightAltIcon /></Typography>
                                  }

                                  {legs[0]?.returnDate && <Typography sx={{ fontSize: { sm: "8px", md: "10px", lg: "12px" } }}>{moment(legs[0]?.returnDate).format('YYYY-MM-DD')}</Typography>}

                                </Box>
                                <IconButton onClick={(e) => { e.stopPropagation(); handleRemove(index, item?._id) }} size="sm" variant="plain">
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          )
                        }
                      })}

                    </Box>


                  </Box>






                </Box>

              </>
            )}
          </Box>
        </Box>

      </Box>

      {!showDiv && (
        <>
          {/* <Box sx={{ width: "100%", height: "4.5rem", backgroundColor: "#036bb0", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            {["Home", "Flight", "Hotel", "Bank Accounts", "Mishandled Baggage Report", "Branches", "Terms & Condition", "Disclaimer", "Privacy Policy", "Support", "Alerts & News", "Term of Use", "Help & FAQs"]?.map((label, index) => (
              <Typography key={index} sx={{ backgroundColor: "transparent", borderRight: "1px solid white", paddingRight: "6px", color: "white", cursor: "pointer", fontSize: { sm: "8px", md: "11px", lg: "14px" } }}>
                {label}
              </Typography>
            ))}

          </Box> */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              height: "4rem",
              backgroundColor: "#036bb0",
            }}
          >
            <Box
              sx={{
                width: "75%",
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                © 2025 <strong><a
                  href="https://innovationhightech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "white", textDecoration: "underline" }}
                >
                  Innovation.Tech
                </a></strong>. All Rights Reserved.
              </Typography>

              <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                Designed & Developed by{" "}
                <a
                  href="https://innovationhightech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "white", textDecoration: "underline" }}
                >
                  Innovation.Tech
                </a>
              </Typography>
            </Box>
          </Box>

        </>
      )}

      <Box sx={{ width: "95%", mt: flightTickets?.length > 0 && showDiv && 2 }}>
        {(flightTickets?.length > 0 && showDiv) && (
          <Box sx={{
            display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 3, mt: 4
          }}>
            <ArrowBackIcon sx={{
              fontSize: '25px', color: 'blue', marginLeft: '10px', cursor: 'pointer'
            }} onClick={() => handleBack()} />
            <Typography level="h4" sx={{
              marginLeft: '5px', color: 'blue', cursor: 'pointer'
            }} onClick={() => handleBack()}>Back</Typography>
          </Box>
        )}

        {flightTickets?.length > 0 && showDiv && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              mt: 5,
              gap: 3,
              // boxShadow: "5px 5px 25px rgb(0,0,0,0.3)"       
            }}
          >
            <BookingFilters refetchData={refetchData} allTickets={allTickets} />

            <Box sx={{ width: "100%" }}>

              {/* <TicketsTopBar /> */}
              <AllTicketsPrices flightTickets={allTickets} filterFlightsByArCode={filterFlightsByArCode} selectedArCode={selectedArCode} />


              {filteredFlightTickets
                .slice()
                .sort((a, b) => a.totalFare - b.totalFare)
                .map((flight) => (
                  <FlightTicketCard
                    key={flight.id}
                    flight={flight}
                    handleTicketSelect={handleTicketSelect}
                    handleBaggage={handleBaggage}
                    baggage={baggage}
                    handleRuleClick={handleRuleClick}
                    filteredFlightTickets={filteredFlightTickets}
                    setFilteredFlightTickets={setFilteredFlightTickets}
                  />
                ))}
            </Box>
          </Box>
        )}


        <FlightRulesModal
          openFlightRule={openFlightRule}
          setOpenFlightRule={setOpenFlightRule}
          selectedFlightRules={selectedFlightRules}
        />
      </Box>
    </Box>
  )
}

export default PortalHome

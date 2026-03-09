import React, { useCallback, useEffect, useState } from 'react'
import B2bHeader from '../../components/utils/b2bHeader'
import { Box, Button, ButtonGroup, Checkbox, FormControl, FormLabel, MenuItem, Option, Radio, Select, Sheet, Stack, Table, Typography } from '@mui/joy'
import FlightIcon from '@mui/icons-material/Flight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FormSelect from '../../components/common/FormSelect';
import { FormControlLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Popover } from 'react-tiny-popover';
import TextHeading from '../../components/common/TextHeading';
import SearchIcon from "@mui/icons-material/Search";
import AppButton from "../../components/common/AppButton";
import { TripOptions } from '../../components/utils/constants';
import AppRadioButtons from '../../components/common/AppRadioButtons';
import SearchSelect from "../../components/common/SearchSelect";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AppDatePicker from '../../components/common/AppDatePicker';
import { getFlightRules, getFlightsData, getSabreFlightsData, getSabreFlightsDataMultiCity, searchCityCode, getFlightSalesData, multiCityAmedus, addSearch, getRecentSearch } from "../../server/api";
import PassengerCount from "../../components/PassengerCount";
import MulticityFlights from '../../pages-components/BookingEngine/MulticityFlights';
import BookingFilters from '../../pages-components/BookingEngine/BookingFilters';
import AllTicketsPrices from '../../pages-components/BookingEngine/AllTicketsPrices';
import FlightTicketCard from '../../pages-components/BookingEngine/FlightTicket';
import CustomTypography from '../../components/common/CustomTyprography';
import FlightRulesModal from '../../components/modals/FlightRules';
import { setLoading } from "../../redux/reducer/loaderSlice";
import { formatDate } from "../../components/utils";
import { useSnackbar } from 'notistack';
import BookingFooter from '../../pages-components/BookingEngine/BookingFooter';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavbarDivData } from '../../utils/DummyData';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';
import { useTicketFilterValues } from '../../context/ticketFilterValues';

const dashboardData = [{
  title: 'Cancelled',
  description: '2',
  src: 'https://www.svgrepo.com/show/426794/cancel.svg'
}, {
  title: 'Booked',
  description: '122',
  src: 'https://www.svgrepo.com/show/404443/air-booking-ticket-tickets-tourism-transportation.svg'
}, {
  title: 'Pending',
  description: '122',
  src: 'https://www.svgrepo.com/show/486094/system-pending-line.svg'
}]

const SearchTicket = () => {
  const {
    setAdultsCount, setChildrenCount, setInfantsCount,
    resetFilters,
    setArrivalCity,
    setDepartureCity,
    setDepartureDate,
    setFlightTickets,
    setMulticityFlights,
    setReturnDate,
    setSelectedArCode,
    setTripType,
    adultsCount,
    childrenCount,
    tripType,
    infantsCount,
    flightTickets,
    departureCity,
    arrivalCity,
    departureDate,
    returnDate,
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
    resetFiltersState
  } = useTicketFilterValues()
  const [activeDiv, setActiveDiv] = useState(0);
  const [activeOption, setActiveOption] = useState(0);
  const [tripOption, setTripOption] = useState("One Way");
  const dispatch = useDispatch();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [openFlightRule, setOpenFlightRule] = useState(false)
  const [selectedFlightRules, setSelectedFlightRules] = useState([])
  const [filteredFlightTickets, setFilteredFlightTickets] = useState([])
  const [flightSalesData, setFlightSalesData] = useState([])
  const [allTickets, setAllTickets] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const [showDiv, setShowDiv] = useState(false)
  const [recentSearchesData, setRecentSearchesData] = useState([])
  const navigate = useNavigate()
  const divs = NavbarDivData
  const handleOpenPassengerCount = () => {
    console.log("object");
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleoffDivs = () => {
    setShowDiv(true)
  }

  const handleTripChange = (event) => {
    console.log(departureCity, "depature")
    console.log(arrivalCity, "arrival")
    console.log(tripType, "type")
    setTripOption(event.target.value);
    setTripType(event.target.value)
    if (event.target.value === "Multi City") {
      setMulticityFlights([{ departureCity: null, arrivalCity: null, departureDate: null }])
    }
  };

  const loadCityOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await searchCityCode(inputValue);
      // ********************* FOR AMEDUS RESPONSE : As amadeus search city is not working so we commenting this code and modify it according to sabre response ***********************
      // return response.result.map((city) => ({
      //   value: city.iataCode,
      //   label: `${city.name} (${city.iataCode})`,
      // }));

      return response.result.map((city) => ({
        value: city.id,
        label: `${city.name} (${city.id})`,
      }));

    } catch (error) {
      console.error("Error fetching city options:", error);
      return [];
    }
  }, []);

  const getCityLabel = async (inputValue) => {
    const response = await searchCityCode(inputValue);

    if (response) {
      return response?.result?.find(item => item?.id?.toLowerCase() == inputValue.toLowerCase())
    } else {
      return {}
    }
  }

  const handleCityChange = (selectedOption, name) => {
    if (name === "departure") {
      setDepartureCity(selectedOption)
    } else if (name === "arrival") {
      setArrivalCity(selectedOption)
    }
  };


  const handleSearch = (name, selectedDate, isTravelerSame) => {
    setAirLinePreference(null)
    resetFilters()
    if (tripOption === "Multi City") {
      handleMulticitySearch();
    } else {
      handleSingleOrRoundTripSearch(undefined, undefined, name, selectedDate, isTravelerSame);
    }
  };

  const handleRecentSearch = (recentData) => {
    setAirLinePreference(null)
    resetFilters();

    if (recentData?.tripType === "Multi City") {
      handleMulticitySearch(undefined, undefined, true, undefined, undefined, undefined, undefined, recentData);
    } else {
      handleSingleOrRoundTripSearch(undefined, undefined, null, null, null, true, undefined, undefined, undefined, undefined, recentData);
    }
  }

  const handleDateChange = (name, selectedDate) => {
    if (selectedDate === "departureDate") {
      setDepartureDate(name)
      if (tripOption === "One Way" && !showDiv) {
        handleSearch(selectedDate, name)
      }
    } else if (selectedDate === "returnDate") {
      setReturnDate(name)
      if (tripOption === "Round Trip" && !showDiv) {
        handleSearch(selectedDate, name)
      }
    }


  };

  const addCityLabelsToSearchObj = async (searchObj) => {
    let modifiedMultiCityArray = [];

    // Use map to create an array of promises
    await Promise.all(
      searchObj?.legs?.map(async (leg) => {
        // Fetch the source and destination labels asynchronously
        const sourceLabel = await getCityLabel(leg.source);
        const destinationLabel = await getCityLabel(leg.destination);

        // Push the modified object to the modifiedMultiCityArray
        modifiedMultiCityArray.push({
          departureCity: {
            value: leg.source,
            label: `${sourceLabel?.name} (${sourceLabel?.id})` // Assuming sourceLabel contains name and id
          },
          arrivalCity: {
            value: leg.destination,
            label: `${destinationLabel?.name} (${destinationLabel?.id})` // Assuming destinationLabel contains name and id
          },
          departureDate: new Date(leg.date), // Ensure departureDate is in the correct format
        });
      })
    );

    return modifiedMultiCityArray;
  };



  const handleMulticitySearch = (markupValue, staffMarkupType, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara, searchObj) => {
    if (multicityFlights.some(flight => !flight.departureCity || !flight.arrivalCity || !flight.departureDate) && searchObj?.length) {
      enqueueSnackbar("Please fill in all required fields for multicity flights.", {
        variant: "error",
      });
      return;
    }

    if (searchObj?.legs?.length) {
      addCityLabelsToSearchObj(searchObj)
        .then(updatedSearchObj => {
          setMulticityFlights(updatedSearchObj)
        })
        .catch(error => {
          console.error('Error adding city labels:', error);
        });

      setTripType(searchObj?.tripType);
      setTripOption(searchObj?.tripType);
      setInfantsCount(searchObj?.infant);
      setAdultsCount(searchObj?.adult);
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



    console.log('multicityFlights:', multicityFlights)

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
      multicitySearchParams = multicityFlights.map((flight, index) => ({
        RPH: (index + 1).toString(),
        DepartureDateTime: `${formatDate(flight.departureDate)}T00:00:00`,
        OriginLocation: { LocationCode: flight.departureCity.value },
        DestinationLocation: { LocationCode: flight.arrivalCity.value }
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
      multicitySearchParamsForAmedus = multicityFlights.map((flight, index) => ({
        id: (index + 1).toString(),
        departureDateTimeRange: { date: formatDate(flight.departureDate) },
        originLocationCode: flight.departureCity.value,
        destinationLocationCode: flight.arrivalCity.value
      }));
    }

    dispatch(setLoading(true));

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

    getSabreFlightsDataMultiCity(body)
      .then(sabreApiResult => {
        const sabreResult = sabreApiResult?.result.ticket || [];
        const allTickets = [...sabreResult];
        setFlightTickets(allTickets)
        if (!isAddSearch && (nearByAirport && !directFlight)) {
          handleAddSearch(null, null, adultsCount, childrenCount, infantsCount)
        }

        if (sabreResult.length === 0) {
          enqueueSnackbar("No flight tickets found for Sabre multicity search. Please wait for other GDS!", {
            variant: "info",
          });
        }

        if (sabreResult.length !== 0) {
          dispatch(setLoading(false));

          setShowDiv(true)

          enqueueSnackbar("Successfully loaded all GDS!", {
            variant: "success",
          });
        }

        // multiCityAmedus(AmedusBody)
        //   .then(apiResult => {
        //     console.log('apiResult:', apiResult)
        //     const amedusResult = apiResult?.result.tickets || []
        //     const allTickets = [...sabreResult, ...amedusResult];
        //     setFlightTickets(allTickets)

        //     if (allTickets?.length !== 0) {
        //       dispatch(setLoading(false));

        //       enqueueSnackbar("Successfully loaded all GDS!", {
        //         variant: "success",
        //       });
        //     }
        //   })
        //   .catch(error => {
        //     console.error("Error fetching multicity flights:", error);
        //     // dispatch(setLoading(false));
        //     enqueueSnackbar(error?.message || "Failed to fetch multicity flight data. Please try again.", {
        //       variant: "error",
        //     });
        //     dispatch(setLoading(false));
        //   });

        if (allTickets.length === 0) {
          enqueueSnackbar("No flight tickets found for Sabre multicity search. Please try different search criteria.", {
            variant: "info",
          });
        }
      })
      .catch(error => {
        console.error("Error fetching multicity flights:", error);
        dispatch(setLoading(false));
        enqueueSnackbar(error?.message || "Failed to fetch multicity flight data. Please try again.", {
          variant: "error",
        });
      });
  };

  const handleSingleOrRoundTripSearch = async (markupValue, staffMarkupType, name, selectedDate, isTravelerSame, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara, searchObj) => {
    if (
      !(departureCity || searchObj?.legs?.[0]?.source) ||
      !(arrivalCity || searchObj?.legs?.[0]?.destination) ||
      !(departureDate || selectedDate || searchObj?.legs?.length) ||
      (tripOption === "Round Trip" && !(returnDate || selectedDate || searchObj?.legs?.length))
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
      dispatch(setLoading(true));
    }

    if (searchObj?.legs?.length) {
      const departureLabel = await getCityLabel(searchObj?.legs?.[0]?.source);
      const arrivalLabel = await getCityLabel(searchObj?.legs?.[0]?.destination)
      setTripType(searchObj?.tripType);
      setTripOption(searchObj?.tripType);
      setDepartureCity({ value: searchObj?.legs?.[0]?.source, label: `${departureLabel?.name} (${departureLabel?.id})` });
      setArrivalCity({ value: searchObj?.legs?.[0]?.destination, label: `${arrivalLabel?.name} (${arrivalLabel?.id})` });
      setDepartureDate(searchObj?.legs?.[0]?.date)
      setReturnDate(searchObj?.legs?.[0]?.returnDate)
      setInfantsCount(searchObj?.infant);
      setAdultsCount(searchObj?.adult);
      setChildrenCount(searchObj?.child);
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
        arrival: arrivalCity?.value,
        departure: departureCity?.value,
        adultsCount,
        childrenCount,
        infantsCount,
        currencyPreference: currencyPreferencePara ? currencyPreferencePara : currencyPreference,
        airLinePreference: airLinePreferencePara,
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: lightStops,
        staffMarkupValue: markupValue,
        staffMarkupType
      };
    }

    let mergedTickets = [];

    // Function to handle API responses
    const handleApiResponse = (apiName, data) => {
      if (data && data.result && data.result.ticket) {
        mergedTickets = [...mergedTickets, ...data.result.ticket];
      }
    };

    // Function to handle API errors
    const handleApiError = (apiName, error) => {
      console.error(`Error fetching flights from ${apiName} API:`, error);
      enqueueSnackbar(`Failed to fetch data from ${apiName} API. Please try again.`, {
        variant: "warning",
      });
    };

    getSabreFlightsData(searchParams)
      .then(data => handleApiResponse("Sabre", data))
      .catch(error => handleApiError("Sabre", error))
      .finally(() => {
        // Dispatch the merged tickets and set loading to false
        setFlightTickets(mergedTickets)
        const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
        setAllTickets(filteredData)
        setFilteredFlightTickets(mergedTickets)
        if (isTravelerSame) {
          setShowDiv(true);
        }

        if (!isAddSearch && (nearByAirport && !directFlight)) {
          handleAddSearch(name === "returnDate" ? selectedDate : null, name === "departureDate" ? selectedDate : departureDate, adultsCount, childrenCount, infantsCount)
        }


        if (mergedTickets.length !== 0) {
          dispatch(setLoading(false));

          // if (tripOption === "multiCity") {
          //   enqueueSnackbar("Successfully loaded for Sabre. Please wait for other GDS", {
          //     variant: "info",
          //   });
          // }
        }

        if (searchObj?.legs?.length && mergedTickets.length) {
          dispatch(setLoading(false));
          setShowDiv(true);
        }

        // if (tripOption === "Round Trip") {
        //   dispatch(setLoading(false));

        //   setShowDiv(true)

        //   enqueueSnackbar("Successfully loaded all GDS!", {
        //     variant: "success",
        //   });
        // }

        // Comment the following lines of Amadeus API
        // getFlightsData(searchParams,)
        //   .then(data => handleApiResponse("Amadeus", data))
        //   .catch(error => handleApiError("Amadeus", error))
        //   .finally(() => {
        //     setFlightTickets(mergedTickets)
        //     dispatch(setLoading(false));
        //     const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
        //     setAllTickets(filteredData)
        //     setFilteredFlightTickets(mergedTickets)

        //     if (searchObj?.legs?.length && mergedTickets.length) {
        //       dispatch(setLoading(false));
        //       setShowDiv(true);
        //     } else if (mergedTickets.length === 0 && searchObj?.legs?.length) {
        //       dispatch(setLoading(false));
        //       enqueueSnackbar("No Ticket Found!", {
        //         variant: "warning",
        //       });
        //     }

        //     // if (mergedTickets.length === 0) {
        //     //   enqueueSnackbar("No flight tickets found. Please try different search criteria.", {
        //     //     variant: "info",
        //     //   });
        //     // }
        //     // if (mergedTickets.length !== 0 && tripOption === "multiCity") {
        //     //   enqueueSnackbar("Successfully loaded all GDS!", {
        //     //     variant: "success",
        //     //   });
        //     // }
        //   });
      });
  };


  const refetchData = (markupValue, staffMarkupType, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara) => {
    if (tripOption === "Multi City") {
      handleMulticitySearch(markupValue, staffMarkupType, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara);

    } else {
      handleSingleOrRoundTripSearch(markupValue, staffMarkupType, null, null, null, isAddSearch, flightStop, ticketClassPara, airLinePreferencePara, currencyPreferencePara);
    }
  }

  const handleTicketSelect = ({ flight }) => {

    navigate("/booking", { state: { flight } });
    // navigate("/v2/booking", { state: { flight } });
  };
  const [baggage, setBaggage] = useState(false)

  const fetchGetRecentSearch = async () => {
    try {
      const res = await getRecentSearch()
      setRecentSearchesData(res.result)

    }
    catch (error) {
      console.log("error fetching agency sales data", error)

    }
  }

  const fetchFlightSalesData = async () => {

    dispatch(setLoading(true))
    try {
      const res = await getFlightSalesData()
      setFlightSalesData(res.result)
      setFlightSalesAnalyticsData(res.result?.map((data) => ({ name: data.airline || 'N/A', value: data.totalSales })))
      dispatch(setLoading(false))

    }
    catch (error) {
      console.log("error fetching agency sales data", error)
      dispatch(setLoading(false))

    }
    finally {
      dispatch(setLoading(false))
    }

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

  const filterFlightsByArCodeRefetch = (arCode, data) => {
    // Initialize an array to store the filtered flights
    let filteredFlights = [];

    data.forEach(flight => {
      // If the flight's arCode matches the provided arCode
      if (flight.arCode === arCode) {
        filteredFlights.push(flight);
      }
    });

    setFilteredFlightTickets(filteredFlights)
  };

  const handleBack = () => {
    setShowDiv(false)
    setFlightTickets([])
    setAllTickets([]);
    setFilteredFlightTickets([])
    setDirectFlight(false);
    setNearByAirport(true);
  }

  const handleAddSearch = async (returnDatePara, selectedDatePara, adultsCountPara, childrenCountPara, infantsCountPara) => {
    let body;

    if (tripOption === "Round Trip" && returnDatePara) {
      const returnDateFormated = moment(returnDatePara).format('YYYY-MM-DD');

      body = {
        "legs": [
          {
            "source": departureCity?.value,
            "destination": arrivalCity?.value,
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
        "legs": multicityFlights?.map((item) => ({
          "source": item?.departureCity?.value,
          "destination": item?.arrivalCity?.value,
          "date": formatDate(item?.departureDate),
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
            "source": departureCity?.value,
            "destination": arrivalCity?.value,
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

  const handleSearchTciket = () => {
    if (tripOption == "Multi City") {
      handleSearch()
    } else if (departureCity && arrivalCity && departureDate) {
      if (adultsCount === 1 && childrenCount === 0 && infantsCount === 0 && !(directFlight) && !showDiv) {
        setShowDiv(true);
        enqueueSnackbar("Successfully loaded all GDS!", {
          variant: "success",
        });
      } else {
        handleSearch(undefined, undefined, true)
      }
    }
  }


  useEffect(() => {
    if (flightTickets.length !== 0) {
      // handleoffDivs()
      if (selectedArCode) {
        const filteredData = filterFlightsWithLowestFare(flightTickets) || [];
        setAllTickets(filteredData)
        filterFlightsByArCodeRefetch(selectedArCode, filteredData)
      } else {
        const filteredData = filterFlightsWithLowestFare(flightTickets) || [];
        setAllTickets(filteredData)
        setFilteredFlightTickets(flightTickets)
      }
    }
  }, [flightTickets])

  useEffect(() => {
    fetchFlightSalesData()
    fetchGetRecentSearch()
  }, [])

  useEffect(() => {
    fetchGetRecentSearch()

    if (!showDiv) {
      resetFiltersState()
      setTripOption('One Way')
    }
  }, [showDiv])

  const buttons = [
    {
      label: "SEARCH FLIGHT", icon: 'coupon.png', color: "#f9fbed"
    },
    {
      label: "SALES REPORT", icon: 'increase.png', color: "#e8fafc"
    },
    {
      label: "IMPORT PNR", icon: 'ticket.png', color: "#eefefb"
    },
    {
      label: "FLIGHT BOOKINGS", icon: 'plane.png', color: "#faeffd"
    },


  ];

  return (
    <Box sx={{
      display: "flex", justifyContent: "center", flexDirection: "column", width: "100%",
      backgroundColor: "#ebebeb",
      height: "auto",
      paddingBottom: "100px"
    }}>
      <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} showDiv={showDiv} />
      <Box sx={{ width: "100%", height: "auto", mt: "25px", display: "flex", justifyContent: "space-evenly" }}>
        <Box sx={{ width: showDiv ? "95%" : "67%", height: "auto" }}>
          <Box sx={{
            position: "relative", width: "100%", display: "flex", justifyContent: "center",
            backgroundColor: "white",
            boxShadow: "5px 5px 20px 5px rgb(0,0,0,0.3)",
            borderRadius: "20px",
            height: "auto"
          }}>


            <Box sx={{ display: "flex", flexDirection: "column", height: "auto", width: { xs: "90%", lg: "100%" }, gap: "20px", pl: "20px", mb: "30px", backgroundColor: "white", borderRadius: "20px" }}>

              {!showDiv && (
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "34px", fontWeight: "500", fontFamily: "Poppins" }} >Search Flights</Typography>
                    <Box sx={{ pr: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <NotificationsActiveIcon style={{ width: "30px", height: "80px" }} />
                      <Typography sx={{ fontSize: "24px", fontWeight: "500", fontFamily: "Poppins", color: "#9d4a49" }} >How to use Al-Saboor Portal</Typography>
                      <FlightTakeoffIcon style={{ width: "40px", height: "90px" }} />
                    </Box>

                  </Box>

                </Box>
              )}
              <Box sx={{ display: "flex", gap: 2, ml: "10px" }}>
                <AppRadioButtons
                  options={[...TripOptions, { label: "Multi City", value: "Multi City" }]}
                  onChange={handleTripChange}
                  defaultValue={tripType}
                  value={tripType}

                />


              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: "flex-end", width: "100%", minHeight: "50px", position: "relative", maxHeight: "auto" }}>
                {tripOption !== "Multi City" ? (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "space-between",
                      alignItems: "end",
                      flexWrap: "wrap",
                      width: "95%",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <SearchSelect
                        placeholder="Departure"
                        onChange={handleCityChange}
                        _name="departure"
                        loadOptions={loadCityOptions}
                        value={departureCity}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <SearchSelect
                        placeholder="Arrival"
                        onChange={handleCityChange}
                        _name="arrival"
                        loadOptions={loadCityOptions}
                        value={arrivalCity}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <AppDatePicker
                        size="lg"
                        startDecorator={<FlightTakeoffIcon />}
                        placeholder="Departure Date"
                        name="departureDate"
                        date={departureDate}
                        handleChange={handleDateChange}
                        minDate={new Date()}
                      />
                    </Box>
                    {tripOption === "Round Trip" && (
                      <Box sx={{ flex: 1 }}>
                        <AppDatePicker
                          size="lg"
                          startDecorator={<FlightLandIcon />}
                          placeholder="Return Date"
                          name="returnDate"
                          date={returnDate}
                          handleChange={handleDateChange}
                          minDate={departureDate || new Date()}
                        />
                      </Box>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <PassengerCount
                        isPopoverOpen={isPopoverOpen}
                        handleOpenPassengerCount={handleOpenPassengerCount}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ width: "100%", display: "flex" }}>
                    <Box sx={{ width: "70%" }}>
                      <MulticityFlights
                        loadCityOptions={loadCityOptions}
                        handleDateChange={handleDateChange}
                      />
                    </Box>
                    <Box sx={{ width: "20%", pt: "8px" }}>
                      <PassengerCount
                        isPopoverOpen={isPopoverOpen}
                        handleOpenPassengerCount={handleOpenPassengerCount}
                      />
                    </Box>
                  </Box>
                )}

              </Box>



              {!showDiv && (
                <Box>
                  <Box sx={{ display: "flex", borderRadius: "15px", border: "1px solid rgb(209, 197, 197)", p: "12px", width: "93.5%" }}>
                    <Typography sx={{ marginRight: "20px" }}>Airline prefrences</Typography>

                    <Typography sx={{ borderRadius: "20px", backgroundColor: "#185ea5", width: "8rem", height: "2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px", mr: "20px", color: "white" }}>All Airlines <CancelIcon /> </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '50%',
                              backgroundColor: '#185ea5',
                              color: 'white',
                              padding: '5px',
                              marginLeft: "5px"
                            },
                            '&.Mui-checked': {
                              color: '#185ea5',
                              marginLeft: "5px",

                            },
                          }}
                          defaultChecked

                        />
                      }
                      label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px" }}>Low Cost Airlines</Typography>}
                    />
                    {/* <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            '& .MuiSvgIcon-root': {
                              borderRadius: '50%',
                              backgroundColor: '#185ea5',
                              color: 'white',
                              padding: '5px',
                              marginLeft: "5px"

                            },
                            '&.Mui-checked': {
                              color: '#185ea5',
                              marginLeft: "5px"

                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px" }}>GDS Airline</Typography>}
                    /> */}
                  </Box>
                  <Box sx={{ display: "flex", borderRadius: "15px", p: "12px", width: "93.5%", marginTop: "25px", backgroundColor: "rgb(206, 215, 228)" }}>

                    {tripOption !== "Multi City" && (
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
                        label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px", }}>Direct Flight</Typography>}
                      />
                    )}

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
                            marginLeft: "20px"

                          }}
                          checked={nearByAirport}
                          onChange={() => { setNearByAirport(prevState => !prevState) }}
                        />
                      }
                      label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px" }}>Nearby Airports</Typography>}
                    />
                  </Box>
                </Box>)}

              <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => {
                  handleSearchTciket()
                }} sx={{ backgroundColor: "#036bb0", color: "white", width: { xs: "130px", lg: "150px" }, height: { xs: "25px", lg: "45px" }, borderRadius: "20px", border: "none", fontSize: { xs: "14px", lg: "18px" }, fontWeight: "400", marginRight: "20px" }}>Search Flight</Button>
              </Box>
            </Box>
          </Box>
          {!showDiv && <Box sx={{ display: "flex", width: "100%", height: "14rem", justifyContent: "space-evenly", mt: "10px", alignItems: "center" }}>
            <Box sx={{
              height: "95%", width: "30%", borderRadius: "10px",
              backgroundImage: `url("https://s3-alpha-sig.figma.com/img/93db/0ec5/dd3ac6f71f0333f575e9e9af4dde4fa6?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GqW-MiZTWrD0z0x4~rT3O102uxSEVrGfgo0utCuGQI7XPHF27xetcDxNOgdutvJLzsYHLKmHm~dxT-~m29w0uJ6C6vV1p0~aWL4Eh19Zd2fuLYTJZi2N0nTl5997y3sjPkQx9r7eGh9zus3fpn3YtUI5PV3OAmuEY5z8qRO6G7y6I3BeX2Y796-suCjlXqQkh60rW2UzumoypWdGW0EnwbwCg5i8JGJHMHxDJJV~WLVH1DqvSmh6ZpiEsGWxFS7XFk0vOYiFgcKaVkRVP4~Rk7QzjfVFpvPCnuiHCP64VRK53V0YtB~kr0bRWhPvWikLgSsrGyEjgZ2RdmrI7lSfYQ__")`
              , backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>

            </Box>
            <Box sx={{
              height: "100%", width: "30%", borderRadius: "10px",
              backgroundImage: `url("https://s3-alpha-sig.figma.com/img/5f30/01eb/c1f6183d919e2c7e911fa7f16668a208?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SOHemUdreSy1vxiVeTPCOdFfoCWFXSwCR9yke5HcZu9bYUlx9JpFKMGLFTXgg1~PAH2sTcPk5s0Pokdodd6jFlqlA0RASEItIZnJaf2Gn1FLQcGso6VrfX09coUJcmkB2ICjRMeutktjzmlKrD8nDspV-OXFyX4rVwQxY-orQ3xpxOnSxO9w3IT8Yp20bsW2JpdU1j44xJ~gMPAQSDx2yFao0T-ECRcmZXGw-nHx3l1ISPODFCEy2pJRYOVHWcQ6unH-t5tuZFFsNtD48joIlm8ShwuP7GejNTLGvN6sae1zC-7uz1AcPkWWaUNnc~ttN2UsbNav4ZkwKqRbh8HWMg__")`
              , backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>

            </Box>
            <Box sx={{
              height: "95%", width: "30%", borderRadius: "10px",
              backgroundImage: `url("https://s3-alpha-sig.figma.com/img/bc87/951b/7986019b106484b592a3574626340dba?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=mnug2XT7JM8UU0Nda8yEOtLyVlW21mRHt4KvRC7diHfWfA4pT9Mh-8MYQcPiCAj3J9hWZwBqaLiZwvRrLXL6OPdXS8EQydSfdlIW-EH-Z0dWk8AED0s~0IyOD8NqB0a6DVbQZxrTrA4-AkItn4x1fvben5qbH4QKFHeqgmXobD50yrCzW5a-oAPru2oiohehjjl2~Bn9zMQ01358MiQB30LQtj1-AOcexLkLJtyX63wzK1UExvM72iH~8YbJoZ-4bwnguJx47bfrBJYU3DJxmxliNcXEK7qkIdztTxtlymXW4eJNPt8AgJDSKWn9XPKAQgk~Wn63THAWt6~MoTFN1Q__")`
              , backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>

            </Box>
          </Box>}
        </Box>
        {!showDiv && (
          <>
            <Box sx={{ width: "27%", height: "auto", display: "flex", flexDirection: "column", gap: "25px", alignItems: "center" }}>
              <Box sx={{ width: { xs: "90%", lg: "100%" }, height: "20rem", display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center" }}>
                {buttons.map((div, index) => (
                  <Box
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
                        alert('Coming soon!')
                        // navigate('/b2b/under-discussion')
                        console.log("not working")
                        console.log(index)

                      }
                    }}
                    sx={{
                      width: "45%",
                      height: "45%",
                      borderRadius: "15px",
                      color: "#185ea5",
                      backgroundColor: div.color,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "10px",
                      fontFamily: "Expedia Sans",
                      cursor: 'pointer'
                    }}
                  >
                    {console.log(div?.icon)}
                    <img
                      src={require(`../../images/${div.icon}`)}
                      alt={div.label}
                      height="75"
                      width="75"
                    />
                    <Typography sx={{
                      padding: "7px",
                      color: "#185ea5",
                      width: "60%", textAlign: "center",
                    }} key={index}
                    >{div.label}</Typography>
                  </Box>
                ))}


              </Box>

              {recentSearchesData?.length !== 0 && (
                <Box sx={{ width: "95%", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Recent Searches</Typography>
                    {/* <Typography>Clear all</Typography> */}

                  </Box>

                  {recentSearchesData?.map((item, index) => {
                    const legs = item?.legs;
                    if (legs && legs.length > 1) {
                      const sourcesAndDestinations = `${legs[0].source} - ${legs.map((leg) => leg.destination).join(' - ')}`;
                      const dates = legs.map((leg) => moment(leg.date).format('YYYY-MM-DD')).join(' - ');


                      return (
                        <Box
                          key={index}
                          sx={{
                            backgroundColor: "white",
                            height: "auto", // Adjust height automatically based on content
                            borderRadius: "10px",
                            padding: "8px",
                            boxShadow: "5px 5px 5px rgb(206, 199, 219)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRecentSearch(item)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                              sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal', // Allow text to wrap
                                maxWidth: '250px', // Set max width for better control
                                overflowWrap: 'break-word', // Ensure long words break
                              }}
                            >
                              {sourcesAndDestinations}
                            </Typography>

                            <Typography
                              sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                maxWidth: '150px', // Limit the date length as well
                                overflowWrap: 'break-word',
                              }}
                            >
                              {dates}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    } else if (legs && legs.length === 1) {
                      // For a single leg, display the source, destination, and date
                      return (
                        <Box
                          key={index}
                          sx={{
                            backgroundColor: "white",
                            height: "auto",
                            borderRadius: "10px",
                            padding: "8px",
                            boxShadow: "5px 5px 5px rgb(206, 199, 219)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRecentSearch(item)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                              sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                maxWidth: '250px',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {legs[0]?.source} - {legs[0]?.destination}
                            </Typography>

                            <Typography
                              sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                maxWidth: '150px',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {moment(legs[0]?.date).format('YYYY-MM-DD')} {legs[0]?.returnDate && ` - ${moment(legs[0]?.returnDate).format('YYYY-MM-DD')}`}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }

                    return null;
                  })}

                </Box>
              )}
            </Box>
          </>
        )

        }


      </Box>



      <Box sx={{ width: "95%" }}>
        {(flightTickets.length > 0 && showDiv) && (
          <Box sx={{
            display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 3, cursor: 'pointer', mt: 4
          }} onClick={() => handleBack()}>
            <ArrowBackIcon sx={{
              fontSize: '25px', color: 'blue', marginLeft: '10px'
            }} />
            <Typography level="h4" sx={{
              marginLeft: '5px', color: 'blue'
            }}>Back</Typography>
          </Box>
        )}

        {flightTickets.length > 0 && showDiv && (
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

export default SearchTicket

import React, { useCallback, useEffect, useState } from "react";
import FormSelect from "../../components/common/FormSelect";
import AppDatePicker from "../../components/common/AppDatePicker";
import Box from "@mui/joy/Box";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AppRadioButtons from "../../components/common/AppRadioButtons";
import AppButton from "../../components/common/AppButton";
import SearchIcon from "@mui/icons-material/Search";
import PassengerCount from "../../components/PassengerCount";
import SearchSelect from "../../components/common/SearchSelect";
import { TripOptions } from "../../components/utils/constants";
import BookingFooter from "./BookingFooter";
import { getFlightRules, getFlightsData, getSabreFlightsData, getSabreFlightsDataMultiCity, searchCityCode, getFlightSalesData, multiCityAmedus } from "../../server/api";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../components/utils";
import FlightTicket from "./FlightTicket";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../redux/reducer/loaderSlice";
import BookingFilters from "./BookingFilters";
import TicketsTopBar from "./TicketsTopBar";
import Ticket from "./Ticket";
import FlightRulesModal from "../../components/modals/FlightRules";
import FlightTicketCard from "./FlightTicket";
import MulticityFlights from "./MulticityFlights";
import { Chip, Sheet, Table, Typography } from "@mui/joy";
import AllTicketsPrices from "./AllTicketsPrices";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CustomTypography from "../../components/common/CustomTyprography";
import { useTicketFilterValues } from "../../context/ticketFilterValues";

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

const BookingEngine = () => {
  const { resetFilters,
    setArrivalCity,
    setDepartureCity,
    setDepartureDate,
    setFlightTickets,
    setMulticityFlights,
    setReturnDate,
    setSelectedArCode,
    setTripType, multicityFlights, adultsCount,
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
    selectedArCode, setAirLinePreference } = useTicketFilterValues()
  const [tripOption, setTripOption] = useState("One Way");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [openFlightRule, setOpenFlightRule] = useState(false)
  const [selectedFlightRules, setSelectedFlightRules] = useState([])
  const [filteredFlightTickets, setFilteredFlightTickets] = useState([])
  const [flightSalesData, setFlightSalesData] = useState([])
  const [flightSalesAnalyticsData, setFlightSalesAnalyticsData] = useState([])
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const check = useSelector((state) => state)
  const handleTripChange = (event) => {
    setTripOption(event.target.value);
    setTripType(event.target.value)
    if (event.target.value === "Multi City") {
      setMulticityFlights([{ departureCity: null, arrivalCity: null, departureDate: null }])
    }
  };

  const handleOpenPassengerCount = () => {
    setIsPopoverOpen(!isPopoverOpen);
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

  const handleCityChange = (selectedOption, name) => {
    if (name === "departure") {
      setDepartureCity(selectedOption)
    } else if (name === "arrival") {
      setArrivalCity(selectedOption)
    }
  };

  const handleDateChange = (selectedDate, name) => {
    if (name === "departureDate") {
      setDepartureDate(selectedDate)
    } else if (name === "returnDate") {
      setReturnDate(selectedDate)
    }
  };

  const handleSearch = () => {
    resetFilters()
    setAirLinePreference(null)
    if (tripOption === "Multi City") {
      handleMulticitySearch();
    } else {
      handleSingleOrRoundTripSearch();
    }
  };

  const handleMulticitySearch = (markupValue, staffMarkupType) => {
    if (multicityFlights.some(flight => !flight.departureCity || !flight.arrivalCity || !flight.departureDate)) {
      enqueueSnackbar("Please fill in all required fields for multicity flights.", {
        variant: "error",
      });
      return;
    }

    console.log('multicityFlights:', multicityFlights)

    // Create the formatted multicity flight search parameters
    const multicitySearchParams = multicityFlights.map((flight, index) => ({
      RPH: (index + 1).toString(),
      DepartureDateTime: `${formatDate(flight.departureDate)}T00:00:00`,
      OriginLocation: { LocationCode: flight.departureCity.value },
      DestinationLocation: { LocationCode: flight.arrivalCity.value }
    }));

    const multicitySearchParamsForAmedus = multicityFlights.map((flight, index) => ({
      id: (index + 1).toString(),
      departureDateTimeRange: { date: formatDate(flight.departureDate) },
      originLocationCode: flight.departureCity.value,
      destinationLocationCode: flight.arrivalCity.value
    }));

    dispatch(setLoading(true));

    const body = {
      multicityFlights: multicitySearchParams,
      adultsCount,
      childrenCount,
      infantsCount,
      currencyPreference,
      airLinePreference,
      ticketClass,
      ticketCount,
      flightPriceRange,
      flightStops,
      staffMarkupValue: markupValue,
      staffMarkupType
    };

    const AmedusBody = {
      multicityFlights: multicitySearchParamsForAmedus,
      adultsCount,
      childrenCount,
      infantsCount,
      staffMarkupValue: markupValue,
      staffMarkupType
    }

    getSabreFlightsDataMultiCity(body)
      .then(sabreApiResult => {
        const sabreResult = sabreApiResult?.result.ticket || [];
        const allTickets = [...sabreResult];
        setFlightTickets(allTickets)

        if (sabreResult.length === 0) {
          enqueueSnackbar("No flight tickets found for Sabre multicity search. Please wait for other GDS!", {
            variant: "info",
          });
        }

        if (sabreResult.length !== 0) {
          dispatch(setLoading(false));

          enqueueSnackbar("Successfully searched for Sabre. Please wait for other GDS!", {
            variant: "info",
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


  const handleSingleOrRoundTripSearch = (markupValue, staffMarkupType) => {
    if (
      !departureCity ||
      !arrivalCity ||
      !departureDate ||
      (tripOption === "Round Trip" && !returnDate)
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

    // If it's a "One Way" trip, set the return date to null
    let finalReturnDate = tripOption === "One Way" ? null : returnDate;

    if (tripOption === "Round Trip") {
      // Validate that the return date is not before the departure date
      if (new Date(returnDate) < new Date(departureDate)) {
        enqueueSnackbar("Return date cannot be before the departure date.", {
          variant: "error",
        });
        return;
      }
      finalReturnDate = formatDate(returnDate);
    }

    dispatch(setLoading(true));

    const searchParams = {
      startDate: formatDate(departureDate),
      endDate: finalReturnDate,
      arrival: arrivalCity?.value,
      departure: departureCity?.value,
      adultsCount,
      childrenCount,
      infantsCount,
      currencyPreference,
      airLinePreference,
      ticketClass,
      ticketCount,
      flightPriceRange,
      flightStops,
      staffMarkupValue: markupValue,
      staffMarkupType
    };

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
        setAllTickets(filteredData?.sort((a, b) => parseFloat(a.totalFare) - parseFloat(b.totalFare)))
        setFilteredFlightTickets(mergedTickets)


        if (mergedTickets.length !== 0) {
          dispatch(setLoading(false));

          enqueueSnackbar("Successfully loaded for Sabre. Please wait for other GDS", {
            variant: "info",
          });
        }


        // getFlightsData(searchParams,)
        //   .then(data => handleApiResponse("Amadeus", data))
        //   .catch(error => handleApiError("Amadeus", error))
        //   .finally(() => {
        //     setFlightTickets(mergedTickets)
        //     dispatch(setLoading(false));
        //     const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
        //     setAllTickets(filteredData?.sort((a, b) => parseFloat(a.totalFare) - parseFloat(b.totalFare)))
        //     setFilteredFlightTickets(mergedTickets)

        //     if (mergedTickets.length === 0) {
        //       enqueueSnackbar("No flight tickets found. Please try different search criteria.", {
        //         variant: "info",
        //       });
        //     }
        //     if (mergedTickets.length !== 0) {
        //       enqueueSnackbar("Successfully loaded all GDS!", {
        //         variant: "success",
        //       });
        //     }
        //   });
      });
  };

  const refetchData = (markupValue, staffMarkupType) => {
    if (tripOption === "Multi City") {
      handleMulticitySearch(markupValue, staffMarkupType);
    } else {
      handleSingleOrRoundTripSearch(markupValue, staffMarkupType);
    }
  }

  const handleTicketSelect = ({ flight }) => {
    navigate("/booking", { state: { flight } });
    // navigate("/v2/booking", { state: { flight } });
  };
  const [baggage, setBaggage] = useState(false)

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

    console.log('RESULT:', result)

    return result?.sort((a, b) => parseInt(a.totalFare || 0) - parseInt(b.totalFare || 0));
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

  useEffect(() => {
    if (flightTickets.length !== 0) {
      if (selectedArCode) {
        const filteredData = filterFlightsWithLowestFare(flightTickets) || [];
        setAllTickets(filteredData?.sort((a, b) => parseFloat(a.totalFare) - parseFloat(b.totalFare)))
        filterFlightsByArCodeRefetch(selectedArCode, filteredData)
      } else {
        const filteredData = filterFlightsWithLowestFare(flightTickets) || [];
        setAllTickets(filteredData?.sort((a, b) => parseFloat(a.totalFare) - parseFloat(b.totalFare)))
        setFilteredFlightTickets(flightTickets)
      }
    }
    console.log('HI')
  }, [flightTickets])

  useEffect(() => {
    fetchFlightSalesData()
  }, [])

  return (
    <Box>
      <Sheet variant="soft" sx={{ padding: '20px', borderRadius: '20px', marginBottom: '40px' }}>
        <AppRadioButtons
          options={[...TripOptions, { label: "Multi City", value: "Multi City" }]}
          onChange={handleTripChange}
          defaultValue={tripType}
        />
        {tripOption !== "Multi City" ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              alignItems: "end",
              flexWrap: "wrap",
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
              // zIndex="9999"
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
                // zIndex="9999"
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
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'end' }} >
              <Box></Box>
              <Box sx={{ width: "12rem" }}>
                <PassengerCount
                  isPopoverOpen={isPopoverOpen}
                  handleOpenPassengerCount={handleOpenPassengerCount}
                /></Box>
            </Box>
            <MulticityFlights
              loadCityOptions={loadCityOptions}
              handleDateChange={handleDateChange}
            />

          </Box>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>

          <AppButton
            startDecorator={<SearchIcon />}
            text="Search Flight"
            variant="solid"
            height="48px"
            width="12rem"
            onClick={handleSearch}
          />
        </Box>
      </Sheet>

      {flightTickets.length > 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            mt: 5,
            gap: 3
          }}
        >
          <BookingFilters refetchData={refetchData} allTickets={allTickets} />

          <Box sx={{ width: "100%" }}>

            {/* <TicketsTopBar /> */}
            <AllTicketsPrices flightTickets={allTickets} filterFlightsByArCode={filterFlightsByArCode} selectedArCode={selectedArCode} />


            {/* <Box
              sx={{
                display: 'flex',
              // flexWrap: 'wrap',
                padding: '1rem',
                mb: 2,
                width: '50%',
              
                overflowX: 'scroll', 
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888', // Customize scrollbar thumb color
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555', // Customize scrollbar thumb color on hover
                },
              }}
              
             
            >
              {flightTickets
                .slice()
                .sort((a, b) => a.totalFare - b.totalFare)
                .map((flight) => (
                
                  <Chip variant="soft" sx={{p: 1, m: 0.5}} >  ${flight.totalFare} </Chip>
                  
                ))}
            </Box> */}
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
      {/* <Box sx={{ mt: filteredFlightTickets.length === 0 ? "12rem" : "0rem" }}>
        <BookingFooter />
      </Box> */}
      {flightTickets.length === 0 && (
        <>
          <Box
            style={{
              display: "flex",
              height: "10rem",
              alignItems: "center",

            }}
          // sx={{ boxShadow: "xl" }}
          >
            {dashboardData.map((card, index) => (
              <Box sx={{ boxShadow: "xl" }} style={{ width: "100%", border: "1px solid #CCD6E0", borderRadius: "20px", backgroundColor: "#fbf6ea", padding: "20px", margin: index === 0 ? '20px 20px 20px 0px' : dashboardData?.length - 1 === index ? '20px 0px 20px 20px' : '20px 0px 20px 20px' }} key={index}>
                <div style={{ display: "flex", alignItems: 'center' }}>
                  <img src={card?.src} alt="Lamp" width="70" height="70" />


                  <div style={{ margin: "0px 10px" }}>
                    <CustomTypography sx={{ textTransform: 'uppercase' }} level="h1">{card.title}</CustomTypography>
                    <CustomTypography>{card.description}</CustomTypography>
                  </div>
                </div>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "30rem",
              marginTop: "50px",
              display: "flex",
              // border: "1px solid #CCD6E0",
              // borderRadius: 'md',
            }}
          >
            <Box sx={{ boxShadow: "xl" }} style={{ width: "100%", backgroundColor: "#fbf6ea", height: "100%", border: "1px solid #CCD6E0", borderRadius: '20px', margin: '0px 20px 0px 0px', padding: '20px' }}>
              <Box style={{ width: "100%", height: "5rem", display: "flex" }}>
                <Box style={{ width: "60%", display: "flex", alignItems: "center" }}>
                  <Typography level="h3" sx={{ textTransform: 'uppercase' }}> Latest Booking <span style={{ fontSize: '17px', textTransform: 'capitalize', color: 'GrayText', marginBottom: '5px' }}>( 5 previous booking data )</span></Typography>
                </Box>
              </Box>
              <Box style={{ width: "100%" }}>
                <Table aria-label="flight sales data" variant="soft" style={{ backgroundColor: "#fbf6ea", }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}  >Airline</th>
                      <th style={{ textAlign: 'center' }} >Total Sales</th>
                      <th style={{ textAlign: 'center' }}>Total Bookings</th>
                      <th style={{ textAlign: 'center' }}>Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightSalesData.map((row, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{row.airline || 'N/A'}</td>
                        <td style={{ textAlign: 'center' }}>{row.totalSales || 'N/A'}</td>
                        <td style={{ textAlign: 'center' }}>{row.totalBookings || 'N/A'}</td>
                        <td style={{ textAlign: 'center' }}>{row.destination && row.destination[0] && row.destination[0].length > 0
                          ? row.destination[0].map((des) => des.join(', ')).join(' | ')
                          : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            </Box>


          </Box>
        </>
      )}
      <FlightRulesModal
        openFlightRule={openFlightRule}
        setOpenFlightRule={setOpenFlightRule}
        selectedFlightRules={selectedFlightRules}
      />
    </Box>
  );
};

export default BookingEngine;

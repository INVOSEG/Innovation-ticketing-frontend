import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  ListItemDecorator,
  Modal,
  ModalDialog,
  Option,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";

import React, { useEffect, useRef, useState } from "react";
import B2BheaderV2 from "./B2BheaderV2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FormControlLabel } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LocationDropdown from "./LocationDropdown";
import DatePicker from "./DatePicker";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTicketFilterValues } from "../../context/ticketFilterValues";
import {
  extractTime,
  formatDate,
  formatDuration,
  isNextDay,
} from "../../components/utils";
import {
  addSearch,
  getFlightsData,
  getSabreFareRules,
  getSabreFlightsData,
  getSabreFlightsDataMultiCity,
  getUpselling,
  hititFareRules,
  hititSearchFlights,
  multiCityAmedus,
  revalidateAmadus,
  revalidateSabre,
} from "../../server/api";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import LuggageIcon from "@mui/icons-material/Luggage";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ReplyIcon from "@mui/icons-material/Reply";
import ClearIcon from "@mui/icons-material/Clear";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSnackbar } from "notistack";
import {
  calculateStops,
  calculateTotalFlightTime,
  extractTrips,
  extractTripsForMultiCity,
  getCabinText,
  getCheckinText,
  getRevalidateSabreUrl,
  toTimestamp,
} from "../../utils/HelperFunctions";
import MulticityV2 from "./MulticityV2";
import { useDispatch } from "react-redux";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { ArrowRight } from "@mui/icons-material";
import { setLoading } from "../../redux/reducer/loaderSlice";

function getTimeDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Difference in milliseconds
  let diffMs = Math.abs(d2 - d1);

  // Convert to minutes & hours
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
}

const DurationTooltip = ({ data, apiName, isMultiCity }) => {
  return (
    <Box
      sx={{
        width: "500px",
        height: "auto",
        backgroundColor: "#eaf3ff",
        position: "absolute",
        top: 60,
        right: 0,
        borderRadius: "10px",
        zIndex: 999,
        display: "flex",
        boxShadow: "0px 0px 6px 0px rgb(0,0,0,6)",
        flexDirection: "column",
        p: 2,
      }}
    >
      {data?.map((item, index) => (
        <>
          {/* index > 0 */}
          {apiName === "sabre" &&
            (isMultiCity ? index % 2 != 0 : item?.layoverTime) && (
              <Divider
                sx={{
                  width: "100%",
                  // display: 'block',
                  "--Divider-lineColor": "lightgrey",
                  "--Divider-thickness": "1.5px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  mb: isMultiCity && 2,
                  mt: isMultiCity && 2,
                }}
              >
                {!isMultiCity && `Connecting Time : ${item?.layoverTime}`}
              </Divider>
            )}
          <Box
            sx={{
              width: "100%",
              height: "45%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Box
              sx={{
                width: "35%",
                height: "100%",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>
                  {item?.marketingCarrier || item?.operating || item?.marketing}-
                  {item?.marketingFlightNumber}
                </Typography>
                <Typography sx={{ fontSize: '12px' }}>
                  {isMultiCity ?
                    item?.logo?.code ===
                      item?.operatingLogo?.code
                      ? ""
                      : "Operated By " +
                      item?.operatingLogo?.code
                    : item?.marketing ===
                      item?.operatinglogo?.arCode
                      ? ""
                      : "Operated By: " +
                      item?.operatinglogo?.ar}
                </Typography>

              </Box>
              <Typography>
                {item?.departure?.airport
                  ? item?.departure?.airport
                  : item?.departureLocation}{" "}
                (
                {item?.departure?.time
                  ? moment(
                    `${item?.departure?.date}T${item?.departure?.time}`
                  ).format("HH:mm")
                  : moment(item?.departureTime).format("HH:mm")}
                )
              </Typography>
            </Box>
            <Box
              sx={{
                width: "20%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <QueryBuilderIcon />
              <Typography sx={{ color: "grey" }}>
                {formatDuration(item?.elapsedTime)}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "35%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <Typography>
                {item?.marketingCarrier || item?.operating || item?.marketing}-
                {item?.marketingFlightNumber}
              </Typography>
              <Typography>
                {item?.arrival?.airport
                  ? item?.arrival?.airport
                  : item?.arrivalLocation}{" "}
                (
                {item?.arrival?.time
                  ? moment(
                    `${item?.arrival?.date}T${item?.arrival?.time}`
                  ).format("HH:mm")
                  : moment(item?.arrivalTime).format("HH:mm")}
                )
              </Typography>
            </Box>
          </Box>

          {(apiName === "amadus" || apiName === "amadeus") &&
            item?.layoverTime && (
              <Divider
                sx={{
                  width: "100%",
                  // display: 'block',
                  "--Divider-lineColor": "lightgrey",
                  "--Divider-thickness": "1.5px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Connecting Time : {item?.layoverTime}
              </Divider>
            )}
        </>
      ))}
    </Box>
  );
};

const SearchFlights = () => {
  const { enqueueSnackbar } = useSnackbar();
  // Guard against React StrictMode double-invoking the initial search effect
  const hasSearchedRef = useRef(false);
  const departureTimes = [
    { logo: "coupon.png", time: "05-12" },
    { logo: "coupon.png", time: "12-18" },
    { logo: "coupon.png", time: "18-24" },
    { logo: "coupon.png", time: "24-05" },
  ];

  const [MAX, setMAX] = useState(0);
  const [MIN, setMIN] = useState(0);
  const [priceRange, setPriceRange] = useState(MAX);
  const handlePriceRangeChange = (_, newValue) => {
    setPriceRange(newValue);

    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange: newValue,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: markupvalue,
    });
  };

  const handleResetPriceRange = () => {
    setPriceRange(MAX);
    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange: MAX,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: markupvalue,
    });
  };

  const leftButtons = [
    {
      route: "/",
      icon: "travelcalender.png",
      placeholder: "#f9fbed",
    },
    {
      route: "/",
      icon: "graph.png",
      placeholder: "#eefefb",
    },

    {
      route: "/",
      icon: "search.png",
      placeholder: "#eaf3ff",
    },
    {
      route: "/",
      icon: "share.png",
      placeholder: "#e2ffbda1",
    },
  ];

  const airlines = [
    { id: "G8", name: "Go First" },
    { id: "SG", name: "SpiceJet" },
    { id: "6E", name: "IndiGo" },
    { id: "IX", name: "Air India Express" },
    { id: "G9", name: "Air Arabia" },
  ];

  const connectingAirports = ["Abu Dhabi", "Behrain", "Doha"];
  const arrivalAirportslist = [
    "Dubai bus terminal",
    "Dubai International airport",
    "Sharjah International airport",
  ];
  const fareTypes = ["Normal Fare", "Branded"];

  const [selectedAirlines, setSelectedAirlines] = useState([
    "Go First",
    "SpiceJet",
    "IndiGo",
    "Air India Express",
    "Air Arabia",
  ]);

  const resetFrontendFiltersState = () => {
    setSelectedAirlines([]);
    setSelectedAirlinesOption({});
    setSelectedConnectingAirports([]);
    setSelectedFareTypes([]);
    setSelectedArrivalTimes([]);
    setSelectedDepartureTimes([]);
    setArrivalAirports([]);
    setSelectedStops([]);
    setSelectedSliderAirline(false);
  };

  const [selectedAirlinesOption, setSelectedAirlinesOption] = useState({});
  const [selectedConnectingAirports, setSelectedConnectingAirports] = useState(
    []
  );
  const [selectedFareTypes, setSelectedFareTypes] = useState([]);
  const [selectedArrivalTimes, setSelectedArrivalTimes] = useState([]);
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedSliderAirline, setSelectedSliderAirline] = useState(false);
  const [isModifySearchOn, setIsModifySearchOn] = useState(false);

  const {
    setAdultsCount,
    setChildrenCount,
    setInfantsCount,
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
    markupPreference,
    markupvalue,
    setMarkupPreference,
    setMarkupValue,
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
    returnDate,
    setReturnDate,
    isAlreadyAdded,
    setIsAlreadyAdded,
    gdsSelection,
    setGdsSelection,
  } = useTicketFilterValues();

  const dropdownRef = useRef(null);
  const adultsRef = useRef();
  const toBoxRef = useRef(null);
  const departRef = useRef(null);
  const returnRef = useRef(null);
  const fromBoxRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [hititRules, setHititRules] = useState(null);
  const [loadingHititRules, setLoadingHititRules] = useState(false);

  useEffect(() => {
    const fetchHititRules = async () => {
      if (openDrawer && openDrawer?.data?.api === "hitit") {
        setLoadingHititRules(true);
        try {
          const payload = {
            airlineCode: openDrawer?.data?.departure?.[0]?.marketing || openDrawer?.data?.departure?.[0]?.marketingCarrier || openDrawer?.data?.validatingCarrier || openDrawer?.data?.arCode,
            origin: openDrawer?.data?.departure?.[0]?.departureLocation,
            destination: openDrawer?.data?.departure?.[openDrawer?.data?.departure?.length - 1]?.arrivalLocation,
            departureDate: openDrawer?.data?.departure?.[0]?.departureTime,
            fareBasisCode: openDrawer?.data?.brandedFare?.fareBasisCode || openDrawer?.data?.brandedFare?.bookingCode,
            currency: openDrawer?.data?.currency || "PKR"
          };
          const res = await hititFareRules(payload);
          if (res && res.result) {
            setHititRules(res.result);
          }
        } catch (error) {
          console.error("Error fetching Hitit fare rules:", error);
        } finally {
          setLoadingHititRules(false);
        }
      }
    };
    fetchHititRules();
  }, [openDrawer]);

  const [loading, setLoadingDrawer] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [tripOption, setTripOption] = useState("One Way");
  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selected, setSelected] = useState("One Way");
  const [isAirlinesOpen, setIsAirlinesOpen] = useState(false);
  const [airlineText, setAirlineText] = useState("All Airlines");
  const options = ["One Way", "Round Trip", "Multi City"];
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [returnDateDuplicate, setReturnDateDuplicate] = useState(new Date());
  const [hoveredDuration, setHoveredDuration] = useState({
    flightIndex: null,
    departureIndex: null,
  });
  const [valueDrawer, setValueDarwer] = React.useState(0);
  const [netFare, setNetFare] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [allTicketsV2, setAllTicketsV2] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showAllAmdeus, setShowAllAmdeus] = useState(false);
  const [otherBrandedFare, setOtherBrandedFare] = useState(null);
  const [isloadingAmadeus, setIsLoadingAmadeus] = useState(false);
  const [filteredFlightTickets, setFilteredFlightTickets] = useState([]);
  const [flightSegments, setFlightSegments] = useState([
    {
      from: { code: "LHE", name: "Lahore" },
      to: { code: "JED", name: "King Abdulaziz International" },
      depart: new Date(),
    },
    {
      from: { code: "JED", name: "King Abdulaziz International" },
      to: { code: "", name: "Select a City" },
      depart: new Date(),
    },
  ]);

  const [openSegment, setOpenSegment] = useState(false);

  const handleMulticitySegment = () => {
    setOpenSegment(!openSegment);
  };

  const handleNetFare = () => {
    setNetFare(!netFare);
  };

  const [openSections, setOpenSections] = useState({
    airlines: true,
    priceRange: true,
    connectingAirports: true,
    fareType: true,
    departureTimes: true,
    arrivalTimes: true,
    arrivalAirports: true,
    stops: true,
    markup: true,
    type: true,
  });

  function applyAllFilters(
    flights,
    {
      selectedAirlinesOption = {},
      priceRange,
      selectedConnectingAirports = [],
      selectedFareTypes = [],
      selectedDepartureTimes = [],
      selectedArrivalTimes = [],
      selectedStops = [],
      markupValue = "",
    }
  ) {
    let result = [...flights];

    result = applyMarkup(markupPreference, markupValue);

    // Filter by selected airlines
    const selectedAirlineCodes = Object.keys(selectedAirlinesOption).filter(
      (code) => selectedAirlinesOption[code]
    );
    if (selectedAirlineCodes.length) {
      result = result.filter((flight) =>
        selectedAirlineCodes.includes(flight.arCode)
      );
    }

    // Filter by max price
    if (typeof priceRange === "number") {
      result = result.filter((flight) => {
        const fare = parseFloat(flight.totalFare);
        return !isNaN(fare) && fare <= priceRange;
      });
    }

    // Filter by connecting airports
    if (selectedConnectingAirports.length) {
      result = filterFlightsByConnectingAirports(
        result,
        selectedConnectingAirports
      );
    }

    // Filter by fare type
    if (selectedFareTypes.length) {
      result = filterFlightsByFareType(result, selectedFareTypes);
    }

    // Filter by departure time range
    if (selectedDepartureTimes.length) {
      result = filterFlightsByDateRange(result, selectedDepartureTimes);
    }

    // Filter by arrival time range
    if (selectedArrivalTimes.length) {
      result = filterFlightsByArrivalDateRange(result, selectedArrivalTimes);
    }

    // Filter by allowed stop counts
    if (selectedStops.length) {
      result = filterFlightsByDepartureLength(result, selectedStops);
    }

    setFilteredFlightTickets(result);
  }

  const handleAirlineCheckboxChange = (airline) => {
    const newSelectedAirlines = {
      ...selectedAirlinesOption,
      [airline]: !selectedAirlinesOption[airline],
    };

    setSelectedAirlinesOption(newSelectedAirlines);

    applyAllFilters(flightTickets, {
      selectedAirlinesOption: newSelectedAirlines,
      priceRange,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: markupvalue,
    });
  };

  const filterFlightsByAirline = (airlinesArgument) => {
    let filteredFlights = [];

    // Iterate over selected airlines and filter flights based on selected airlines
    Object.keys(airlinesArgument).forEach((airline) => {
      if (airlinesArgument[airline]) {
        filteredFlightTickets.forEach((flight) => {
          if (flight.arCode === airline) {
            filteredFlights.push(flight);
          }
        });
      }
    });

    setFilteredFlightTickets(filteredFlights);

    resetFiltersForAirline(airlinesArgument);
  };

  const resetFiltersForAirline = (selectedAirlines) => {
    applyAllFilters(flightTickets, {
      selectedAirlinesOption: [],
      priceRange,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: "",
    });
  };

  function setNewValidateObj(
    filteredFlightTickets,
    setFilteredFlightTickets,
    revalidateRes,
    body
  ) {
    const indexOfObject = filteredFlightTickets?.findIndex(
      (obj) => obj.uuid === body.uuid
    );
    const newObject = {
      ...revalidateRes?.result?.ticket[0],
      brandedFare: body?.brandedFare,
      ...body,
    };

    if (indexOfObject !== -1 && revalidateRes?.status === "success") {
      // Create a new array with the updated object at the found index
      const updatedData = [
        ...filteredFlightTickets.slice(0, indexOfObject), // Elements before the target index
        newObject, // The updated object
        ...filteredFlightTickets.slice(indexOfObject + 1), // Elements after the target index
      ];

      // Update the state with the new array
      setFilteredFlightTickets(updatedData);
    }
  }

  const toggleDrawer =
    (
      open,
      api,
      body,
      uuid,
      code,
      tripType,
      totalFare,
      flight,
      selectedBrandedFare
    ) =>
      async (event) => {
        if (
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
        ) {
          return;
        }

        if (!open) {
          setOpenDrawer(false);
          return;
        }

        let data, fareRule;
        try {
          setLoadingDrawer({ value: true, code, totalFare, uuid });
          if (api === "amadeus" || api === "amadus") {
            const revalidateRes = await revalidateAmadus({
              flightOffers: body,
              uuid,
              type: tripType,
            });
            data = revalidateRes;
            setNewValidateObj(
              filteredFlightTickets,
              setFilteredFlightTickets,
              revalidateRes,
              flight
            );
          } else if (api === "sabre") {
            const body = getRevalidateSabreUrl(flight, code, tripType);
            const brand = flight.brandedFare[0].data[0].brandInfo;
            const response = await revalidateSabre({
              adult: flight?.extra?.adult?.count || 0,
              children: flight?.extra?.child?.count || 0,
              infants: flight?.extra?.infants?.count || 0,
              OriginDestinationInformation: body,
              uuid,
              type: tripType,
              selectedBrandedFare,
              connectingFlights:
                tripType === "Multi City"
                  ? extractTrips(flight?.flights, multicityFlights, flight?.api)
                  : null,
            });
            fareRule = await fetchSabreFareRules(response?.result?.flightData);
            data = response;
            setNewValidateObj(
              filteredFlightTickets,
              setFilteredFlightTickets,
              response,
              flight
            );
          } else if (api?.toLowerCase() === "hitit") {
            data = {
              status: "success",
              result: {
                ticket: [flight]
              }
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingDrawer(false);
          if (data?.status !== "fail" && data) {
            setOpenDrawer({
              value: open,
              data: {
                ...data?.result?.ticket[0],
                brandedFare:
                  api?.toLowerCase() === "hitit"
                    ? selectedBrandedFare
                    : flight?.brandedFare?.find(
                      (item) => item?.data?.[0]?.bookingCode === code
                    ),
                fareRule,
              },
            });
          } else if (data) {
            enqueueSnackbar(data?.message, {
              variant: "error",
            });
          } else {
            enqueueSnackbar("No Ticket Available", {
              variant: "error",
            });
          }
        }
      };

  function formatFareRule(rule) {
    if (!rule) return "";

    const {
      Amount,
      CurrencyCode,
      Applicability,
      Changeable,
      ConditionsApply,
      Type,
    } = rule;

    const amountText =
      Amount && CurrencyCode
        ? `${CurrencyCode} ${Number(Amount).toLocaleString()}`
        : "N/A";
    const applicabilityText = Applicability
      ? `applies ${Applicability.toLowerCase()} the flight`
      : "";
    const changeableText =
      Changeable === "true"
        ? "The ticket is changeable"
        : "The ticket is non-changeable";
    const conditionsText =
      ConditionsApply === "true" ? "and conditions apply" : "";

    return `An ${Type || "Fare"
      } penalty of ${amountText} ${applicabilityText}. ${changeableText} ${conditionsText}.`
      .replace(/\s+/g, " ")
      .trim();
  }

  const handleBookNow = async (
    api,
    body,
    uuid,
    code,
    tripType,
    totalFare,
    flight,
    multicityFlights,
    selectedBrandedFare
  ) => {
    let data, response;
    try {
      setLoadingDrawer({
        value: true,
        code,
        totalFare,
        uuid,
        isBookNowButton: true,
      });
      if (api === "amadeus" || api === "amadus") {
        const revalidateRes = await revalidateAmadus({
          flightOffers: body,
          uuid,
          type: tripType,
        });
        data = revalidateRes;
        setNewValidateObj(
          filteredFlightTickets,
          setFilteredFlightTickets,
          revalidateRes,
          flight
        );
      } else if (api === "sabre") {
        const body = getRevalidateSabreUrl(flight, code, tripType);
        response = await revalidateSabre({
          adult: flight?.extra?.adult?.count || 0,
          children: flight?.extra?.child?.count || 0,
          infants: flight?.extra?.infants?.count || 0,
          OriginDestinationInformation: body,
          uuid,
          type: tripType,
          selectedBrandedFare,
          connectingFlights:
            tripType === "Multi City"
              ? extractTrips(flight?.flights, multicityFlights, flight?.api)
              : null
        });

        data = response;
        setNewValidateObj(
          filteredFlightTickets,
          setFilteredFlightTickets,
          response,
          flight
        );
      } else if (api?.toLowerCase() === "hitit") {
        data = {
          status: "success",
          result: {
            ticket: [flight]
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDrawer(false);
      if (data?.status !== "fail" && data) {
        if (tripType === "One Way" && api?.toLowerCase() !== "hitit") {
          setConfirmationModal({
            value: true,
            flight: data?.result?.ticket[0],
            brandedFare:
              api?.toLowerCase() === "hitit"
                ? selectedBrandedFare?.bookingCode
                : flight?.brandedFare?.find(
                  (item) => item?.data?.[0]?.bookingCode === code
                )?.bookingCode,
            tripType,
            multicityFlights,
            brandedFareDetail: flight?.brandedFare,
            extractedFlightsForMultiCity: null,
            selectedBrandedFare,
            responseBrandedFare: data?.result?.ticket[0]?.brandedFare || [],
            flightData: response?.result?.flightData,
          });
        } else {
          navigate("/booking", {
            state: {
              flight: data?.result?.ticket[0],
              tripType: tripType,
              brandedFare:
                api?.toLowerCase() === "hitit"
                  ? selectedBrandedFare?.bookingCode
                  : flight?.brandedFare?.find(
                    (item) => item?.data?.[0]?.bookingCode === code
                  )?.bookingCode,
              multicityFlights: multicityFlights,
              brandedFareDetail: flight?.brandedFare,
              extractedFlightsForMultiCity:
                tripType === "Multi City"
                  ? extractTripsForMultiCity(
                    data?.result?.ticket[0]?.api === "hitit"
                      ? [
                        ...(data?.result?.ticket[0]?.departure || []),
                        ...(data?.result?.ticket[0]?.return || []),
                      ]
                      : data?.result?.ticket[0]?.flights,
                    multicityFlights,
                    data?.result?.ticket[0]?.api
                  )
                  : null,
              selectedBrandedFare,
              responseBrandedFare: data?.result?.ticket[0]?.brandedFare || [],
              flightData: response?.result?.flightData,
            },
          });
        }
      } else if (data) {
        enqueueSnackbar(data?.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("No Ticket Available", {
          variant: "error",
        });
      }
    }
  };

  const handleToggle = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleConnectingAirportChange = (airport) => {
    setSelectedConnectingAirports((prev) => {
      const newSelectedTimes = prev.includes(airport)
        ? prev.filter((t) => t !== airport) // Remove the time if already selected
        : [...prev, airport]; // Add the time if not selected

      applyAllFilters(flightTickets, {
        selectedAirlinesOption,
        priceRange,
        selectedConnectingAirports: newSelectedTimes,
        selectedFareTypes,
        selectedDepartureTimes,
        selectedArrivalTimes,
        selectedStops,
        markupValue: markupvalue,
      });

      // Return the updated state
      return newSelectedTimes;
    });
  };

  const handleResetConnectingAirport = () => {
    setSelectedConnectingAirports([]);
    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange,
      selectedConnectingAirports: [],
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: markupvalue,
    });
  };

  const filterFlightsByConnectingAirports = (
    flightsData,
    connectingAirports
  ) => {
    // Create a Set for quick lookup of the provided connecting airports
    const airportSet = new Set(connectingAirports);

    return flightsData?.filter((flightData) => {
      if (tripType === "Multi City") {
        // Handle Multi City trips
        const segments = flightData.flights || [];

        // Check if any segment matches the connecting airports
        const matchingSegments = segments.filter((segment) => {
          const depLocation = segment.departureLocation;
          const arrLocation = segment.arrivalLocation;
          return airportSet.has(depLocation) || airportSet.has(arrLocation);
        });

        // Return the flight data if it has any matching segment
        return matchingSegments.length > 0;
      } else {
        // Check if any flight's departure or arrival location matches a connecting airport
        const matchingFlights = flightData.departure.filter((flight) => {
          return (
            airportSet.has(flight.departureLocation) ||
            airportSet.has(flight.arrivalLocation)
          );
        });

        const matchingReturnFlights = flightData?.return?.filter((flight) => {
          return (
            airportSet.has(flight.departureLocation) ||
            airportSet.has(flight.arrivalLocation)
          );
        });

        // Return the airline data only if it has matching flights
        return matchingFlights?.length > 0 || matchingReturnFlights?.length > 0;
      }
    });
  };

  const handleFareTypeChange = (fareType) => {
    setSelectedFareTypes((prev) => {
      const newSelectedFareTypes = prev.includes(fareType)
        ? prev.filter((t) => t !== fareType) // Remove the time if already selected
        : [...prev, fareType]; // Add the time if not selected

      applyAllFilters(flightTickets, {
        selectedAirlinesOption,
        priceRange,
        selectedConnectingAirports,
        selectedFareTypes: newSelectedFareTypes,
        selectedDepartureTimes,
        selectedArrivalTimes,
        selectedStops,
        markupValue: markupvalue,
      });

      // Return the updated state
      return newSelectedFareTypes;
    });
  };

  const handleResetFareType = () => {
    setSelectedFareTypes([]);
    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange: MAX,
      selectedConnectingAirports,
      selectedFareTypes: [],
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: markupvalue,
    });
  };

  function filterFlightsByFareType(flights, selectedFareTypes) {
    return flights.filter((flight) => {
      const api = flight.api?.toLowerCase() || "";
      const brandedFareCount = Array.isArray(flight.brandedFare)
        ? flight.brandedFare.length
        : 0;
      const isUpsell = flight.isUpsellOffer === true;

      let isNormalFare = false;
      let isBrandedFare = false;

      if (api.startsWith("amad")) {
        isNormalFare = selectedFareTypes.includes("Normal Fare") && !isUpsell;
        isBrandedFare = selectedFareTypes.includes("Branded") && isUpsell;
      } else if (api === "sabre") {
        isNormalFare =
          selectedFareTypes.includes("Normal Fare") && brandedFareCount <= 1;
        isBrandedFare =
          selectedFareTypes.includes("Branded") && brandedFareCount > 1;
      }

      return isNormalFare || isBrandedFare;
    });
  }

  const handleArrivalTimeClick = (time) => {
    setSelectedArrivalTimes((prev) => {
      const newSelectedTimes = prev.includes(time)
        ? prev.filter((t) => t !== time) // Remove the time if already selected
        : [...prev, time]; // Add the time if not selected

      applyAllFilters(flightTickets, {
        selectedAirlinesOption,
        priceRange,
        selectedConnectingAirports,
        selectedFareTypes,
        selectedDepartureTimes,
        selectedArrivalTimes: newSelectedTimes,
        selectedStops,
        markupValue: markupvalue,
      });

      // Return the updated state
      return newSelectedTimes;
    });
  };

  const filterFlightsByArrivalDateRange = (flightsData, timeRange) => {
    // Function to convert a 'HH-HH' string into an array of [startHour, endHour]
    const convertToHours = (timeStr) => {
      return timeStr.split("-").map(Number); // ['12-18'] -> [12, 18]
    };

    // Function to get the hour from arrivalTime
    const getHourFromArrivalTime = (arrivalTime) => {
      const arrivalDate = new Date(arrivalTime);
      return arrivalDate.getHours(); // Get the hour part of the arrival time
    };

    // Loop through the flightsData and filter based on arrival time range
    return flightsData.filter((airlineData) => {
      if (tripType === "Multi City") {
        // Handle Multi City: Check the last segment's arrival time
        const segments = airlineData.flights || [];
        const lastSegment = segments[segments.length - 1];

        if (lastSegment) {
          const arrivalTime =
            lastSegment.arrival?.time || lastSegment?.arrivalTime; // Get arrival time for the last segment
          if (arrivalTime) {
            const arrivalHour = getHourFromArrivalTime(arrivalTime);

            // Check if the arrival hour falls within any of the provided time ranges
            return timeRange.some((range) => {
              const [startHour, endHour] = convertToHours(range);
              return arrivalHour >= startHour && arrivalHour < endHour;
            });
          }
        }

        return false; // If no arrival time, exclude this flight
      } else {
        // Handle One Way or Round Trip: Check the last flight's arrival time
        const lastFlight =
          airlineData.departure?.[airlineData.departure.length - 1]; // Get the last flight (if any)

        if (lastFlight) {
          const arrivalHour = getHourFromArrivalTime(lastFlight.arrivalTime);

          // Check if the arrival hour falls within any of the provided time ranges
          return timeRange.some((range) => {
            const [startHour, endHour] = convertToHours(range);
            return arrivalHour >= startHour && arrivalHour < endHour;
          });
        }

        return false; // If there's no last flight, return false (i.e., exclude the airline)
      }
    });
  };

  const handleResetArrivalTime = () => {
    setSelectedArrivalTimes([]);
    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes: [],
      selectedStops,
      markupValue: markupvalue,
    });
  };

  const handleDepartureTimeClick = (time) => {
    // Toggle the selected time
    setSelectedDepartureTimes((prev) => {
      const newSelectedTimes = prev.includes(time)
        ? prev.filter((t) => t !== time) // Remove the time if already selected
        : [...prev, time]; // Add the time if not selected

      applyAllFilters(flightTickets, {
        selectedAirlinesOption,
        priceRange,
        selectedConnectingAirports,
        selectedFareTypes,
        selectedDepartureTimes: newSelectedTimes,
        selectedArrivalTimes,
        selectedStops,
        markupValue: markupvalue,
      });

      // Return the updated state
      return newSelectedTimes;
    });
  };

  const filterFlightsByDateRange = (flightsData, timeRange) => {
    // Function to convert a 'HH-HH' string into an array of [startHour, endHour]
    const convertToHours = (timeStr) => {
      return timeStr.split("-").map(Number); // ['12-18'] -> [12, 18]
    };

    // Function to get the hour from departureTime
    const getHourFromDepartureTime = (departureTime) => {
      const departureDate = new Date(departureTime);
      return departureDate.getHours(); // Get the hour part of the departure time
    };

    // Loop through the flightsData and filter based on departure time range
    return flightsData.filter((airlineData) => {
      if (tripType === "Multi City") {
        // Handle Multi City: Check all flight segments' departure times
        const segments = airlineData.flights || [];

        // Check if any segment's departure time falls within the time range
        return segments.some((segment) => {
          const departureTime =
            segment.departure?.time || segment?.departureTime;
          if (departureTime) {
            const departureHour = getHourFromDepartureTime(departureTime);
            return timeRange.some((range) => {
              const [startHour, endHour] = convertToHours(range);
              return departureHour >= startHour && departureHour < endHour;
            });
          }
          return false;
        });
      } else {
        // Handle One Way or Round Trip: Check the first flight's departure time
        const firstFlight = airlineData.departure?.[0]; // Get the first flight (if any)

        if (firstFlight) {
          const departureHour = getHourFromDepartureTime(
            firstFlight.departureTime
          );

          // Check if the departure hour falls within any of the provided time ranges
          return timeRange.some((range) => {
            const [startHour, endHour] = convertToHours(range);
            return departureHour > startHour && departureHour < endHour;
          });
        }

        return false; // If there's no first flight, return false (i.e., exclude the airline)
      }
    });
  };

  const handleResetDepartureTime = () => {
    setSelectedDepartureTimes([]);
    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes: [],
      selectedArrivalTimes,
      selectedStops,
      markupValue: markupvalue,
    });
  };

  const handleArrivalAirportChange = (label) => {
    setArrivalAirports((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const filterFlightsByArCode = (arCode) => {
    // Initialize an array to store the filtered flights
    let filteredFlights = [];

    if (arCode !== selectedArCode) {
      flightTickets.forEach((flight) => {
        // If the flight's arCode matches the provided arCode
        if (flight.arCode === arCode) {
          filteredFlights.push(flight);
        }
      });

      setFilteredFlightTickets(filteredFlights);
      setSelectedArCode(arCode);
    } else {
      setFilteredFlightTickets(flightTickets);
      setSelectedArCode(null);
    }
    // // Return the filtered list of flights with the lowest totalFare for the given arCode
    // return filteredFlights;
  };

  const filterFlightsByArCodeRefetch = (arCode, data) => {
    // Initialize an array to store the filtered flights
    let filteredFlights = [];

    data.forEach((flight) => {
      // If the flight's arCode matches the provided arCode
      if (flight.arCode === arCode) {
        filteredFlights.push(flight);
      }
    });

    setFilteredFlightTickets(filteredFlights);
  };

  const handleStopSelect = (label) => {
    setSelectedStops((prev) => {
      const newSelectedStops = prev.includes(label)
        ? prev.filter((t) => t !== label) // Remove the time if already selected
        : [...prev, label]; // Add the time if not selected

      applyAllFilters(flightTickets, {
        selectedAirlinesOption,
        priceRange,
        selectedConnectingAirports,
        selectedFareTypes,
        selectedDepartureTimes,
        selectedArrivalTimes,
        selectedStops: newSelectedStops,
        markupValue: markupvalue,
      });

      // Return the updated state
      return newSelectedStops;
    });
  };

  function filterFlightsByDepartureLength(flights, allowedLengths = []) {
    return flights.filter((flight) => {
      let stopCount = 0;

      if (tripType === "Multi City") {
        const segments = flight.flights || [];
        const isSabre = flight.api === "sabre";

        const airportCodes = segments
          .map((seg) =>
            isSabre ? seg.departure?.airport : seg.departureLocation
          )
          .filter(Boolean);

        if (airportCodes.length > 1) {
          const origin = airportCodes[0];
          const destination =
            segments[segments.length - 1]?.arrival?.airport || "";
          const intermediateStops = airportCodes
            .slice(1)
            .filter((code) => code !== origin && code !== destination);
          stopCount = new Set(intermediateStops).size;
        }
      } else {
        stopCount = (flight.departure?.length || 1) - 1;
      }

      return allowedLengths.includes(stopCount);
    });
  }

  const handleResetStops = () => {
    setSelectedStops([]);
    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops: [],
      markupValue: markupvalue,
    });
  };

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 150;
    if (container) {
      container.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const renderOptions = (max, value, setter, setterContext) => (
    <Box display="flex" gap={1} mt={1}>
      {[...Array(max + 1)].map((_, i) => (
        <Button
          key={i}
          variant={value === i ? "solid" : "outlined"}
          color="neutral"
          size="sm"
          onClick={() => {
            setter(i);
            setterContext(i);
          }}
        >
          {i}
        </Button>
      ))}
    </Box>
  );

  const getTravelerLabel = () => {
    const labels = [];

    if (adults) {
      labels.push(
        <span key="adults">
          <Typography
            component="span"
            fontWeight={700}
            fontSize="16px"
            display="inline"
          >
            {adults}
          </Typography>{" "}
          Adult{adults > 1 ? "s" : ""}
        </span>
      );
    }

    if (children) {
      labels.push(
        <span key="children">
          <Typography
            component="span"
            fontWeight={700}
            fontSize="16px"
            display="inline"
          >
            {children}
          </Typography>{" "}
          Child{children > 1 ? "ren" : ""}
        </span>
      );
    }

    if (infants) {
      labels.push(
        <span key="infants">
          <Typography
            component="span"
            fontWeight={700}
            fontSize="16px"
            display="inline"
          >
            {infants}
          </Typography>{" "}
          Infant{infants > 1 ? "s" : ""}
        </span>
      );
    }

    if (labels.length === 0) return "Select Traveller";

    return (
      <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
        {labels.map((label, i) => (
          <span key={i}>
            {label}
            {i < labels.length - 1 && ", "}
          </span>
        ))}
      </span>
    );
  };

  const handleCloseClick = () => {
    setSelectedAirlines([]);
    setAirlineText("Select Airlines");
  };

  // Handle airline selection
  const handleAirlineSelect = () => {
    if (airlineText == "Select Airlines") {
      setIsAirlinesOpen(true);
    } else {
      setIsAirlinesOpen(false);
    }
  };

  const handleCloseDropdown = () => {
    setIsAirlinesOpen(false);
  };

  const handleIndividualAirlineSelect = (airlineName) => {
    if (selectedAirlines.includes(airlineName)) {
      setSelectedAirlines((prev) =>
        prev.filter((name) => name !== airlineName)
      );
    } else {
      setSelectedAirlines((prev) => [...prev, airlineName]);
    }
  };

  // Handle "All Airlines" checkbox
  const handleAllAirlinesSelect = () => {
    if (selectedAirlines.length === airlines.length) {
      setSelectedAirlines([]);
    } else {
      setSelectedAirlines(airlines.map((airline) => airline.name));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter airlines based on search query
  const filteredAirlines = airlines.filter((airline) =>
    airline.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //searching functions

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
      if (type === "from") {
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

  const formatDateV2 = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear();
    return `${day} ${month}'${year.toString().slice(-2)}`;
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleDateChange = (name, selectedDate) => {
    if (selectedDate === "departureDate") {
      setDepartDate(name);
      setDepartureDate(name);
    } else if (selectedDate === "returnDate") {
      setReturnDate(name);
    }
  };

  const handleAddSearch = async (
    returnDatePara,
    selectedDatePara,
    adultsCountPara,
    childrenCountPara,
    infantsCountPara
  ) => {
    let body;
    if (tripType === "Round Trip" && returnDatePara) {
      const returnDateFormated = moment(returnDatePara).format("YYYY-MM-DD");

      body = {
        legs: [
          {
            source: fromLocation?.code,
            destination: toLocation?.code,
            date: formatDate(
              selectedDatePara ? selectedDatePara : departureDate
            ),
            returnDate: returnDateFormated,
          },
        ],
        tripType: tripType,
        adult: adultsCountPara,
        child: childrenCountPara,
        infant: infantsCountPara,
      };
    } else if (tripType == "Multi City") {
      body = {
        legs: multicityFlights?.map((item) => ({
          source: item?.from?.code,
          destination: item?.to?.code,
          date: formatDate(item?.depart),
        })),
        tripType: tripType,
        adult: adultsCountPara,
        child: childrenCountPara,
        infant: infantsCountPara,
      };
    } else if (tripType == "One Way") {
      body = {
        legs: [
          {
            source: fromLocation?.code,
            destination: toLocation?.code,
            date: formatDate(
              selectedDatePara ? selectedDatePara : departureDate
            ),
          },
        ],
        tripType: tripType,
        adult: adultsCountPara,
        child: childrenCountPara,
        infant: infantsCountPara,
      };
    }

    const res = await addSearch(body);
  };

  const handleSingleOrRoundTripSearch = async (
    markupValue,
    staffMarkupType,
    name,
    selectedDate,
    isTravelerSame,
    isAddSearch,
    flightStop,
    ticketClassPara,
    airLinePreferencePara,
    currencyPreferencePara,
    searchObj
  ) => {
    if (
      !(fromLocation || searchObj?.legs?.[0]?.source) ||
      !(toLocation || searchObj?.legs?.[0]?.destination) ||
      !(departDate || selectedDate || searchObj?.legs?.length) ||
      (tripType === "Round Trip" &&
        !(returnDate || selectedDate || searchObj?.legs?.length))
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
    } else if (
      (nearByAirport && !directFlight) ||
      (nearByAirport && directFlight)
    ) {
      lightStops = false; // If nearByAirport is true and directFlight is false, set flightStops to false
    } else if (nearByAirport && flightStops) {
      lightStops = false; // If both nearByAirport and flightStops are true, set flightStops to false
    } else if (directFlight && flightStops) {
      lightStops = flightStops; // If directFlight is true and flightStops exists, show flightStops
    }

    // If it's a "One Way" trip, set the return date to null
    let finalReturnDate = tripType === "One Way" ? null : returnDate;

    if (tripType === "Round Trip") {
      // Validate that the return date is not before the departure date
      if (
        new Date(selectedDate ? selectedDate : returnDate) <
        new Date(departureDate)
      ) {
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
      const arrivalLabel = await getCityLabel(
        searchObj?.legs?.[0]?.destination
      );
      setTripType(searchObj?.tripType);
      setTripOption(searchObj?.tripType);
      setDepartureCity({
        value: searchObj?.legs?.[0]?.source,
        label: `${departureLabel?.name} (${departureLabel?.id})`,
      });
      setArrivalCity({
        value: searchObj?.legs?.[0]?.destination,
        label: `${arrivalLabel?.name} (${arrivalLabel?.id})`,
      });
      setDepartureDate(searchObj?.legs?.[0]?.date ? new Date(searchObj.legs[0].date) : new Date());
      setReturnDate(searchObj?.legs?.[0]?.returnDate ? new Date(searchObj.legs[0].returnDate) : new Date());
      setInfantsCount(searchObj?.infant);
      setAdultsCount(searchObj?.adult);
      setChildrenCount(searchObj?.child);
    }

    let searchParams;

    if (searchObj?.legs?.length) {
      searchParams = {
        startDate: formatDate(searchObj?.legs?.[0]?.date),
        endDate: searchObj?.legs?.[0]?.returnDate
          ? formatDate(searchObj?.legs?.[0]?.returnDate)
          : null,
        arrival: searchObj?.legs?.[0]?.destination,
        departure: searchObj?.legs?.[0]?.source,
        adultsCount: searchObj?.adult,
        childrenCount: searchObj?.child,
        infantsCount: searchObj?.infant,
        tripType: searchObj?.legs?.[0]?.returnDate ? "Return" : "OneWay",
      };
    } else {
      searchParams = {
        startDate: formatDate(
          name === "departureDate" ? selectedDate : departureDate
        ),
        endDate: finalReturnDate,
        arrival: toLocation?.code,
        departure: fromLocation?.code,
        adultsCount,
        childrenCount,
        infantsCount,
        currencyPreference: currencyPreferencePara
          ? currencyPreferencePara
          : currencyPreference,
        airLinePreference: airLinePreference?.length
          ? airLinePreference?.map((item) => item.arCode)
          : [],
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: lightStops,
        staffMarkupValue: markupValue,
        staffMarkupType,
        travelClass: onwardClass,
        // returnTravelClass: tripType === "Round Trip" && returnClass,
        tripType: tripType === "Round Trip" ? "Return" : "OneWay",
      };
    }

    let mergedTickets = [];

    // Function to handle API responses
    const handleApiResponse = (apiName, data) => {
      if (data && data.result && data.result.ticket) {
        mergedTickets = [...mergedTickets, ...data.result.ticket];
        dispatch(setLoading(false));
      }
    };

    // Function to handle API errors
    const handleApiError = (apiName, error) => {
      console.error(`Error fetching flights from ${apiName} API:`, error);
      if (apiName === "Hitit") return;
      enqueueSnackbar(
        `Failed to fetch data from ${apiName} API. Please try again.`,
        {
          variant: "warning",
        }
      );
    };

    // Hitit Payload Construction
    let hititPaxList = [];
    let paxIdCounter = 1;
    const finalAdults = searchObj?.adult || adultsCount;
    const finalChild = searchObj?.child || childrenCount;
    const finalInfant = searchObj?.infant || infantsCount;

    for (let i = 0; i < finalAdults; i++) {
      hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "ADT" });
    }
    for (let i = 0; i < finalChild; i++) {
      hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "CHD" });
    }
    for (let i = 0; i < finalInfant; i++) {
      hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "INF" });
    }

    const isRoundTrip = searchParams.tripType === "Return";

    const hititParams = {
      originDestCriteria: [
        {
          originCode: searchParams.departure,
          destCode: searchParams.arrival,
          departureDate: searchParams.startDate,
        },
      ],
      paxList: hititPaxList,
      currency: searchParams.currencyPreference || "PKR",
      cabinClass: searchParams.travelClass === "Economy" ? "Y" : "Y",
      tripType: isRoundTrip ? "RoundTrip" : "OneWay",
    };

    if (isRoundTrip && searchParams.endDate) {
      hititParams.originDestCriteria.push({
        originCode: searchParams.arrival,
        destCode: searchParams.departure,
        departureDate: searchParams.endDate,
      });
    }

    if (gdsSelection === "Both") {
      const sabrePromise = getSabreFlightsData(searchParams)
        .then((data) => handleApiResponse("Sabre", data))
        .catch((error) => handleApiError("Sabre", error));

      const hititPromise = hititSearchFlights(hititParams)
        .then((data) => handleApiResponse("Hitit", data))
        .catch((error) => handleApiError("Hitit", error));

      Promise.allSettled([sabrePromise, hititPromise]).then(() => {
        // Dispatch the merged tickets and set loading to false
        setFlightTickets(mergedTickets);
        const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
        setAllTickets(filteredData);
        setAllTicketsV2(filteredData);
        setFilteredFlightTickets(mergedTickets);
        setTripOption(tripType);

        if (!isAlreadyAdded) {
          handleAddSearch(
            tripType === "Round Trip" ? returnDate : null,
            departureDate,
            adultsCount,
            childrenCount,
            infantsCount
          );
        }

        setIsAlreadyAdded(false);
      }); // End of Promise.allSettled

    } else if (gdsSelection === "Sabre") {
      // Treat "Sabre" selection same as "Both" - hit both APIs
      const sabrePromise = getSabreFlightsData(searchParams)
        .then((data) => handleApiResponse("Sabre", data))
        .catch((error) => handleApiError("Sabre", error));

      const hititPromise = hititSearchFlights(hititParams)
        .then((data) => handleApiResponse("Hitit", data))
        .catch((error) => handleApiError("Hitit", error));

      Promise.allSettled([sabrePromise, hititPromise]).then(() => {
        // Dispatch the merged tickets and set loading to false
        setFlightTickets(mergedTickets);
        const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
        setAllTickets(filteredData);
        setAllTicketsV2(filteredData);
        setFilteredFlightTickets(mergedTickets);
        setTripOption(tripType);

        if (!isAlreadyAdded) {
          handleAddSearch(
            tripType === "Round Trip" ? returnDate : null,
            departureDate,
            adultsCount,
            childrenCount,
            infantsCount
          );
        }

        setIsAlreadyAdded(false);
      });

    } else if (gdsSelection === "Amadeus") {
      // Comment the following lines of Amadeus API
      // getFlightsData(searchParams)
      //   .then((data) => handleApiResponse("Amadeus", data))
      //   .catch((error) => handleApiError("Amadeus", error))
      //   .finally(() => {
      //     setFlightTickets(mergedTickets);
      //     // dispatch(setLoading(false));
      //     const filteredData = filterFlightsWithLowestFare(mergedTickets) || [];
      //     setAllTickets(filteredData);
      //     setAllTicketsV2(filteredData);
      //     setFilteredFlightTickets(mergedTickets);
      //
      //     if (mergedTickets.length === 0 && searchObj?.legs?.length) {
      //       // dispatch(setLoading(false));
      //       enqueueSnackbar("No Ticket Found!", {
      //         variant: "warning",
      //       });
      //     }
      //   });
    }
  };

  function determineTripType(segments) {
    if (!segments || segments.length === 0) return "Other";

    const origins = segments.map((s) => s.OriginLocation.LocationCode);
    const destinations = segments.map(
      (s) => s.DestinationLocation.LocationCode
    );

    const firstOrigin = origins[0];
    const lastDestination = destinations[destinations.length - 1];

    // 1. OneWay
    if (segments.length === 1) {
      return "OneWay";
    }

    // 2. Return (A → B → A)
    if (
      segments.length === 2 &&
      origins[0] === destinations[1] &&
      destinations[0] === origins[1]
    ) {
      return "Return";
    }

    // 3. Circle (A → B → C → A)
    if (segments.length >= 3 && firstOrigin === lastDestination) {
      return "Circle";
    }

    // 4. OpenJaw (only for 2 segments)
    if (segments.length === 2) {
      const [o1, o2] = origins;
      const [d1, d2] = destinations;

      // Destination open-jaw: A→B and C→A (B ≠ C)
      if (o1 === d2 && d1 !== o2) {
        return "OpenJaw";
      }

      // Origin open-jaw: A→B and B→C (A ≠ C)
      if (d1 === o2 && o1 !== d2) {
        return "OpenJaw";
      }
    }

    // 5. Other (complex itineraries)
    return "Other";
  }

  const handleMulticitySearch = (
    markupValue,
    staffMarkupType,
    isAddSearch,
    flightStop,
    ticketClassPara,
    airLinePreferencePara,
    currencyPreferencePara,
    searchObj
  ) => {
    const finalMarkupValue =
      markupValue !== undefined ? markupValue : markupvalue;
    const finalMarkupType =
      staffMarkupType !== undefined ? staffMarkupType : markupPreference;
    if (
      !searchObj?.legs?.length &&
      multicityFlights.some(
        (flight) => !flight.from?.code || !flight.to?.code || !flight.depart
      )
    ) {
      enqueueSnackbar(
        "Please fill in all required fields for multicity flights.",
        {
          variant: "error",
        }
      );
      return;
    }

    if (searchObj?.legs?.length) {
      addCityLabelsToSearchObj(searchObj)
        .then((updatedSearchObj) => {
          setFlightSegments(updatedSearchObj);
          setMulticityFlights(updatedSearchObj);
        })
        .catch((error) => {
          console.error("Error adding city labels:", error);
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
    } else if (
      (nearByAirport && !directFlight) ||
      (nearByAirport && directFlight)
    ) {
      lightStops = false; // If nearByAirport is true and directFlight is false, set flightStops to false
    } else if (nearByAirport && flightStops) {
      lightStops = false; // If both nearByAirport and flightStops are true, set flightStops to false
    } else if (directFlight && flightStops) {
      lightStops = flightStops; // If directFlight is true and flightStops exists, show flightStops
    }

    let multicitySearchParams, multicitySearchParamsForAmedus, body, AmedusBody;
    // Create the formatted multicity flight search parameters

    if (searchObj?.legs?.length) {
      multicitySearchParams = searchObj.legs.map((flight, index) => ({
        RPH: (index + 1).toString(),
        DepartureDateTime: `${formatDate(flight.date)}T00:00:00`,
        OriginLocation: { LocationCode: flight.source },
        DestinationLocation: { LocationCode: flight.destination },
      }));
    } else {
      multicitySearchParams = multicityFlights.map((flight, index) => ({
        RPH: (index + 1).toString(),
        DepartureDateTime: `${formatDate(flight.depart)}T00:00:00`,
        OriginLocation: { LocationCode: flight.from.code },
        DestinationLocation: { LocationCode: flight.to.code },
      }));
    }

    if (searchObj?.legs?.length) {
      multicitySearchParamsForAmedus = searchObj.legs.map((flight, index) => ({
        id: (index + 1).toString(),
        departureDateTimeRange: { date: formatDate(flight.date) },
        originLocationCode: flight.source,
        destinationLocationCode: flight.destination,
      }));
    } else {
      multicitySearchParamsForAmedus = multicityFlights.map(
        (flight, index) => ({
          id: (index + 1).toString(),
          departureDateTimeRange: { date: formatDate(flight.depart) },
          originLocationCode: flight.from.code,
          destinationLocationCode: flight.to.code,
        })
      );
    }

    if (searchObj?.legs?.length) {
      body = {
        multicityFlights: multicitySearchParams,
        adultsCount: searchObj?.adult,
        childrenCount: searchObj?.child,
        infantsCount: searchObj?.infant,
        currencyPreference: currencyPreferencePara
          ? currencyPreferencePara
          : currencyPreference,
        airLinePreference: airLinePreference?.length
          ? airLinePreference?.map((item) => item.arCode)
          : [],
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: flightStop ? flightStop : false,
        staffMarkupValue: markupValue,
        staffMarkupType,
        travelClass: onwardClass,
        tripType: determineTripType(multicitySearchParams),
      };
    } else {
      body = {
        multicityFlights: multicitySearchParams,
        adultsCount,
        childrenCount,
        infantsCount,
        currencyPreference: currencyPreferencePara
          ? currencyPreferencePara
          : currencyPreference,
        airLinePreference: airLinePreference?.length
          ? airLinePreference?.map((item) => item.arCode)
          : [],
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
        ticketCount,
        flightPriceRange,
        flightStops: lightStops,
        staffMarkupValue: markupValue,
        staffMarkupType,
        travelClass: onwardClass,
        tripType: determineTripType(multicitySearchParams),
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
        currencyPreference: currencyPreferencePara
          ? currencyPreferencePara
          : currencyPreference,
        airLinePreference: airLinePreference?.length
          ? airLinePreference?.map((item) => item.arCode)
          : [],
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
      };
    } else {
      AmedusBody = {
        multicityFlights: multicitySearchParamsForAmedus,
        adultsCount,
        childrenCount,
        infantsCount,
        staffMarkupValue: markupValue,
        staffMarkupType,
        flightStops: lightStops,
        currencyPreference: currencyPreferencePara
          ? currencyPreferencePara
          : currencyPreference,
        airLinePreference: airLinePreference?.length
          ? airLinePreference?.map((item) => item.arCode)
          : [],
        ticketClass: ticketClassPara ? ticketClassPara : ticketClass,
      };
    }

    if (gdsSelection === "Both") {
      const sabrePromise = getSabreFlightsDataMultiCity(body)
        .then((sabreApiResult) => {
          const sabreResult = sabreApiResult?.result.ticket || [];
          return sabreResult;
        })
        .catch(err => {
          console.log(err);
          return [];
        });

      // Hitit MultiCity Payload
      let hititPaxList = [];
      let paxIdCounter = 1;
      const finalAdults = searchObj?.adult || adultsCount;
      const finalChild = searchObj?.child || childrenCount;
      const finalInfant = searchObj?.infant || infantsCount;

      for (let i = 0; i < finalAdults; i++) {
        hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "ADT" });
      }
      for (let i = 0; i < finalChild; i++) {
        hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "CHD" });
      }
      for (let i = 0; i < finalInfant; i++) {
        hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "INF" });
      }

      const hititMultiParams = {
        originDestCriteria: multicitySearchParams.map((seg) => ({
          originCode: seg.OriginLocation.LocationCode,
          destCode: seg.DestinationLocation.LocationCode,
          departureDate: seg.DepartureDateTime.split("T")[0],
        })),
        paxList: hititPaxList,
        currency: currencyPreferencePara || "PKR",
        cabinClass: "Y",
        tripType: "MultiDestination",
      };

      const hititPromise = hititSearchFlights(hititMultiParams)
        .then((res) => {
          return res?.result?.ticket || [];
        })
        .catch(err => {
          console.error("Hitit MultiCity Error", err);
          return [];
        });

      Promise.all([sabrePromise, hititPromise]).then(([sabreTickets, hititTickets]) => {
        const merged = [...sabreTickets, ...hititTickets];
        setFlightTickets(merged);
        const filteredData = filterFlightsWithLowestFare(merged) || [];
        setAllTickets(filteredData);
        setAllTicketsV2(filteredData);
        setFilteredFlightTickets(merged);

        if (!isAlreadyAdded) {
          handleAddSearch(
            null,
            null,
            adultsCount,
            childrenCount,
            infantsCount
          );
        }
        setIsAlreadyAdded(false);

        if (merged.length === 0) {
          enqueueSnackbar("No flight tickets found for multicity search!", {
            variant: "info",
          });
          navigate("/b2b/searchticket");
        }
      })
        .finally(() => {
          dispatch(setLoading(false));
        });


    } else if (gdsSelection === "Sabre") {
      const sabrePromise = getSabreFlightsDataMultiCity(body)
        .then((sabreApiResult) => {
          const sabreResult = sabreApiResult?.result.ticket || [];
          return sabreResult;
        })
        .catch(err => {
          console.log(err);
          return [];
        });

      // Hitit MultiCity Payload
      let hititPaxList = [];
      let paxIdCounter = 1;
      const finalAdults = searchObj?.adult || adultsCount;
      const finalChild = searchObj?.child || childrenCount;
      const finalInfant = searchObj?.infant || infantsCount;

      for (let i = 0; i < finalAdults; i++) {
        hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "ADT" });
      }
      for (let i = 0; i < finalChild; i++) {
        hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "CHD" });
      }
      for (let i = 0; i < finalInfant; i++) {
        hititPaxList.push({ paxID: `PAX-${paxIdCounter++}`, ptc: "INF" });
      }

      const hititMultiParams = {
        originDestCriteria: multicitySearchParams.map(seg => ({
          originCode: seg.OriginLocation.LocationCode,
          destCode: seg.DestinationLocation.LocationCode,
          departureDate: seg.DepartureDateTime.split('T')[0]
        })),
        paxList: hititPaxList,
        currency: currencyPreferencePara || "PKR",
        cabinClass: "Y",
        tripType: "MultiCity"
      };

      const hititPromise = hititSearchFlights(hititMultiParams)
        .then(res => {
          return res?.result?.ticket || [];
        })
        .catch(err => {
          console.error("Hitit MultiCity Error", err);
          return [];
        });

      Promise.all([sabrePromise, hititPromise]).then(([sabreTickets, hititTickets]) => {
        const merged = [...sabreTickets, ...hititTickets];
        setFlightTickets(merged);
        const filteredData = filterFlightsWithLowestFare(merged) || [];
        setAllTickets(filteredData);
        setAllTicketsV2(filteredData);
        setFilteredFlightTickets(merged);

        if (!isAlreadyAdded) {
          handleAddSearch(
            null,
            null,
            adultsCount,
            childrenCount,
            infantsCount
          );
        }
        setIsAlreadyAdded(false);

        if (merged.length === 0) {
          enqueueSnackbar("No flight tickets found for multicity search!", {
            variant: "info",
          });
          navigate("/b2b/searchticket");
        }
      })
        .finally(() => {
          setIsAlreadyAdded(false);
          setIsModifySearchOn(false);
          dispatch(setLoading(false));
        });

    } else if (gdsSelection === "Amadeus") {
      // multiCityAmedus(AmedusBody)
      //   .then((apiResult) => {
      //     const amedusResult = apiResult?.result.tickets || [];
      //     const allTickets = [...amedusResult];
      //     setFlightTickets(allTickets);
      //
      //     const filteredData = filterFlightsWithLowestFare(allTickets) || [];
      //     setAllTickets(filteredData);
      //     setAllTicketsV2(filteredData);
      //     setFilteredFlightTickets(allTickets);
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching multicity flights:", error);
      //   })
      //   .finally(() => {
      //     setIsAlreadyAdded(false);
      //     setIsModifySearchOn(false);
      //     enqueueSnackbar("Successfully loaded Amadeus GDS!", {
      //       variant: "success",
      //     });
      //   });
    }
  };

  const handleSearch = (name, selectedDate, isTravelerSame) => {
    dispatch(setLoading(true));
    // setAirLinePreference(null);
    resetFilters();
    resetFrontendFiltersState();
    if (tripType === "Multi City") {
      handleMulticitySearch(undefined, undefined, undefined, flightStops);
    } else {
      handleSingleOrRoundTripSearch(
        undefined,
        undefined,
        name,
        selectedDate,
        isTravelerSame
      );
    }
  };

  const filterFlightsWithLowestFare = (flights) => {
    const result = [];
    const arCodeMap = new Map();

    flights.forEach((flight) => {
      const existingFlight = arCodeMap.get(flight.arCode);

      if (
        !existingFlight ||
        parseInt(flight.totalFare) < parseInt(existingFlight.totalFare)
      ) {
        arCodeMap.set(flight.arCode, flight);
      }
    });

    arCodeMap.forEach((flight) => {
      result.push(flight);
    });

    return result;
  };

  const handleViewMoreClick = (index, value) => {
    setShowAll({ value: !value, indexOf: index });
  };

  const handleViewMoreClickAmadus = async (itineraries, index) => {
    if (showAllAmdeus) {
      setShowAllAmdeus(false);
    } else {
      setIsLoadingAmadeus({ value: true, index });
      try {
        let body;
        if (markupPreference && markupvalue) {
          body = {
            staffMarkupValue: markupvalue,
            staffMarkupType: markupPreference,
            upselling: {
              data: {
                type: "flight-offers-upselling",
                flightOffers: [itineraries],
              },
            },
          };
        } else {
          body = {
            upselling: {
              data: {
                type: "flight-offers-upselling",
                flightOffers: [itineraries],
              },
            },
          };
        }

        const res = await getUpselling(body);
        setOtherBrandedFare(res?.result?.ticket);
        setShowAllAmdeus({ value: true, index });
        setIsLoadingAmadeus(false);
      } catch (error) {
        console.log(error);
        setIsLoadingAmadeus(false);
      }
    }
  };

  const formatFlightData = (
    flightData,
    airlineName,
    fare,
    apiType,
    isMultiCity,
    returnFlightData
  ) => {
    if (isMultiCity) {
      const formattedFlights = flightData
        .map((dep) => {
          // Format the departure and arrival times
          const departureDate = new Date(
            apiType === "sabre" ? dep.departure?.date : dep.departureTime
          );
          const arrivalDate = new Date(
            apiType === "sabre" ? dep.arrival?.date : dep.arrivalTime
          );

          // Get day, month, year, and time for both departure and arrival
          const departureDay = departureDate.toLocaleString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
          const departureTime = departureDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const arrivalDay = arrivalDate.toLocaleString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
          const arrivalTime = arrivalDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Calculate duration (in hours and minutes) from elapsedTime
          const durationMatch = dep.elapsedTime.match(/PT(\d+)H(\d+)M/);
          const hours = durationMatch
            ? durationMatch[1].padStart(2, "0")
            : "00";
          const minutes = durationMatch
            ? durationMatch[2].padStart(2, "0")
            : "00";
          const duration = `${hours} Hrs ${minutes} Mins`;

          // Format the flight string
          return `
    Flight: ${dep.logo.code} ${dep.marketing} ${dep.marketingFlightNumber}
    From: ${apiType === "sabre" ? dep.departure?.airport : dep.departureLocation
            } | ${apiType === "sabre" ? dep.departure?.date : departureDay} ${apiType === "sabre"
              ? extractTime(dep?.departure?.time)
              : departureTime
            }
    To: ${apiType === "sabre" ? dep.arrival?.airport : dep.arrivalLocation} | ${apiType === "sabre" ? dep.arrival?.date : arrivalDay
            } ${apiType === "sabre" ? extractTime(dep?.arrival?.time) : arrivalTime
            }
    Duration: ${duration}
    Fare: Rs.${fare}`;
        })
        .join("\n");

      return formattedFlights;
    } else {
      const formattedFlights = flightData
        .map((dep, index) => {
          // Format the departure and arrival times
          const departureDate = new Date(dep.departureTime);
          const arrivalDate = new Date(dep.arrivalTime);

          // Get day, month, year, and time for both departure and arrival
          const departureDay = departureDate.toLocaleString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
          const departureTime = departureDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const arrivalDay = arrivalDate.toLocaleString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
          const arrivalTime = arrivalDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Calculate duration (in hours and minutes) from elapsedTime
          const durationMatch = dep.elapsedTime.match(/PT(\d+)H(\d+)M/);
          const hours = durationMatch
            ? durationMatch[1].padStart(2, "0")
            : "00";
          const minutes = durationMatch
            ? durationMatch[2].padStart(2, "0")
            : "00";
          const duration = `${hours} Hrs ${minutes} Mins`;

          // Format the flight string
          return `
    Flight: ${(apiType === "amadus" || apiType === "amadeus") && dep?.logo?.ar
              ? dep?.logo?.ar
              : airlineName
            } ${dep.marketing} ${dep.marketingFlightNumber}
    From: ${dep.departureLocation} | ${departureDay} ${departureTime}
    To: ${dep.arrivalLocation} | ${arrivalDay} ${arrivalTime}
    Duration: ${duration}
    ${flightData?.length > 1 && index !== 0
              ? `Fare: Rs.${fare}`
              : flightData?.length === 1
                ? `Fare: Rs.${fare}`
                : ""
            }
            `;
        })
        .join("\n");

      return formattedFlights;

      // Baggage Detail:
      // Check-In:
      // ${passengerTypes.map((type) => (flightData?.extra?.[type]?.count > 0 && `${type.charAt(0).toUpperCase() +
      //           type.slice(1)} : ${getCheckinText(type, flightData)}`))}
    }
  };

  const copyToClipboard = (flightData, totalFare) => {
    const formattedFlightInfo = formatFlightData(
      flightData?.flights ? flightData?.flights : flightData?.departure,
      flightData?.arCode,
      totalFare ? totalFare : flightData?.passengerTotalFare,
      flightData?.api,
      flightData?.flights ? true : false
    );

    let formattedReturnFlightData = "";
    if (flightData?.return) {
      formattedReturnFlightData = formatFlightData(
        flightData?.flights ? flightData?.flights : flightData?.return,
        flightData?.arCode,
        totalFare ? totalFare : flightData?.passengerTotalFare,
        flightData?.api,
        flightData?.flights ? true : false
      );
    }

    const newFormattedFlights =
      formattedFlightInfo +
      (formattedReturnFlightData
        ? "\n\nReturn Flights:\n" + formattedReturnFlightData
        : "");

    navigator.clipboard
      .writeText(newFormattedFlights)
      .then(() => {
        enqueueSnackbar("Flight data copied to clipboard!", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        enqueueSnackbar("Failed to copy flight data.", {
          variant: "error",
        });
      });
  };

  function getPriceRangeFromFlights(flights) {
    if (!Array.isArray(flights) || flights.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = flights
      .map((f) => parseFloat(f.totalFare))
      .filter((price) => !isNaN(price));

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  }

  function applyMarkup(markupPreference, markupValue) {
    const markup = parseFloat(markupValue);
    const data = flightTickets;

    if (isNaN(markup) || markup < 0) {
      setAllTickets(filterFlightsWithLowestFare(data));
      // const { min: MIN, max: MAX } = getPriceRangeFromFlights(data);
      // setMAX(MAX);
      // setMIN(MIN);
      // setPriceRange(MAX)
      return data; // optional: handle invalid values
    }

    const newMarkupFlights = data.map((item) => {
      const originalFare = parseFloat(item.passengerTotalFare);
      const originalTotalFare = parseFloat(item.totalFare);
      let newFare = originalFare;
      let newTotalFare = originalTotalFare;

      if (markupPreference === "Percentage") {
        newFare += (originalFare * markup) / 100;
        newTotalFare += (originalTotalFare * markup) / 100;
      } else if (markupPreference === "Amount") {
        newFare += markup;
        newTotalFare += markup;
      }

      // Apply markup to each adjustedFare in brandedFare
      // Helper to apply markup to a single fare object
      const calcFareMarkup = (fare) => {
        const originalAdjustedFare = parseFloat(fare.adjustedPrice || fare.fare || 0);
        const originalTotalFare = parseFloat(fare.totalFare || fare.fare || 0);

        let updatedAdjustedFare = originalAdjustedFare;
        let updatedTotalFare = originalTotalFare;

        if (markupPreference === "Percentage") {
          updatedAdjustedFare += (originalAdjustedFare * markup) / 100;
          updatedTotalFare += (originalTotalFare * markup) / 100;
        } else if (markupPreference === "Amount") {
          updatedAdjustedFare += markup;
          updatedTotalFare += markup;
        }

        return {
          ...fare,
          adjustedPrice: parseInt(updatedAdjustedFare.toFixed(2)),
          totalFare: parseInt(updatedTotalFare.toFixed(2)),
          fare: fare.fare ? parseInt(updatedTotalFare.toFixed(2)) : fare.fare,
        };
      };

      // Apply markup to each adjustedFare in brandedFare
      let updatedBrandedFare = item.brandedFare || [];
      if (Array.isArray(item.brandedFare)) {
        updatedBrandedFare = item.brandedFare.map(calcFareMarkup);
      } else if (item.brandedFare?.data && Array.isArray(item.brandedFare.data)) {
        updatedBrandedFare = {
          ...item.brandedFare,
          data: item.brandedFare.data.map(calcFareMarkup)
        };
      }
      return {
        ...item,
        totalFare: parseInt(newTotalFare.toFixed(2)), // keeping it to 2 decimal places as string
        passengerTotalFare: parseInt(newFare.toFixed(2)),
        brandedFare: updatedBrandedFare,
      };
    });

    setAllTickets(filterFlightsWithLowestFare(newMarkupFlights));
    const { min: MIN, max: MAX } = getPriceRangeFromFlights(newMarkupFlights);
    setMAX(MAX);
    setMIN(MIN);
    setPriceRange(MAX);

    return newMarkupFlights;
  }

  function handleResetMarkup() {
    setMarkupValue("");
    setMarkupPreference("Amount");

    applyAllFilters(flightTickets, {
      selectedAirlinesOption,
      priceRange,
      selectedConnectingAirports,
      selectedFareTypes,
      selectedDepartureTimes,
      selectedArrivalTimes,
      selectedStops,
      markupValue: "",
    });
  }

  function transformFlightData(
    input,
    selectedBrandedFare,
    tripType,
    brandInfo
  ) {
    if (!input || !input.departure) return [];

    const bookingDate = new Date().toISOString().split("T")[0];

    // Build segment list based on tripType
    const segments =
      tripType === "One Way"
        ? [...input.departure]
        : tripType === "Round Trip"
          ? [...input.departure, ...input.return]
          : [input.departure];

    return segments.map((segment, index) => {
      console.log("Brand Info:", brandInfo, "Index:", index);
      // Correct brandIndex logic (must be inside the map)
      const brandIndex =
        index < brandInfo.length ? index : brandInfo.length - 1;

      return {
        FlightNumber: segment.marketingFlightNumber.toString(),
        DepartureAirport: segment.departureLocation,
        ArrivalAirport: segment.arrivalLocation,
        MarketingAirline: segment.marketingCarrier || segment.marketing,
        DepartureDate: segment.departureTime,
        ArrivalDate: segment.arrivalTime,
        BookingDate: bookingDate,

        // bookingCode array from input.itineraries
        ResBookDesigCode:
          input?.itineraries?.[0]?.bookingCode?.[index] || "N/A",

        ValidatingCarrier: segment.operating || segment.marketingCarrier,

        farebase: [
          {
            FareBasisCode: brandInfo?.[brandIndex] || "N/A",
            PassengerType:
              input.brandedFare?.[0]?.data?.[0]?.passengerType || "ADT",
          },
        ],
      };
    });
  }

  const fetchSabreFareRules = async (flightDetail) => {
    // const body = {
    //   adult: flight?.extra?.adult?.count || 0,
    //   child: flight?.extra?.child?.count || 0,
    //   infant: flight?.extra?.infant?.count || 0,
    //   // brandInfo: flight.brandedFare[0]?.brandInfo,
    //   flightDetails: transformFlightData(
    //     flight,
    //     selectedBrandedFare,
    //     tripType,
    //     brand
    //   ),
    //   ValidatingCarrier:
    //     flight?.departure?.[0]?.operating ||
    //     flight?.departure?.[0]?.marketingCarrier,
    // };

    try {
      const res = await getSabreFareRules({ ...flightDetail });
      return res?.result?.rawResponse?.["soap-env:Envelope"]?.["soap-env:Body"]
        ?.StructureFareRulesRS;
    } catch (err) {
      console.error("Fare rules error", err);
      return null;
    }
  };

  const passengerTypes = ["adult", "child", "infants"];

  const getConnectingAirports = (flightsData) => {
    const connectingAirports = new Set(); // To store unique connecting airports
    const codesToExclude = new Set();
    let filteredAirportCodes = [];

    flightsData?.forEach((airlineData) => {
      const departureLocations = new Set(); // To store unique departure locations
      const arrivalLocations = new Set(); // To store unique arrival locations

      if (tripType === "Multi City") {
        airlineData.flights?.forEach((flight) => {
          departureLocations.add(
            airlineData?.api === "sabre"
              ? flight.departure?.airport
              : flight.departureLocation
          );
          arrivalLocations.add(
            airlineData?.api === "sabre"
              ? flight.arrival?.airport
              : flight.arrivalLocation
          );
        });
      } else {
        // Loop through the departure array
        airlineData.departure?.forEach((flight) => {
          departureLocations.add(flight.departureLocation);
          arrivalLocations.add(flight.arrivalLocation);
        });
      }

      // Find common airports between departure and arrival locations
      departureLocations?.forEach((departure) => {
        if (arrivalLocations.has(departure)) {
          connectingAirports.add(departure);
        }
      });
    });

    if (tripType === "Multi City") {
      multicityFlights.forEach((flight) => {
        if (flight.from && flight.from.code) {
          codesToExclude.add(flight.from.code);
        }
        if (flight.to && flight.to.code) {
          codesToExclude.add(flight.to.code);
        }
      });

      filteredAirportCodes = Array.from(connectingAirports)?.filter(
        (code) => !codesToExclude.has(code)
      );
    }

    // Convert the Set to an array and return it
    return tripType === "Multi City"
      ? filteredAirportCodes
      : Array.from(connectingAirports);
  };

  function getMinFareByStops(flightsData) {
    const stopFareMap = {};

    flightsData?.forEach((flight) => {
      let stopCount = 0;

      if (tripType === "Multi City") {
        const segments = flight.flights || [];
        const isSabre = flight.api === "sabre";

        // Extract all departure airports (for sabre) or departureLocation (for others)
        const airportCodes = segments
          .map((seg) =>
            isSabre ? seg.departure?.airport : seg.departureLocation
          )
          .filter(Boolean); // remove undefined/null

        if (airportCodes.length > 1) {
          const origin = airportCodes[0];
          const destination =
            segments[segments.length - 1]?.arrival?.airport || "";

          // Exclude origin and destination to get stops
          const stops = airportCodes
            .slice(1)
            .filter((code) => code !== destination && code !== origin);

          // Use Set to get unique stops
          stopCount = new Set(stops).size;
        }
      } else {
        // In non-multicity case, fallback to length-1 assumption
        stopCount = (flight.departure?.length || 1) - 1;
      }

      const fare = parseFloat(flight.totalFare);

      // Track the minimum fare for each stop count
      if (
        !stopFareMap[stopCount] ||
        fare < parseFloat(stopFareMap[stopCount])
      ) {
        stopFareMap[stopCount] = flight.totalFare;
      }
    });

    return Object.entries(stopFareMap).map(([number, value]) => ({
      number: parseInt(number),
      value,
    }));
  }

  useEffect(() => {
    if (flightTickets?.length) {
      setAllTickets(filterFlightsWithLowestFare(flightTickets));
      setAllTicketsV2(filterFlightsWithLowestFare(flightTickets));
      const { min: MIN, max: MAX } = getPriceRangeFromFlights(flightTickets);
      setMAX(MAX);
      setMIN(MIN);
      setPriceRange(MAX);
    }
  }, [flightTickets]);

  useEffect(() => {
    if (flightTickets.length !== 0) {
      // handleoffDivs()
      if (selectedArCode) {
        const filteredData = filterFlightsWithLowestFare(flightTickets) || [];
        setAllTickets(filteredData);
        setAllTicketsV2(filteredData);
        filterFlightsByArCodeRefetch(selectedArCode, filteredData);
      } else {
        const filteredData = filterFlightsWithLowestFare(flightTickets) || [];
        setAllTickets(filteredData);
        setAllTicketsV2(filteredData);
        setFilteredFlightTickets(flightTickets);
      }
    }
  }, [flightTickets]);

  useEffect(() => {
    setAdults(adultsCount);
    setChildren(childrenCount);
    setInfants(infantsCount);
    setTripOption(tripType);

    if (tripType === "Multi City") {
      setFlightSegments(multicityFlights);
    }

    // Use ref guard to prevent React StrictMode from firing the search twice
    if (tripType !== "Multi City" && !hasSearchedRef.current) {
      hasSearchedRef.current = true;
      handleSearch();
    }
  }, []);

  useEffect(() => {
    if (
      tripType === "Multi City" &&
      multicityFlights?.[1]?.to?.code &&
      !isModifySearchOn
    ) {
      handleSearch();
    }
  }, [multicityFlights]);

  const [activeDropdown, setActiveDropdown] = useState({
    type: null,
    index: null,
  }); // For Multi City
  const [searchTerms, setSearchTerms] = useState({}); // For Multi City

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        alignContent: "center",
        flexDirection: "column",
      }}
    >
      <B2BheaderV2 />
      <Box
        sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ width: "85%", height: "auto" }}>
          <Box
            sx={{
              width: "100%",
              minHeight: { sm: "150px", md: "150px", lg: "125px" },
              maxHeight: "auto",
            }}
          >
            <Box
              sx={{
                display: { sm: "block", md: "block", lg: "flex" },
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mt: "5px",
                minHeight: "30%",
                maxHeight: "auto",
              }}
            >
              <Button
                startDecorator={<ArrowBackIosIcon />}
                onClick={() => navigate("/b2b/searchticket")}
                variant="plain"
                color="neutral"
                sx={{ fontWeight: 600 }}
              >
                Back
              </Button>
              <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{ gap: 1.5, width: "auto" }}
              >
                <FormControl>
                  <Select
                    value={tripType}
                    onChange={(e, val) => {
                      setTripType(val);
                    }}
                    size="md"
                    defaultValue={"First"}
                    sx={{
                      textTransform: "capitalize",
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "transparent" },
                      "&.Mui-focused": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                    indicator={null}
                    endDecorator={<ArrowDropDownIcon />}
                  >
                    {["One Way", "Round Trip", "Multi City"].map((opt) => (
                      <Option
                        key={opt}
                        value={opt}
                        sx={{ p: 1, width: "200px" }}
                      >
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
                {/* Traveller Select */}
                <Box position="relative">
                  <FormControl>
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
                      size="md"
                      sx={{
                        textTransform: "capitalize",
                        border: "none",
                        boxShadow: "none",
                        backgroundColor: "transparent",
                        "&:hover": { backgroundColor: "transparent" },
                        "&.Mui-focused": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                      }}
                      indicator={null}
                      endDecorator={<ArrowDropDownIcon />}
                    >
                      <Option value="select">
                        <Stack
                          direction="column"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Typography level="title-sm">Adults</Typography>
                          {renderOptions(8, adults, setAdults, setAdultsCount)}

                          <Typography level="title-sm" mt={2}>
                            Children 2–12 Years
                          </Typography>
                          {renderOptions(
                            9,
                            children,
                            setChildren,
                            setChildrenCount
                          )}

                          <Typography level="title-sm" mt={2}>
                            Infants 0–23 Months
                          </Typography>
                          {renderOptions(
                            9,
                            infants,
                            setInfants,
                            setInfantsCount
                          )}
                        </Stack>
                        <Button
                          onClick={() => {
                            setOpen(!open);
                          }}
                          variant="plain"
                          size="sm"
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "5px",
                            width: "20px",
                          }}
                        >
                          <CloseIcon />
                        </Button>
                      </Option>
                    </Select>
                  </FormControl>
                </Box>

                {/*  
                          {/* Onward Class Select */}
                {/* {(tripType === "Round Trip" || tripType === "One Way") && (
                  
                )} */}

                <>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        backgroundColor: "#036bb0",
                        color: "white",
                        p: 0.3,
                        borderRadius: "5px",
                      }}
                    >
                      CLASS
                    </Typography>
                  </Box>
                  <FormControl>
                    <Select
                      value={onwardClass}
                      onChange={(e, val) => setOnwardClass(val)}
                      size="md"
                      placeholder={
                        onwardClass?.charAt(0).toUpperCase() +
                        onwardClass?.slice(1)
                      }
                      sx={{
                        zIndex: 999,
                        textTransform: "capitalize",
                        border: "none",
                        boxShadow: "none",
                        backgroundColor: "transparent",
                        "&:hover": { backgroundColor: "transparent" },
                        "&.Mui-focused": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                      }}
                      indicator={null}
                      endDecorator={<ArrowDropDownIcon />}
                    >
                      {["Economy", "Premium", "Business", "First"].map(
                        (opt) => (
                          <Option
                            key={opt}
                            value={opt}
                            sx={{ p: 1, width: "200px", zIndex: 999 }}
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
                        )
                      )}
                    </Select>
                  </FormControl>
                </>

                {/* Return Class Select (if round trip) */}
                {/* {tripType === "Round Trip" && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          backgroundColor: "#036bb0",
                          color: "white",
                          p: 0.3,
                          borderRadius: "5px",
                        }}
                      >
                        RC
                      </Typography>
                    </Box>
                    <FormControl>
                      <Select
                        value={returnClass}
                        onChange={(e, val) => setReturnClass(val)}
                        size="md"
                        defaultValue={"First"}
                        sx={{
                          textTransform: "capitalize",
                          border: "none",
                          boxShadow: "none",
                          backgroundColor: "transparent",
                          "&:hover": { backgroundColor: "transparent" },
                          "&.Mui-focused": {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                          },
                        }}
                        indicator={null}
                        endDecorator={<ArrowDropDownIcon />}
                      >
                        {["Economy", "Premium", "Business", "First"].map(
                          (opt) => (
                            <Option
                              key={opt}
                              value={opt}
                              sx={{ p: 1, width: "200px" }}
                            >
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
                          )
                        )}
                      </Select>
                    </FormControl>
                  </>
                )} */}

                {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      backgroundColor: "#036bb0",
                      color: "white",
                      p: 0.3,
                      borderRadius: "5px",
                    }}
                  >
                    GDS
                  </Typography>
                </Box>
                <FormControl>
                  <Select
                    value={gdsSelection}
                    onChange={(e, val) => setGdsSelection(val)}
                    size="md"
                    placeholder={
                      gdsSelection?.charAt(0).toUpperCase() +
                      gdsSelection?.slice(1)
                    }
                    sx={{
                      zIndex: 999,
                      textTransform: "capitalize",
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "transparent" },
                      "&.Mui-focused": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                    indicator={null}
                    endDecorator={<ArrowDropDownIcon />}
                  >
                    {["Sabre", "Amadeus", "Both"].map(
                      (opt) => (
                        <Option
                          key={opt}
                          value={opt}
                          sx={{ p: 1, width: "200px", zIndex: 999 }}
                        >
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
                      )
                    )}
                  </Select>
                </FormControl> */}
              </Stack>

              {/* <Stack
                direction="row"
                justifyContent={{ sm: "flex-start", md: "flex-start", lg: "flex-end" }}
                alignItems="center"
                sx={{ gap: 0, width: "70%", ml: { sm: "10px", md: "10px", lg: "0px" }, mt: { sm: "10px", md: "10px", lg: "0px" } }}
              >
                <Typography
                  sx={{ fontSize: "14px", mr: "10px", fontWeight: 400 }}
                >
                  Airline prefrences
                </Typography>

                <Box sx={{ position: "relative", display: "flex" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      sx={{
                        borderRadius: "20px",
                        // backgroundColor: "#f7ebf5",
                        backgroundColor: "lightyellow",

                        width: "7rem",
                        height: "1.6rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                        mr: "20px",
                        color: "black",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onClick={handleAirlineSelect}
                    >
                      {selectedAirlines.length === airlines.length
                        ? "All Airlines"
                        : "Select Airlines"}
                      {selectedAirlines.length === airlines.length && (
                        <CancelIcon
                          sx={{ color: "#185ea5" }}
                          onClick={handleCloseClick}
                        />
                      )}
                    </Typography>
                  </Box>

                  {airlineText === "All Airlines" ? (
                    <Box></Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mr: "10px",
                      }}
                    >
                      {selectedAirlines.length !== airlines.length &&
                        selectedAirlines
                          .slice(0, 2)
                          .map((airlineName, index) => (
                            <Box key={index}>
                              <Typography
                                sx={{
                                  borderRadius: "20px",
                                  backgroundColor: "#f7ebf5",
                                  width: "auto",
                                  height: "2rem",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "5px",
                                  mr: "20px",
                                  color: "black",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                  ml: 0.3,
                                  px: 0.8,
                                  py: 0.4,
                                }}
                              >
                                {airlineName}
                                <CancelIcon
                                  sx={{
                                    color: "#185ea5",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                  }}
                                  onClick={() => {
                                    setSelectedAirlines(
                                      selectedAirlines.filter(
                                        (name) => name !== airlineName
                                      )
                                    );
                                  }}
                                />
                              </Typography>
                            </Box>
                          ))}

                      {selectedAirlines.length > 2 &&
                        selectedAirlines.length !== airlines.length && (
                          <Typography
                            sx={{
                              borderRadius: "20px",
                              backgroundColor: "#fff0fd",
                              width: "auto",
                              height: "2rem",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "5px",
                              mr: "20px",
                              color: "black",
                              fontSize: "14px",
                              cursor: "pointer",
                              ml: 0.3,
                              px: 0.8,
                              py: 0.4,
                            }}
                            onClick={handleCloseClick}
                          >
                            +{selectedAirlines.length - 2} more
                          </Typography>
                        )}
                    </Box>
                  )}

                  {isAirlinesOpen && (
                    <Box
                      ref={dropdownRef}
                      sx={{
                        position: "absolute",
                        top: "40px",
                        left: "0",
                        width: "300px",
                        backgroundColor: "white",
                        borderRadius: "sm",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                        p: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography sx={{ mb: 1 }}>Search Airlines</Typography>
                        <CancelIcon
                          onClick={handleCloseDropdown}
                          sx={{
                            cursor: "pointer",
                            height: "25px",
                            width: "25px",
                          }}
                        />
                      </Box>{" "}
                      <Input
                        placeholder="Search Airlines"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ mb: 2 }}
                        fullWidth
                      />
                      <List>
                        <ListItem>
                          <Checkbox
                            checked={
                              selectedAirlines.length === airlines.length
                            }
                            onChange={handleAllAirlinesSelect}
                          />
                          <Typography>All Airlines</Typography>
                        </ListItem>
                        {filteredAirlines.map((airline) => (
                          <ListItem key={airline.name}>
                            <Checkbox
                              checked={selectedAirlines.includes(airline.name)}
                              onChange={() =>
                                handleIndividualAirlineSelect(airline.name)
                              }
                            />

                            <Typography>
                              {airline.name} [{airline.id}]
                            </Typography>
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
                        "& .MuiSvgIcon-root": {
                          borderRadius: "50%",
                          backgroundColor: "#fff0fd",
                          color: "white",
                          padding: "3px",
                          marginLeft: "5px",
                          color: "black",
                          border: "1px solid grey",
                        },
                        "&.Mui-checked": {
                          color: "black",
                          marginLeft: "5px",
                        },
                      }}
                      defaultChecked
                    />
                  }
                  label={
                    <Typography
                      sx={{ color: "#185ea5", fontWeight: 600, ml: "10px", fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                    >
                      Low Cost Airlines
                    </Typography>
                  }
                />
                {netFare ? (
                  <VisibilityOffIcon
                    sx={{ fontSize: "26px", cursor: "pointer" }}
                    onClick={() => handleNetFare()}
                  />
                ) : (
                  <VisibilityIcon
                    sx={{ fontSize: "26px", cursor: "pointer" }}
                    onClick={() => handleNetFare()}
                  />
                )}
              </Stack> */}
            </Box>
            <Divider />
            <Box
              sx={{ width: "100%", display: "flex", height: "70%", py: "5px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "70%",
                  // minHeight: "50px",
                  // maxHeight: "auto",
                  height: "50px",
                }}
              >
                {tripType === "Round Trip" || tripType === "One Way" ? (
                  <>
                    <Box
                      sx={{
                        width: "50%",
                        display: "flex",
                        p: 2,
                        height: "100%",
                        alignItems: "center",
                      }}
                    >
                      {/* FROM Container */}
                      <Box
                        ref={fromBoxRef}
                        sx={{ width: "48%" }}
                        onClick={handleFromDropdownToggle}
                      >
                        {/* <Typography fontSize="16px" color="text.tertiary" sx={{ mb: 0.5 }}>
                             FROM
                           </Typography> */}
                        <Typography
                          fontSize="20px"
                          fontWeight="700"
                          sx={{
                            mb: 0.5,
                            fontSize: { sm: "16px", md: "18px", lg: "20px" },
                          }}
                        >
                          {fromLocation.code}
                        </Typography>
                        <Typography
                          fontSize="12px"
                          color="text.tertiary"
                          sx={{
                            fontSize: { sm: "9px", md: "10px", lg: "12px" },
                          }}
                        >
                          {fromLocation.name}
                        </Typography>
                      </Box>

                      {/* Divider */}

                      <Divider
                        sx={{
                          height: "100%",
                          "--Divider-lineColor": "grey",
                          "--Divider-thickness": "2px",
                          fontWeight: "bold",
                        }}
                        orientation="vertical"
                      >
                        <SwapHorizIcon
                          sx={{
                            height: "20px",
                            width: "20px",
                            cursor: "pointer",
                          }}
                          onClick={handleSwapLocations}
                        />
                      </Divider>

                      {/* TO Container */}
                      <Box
                        ref={toBoxRef}
                        sx={{ width: "48%", pl: "20px" }}
                        onClick={handleToDropdownToggle}
                      >
                        {/* <Typography fontSize="16px" color="text.tertiary" sx={{ mb: 0.5 }}>
                             TO
                           </Typography> */}
                        <Typography
                          fontWeight="700"
                          sx={{
                            mb: 0.5,
                            fontSize: { sm: "16px", md: "18px", lg: "20px" },
                          }}
                        >
                          {toLocation.code}
                        </Typography>
                        <Typography
                          fontSize="12px"
                          color="text.tertiary"
                          sx={{
                            fontSize: { sm: "9px", md: "10px", lg: "12px" },
                          }}
                        >
                          {toLocation.name}
                        </Typography>
                      </Box>

                      {/* FROM Dropdown */}
                      <LocationDropdown
                        isOpen={isFromDropdownOpen}
                        onClose={() => setIsFromDropdownOpen(false)}
                        onLocationSelect={(location) =>
                          handleLocationSelect(location, "from")
                        }
                        anchorEl={fromBoxRef.current}
                        title="Select Departure Location"
                        initialLocation={fromLocation}
                        type={"from"}
                        page={"search flight"}
                      />

                      {/* TO Dropdown */}
                      <LocationDropdown
                        isOpen={isToDropdownOpen}
                        onClose={() => setIsToDropdownOpen(false)}
                        onLocationSelect={(location) =>
                          handleLocationSelect(location, "to")
                        }
                        anchorEl={toBoxRef.current}
                        title="Select Destination Location"
                        initialLocation={toLocation}
                        type={"to"}
                        page={"search flight"}
                      />
                    </Box>

                    <Box
                      sx={{
                        width: "50%",
                        display: "flex",
                        p: 2,
                        height: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "100%",
                          width: "2px",
                          bgcolor: "grey",
                          mr: "10px",
                        }}
                      />

                      {/* Depart Section */}
                      <Box
                        ref={departRef}
                        sx={{ width: "50%" }}
                        onClick={handleDepartToggle}
                      >
                        <Typography
                          color="text.tertiary"
                          sx={{
                            mb: 0.5,
                            display: "flex",
                            alignItems: "center",
                            fontSize: { sm: "14px", md: "16px", lg: "18px" },
                          }}
                        >
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
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {" DEPART"}
                        </Typography>
                        <Typography
                          fontWeight="700"
                          sx={{
                            mb: 0.5,
                            fontSize: { sm: "17px", md: "19px", lg: "21px" },
                          }}
                        >
                          {formatDateV2(departDate)}
                        </Typography>
                      </Box>

                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "100%",
                          width: "2px",
                          bgcolor: "grey",
                        }}
                      />

                      {/* Return Section */}
                      <Box
                        ref={returnRef}
                        sx={{ width: "50%", pl: "10px" }}
                        onClick={() => {
                          handleReturnToggle();
                          if (tripType === "One Way") {
                            setTripType("Round Trip");
                            setSelected("Round Trip");
                            setReturnDate(
                              new Date(departDate)?.getTime() +
                              7 * 24 * 60 * 60 * 1000
                            );
                          }
                        }}
                      >
                        <Typography
                          color="text.tertiary"
                          sx={{
                            mb: 0.5,
                            display: "flex",
                            alignItems: "center",
                            fontSize: { sm: "14px", md: "16px", lg: "18px" },
                          }}
                        >
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
                          {" RETURN"}
                        </Typography>
                        {tripType === "One Way" ? (
                          <Typography
                            fontWeight="600"
                            sx={{
                              mb: 0.5,
                              fontSize: { sm: "10px", md: "13px", lg: "16px" },
                            }}
                          >
                            Book a round trip
                          </Typography>
                        ) : (
                          <>
                            <Typography
                              fontWeight="700"
                              sx={{
                                mb: 0.5,
                                fontSize: {
                                  sm: "16px",
                                  md: "18px",
                                  lg: "20px",
                                },
                              }}
                            >
                              {formatDateV2(returnDate)}
                            </Typography>
                          </>
                        )}
                      </Box>
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "100%",
                          width: "2px",
                          bgcolor: "grey",
                        }}
                      />
                      {/* Depart Date Picker */}
                      <DatePicker
                        isOpen={isDepartOpen}
                        onClose={() => setIsDepartOpen(false)}
                        onDateSelect={handleDateChange}
                        selectedDate={departDate}
                        title="Select Departure Date"
                        name="departureDate"
                        page={"search flight"}
                        openDatePicker={true}
                      />

                      {/* Return Date Picker */}
                      <DatePicker
                        isOpen={isReturnOpen}
                        onClose={() => setIsReturnOpen(false)}
                        onDateSelect={handleDateChange}
                        selectedDate={returnDate}
                        title="Select Return Date"
                        name="returnDate"
                        page={"search flight"}
                        openDatePicker={true}
                      />
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    {multicityFlights.map((segment, index) => (
                      <>
                        <Box
                          sx={{
                            width: "20%",
                            display: "flex",
                            p: 1,
                            height: "100%",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          onClick={handleMulticitySegment}
                        >
                          <Typography sx={{ fontSize: "12px" }}>
                            Trip {index + 1}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { sm: "12px", md: "14px", lg: "16px" },
                              fontWeight: 700,
                            }}
                          >{`${segment.from.code} - ${segment.to.code}`}</Typography>
                          <Typography
                            sx={{
                              fontSize: { sm: "10px", md: "12px", lg: "14px" },
                            }}
                          >
                            {moment(segment.depart).format("DD MMM’YY ddd")}
                          </Typography>
                        </Box>
                        <Divider
                          orientation="vertical"
                          sx={{
                            height: "100%",
                            width: "2px",
                            bgcolor: "grey",
                          }}
                        />
                      </>
                    ))}
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  py: "10px",
                }}
              >
                <Box
                  sx={{
                    width: { sm: "40%", md: "50%", lg: "50%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: { sm: "0rem", md: "0.5rem", lg: "0.75rem" },
                  }}
                >
                  {(tripType === "Round Trip" || tripType === "One Way") && (
                    <Checkbox
                      label="Direct Flight"
                      checked={directFlight}
                      onChange={() => {
                        setDirectFlight((prevState) => !prevState);
                      }}
                      sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                    />
                  )}
                  <Checkbox
                    label="Nearby Airports"
                    checked={nearByAirport}
                    onChange={() => {
                      setNearByAirport((prevState) => !prevState);
                    }}
                    sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                  />
                </Box>
                <Box
                  sx={{
                    width: { sm: "60%", md: "50%", lg: "50%" },
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {(tripType === "Round Trip" || tripType === "One Way") && (
                    <Button
                      onClick={handleSearch}
                      sx={{
                        backgroundColor: "#036bb0",
                        color: "white",
                        width: { sm: "100px", md: "110px", lg: "150px" },
                        height: { sm: "25px", md: "35px", lg: "45px" },
                        borderRadius: "10px",
                        border: "none",
                        fontSize: { sm: "12px", md: "12px", lg: "18px" },
                        fontWeight: "400",
                        marginRight: { sm: "0px", md: "5px", lg: "20px" },
                      }}
                    >
                      Search Flight
                    </Button>
                  )}

                  {tripType === "Multi City" &&
                    (openSegment ? (
                      <Button
                        sx={{
                          backgroundColor: "#036bb0",
                          color: "white",
                          width: { sm: "110px", md: "130px", lg: "150px" },
                          height: { xs: "25px", lg: "45px" },
                          borderRadius: "10px",
                          border: "none",
                          fontSize: { sm: "12px", md: "14px", lg: "18px" },
                          fontWeight: "400",
                          marginRight: "20px",
                        }}
                        onClick={() => {
                          handleMulticitySegment();
                          setIsModifySearchOn(false);
                        }}
                      >
                        Close
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          backgroundColor: "#036bb0",
                          color: "white",
                          width: { sm: "110px", md: "130px", lg: "150px" },
                          height: { xs: "35px", lg: "55px" },
                          borderRadius: "10px",
                          border: "none",
                          fontSize: { sm: "12px", md: "14px", lg: "18px" },
                          fontWeight: "400",
                          marginRight: "20px",
                        }}
                        onClick={() => {
                          handleMulticitySegment();
                          setIsModifySearchOn(true);
                        }}
                      >
                        Modify Search
                      </Button>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
          {tripType === "Multi City" && (
            <>
              {openSegment && (
                <>
                  <MulticityV2
                    {...{
                      flightSegments,
                      setFlightSegments,
                      activeDropdown,
                      setActiveDropdown,
                      searchTerms,
                      setSearchTerms,
                      setMulticityFlights,
                      multicityFlights,
                    }}
                  />

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 1,
                    }}
                  >
                    <Button
                      onClick={handleSearch}
                      sx={{
                        backgroundColor: "#036bb0",
                        color: "white",
                        width: { sm: "110px", md: "130px", lg: "150px" },
                        height: { xs: "25px", lg: "45px" },
                        borderRadius: "10px",
                        border: "none",
                        fontSize: { sm: "12px", md: "14px", lg: "18px" },
                        fontWeight: "400",
                        marginRight: "20px",
                      }}
                    >
                      Search Flight
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#79717e17",
        }}
      >
        <Box
          sx={{ width: { sm: "95%", md: "95%", lg: "95%" }, height: "auto" }}
        >
          <Box
            sx={{
              width: "100%",
              height: "auto",
              mt: "10px",
              display: "flex",
              justifyContent: "space-around",
              gap: "30px",
            }}
          >
            {/* side bar */}

            <Box
              sx={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                height: "70vh",
                overflowY: "scroll",
                overflowX: "hidden",
                p: 1.5,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontSize: { sm: "14px", md: "18px", lg: "22px" },
                    fontWeight: 400,
                  }}
                >
                  Filter Your Search
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    cursor: "pointer",
                    fontSize: { sm: "12px", md: "14px", lg: "16px" },
                  }}
                  onClick={() => {
                    setSelectedAirlinesOption({});
                    resetFiltersForAirline({});

                    handleResetConnectingAirport();
                    handleResetArrivalTime();
                    handleResetDepartureTime();
                    handleResetFareType();
                    handleResetStops();
                    setSelectedAirlines([]);
                    setArrivalAirports([]);
                    handleResetPriceRange();
                    handleResetMarkup();

                    applyAllFilters(flightTickets, {
                      selectedAirlinesOption: [],
                      priceRange: MAX,
                      selectedConnectingAirports: [],
                      selectedFareTypes: [],
                      selectedDepartureTimes: [],
                      selectedArrivalTimes: [],
                      selectedStops: [],
                      markupValue: "",
                    });
                  }}
                >
                  Reset All
                </Typography>
              </Box>

              <Divider sx={{ my: 0.5 }} />

              {/* Airlines */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {openSections.airlines ? (
                  <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: "20px", height: "25px" }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                    onClick={() => handleToggle("airlines")}
                  >
                    AIRLINES
                  </Typography>
                  {Object.keys(selectedAirlinesOption).length > 0 && (
                    <Typography
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        applyAllFilters(flightTickets, {
                          selectedAirlinesOption: {},
                          priceRange,
                          selectedConnectingAirports,
                          selectedFareTypes,
                          selectedDepartureTimes,
                          selectedArrivalTimes,
                          selectedStops,
                          markupValue: markupvalue,
                        });
                        setSelectedAirlinesOption({});
                      }}
                    >
                      Reset
                    </Typography>
                  )}
                </Box>
              </Box>

              {openSections.airlines && (
                <>
                  {openSections.airlines && (
                    <>
                      {allTickets
                        ?.sort(
                          (a, b) =>
                            Number.parseFloat(a.totalFare) -
                            Number.parseFloat(b.totalFare)
                        )
                        .map((item, indexOfAllTicket) => (
                          <Box
                            key={indexOfAllTicket}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 2,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                minWidth: 0,
                              }}
                            >
                              <Checkbox
                                checked={!!selectedAirlinesOption[item?.arCode]}
                                onChange={() =>
                                  handleAirlineCheckboxChange(item?.arCode)
                                }
                                sx={{ flexShrink: 0 }}
                              />
                              <Typography
                                sx={{
                                  fontSize: {
                                    sm: "12px",
                                    md: "14px",
                                    lg: "16px",
                                  },
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item?.arCode}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: {
                                  sm: "12px",
                                  md: "14px",
                                  lg: "16px",
                                },
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                              }}
                            >
                              RS {item?.passengerTotalFare}
                            </Typography>
                          </Box>
                        ))}
                    </>
                  )}
                </>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Price Range */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {openSections.priceRange ? (
                  <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: "20px", height: "25px" }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                    onClick={() => handleToggle("priceRange")}
                  >
                    PRICE RANGE
                  </Typography>
                </Box>
              </Box>

              {openSections.priceRange && (
                <>
                  <Box sx={{ mx: 4 }}>
                    <Slider
                      step={0.1}
                      min={MIN}
                      max={MAX}
                      onChange={handlePriceRangeChange}
                      value={priceRange}
                      valueLabelDisplay="on"
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      onClick={() => setPriceRange([MIN, val[1]])}
                      sx={{
                        cursor: "pointer",
                        fontSize: { sm: "12px", md: "14px", lg: "16px" },
                      }}
                    >
                      RS {MIN}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: {
                          sm: "12px",
                          md: "12px",
                          lg: "14px",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => setVal([val[0], MAX])}
                    >
                      RS {MAX}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Connecting Airports */}
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {openSections.connectingAirports ? (
                  <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: "20px", height: "25px" }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                    onClick={() => handleToggle("connectingAirports")}
                  >
                    CONNECTING AIRPORTS
                  </Typography>
                  {selectedConnectingAirports.length > 0 && (
                    <Typography
                      sx={{ cursor: "pointer", fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                      onClick={() => handleResetConnectingAirport()}
                    >
                      Reset
                    </Typography>
                  )}
                </Box>
              </Box> */}

              {/* {openSections.connectingAirports && (
                <Box
                  sx={{
                    my: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {getConnectingAirports(flightTickets)?.map((airport) => (
                    <FormControlLabel
                      key={airport}
                      control={
                        <Checkbox
                          checked={selectedConnectingAirports.includes(airport)}
                          onChange={() =>
                            handleConnectingAirportChange(airport)
                          }
                          sx={{ mr: 1, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                        />
                      }
                      label={airport}
                    />
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 1 }} /> */}

              {/* Fare Type */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {openSections.fareType ? (
                  <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: "20px", height: "25px" }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                    onClick={() => handleToggle("fareType")}
                  >
                    FARE TYPE
                  </Typography>
                  {selectedFareTypes.length > 0 && (
                    <Typography
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleResetFareType()}
                    >
                      Reset
                    </Typography>
                  )}
                </Box>
              </Box>

              {openSections.fareType && (
                <Box
                  sx={{
                    my: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {fareTypes.map((fareType) => (
                    <FormControlLabel
                      key={fareType}
                      control={
                        <Checkbox
                          checked={selectedFareTypes.includes(fareType)}
                          onChange={() => handleFareTypeChange(fareType)}
                          sx={{ mr: 1 }}
                        />
                      }
                      label={fareType}
                    />
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              {/* markup */}

              <Card sx={{ width: "95%", height: "auto", p: 1, my: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {openSections.markup ? (
                    <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "20px", height: "25px" }}
                    />
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                      onClick={() => handleToggle("markup")}
                    >
                      Markup
                    </Typography>
                    <Typography
                      sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                      onClick={() => handleResetMarkup()}
                    >
                      Reset
                    </Typography>
                  </Box>
                </Box>
                {openSections.markup && (
                  <>
                    <Box sx={{ my: 1, width: "100%" }}>
                      <RadioGroup
                        value={markupPreference}
                        onChange={(e) => setMarkupPreference(e.target.value)}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          ml: "10px",
                        }}
                      >
                        <FormControlLabel
                          value="Percentage"
                          control={<Radio />}
                          label="Percentage"
                          sx={{
                            fontSize: { sm: "12px", md: "14px", lg: "16px" },
                          }}
                        />
                        <FormControlLabel
                          value="Amount"
                          control={<Radio />}
                          label="Amount"
                          sx={{
                            fontSize: { sm: "12px", md: "14px", lg: "16px" },
                          }}
                        />
                      </RadioGroup>
                    </Box>
                    <Box
                      sx={{
                        mb: 0.5,
                        display: { sm: "block", md: "block", lg: "flex" },
                        gap: 1,
                      }}
                    >
                      <Input
                        placeholder={markupPreference}
                        value={markupvalue}
                        onChange={(e) => setMarkupValue(e.target.value)}
                        sx={{ width: { sm: "100%", md: "100%", lg: "55%" } }}
                      />
                      <Button
                        sx={{
                          color: "white",
                          width: { sm: "100%", md: "100%", lg: "40%" },
                          mt: 1,
                        }}
                        onClick={() =>
                          applyAllFilters(flightTickets, {
                            selectedAirlinesOption,
                            priceRange,
                            selectedConnectingAirports,
                            selectedFareTypes,
                            selectedDepartureTimes,
                            selectedArrivalTimes,
                            selectedStops,
                            markupValue: markupvalue,
                          })
                        }
                      >
                        {" "}
                        Calculate
                      </Button>
                    </Box>
                  </>
                )}
              </Card>

              <Divider sx={{ my: 1 }} />

              {/* Departure Times */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {openSections.departureTimes ? (
                  <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: "20px", height: "25px" }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                    onClick={() => handleToggle("departureTimes")}
                  >
                    DEPARTURE TIMES
                  </Typography>
                  {selectedDepartureTimes.length > 0 && (
                    <Typography
                      sx={{
                        cursor: "pointer",
                        fontSize: { sm: "12px", md: "14px", lg: "16px" },
                      }}
                      onClick={() => handleResetDepartureTime()}
                    >
                      Reset
                    </Typography>
                  )}
                </Box>
              </Box>

              {openSections.departureTimes && (
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    width: "100%",
                    justifyContent: "space-evenly",
                    flexWrap: { sm: "wrap", md: "nowrap", lg: "nowrap" },
                  }}
                >
                  {departureTimes?.map((timeObj, index) => {
                    const isSelected = selectedDepartureTimes.includes(
                      timeObj.time
                    ); // Use unique identifier

                    return (
                      <Box
                        key={index}
                        onClick={() => handleDepartureTimeClick(timeObj.time)}
                        sx={{
                          height: "60px",
                          width: "70px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: isSelected ? "#036bb0" : "white", // Highlight if selected
                          color: isSelected ? "white" : "black",
                          borderRadius: "10px",
                          flexDirection: "column",
                          gap: "5px",
                          cursor: "pointer",
                          border: isSelected
                            ? "2px solid #036bb0"
                            : "1px solid #ccc",
                        }}
                      >
                        <img width="25px" height="20px" alt="" />
                        <Typography
                          sx={{
                            fontSize: { sm: "10px", md: "11px", lg: "12px" },
                            color: isSelected ? "white" : "black",
                          }}
                        >
                          {timeObj.time}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              {/* arrival times */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {openSections.arrivalTimes ? (
                  <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ width: "20px", height: "25px" }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                    onClick={() => handleToggle("arrivalTimes")}
                  >
                    ARRIVAL TIMES
                  </Typography>
                  {selectedArrivalTimes.length > 0 && (
                    <Typography
                      sx={{
                        cursor: "pointer",
                        fontSize: { sm: "10px", md: "11px", lg: "12px" },
                      }}
                      onClick={() => handleResetArrivalTime()}
                    >
                      Reset
                    </Typography>
                  )}
                </Box>
              </Box>

              {openSections.arrivalTimes && (
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    width: "100%",
                    justifyContent: "space-evenly",
                    flexWrap: { sm: "wrap", md: "nowrap", lg: "nowrap" },
                  }}
                >
                  {departureTimes?.map((timeObj, index) => {
                    const isSelected = selectedArrivalTimes.includes(
                      timeObj.time
                    ); // Use unique identifier

                    return (
                      <Box
                        key={index}
                        onClick={() => handleArrivalTimeClick(timeObj.time)}
                        sx={{
                          height: "60px",
                          width: "70px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: isSelected ? "#036bb0" : "white",
                          color: isSelected ? "white" : "black",
                          borderRadius: "10px",
                          flexDirection: "column",
                          gap: "5px",
                          cursor: "pointer",
                          border: isSelected
                            ? "2px solid #036bb0"
                            : "1px solid #ccc",
                        }}
                      >
                        <img
                          // src={require(`../../images/${timeObj.logo}`)}
                          width="25px"
                          height="20px"
                          alt=""
                        />
                        <Typography
                          sx={{
                            fontSize: { sm: "10px", md: "11px", lg: "12px" },
                            color: isSelected ? "white" : "black",
                          }}
                        >
                          {timeObj.time}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* <Divider sx={{ my: 1 }} /> */}

              <Box>
                {/* arrival  airports */}

                {/* <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} >
                  {openSections.arrivalAirports ? (
                    <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ width: "20px", height: "25px" }} />
                  )}
                  <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>

                    <Typography onClick={() => handleToggle('arrivalAirports')}>ARRIVAL AIRPORTS</Typography>
                    {arrivalAirports.length > 0 && (
                      <Typography sx={{ cursor: "pointer" }} onClick={() => setArrivalAirports([])}>Reset</Typography>
                    )}</Box>
                </Box>
                {openSections.arrivalAirports && (
                  <Box sx={{ my: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    {arrivalAirportslist.map((label, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={arrivalAirports.includes(label)}
                            onChange={() => handleArrivalAirportChange(label)}
                            sx={{ mr: 1 }}
                          />
                        }
                        label={label}
                      />
                    ))}
                  </Box>
                )}

                */}

                {/* stops */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    mb: 1,
                  }}
                >
                  {openSections.stops ? (
                    <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "20px", height: "25px" }}
                    />
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }}
                      onClick={() => handleToggle("stops")}
                    >
                      STOPS
                    </Typography>
                    {selectedStops.length > 0 && (
                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleResetStops()}
                      >
                        Reset
                      </Typography>
                    )}
                  </Box>
                </Box>

                {openSections.stops && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "15px",
                      width: "100%",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {getMinFareByStops(flightTickets)?.map((stop, index) => {
                      const label = stop.number;
                      const isSelected = selectedStops.includes(label);

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleStopSelect(label)}
                        >
                          <Box
                            sx={{
                              height: "35px",
                              width: "60px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: isSelected ? "#036bb0" : "white",
                              color: isSelected ? "white" : "black",
                              borderRadius: "10px",
                              border: isSelected
                                ? "2px solid #036bb0"
                                : "1px solid gray",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "20px",
                                fontWeight: 500,
                                color: isSelected ? "white" : "black",
                              }}
                            >
                              {stop.number}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{ fontSize: "12px", textAlign: "center" }}
                          >
                            RS {stop.value}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* <Divider sx={{ my: 1 }} /> */}

                {/* TYPE */}
                {/* 
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    mb: 1,
                  }}
                >
                  {openSections.type ? (
                    <ExpandLessIcon sx={{ width: "20px", height: "25px" }} />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "20px", height: "25px" }}
                    />
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: { sm: "14px", md: "16px", lg: "18px" } }} onClick={() => handleToggle("type")}>
                      TYPE
                    </Typography>
                    {selectedStops.length > 0 && (
                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleResetStops()}
                      >
                        Reset
                      </Typography>
                    )}
                  </Box>
                </Box>

                {openSections.type && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "15px",
                      width: "100%",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {['Direct', 'Indirect']?.map((stop, index) => {
                      const isSelected = selectedStops.includes(stop);

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleStopSelect(stop)}
                        >
                          <Box
                            sx={{
                              height: "35px",
                              width: "80px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: isSelected ? "#036bb0" : "white",
                              color: isSelected ? "white" : "black",
                              borderRadius: "10px",
                              border: isSelected
                                ? "2px solid #036bb0"
                                : "1px solid gray",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "20px",
                                fontWeight: 500,
                                color: isSelected ? "white" : "black",
                              }}
                            >
                              {stop}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )} */}
              </Box>
            </Box>
            {/* --------------------- */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "75%",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {tripOption !== "Multi City" && (
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: { sm: "16px", md: "18px", lg: "20px" },
                    }}
                  >
                    Flights from
                    <Typography
                      sx={{
                        fontWeight: "600",
                        ml: 1,
                        fontSize: { sm: "18px", md: "20px", lg: "22px" },
                      }}
                    >
                      {tripOption === "One Way" ? (
                        <>
                          {allTickets?.[0]?.departure?.[0]?.departureLocation}{" "}
                          <ArrowRightAltIcon
                            sx={{ width: "20px", height: "20px" }}
                          />{" "}
                          {
                            allTickets?.[0]?.departure?.[
                              allTickets?.[0]?.departure.length - 1
                            ]?.arrivalLocation
                          }
                        </>
                      ) : tripOption === "Round Trip" ? (
                        <>
                          {allTickets?.[0]?.departure?.[0]?.departureLocation}
                          <ArrowRightAltIcon
                            sx={{ width: "20px", height: "20px" }}
                          />
                          {
                            allTickets?.[0]?.departure?.[
                              allTickets?.[0]?.departure.length - 1
                            ]?.arrivalLocation
                          }
                          <ArrowRightAltIcon
                            sx={{ width: "20px", height: "20px" }}
                          />
                          {allTickets?.[0]?.departure?.[0]?.departureLocation}
                        </>
                      ) : (
                        <>
                          {fromLocation?.name}{" "}
                          <ArrowRightAltIcon
                            sx={{ width: "20px", height: "20px" }}
                          />{" "}
                          {toLocation?.name}
                        </>
                      )}
                    </Typography>
                  </Typography>
                )}

                {/* <Box sx={{ display: "flex", gap: 2 }}>
                  {leftButtons.map((buttton, index) => (
                    <Box key={index} sx={{ cursor: "pointer" }}>
                      <img
                        src={require(`../../images/${buttton.icon}`)}
                        alt={buttton.label}
                        height="35"
                        width="35"
                      />
                    </Box>
                  ))}
                </Box> */}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  border: "1px solid lightgrey",
                  borderRadius: "10px",
                  mt: 1,
                  backgroundColor: "white",
                }}
              >
                {/* Backward Arrow */}
                <Box
                  onClick={() => handleScroll("left")}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "5%",
                    cursor: "pointer",
                  }}
                >
                  <ArrowBackIosIcon />
                </Box>

                {/* Scrollable Airline List */}
                <Box
                  ref={scrollRef}
                  sx={{
                    display: "flex",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    width: "100%",
                    height: "100%",
                    borderLeft: "1px solid lightgrey",
                    borderRight: "1px solid lightgrey",
                    "&::-webkit-scrollbar": { display: "none" },
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {allTickets
                    ?.sort(
                      (a, b) =>
                        parseFloat(a.totalFare) - parseFloat(b.totalFare)
                    )
                    ?.map((item, index) => {
                      const isSelected = index === selectedSliderAirline;

                      return (
                        <Box
                          key={index}
                          sx={{
                            width: "20%",
                            minWidth: "150px",
                            height: "100%",
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid lightgrey",
                            flexShrink: 0,
                            backgroundColor: isSelected ? "#036bb0" : "",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (selectedSliderAirline === index) {
                              setSelectedSliderAirline(false);
                            } else {
                              setSelectedSliderAirline(index);
                            }
                            filterFlightsByArCode(item.arCode);
                          }}
                        >
                          <img
                            src={item?.logo}
                            alt="logo"
                            width="50px"
                            height="35px"
                          />
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                maxWidth: "120px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: isSelected ? "white" : "",
                              }}
                            >
                              {item?.arCode}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: "400",
                                letterSpacing: "4px",
                                color: isSelected ? "white" : "grey",
                              }}
                            >
                              <span style={{ marginRight: "1px" }}>RS.</span>
                              {item?.passengerTotalFare}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>

                {/* Forward Arrow */}
                <Box
                  onClick={() => handleScroll("right")}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "5%",
                    cursor: "pointer",
                  }}
                >
                  <ArrowForwardIosIcon />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  height: "50px",
                  border: "1px solid lightgrey",
                  mt: "10px",
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    width: { sm: "10%", md: "5%", lg: "5%" },
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    backgroundColor: "#FFCC00",
                  }}
                >
                  <CampaignIcon sx={{ color: "white" }} />
                </Box>
                <Box
                  sx={{
                    width: { sm: "90%", md: "95%", lg: "95%" },
                    display: "flex",
                    alignItems: "center",
                    px: "10px",
                  }}
                >
                  <Typography
                    sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
                  >
                    NOTE:{" "}
                    <Typography>
                      We may have included nearby airports as well in your
                      search results.Kindly select your flight and airports as
                      per preference.
                    </Typography>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  mt: "10px",
                }}
              >
                <Typography sx={{ fontSize: "14px", color: "grey" }}>
                  Showing {flightTickets?.length} of {flightTickets?.length}{" "}
                  Fares found
                </Typography>
                {/* <Box sx={{ display: "flex", gap: 2.5 }}>
                  <Typography sx={{ fontSize: "18px", color: "darkblue", fontWeight: 500 }}>SORT BY:</Typography>
                  {["Airline", "Departure", "Duration", "Best Value", "Arrival"].map((label, index) => (
                    <Typography key={index} sx={{ fontSize: "16px", color: "grey" }}>{label}</Typography>
                  ))}
                  <Typography sx={{ fontSize: "16px", color: "darkblue" }}>
                    Price <ArrowDownwardIcon sx={{ width: "16px", height: "16px", color: "darkblue" }} />
                  </Typography>

                </Box> */}
              </Box>

              {filteredFlightTickets
                ?.sort(
                  (a, b) => parseFloat(a.totalFare) - parseFloat(b.totalFare)
                )
                ?.map((flight, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: "100%",
                      height: "auto",
                      border: "1px solid lightgrey",
                      borderRadius: "15px",
                      my: 1,
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "white",
                      py: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: "98%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {tripOption === "One Way" ? (
                        <>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: "2px" }}
                          >
                            <Chip
                              variant="soft"
                              color={
                                flight?.api === "sabre" ? "success" : "primary"
                              }
                              startDecorator={<WorkspacePremiumRoundedIcon />}
                              size="md"
                            // sx={{ visibility: !showLable && 'hidden' }}
                            >
                              {flight?.api}
                            </Chip>
                          </Stack>
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={flight?.logo}
                                width="50px"
                                height="35px"
                              />
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "14px",
                                      md: "18px",
                                      lg: "20px",
                                    },
                                  }}
                                >
                                  {flight.arCode}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "11px",
                                      lg: "12px",
                                    },
                                    fontWeight: "400",
                                    color: "grey",
                                    letterSpacing: "4px",
                                  }}
                                >
                                  {flight?.api === "hitit" ? flight?.departure?.[0]?.marketingCarrier : flight?.departure?.[0]?.marketing}-
                                  {
                                    flight?.departure?.[0]
                                      ?.marketingFlightNumber
                                  }
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "11px",
                                      lg: "12px",
                                    },
                                    fontWeight: "700",
                                    color: "grey",
                                    letterSpacing: "2px",
                                  }}
                                >
                                  {flight?.api === "hitit" || flight.arCode ===
                                    flight?.departure?.[0]?.operatinglogo?.ar
                                    ? ""
                                    : "Operated By: " +
                                    flight?.departure?.[0]?.operatinglogo?.ar}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ width: "25%", height: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Typography
                                  sx={{ fontWeight: "700", fontSize: "24px" }}
                                >
                                  {moment(
                                    flight?.departure?.[0]?.departureTime
                                  ).format("HH:mm")}
                                </Typography>

                                <Typography sx={{ fontSize: "14px" }}>
                                  {moment(
                                    flight?.departure?.[0]?.departureTime
                                  ).format("ddd, DD MMM,YY")}
                                </Typography>
                              </Box>
                              <Typography sx={{ fontSize: "14px" }}>
                                {flight?.departure?.[0]?.departureLocation}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                position: "relative",
                              }}
                            >
                              <Box>
                                <Typography sx={{ fontSize: "16px" }}>
                                  {calculateTotalFlightTime(flight?.departure)}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "16px" }}
                                  onMouseEnter={() => {
                                    flight?.departure?.length - 1 &&
                                      setHoveredDuration({
                                        flightIndex: index,
                                      });
                                  }}
                                  onMouseLeave={() => {
                                    flight?.departure?.length - 1 &&
                                      setHoveredDuration({ flightIndex: null });
                                  }}
                                >
                                  {calculateStops(flight?.departure)}
                                  {/* {flight?.departure?.length - 1 ? flight?.departure?.length - 1 : 'Non'} stop, via {flight?.departure?.[flight?.departure?.length - 1]?.departureLocation} */}
                                </Typography>
                                {hoveredDuration.flightIndex === index && (
                                  <DurationTooltip
                                    data={flight?.departure}
                                    apiName={flight?.api}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "35%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  gap: "4px",
                                }}
                              >
                                {/* Time and Date on one line */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "700", fontSize: "24px" }}
                                  >
                                    {moment(
                                      flight?.departure?.[
                                        flight?.departure?.length - 1
                                      ]?.arrivalTime
                                    ).format("HH:mm")}
                                  </Typography>

                                  <Typography sx={{ fontSize: "14px" }}>
                                    {moment(
                                      flight?.departure?.[
                                        flight?.departure?.length - 1
                                      ]?.arrivalTime
                                    ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>

                                <Typography
                                  sx={{ fontSize: "14px", fontWeight: "600" }}
                                >
                                  {
                                    flight?.departure?.[
                                      flight?.departure?.length - 1
                                    ]?.arrivalLocation
                                  }{" "}
                                  <Typography sx={{ color: "purple", ml: 1 }}>
                                    {" "}
                                    {isNextDay(
                                      flight?.departure?.[0]?.departureTime,
                                      flight?.departure?.[
                                        flight?.departure?.length - 1
                                      ]?.arrivalTime
                                    )}
                                  </Typography>
                                </Typography>
                              </Box>
                            </Box>

                            {/* <Box sx={{ width: "15%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <DirectionsBusIcon />

                          </Box> */}
                          </Box>
                        </>
                      ) : tripOption === "Round Trip" ? (
                        <>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: "2px" }}
                          >
                            <Chip
                              variant="soft"
                              color={
                                flight?.api === "sabre" ? "success" : "primary"
                              }
                              startDecorator={<WorkspacePremiumRoundedIcon />}
                              size="md"
                            // sx={{ visibility: !showLable && 'hidden' }}
                            >
                              {flight?.api}
                            </Chip>
                          </Stack>

                          {/* Departure */}
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={flight?.logo}
                                width="50px"
                                height="35px"
                              />
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {flight.arCode}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "11px",
                                      lg: "12px",
                                    },
                                    fontWeight: "400",
                                    color: "grey",
                                    letterSpacing: "4px",
                                  }}
                                >
                                  {flight?.api === "hitit" ? (flight?.departure?.[0]?.marketingCarrier || flight?.arCode) : flight?.departure?.[0]?.marketing}-
                                  {
                                    flight?.departure?.[0]
                                      ?.marketingFlightNumber
                                  }
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "11px",
                                      lg: "12px",
                                    },
                                    fontWeight: "700",
                                    color: "grey",
                                    letterSpacing: "2px",
                                  }}
                                >
                                  {flight?.api === "hitit" || flight.arCode ===
                                    flight?.departure?.[0]?.operatinglogo?.ar
                                    ? ""
                                    : "Operated By: " +
                                    flight?.departure?.[0]?.operatinglogo?.ar}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ width: "25%", height: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: {
                                      sm: "20px",
                                      md: "22px",
                                      lg: "24px",
                                    },
                                  }}
                                >
                                  {moment(
                                    flight?.departure?.[0]?.departureTime
                                  ).format("HH:mm")}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "12px",
                                      lg: "14px",
                                    },
                                  }}
                                >
                                  {moment(
                                    flight?.departure?.[0]?.departureTime
                                  ).format("ddd, DD MMM,YY")}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: {
                                    sm: "10px",
                                    md: "12px",
                                    lg: "14px",
                                  },
                                }}
                              >
                                {flight?.departure?.[0]?.departureLocation}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                position: "relative",
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {calculateTotalFlightTime(flight?.departure)}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                  onMouseEnter={() => {
                                    flight?.departure?.length - 1 &&
                                      setHoveredDuration({
                                        flightIndex: index,
                                        type: "departure",
                                      });
                                  }}
                                  onMouseLeave={() => {
                                    flight?.departure?.length - 1 &&
                                      setHoveredDuration({ flightIndex: null });
                                  }}
                                >
                                  {calculateStops(flight?.departure)}
                                  {/* {flight?.departure?.length - 1 ? flight?.departure?.length - 1 : 'Non'} stop, via {flight?.departure?.[flight?.departure?.length - 1]?.departureLocation} */}
                                </Typography>
                                {hoveredDuration.flightIndex === index &&
                                  hoveredDuration?.type === "departure" && (
                                    <DurationTooltip
                                      data={flight?.departure}
                                      apiName={flight?.api}
                                    />
                                  )}
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "35%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  gap: "4px",
                                }}
                              >
                                {/* Time and Date on one line */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "700", fontSize: "24px" }}
                                  >
                                    {moment(
                                      flight?.departure?.[
                                        flight?.departure?.length - 1
                                      ]?.arrivalTime
                                    ).format("HH:mm")}
                                  </Typography>

                                  <Typography sx={{ fontSize: "14px" }}>
                                    {moment(
                                      flight?.departure?.[
                                        flight?.departure?.length - 1
                                      ]?.arrivalTime
                                    ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>

                                <Typography
                                  sx={{ fontSize: "14px", fontWeight: "600" }}
                                >
                                  {
                                    flight?.departure?.[
                                      flight?.departure?.length - 1
                                    ]?.arrivalLocation
                                  }{" "}
                                  <Typography sx={{ color: "purple", ml: 1 }}>
                                    {" "}
                                    {isNextDay(
                                      flight?.departure?.[0]?.departureTime,
                                      flight?.departure?.[
                                        flight?.departure?.length - 1
                                      ]?.arrivalTime
                                    )}
                                  </Typography>
                                </Typography>
                              </Box>
                            </Box>

                            {/* <Box sx={{ width: "15%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <DirectionsBusIcon />

                          </Box> */}
                          </Box>

                          {/* Return */}
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={flight?.logo}
                                width="50px"
                                height="35px"
                              />
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {flight.arCode}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "11px",
                                      lg: "12px",
                                    },
                                    fontWeight: "400",
                                    color: "grey",
                                    letterSpacing: "4px",
                                  }}
                                >
                                  {flight?.api === "hitit" ? (flight?.return?.[0]?.marketingCarrier || flight?.arCode) : flight?.return?.[0]?.marketing}-
                                  {flight?.return?.[0]?.marketingFlightNumber}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "11px",
                                      lg: "12px",
                                    },
                                    fontWeight: "700",
                                    color: "grey",
                                    letterSpacing: "2px",
                                  }}
                                >
                                  {flight?.api === "hitit" || flight.arCode ===
                                    flight?.return?.[0]?.operatinglogo?.ar
                                    ? ""
                                    : "Operated By: " +
                                    flight?.return?.[0]?.operatinglogo?.ar}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ width: "25%", height: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: {
                                      sm: "20px",
                                      md: "22px",
                                      lg: "24px",
                                    },
                                  }}
                                >
                                  {moment(
                                    flight?.return?.[0]?.departureTime
                                  ).format("HH:mm")}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "12px",
                                      lg: "14px",
                                    },
                                  }}
                                >
                                  {moment(
                                    flight?.return?.[0]?.departureTime
                                  ).format("ddd, DD MMM,YY")}
                                </Typography>
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: {
                                    sm: "10px",
                                    md: "12px",
                                    lg: "14px",
                                  },
                                }}
                              >
                                {flight?.return?.[0]?.departureLocation}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                position: "relative",
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {calculateTotalFlightTime(flight?.return)}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                  onMouseEnter={() => {
                                    flight?.return?.length - 1 &&
                                      setHoveredDuration({
                                        flightIndex: index,
                                        type: "return",
                                      });
                                  }}
                                  onMouseLeave={() => {
                                    flight?.return?.length - 1 &&
                                      setHoveredDuration({ flightIndex: null });
                                  }}
                                >
                                  {calculateStops(flight?.return)}
                                  {/* {flight?.departure?.length - 1 ? flight?.departure?.length - 1 : 'Non'} stop, via {flight?.departure?.[flight?.departure?.length - 1]?.departureLocation} */}
                                </Typography>
                                {hoveredDuration.flightIndex === index &&
                                  hoveredDuration?.type === "return" && (
                                    <DurationTooltip
                                      data={flight?.return}
                                      apiName={flight?.api}
                                    />
                                  )}
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                width: "35%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  gap: "4px",
                                }}
                              >
                                {/* Time and Date on one line */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "700", fontSize: "24px" }}
                                  >
                                    {moment(
                                      flight?.return?.[
                                        flight?.return?.length - 1
                                      ]?.arrivalTime
                                    ).format("HH:mm")}
                                  </Typography>

                                  <Typography sx={{ fontSize: "14px" }}>
                                    {moment(
                                      flight?.return?.[
                                        flight?.return?.length - 1
                                      ]?.arrivalTime
                                    ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>

                                <Typography
                                  sx={{ fontSize: "14px", fontWeight: "600" }}
                                >
                                  {
                                    flight?.return?.[flight?.return?.length - 1]
                                      ?.arrivalLocation
                                  }{" "}
                                  <Typography sx={{ color: "purple", ml: 1 }}>
                                    {" "}
                                    {isNextDay(
                                      flight?.return?.[0]?.departureTime,
                                      flight?.return?.[
                                        flight?.return?.length - 1
                                      ]?.arrivalTime
                                    )}
                                  </Typography>
                                </Typography>
                              </Box>
                            </Box>

                            {/* <Box sx={{ width: "15%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <DirectionsBusIcon />

                          </Box> */}
                          </Box>
                        </>
                      ) : (
                        <>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: "2px" }}
                          >
                            <Chip
                              variant="soft"
                              color={
                                flight?.api === "sabre" ? "success" : "primary"
                              }
                              startDecorator={<WorkspacePremiumRoundedIcon />}
                              size="md"
                            // sx={{ visibility: !showLable && 'hidden' }}
                            >
                              {flight?.api}
                            </Chip>
                          </Stack>

                          {extractTrips(
                            flight?.api === "hitit"
                              ? [
                                ...(flight?.departure || []),
                                ...(flight?.return || []),
                              ]
                              : flight?.flights,
                            multicityFlights,
                            flight?.api
                          )?.map((item, flightIndex) => (
                            <>
                              <Box
                                key={flightIndex}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  display: "flex",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "25%",
                                    height: "100%",
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={item?.connectingFlights[0]?.logo?.logo}
                                    width="50px"
                                    height="35px"
                                  />
                                  <Box>
                                    <Typography
                                    >
                                      {flight?.api === "hitit" ? flight?.arCode : item?.connectingFlights[0]?.logo?.code || item?.connectingFlights[0]?.logo?.arCode}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: {
                                          sm: "10px",
                                          md: "11px",
                                          lg: "12px",
                                        },
                                        fontWeight: "400",
                                        color: "grey",
                                        letterSpacing: "4px",
                                      }}
                                    >
                                      {item?.connectingFlights?.[0]?.marketing || item?.connectingFlights?.[0]?.marketingCarrier || flight?.arCode}-
                                      {
                                        item?.connectingFlights?.[0]
                                          ?.marketingFlightNumber
                                      }
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: {
                                          sm: "10px",
                                          md: "11px",
                                          lg: "12px",
                                        },
                                        fontWeight: "600",
                                        color: "grey",
                                      }}
                                    >
                                      {item?.connectingFlights?.[0]?.logo?.code === item?.connectingFlights?.[0]?.operatingLogo?.code ? "" : `Operated By ${item?.connectingFlights?.[0]?.operatingLogo?.code}`}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ width: "25%", height: "100%" }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: "700",
                                        fontSize: "24px",
                                      }}
                                    >
                                      {moment(
                                        item?.connectingFlights?.[0]
                                          ?.departureTime ||
                                        toTimestamp(
                                          item?.connectingFlights?.[0]
                                            ?.departure
                                        )
                                      ).format("HH:mm")}
                                    </Typography>

                                    <Typography sx={{ fontSize: "14px" }}>
                                      {moment(
                                        item?.connectingFlights?.[0]
                                          ?.departureTime ||
                                        toTimestamp(
                                          item?.connectingFlights?.[0]
                                            ?.departure
                                        )
                                      ).format("ddd, DD MMM,YY")}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ fontSize: "14px" }}>
                                    {item?.from}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    width: "25%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    position: "relative",
                                  }}
                                >
                                  <Box>
                                    <Typography sx={{ fontSize: "16px" }}>
                                      {calculateTotalFlightTime(
                                        item?.connectingFlights
                                      )}
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: "16px" }}
                                      onMouseEnter={() => {
                                        item?.connectingFlights?.length - 1 &&
                                          setHoveredDuration({
                                            flightIndex: index,
                                            departureIndex: flightIndex,
                                          });
                                      }}
                                      onMouseLeave={() => {
                                        item?.connectingFlights?.length - 1 &&
                                          setHoveredDuration({
                                            flightIndex: null,
                                          });
                                      }}
                                    >
                                      {calculateStops(item?.connectingFlights)}
                                      {/* {flight?.departure?.length - 1 ? flight?.departure?.length - 1 : 'Non'} stop, via {flight?.departure?.[flight?.departure?.length - 1]?.departureLocation} */}
                                    </Typography>
                                    {hoveredDuration.flightIndex === index &&
                                      hoveredDuration.departureIndex ===
                                      flightIndex && (
                                        <DurationTooltip
                                          data={item?.connectingFlights}
                                          apiName={flight?.api}
                                          isMultiCity={true}
                                        />
                                      )}
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    width: "35%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "flex-start",
                                      gap: "4px",
                                    }}
                                  >
                                    {/* Time and Date on one line */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontWeight: "700",
                                          fontSize: "24px",
                                        }}
                                      >
                                        {moment(
                                          item?.connectingFlights?.[
                                            item?.connectingFlights?.length - 1
                                          ]?.arrivalTime ||
                                          toTimestamp(
                                            item?.connectingFlights?.[
                                              item?.connectingFlights
                                                ?.length - 1
                                            ]?.arrival
                                          )
                                        ).format("HH:mm")}
                                      </Typography>

                                      <Typography sx={{ fontSize: "14px" }}>
                                        {moment(
                                          item?.connectingFlights?.[
                                            item?.connectingFlights?.length - 1
                                          ]?.arrivalTime ||
                                          toTimestamp(
                                            item?.connectingFlights?.[
                                              item?.connectingFlights
                                                ?.length - 1
                                            ]?.arrival
                                          )
                                        ).format("ddd, DD MMM,YY")}
                                      </Typography>
                                    </Box>

                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {item?.to}{" "}
                                      <Typography
                                        sx={{ color: "purple", ml: 1 }}
                                      >
                                        {" "}
                                        {isNextDay(
                                          !flight?.api?.startsWith("amad")
                                            ? item?.connectingFlights?.[0]
                                              ?.departureTime
                                            : toTimestamp(
                                              item?.connectingFlights?.[0]
                                                ?.departure
                                            ),
                                          !flight?.api?.startsWith("amad")
                                            ? item?.connectingFlights?.[
                                              flight?.departure?.length - 1
                                            ]?.arrivalTime
                                            : toTimestamp(
                                              item?.connectingFlights?.[
                                                flight?.departure?.length - 1
                                              ]?.arrival
                                            )
                                        )}
                                      </Typography>
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* <Box sx={{ width: "15%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                              <DirectionsBusIcon />

                            </Box> */}
                              </Box>
                            </>
                          ))}
                        </>
                      )}

                      {/* This portion contain the all branded fares of sabre */}
                      {Array.isArray(flight?.brandedFare) && flight?.brandedFare
                        ?.slice(
                          0,
                          showAll?.indexOf === index && showAll?.value
                            ? flight?.brandedFare?.length
                            : 2
                        )
                        ?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                              backgroundColor: "#f7ebf5",
                              borderRadius: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                                ml: "8px",
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {item?.brandName?.[0]}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "grey",
                                  }}
                                >{`(${item?.data?.[0]?.bookingCode})`}</Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              {item?.seats && (
                                <Box
                                  sx={{
                                    backgroundColor: "white",
                                    display: "flex",
                                    gap: "4px",
                                    p: 0.2,
                                    border: "1px solid lightgrey",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <AirlineSeatReclineExtraIcon />
                                  <Typography
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      color: "slate",
                                    }}
                                  >
                                    {item?.seats}
                                  </Typography>
                                </Box>
                              )}
                              <Typography
                                sx={{
                                  fontWeight: "600",
                                  fontSize: "12px",
                                  color: !item?.refundable ? "green" : "red",
                                  backgroundColor: "white",
                                  p: 0.2,
                                  border: "1px solid lightgrey",
                                  borderRadius: "5px",
                                }}
                              >
                                {!item?.refundable ? "R" : "N"}
                              </Typography>
                              <LuggageIcon
                                sx={{ width: "25px", height: "25px" }}
                              />
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                {/* <Typography sx={{ backgroundColor: "#f9fbed", p: 0.2, fontSize: "14px", width: "auto", borderRadius: "5px" }}>
                                Change Booking Class
                              </Typography> */}
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  {loading.value &&
                                    loading?.code ===
                                    flight?.brandedFare[index]?.data?.[0]
                                      ?.bookingCode &&
                                    loading?.uuid === flight?.uuid &&
                                    loading?.totalFare === item?.totalFare &&
                                    !loading.isBookNowButton ? (
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        color: "grey",
                                        cursor: "wait",
                                      }}
                                    >
                                      Loading ...
                                    </Typography>
                                  ) : (
                                    <>
                                      <Typography
                                        sx={{
                                          fontSize: {
                                            sm: "12px",
                                            md: "13px",
                                            lg: "14px",
                                          },
                                          color: "#036bb0",
                                          cursor: "pointer",
                                        }}
                                        onClick={toggleDrawer(
                                          true,
                                          flight?.api,
                                          flight?.itineraries,
                                          flight?.uuid,
                                          flight?.brandedFare[index]?.data?.[0]
                                            ?.bookingCode,
                                          tripType,
                                          item?.totalFare,
                                          flight,
                                          flight?.brandedFare[index],
                                          flight?.flights,
                                        )}
                                      >
                                        Flight Details{" "}
                                      </Typography>
                                      <ArrowDropDownIcon
                                        sx={{
                                          height: "20px",
                                          width: "40px",
                                          fontSize: "32px",
                                          color: "#036bb0",
                                          display: {
                                            sm: "none",
                                            md: "none",
                                            lg: "block",
                                          },
                                        }}
                                      />
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: "14px", fontWeight: "700" }}
                                >
                                  RS.
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: {
                                      sm: "20px",
                                      md: "22px",
                                      lg: "24px",
                                    },
                                  }}
                                >
                                  {item?.totalFare}
                                </Typography>
                              </Box>
                              {netFare && (
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "12px", color: "darkgrey" }}
                                  >
                                    Net Fare: RS {item?.netFare}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#036bb0",
                                  fontSize: {
                                    sm: "9px",
                                    md: "12px",
                                    lg: "16px",
                                  },
                                  height: "10px",
                                }}
                                onClick={() => {
                                  handleBookNow(
                                    flight?.api,
                                    flight?.itineraries,
                                    flight?.uuid,
                                    flight?.brandedFare[index]?.data?.[0]
                                      ?.bookingCode,
                                    tripType,
                                    item?.totalFare,
                                    flight,
                                    multicityFlights,
                                    flight?.brandedFare[index],
                                  );
                                }}
                                disabled={
                                  loading.value &&
                                  loading?.code ===
                                  flight?.brandedFare[index]?.data?.[0]
                                    ?.bookingCode &&
                                  loading?.uuid === flight?.uuid &&
                                  loading?.totalFare === item?.totalFare &&
                                  loading.isBookNowButton
                                }
                              >
                                {loading.value &&
                                  loading?.code ===
                                  flight?.brandedFare[index]?.data?.[0]
                                    ?.bookingCode &&
                                  loading?.uuid === flight?.uuid &&
                                  loading?.totalFare === item?.totalFare &&
                                  loading.isBookNowButton
                                  ? "Loading..."
                                  : "Book Now"}
                              </Button>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  mr: "8px",
                                  gap: "5px",
                                }}
                              >
                                <ContentCopyIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() =>
                                    copyToClipboard(flight, item?.totalFare)
                                  }
                                />
                              </Box>
                            </Box>
                          </Box>
                        ))}

                      {/* This portion contain initial branded fares of Amadus */}
                      {(flight?.api === "amadus" ||
                        flight?.api === "amadeus") &&
                        flight?.itineraries &&
                        (showAllAmdeus?.index
                          ? showAllAmdeus?.index !== index
                          : true) && (
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                              backgroundColor: "#f7ebf5",
                              borderRadius: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                                ml: "8px",
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "12px",
                                      md: "14px",
                                      lg: "16px",
                                    },
                                  }}
                                >
                                  {flight?.itineraries?.travelerPricings?.[0]
                                    ?.fareDetailsBySegment?.[0]
                                    ?.brandedFareLabel
                                    ? flight?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]
                                      ?.brandedFareLabel
                                    : flight?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.cabin}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "grey",
                                  }}
                                >{`(${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class})`}</Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              {flight?.itineraries?.numberOfBookableSeats && (
                                <Box
                                  sx={{
                                    backgroundColor: "white",
                                    display: "flex",
                                    gap: "4px",
                                    p: 0.2,
                                    border: "1px solid lightgrey",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <AirlineSeatReclineExtraIcon />
                                  <Typography
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: "12px",
                                      color: "slate",
                                    }}
                                  >
                                    {flight?.itineraries?.numberOfBookableSeats}
                                  </Typography>
                                </Box>
                              )}
                              {/* <Typography sx={{ fontWeight: "600", fontSize: "12px", color: "red", backgroundColor: "white", p: 0.2, border: "1px solid lightgrey", borderRadius: "5px" }}>N</Typography>
                            <LuggageIcon sx={{ width: "25px", height: "25px" }} /> */}
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                {/* <Typography sx={{ backgroundColor: "#f9fbed", p: 0.2, fontSize: "14px", width: "auto", borderRadius: "5px" }}>
                                Change Booking Class
                              </Typography> */}
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  {loading.value &&
                                    loading?.code ===
                                    flight?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.class &&
                                    loading?.uuid === flight?.uuid &&
                                    loading?.totalFare ===
                                    flight?.passengerTotalFare &&
                                    !loading.isBookNowButton ? (
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        color: "grey",
                                        cursor: "wait",
                                      }}
                                    >
                                      Loading ...
                                    </Typography>
                                  ) : (
                                    <>
                                      <Typography
                                        sx={{
                                          fontSize: {
                                            sm: "12px",
                                            md: "13px",
                                            lg: "14px",
                                          },
                                          color: "#036bb0",
                                          cursor: "pointer",
                                        }}
                                        onClick={toggleDrawer(
                                          true,
                                          flight?.api,
                                          flight?.itineraries,
                                          flight?.uuid,
                                          flight?.itineraries
                                            ?.travelerPricings?.[0]
                                            ?.fareDetailsBySegment?.[0]?.class,
                                          tripType,
                                          flight?.passengerTotalFare,
                                          flight,
                                          flight?.brandedFare[index]
                                        )}
                                      >
                                        Flight Details{" "}
                                      </Typography>
                                      <ArrowDropDownIcon
                                        sx={{
                                          height: "20px",
                                          width: "40px",
                                          fontSize: "32px",
                                          color: "#036bb0",
                                          display: {
                                            sm: "none",
                                            md: "none",
                                            lg: "block",
                                          },
                                        }}
                                      />
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: {
                                      sm: "10px",
                                      md: "12px",
                                      lg: "14px",
                                    },
                                    fontWeight: "700",
                                  }}
                                >
                                  RS
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: {
                                      sm: "20px",
                                      md: "22px",
                                      lg: "24px",
                                    },
                                  }}
                                >
                                  {flight?.passengerTotalFare}
                                </Typography>
                              </Box>
                              {netFare && (
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "12px", color: "darkgrey" }}
                                  >
                                    Net Fare: RS {flight?.netFare}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#036bb0",
                                  fontSize: {
                                    sm: "9px",
                                    md: "12px",
                                    lg: "16px",
                                  },
                                  height: "10px",
                                }}
                                onClick={() => {
                                  handleBookNow(
                                    flight?.api,
                                    flight?.itineraries,
                                    flight?.uuid,
                                    flight?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.class,
                                    tripType,
                                    flight?.passengerTotalFare,
                                    flight,
                                    multicityFlights
                                  );
                                }}
                                disabled={
                                  loading.value &&
                                  loading?.code ===
                                  flight?.itineraries?.travelerPricings?.[0]
                                    ?.fareDetailsBySegment?.[0]?.class &&
                                  loading?.uuid === flight?.uuid &&
                                  loading?.totalFare ===
                                  flight?.passengerTotalFare &&
                                  loading.isBookNowButton
                                }
                              >
                                {loading.value &&
                                  loading?.code ===
                                  flight?.itineraries?.travelerPricings?.[0]
                                    ?.fareDetailsBySegment?.[0]?.class &&
                                  loading?.uuid === flight?.uuid &&
                                  loading?.totalFare ===
                                  flight?.passengerTotalFare &&
                                  loading.isBookNowButton
                                  ? "Loading..."
                                  : "Book Now"}
                              </Button>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  mr: "8px",
                                  gap: "5px",
                                }}
                              >
                                <ContentCopyIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => copyToClipboard(flight)}
                                />
                                {/* <PrintIcon /> */}
                              </Box>
                            </Box>
                          </Box>
                        )}

                      {/* This portion contain the all branded fares of Hitit */}
                      {!Array.isArray(flight?.brandedFare) && flight?.brandedFare?.data && flight?.brandedFare?.data
                        ?.slice(
                          0,
                          showAll?.indexOf === index && showAll?.value
                            ? flight?.brandedFare?.data?.length
                            : 2
                        )
                        ?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                              backgroundColor: "#f7ebf5",
                              borderRadius: "10px",
                              marginBottom: "10px"
                            }}
                          >
                            <Box sx={{ width: "25%", height: "100%", display: "flex", gap: "8px", alignItems: "center", ml: "8px" }}>
                              <Box>
                                <Typography sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                                  {item?.brandName || item?.name || "Brand"}
                                </Typography>
                                <Typography sx={{ fontSize: "12px", fontWeight: "400", color: "grey" }}>
                                  {`(${item?.bookingCode})`}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Column 2: Seats & Luggage */}
                            <Box sx={{ width: "25%", height: "100%", display: "flex", alignItems: "center", gap: "8px" }}>
                              {item?.totalSeats && (
                                <Box sx={{ backgroundColor: "white", display: "flex", gap: "4px", p: 0.2, border: "1px solid lightgrey", borderRadius: "5px" }}>
                                  <AirlineSeatReclineExtraIcon />
                                  <Typography sx={{ fontWeight: "600", fontSize: "12px", color: "slate" }}>
                                    {item?.totalSeats}
                                  </Typography>
                                </Box>
                              )}
                              <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                <LuggageIcon sx={{ width: "25px", height: "25px" }} />
                                { /* User requested removal of weight info */}
                              </Box>
                            </Box>

                            {/* Column 3: Flight Details */}
                            <Box sx={{ width: "25%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <Typography
                                sx={{
                                  fontSize: { sm: "12px", md: "13px", lg: "14px" },
                                  color: "#036bb0",
                                  cursor: "pointer",
                                }}
                                onClick={toggleDrawer(
                                  true,
                                  flight?.api,
                                  flight?.itineraries,
                                  flight?.uuid,
                                  item?.bookingCode || "Y",
                                  tripType,
                                  item?.fare,
                                  flight,
                                  item
                                )}
                              >
                                Flight Details{" "}
                              </Typography>
                              <ArrowDropDownIcon
                                sx={{
                                  height: "20px",
                                  width: "40px",
                                  fontSize: "32px",
                                  color: "#036bb0",
                                  display: {
                                    sm: "none",
                                    md: "none",
                                    lg: "block",
                                  },
                                }}
                              />
                            </Box>

                            <Box sx={{ width: "25%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <Typography sx={{ fontSize: "14px", fontWeight: "700" }}>RS.</Typography>
                                <Typography sx={{ fontWeight: "700", fontSize: { sm: "20px", md: "22px", lg: "24px" } }}>
                                  {item?.fare}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ width: "25%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem" }}>
                              <Button
                                variant="outlined"
                                sx={{ backgroundColor: "white", color: "#036bb0", fontSize: { sm: "9px", md: "12px", lg: "16px" }, height: "auto", minHeight: '30px' }}
                                onClick={() => {
                                  handleBookNow(
                                    flight?.api,
                                    flight?.itineraries,
                                    flight?.uuid,
                                    item?.bookingCode || "Y",
                                    tripType,
                                    item?.fare,
                                    flight,
                                    multicityFlights,
                                    item
                                  );
                                }}
                              >
                                Book Now
                              </Button>
                              <Box sx={{ display: "flex", flexDirection: "column", mr: "8px", gap: "5px" }}>
                                <ContentCopyIcon sx={{ cursor: "pointer" }} onClick={() => copyToClipboard(flight)} />
                              </Box>
                            </Box>
                          </Box>
                        ))}

                      {/* Branded fares after clicking on View More Fare */}
                      {/* ************************************************************************************************************* */}
                      {(flight?.api === "amadus" ||
                        flight?.api === "amadeus") &&
                        otherBrandedFare &&
                        showAllAmdeus?.index === index &&
                        otherBrandedFare?.map((item, index) => (
                          <Box
                            sx={{
                              width: "100%",
                              height: "23%",
                              display: "flex",
                              backgroundColor: "#f7ebf5",
                              borderRadius: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                                ml: "8px",
                              }}
                            >
                              <Box>
                                <Typography>
                                  {item?.itineraries?.travelerPricings?.[0]
                                    ?.fareDetailsBySegment?.[0]?.brandedFare
                                    ? item?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.brandedFare
                                    : item?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.cabin}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    color: "grey",
                                  }}
                                >
                                  {`(${item?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class})`}
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              {/* <Box
                              sx={{
                                backgroundColor: "white",
                                display: "flex",
                                gap: "4px",
                                p: 0.2,
                                border: "1px solid lightgrey",
                                borderRadius: "5px",
                              }}
                            >
                              <AirlineSeatReclineExtraIcon />
                              <Typography
                                sx={{
                                  fontWeight: "600",
                                  fontSize: "12px",
                                  color: "slate",
                                }}
                              >
                                {" "}
                                9
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontWeight: "600",
                                fontSize: "12px",
                                color: "red",
                                backgroundColor: "white",
                                p: 0.2,
                                border: "1px solid lightgrey",
                                borderRadius: "5px",
                              }}
                            >
                              N
                            </Typography>
                            <LuggageIcon
                              sx={{ width: "25px", height: "25px" }}
                            /> */}
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  {loading.value &&
                                    loading?.code ===
                                    item?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.class &&
                                    loading?.uuid === item?.uuid &&
                                    loading?.totalFare ===
                                    item?.passengerTotalFare &&
                                    !loading.isBookNowButton ? (
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        color: "grey",
                                        cursor: "wait",
                                      }}
                                    >
                                      Loading ...
                                    </Typography>
                                  ) : (
                                    <>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          color: "#036bb0",
                                          cursor: "pointer",
                                        }}
                                        onClick={toggleDrawer(
                                          true,
                                          item?.api,
                                          item?.itineraries,
                                          flight?.uuid,
                                          item?.itineraries
                                            ?.travelerPricings?.[0]
                                            ?.fareDetailsBySegment?.[0]?.class,
                                          tripType,
                                          item?.passengerTotalFare,
                                          flight,
                                          flight?.brandedFare[index]
                                        )}
                                      >
                                        Flight Details{" "}
                                      </Typography>
                                      <ArrowDropDownIcon
                                        sx={{
                                          height: "20px",
                                          width: "40px",
                                          fontSize: "32px",
                                          color: "#036bb0",
                                          display: {
                                            sm: "none",
                                            md: "none",
                                            lg: "block",
                                          },
                                        }}
                                      />
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: "14px", fontWeight: "700" }}
                                >
                                  RS
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: {
                                      sm: "20px",
                                      md: "22px",
                                      lg: "24px",
                                    },
                                  }}
                                >
                                  {item?.passengerTotalFare}
                                </Typography>
                              </Box>
                              {netFare && (
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "12px", color: "darkgrey" }}
                                  >
                                    Net Fare: RS {item?.netFare}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            <Box
                              sx={{
                                width: "25%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  backgroundColor: "white",
                                  color: "#036bb0",
                                  fontSize: {
                                    sm: "9px",
                                    md: "12px",
                                    lg: "16px",
                                  },
                                  height: "10px",
                                }}
                                onClick={() => {
                                  handleBookNow(
                                    item?.api,
                                    item?.itineraries,
                                    flight?.uuid,
                                    item?.itineraries?.travelerPricings?.[0]
                                      ?.fareDetailsBySegment?.[0]?.class,
                                    tripType,
                                    item?.passengerTotalFare,
                                    flight,
                                    multicityFlights
                                  );
                                }}
                                disabled={
                                  loading.value &&
                                  loading?.code ===
                                  item?.itineraries?.travelerPricings?.[0]
                                    ?.fareDetailsBySegment?.[0]?.class &&
                                  loading?.uuid === item?.uuid &&
                                  loading?.totalFare ===
                                  item?.passengerTotalFare &&
                                  loading.isBookNowButton
                                }
                              >
                                {loading.value &&
                                  loading?.code ===
                                  item?.itineraries?.travelerPricings?.[0]
                                    ?.fareDetailsBySegment?.[0]?.class &&
                                  loading?.uuid === item?.uuid &&
                                  loading?.totalFare ===
                                  item?.passengerTotalFare &&
                                  loading.isBookNowButton
                                  ? "Loading..."
                                  : "Book Now"}
                              </Button>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  mr: "8px",
                                  gap: "5px",
                                }}
                              >
                                <ContentCopyIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => copyToClipboard(item)}
                                />
                              </Box>
                            </Box>
                          </Box>
                        ))}

                      <Box
                        sx={{
                          width: "100%",
                          height: "23%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* Button for Amadus Branded Fares */}
                        {(flight?.api === "amadus" ||
                          flight?.api === "amadeus") &&
                          flight?.isUpsellOffer && (
                            <Button
                              disabled={isloadingAmadeus?.index === index}
                              sx={{
                                height: "60%",
                                backgroundColor: "#036bb0",
                                color: "white",
                              }}
                              onClick={() =>
                                handleViewMoreClickAmadus(
                                  flight?.itineraries,
                                  index
                                )
                              }
                            >
                              {showAllAmdeus?.index === index
                                ? "Show less fare"
                                : `View More Fare`}
                            </Button>
                          )}

                        {/* Button for Hitit Branded Fares */}
                        {!Array.isArray(flight?.brandedFare) && flight?.brandedFare?.data?.length - 2 > 0 && (
                          <Button
                            sx={{
                              height: "60%",
                              backgroundColor: "#036bb0",
                              color: "white",
                            }}
                            onClick={() =>
                              handleViewMoreClick(
                                index,
                                showAll?.indexOf === index && showAll?.value
                              )
                            }
                          >
                            {showAll?.indexOf === index && showAll?.value
                              ? "Show less fare"
                              : `+${flight?.brandedFare?.data?.length - 2} more fare`}
                          </Button>
                        )}

                        {/* Button for Sabre Branded Fares */}
                        {Array.isArray(flight?.brandedFare) && flight?.brandedFare?.length - 2 > 0 && (
                          <Button
                            sx={{
                              height: "60%",
                              backgroundColor: "#036bb0",
                              color: "white",
                            }}
                            onClick={() =>
                              handleViewMoreClick(
                                index,
                                showAll?.indexOf === index && showAll?.value
                              )
                            }
                          >
                            {showAll?.indexOf === index && showAll?.value
                              ? "Show less fare"
                              : `+${flight?.brandedFare?.length - 2} more fare`}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Box>

            {openDrawer && (
              <Drawer
                open={openDrawer}
                onClose={toggleDrawer(false)}
                anchor="right"
                slotProps={{
                  content: {
                    sx: {
                      width: "900px",
                      height: "100%",
                    },
                  },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "3.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid lightgrey",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "600", fontSize: "xl", ml: 1 }}
                    >
                      Your Flight Details
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "space-around",
                        mr: 1,
                      }}
                    >
                      {/* <ReplyIcon sx={{ width: "45px", height: "30px" }} /> */}
                      <ClearIcon
                        sx={{
                          width: "45px",
                          height: "30px",
                          cursor: "pointer",
                        }}
                        onClick={toggleDrawer(false)}
                      />
                    </Box>
                  </Box>
                  <Tabs defaultValue={0}>
                    <TabList>
                      {tripType === "Multi City" ? (
                        <>
                          {extractTripsForMultiCity(
                            openDrawer?.data?.api?.startsWith("amad")
                              ? openDrawer?.data?.departure
                              : openDrawer?.data?.api === "hitit"
                                ? [
                                  ...(openDrawer?.data?.departure || []),
                                  ...(openDrawer?.data?.return || []),
                                ]
                                : openDrawer?.data?.flights,
                            multicityFlights,
                            openDrawer?.data?.api
                          )?.map((flightItem, index) => (
                            <Tab>
                              {flightItem?.from} <ArrowRightAltIcon />{" "}
                              {flightItem?.to}
                            </Tab>
                          ))}
                        </>
                      ) : (
                        <>
                          <Tab>
                            {fromLocation?.code} <ArrowRightAltIcon />{" "}
                            {toLocation?.code}
                          </Tab>
                          {openDrawer?.data?.return?.length > 0 && (
                            <Tab>
                              {toLocation?.code} <ArrowRightAltIcon />{" "}
                              {fromLocation?.code}
                            </Tab>
                          )}
                        </>
                      )}

                      <Tab>Fare Summary & Rules</Tab>
                      <Tab>Baggage & Inclusions</Tab>
                    </TabList>
                    {tripType !== "Multi City" && (
                      <TabPanel value={0}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography level="title-md">DEPART</Typography>
                            <Typography level="title-lg">
                              {moment(
                                openDrawer?.data?.departure?.[0]?.departureTime
                              ).format("DD MMM, YY")}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography level="title-lg">
                              {fromLocation?.code} → {toLocation?.code}
                            </Typography>
                            {/* total duration including connecting flight in case of stops */}
                            <Typography level="body-sm">
                              {openDrawer?.data?.departure?.length - 1
                                ? `${openDrawer?.data?.departure?.length - 1
                                } Stop | ${calculateTotalFlightTime(
                                  openDrawer?.data?.departure
                                )}`
                                : "Non Stop"}
                            </Typography>
                          </Box>
                          {/* <Box sx={{ textAlign: "right" }}>
                            <Typography
                              color={
                                !openDrawer?.data?.refundable
                                  ? "success"
                                  : "danger"
                              }
                              level="title-sm"
                            >
                              {!openDrawer?.data?.refundable
                                ? "Refundable"
                                : "Non-Refundable"}
                            </Typography>
                            {/* <Button variant="plain" size="sm">
                                                          Fare Rules
                                                      </Button>
                          </Box> */}
                        </Box>
                        <Divider />
                        {openDrawer?.data?.departure?.map((item, index) => (
                          <>
                            {openDrawer?.data?.api === "sabre" &&
                              item?.layoverTime && (
                                <>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Stop :{" "}
                                    {
                                      openDrawer?.data?.departure?.[index]
                                        ?.departureLocation
                                    }
                                  </Typography>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Connecting Time : {item?.layoverTime} .
                                  </Typography>
                                  <Divider />
                                </>
                              )}

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mt: 3,
                              }}
                            >
                              <Box sx={{ width: 100, textAlign: "center" }}>
                                <AspectRatio
                                  ratio="1"
                                  sx={{ width: 60, mx: "auto", mb: 1 }}
                                >
                                  <img
                                    src={openDrawer?.data?.logo}
                                    alt="FlyDubai"
                                    style={{ objectFit: "contain" }}
                                  />
                                </AspectRatio>
                                <Typography level="body-xs">
                                  {openDrawer?.data?.arCode}
                                </Typography>
                                <Typography level="body-xs">
                                  {item?.marketingCarrier}{" "}
                                  {item?.marketingFlightNumber}
                                </Typography>

                                <Typography level="body-xs">
                                  {item?.logo?.arCode === item?.operatingLogo?.arCode ? "" : (item?.operatingLogo?.ar ? `Operated By ${item?.operatingLogo?.ar}` : "")}
                                </Typography>

                                {/* <Typography level="body-xs">(E6Q6M2)</Typography> */}
                                <Typography level="body-xs" sx={{ mt: 2 }}>
                                  TRAVEL CLASS
                                </Typography>
                                <Typography level="body-xs">
                                  {
                                    openDrawer?.data?.brandedFare?.data?.[0]
                                      ?.brandName?.[0] || openDrawer?.data?.brandedFare?.brandName
                                  }
                                </Typography>
                              </Box>

                              <Box
                                sx={{ flex: 1, position: "relative", px: 4 }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 4,
                                  }}
                                >
                                  <Box>
                                    <Typography level="h3">
                                      {moment(item?.departureTime).format(
                                        "HH:mm"
                                      )}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {moment(item?.departureTime).format(
                                        "ddd, DD MMM,YY"
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      level="body-md"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {formatDuration(item?.elapsedTime)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography level="h3">
                                      {moment(item?.arrivalTime).format(
                                        "HH:mm"
                                      )}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {moment(item?.arrivalTime).format(
                                        "ddd, DD MMM,YY"
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "30px",
                                    left: "70px",
                                    right: "70px",
                                    height: "1px",
                                    borderColor: "divider",
                                    borderBottom: "2px dashed grey",
                                    zIndex: 0,
                                  }}
                                />

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box sx={{ position: "relative", zIndex: 1 }}>
                                    <Box
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        bgcolor: "success.500",
                                        border: "3px solid white",
                                        boxShadow: "0 0 0 2px #4caf50",
                                        mb: 1,
                                      }}
                                    />
                                    <Typography level="title-sm">
                                      {item?.departureLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Muscat International Airport (Muscat)</Typography> */}
                                  </Box>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      zIndex: 1,
                                      textAlign: "right",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        bgcolor: "success.500",
                                        border: "3px solid white",
                                        boxShadow: "0 0 0 2px #4caf50",
                                        mb: 1,
                                        ml: "auto",
                                      }}
                                    />
                                    <Typography level="title-sm">
                                      {item?.arrivalLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Dubai International Airport (Dubai), Terminal 2</Typography> */}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>

                            {(openDrawer?.data?.api === "amadus" ||
                              openDrawer?.data?.api === "amadeus") &&
                              item?.layoverTime && (
                                <>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Stop :{" "}
                                    {
                                      openDrawer?.data?.departure?.[index]
                                        ?.arrivalLocation
                                    }
                                  </Typography>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Connecting Time : {item?.layoverTime} .
                                  </Typography>
                                  <Divider />
                                </>
                              )}
                          </>
                        ))}
                      </TabPanel>
                    )}
                    {openDrawer?.data?.return?.length > 0 && tripType !== "Multi City" && (
                      <TabPanel value={1}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography level="title-md">DEPART</Typography>
                            <Typography level="title-lg">
                              {moment(
                                openDrawer?.data?.return?.[0]?.departureTime
                              ).format("DD MMM, YY")}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center", flex: 1 }}>
                            <Typography level="title-lg">
                              {toLocation?.code} → {fromLocation?.code}
                            </Typography>
                            {/* total duration including connecting flight in case of stops */}
                            <Typography level="body-sm">
                              {openDrawer?.data?.return?.length - 1
                                ? `${openDrawer?.data?.return?.length - 1
                                } Stop | ${calculateTotalFlightTime(
                                  openDrawer?.data?.return
                                )}`
                                : "Non Stop"}
                            </Typography>
                          </Box>
                          {/*        <Box sx={{ textAlign: "right" }}>
                            <Typography
                              color={
                                !openDrawer?.data?.refundable
                                  ? "success"
                                  : "danger"
                              }
                              level="title-sm"
                            >
                              {!openDrawer?.data?.refundable
                                ? "Refundable"
                                : "Non-Refundable"}
                            </Typography>
                            {/* <Button variant="plain" size="sm">
                                                                            Fare Rules
                                                                        </Button>
                          </Box> */}
                        </Box>
                        <Divider />
                        {openDrawer?.data?.return?.map((item, index) => (
                          <>
                            {openDrawer?.data?.api === "sabre" &&
                              item?.layoverTime && (
                                <>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Stop :{" "}
                                    {
                                      openDrawer?.data?.return?.[index]
                                        ?.departureLocation
                                    }
                                  </Typography>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Connecting Time : {item?.layoverTime}{" "}
                                  </Typography>
                                  <Divider />
                                </>
                              )}

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mt: 3,
                              }}
                            >
                              <Box sx={{ width: 100, textAlign: "center" }}>
                                <AspectRatio
                                  ratio="1"
                                  sx={{ width: 60, mx: "auto", mb: 1 }}
                                >
                                  <img
                                    src={openDrawer?.data?.logo}
                                    alt="FlyDubai"
                                    style={{ objectFit: "contain" }}
                                  />
                                </AspectRatio>
                                <Typography level="body-xs">
                                  {openDrawer?.data?.arCode}
                                </Typography>
                                <Typography level="body-xs">
                                  {item?.marketingCarrier}{" "}
                                  {item?.marketingFlightNumber}
                                </Typography>

                                <Typography level="body-xs">
                                  {item?.logo?.arCode === item?.operatingLogo?.arCode ? "" : (item?.operatingLogo?.ar ? `Operated By ${item?.operatingLogo?.ar}` : "")}
                                </Typography>

                                {/* <Typography level="body-xs">(E6Q6M2)</Typography> */}
                                <Typography level="body-xs" sx={{ mt: 2 }}>
                                  TRAVEL CLASS
                                </Typography>
                                <Typography level="body-xs">
                                  {
                                    openDrawer?.data?.brandedFare?.data?.[0]
                                      ?.brandName?.[0]
                                  }
                                </Typography>
                              </Box>

                              <Box
                                sx={{ flex: 1, position: "relative", px: 4 }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 4,
                                  }}
                                >
                                  <Box>
                                    <Typography level="h3">
                                      {moment(item?.departureTime).format(
                                        "HH:mm"
                                      )}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {moment(item?.departureTime).format(
                                        "ddd, DD MMM,YY"
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      level="body-md"
                                      sx={{ textAlign: "center" }}
                                    >
                                      {formatDuration(item?.elapsedTime)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Typography level="h3">
                                      {moment(item?.arrivalTime).format(
                                        "HH:mm"
                                      )}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {moment(item?.arrivalTime).format(
                                        "ddd, DD MMM,YY"
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "30px",
                                    left: "70px",
                                    right: "70px",
                                    height: "1px",
                                    borderColor: "divider",
                                    borderBottom: "2px dashed grey",
                                    zIndex: 0,
                                  }}
                                />

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box sx={{ position: "relative", zIndex: 1 }}>
                                    <Box
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        bgcolor: "success.500",
                                        border: "3px solid white",
                                        boxShadow: "0 0 0 2px #4caf50",
                                        mb: 1,
                                      }}
                                    />
                                    <Typography level="title-sm">
                                      {item?.departureLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Muscat International Airport (Muscat)</Typography> */}
                                  </Box>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      zIndex: 1,
                                      textAlign: "right",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        bgcolor: "success.500",
                                        border: "3px solid white",
                                        boxShadow: "0 0 0 2px #4caf50",
                                        mb: 1,
                                        ml: "auto",
                                      }}
                                    />
                                    <Typography level="title-sm">
                                      {item?.arrivalLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Dubai International Airport (Dubai), Terminal 2</Typography> */}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>

                            {(openDrawer?.data?.api === "amadus" ||
                              openDrawer?.data?.api === "amadeus") &&
                              item?.layoverTime && (
                                <>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Stop :{" "}
                                    {
                                      openDrawer?.data?.return?.[index]
                                        ?.arrivalLocation
                                    }
                                  </Typography>
                                  <Typography
                                    level="h4"
                                    sx={{
                                      fontSize: "14px",
                                      textAlign: "center",
                                      my: 1,
                                    }}
                                  >
                                    Connecting Time : {item?.layoverTime} .
                                  </Typography>
                                  <Divider />
                                </>
                              )}
                          </>
                        ))}
                      </TabPanel>
                    )}

                    {tripType === "Multi City" && (
                      <>
                        {extractTripsForMultiCity(
                          openDrawer?.data?.api?.startsWith("amad")
                            ? openDrawer?.data?.departure
                            : openDrawer?.data?.api === "hitit"
                              ? [
                                ...(openDrawer?.data?.departure || []),
                                ...(openDrawer?.data?.return || []),
                              ]
                              : openDrawer?.data?.flights,
                          multicityFlights,
                          openDrawer?.data?.api
                        )?.map((flightItem, index) => (
                          <TabPanel value={index}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography level="title-md">DEPART</Typography>
                                <Typography level="title-lg">
                                  {moment(
                                    flightItem?.connectingFlights?.[0]
                                      ?.departure?.departureTime
                                      ? flightItem?.connectingFlights?.[0]
                                        ?.departure?.departureTime
                                      : flightItem?.connectingFlights?.[0]
                                        ?.departureTime
                                  ).format("DD MMM, YY")}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "center", flex: 1 }}>
                                <Typography level="title-lg">
                                  {flightItem?.from} → {flightItem?.to}
                                </Typography>
                                {/* total duration including connecting flight in case of stops */}
                                <Typography level="body-sm">
                                  {flightItem?.connectingFlights?.length - 1
                                    ? `${flightItem?.connectingFlights?.length -
                                    1
                                    } Stop | ${calculateTotalFlightTime(
                                      flightItem?.connectingFlights
                                    )}`
                                    : "Non Stop"}
                                </Typography>
                              </Box>
                              {/*  <Box sx={{ textAlign: "right" }}>
                                <Typography
                                  color={
                                    !openDrawer?.data?.refundable
                                      ? "success"
                                      : "danger"
                                  }
                                  level="title-sm"
                                >
                                  {!openDrawer?.data?.refundable
                                    ? "Refundable"
                                    : "Non-Refundable"}
                                </Typography>
                                {/* <Button variant="plain" size="sm">
                                                          Fare Rules
                                                      </Button>
                              </Box> */}
                            </Box>
                            <Divider />
                            {flightItem?.connectingFlights?.map(
                              (item, indexOfFlightItem) => (
                                <>
                                  {openDrawer?.data?.api === "sabre" &&
                                    (item?.departure?.layoverTime ||
                                      item?.layoverTime) &&
                                    flightItem?.connectingFlights?.length > 1 &&
                                    indexOfFlightItem !== 0 && (
                                      <>
                                        <Typography
                                          level="h4"
                                          sx={{
                                            fontSize: "14px",
                                            textAlign: "center",
                                            my: 1,
                                          }}
                                        >
                                          Stop :{" "}
                                          {flightItem?.connectingFlights?.[
                                            indexOfFlightItem
                                          ]?.departure?.departureLocation ||
                                            flightItem?.connectingFlights?.[
                                              indexOfFlightItem
                                            ]?.departureLocation}
                                        </Typography>
                                        <Typography
                                          level="h4"
                                          sx={{
                                            fontSize: "14px",
                                            textAlign: "center",
                                            my: 1,
                                          }}
                                        >
                                          Connecting Time :{" "}
                                          {getTimeDifference(
                                            flightItem?.connectingFlights?.[
                                              indexOfFlightItem - 1
                                            ]?.departure?.arrivalTime,
                                            flightItem?.connectingFlights?.[
                                              indexOfFlightItem
                                            ]?.departure?.departureTime
                                          )}
                                          {/* {item?.departure?.layoverTime ||
                                            item?.layoverTime} */}
                                        </Typography>
                                        <Divider />
                                      </>
                                    )}

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      mt: 3,
                                    }}
                                  >
                                    <Box
                                      sx={{ width: 100, textAlign: "center" }}
                                    >
                                      <Avatar
                                        src={item?.departure?.logo?.logo || item?.logo?.logo}
                                        alt={
                                          item?.departure?.logo?.code ||
                                          openDrawer?.data?.arCode
                                        }
                                        sx={{
                                          width: 60,
                                          height: 60,
                                          mx: "auto",
                                          mb: 1,
                                        }}
                                      />
                                      <Typography level="body-xs">
                                        {item?.departure?.logo?.code
                                          ? item?.departure?.logo?.code
                                          : openDrawer?.data?.arCode}
                                      </Typography>
                                      <Typography level="body-xs">
                                        {item?.departure?.marketingCarrier ||
                                          item?.departure?.operatingCarrier ||
                                          item?.operating}
                                        -
                                        {item?.departure
                                          ?.marketingFlightNumber ||
                                          item?.marketingFlightNumber}
                                      </Typography>
                                      <Typography level="body-xs">
                                        {item?.departure?.logo?.code === item?.departure?.operatingLogo?.code ? "" : `Operated By ${item?.departure?.operatingLogo?.arAbbreviation}`}
                                      </Typography>
                                      {/* <Typography level="body-xs">(E6Q6M2)</Typography> */}
                                      <Typography
                                        level="body-xs"
                                        sx={{ mt: 2 }}
                                      >
                                        TRAVEL CLASS
                                      </Typography>
                                      <Typography level="body-xs">
                                        {
                                          openDrawer?.data?.brandedFare
                                            ?.data?.[0]?.brandName?.[0] || openDrawer?.data?.brandedFare?.brandName
                                        }
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        flex: 1,
                                        position: "relative",
                                        px: 4,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          mb: 4,
                                        }}
                                      >
                                        <Box>
                                          <Typography level="h3">
                                            {moment(
                                              item?.departure?.departureTime ||
                                              item?.departureTime
                                            ).format("HH:mm")}
                                          </Typography>
                                          <Typography level="body-sm">
                                            {moment(
                                              item?.departure?.departureTime ||
                                              item?.departureTime
                                            ).format("ddd, DD MMM,YY")}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography
                                            level="body-md"
                                            sx={{ textAlign: "center" }}
                                          >
                                            {formatDuration(
                                              item?.departure?.elapsedTime ||
                                              item?.elapsedTime
                                            )}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                          <Typography level="h3">
                                            {moment(
                                              item?.departure?.arrivalTime ||
                                              item?.arrivalTime
                                            ).format("HH:mm")}
                                          </Typography>
                                          <Typography level="body-sm">
                                            {moment(
                                              item?.departure?.arrivalTime ||
                                              item?.arrivalTime
                                            ).format("ddd, DD MMM,YY")}
                                          </Typography>
                                        </Box>
                                      </Box>

                                      <Box
                                        sx={{
                                          position: "absolute",
                                          top: "30px",
                                          left: "70px",
                                          right: "70px",
                                          height: "1px",
                                          borderColor: "divider",
                                          borderBottom: "2px dashed grey",
                                          zIndex: 0,
                                        }}
                                      />

                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            position: "relative",
                                            zIndex: 1,
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: 16,
                                              height: 16,
                                              borderRadius: "50%",
                                              bgcolor: "success.500",
                                              border: "3px solid white",
                                              boxShadow: "0 0 0 2px #4caf50",
                                              mb: 1,
                                            }}
                                          />
                                          <Typography level="title-sm">
                                            {item?.departure
                                              ?.departureLocation ||
                                              item?.departureLocation}
                                          </Typography>
                                          {/* <Typography level="body-xs">Muscat International Airport (Muscat)</Typography> */}
                                        </Box>
                                        <Box
                                          sx={{
                                            position: "relative",
                                            zIndex: 1,
                                            textAlign: "right",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              width: 16,
                                              height: 16,
                                              borderRadius: "50%",
                                              bgcolor: "success.500",
                                              border: "3px solid white",
                                              boxShadow: "0 0 0 2px #4caf50",
                                              mb: 1,
                                              ml: "auto",
                                            }}
                                          />
                                          <Typography level="title-sm">
                                            {item?.departure?.arrivalLocation ||
                                              item?.arrivalLocation}
                                          </Typography>
                                          {/* <Typography level="body-xs">Dubai International Airport (Dubai), Terminal 2</Typography> */}
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>

                                  {(openDrawer?.data?.api === "amadus" ||
                                    openDrawer?.data?.api === "amadeus") &&
                                    (item?.departure?.layoverTime ||
                                      item?.layoverTime) &&
                                    flightItem?.connectingFlights?.length >
                                    1 && (
                                      <>
                                        <Typography
                                          level="h4"
                                          sx={{
                                            fontSize: "14px",
                                            textAlign: "center",
                                            my: 1,
                                          }}
                                        >
                                          Stop :{" "}
                                          {flightItem?.connectingFlights?.[
                                            indexOfFlightItem
                                          ]?.departure?.arrivalLocation ||
                                            flightItem?.connectingFlights?.[
                                              indexOfFlightItem
                                            ]?.arrivalLocation}
                                        </Typography>
                                        <Typography
                                          level="h4"
                                          sx={{
                                            fontSize: "14px",
                                            textAlign: "center",
                                            my: 1,
                                          }}
                                        >
                                          Connecting Time :{" "}
                                          {item?.departure?.layoverTime ||
                                            item?.layoverTime}
                                        </Typography>
                                        <Divider />
                                      </>
                                    )}
                                </>
                              )
                            )}
                          </TabPanel>
                        ))}
                      </>
                    )}
                    <TabPanel
                      value={
                        tripType === "Multi City"
                          ? extractTripsForMultiCity(
                            openDrawer?.data?.api?.startsWith("amad")
                              ? openDrawer?.data?.departure
                              : openDrawer?.data?.api === "hitit"
                                ? [
                                  ...(openDrawer?.data?.departure || []),
                                  ...(openDrawer?.data?.return || []),
                                ]
                                : openDrawer?.data?.flights,
                            multicityFlights,
                            openDrawer?.data?.api
                          )?.length
                          : openDrawer?.data?.return?.length
                            ? 2
                            : 1
                      }
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "auto",
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Box
                          sx={{
                            width: "60%",
                            height: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "18px", fontWeight: "450" }}
                          >
                            Fare Rules
                          </Typography>
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "12px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              border: "1px solid lightgrey",
                              overflow: "hidden",
                            }}
                          >
                            {(openDrawer?.data?.api === "amadus" ||
                              openDrawer?.data?.api === "amadeus") &&
                              openDrawer?.data?.itineraries?.fareRules?.rules ? (
                              <List marker="disc">
                                {openDrawer?.data?.itineraries?.fareRules?.rules?.map(
                                  (item, index) => (
                                    <ListItem key={index}>
                                      For {item?.category} the penalty amount is
                                      RS.{item?.maxPenaltyAmount}
                                    </ListItem>
                                  )
                                )}
                              </List>
                            ) : openDrawer?.data?.api === "sabre" &&
                              openDrawer?.data?.fareRule &&
                              (() => {
                                const pd = openDrawer?.data?.fareRule?.Summary?.PassengerDetails?.PassengerDetail;
                                const det = Array.isArray(pd) ? pd[0] : pd;
                                const pens = det?.PenaltiesInfo?.Penalty;
                                return Array.isArray(pens) && pens.length > 0;
                              })() ? (
                              (() => {
                                const pd = openDrawer?.data?.fareRule?.Summary?.PassengerDetails?.PassengerDetail;
                                const det = Array.isArray(pd) ? pd[0] : pd;
                                const penalties = det?.PenaltiesInfo?.Penalty || [];
                                return (
                                  <Box sx={{ width: "100%", p: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <Typography sx={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.8px", mb: "2px" }}>
                                      Penalties {"&"} Conditions
                                    </Typography>
                                    {penalties.map((item, index) => {
                                      const isExchange = item?.Type === "Exchange";
                                      const isChangeable = item?.Changeable === "true";
                                      const isRefundable = item?.Refundable === "true";
                                      const hasAmount = !!(item?.Amount && item?.CurrencyCode);
                                      const badgeColor = isExchange ? "#92400e" : "#166534";
                                      const badgeBg = isExchange ? "#fef3c7" : "#dcfce7";
                                      const borderAccent = isExchange ? "#d97706" : "#16a34a";

                                      let statusLabel = "";
                                      let statusOk = false;
                                      if (isExchange) {
                                        statusOk = isChangeable;
                                        statusLabel = isChangeable ? "Changeable" : "Not Changeable";
                                      } else {
                                        statusOk = isRefundable;
                                        statusLabel = isRefundable ? "Refundable" : "Not Refundable";
                                      }
                                      if (hasAmount) statusLabel += ` (${item.CurrencyCode} ${Number(item.Amount).toLocaleString()})`;

                                      return (
                                        <Box
                                          key={index}
                                          sx={{
                                            borderRadius: "8px",
                                            p: "10px 14px",
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                            borderLeft: `4px solid ${borderAccent}`,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "5px",
                                          }}
                                        >
                                          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Box
                                              sx={{
                                                backgroundColor: badgeBg,
                                                color: badgeColor,
                                                borderRadius: "12px",
                                                px: "8px",
                                                py: "2px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                display: "inline-block",
                                              }}
                                            >
                                              {item?.Type || "Penalty"}
                                            </Box>
                                            <Typography sx={{ fontSize: "13px", color: "#374151" }}>
                                              {item?.Applicability === "Before" ? "Before Departure" : item?.Applicability === "After" ? "After Departure" : (item?.Applicability || "")}
                                            </Typography>
                                          </Box>
                                          <Typography sx={{ fontSize: "13px", fontWeight: "600", color: statusOk ? "#16a34a" : "#dc2626" }}>
                                            {statusOk ? "✓" : "✗"} {statusLabel}
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                  </Box>
                                );
                              })()
                            ) : openDrawer?.data?.api === "hitit" ? (
                              <Box sx={{ width: "100%" }}>
                                {loadingHititRules ? (
                                  <Box sx={{ p: "14px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Typography sx={{ fontSize: "14px", color: "#6b7280" }}>Loading fare rules...</Typography>
                                  </Box>
                                ) : hititRules?.remarks?.length > 0 ? (
                                  <Box sx={{ width: "100%", p: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <Typography sx={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.8px", mb: "2px" }}>
                                      Fare Rules {"&"} Conditions
                                    </Typography>
                                    {hititRules.remarks.map((rule, idx) => {
                                      const isPenalty = rule?.ruleCode === "16" || rule?.ruleCode === "31" || rule?.ruleCode === "33";
                                      const isBaggage = rule?.ruleCode === "23";
                                      const borderAccent = isPenalty ? "#d97706" : isBaggage ? "#2563eb" : "#6b7280";
                                      const badgeBg = isPenalty ? "#fef3c7" : isBaggage ? "#dbeafe" : "#f3f4f6";
                                      const badgeColor = isPenalty ? "#92400e" : isBaggage ? "#1e40af" : "#374151";

                                      return (
                                        <Box
                                          key={idx}
                                          sx={{
                                            borderRadius: "8px",
                                            p: "10px 14px",
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                            borderLeft: `4px solid ${borderAccent}`,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                          }}
                                        >
                                          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Box
                                              sx={{
                                                backgroundColor: badgeBg,
                                                color: badgeColor,
                                                borderRadius: "12px",
                                                px: "8px",
                                                py: "2px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                display: "inline-block",
                                              }}
                                            >
                                              {rule?.ruleCode || "—"}
                                            </Box>
                                            <Typography sx={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>
                                              {rule?.title || "Rule"}
                                            </Typography>
                                          </Box>
                                          {rule?.text && (
                                            <Typography
                                              sx={{
                                                fontSize: "12px",
                                                color: "#374151",
                                                whiteSpace: "pre-wrap",
                                                lineHeight: "1.5",
                                                backgroundColor: "#fff",
                                                borderRadius: "6px",
                                                p: "8px",
                                                border: "1px solid #e5e7eb",
                                              }}
                                            >
                                              {rule.text}
                                            </Typography>
                                          )}
                                        </Box>
                                      );
                                    })}
                                  </Box>
                                ) : hititRules !== null ? (
                                  /* API returned successfully but remarks array is empty */
                                  <Box sx={{ p: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <Box
                                      sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        backgroundColor: "#dcfce7",
                                        border: "1px solid #86efac",
                                        borderRadius: "8px",
                                        px: "12px",
                                        py: "8px",
                                        width: "fit-content",
                                      }}
                                    >
                                      <Typography sx={{ fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>
                                        ✓ No Restrictions Found
                                      </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: "12px", color: "#6b7280", mt: "2px" }}>
                                      The airline returned no penalty information for this fare. This fare may be fully flexible.
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ p: "14px 16px" }}>
                                    <Typography sx={{ fontSize: "14px", color: "#6b7280" }}>
                                      Fare rules could not be retrieved. Please contact support.
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  ml: "20px",
                                }}
                              >
                                Fare rules not available, please get in touch
                                with support team.
                              </Typography>
                            )}
                          </Box>
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "20px",
                              display: "flex",
                              py: 2,
                              border: "1px solid lightgrey",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "13px", ml: "20px", mr: "10px" }}
                            >
                              * The above data is indicatory , fare rules are
                              subject to changes by the Airline from time to
                              time depending upon Fare class and
                              change/cancellation fee amount may also vary based
                              on fluctuations in currency conversion rates.
                            </Typography>
                            <Typography sx={{ fontSize: "13px", ml: "20px" }}>
                              * Although we will try to keep this section
                              updated regularly.
                            </Typography>
                            <Typography sx={{ fontSize: "13px", ml: "20px" }}>
                              * Cancellation/Reissue fees will follow the more
                              restrictive fare type.
                            </Typography>
                            <Typography sx={{ fontSize: "13px", ml: "20px" }}>
                              * Feel free to call our Contact Centre for exact
                              cancellation/change fee.
                            </Typography>
                            <Typography sx={{ fontSize: "13px", ml: "20px" }}>
                              * Cancellation/Date change request will be
                              accepted 30 hrs prior to departure.
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ width: "35%", height: "auto" }}>
                          <Typography
                            sx={{ fontSize: "18px", fontWeight: "450" }}
                          >
                            Fare Details
                          </Typography>
                          <Box
                            sx={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "20px",
                              display: "flex",
                              border: "1px solid lightgrey",
                              flexDirection: "column",
                              mt: "10px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: "14px" }}>
                                Base Fare
                              </Typography>
                              <Typography sx={{ fontSize: "10px" }}>
                                RS{" "}
                                <Typography
                                  sx={{ fontSize: "16px", fontWeight: "500" }}
                                >
                                  {openDrawer?.data?.api === "hitit"
                                    ? openDrawer?.data?.totalFare -
                                    openDrawer?.data?.totalTax
                                    : openDrawer?.data?.baseFare}{" "}
                                </Typography>
                              </Typography>
                            </Box>
                            {openDrawer?.data?.extra &&
                              Object?.entries(openDrawer?.data?.extra)?.map(
                                ([type, data]) => {
                                  if ((openDrawer?.data?.api === "hitit" &&
                                    data?.count &&
                                    data?.amount) ||
                                    (data?.count && data?.Price)) {
                                    const isHitit =
                                      openDrawer?.data?.api === "hitit";
                                    const price = isHitit
                                      ? data.amount
                                      : data.Price;

                                    const unitPrice = isHitit
                                      ? (price / data.count).toFixed(0)
                                      : (price / data.count / 1000)
                                        .toFixed(3)
                                        ?.replace(".", ""); // Adjust divisor if needed
                                    const totalPrice = isHitit
                                      ? price
                                      : (price / 1000)
                                        .toFixed(3)
                                        ?.replace(".", ""); // Assuming price is in Baisa (1000 Baisa = 1 OMR)

                                    return (
                                      <Box
                                        key={type}
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          p: 1,
                                        }}
                                      >
                                        <Typography sx={{ fontSize: "14px" }}>
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}{" "}
                                          ({data.count} × RS {unitPrice})
                                        </Typography>
                                        <Typography sx={{ fontSize: "10px" }}>
                                          RS{" "}
                                          <Typography
                                            component="span"
                                            sx={{ fontSize: "16px" }}
                                          >
                                            {totalPrice}
                                          </Typography>
                                        </Typography>
                                      </Box>
                                    );
                                  }
                                  return null;
                                }
                              )}

                            <Divider orientation="horizontal" />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: "14px" }}>
                                Tax & Charge (Included)
                              </Typography>
                              <Typography sx={{ fontSize: "10px" }}>
                                RS{" "}
                                <Typography sx={{ fontSize: "16px" }}>
                                  {openDrawer?.data?.api === "hitit"
                                    ? openDrawer?.data?.totalTax
                                    : openDrawer?.data?.taxSummaries?.reduce(
                                      (acc, tax) =>
                                        acc + (parseFloat(tax.amount) || 0),
                                      0
                                    ) || 0}{" "}
                                </Typography>
                              </Typography>
                              {console.log(openDrawer?.data, "open", openDrawer)}
                            </Box>
                            {/* <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                            <Typography sx={{ fontSize: "14px" }}>Airline Misc</Typography>
                            <Typography sx={{ fontSize: "10px" }}>OMR <Typography sx={{ fontSize: "16px" }}> 31.020 </Typography></Typography>
                          </Box> */}
                            <Divider orientation="horizontal" />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1,
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "18px", fontWeight: "500" }}
                              >
                                Total Amount
                              </Typography>
                              <Typography sx={{ fontSize: "10px" }}>
                                RS{" "}
                                <Typography
                                  sx={{ fontSize: "16px", fontWeight: "500" }}
                                >
                                  {" "}
                                  {openDrawer?.data?.passengerTotalFare}{" "}
                                </Typography>
                              </Typography>
                            </Box>
                            {/* <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                p: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: "12px" }}>
                                Net fare:{" "}
                                <Typography sx={{ fontSize: "10px" }}>
                                  RS{" "}
                                  <Typography sx={{ fontSize: "16px" }}>
                                    {" "}
                                    {openDrawer?.data?.netFare}{" "}
                                  </Typography>
                                </Typography>
                              </Typography>
                            </Box> */}
                          </Box>
                        </Box>
                      </Box>
                    </TabPanel>
                    <TabPanel
                      value={
                        tripType === "Multi City"
                          ? extractTripsForMultiCity(
                            openDrawer?.data?.api?.startsWith("amad")
                              ? openDrawer?.data?.departure
                              : openDrawer?.data?.api === "hitit"
                                ? [
                                  ...(openDrawer?.data?.departure || []),
                                  ...(openDrawer?.data?.return || []),
                                ]
                                : openDrawer?.data?.flights,
                            multicityFlights,
                            openDrawer?.data?.api
                          )?.length + 1
                          : openDrawer?.data?.return?.length
                            ? 3
                            : 2
                      }
                    >
                      <Typography level="h3">DEPART</Typography>
                      {openDrawer?.data?.departure?.map((item, index) => (
                        <>
                          <Typography
                            level="h4"
                            sx={{ fontSize: "14px", my: 1 }}
                          >
                            {" "}
                            {moment(item?.departureTime).format(
                              "ddd, DD MMM,YY"
                            )}{" "}
                            <Typography level="h4">
                              {" "}
                              | {item?.departureLocation} →{" "}
                              {item?.arrivalLocation}{" "}
                            </Typography>
                          </Typography>

                          <Divider />
                          <Box
                            sx={{
                              width: 250,
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                // justifyContent: "center",
                                my: 2,
                              }}
                            >
                              <Box
                                component="img"
                                src={`${require("../../images/baggage.jpg")}`}
                                alt="Baggage icon"
                                sx={{ height: 120, width: 100 }}
                              />
                              <Box sx={{ ml: 2, textAlign: "left" }}>
                                <Typography level="h4">Check-in</Typography>
                                {openDrawer?.data?.api === "hitit" ? (
                                  (() => {
                                    const bagInfo = openDrawer?.data?.brandedFare?.baggageInformation;
                                    const bagText = bagInfo && bagInfo.length > 0
                                      ? `${bagInfo[0].weight} ${bagInfo[0].unit}`
                                      : "No Baggage Info";
                                    return (
                                      <Typography fontSize="sm">
                                        Adult: {bagText}
                                      </Typography>
                                    );
                                  })()
                                ) : (
                                  passengerTypes.map((type) => {
                                    const count =
                                      openDrawer?.data?.extra?.[type]?.count;
                                    if (count > 0) {
                                      return (
                                        <Typography
                                          fontSize="sm"
                                          key={`${type}-checkin`}
                                        >
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                          :{" "}
                                          {getCheckinText(type, openDrawer?.data)}
                                        </Typography>
                                      );
                                    }
                                    return null;
                                  })
                                )}
                                <Typography level="h4">Cabin</Typography>
                                {openDrawer?.data?.api === "hitit" ? (
                                  <Typography fontSize="sm">
                                    Adult: 7 KG
                                  </Typography>
                                ) : (
                                  passengerTypes.map((type) => {
                                    const count =
                                      openDrawer?.data?.extra?.[type]?.count;
                                    if (count > 0) {
                                      return (
                                        <Typography
                                          fontSize="sm"
                                          key={`${type}-cabin`}
                                        >
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                          : {getCabinText(type, openDrawer?.data)}
                                        </Typography>
                                      );
                                    }
                                    return null;
                                  })
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Divider />
                        </>
                      ))}

                      {openDrawer?.data?.return?.length > 0 &&
                        tripType !== "Multi City" && (
                          <Typography level="h3">RETURN</Typography>
                        )}

                      {openDrawer?.data?.return?.length > 0 &&
                        tripType !== "Multi City" &&
                        openDrawer?.data?.return?.map((item, index) => (
                          <>
                            <Typography
                              level="h4"
                              sx={{ fontSize: "14px", my: 1 }}
                            >
                              {" "}
                              {moment(item?.departureTime).format(
                                "ddd, DD MMM,YY"
                              )}{" "}
                              <Typography level="h4">
                                {" "}
                                | {item?.departureLocation} →{" "}
                                {item?.arrivalLocation}{" "}
                              </Typography>
                            </Typography>

                            <Divider />
                            <Box
                              sx={{
                                width: 250,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  // justifyContent: "center",
                                  my: 2,
                                }}
                              >
                                <Box
                                  component="img"
                                  src={`${require("../../images/baggage.jpg")}`}
                                  alt="Baggage icon"
                                  sx={{ height: 120, width: 100 }}
                                />
                                <Box sx={{ ml: 2, textAlign: "left" }}>
                                  <Typography level="h4">Check-in</Typography>
                                  {openDrawer?.data?.api === "hitit" ? (
                                    (() => {
                                      const bagInfo = openDrawer?.data?.brandedFare?.baggageInformation;
                                      const bagText = bagInfo && bagInfo.length > 0
                                        ? `${bagInfo[0].weight} ${bagInfo[0].unit}`
                                        : "No Baggage Info";
                                      return (
                                        <Typography fontSize="sm">
                                          Adult: {bagText}
                                        </Typography>
                                      );
                                    })()
                                  ) : (
                                    passengerTypes.map((type) => {
                                      const count =
                                        openDrawer?.data?.extra?.[type]?.count;
                                      if (count > 0) {
                                        return (
                                          <Typography
                                            fontSize="sm"
                                            key={`${type}-checkin`}
                                          >
                                            {type.charAt(0).toUpperCase() +
                                              type.slice(1)}
                                            :{" "}
                                            {getCheckinText(
                                              type,
                                              openDrawer?.data
                                            )}
                                          </Typography>
                                        );
                                      }
                                      return null;
                                    })
                                  )}
                                  <Typography level="h4">Cabin</Typography>
                                  {openDrawer?.data?.api === "hitit" ? (
                                    <Typography fontSize="sm">
                                      Adult: 7 KG
                                    </Typography>
                                  ) : (
                                    passengerTypes.map((type) => {
                                      const count =
                                        openDrawer?.data?.extra?.[type]?.count;
                                      if (count > 0) {
                                        return (
                                          <Typography
                                            fontSize="sm"
                                            key={`${type}-cabin`}
                                          >
                                            {type.charAt(0).toUpperCase() +
                                              type.slice(1)}
                                            :{" "}
                                            {getCabinText(type, openDrawer?.data)}
                                          </Typography>
                                        );
                                      }
                                      return null;
                                    })
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <Divider />
                          </>
                        ))}

                      <Box
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          p: 1,
                          borderRadius: "5px",
                          my: 2,
                        }}
                      >
                        <Typography sx={{ fontSize: "14px", color: "grey" }}>
                          The information presented above is as obtained from
                          the airline reservation system. Al-Saboor does not
                          guarantee the accuracy of this information. The
                          baggage allowance may vary according to stop-overs,
                          connecting flights and changes in airline rules.
                        </Typography>
                      </Box>
                    </TabPanel>
                  </Tabs>
                </Box>
              </Drawer>
            )}

            <Modal
              open={confirmationModal?.value}
              onClose={() => setConfirmationModal(false)}
            >
              <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                  <WarningRoundedIcon />
                  CONFIRM
                </DialogTitle>
                <Divider />
                <DialogContent
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Box sx={{ width: "100%", py: 2, px: 1 }}>
                    {/* Header section */}
                    <Typography
                      sx={{
                        textAlign: "center",
                        mb: 3,
                        fontSize: "14px",
                        color: "text.secondary",
                        fontWeight: "500",
                      }}
                    >
                      You have searched for
                    </Typography>

                    {/* Flight details card */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 3,
                        mb: 3,
                        py: 2,
                        px: 2,
                        backgroundColor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "8px",
                      }}
                    >
                      {/* Departure section */}
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: "12px",
                            color: "text.secondary",
                            mb: 1,
                          }}
                        >
                          {fromLocation?.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "700",
                            fontSize: "28px",
                            color: "primary.main",
                            mb: 0.5,
                            lineHeight: 1,
                          }}
                        >
                          {moment(
                            confirmationModal?.flight?.departure?.[0]
                              ?.departureTime
                          ).format("HH:mm")}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "12px", color: "text.secondary" }}
                        >
                          {moment(
                            confirmationModal?.flight?.departure?.[0]
                              ?.departureTime
                          ).format("ddd, DD MMM, YY")}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "11px", fontWeight: "600", mt: 0.5 }}
                        >
                          {fromLocation?.code}
                        </Typography>
                      </Box>

                      {/* Arrow indicator */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                        }}
                      >
                        <ArrowRight size={24} />
                      </Box>

                      {/* Arrival section */}
                      <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: "12px",
                            color: "text.secondary",
                            mb: 1,
                          }}
                        >
                          {toLocation?.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "700",
                            fontSize: "28px",
                            color: "primary.main",
                            mb: 0.5,
                            lineHeight: 1,
                          }}
                        >
                          {moment(
                            confirmationModal?.flight?.departure?.[
                              confirmationModal?.flight?.departure?.length - 1
                            ]?.arrivalTime
                          ).format("HH:mm")}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "12px", color: "text.secondary" }}
                        >
                          {moment(
                            confirmationModal?.flight?.departure?.[
                              confirmationModal?.flight?.departure?.length - 1
                            ]?.arrivalTime
                          ).format("ddd, DD MMM, YY")}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "11px", fontWeight: "600", mt: 0.5 }}
                        >
                          {toLocation?.code}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Confirmation question */}
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "text.primary",
                      }}
                    >
                      Are you sure you want to continue with selected sector?
                    </Typography>
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button
                    variant="solid"
                    color="success"
                    onClick={() => {
                      navigate("/booking", {
                        state: {
                          flight: confirmationModal?.flight,
                          tripType: confirmationModal?.tripType,
                          brandedFare: confirmationModal?.brandedFare,
                          multicityFlights: confirmationModal?.multicityFlights,
                          brandedFareDetail:
                            confirmationModal?.brandedFareDetail,
                          extractedFlightsForMultiCity:
                            confirmationModal?.extractedFlightsForMultiCity,
                          selectedBrandedFare:
                            confirmationModal?.selectedBrandedFare,
                          responseBrandedFare:
                            confirmationModal?.responseBrandedFare,
                          flightData: confirmationModal?.flightData,
                        },
                      });
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => setConfirmationModal(false)}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </ModalDialog>
            </Modal>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchFlights;

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Grid, Stack, Typography } from "@mui/joy";
import { Country, City } from "country-state-city";
import { useSnackbar } from "notistack";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import AppDatePicker from "../../components/common/AppDatePicker";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AlasamLogo from "../../images/alasamLogo.png";
import AppButton from "../../components/common/AppButton";
import BookingFooter from "../../pages-components/BookingEngine/BookingFooter";
import { addPSF, bookAndIssue, getUserDetails, sabreMultiCitybookAndIssue, submitBookingRequest, submitSabreBookingMRequest, submitSabreBookingRequest, viewItinary } from "../../server/api";
import { cnicRegex, emailRegex, phoneNumberRegex } from "../../components/utils";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { capitalizeFirstLetter, getTitle, removeSeconds, removeTitles } from "../../utils/HelperFunctions";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FlightTicketCard from "../../pages-components/BookingEngine/FlightTicket";
import IssueTicketModal from "../../components/modals/IssueTicketModal";
import { setDashboardOption } from "../../redux/reducer/dashboardSlice";
import CreditModal from "../../components/modals/CreditModal";
import ReviewConfirmationModal from "../../components/modals/ReviewConfirmantionModal";
import AddBaseFare from "../../components/modals/AddBaseFare";
import { generatePDFTicket } from "../../components/utils/Ticket";
import { NEXT_PUBLIC_PROD_IMAGE_URL } from "../../env";
import { useTicketFilterValues } from "../../context/ticketFilterValues";

const RenderTravelerContactForm = React.memo(({ travelerFormFields, travellerPhone, setTravellerPhone, travellerEmail, setTravellerEmail, setCountryCode }) => {
  const handlePhoneChange = (phone, country) => {
    setTravellerPhone(phone);
    console.log(phone, country)
    setCountryCode(country?.dialCode); // Set the country code
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 'md' }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {travelerFormFields.map(
          ({ component: Field, label, name, options, size, type }, fieldIndex) => (
            <Box key={fieldIndex} sx={{ flexBasis: "calc(33.333% - 16px)", flexGrow: 0, flexShrink: 0 }}>

              {Field === PhoneInput ? (
                <PhoneInput
                  country={"pk"}
                  enableSearch={true}
                  value={travellerPhone}
                  onChange={(phone, country) => handlePhoneChange(phone, country)}
                />
              ) : Field === Typography ? (
                <Typography level="h6" sx={{ marginTop: '20px' }}>Traveller Contact Information</Typography>
              ) : (
                <Field
                  type={type}
                  label={label}
                  name={name}
                  options={options}
                  fullWidth
                  value={travellerEmail}
                  onChange={(e) => setTravellerEmail(e.target.value)}
                  size={size}
                />
              )}
            </Box>
          )
        )}
      </Box>
    </Box>
  )
});

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
      <Grid xs={7}>
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
      <Grid xs={2} sx={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #CDD7E1', borderBottom: '1px solid #CDD7E1' }}>
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

const Booking = () => {
  const location = useLocation();
  const travelerRef = useRef(null);
  const { resetFilters, setAdultsCount, setArrivalCity, setChildrenCount, setDepartureCity, setDepartureDate, setFlightTickets, setInfantsCount, setMulticityFlights, setReturnDate, setTripType, markupPreference } = useTicketFilterValues()
  const flight = location.state?.flight;
  const tripType = location.state?.tripType;
  const brandedFare = location.state?.brandedFare;
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [countryCodes, setCountryCodes] = useState([])
  const [cities, setCities] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [travellerPhone, setTravellerPhone] = useState("");
  const [travellerEmail, setTravellerEmail] = useState("");
  const [countryCode, setCountryCode] = useState('');
  const [travellerArray, setTravellerArray] = useState([]);
  const [openModal, setOpenModal] = useState(false)
  const [openCreditModal, setOpenCreditModal] = useState({ value: false, pnr: null })
  const [openReviewConfirmationModal, setOpenReviewConfirmationModal] = useState(false)
  const [openBaseFareModal, setOpenBaseFareModal] = useState(false)
  const [psfValue, setPsfValue] = useState('')
  const [printOption, setPrintOption] = useState('')

  const getFullName = (traveler, apiType) => {
    if (apiType === "amadus" || apiType === "amadeus") {
      return traveler.fullName
    } else {
      return traveler.fullName + " " + traveler.title
    }
  }

  const updatePhoneNumberByApiType = (apiType) => {
    if (apiType === "amadus" || apiType === "amadeus") {
      return travellerPhone.slice(countryCode.length)
    } else {
      return travellerPhone
    }
  }

  const getDocmentTypeByApiType = (apiType, traveler) => {
    if (apiType === 'amadus' || apiType === "amadeus") {
      if (traveler === 'Passport') {
        return 'PASSPORT';
      } else if (traveler === 'National ID') {
        return 'IDENTITY_CARD';
      }
    } else if (apiType === 'sabre') {
      if (traveler === 'Passport') {
        return 'P';
      } else if (traveler === 'National ID') {
        return 'I';
      }
    }
  }

  const validateForm = () => {
    let valid = true;

    console.log(travelers)

    travelers.forEach((traveler, index) => {
      if (!traveler.fullName || !traveler.lastName || !traveler.dob || !traveler.title || !traveler.nationality || !traveler.dob || !traveler.documentNo || !traveler.documentType || !traveler.passportIssuanceCountry) {
        enqueueSnackbar(`Please fill all required fields for ${traveler?.type} ${index + 1}.`, { variant: "error" });
        valid = false;
      }

      // if (!emailRegex.test(travellerEmail)) {
      //   enqueueSnackbar(`Please provide a valid email address for traveler.`, { variant: "error" });
      //   valid = false;
      // }

      if (!traveler.documentType === "National ID" && !cnicRegex.test(traveler.documentNo)) {
        enqueueSnackbar(`Please enter a valid CNIC (13 digits) for traveler Information.`, { variant: "error" });
        valid = false;
      }

      if (!travellerPhone) {
        enqueueSnackbar(`Please enter a phone number traveler Information.`, { variant: "error" });
        valid = false;
      }

      // if (!phoneNumberRegex.test(traveler.phoneNumber)) {
      //   enqueueSnackbar(`Please enter a valid phone number (11 digits) for traveler ${index + 1}.`, { variant: "error" });
      //   valid = false;
      // }




      if (new Date(traveler.dob).toDateString() === new Date().toDateString()) {
        enqueueSnackbar(`Please provide a valid date of birth for traveler ${index + 1}.`, { variant: "error" });
        valid = false;
      }

      if (new Date(traveler.passportExpiryDate) < new Date()) {
        enqueueSnackbar(`Passport expiry date cannot be in the past for traveler ${index + 1}.`, { variant: "error" });
        valid = false;
      }
    });

    return valid;
  };

  const handleInputChange = (index, field, value) => {
    const updatedTravelerData = [...travelers];
    updatedTravelerData[index] = { ...updatedTravelerData[index], [field]: value };

    setTravelers(updatedTravelerData);


    if (field === "documentNo" && value.length > 5) {
      getUserDetails({ documentNumber: value }).then((res) => {
        const updatedData = res.result?.[0];
        if (updatedData) {
          enqueueSnackbar("User data has been successfully loaded.", { variant: "success" });
        }

        const manipulatedUpdatedData = {
          type: updatedTravelerData[index]?.type,
          fullName: removeTitles(updatedData?.name?.firstName),
          lastName: updatedData?.name?.lastName,
          passportNumber: updatedData?.documents?.[0]?.documentType === "PASSPORT" ? updatedData?.documents?.[0]?.number : '',
          dob: updatedData?.dateOfBirth ? new Date(updatedData?.dateOfBirth) : "",
          title: getTitle(updatedData?.name?.firstName),
          nationality: updatedData?.documents?.[0]?.nationality ? updatedData?.documents?.[0]?.nationality : '',
          documentType: updatedData?.documents?.[0]?.documentType ? capitalizeFirstLetter(updatedData?.documents?.[0]?.documentType) : '',
          documentNo: updatedData?.documents?.[0]?.number ? updatedData?.documents?.[0]?.number : '',
          passportExpiryDate: updatedData?.documents?.[0]?.expiryDate ? new Date(updatedData?.documents?.[0]?.expiryDate) : "",
          passportIssuanceCountry: updatedData?.documents?.[0]?.issuanceCountry ? updatedData?.documents?.[0]?.issuanceCountry : '',
          gender: updatedData?.gender ? capitalizeFirstLetter(updatedData?.gender) : '',
        }

        updatedTravelerData[index] = manipulatedUpdatedData

        setTravelers([...updatedTravelerData])
      }).catch((err) => {
        console.log(err)
      })

      return;
    }


    if (field === "country") {
      const selectedCountry = countries.find((c) => c.name === value);
      if (selectedCountry) {
        console.log("selected cities", cities)
        setCities(
          City.getCitiesOfCountry(selectedCountry.isoCode).map(
            (city) => city.name
          )
        );
      } else {
        setCities([]);
      }
    }
  };

  const handleDateChange = (index, field, date) => {
    setTravelers((prevTravelers) => {
      const newTravelers = [...prevTravelers];
      newTravelers[index] = { ...newTravelers[index], [field]: date };
      return newTravelers;
    });
  };

  const adultFormFields = [
    { component: FormSelect, label: "Title *", name: "title", options: ["Mr", "Mrs", "Miss"] },
    { component: InputField, label: "First Name *", name: "fullName" },
    { component: InputField, label: "Last Name *", name: "lastName" },
    { component: FormSelect, label: "Gender *", name: "gender", options: ["Male", "Female"] },
    { component: AppDatePicker, name: "dob", size: "sm", label: "Date of Birth *", placeholder: "MM/DD/YYYY" },
    { component: FormSelect, label: "Nationality *", name: "nationality", options: Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })) },
    { component: FormSelect, label: "Document Type *", name: "documentType", options: ["Passport", "National ID"] },
    { component: InputField, label: "Document No *", name: "documentNo" },
    { component: AppDatePicker, name: "passportExpiryDate", size: "sm", label: "Expiry Date" },
    { component: FormSelect, label: "Passport Issuance Country *", name: "passportIssuanceCountry", options: Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })) },
  ];

  const ChildFormFields = [
    { component: FormSelect, label: "Title *", name: "title", options: ["Miss", "Mstr"] },
    { component: InputField, label: "First Name *", name: "fullName" },
    { component: InputField, label: "Last Name *", name: "lastName" },
    { component: FormSelect, label: "Gender *", name: "gender", options: ["Male", "Female"] },
    { component: AppDatePicker, name: "dob", size: "sm", label: "Date of Birth *", placeholder: "MM/DD/YYYY" },
    { component: FormSelect, label: "Nationality *", name: "nationality", options: Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })) },
    { component: FormSelect, label: "Document Type *", name: "documentType", options: ["Passport", "National ID"] },
    { component: InputField, label: "Document No *", name: "documentNo" },
    { component: AppDatePicker, name: "passportExpiryDate", size: "sm", label: "Expiry Date" },
    { component: FormSelect, label: "Passport Issuance Country *", name: "passportIssuanceCountry", options: Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })) },
  ];

  const infantFormFields = [
    { component: FormSelect, label: "Title *", name: "title", options: ["Miss", "Mstr"] },
    { component: InputField, label: "First Name *", name: "fullName" },
    { component: InputField, label: "Last Name *", name: "lastName" },
    { component: FormSelect, label: "Gender *", name: "gender", options: ["Male", "Female"] },
    { component: AppDatePicker, name: "dob", size: "sm", label: "Date of Birth *" },
    { component: FormSelect, label: "Nationality", name: "nationality", options: Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })) },
    { component: FormSelect, label: "Document Type *", name: "documentType", options: ["Passport", "National ID"] },
    { component: InputField, label: "Document No *", name: "documentNo" },
    { component: AppDatePicker, name: "passportExpiryDate", size: "sm", label: "Expiry Date" },
    { component: FormSelect, label: "Passport Issuance Country *", name: "passportIssuanceCountry", options: Country.getAllCountries().map(c => ({ id: c.isoCode, name: c.name })) },
  ];

  const travelerFormFields = [
    // { component: FormSelect, label: "Country Phone Code *", name: "countryPhoneCode", options: countryCodes },
    // { component: InputField, label: "Phone *", name: "phoneNumber", type: "number" },
    { component: Typography },
    { component: InputField, label: "Email *", name: "email", type: "email" },
    { component: PhoneInput },
  ]

  const renderTravelerForm = (traveler, index) => (
    <Box key={index} sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 'md' }}>
      <Typography level="h5" sx={{ mb: 2 }}>{`${traveler?.type} ${index + 1}`}</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {(traveler?.type === "Infant" ? infantFormFields : traveler?.type === "Child" ? ChildFormFields : adultFormFields).map(
          ({ component: Field, label, name, options, size, type }, fieldIndex) => (
            <Box key={fieldIndex} sx={{ flexBasis: "calc(33.333% - 16px)", flexGrow: 0, flexShrink: 0 }}>
              {Field === AppDatePicker ? (
                <Field
                  label={label}
                  name={name}
                  size={size}
                  date={traveler[name]}
                  zIndex="1"
                  handleChange={(date) => handleDateChange(index, name, date)}
                  placeholder={"DD/MM/YYYY"}
                />
              ) : (
                <Field
                  type={type}
                  label={label}
                  name={name}
                  options={options}
                  fullWidth
                  value={traveler[name]}
                  onChange={(e) => handleInputChange(index, name, e.target.value)}
                  size={size}
                />
              )}
            </Box>
          )
        )}

      </Box>
    </Box>
  );

  const handleIssueTicket = async () => {

    const transformedTravelers = travelers.map((traveler, index) => ({
      id: (index + 1).toString(),
      dateOfBirth: traveler.dob ? traveler.dob.toISOString().split("T")[0] : null,
      gender: traveler.gender ? traveler.gender.toUpperCase() : null,
      travelerType: traveler?.type === "Adult" ? "ADULT" : traveler?.type === "Child" ? "CHILD" : "INFANT",
      name: {
        firstName: getFullName(traveler, flight.api),
        lastName: traveler.lastName || "",
      },
      documents: [
        {
          number: traveler.documentNo || "",
          expiryDate: traveler.passportExpiryDate
            ? traveler.passportExpiryDate.toISOString().split("T")[0]
            : null,
          issuanceCountry: traveler.passportIssuanceCountry,
          validityCountry: traveler.passportIssuanceCountry,
          nationality: traveler.nationality,
          documentType: getDocmentTypeByApiType(flight.api, traveler?.documentType),
          holder: true,
        },
      ],
      contact: {
        purpose: "STANDARD",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: countryCode ? countryCode : "",
            number: updatePhoneNumberByApiType(flight.api),
          },
        ],
        // Commenting this becuase in INFANT , backend is facing some issue so I am sending it in body instead of this MAP.
        // emailAddress: travellerEmail,
      },
    }));

    const body = {
      data: {
        type: "flight-order",
        flightOffers: flight?.itineraries,
        travelers: transformedTravelers,
        emailAddress: travellerEmail,
      }
    };


    try {
      dispatch(setLoading(true));
      let res; // Declare res here to be available for both branches
      let pnr

      if (tripType === "Multi City" && flight.api === "sabre") {
        const sabreRes = await sabreMultiCitybookAndIssue(body);
        res = sabreRes;  // Assign sabreRes to res so you can log it later
      } else if (flight.api === "sabre") {
        const sabreRes = await bookAndIssue('sabre', body);
        res = sabreRes;  // Assign sabreRes to res so you can log it later
        pnr = sabreRes?.result?.CreatePassengerNameRecordRS?.ItineraryRef?.ID
      } else {
        res = await bookAndIssue('flights', body); // Assign response to res
        pnr = res?.result?.data?.id || res?.result?.id
      }

      await addPSF({ pnr, psfValue, type: markupPreference })

      // if (flight.api === "sabre") {
      const resData = await viewItinary(pnr, (flight?.api === "amadeus" || flight?.api === "amadus") ? "flights" : 'sabre')
      const agencyLogoUrl = `${NEXT_PUBLIC_PROD_IMAGE_URL}${flight?.agencyId?.logo}`;
      console.log(resData)
      await generatePDFTicket(flight, agencyLogoUrl, null, resData?.result, printOption === "without", flight?.api === "amadeus" || flight?.api === "amadus");
      // }


      console.log("Response from submitBookingRequest:", res);
      dispatch(setLoading(false));
      dispatch(setDashboardOption('Flight Booking'));
      enqueueSnackbar("Ticket Issued successfully", { variant: "success" });
      setOpenModal(false);
      resetFilters()
      setFlightTickets([])
      setTripType("One Way")
      setAdultsCount(1)
      setChildrenCount(0)
      setInfantsCount(0)
      setDepartureCity(null)
      setArrivalCity(null)
      setDepartureDate(null)
      setReturnDate(null)
      setMulticityFlights([{ departureCity: null, arrivalCity: null, departureDate: null }])
      setOpenCreditModal({ value: true, pnr: pnr })

    } catch (error) {
      dispatch(setLoading(false));
      enqueueSnackbar(`Something went wrong ${error}`, { variant: "error" });
    } finally {
      dispatch(setLoading(false));
    }

  }

  const handleHoldTicket = async () => {
    const transformedTravelers = travelers.map((traveler, index) => ({
      id: (index + 1).toString(),
      dateOfBirth: traveler.dob ? traveler.dob.toISOString().split("T")[0] : null,
      gender: traveler.gender ? traveler.gender.toUpperCase() : null,
      travelerType: traveler?.type === "Adult" ? "ADULT" : traveler?.type === "Child" ? "CHILD" : "INFANT",
      name: {
        firstName: getFullName(traveler, flight.api),
        lastName: traveler.lastName || "",
      },
      documents: [
        {
          number: traveler.documentNo || "",
          expiryDate: traveler.passportExpiryDate
            ? traveler.passportExpiryDate.toISOString().split("T")[0]
            : null,
          issuanceCountry: traveler.passportIssuanceCountry,
          validityCountry: traveler.passportIssuanceCountry,
          nationality: traveler.nationality,
          documentType: getDocmentTypeByApiType(flight.api, traveler?.documentType),
          holder: true,
        },
      ],
      contact: {
        purpose: "STANDARD",
        phones: [
          {
            deviceType: "MOBILE",
            countryCallingCode: countryCode ? countryCode : "",
            number: updatePhoneNumberByApiType(flight.api),
          },
        ],
        // Commenting this becuase in INFANT , backend is facing some issue so I am sending it in body instead of this MAP.
        // emailAddress: travellerEmail,
      },
    }));

    const body = {
      data: {
        type: "flight-order",
        flightOffers: flight?.itineraries,
        travelers: transformedTravelers,
        emailAddress: travellerEmail,
      }
    };


    try {
      dispatch(setLoading(true));
      let res; // Declare res here to be available for both branches
      let pnr;

      if (tripType === "Multi City" && flight.api === "sabre") {
        const sabreRes = await submitSabreBookingMRequest(body);
        res = sabreRes;  // Assign sabreRes to res so you can log it later
      } else if (flight.api === "sabre") {
        const sabreRes = await submitSabreBookingRequest(body);
        res = sabreRes;  // Assign sabreRes to res so you can log it later
        pnr = sabreRes?.result?.CreatePassengerNameRecordRS?.ItineraryRef?.ID
      } else {
        res = await submitBookingRequest(body); // Assign response to res
        pnr = res?.result?.data?.id
      }

      await addPSF({ pnr, psfValue, type: markupPreference })

      console.log("Response from submitBookingRequest:", res);
      dispatch(setLoading(false));
      dispatch(setDashboardOption('Flight Booking'));
      enqueueSnackbar("Booking submitted successfully", { variant: "success" });
      setOpenModal(false);
      resetFilters()
      setFlightTickets([])
      setTripType("One Way")
      setAdultsCount(1)
      setChildrenCount(0)
      setInfantsCount(0)
      setDepartureCity(null)
      setArrivalCity(null)
      setDepartureDate(null)
      setReturnDate(null)
      setMulticityFlights([{ departureCity: null, arrivalCity: null, departureDate: null }])

      navigate("/");
    } catch (error) {
      dispatch(setLoading(false));
      enqueueSnackbar(`Something went wrong ${error}`, { variant: "error" });
    } finally {
      dispatch(setLoading(false));
    }

  };

  const openModalIssue = () => {
    // if (!validateForm()) {
    //   return;
    // }
    setOpenReviewConfirmationModal(false)

    setOpenModal(true)
  }

  const openReviewConfirmationModalIssue = () => {
    // if (!validateForm()) {
    //   return;
    // }

    setOpenBaseFareModal(false)
    setOpenReviewConfirmationModal(true)
  }

  const openBaseFareModalIssue = () => {
    if (!validateForm()) {
      return;
    }

    setPsfValue('')
    setPrintOption('')

    setOpenBaseFareModal(true)
  }



  console.log(flight)

  useEffect(() => {
    setCountries(Country.getAllCountries());
    setCountryCodes(Country.getAllCountries()?.map(item => item?.phonecode))
    if (flight) {
      const totalTravelers =
        flight?.extra?.adult?.count + flight?.extra?.child?.count + flight?.extra?.infants?.count;
      const travelerArray = totalTravelers ? Array(totalTravelers)
        .fill()
        .map((_, index) => ({
          type:
            index < flight?.extra?.adult?.count
              ? "Adult"
              : index < flight?.extra?.adult?.count + flight?.extra?.child?.count
                ? "Child"
                : "Infant",
          fullName: "",
          lastName: "",
          gender: "",
          passportNumber: "",
          dob: null,
          title: "",
          nationality: "",
          documentType: "",
          documentNo: "",
          passportExpiryDate: "",
          passportIssuanceCountry: "",
          gender: ""
        })) : []
      // title D
      // First name D
      // last name D
      // dob D
      // nationality D
      // documentType D
      // documentNo D
      // passportExpiryDate D
      // passportIssuanceCountry D

      setTravelers(
        travelerArray
      );

      setTravellerArray(totalTravelers ? Array(totalTravelers).fill().map((_, index) => (
        index < flight?.extra?.adult?.count
          ? `Adult ${index + 1}`
          : index < flight?.extra?.adult?.count + flight?.extra?.child?.count
            ? `Child ${index + 1}`
            : `Infant ${index + 1}`)) : [])
    }
  }, [flight]);

  useEffect(() => {
    // If you want to control scroll behavior, you can use this to manually scroll to a desired position.
    window.scrollTo(0, 0); // This will scroll to the top on page load
  }, []);

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: "4rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box style={{ width: "8.5%", textAlign: "center" }}>
          <ArrowBackIosNewIcon
            style={{ fontSize: "2.5rem", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Box>
        <Box style={{ width: "70%" }}>
          <img src={AlasamLogo} style={{ width: '10%', marginTop: "3%" }} />
        </Box>
        <Box style={{ width: "12.5%" }}>
          <Button variant="text" sx={{ mx: "0.5rem" }}>
            Support
          </Button>
          <AppButton text="My Bookings" borderColor="#185ea5"
          />
        </Box>
      </Box>

      <Box sx={{ px: 20, mt: 6, mb: 3 }}>
        <Typography level="h4">Review Ticket:</Typography>
        <FlightTicketCard flight={flight} brandedFare={brandedFare} isReviewTicket={true} />
      </Box>

      <Box ref={travelerRef} sx={{ px: 20, mb: 5 }}>
        <Typography level="h3">Traveler Information</Typography>
        <Typography level="title-lg" sx={{ mb: 4 }}> <span style={{ fontWeight: 'bolder' }}>Note:</span> Use all given names and surnames exactly as they appear on your passport/ID to avoid complications.</Typography>

        {travellerArray.map((item, index) => renderTravelerForm(travelers[index], index))}

        <Box>
          <Typography level="h4" sx={{ mb: 1 }}>Contact Form</Typography>
          <RenderTravelerContactForm {...{ travelerFormFields, travellerPhone, setTravellerPhone, travellerEmail, setTravellerEmail, setCountryCode }} />

        </Box>
        <AppButton onClick={() => openBaseFareModalIssue()} sx={{ mt: 2 }} text="Submit Booking" />
      </Box>
      <Box style={{ width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box style={{ width: "80%", height: "auto" }}>
          <BookingFooter />
        </Box>
      </Box>
      <AddBaseFare open={openBaseFareModal} setOpen={setOpenBaseFareModal} openReviewConfirmationModalIssue={openReviewConfirmationModalIssue}   {...{ psfValue, setPsfValue, printOption, setPrintOption }} />
      {
        openReviewConfirmationModal && (
          <ReviewConfirmationModal open={openReviewConfirmationModal} setOpen={setOpenReviewConfirmationModal} handleOpen={openModalIssue} flight={flight} brandedFare={brandedFare} travelers={travelers} openModalIssue={openModalIssue} psfValue={psfValue} />
        )
      }
      <IssueTicketModal open={openModal} setOpen={setOpenModal} handleIssueTicket={handleIssueTicket} handleHoldTicket={handleHoldTicket} />
      {openCreditModal?.value && (
        <CreditModal open={openCreditModal?.value} setOpen={setOpenCreditModal} pnr={openCreditModal?.pnr} />
      )}
    </Box>
  );
};

export default Booking;
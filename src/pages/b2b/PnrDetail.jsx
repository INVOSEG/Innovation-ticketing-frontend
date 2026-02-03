import { Box, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/joy'
import React, { useState, useEffect } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { Country, City } from "country-state-city";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import AppDatePicker from "../../components/common/AppDatePicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import AppButton from '../../components/common/AppButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, getTitle, removeSeconds, removeTitles } from '../../utils/HelperFunctions';
import { useSnackbar } from 'notistack';
import FareRules from '../../components/modals/FareRules';
import ReConfirmationDrawer from '../../components/Drawers/ReConfirmationDrawer';
import B2bHeader from '../../components/utils/b2bHeader';

const flightData = [
    {
        "itemId": "3",
        "confirmationId": "UJQP32",
        "sourceType": "ATPCO",
        "flightNumber": 629,
        "airlineCode": "QR",
        "airlineName": "QATAR AIRWAYS",
        "operatingFlightNumber": 629,
        "operatingAirlineCode": "QR",
        "operatingAirlineName": "QATAR AIRWAYS",
        "fromAirportCode": "LHE",
        "toAirportCode": "DOH",
        "departureDate": "2025-01-13",
        "departureTime": "08:50:00",
        "departureTerminalName": "ALLAMA IQBAL TERMINAL",
        "departureGate": "M",
        "arrivalDate": "2025-01-13",
        "arrivalTime": "10:55:00",
        "numberOfSeats": 1,
        "cabinTypeName": "ECONOMY",
        "cabinTypeCode": "Y",
        "aircraftTypeCode": "788",
        "aircraftTypeName": "BOEING 787-8",
        "bookingClass": "K",
        "meals": [
            {
                "code": "M",
                "description": "Meal"
            }
        ],
        "flightStatusCode": "HK",
        "flightStatusName": "Confirmed",
        "durationInMinutes": 245,
        "distanceInMiles": 1453,
        "travelerIndices": [
            1
        ]
    },
    {
        "itemId": "4",
        "confirmationId": "UJQP32",
        "sourceType": "ATPCO",
        "flightNumber": 1,
        "airlineCode": "QR",
        "airlineName": "QATAR AIRWAYS",
        "operatingFlightNumber": 1,
        "operatingAirlineCode": "QR",
        "operatingAirlineName": "QATAR AIRWAYS",
        "fromAirportCode": "DOH",
        "toAirportCode": "LHR",
        "departureDate": "2025-01-13",
        "departureTime": "12:50:00",
        "arrivalDate": "2025-01-13",
        "arrivalTime": "17:25:00",
        "arrivalTerminalName": "TERMINAL 4",
        "arrivalGate": "4",
        "numberOfSeats": 1,
        "cabinTypeName": "ECONOMY",
        "cabinTypeCode": "Y",
        "aircraftTypeCode": "77W",
        "aircraftTypeName": "BOEING 777-300ER",
        "bookingClass": "K",
        "meals": [
            {
                "code": "M",
                "description": "Meal"
            }
        ],
        "flightStatusCode": "HK",
        "flightStatusName": "Confirmed",
        "durationInMinutes": 455,
        "distanceInMiles": 3259,
        "travelerIndices": [
            1
        ]
    }
]

const travelerDummyData = [
    {
        "givenName": "ALIMR",
        "surname": "DANIYAL",
        "type": "ADULT",
        "passengerCode": "ADT",
        "nameAssociationId": "1"
    }
]

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

const Navbar = () => {
    const [showPrice, setShowPrice] = useState(true)
    const [showAgent, setShowAgent] = useState(true)

    const handleBalance = () => {
        setShowPrice(!showPrice)
    }
    const handleAgent = () => {
        setShowAgent(!showAgent)
    }
    return (
        <Box sx={{ width: "95%", height: "75%", display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ height: "100%", width: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img
                    src="https://s3-alpha-sig.figma.com/img/8e08/41b7/28de904fcb9d0bd474cc7c0b3938b0ec?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g9OQRFqTSjDV6G7YPjpwyyrkmTmfvpKay45qx3ASAKsacSeShQY9FKrH2EjiXAL4p5O0IvSXy3PTvs4Y7dFwOSP7PJ~X7FdZZw726Brke92rP7cCCCD0a~O~lPUvRjFLu~aeKIumy6ciq8BXfyKAhby4bYeJ0PdNdeqizRqC9AZa6HbrYA1oYY-kW6-VrB7X15xmHUtM9fWP-iAOb4lGOApRMQoiDINSvYArteF~KG4BjINSlxHppiw7WDrc8OjuA9RrhJq9Sb4-9~ElgIRQ7THFSws1bL4-dDVe-QW~qA0Bj7DF0aTV2rrMCvY~99UKkrnEQC5NZh4pxKdKodt2Qg__"
                    alt="Asam-logo"
                    width="300"
                    height="100"
                    loading="lazy"
                    style={{ cursor: "pointer" }}
                />
            </Box>
            <Box sx={{ width: { xs: "70%", lg: "40%" }, height: "100%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                <Box sx={{ width: "49%", height: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ height: "70%", width: "95%", display: "flex" }}>
                        <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>Main Balance</Typography>
                            {showPrice && (<Typography sx={{ fontSize: "26px", fontWeight: "700" }}>OMR 1046.67</Typography>)}
                        </Box>
                        <Box sx={{ width: "20%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box sx={{ width: "30px", height: "30px", backgroundColor: "pink", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "5px", cursor: "pointer" }} onClick={handleBalance}>
                                <svg width="20" height="20" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 9L0.736861 0.749999L10.2631 0.75L5.5 9Z" fill="white" />
                                </svg></Box>

                        </Box>

                    </Box>
                    <Box sx={{ height: "30%", width: "95%" }}>
                        {showPrice && (<Typography sx={{ fontSize: "14.5px", }}>Sales Representative: ABBAS PARKAR -99342104</Typography>)}
                    </Box>

                </Box>
                <Divider orientation="vertical" sx={{ height: "80%", marginRight: "15px" }} />

                <Box sx={{ width: "49%", height: "90%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ height: "70%", width: "95%", display: "flex" }}>
                        <Box sx={{ width: "80%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography sx={{ fontSize: "26px", fontWeight: "700" }}>INNOVATION TECH TRAVEL</Typography>
                            {showAgent && (<Typography sx={{ fontSize: "22px" }}>Agent Code: 00663</Typography>)}
                        </Box>
                        <Box sx={{ width: "20%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box onClick={handleAgent} sx={{ width: "30px", height: "30px", backgroundColor: "pink", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "5px", cursor: "pointer" }}>
                                <svg width="20" height="20" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 9L0.736861 0.749999L10.2631 0.75L5.5 9Z" fill="white" />
                                </svg></Box>

                        </Box>

                    </Box>
                    <Box sx={{ height: "30%", width: "95%" }}>
                        {showAgent && (<Typography sx={{ fontSize: "14.5px", fontWeight: "500" }}>Last Login: 20 NOV 2024 | 12 : 37 PM</Typography>)}
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}

const ReviewFlight = ({ handleBack, flight }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [countries, setCountries] = useState([]);
    const [countryCodes, setCountryCodes] = useState([])
    const [cities, setCities] = useState([]);
    const [travelers, setTravelers] = useState([]);
    const [countryCode, setCountryCode] = useState('');
    const [travellerArray, setTravellerArray] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openReconfitmation, setOpenReconfitmation] = useState(false);

    const validateForm = () => {
        let valid = true;

        console.log(travelers)

        travelers.forEach((traveler, index) => {
            if (!traveler.dob || !traveler.nationality || !traveler.dob || !traveler.documentNo || !traveler.documentType || !traveler.passportIssuanceCountry) {
                enqueueSnackbar(`Please fill all required fields for ${traveler?.type} ${index + 1}.`, { variant: "error" });
                valid = false;
            }

            if (!traveler.documentType === "National ID" && !cnicRegex.test(traveler.documentNo)) {
                enqueueSnackbar(`Please enter a valid CNIC (13 digits) for traveler Information.`, { variant: "error" });
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

    const toggleDrawer = (open) => async (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (!open) {
            setOpenReconfitmation(false);
            return;
        }

        if (!flight) {
            return;
        }

        // if (!validateForm()) {
        //     return;
        // }

        setOpenReconfitmation({ value: open, flight, travelers })
    };

    const handleInputChange = (index, field, value) => {
        const updatedTravelerData = [...travelers];
        updatedTravelerData[index] = { ...updatedTravelerData[index], [field]: value };
        setTravelers(updatedTravelerData);



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

    function checkTravelerFieldExists(flight, index, name) {
        const traveler = flight?.travelers?.[index];
        const document = traveler?.identityDocuments?.[0];

        if (!traveler) return false;

        const mapping = {
            title: traveler?.givenName,
            fullName: traveler?.givenName,
            lastName: traveler?.surname,
            passportNumber: document?.documentNumber,
            documentNo: document?.documentNumber,
            nationality: document?.residenceCountryCode,
            documentType: document?.documentType,
            passportExpiryDate: document?.expiryDate,
            passportIssuanceCountry: document?.issuingCountryCode,
            gender: document?.gender,
            dob: document?.birthDate,
            type: traveler?.type,
        };

        return mapping[name] ? true : false;
    }

    const renderTravelerForm = (traveler, index) => (
        <Box key={index} sx={{ m: 1, p: 2, border: "1px solid #ccc", borderRadius: '15px', bgcolor: '#fff', mb: 3 }}>
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
                                    disabled={checkTravelerFieldExists(flight, index, name)}
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
                                    defaultOption={traveler[name]}
                                    disabled={checkTravelerFieldExists(flight, index, name)}
                                />
                            )}
                        </Box>
                    )
                )}

            </Box>
        </Box>
    );

    const copyToClipboard = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                enqueueSnackbar("PNR copied successfully!", {
                    variant: "success",
                });
            })
            .catch((err) => {
                console.error('Failed to copy ', err);
                enqueueSnackbar("Failed to copy!", {
                    variant: "error",
                });
            });
    };

    const handleModal = (fareRules) => {
        if (fareRules) {
            setOpenModal({ value: true, fareRules })
        } else {
            enqueueSnackbar("Fare Rules not found!", {
                variant: "error",
            });
        }
    }

    useEffect(() => {
        setCountries(Country.getAllCountries());
        setCountryCodes(Country.getAllCountries()?.map(item => item?.phonecode))
        if (flight?.travelers) {
            const totalTravelers =
                parseInt(flight?.travelers?.length);
            const travelerArray = totalTravelers ? Array(totalTravelers)
                .fill()
                .map((_, index) => ({
                    type: flight?.travelers?.[index]?.type,
                    fullName: removeTitles(flight?.travelers?.[index]?.givenName),
                    lastName: flight?.travelers?.[index]?.surname,
                    passportNumber: flight?.travelers?.[index]?.identityDocuments?.[0]?.documentNumber ? flight?.travelers?.[index]?.identityDocuments?.[0]?.documentNumber : '',
                    dob: flight?.travelers?.[index]?.identityDocuments?.[0]?.birthDate ? new Date(flight?.travelers?.[index]?.identityDocuments?.[0]?.birthDate) : "",
                    title: getTitle(flight?.travelers?.[index]?.givenName),
                    nationality: flight?.travelers?.[index]?.identityDocuments?.[0]?.residenceCountryCode ? flight?.travelers?.[index]?.identityDocuments?.[0]?.residenceCountryCode : '',
                    documentType: flight?.travelers?.[index]?.identityDocuments?.[0]?.documentType ? capitalizeFirstLetter(flight?.travelers?.[index]?.identityDocuments?.[0]?.documentType) : '',
                    documentNo: flight?.travelers?.[index]?.identityDocuments?.[0]?.documentNumber ? flight?.travelers?.[index]?.identityDocuments?.[0]?.documentNumber : '',
                    passportExpiryDate: flight?.travelers?.[index]?.identityDocuments?.[0]?.expiryDate ? new Date(flight?.travelers?.[index]?.identityDocuments?.[0]?.expiryDate) : "",
                    passportIssuanceCountry: flight?.travelers?.[index]?.identityDocuments?.[0]?.issuingCountryCode ? flight?.travelers?.[index]?.identityDocuments?.[0]?.issuingCountryCode : '',
                    gender: flight?.travelers?.[index]?.identityDocuments?.[0]?.gender ? capitalizeFirstLetter(flight?.travelers?.[index]?.identityDocuments?.[0]?.gender) : '',
                })) : []

            setTravelers(
                travelerArray
            );

            setTravellerArray(totalTravelers ? Array(totalTravelers).fill().map((_, index) => (
                `${flight?.travelers?.[index]} ${index + 1}`)) : [])
        }
    }, [flight]);
    return (
        <Box sx={{ bgcolor: '#eaeaea', padding: '20px' }}>
            <Box sx={{
                display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 3, cursor: 'pointer'
            }} onClick={() => handleBack()}>
                <ArrowBackIcon sx={{
                    fontSize: '25px', color: 'blue', marginLeft: '10px'
                }} />
                <Typography level="h4" sx={{
                    marginLeft: '5px', color: 'blue'
                }}>Back</Typography>
            </Box>

            <Typography level="h3" sx={{ marginLeft: '15px' }}>Review your Flight</Typography>

            <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', bgcolor: '#fff', borderRadius: '15px', margin: '10px', padding: '10px', marginBottom: '30px' }}>
                <Box>
                    <Typography level="title-md">Onward</Typography>
                    <Typography level="title-md">{flight?.journeys?.[0]?.departureDate}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Typography level="h3" sx={{ marginRight: '10px' }}>{flight?.journeys?.[0]?.firstAirportCode}</Typography>
                    <ArrowForwardIcon sx={{ fontSize: '25px' }} />
                    <Typography level="h3" sx={{ marginLeft: '10px' }}>{flight?.journeys?.[0]?.lastAirportCode}</Typography>
                </Box>

                <Box>
                    <Typography level="body-lg">{flight?.journeys?.[0]?.numberOfFlights && flight?.journeys?.[0]?.numberOfFlights - 1 ? flight?.journeys?.[0]?.numberOfFlights - 1 : 'No'} Stop</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box>
                        <Typography level="title-md">CRS PNR</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography level="title-md">{flight?.bookingId}</Typography>
                            <ContentCopyIcon sx={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => copyToClipboard(flight?.bookingId)} />
                        </Box>
                    </Box>

                    <Box sx={{ marginLeft: '10px' }}>
                        <Typography level="title-md">Airline PNR</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography level="title-md">{flight?.flights?.[0]?.confirmationId}</Typography>
                            <ContentCopyIcon sx={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => copyToClipboard(flight?.flights?.[0]?.confirmationId)} />
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

            <Typography level="h3" sx={{ marginLeft: '15px' }}>Passanger Detail</Typography>

            {travellerArray.map((item, index) => renderTravelerForm(travelers[index], index))}

            {flight?.fares && (
                <Box
                    sx={{
                        bgcolor: "#fff",
                        padding: '10px',
                        marginBottom: '30px',
                        borderRadius: "15px",
                        m: "10px",
                        border: "1px solid #ddd",
                    }}
                >
                    <Typography level="h4" sx={{ mb: 2 }}>
                        Fare Breakdown
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography level="body-md">Subtotal:</Typography>
                        <Typography level="body-md">{flight?.payments?.flightTotals?.[0]?.currencyCode} {flight?.payments?.flightTotals?.[0]?.subtotal}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography level="body-md">Taxes:</Typography>
                        <Typography level="body-md">{flight?.payments?.flightTotals?.[0]?.currencyCode} {flight?.payments?.flightTotals?.[0]?.taxes}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                            borderTop: "1px solid #ddd",
                            pt: 1,
                            mt: 1,
                        }}
                    >
                        <Typography level="body-md">Total:</Typography>
                        <Typography level="body-md">{flight?.payments?.flightTotals?.[0]?.currencyCode} {flight?.payments?.flightTotals?.[0]?.total}</Typography>
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'end', margin: '10px' }}>
                <AppButton onClick={toggleDrawer(true)} sx={{ mt: 2 }} text="Confirm Payment" />
            </Box>

            {openModal?.value && (
                <FareRules {...{ setOpen: setOpenModal, open: openModal?.value, fareRule: openModal?.fareRules }} />
            )}

            {openReconfitmation?.value && (
                <ReConfirmationDrawer {...{ state: openReconfitmation?.value, setState: setOpenReconfitmation, toggleDrawer, flight: openReconfitmation?.flight, travelers: openReconfitmation?.travelers }} />
            )}


        </Box>
    )
}

const PnrDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const flight = location.state?.flight;

    console.log(flight, 'HI')

    const handleBack = () => {
        navigate(-1);
    }
    return (
        <>
            <B2bHeader showDiv={true} hidePromotion={false} isPnr={true} />
            <ReviewFlight {...{ handleBack, flight }} />
        </>
    )
}

export default PnrDetail
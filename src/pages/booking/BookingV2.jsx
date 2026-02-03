import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Alert from "@mui/joy/Alert";
import AspectRatio from "@mui/joy/AspectRatio";
import CircularProgress from "@mui/joy/CircularProgress";
import { Country, City } from "country-state-city";
import { useSnackbar } from "notistack";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import AppDatePicker from "../../components/common/AppDatePicker";
import TimerIcon from "@mui/icons-material/Timer";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AlasamLogo from "../../images/alasamLogo.png";
import AppButton from "../../components/common/AppButton";
import BookingFooter from "../../pages-components/BookingEngine/BookingFooter";
import {
  addPSF,
  bookAndIssue,
  getSabreFareRules,
  sabreMultiCitybookAndIssue,
  submitBookingRequest,
  submitSabreBookingMRequest,
  submitSabreBookingRequest,
  viewItinary,
} from "../../server/api";
import {
  cnicRegex,
  emailRegex,
  phoneNumberRegex,
} from "../../components/utils";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {
  calculateStops,
  calculateTotalFlightTime,
  extractTrips,
  extractTripsForMultiCity,
  getCabinText,
  getCheckinText,
  removeSeconds,
  toTimestamp,
} from "../../utils/HelperFunctions";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import FlightTicketCard from "../../pages-components/BookingEngine/FlightTicket";
import IssueTicketModal from "../../components/modals/IssueTicketModal";
import { setDashboardOption } from "../../redux/reducer/dashboardSlice";
import CreditModal from "../../components/modals/CreditModal";
import ReviewConfirmationModal from "../../components/modals/ReviewConfirmantionModal";
import AddBaseFare from "../../components/modals/AddBaseFare";
import { generatePDFTicket } from "../../components/utils/Ticket";
import { NEXT_PUBLIC_PROD_IMAGE_URL } from "../../env";
import { useTicketFilterValues } from "../../context/ticketFilterValues";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LuggageIcon from "@mui/icons-material/Luggage";
import InfoIcon from "@mui/icons-material/Info";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import { LinearProgress, Modal, Sheet, Stack } from "@mui/joy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import CircleIcon from "@mui/icons-material/Circle";
import SavingsIcon from "@mui/icons-material/Savings";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import DatePicker from "../../components/utils/DatePicker";
import moment from "moment";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { formatDuration } from "../../components/utils";
import FareRulesModal from "../../components/modals/FareRulesBooking";

const RenderTravelerContactForm = React.memo(
  ({
    travelerFormFields,
    travellerPhone,
    setTravellerPhone,
    travellerEmail,
    setTravellerEmail,
    setCountryCode,
  }) => {
    return (
      <Box sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: "md" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {travelerFormFields.map(
            (
              { component: Field, label, name, options, size, type },
              fieldIndex
            ) => (
              <Box
                key={fieldIndex}
                sx={{
                  flexBasis: "calc(33.333% - 16px)",
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                {Field === PhoneInput ? (
                  <PhoneInput
                    country={"pk"}
                    enableSearch={true}
                    value={travellerPhone}
                    onChange={(phone, country) =>
                      handlePhoneChange(phone, country)
                    }
                  />
                ) : Field === Typography ? (
                  <Typography level="h6" sx={{ marginTop: "20px" }}>
                    Traveller Contact Information
                  </Typography>
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
    );
  }
);

const FlightInfo = ({ flight, isReturn, logo, name, index, fareOffers }) => (
  <>
    <Grid container spacing={2}>
      <Grid
        xs={3}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRight: "1px solid #CDD7E1",
        }}
      >
        {isReturn || (index !== 0 && index) ? (
          <>
            {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
            {logo && (
              <img
                src={logo}
                width={70}
                height={70}
                alt={flight?.airlineName}
              />
            )}
            <Box sx={{ marginLeft: "10px" }}>
              <Typography level="body-sm">
                {flight?.airlineCode}-{flight?.flightNumber}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            {/* <AirplaneTicketIcon sx={{ fontSize: '60px' }} /> */}
            {logo && (
              <img
                src={logo}
                width={70}
                height={70}
                alt={flight?.airlineName}
              />
            )}
            <Box sx={{ marginLeft: "10px" }}>
              <Typography level="title-lg">{flight?.airlineName}</Typography>
              <Typography level="body-sm">
                {flight?.airlineCode}-{flight?.flightNumber}
              </Typography>
            </Box>
          </>
        )}
      </Grid>
      <Grid xs={7}>
        <Box
          sx={{
            position: "relative",
            height: 80,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <line
              x1="15%"
              y1="50%"
              x2="40%"
              y2="50%"
              stroke="#999"
              strokeWidth="2"
              strokeDasharray="4,4" // Makes the line dotted
            />
            <line
              x1="60%"
              y1="50%"
              x2="85%"
              y2="50%"
              stroke="#999"
              strokeWidth="2"
              strokeDasharray="4,4" // Makes the line dotted
            />
          </svg>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <Stack alignItems="center">
              <Typography level="h4">
                {removeSeconds(flight?.departureTime)}
              </Typography>
              <Typography level="body-xs">{flight?.fromAirportCode}</Typography>
              <Typography level="body-sm">{flight?.departureDate}</Typography>
            </Stack>
            <Stack alignItems="center">
              {isReturn ? (
                <>
                  <AirplanemodeActiveIcon
                    sx={{
                      transform: "rotate(270deg)",
                      fontSize: "20px",
                      color: "goldenrod",
                    }}
                  />
                  {/* <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography> */}
                </>
              ) : (
                <>
                  <AirplanemodeActiveIcon
                    sx={{
                      transform: "rotate(90deg)",
                      fontSize: "20px",
                      color: "goldenrod",
                    }}
                  />
                  {/* <Typography level="body-sm">{formatDuration(flight?.elapsedTime)}</Typography> */}
                </>
              )}
            </Stack>
            <Stack alignItems="center">
              <Typography
                level="h4"
                sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
              >
                {removeSeconds(flight?.arrivalTime)}
              </Typography>
              {/* <FlightLandIcon /> */}
              <Typography level="body-xs">{flight?.toAirportCode}</Typography>
              <Typography level="body-sm">{flight?.arrivalDate}</Typography>
            </Stack>
          </Stack>
        </Box>
      </Grid>
      <Grid
        xs={2}
        sx={{
          display: "flex",
          alignItems: "center",
          borderLeft: "1px solid #CDD7E1",
          borderBottom: "1px solid #CDD7E1",
        }}
      >
        <img
          src={`${require("../../images/baggage.jpg")}`}
          width={70}
          height={120}
          alt={flight?.airlineName}
        />
        <Box sx={{ marginLeft: "10px" }}>
          <Typography level="h4">Baggage Detail</Typography>
          <Typography level="body-md">
            <b>CHECK IN:</b>{" "}
            {fareOffers?.[0]?.checkedBaggageAllowance?.totalWeightInKilograms}{" "}
            KG
          </Typography>
          {(fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]
            ?.maximumWeightInKilograms ||
            fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]
              ?.maximumWeightInKilograms) && (
              <Typography level="body-md">
                <b>CABIN:</b>{" "}
                {fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]
                  ?.maximumWeightInKilograms
                  ? fareOffers?.[0]?.cabinBaggageAllowance?.baggagePieces?.[0]
                    ?.maximumWeightInKilograms
                  : fareOffers?.[0]?.cabinBaggageAllowance?.totalWeightInKilograms
                    ? fareOffers?.[0]?.cabinBaggageAllowance?.totalWeightInKilograms
                    : "N/A"}{" "}
                KG
              </Typography>
            )}
        </Box>
      </Grid>
    </Grid>
  </>
);

const ContactInfo = ({
  handlePhoneChange,
  travellerPhone,
  travellerEmail,
  setTravellerEmail,
}) => {
  return (
    <>
      <Typography
        level="h4"
        component="h1"
        sx={{ mb: 2, mt: 2, fontWeight: "bold", textTransform: "uppercase" }}
      >
        Contact Details
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid xs={12} sm={3}>
              <FormControl sx={{ width: "100%" }}>
                <div
                  style={{ width: "100%", position: "relative", zIndex: 1000 }}
                >
                  <PhoneInput
                    country={"pk"}
                    enableSearch={true}
                    value={travellerPhone}
                    onChange={(phone, country) =>
                      handlePhoneChange(phone, country)
                    }
                    inputStyle={{
                      width: "100%",
                      height: "40px",
                      fontSize: "16px",
                      borderRadius: "4px",
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                    buttonStyle={{
                      borderTopLeftRadius: "4px",
                      borderBottomLeftRadius: "4px",
                    }}
                  />
                </div>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={3}>
              <FormControl sx={{ width: "100%" }}>
                <Input
                  placeholder="Email ID*"
                  sx={{
                    height: "40px",
                    width: "100%",
                  }}
                  value={travellerEmail}
                  onChange={(e) => setTravellerEmail(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Alert
            variant="soft"
            startDecorator={<WarningIcon />}
            sx={{
              bgcolor: "#F7EBF5",
              // "& .MuiAlert-startDecorator": {
              //     color: "rgb(255, 111, 0)",
              // },
            }}
          >
            These details will be passed to the Airline for booking
          </Alert>
        </CardContent>
      </Card>
    </>
  );
};

const ShareConfirm = () => {
  return (
    <>
      <Typography
        level="h4"
        component="h1"
        sx={{ mb: 2, mt: 2, fontWeight: "bold", textTransform: "uppercase" }}
      >
        Share & Confirm
      </Typography>

      <Card variant="outlined" sx={{ zIndex: 0 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AirplaneTicketIcon sx={{ fontSize: "40px" }} />
              <Typography level="body-md">
                Share the entered details to customer so that they can verify
                and confirm. Please click the share option.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="success"
                startDecorator={<WhatsAppIcon />}
                sx={{ borderRadius: "md" }}
              >
                Whatsapp
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startDecorator={<EmailIcon />}
                sx={{ borderRadius: "md" }}
              >
                EMail
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

const PaymentRules = () => {
  return (
    <>
      <Card variant="outlined">
        <Typography
          level="h4"
          component="h1"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Payment Rules & Restrictions
        </Typography>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircleIcon sx={{ color: "warning.500", fontSize: 8 }} />
              <Typography level="body-md">
                Kindly check the spelling & reconfirm the passenger name(s)
                before you book.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircleIcon sx={{ color: "warning.500", fontSize: 8 }} />
              <Typography level="body-md">
                Ticket name changes are not permitted once issued
              </Typography>
            </Box>

            <Typography level="body-md" sx={{ mt: 2 }}>
              The above mentioned purchases are subject to cancellation, date
              change fees and once purchased tickets are non-transferable and
              name changes are not permitted. For further details, read the
              overview of all the{" "}
              {/* Removed href="#" from Link and update Typography with Link */}
              <Typography component="a" fontWeight="lg">
                Restriction, Penalties & Cancellation Charges.
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

const PaymentOptions = () => {
  return (
    <>
      <Typography
        level="h4"
        component="h1"
        sx={{ mb: 2, fontWeight: "bold", textTransform: "uppercase" }}
      >
        Payment Options
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox defaultChecked size="lg" />
              <Typography level="body-lg" fontWeight="md">
                Use Deposit Account
              </Typography>
            </Box>

            <SavingsIcon sx={{ fontSize: "40px" }} />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

const PaymentFooter = ({ onClick, flight }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: 3,
        p: 2,
        bgcolor: "background.level1",
        borderRadius: "md",
      }}
    >
      <Box>
        <Typography level="body-sm">By click on Make Payment,</Typography>
        <Typography level="body-sm">
          I agree with the booking policies,{" "}
          {/* Removed href="#" in Typography */}
          <Typography component="a" level="body-sm" fontWeight="lg">
            Privacy policy & Terms
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ textAlign: "right" }}>
          <Typography level="body-xs" color="neutral">
            RS
          </Typography>
          <Typography level="h3" fontWeight="bold">
            {flight?.passengerTotalFare}
          </Typography>
        </Box>

        <Button
          size="lg"
          color="success"
          sx={{
            px: 4,
            bgcolor: "#8BC34A",
            "&:hover": { bgcolor: "#7CB342" },
          }}
          onClick={onClick}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

const PayNowSection = ({ onClick, flight }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        level="h4"
        component="h1"
        sx={{ mb: 2, fontWeight: "bold", textTransform: "uppercase" }}
      >
        Pay Now
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <PaymentRules />
        {/* <PaymentOptions /> */}
        <PaymentFooter onClick={onClick} flight={flight} />
      </Box>
    </Box>
  );
};

// const DurationTooltip = ({ data, apiName }) => {
//     return (
//         <Box
//             sx={{
//                 width: "500px",
//                 height: "auto",
//                 backgroundColor: "#eaf3ff",
//                 position: "absolute",
//                 top: 60,
//                 right: 0,
//                 borderRadius: "10px",
//                 zIndex: 999,
//                 display: "flex",
//                 boxShadow: "0px 0px 6px 0px rgb(0,0,0,6)",
//                 flexDirection: "column",
//                 p: 2,
//             }}
//         >
//             {data?.map((item, index) => (
//                 <>
//                     {/* index > 0 */}
//                     {apiName === "sabre" && item?.layoverTime && (
//                         <Divider
//                             sx={{
//                                 width: "100%",
//                                 // display: 'block',
//                                 "--Divider-lineColor": "lightgrey",
//                                 "--Divider-thickness": "1.5px",
//                                 fontWeight: "bold",
//                                 textTransform: "uppercase",
//                             }}
//                         >
//                             Connecting Time : {item?.layoverTime}
//                         </Divider>
//                     )}
//                     <Box
//                         sx={{
//                             width: "100%",
//                             height: "45%",
//                             display: "flex",
//                             justifyContent: "space-around",
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 width: "35%",
//                                 height: "100%",
//                                 display: "flex",
//                                 gap: "10px",
//                                 alignItems: "center",
//                             }}
//                         >
//                             <Typography>
//                                 {item?.marketingCarrier || item?.operating || item?.marketing}-
//                                 {item?.marketingFlightNumber}
//                             </Typography>
//                             <Typography>
//                                 {item?.departureLocation} (
//                                 {moment(item?.departureTime).format("HH:mm")})
//                             </Typography>
//                         </Box>
//                         <Box
//                             sx={{
//                                 width: "20%",
//                                 height: "100%",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 flexDirection: "column",
//                             }}
//                         >
//                             <QueryBuilderIcon />
//                             <Typography sx={{ color: "grey" }}>
//                                 {formatDuration(item?.elapsedTime)}
//                             </Typography>
//                         </Box>
//                         <Box
//                             sx={{
//                                 width: "35%",
//                                 height: "100%",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 gap: "10px",
//                             }}
//                         >
//                             <Typography>
//                                 {item?.marketingCarrier || item?.operating || item?.marketing}-
//                                 {item?.marketingFlightNumber}
//                             </Typography>
//                             <Typography>
//                                 {item?.arrivalLocation} (
//                                 {moment(item?.arrivalTime).format("HH:mm")})
//                             </Typography>
//                         </Box>
//                     </Box>

//                     {(apiName === "amadus" || apiName === "amadeus") &&
//                         item?.layoverTime && (
//                             <Divider
//                                 sx={{
//                                     width: "100%",
//                                     // display: 'block',
//                                     "--Divider-lineColor": "lightgrey",
//                                     "--Divider-thickness": "1.5px",
//                                     fontWeight: "bold",
//                                     textTransform: "uppercase",
//                                 }}
//                             >
//                                 Connecting Time : {item?.layoverTime}
//                             </Divider>
//                         )}
//                 </>
//             ))}
//         </Box>
//     );
// };

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
                  {item?.marketingCarrier ||
                    item?.departure?.marketing ||
                    item?.operating ||
                    item?.marketing}
                  -
                  {item?.marketingFlightNumber ||
                    item?.departure?.marketingFlightNumber}
                </Typography>
                <Typography sx={{ fontSize: '12px' }}>
                  {isMultiCity ?
                    item?.logo?.code ===
                      item?.operatingLogo?.code
                      ? ""
                      : "Operated By " +
                      item?.operatingLogo?.code
                    : item?.marketing ===
                      item?.operatingLogo?.arCode
                      ? ""
                      : "Operated By: " +
                      item?.operatingLogo?.ar}
                </Typography>
              </Box>
              <Typography>
                {item?.departure?.airport
                  ? item?.departure?.airport
                  : item?.departure?.departure?.airport
                    ? item?.departure?.departure?.airport
                    : item?.departureLocation}{" "}
                (
                {item?.departure?.time
                  ? moment(
                    `${item?.departure?.date}T${item?.departure?.time}`
                  ).format("HH:mm")
                  : item?.departure?.departure?.time
                    ? moment(
                      `${item?.departure?.departure?.date}T${item?.departure?.departure?.time}`
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
                {formatDuration(
                  item?.departure?.elapsedTime
                    ? item?.departure?.elapsedTime
                    : item?.elapsedTime
                )}
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
                {item?.marketingCarrier ||
                  item?.departure?.marketing ||
                  item?.operating ||
                  item?.marketing}
                -
                {item?.marketingFlightNumber ||
                  item?.departure?.marketingFlightNumber}
              </Typography>
              <Typography>
                {item?.arrival?.airport
                  ? item?.arrival?.airport
                  : item?.departure?.arrival?.airport
                    ? item?.departure?.arrival?.airport
                    : item?.arrivalLocation}{" "}
                (
                {item?.arrival?.time
                  ? moment(
                    `${item?.arrival?.date}T${item?.arrival?.time}`
                  ).format("HH:mm")
                  : item?.departure?.arrival?.time
                    ? moment(
                      `${item?.departure?.arrival?.date}T${item?.departure?.arrival?.time}`
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

const BookingV2 = () => {
  const location = useLocation();
  const travelerRef = useRef(null);
  const {
    resetFilters,
    setAdultsCount,
    setArrivalCity,
    setChildrenCount,
    setDepartureCity,
    setDepartureDate,
    setFlightTickets,
    setInfantsCount,
    setMulticityFlights,
    setReturnDate,
    setTripType,
    markupPreference,
  } = useTicketFilterValues();
  const flight = useMemo(() => location.state?.flight, [location.state]);
  const tripType = location.state?.tripType;
  const brandedFare = location.state?.brandedFare;
  const brandedFareDetail = location.state?.brandedFareDetail;
  const selectedBrandedFare = location.state?.selectedBrandedFare;
  const multicityFlights = location.state?.multicityFlights;
  const extractedFlightsForMultiCity =
    location.state?.extractedFlightsForMultiCity;
  const responseBrandedFare = location?.state?.responseBrandedFare;
  const flightData = location?.state?.flightData
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [cities, setCities] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [travellerPhone, setTravellerPhone] = useState("");
  const [travellerEmail, setTravellerEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [travellerArray, setTravellerArray] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [timerModal, setTimerModal] = useState(false);
  const [expiredTimerModal, setExpiredTimerModal] = useState(false);
  const [hoveredDuration, setHoveredDuration] = useState({
    flightIndex: null,
    departureIndex: null,
  });

  const handleTimerModalOpen = () => setTimerModal(true);
  const handleTimerModalClose = () => setTimerModal(false);

  const handleExpiredTimerModalOpen = () => setExpiredTimerModal(true);
  const handleExpiredTimerModalClose = () => setExpiredTimerModal(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 375,
    height: 200,
    bgcolor: "white",
    boxShadow: 12,
    border: "none",
    p: 4,
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 0.75,
  };

  const [openCreditModal, setOpenCreditModal] = useState({
    value: false,
    pnr: null,
  });
  const [openReviewConfirmationModal, setOpenReviewConfirmationModal] =
    useState(false);
  const [openBaseFareModal, setOpenBaseFareModal] = useState(false);
  const [psfValue, setPsfValue] = useState("");
  const [printOption, setPrintOption] = useState("with");
  const [expanded, setExpanded] = React.useState(true);
  const [timeLeft, setTimeLeft] = React.useState({ minutes: 19, seconds: 55 });
  const [hideItineraryCard, setHideItineraryCard] = useState(false);
  const [passenger, setPassenger] = useState({
    title: "mr",
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    saveDetails: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading1, setLoading1] = useState(false); // Loading state
  const [fareRules, setFareRules] = useState(null); // To store API response

  console.log("tripType", tripType);

  function transformFlightData(
    input,
    selectedBrandedFare,
    tripType,
    bookingCode,
    brandInfo
  ) {
    if (!input || !input.departure) return [];
    console.log("selectedBrandedFare", brandInfo);
    const bookingDate = new Date().toISOString().split("T")[0]; // current date
    // const brandIndex = index < brandInfo.length ? index : brandInfo.length - 1; // use last index if segments > brandInfo count

    return (
      tripType === "One Way"
        ? [...input.departure]
        : tripType === "Round Trip"
          ? [...input.departure, ...input.return]
          : [input.departure]
    ).map((segment, index) => ({
      FlightNumber: segment.marketingFlightNumber.toString(),
      DepartureAirport: segment.departureLocation,
      ArrivalAirport: segment.arrivalLocation,
      MarketingAirline: segment.marketingCarrier || segment.marketing,
      DepartureDate: segment.departureTime,
      ArrivalDate: segment.arrivalTime,
      BookingDate: bookingDate,
      ResBookDesigCode: bookingCode?.[index] || "N/A",
      ValidatingCarrier: segment.operating || segment.marketingCarrier,
      farebase: [
        {
          FareBasisCode: brandInfo[index < brandInfo.length ? index : brandInfo.length - 1] || "N/A",
          PassengerType:
            input.brandedFare?.[0]?.data?.[0]?.passengerType || "ADT",
        },
      ],
    }));
  }

  console.log("flightData", flightData)

  const handleOpenModal = async () => {
    // const body = {
    //   adult: flight?.extra?.adult?.count || 0,
    //   child: flight?.extra?.child?.count || 0,
    //   infant: flight?.extra?.infant?.count || 0,
    //   flightDetails: transformFlightData(
    //     flight,
    //     selectedBrandedFare,
    //     tripType,
    //     flight.itineraries[0]?.bookingCode,
    //     flight.brandedFare[0]?.brandInfo
    //   ),
    //   ValidatingCarrier:
    //     flight?.departure?.[0]?.operating ||
    //     flight?.departure?.[0]?.marketingCarrier,
    // };

    try {
      setLoading1(true); // Start loading
      const res = await getSabreFareRules({ ...flightData }); // Await API
      if (
        res?.result?.rawResponse?.["soap-env:Envelope"]?.["soap-env:Body"]
          ?.StructureFareRulesRS?.Errors
      ) {
        enqueueSnackbar(`Fare rules not found for this booking.`, {
          variant: "info",
        });
        return;
      }
      setFareRules(
        res?.result?.rawResponse?.["soap-env:Envelope"]?.["soap-env:Body"]
          ?.StructureFareRulesRS
      ); // Store response in state
      setModalOpen(true); // Open modal
    } catch (err) {
      console.error("Fare rules error", err);
    } finally {
      setLoading1(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePassengerChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setPassenger((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (phone, country) => {
    setTravellerPhone(phone);
    setCountryCode(country?.dialCode); // Set the country code
  };

  const getFullName = (traveler, apiType) => {
    if (apiType === "amadus" || apiType === "amadeus") {
      return traveler.fullName;
    } else {
      return traveler.fullName + " " + traveler.title;
    }
  };

  const updatePhoneNumberByApiType = (apiType) => {
    if (apiType === "amadus" || apiType === "amadeus") {
      return travellerPhone.slice(countryCode.length);
    } else {
      return travellerPhone;
    }
  };

  const getDocmentTypeByApiType = (apiType, traveler) => {
    if (apiType === "amadus" || apiType === "amadeus") {
      if (traveler === "Passport") {
        return "PASSPORT";
      } else if (traveler === "National ID") {
        return "IDENTITY_CARD";
      }
    } else if (apiType === "sabre") {
      if (traveler === "Passport") {
        return "P";
      } else if (traveler === "National ID") {
        return "I";
      }
    }
  };

  const validateForm = () => {
    let valid = true;

    travelers.forEach((traveler, index) => {
      if (
        !traveler.fullName ||
        !traveler.lastName ||
        !traveler.dob ||
        !traveler.title ||
        !traveler.nationality ||
        !traveler.dob ||
        !traveler.documentNo ||
        !traveler.documentType ||
        !traveler.passportIssuanceCountry
      ) {
        enqueueSnackbar(
          `Please fill all required fields for ${traveler?.type} ${index + 1}.`,
          { variant: "error" }
        );
        valid = false;
      }

      // if (!emailRegex.test(travellerEmail)) {
      //   enqueueSnackbar(`Please provide a valid email address for traveler.`, { variant: "error" });
      //   valid = false;
      // }

      if (
        !traveler.documentType === "National ID" &&
        !cnicRegex.test(traveler.documentNo)
      ) {
        enqueueSnackbar(
          `Please enter a valid CNIC (13 digits) for traveler Information.`,
          { variant: "error" }
        );
        valid = false;
      }

      if (!travellerPhone) {
        enqueueSnackbar(`Please enter a phone number traveler Information.`, {
          variant: "error",
        });
        valid = false;
      }

      // if (!phoneNumberRegex.test(traveler.phoneNumber)) {
      //   enqueueSnackbar(`Please enter a valid phone number (11 digits) for traveler ${index + 1}.`, { variant: "error" });
      //   valid = false;
      // }

      if (new Date(traveler.dob).toDateString() === new Date().toDateString()) {
        enqueueSnackbar(
          `Please provide a valid date of birth for traveler ${index + 1}.`,
          { variant: "error" }
        );
        valid = false;
      }

      if (new Date(traveler.passportExpiryDate) < new Date()) {
        enqueueSnackbar(
          `Passport expiry date cannot be in the past for traveler ${index + 1
          }.`,
          { variant: "error" }
        );
        valid = false;
      }
    });

    return valid;
  };

  const travelerFormFields = [
    // { component: FormSelect, label: "Country Phone Code *", name: "countryPhoneCode", options: countryCodes },
    // { component: InputField, label: "Phone *", name: "phoneNumber", type: "number" },
    { component: Typography },
    { component: InputField, label: "Email *", name: "email", type: "email" },
    { component: PhoneInput },
  ];

  const handleInputChange = (index, field, value) => {
    const updatedTravelerData = [...travelers];
    updatedTravelerData[index] = {
      ...updatedTravelerData[index],
      [field]: value,
    };
    setTravelers(updatedTravelerData);

    if (field === "country") {
      const selectedCountry = countries.find((c) => c.name === value);
      if (selectedCountry) {
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
    {
      component: FormSelect,
      label: "Title *",
      name: "title",
      options: ["Mr", "Mrs", "Miss"],
    },
    { component: InputField, label: "First Name *", name: "fullName" },
    { component: InputField, label: "Last Name *", name: "lastName" },
    {
      component: FormSelect,
      label: "Gender *",
      name: "gender",
      options: ["Male", "Female"],
    },
    {
      component: AppDatePicker,
      name: "dob",
      size: "sm",
      label: "Date of Birth *",
      placeholder: "MM/DD/YYYY",
    },
    {
      component: FormSelect,
      label: "Nationality *",
      name: "nationality",
      options: Country.getAllCountries()
        .map((c) => ({
          id: c.isoCode,
          name: c.name,
        }))
        .sort((a, b) => {
          if (a.name === "Pakistan") return -1; // Pakistan first
          if (b.name === "Pakistan") return 1;
          return a.name.localeCompare(b.name); // alphabetical for others
        }),
      searchable: true,
    },
    {
      component: FormSelect,
      label: "Document Type *",
      name: "documentType",
      options: ["Passport", "National ID"],
    },
    { component: InputField, label: "Document No *", name: "documentNo" },
    {
      component: AppDatePicker,
      name: "passportExpiryDate",
      size: "sm",
      label: "Expiry Date",
    },
    {
      component: FormSelect,
      label: "Passport Issuance Country *",
      name: "passportIssuanceCountry",
      options: Country.getAllCountries()
        .map((c) => ({
          id: c.isoCode,
          name: c.name,
        }))
        .sort((a, b) => {
          if (a.name === "Pakistan") return -1; // Pakistan first
          if (b.name === "Pakistan") return 1;
          return a.name.localeCompare(b.name); // alphabetical for others
        }),
      searchable: true,
    },
  ];

  const ChildFormFields = [
    {
      component: FormSelect,
      label: "Title *",
      name: "title",
      options: ["Miss", "Mstr"],
    },
    { component: InputField, label: "First Name *", name: "fullName" },
    { component: InputField, label: "Last Name *", name: "lastName" },
    {
      component: FormSelect,
      label: "Gender *",
      name: "gender",
      options: ["Male", "Female"],
    },
    {
      component: AppDatePicker,
      name: "dob",
      size: "sm",
      label: "Date of Birth *",
      placeholder: "MM/DD/YYYY",
    },
    {
      component: FormSelect,
      label: "Nationality *",
      name: "nationality",
      options: Country.getAllCountries()
        .map((c) => ({
          id: c.isoCode,
          name: c.name,
        }))
        .sort((a, b) => {
          if (a.name === "Pakistan") return -1; // Pakistan first
          if (b.name === "Pakistan") return 1;
          return a.name.localeCompare(b.name); // alphabetical for others
        }),
      searchable: true,
    },
    {
      component: FormSelect,
      label: "Document Type *",
      name: "documentType",
      options: ["Passport", "National ID"],
    },
    { component: InputField, label: "Document No *", name: "documentNo" },
    {
      component: AppDatePicker,
      name: "passportExpiryDate",
      size: "sm",
      label: "Expiry Date",
    },
    {
      component: FormSelect,
      label: "Passport Issuance Country *",
      name: "passportIssuanceCountry",
      options: Country.getAllCountries()
        .map((c) => ({
          id: c.isoCode,
          name: c.name,
        }))
        .sort((a, b) => {
          if (a.name === "Pakistan") return -1; // Pakistan first
          if (b.name === "Pakistan") return 1;
          return a.name.localeCompare(b.name); // alphabetical for others
        }),
      searchable: true,
    },
  ];

  const infantFormFields = [
    {
      component: FormSelect,
      label: "Title *",
      name: "title",
      options: ["Miss", "Mstr"],
    },
    { component: InputField, label: "First Name *", name: "fullName" },
    { component: InputField, label: "Last Name *", name: "lastName" },
    {
      component: FormSelect,
      label: "Gender *",
      name: "gender",
      options: ["Male", "Female"],
    },
    {
      component: AppDatePicker,
      name: "dob",
      size: "sm",
      label: "Date of Birth *",
    },
    {
      component: FormSelect,
      label: "Nationality",
      name: "nationality",
      options: Country.getAllCountries()
        .map((c) => ({
          id: c.isoCode,
          name: c.name,
        }))
        .sort((a, b) => {
          if (a.name === "Pakistan") return -1; // Pakistan first
          if (b.name === "Pakistan") return 1;
          return a.name.localeCompare(b.name); // alphabetical for others
        }),
      searchable: true,
    },
    {
      component: FormSelect,
      label: "Document Type *",
      name: "documentType",
      options: ["Passport", "National ID"],
    },
    { component: InputField, label: "Document No *", name: "documentNo" },
    {
      component: AppDatePicker,
      name: "passportExpiryDate",
      size: "sm",
      label: "Expiry Date",
    },
    {
      component: FormSelect,
      label: "Passport Issuance Country *",
      name: "passportIssuanceCountry",
      options: Country.getAllCountries()
        .map((c) => ({
          id: c.isoCode,
          name: c.name,
        }))
        .sort((a, b) => {
          if (a.name === "Pakistan") return -1; // Pakistan first
          if (b.name === "Pakistan") return 1;
          return a.name.localeCompare(b.name); // alphabetical for others
        }),
      searchable: true,
    },
  ];

  const traveler = [
    // 4 Adults
    {
      type: "Adult",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
    {
      type: "Adult",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
    {
      type: "Adult",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
    {
      type: "Adult",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },

    // 3 Children
    {
      type: "Child",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
    {
      type: "Child",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
    {
      type: "Child",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },

    // 2 Infants
    {
      type: "Infant",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
    {
      type: "Infant",
      title: "",
      fullName: "",
      lastName: "",
      gender: "",
      dob: null,
      nationality: "",
      documentType: "",
      documentNo: "",
      passportExpiryDate: null,
      passportIssuanceCountry: "",
    },
  ];

  const renderTravelerForm = (traveler, index) => {
    return (
      <Box
        key={index}
        sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: "md" }}
      >
        <Typography level="h5" sx={{ mb: 2 }}>{`${traveler?.type} ${index + 1
          }`}</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {(traveler?.type === "Infant"
            ? infantFormFields
            : traveler?.type === "Child"
              ? ChildFormFields
              : adultFormFields
          ).map(
            (
              { component: Field, label, name, options, size, type },
              fieldIndex
            ) => (
              <Box
                key={fieldIndex}
                sx={{
                  flexBasis: "calc(33.333% - 16px)",
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                {Field === AppDatePicker ? (
                  <Field
                    label={label}
                    name={name}
                    size={size}
                    // date={traveler?.[name] ?? ""}
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
                    value={traveler?.[name] ?? ""}
                    // value={traveler[name]}
                    onChange={(e) =>
                      handleInputChange(index, name, e.target.value)
                    }
                    size={size}
                  />
                )}
              </Box>
            )
          )}
        </Box>
      </Box>
    );
  };

  const handleIssueTicket = async () => {
    const transformedTravelers = travelers.map((traveler, index) => ({
      id: (index + 1).toString(),
      dateOfBirth: traveler.dob
        ? traveler.dob.toISOString().split("T")[0]
        : null,
      gender: traveler.gender ? traveler.gender.toUpperCase() : null,
      travelerType:
        traveler?.type === "Adult"
          ? "ADULT"
          : traveler?.type === "Child"
            ? "CHILD"
            : "INFANT",
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
          documentType: getDocmentTypeByApiType(
            flight.api,
            traveler?.documentType
          ),
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

    console.log("transformedTravelers", transformedTravelers);

    const body = {
      data: {
        type: "flight-order",
        flightOffers: flight?.itineraries,
        travelers: transformedTravelers,
        emailAddress: travellerEmail,
        brandedFare: responseBrandedFare,
      },
    };

    try {
      dispatch(setLoading(true));
      let res; // Declare res here to be available for both branches
      let pnr;

      if (tripType === "Multi City" && flight.api === "sabre") {
        const sabreRes = await sabreMultiCitybookAndIssue(body);
        res = sabreRes; // Assign sabreRes to res so you can log it later
        pnr = sabreRes?.result?.id;
      } else if (flight.api === "sabre") {
        const sabreRes = await bookAndIssue("sabre", body);
        res = sabreRes; // Assign sabreRes to res so you can log it later
        pnr =
          sabreRes?.result?.CreatePassengerNameRecordRS?.ItineraryRef?.ID ||
          sabreRes?.result?.id;
      } else {
        res = await bookAndIssue("flights", body); // Assign response to res
        pnr = res?.result?.data?.id || res?.result?.id;
      }

      await addPSF({ pnr, psfValue, type: markupPreference });

      // if (flight.api === "sabre") {

      // const resData = await viewItinary(
      //     pnr,
      //     flight?.api === "amadeus" || flight?.api === "amadus"
      //         ? "flights"
      //         : "sabre"
      // );
      // const agencyLogoUrl = `${NEXT_PUBLIC_PROD_IMAGE_URL}${flight?.agencyId?.logo}`;
      // await generatePDFTicket(
      //     flight,
      //     agencyLogoUrl,
      //     null,
      //     resData?.result,
      //     printOption === "without",
      //     flight?.api === "amadeus" || flight?.api === "amadus"
      // );

      // }

      dispatch(setLoading(false));
      // dispatch(setDashboardOption("Flight Booking"));
      enqueueSnackbar("Ticket Issued successfully", { variant: "success" });
      setOpenModal(false);
      resetFilters();
      setFlightTickets([]);
      setTripType("One Way");
      setAdultsCount(1);
      setChildrenCount(0);
      setInfantsCount(0);
      setDepartureCity(null);
      setArrivalCity(null);
      setDepartureDate(null);
      setReturnDate(null);
      setMulticityFlights([
        { departureCity: null, arrivalCity: null, departureDate: null },
      ]);
      setOpenCreditModal({ value: true, pnr: pnr });
    } catch (error) {
      dispatch(setLoading(false));
      enqueueSnackbar(`Something went wrong ${error}`, { variant: "error" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleHoldTicket = async () => {
    const transformedTravelers = travelers.map((traveler, index) => ({
      id: (index + 1).toString(),
      dateOfBirth: traveler.dob
        ? traveler.dob.toISOString().split("T")[0]
        : null,
      gender: traveler.gender ? traveler.gender.toUpperCase() : null,
      travelerType:
        traveler?.type === "Adult"
          ? "ADULT"
          : traveler?.type === "Child"
            ? "CHILD"
            : "INFANT",
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
          documentType: getDocmentTypeByApiType(
            flight.api,
            traveler?.documentType
          ),
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
        brandedFare: responseBrandedFare,
      },
    };

    try {
      dispatch(setLoading(true));
      let res; // Declare res here to be available for both branches
      let pnr;

      if (tripType === "Multi City" && flight.api === "sabre") {
        const sabreRes = await submitSabreBookingMRequest(body);
        res = sabreRes; // Assign sabreRes to res so you can log it later
        pnr = sabreRes?.result?.id;
      } else if (flight.api === "sabre") {
        const sabreRes = await submitSabreBookingRequest(body);
        res = sabreRes; // Assign sabreRes to res so you can log it later
        pnr =
          sabreRes?.result?.CreatePassengerNameRecordRS?.ItineraryRef?.ID ||
          sabreRes?.result?.id;
      } else {
        res = await submitBookingRequest(body); // Assign response to res
        pnr = res?.result?.data?.id || res?.result?.id;
      }

      await addPSF({ pnr, psfValue, type: markupPreference });

      dispatch(setLoading(false));
      dispatch(setDashboardOption("Flight Booking"));
      enqueueSnackbar("Booking submitted successfully", { variant: "success" });
      setOpenModal(false);
      resetFilters();
      setFlightTickets([]);
      setTripType("One Way");
      setAdultsCount(1);
      setChildrenCount(0);
      setInfantsCount(0);
      setDepartureCity(null);
      setArrivalCity(null);
      setDepartureDate(null);
      setReturnDate(null);
      setMulticityFlights([
        { departureCity: null, arrivalCity: null, departureDate: null },
      ]);

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
    setOpenReviewConfirmationModal(false);

    setOpenModal(true);
  };

  const openReviewConfirmationModalIssue = () => {
    // if (!validateForm()) {
    //   return;
    // }

    setOpenBaseFareModal(false);
    setOpenReviewConfirmationModal(true);
  };

  const openBaseFareModalIssue = () => {
    if (!validateForm()) {
      return;
    }

    setPsfValue("");
    setPrintOption("with");

    setOpenBaseFareModal(true);
  };

  const showTravelLocation = (data) => {
    if (data?.return) {
      return `${data?.departure?.[0]?.departureLocation} → ${data?.return?.[0]?.departureLocation} → ${data?.departure?.[0]?.departureLocation}`;
    }

    return `${data?.departure?.[0]?.departureLocation} → ${data?.departure?.[data?.departure?.length - 1]?.arrivalLocation
      }`;
  };

  const addTenMinutes = () => {
    setTimeLeft((prev) => ({
      minutes: prev.minutes + 10,
      seconds: prev.seconds,
    }));
    setTimerModal(false);
  };

  const passengerTypes = ["adult", "child", "infants"];

  useEffect(() => {
    setCountries(Country.getAllCountries());
    setCountryCodes(Country.getAllCountries()?.map((item) => item?.phonecode));
    if (flight) {
      const totalTravelers =
        (flight?.extra?.adult?.count || 0) +
        (flight?.extra?.child?.count || 0) +
        (flight?.extra?.infants?.count || 0);
      const travelerArray = totalTravelers
        ? Array(totalTravelers)
          .fill()
          .map((_, index) => ({
            type:
              index < flight?.extra?.adult?.count
                ? "Adult"
                : index <
                  flight?.extra?.adult?.count + flight?.extra?.child?.count
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
            gender: "",
          }))
        : [];

      setTravelers(travelerArray);

      setTravellerArray(
        totalTravelers
          ? Array(totalTravelers)
            .fill()
            .map((_, index) =>
              index < flight?.extra?.adult?.count
                ? `Adult ${index + 1}`
                : index <
                  flight?.extra?.adult?.count + flight?.extra?.child?.count
                  ? `Child ${index + 1}`
                  : `Infant ${index + 1}`
            )
          : []
      );
    }
  }, []);

  useEffect(() => {
    // If you want to control scroll behavior, you can use this to manually scroll to a desired position.
    window.scrollTo(0, 0); // This will scroll to the top on page load
  }, []);

  // React.useEffect(() => {
  //     const timer = setInterval(() => {
  //         setTimeLeft((prev) => {
  //             if (prev.seconds > 0) {
  //                 return { ...prev, seconds: prev.seconds - 1 };
  //             } else if (prev.minutes > 0) {
  //                 return { minutes: prev.minutes - 1, seconds: 59 };
  //             } else {
  //                 clearInterval(timer);
  //                 return { minutes: 0, seconds: 0 };
  //             }
  //         });
  //     }, 1000);

  //     return () => clearInterval(timer);
  // }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds;

        if (newSeconds > 0) {
          newSeconds--;
        } else if (newMinutes > 0) {
          newMinutes--;
          newSeconds = 59;
        } else {
          clearInterval(timer);
          setExpiredTimerModal(true);
          setTimerModal(false);
          return { minutes: 0, seconds: 0 };
        }

        if (newMinutes === 4 && newSeconds === 0 && !timerModal) {
          setTimerModal(true);
        }

        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ background: "#79717e17" }}>
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
            style={{ fontSize: "2.5rem", cursor: "pointer", marginTop: "15%" }}
            onClick={() => navigate(-1)}
          />
        </Box>
        <Box style={{ width: "82.5%" }}>
          <img src={AlasamLogo} style={{ width: "15%", marginTop: "3%" }} />
        </Box>
        {/* <Box style={{ width: "12.5%" }}>
                    <Button variant="text" sx={{ mx: "0.5rem", mt: { sm: "10px", md: "5px", lg: "0px" } }}>
                        Support
                    </Button>
                    <Button borderColor="#185ea5" sx={{ fontSize: { sm: "10px", md: "14px", lg: "16px" } }}>My Bookings</Button>
                </Box> */}
      </Box>
      <Box sx={{ mx: 5, mt: 5, p: 4 }}>
        <Grid container spacing={2}>
          {/* Left Column - Flight Details */}
          <Grid xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  level="h4"
                  component="h1"
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  Review your Flight
                </Typography>
                <Box>
                  <Button
                    onClick={handleOpenModal}
                    variant="outlined"
                    sx={{ mr: 1, color: "black", background: "#F7EBF5" }}
                    disabled={loading1}
                  >
                    {loading1 ? "Loading..." : "Fare Rules"}
                  </Button>
                  <Button
                    onClick={() => {
                      navigate(-1);
                    }}
                    variant="outlined"
                    sx={{ color: "black", background: "#F7EBF5" }}
                  >
                    Change Flight
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Card
                  variant="outlined"
                  sx={{ mb: 2, width: "90%", mr: 2, borderRadius: "25px" }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ mr: 1 }}>
                          <Typography level="title-md">DEPART</Typography>
                          {/* <Typography level="title-lg">17 Apr'25</Typography> */}
                          <Typography level="title-lg">
                            {" "}
                            {moment(
                              flight?.departure?.[0]?.departureTime
                            ).format("DD MMM,YY")}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" />
                        <Box
                          sx={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "start",
                            ml: 1,
                          }}
                        >
                          <Typography level="title-lg" sx={{ mr: 1 }}>
                            {" "}
                            {tripType === "Multi City"
                              ? extractedFlightsForMultiCity?.map(
                                (flightItem, index) => (
                                  <>
                                    {index === 0 && flightItem?.from}
                                    <ArrowRightAltIcon />
                                    {flightItem?.to}
                                  </>
                                )
                              )
                              : showTravelLocation(flight)}
                          </Typography>
                          {/* <Typography level="title-lg" sx={{ mr: 1 }}> {departure[0]?.departureLocation  →  departure[0]?.arrivalLocation}</Typography> */}

                          <Typography level="body-sm">
                            {tripType !== "Multi City" &&
                              calculateStops(flight?.departure)}
                          </Typography>
                        </Box>
                      </Box>
                      {/* <Box
                        sx={{
                          textAlign: "right",
                          display: "flex",
                          flexDirection: "start",
                          alignItems: "center",
                        }}
                      >
                        {flight?.api === "sabre" && (
                          <Typography
                            color={!flight?.refundable ? "success" : "danger"}
                            level="title-sm"
                          >
                            {!flight?.refundable
                              ? "Refundable"
                              : "Non-Refundable"}
                          </Typography>
                        )}
                      </Box> */}
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ mb: 2, borderRadius: "25px" }}>
                  <CardContent
                    sx={{ cursor: "pointer" }}
                    onClick={() => setHideItineraryCard(!hideItineraryCard)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      {hideItineraryCard ? (
                        <KeyboardArrowDownIcon sx={{ fontSize: "50px" }} />
                      ) : (
                        <KeyboardArrowUpIcon sx={{ fontSize: "50px" }} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {!hideItineraryCard &&
                (flight?.return || flight?.departure) &&
                !extractedFlightsForMultiCity?.length && (
                  <>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mt: 3,
                          }}
                        >
                          <Box sx={{ width: 200, textAlign: "center" }}>
                            <Box sx={{ display: "flex" }}>
                              <AspectRatio
                                ratio="1"
                                sx={{ width: 60, mx: "auto", mb: 1 }}
                              >
                                <img
                                  // src={"https://res.cloudinary.com/wego/f_auto,fl_lossy,w_1000,q_auto/v1480072078/flights/airlines_square/FZ"}
                                  src={flight?.departure[0]?.logo?.logo}
                                  alt={flight?.arCode}
                                  style={{ objectFit: "contain" }}
                                />
                              </AspectRatio>
                              <Box>
                                <Typography level="body-xs">
                                  {flight?.departure[0]?.logo?.ar}
                                </Typography>

                                <Typography level="body-xs">
                                  {flight?.departure[0]?.marketingCarrier}{" "}
                                  {flight?.departure[0]?.marketingFlightNumber}
                                </Typography>
                                <Typography level="body-xs">
                                  {flight.arCode ===
                                    flight?.departure?.[0].operatingLogo?.ar
                                    ? ""
                                    : "Operated By " +
                                    flight?.departure?.[0].operatingLogo?.ar}
                                </Typography>
                                {/* <Typography level="body-xs">SV 8732</Typography> */}

                                {/* <Typography level="body-xs">(E6Q6M2)</Typography> */}
                              </Box>
                            </Box>
                            <Divider
                              orientation="vertical"
                              sx={{ height: "2px", width: "100%" }}
                            />
                            <Typography
                              level="body-xs"
                              sx={{ mt: 1, textAlign: "start" }}
                            >
                              TRAVEL CLASS
                            </Typography>
                            <Typography
                              level="body-xs"
                              sx={{ textAlign: "start" }}
                            >
                              {selectedBrandedFare?.data?.[0]?.brandName?.[0] ||
                                "N/A"}
                            </Typography>
                            <Divider
                              orientation="vertical"
                              sx={{ height: "2px", width: "100%", mt: 1 }}
                            />
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              px: 4,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              {/* Departure */}
                              <Box sx={{ display: "flex", mb: 2 }}>
                                <Box
                                  sx={{ width: "85px", alignContent: "end" }}
                                >
                                  <Typography
                                    level="h3"
                                    sx={{ alignContent: "end" }}
                                  >
                                    {" "}
                                    {moment(
                                      flight?.departure?.[0]?.departureTime
                                    ).format("HH:mm")}
                                  </Typography>
                                  <Typography
                                    level="body-sm"
                                    sx={{ width: "max-content" }}
                                  >
                                    {moment(
                                      flight?.departure?.[0]?.departureTime
                                    ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    ml: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      bgcolor: "success.500",
                                      border: "3px solid white",
                                      boxShadow: "0 0 0 2px #4caf50",
                                      zIndex: 1,
                                    }}
                                  />
                                  <Box sx={{ ml: 2 }}>
                                    <Typography level="title-sm">
                                      {flight?.departure[0]?.departureLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Muscat International Airport (Muscat)</Typography> */}
                                  </Box>
                                </Box>
                              </Box>

                              {/* Dotted line and duration */}
                              <Box
                                sx={{
                                  display: "flex",
                                  height: "40px",
                                  ml: "100px",
                                  pl: "10px",
                                  mb: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "1px",
                                    height: "100%",
                                    borderLeft: "2px dotted",
                                    borderColor: "divider",
                                  }}
                                />
                                <Box>
                                  <Typography
                                    level="body-md"
                                    sx={{
                                      ml: { sm: 1, md: 1, lg: 4 },
                                      fontSize: {
                                        sm: "12px",
                                        md: "14px",
                                        lg: "16px",
                                      },
                                    }}
                                  >
                                    {calculateTotalFlightTime(
                                      flight?.departure
                                    )}
                                  </Typography>
                                  <Typography
                                    level="body-md"
                                    sx={{
                                      ml: { sm: 1, md: 1, lg: 4 },
                                      fontSize: {
                                        sm: "12px",
                                        md: "14px",
                                        lg: "16px",
                                      },
                                    }}
                                    onMouseEnter={() => {
                                      flight?.departure?.length - 1 &&
                                        setHoveredDuration({ flightIndex: 0 });
                                    }}
                                    onMouseLeave={() => {
                                      flight?.departure?.length - 1 &&
                                        setHoveredDuration({
                                          flightIndex: null,
                                        });
                                    }}
                                  >
                                    {calculateStops(flight?.departure)}
                                    {hoveredDuration.flightIndex === 0 &&
                                      hoveredDuration?.type !== "return" && (
                                        <DurationTooltip
                                          data={flight?.departure}
                                          apiName={flight?.api}
                                        />
                                      )}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Arrival */}
                              <Box sx={{ display: "flex" }}>
                                <Box sx={{ width: "85px" }}>
                                  <Typography level="h3">
                                    {flight?.departure.length == 2
                                      ? moment(
                                        flight?.departure?.[1]?.arrivalTime
                                      ).format("HH:mm")
                                      : moment(
                                        flight?.departure?.[0]?.arrivalTime
                                      ).format("HH:mm")}
                                  </Typography>
                                  <Typography
                                    level="body-sm"
                                    sx={{ width: "max-content" }}
                                  >
                                    {flight?.departure.length == 2
                                      ? moment(
                                        flight?.departure?.[1]?.arrivalTime
                                      ).format("ddd, DD MMM,YY")
                                      : moment(
                                        flight?.departure?.[0]?.arrivalTime
                                      ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    ml: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      bgcolor: "success.500",
                                      border: "3px solid white",
                                      boxShadow: "0 0 0 2px #4caf50",
                                      zIndex: 1,
                                    }}
                                  />
                                  <Box sx={{ ml: 2 }}>
                                    <Typography level="title-sm">
                                      {flight?.departure.length == 2
                                        ? flight?.departure[1]?.arrivalLocation
                                        : flight?.departure[0]?.arrivalLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Dubai International Airport (Dubai), Terminal {flight?.departure.length == 2 ? flight?.departure[1]?.terminal : flight?.departure[0]?.terminal}</Typography> */}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              width: 200,
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              borderLeft: "1px solid #CDD7E1",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 2,
                              }}
                            >
                              <Box
                                component="img"
                                src={`${require("../../images/baggage.jpg")}`}
                                alt="Baggage icon"
                                sx={{ height: 80, width: 60 }}
                              />
                              <Box sx={{ ml: 1, textAlign: "left" }}>
                                <Typography level="title-md" fontWeight="bold">
                                  Baggage Detail
                                </Typography>
                                <Typography level="body-md">
                                  <b>CHECK IN:</b>
                                  {passengerTypes.map((type) => {
                                    const count = flight?.extra?.[type]?.count;
                                    if (count > 0) {
                                      return (
                                        <Typography
                                          fontSize="sm"
                                          key={`${type}-checkin`}
                                        >
                                          <br />
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                          : {getCheckinText(type, flight)}
                                        </Typography>
                                      );
                                    }
                                    return null;
                                  })}
                                </Typography>
                                <Typography level="body-md">
                                  <b>CABIN:</b>
                                  {passengerTypes.map((type) => {
                                    const count = flight?.extra?.[type]?.count;
                                    if (count > 0) {
                                      return (
                                        <Typography
                                          fontSize="sm"
                                          key={`${type}-cabin`}
                                        >
                                          <br />
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                          : {getCabinText(type, flight)}
                                        </Typography>
                                      );
                                    }
                                    return null;
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                    {flight?.return && (
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              mt: 3,
                            }}
                          >
                            <Box sx={{ width: 200, textAlign: "center" }}>
                              <Box sx={{ display: "flex" }}>
                                <AspectRatio
                                  ratio="1"
                                  sx={{ width: 60, mx: "auto", mb: 1 }}
                                >
                                  <img
                                    // src={"https://res.cloudinary.com/wego/f_auto,fl_lossy,w_1000,q_auto/v1480072078/flights/airlines_square/FZ"}
                                    src={flight?.departure[0]?.logo?.logo}
                                    alt={flight?.arCode}
                                    style={{ objectFit: "contain" }}
                                  />
                                </AspectRatio>
                                <Box>
                                  <Typography level="body-xs">
                                    {flight?.return[0]?.logo?.ar}
                                  </Typography>

                                  <Typography level="body-xs">
                                    {flight?.return[0]?.marketingCarrier}{" "}
                                    {
                                      flight?.return[0]
                                        ?.marketingFlightNumber
                                    }
                                  </Typography>
                                  <Typography level="body-xs">
                                    {flight.arCode ===
                                      flight?.return?.[0].operatingLogo?.ar
                                      ? ""
                                      : "Operated By " +
                                      flight?.return?.[0].operatingLogo?.ar}
                                  </Typography>
                                  {/* <Typography level="body-xs">SV 8732</Typography> */}

                                  {/* <Typography level="body-xs">(E6Q6M2)</Typography> */}
                                </Box>
                              </Box>
                              <Divider
                                orientation="vertical"
                                sx={{ height: "2px", width: "100%" }}
                              />
                              <Typography
                                level="body-xs"
                                sx={{ mt: 1, textAlign: "start" }}
                              >
                                TRAVEL CLASS
                              </Typography>
                              <Typography
                                level="body-xs"
                                sx={{ textAlign: "start" }}
                              >
                                {selectedBrandedFare?.data?.[0]
                                  ?.brandName?.[0] || "N/A"}
                              </Typography>
                              <Divider
                                orientation="vertical"
                                sx={{ height: "2px", width: "100%", mt: 1 }}
                              />
                            </Box>

                            <Box
                              sx={{
                                flex: 1,
                                position: "relative",
                                px: 4,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {/* Departure */}
                                <Box sx={{ display: "flex", mb: 2 }}>
                                  <Box
                                    sx={{ width: "85px", alignContent: "end" }}
                                  >
                                    <Typography
                                      level="h3"
                                      sx={{ alignContent: "end" }}
                                    >
                                      {" "}
                                      {moment(
                                        flight?.return?.[0]?.departureTime
                                      ).format("HH:mm")}
                                    </Typography>
                                    <Typography
                                      level="body-sm"
                                      sx={{ width: "max-content" }}
                                    >
                                      {moment(
                                        flight?.return?.[0]?.departureTime
                                      ).format("ddd, DD MMM,YY")}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      display: "flex",
                                      alignItems: "center",
                                      ml: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        bgcolor: "success.500",
                                        border: "3px solid white",
                                        boxShadow: "0 0 0 2px #4caf50",
                                        zIndex: 1,
                                      }}
                                    />
                                    <Box sx={{ ml: 2 }}>
                                      <Typography level="title-sm">
                                        {flight?.return[0]?.departureLocation}
                                      </Typography>
                                      {/* <Typography level="body-xs">Muscat International Airport (Muscat)</Typography> */}
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Dotted line and duration */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    height: "40px",
                                    ml: "100px",
                                    pl: "10px",
                                    mb: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "1px",
                                      height: "100%",
                                      borderLeft: "2px dotted",
                                      borderColor: "divider",
                                    }}
                                  />
                                  <Box>
                                    <Typography
                                      level="body-md"
                                      sx={{
                                        ml: { sm: 1, md: 1, lg: 4 },
                                        mt: 1,
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
                                      level="body-md"
                                      sx={{
                                        ml: { sm: 1, md: 1, lg: 4 },
                                        fontSize: {
                                          sm: "12px",
                                          md: "14px",
                                          lg: "16px",
                                        },
                                      }}
                                      onMouseEnter={() => {
                                        flight?.return?.length - 1 &&
                                          setHoveredDuration({
                                            flightIndex: 0,
                                            type: "return",
                                          });
                                      }}
                                      onMouseLeave={() => {
                                        flight?.return?.length - 1 &&
                                          setHoveredDuration({
                                            flightIndex: null,
                                          });
                                      }}
                                    >
                                      {calculateStops(flight?.return)}
                                      {hoveredDuration.flightIndex === 0 &&
                                        hoveredDuration?.type === "return" && (
                                          <DurationTooltip
                                            data={flight?.return}
                                            apiName={flight?.api}
                                          />
                                        )}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Arrival */}
                                <Box sx={{ display: "flex" }}>
                                  <Box sx={{ width: "85px" }}>
                                    <Typography level="h3">
                                      {flight?.return.length == 2
                                        ? moment(
                                          flight?.return?.[1]?.arrivalTime
                                        ).format("HH:mm")
                                        : moment(
                                          flight?.return?.[0]?.arrivalTime
                                        ).format("HH:mm")}
                                    </Typography>
                                    <Typography
                                      level="body-sm"
                                      sx={{ width: "max-content" }}
                                    >
                                      {flight?.return.length == 2
                                        ? moment(
                                          flight?.return?.[1]?.arrivalTime
                                        ).format("ddd, DD MMM,YY")
                                        : moment(
                                          flight?.return?.[0]?.arrivalTime
                                        ).format("ddd, DD MMM,YY")}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      display: "flex",
                                      alignItems: "center",
                                      ml: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        bgcolor: "success.500",
                                        border: "3px solid white",
                                        boxShadow: "0 0 0 2px #4caf50",
                                        zIndex: 1,
                                      }}
                                    />
                                    <Box sx={{ ml: 2 }}>
                                      <Typography level="title-sm">
                                        {flight?.return.length == 2
                                          ? flight?.return[1]?.arrivalLocation
                                          : flight?.return[0]?.arrivalLocation}
                                      </Typography>
                                      {/* <Typography level="body-xs">Dubai International Airport (Dubai), Terminal {flight?.departure.length == 2 ? flight?.departure[1]?.terminal : flight?.departure[0]?.terminal}</Typography> */}
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                width: 200,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                borderLeft: "1px solid #CDD7E1",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  p: 2,
                                }}
                              >
                                <Box
                                  component="img"
                                  src={`${require("../../images/baggage.jpg")}`}
                                  alt="Baggage icon"
                                  sx={{ height: 80, width: 60 }}
                                />
                                <Box sx={{ ml: 1, textAlign: "left" }}>
                                  <Typography
                                    level="title-md"
                                    fontWeight="bold"
                                  >
                                    Baggage Detail
                                  </Typography>
                                  <Typography level="body-md">
                                    <b>CHECK IN:</b>
                                    {passengerTypes.map((type) => {
                                      const count =
                                        flight?.extra?.[type]?.count;
                                      if (count > 0) {
                                        return (
                                          <Typography
                                            fontSize="sm"
                                            key={`${type}-checkin`}
                                          >
                                            <br />
                                            {type.charAt(0).toUpperCase() +
                                              type.slice(1)}
                                            : {getCheckinText(type, flight)}
                                          </Typography>
                                        );
                                      }
                                      return null;
                                    })}
                                  </Typography>
                                  <Typography level="body-md">
                                    <b>CABIN:</b>
                                    {passengerTypes.map((type) => {
                                      const count =
                                        flight?.extra?.[type]?.count;
                                      if (count > 0) {
                                        return (
                                          <Typography
                                            fontSize="sm"
                                            key={`${type}-cabin`}
                                          >
                                            <br />
                                            {type.charAt(0).toUpperCase() +
                                              type.slice(1)}
                                            : {getCabinText(type, flight)}
                                          </Typography>
                                        );
                                      }
                                      return null;
                                    })}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

              {!hideItineraryCard &&
                extractedFlightsForMultiCity?.map((flightItem, flightIndex) => (
                  <>
                    <Card variant="outlined" sx={{ mb: 2 }} key={flightIndex}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mt: 3,
                          }}
                        >
                          <Box sx={{ width: 200, textAlign: "center" }}>
                            <Box sx={{ display: "flex" }}>
                              <AspectRatio
                                ratio="1"
                                sx={{ width: 60, mx: "auto", mb: 1 }}
                              >
                                <img
                                  // src={"https://res.cloudinary.com/wego/f_auto,fl_lossy,w_1000,q_auto/v1480072078/flights/airlines_square/FZ"}
                                  src={
                                    flightItem?.connectingFlights?.[0]
                                      ?.departure?.logo?.logo
                                  }
                                  alt={flight?.arCode}
                                  style={{ objectFit: "contain" }}
                                />
                              </AspectRatio>
                              <Box>
                                <Typography level="body-xs">
                                  {
                                    flightItem?.connectingFlights?.[0]
                                      ?.departure?.logo?.code
                                  }
                                </Typography>
                                <Typography level="body-xs">
                                  {flightItem?.connectingFlights?.[0]?.departure
                                    ?.marketingCarrier ||
                                    flightItem?.connectingFlights?.[0]
                                      ?.departure?.operatingCarrier ||
                                    flightItem?.connectingFlights?.[0]
                                      ?.operating ||
                                    flightItem?.connectingFlights?.[0]
                                      ?.marketing}{" "}
                                  {flightItem?.connectingFlights?.[0]?.departure
                                    ?.marketingFlightNumber ||
                                    flightItem?.connectingFlights?.[0]
                                      ?.marketingFlightNumber}
                                </Typography>
                                <Typography level="body-xs">
                                  {(flightItem?.connectingFlights?.[0]?.logo?.code === flightItem?.connectingFlights?.[0]?.operatingLogo?.code || flightItem?.connectingFlights?.[0]?.departure?.logo?.code === flightItem?.connectingFlights?.[0]?.departure?.operatingLogo?.code) ? "" : "Operated By " + flightItem?.connectingFlights?.[0]?.operatingLogo?.arAbbreviation ? flightItem?.connectingFlights?.[0]?.operatingLogo?.arAbbreviation : flightItem?.connectingFlights?.[0]?.departure?.operatingLogo?.arAbbreviation}
                                </Typography>
                                {/* <Typography level="body-xs">SV 8732</Typography> */}

                                {/* <Typography level="body-xs">(E6Q6M2)</Typography> */}
                              </Box>
                            </Box>
                            <Divider
                              orientation="vertical"
                              sx={{ height: "2px", width: "100%" }}
                            />
                            <Typography
                              level="body-xs"
                              sx={{ mt: 1, textAlign: "start" }}
                            >
                              TRAVEL CLASS
                            </Typography>
                            <Typography
                              level="body-xs"
                              sx={{ textAlign: "start" }}
                            >
                              {console.log(
                                "selectedBrandedFare",
                                selectedBrandedFare
                              )}
                              {selectedBrandedFare?.data?.[0]?.brandName?.[0] ||
                                "N/A"}
                            </Typography>
                            <Divider
                              orientation="vertical"
                              sx={{ height: "2px", width: "100%", mt: 1 }}
                            />
                          </Box>

                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              px: 4,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* Departure */}
                              <Box sx={{ display: "flex", mb: 2 }}>
                                <Box
                                  sx={{
                                    width: "85px",
                                    alignContent: "end",
                                  }}
                                >
                                  <Typography
                                    level="h3"
                                    sx={{ alignContent: "end" }}
                                  >
                                    {" "}
                                    {moment(
                                      flightItem?.connectingFlights?.[0]
                                        ?.departure?.departureTime ||
                                      flightItem?.connectingFlights?.[0]
                                        ?.departureTime
                                    ).format("HH:mm")}
                                  </Typography>
                                  <Typography
                                    level="body-sm"
                                    sx={{ width: "max-content" }}
                                  >
                                    {moment(
                                      flightItem?.connectingFlights?.[0]
                                        ?.departure?.departureTime ||
                                      flightItem?.connectingFlights?.[0]
                                        ?.departureTime
                                    ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    ml: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      bgcolor: "success.500",
                                      border: "3px solid white",
                                      boxShadow: "0 0 0 2px #4caf50",
                                      zIndex: 1,
                                    }}
                                  />
                                  <Box sx={{ ml: 2 }}>
                                    <Typography level="title-sm">
                                      {flightItem?.from ||
                                        flightItem?.connectingFlights?.[0]
                                          ?.departureLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Muscat International Airport (Muscat)</Typography> */}
                                  </Box>
                                </Box>
                              </Box>

                              {/* Dotted line and duration */}
                              <Box
                                sx={{
                                  display: "flex",
                                  height: "40px",
                                  ml: "100px",
                                  pl: "10px",
                                  mb: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "1px",
                                    height: "100%",
                                    borderLeft: "2px dotted",
                                    borderColor: "divider",
                                  }}
                                />
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography level="body-md" sx={{ ml: 4 }}>
                                    {calculateTotalFlightTime(
                                      flightItem?.connectingFlights
                                    )}
                                  </Typography>
                                  <Typography
                                    level="body-md"
                                    sx={{
                                      ml: { sm: 1, md: 1, lg: 4 },
                                      fontSize: {
                                        sm: "12px",
                                        md: "14px",
                                        lg: "16px",
                                      },
                                    }}
                                    onMouseEnter={() => {
                                      flightItem?.connectingFlights?.length -
                                        1 &&
                                        setHoveredDuration({
                                          flightIndex: flightIndex,
                                          departureIndex: flightIndex,
                                        });
                                    }}
                                    onMouseLeave={() => {
                                      flightItem?.connectingFlights?.length -
                                        1 &&
                                        setHoveredDuration({
                                          flightIndex: null,
                                        });
                                    }}
                                  >
                                    {calculateStops(
                                      flightItem?.connectingFlights
                                    )}
                                    {hoveredDuration.flightIndex ===
                                      flightIndex && (
                                        <DurationTooltip
                                          data={flightItem?.connectingFlights}
                                          apiName={"sabre"}
                                          isMultiCity={true}
                                        />
                                      )}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Arrival */}
                              <Box sx={{ display: "flex" }}>
                                <Box sx={{ width: "85px" }}>
                                  <Typography
                                    level="h3"
                                    sx={{ alignContent: "end" }}
                                  >
                                    {" "}
                                    {moment(
                                      flightItem?.connectingFlights?.[
                                        flightItem?.connectingFlights?.length -
                                        1
                                      ]?.departure?.arrivalTime ||
                                      flightItem?.connectingFlights?.[
                                        flightItem?.connectingFlights
                                          ?.length - 1
                                      ]?.arrivalTime
                                    ).format("HH:mm")}
                                  </Typography>
                                  <Typography
                                    level="body-sm"
                                    sx={{ width: "max-content" }}
                                  >
                                    {moment(
                                      flightItem?.connectingFlights?.[
                                        flightItem?.connectingFlights?.length -
                                        1
                                      ]?.departure?.arrivalTime ||
                                      flightItem?.connectingFlights?.[
                                        flightItem?.connectingFlights
                                          ?.length - 1
                                      ]?.arrivalTime
                                    ).format("ddd, DD MMM,YY")}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    ml: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      bgcolor: "success.500",
                                      border: "3px solid white",
                                      boxShadow: "0 0 0 2px #4caf50",
                                      zIndex: 1,
                                    }}
                                  />
                                  <Box sx={{ ml: 2 }}>
                                    <Typography level="title-sm">
                                      {flightItem?.to ||
                                        flightItem?.connectingFlights?.[
                                          flightItem?.connectingFlights
                                            ?.length - 1
                                        ]?.arrivalLocation}
                                    </Typography>
                                    {/* <Typography level="body-xs">Dubai International Airport (Dubai), Terminal {flight?.departure.length == 2 ? flight?.departure[1]?.terminal : flight?.departure[0]?.terminal}</Typography> */}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              width: 200,
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              borderLeft: "1px solid #CDD7E1",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 2,
                              }}
                            >
                              <Box
                                component="img"
                                src={`${require("../../images/baggage.jpg")}`}
                                alt="Baggage icon"
                                sx={{ height: 80, width: 60 }}
                              />
                              <Box sx={{ ml: 1, textAlign: "left" }}>
                                <Typography level="title-md" fontWeight="bold">
                                  Baggage Detail
                                </Typography>
                                <Typography level="body-md">
                                  <b>CHECK IN:</b>
                                  {passengerTypes.map((type) => {
                                    const count = flight?.extra?.[type]?.count;
                                    if (count > 0) {
                                      return (
                                        <Typography
                                          fontSize="sm"
                                          key={`${type}-checkin`}
                                        >
                                          <br />
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                          : {getCheckinText(type, flight)}
                                        </Typography>
                                      );
                                    }
                                    return null;
                                  })}
                                </Typography>
                                <Typography level="body-md">
                                  <b>CABIN:</b>
                                  {passengerTypes.map((type) => {
                                    const count = flight?.extra?.[type]?.count;
                                    if (count > 0) {
                                      return (
                                        <Typography
                                          fontSize="sm"
                                          key={`${type}-cabin`}
                                        >
                                          <br />
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                          : {getCabinText(type, flight)}
                                        </Typography>
                                      );
                                    }
                                    return null;
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </>
                ))}

              <Typography
                level="h4"
                component="h1"
                sx={{ mb: 2, fontWeight: "bold", textTransform: "uppercase" }}
              >
                Passenger Information
              </Typography>

              {travelers.map((traveler, index) =>
                renderTravelerForm(traveler, index)
              )}

              <ContactInfo
                handlePhoneChange={handlePhoneChange}
                travellerPhone={travellerPhone}
                travellerEmail={travellerEmail}
                setTravellerEmail={setTravellerEmail}
              />

              {/* <ShareConfirm /> */}

              <PayNowSection onClick={openBaseFareModalIssue} flight={flight} />
            </Box>
          </Grid>

          {/* Right Column - Fare Details */}
          <Grid xs={12} md={4}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography level="h5">Fare Details</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => setExpanded(!expanded)}
                  >
                    <Typography level="title-md">
                      {expanded ? (
                        <KeyboardArrowUpIcon fontSize={"large"} />
                      ) : (
                        <KeyboardArrowDownIcon fontSize={"large"} />
                      )}
                      Base Fare
                    </Typography>
                    <Typography level="title-md">
                      RS {flight?.passengerTotalFare}
                    </Typography>
                  </Box>
                  {flight?.extra &&
                    Object?.entries(flight?.extra)?.map(([type, data]) => {
                      if (data?.count && data.Price) {
                        const unitPrice = (data.Price / data.count / 1000)
                          ?.toFixed(3)
                          ?.replace(".", ""); // Adjust divisor if needed
                        const totalPrice = (data.Price / 1000)
                          ?.toFixed(3)
                          ?.replace(".", ""); // Assuming price is in Baisa (1000 Baisa = 1 OMR)

                        return (
                          <>
                            {expanded && (
                              <Box
                                key={type}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  p: 1,
                                }}
                              >
                                <Typography sx={{ fontSize: "14px" }}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
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
                            )}
                          </>
                        );
                      }
                      return null;
                    })}

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Typography level="title-md">
                      <KeyboardArrowUpIcon fontSize={"large"} /> Tax & Charges
                      (Included)
                    </Typography>
                    <Typography level="title-md">
                      RS{" "}
                      {flight?.taxSummaries?.reduce(
                        (acc, tax) => acc + (parseFloat(tax.amount) || 0),
                        0
                      ) || 0}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      background: "#F7EBF5",
                    }}
                  >
                    <Typography level="title-lg">Total Amount:</Typography>
                    <Typography level="title-lg">
                      RS {flight?.passengerTotalFare}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ position: "relative", textAlign: "center", mt: 4 }}>
              {/* <AspectRatio ratio="1" sx={{ width: 150, mx: "auto", background: 'white' }}> */}
              {/* <CircularProgress
                                    determinate
                                    value={((timeLeft.minutes * 60 + timeLeft.seconds) / (20 * 60)) * 100}
                                    size="lg"
                                    thickness={6}
                                    // color="success"
                                    sx={{ "--CircularProgress-size": "150px", background: 'white', color: "#F7EBF5" }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        background: 'white'

                                    }}
                                >
                                    <Typography level="h2">
                                        {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, "0")}
                                    </Typography>
                                    <Typography level="body-sm">LEFT</Typography>
                                </Box> */}

              {/* </AspectRatio> */}

              <Typography
                level="h1"
                fontSize="4rem"
                textAlign="center"
                fontWeight="lg"
                mb={2}
              >
                {timeLeft.minutes}:
                {timeLeft.seconds.toString().padStart(2, "0")}
              </Typography>
              <Typography level="h2" textAlign="center" mb={3}>
                Time Left
              </Typography>

              <LinearProgress
                determinate
                value={
                  ((timeLeft.minutes * 60 + timeLeft.seconds) / (20 * 60)) * 100
                }
                size="lg"
                thickness={16}
                sx={{
                  mb: 3,
                  "--LinearProgress-radius": "8px",
                  "--LinearProgress-progressThickness": "16px",
                  background: "white",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <AddBaseFare
        open={openBaseFareModal}
        setOpen={setOpenBaseFareModal}
        openReviewConfirmationModalIssue={openReviewConfirmationModalIssue}
        {...{ psfValue, setPsfValue, printOption, setPrintOption }}
      />

      {openReviewConfirmationModal && (
        <ReviewConfirmationModal
          open={openReviewConfirmationModal}
          setOpen={setOpenReviewConfirmationModal}
          handleOpen={openModalIssue}
          flight={flight}
          brandedFare={brandedFareDetail}
          travelers={travelers}
          openModalIssue={openModalIssue}
          psfValue={psfValue}
          tripType={tripType}
          singleBrandedFare={selectedBrandedFare}
        />
      )}

      {modalOpen && (
        <FareRulesModal
          open={modalOpen}
          onClose={handleCloseModal}
          fareData={fareRules}
        />
      )}

      <IssueTicketModal
        open={openModal}
        setOpen={setOpenModal}
        handleIssueTicket={handleIssueTicket}
        handleHoldTicket={handleHoldTicket}
      />
      {openCreditModal?.value && (
        <CreditModal
          open={openCreditModal?.value}
          setOpen={setOpenCreditModal}
          pnr={openCreditModal?.pnr}
        />
      )}

      {/* <Button onClick={() => handleExpiredTimerModalOpen()}>addd</Button> */}

      <Modal
        open={timerModal}
        onClose={handleTimerModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <TimerIcon sx={{ height: "75px", width: "75px" }} />
          </Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Your session will expire soon!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please click on 'More Time' to Continue the booking
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              mt: 1,
            }}
          >
            <Button
              onClick={() => handleTimerModalClose()}
              sx={{
                backgroundColor: "transparent",
                border: "1px solid black",
                color: "black",
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Cancel
            </Button>
            <Button onClick={addTenMinutes}>More Time</Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={expiredTimerModal}
        onClose={handleExpiredTimerModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <TimerIcon sx={{ height: "75px", width: "75px" }} />
          </Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Session time out!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Your session expired
          </Typography>

          <Button
            sx={{ mt: 1 }}
            onClick={() => {
              navigate("/b2b/searchticket");
              setExpiredTimerModal(false);
            }}
          >
            New Search
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingV2;

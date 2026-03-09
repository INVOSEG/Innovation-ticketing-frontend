import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  headerTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerLeft: { display: "flex", flexDirection: "column" },
  headerDate: { fontSize: 10, color: "#374151" },
  headerTrip: { fontWeight: "bold" },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  airlineLogo: {
    width: 140,
    height: 90,
    objectFit: "contain",
  },
  preparedSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    paddingTop: 12,
    width: "100%",
  },
  preparedLeft: { display: "flex", flexDirection: "column", width: "50%" },
  preparedLabel: { fontSize: 10, fontWeight: "bold", color: "#374151" },
  preparedName: { fontSize: 11, fontWeight: "bold", color: "#111827" },
  preparedRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
    paddingRight: 0,
    marginRight: 0,
  },
  departureSection: {
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 2,
    borderTopColor: "#000000",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  departureTitle: { fontSize: 13, fontWeight: "bold", color: "#111827" },
  departureNote: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 4,
  },
  flightContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 10,
  },
  flightTop: {
    flexDirection: "row",
    height: 145,
  },
  leftPanel: {
    width: "25%",
    backgroundColor: "#f3f4f6",
    padding: 10,
    justifyContent: "space-between",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  flightLabel: { fontSize: 9, color: "#6b7280" },
  flightNumber: { fontSize: 24, fontWeight: "900", color: "#111827" },
  airlineInfo: { fontSize: 8, color: "#6b7280" },
  statusLabel: { fontSize: 8, color: "#6b7280" },
  statusValue: { fontSize: 9, fontWeight: "bold", color: "#111827" },
  centerPanel: {
    width: "50%",
    padding: 12,
    justifyContent: "space-between",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeCity: { alignItems: "flex-start" },
  routeCity1: { alignItems: "flex-end" },

  routeCode: { fontSize: 13, color: "#6b7280" },
  routeCityText: { fontSize: 9, color: "#6b7280" },
  arrow: { fontSize: 11, color: "#6b7280", textAlign: "center" },
  timesRow: { flexDirection: "row", justifyContent: "space-between" },
  timeCol: { width: "30%", alignItems: "flex-start" },
  timeCol1: { width: "30%", alignItems: "flex-end" },

  timeLabel: { fontSize: 10, color: "#6b7280" },
  timeValue: { fontSize: 13, fontWeight: "bold", color: "#111827" },
  terminalLabel: { fontSize: 7, color: "#6b7280" },
  rightPanel: {
    width: "25%",
    padding: 12,
    justifyContent: "space-between",
  },
  detailLabel: { fontSize: 8, color: "#6b7280" },
  detailValue: { fontSize: 9, color: "#111827" },
  passengerSection: { marginTop: 14 },
  passengerHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  passengerRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  passengerNameCol: { width: "40%" },
  passengerTickCol: { width: "20%", textAlign: "left" },
  passengerSeatsCol: { width: "20%", textAlign: "center" },

  passengerBookingCol: { width: "20%", textAlign: "right" },
  footerSection: {
    marginTop: 30,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalPriceLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 10,
  },
  totalPriceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  deadlineText: {
    fontSize: 10,
    color: "#dc2626",
    fontWeight: "bold",
    marginTop: 4,
  },
});

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

const formatTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "—";

// Converts ISO 8601 duration (e.g. "PT1H55M", "PT2H", "PT30M") to "1h 55m"
const formatISODuration = (duration) => {
  if (!duration || typeof duration !== "string") return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration; // Return as-is if unrecognised format
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes}m`;
  return null;
};

// Function to move postfix titles to the front
const movePostfixToFront = (fullName) => {
  if (!fullName || typeof fullName !== "string") return fullName;

  const titles = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Mstr", "Prof"];

  const parts = fullName.trim().split(/\s+/);

  // If we have at least one part
  if (parts.length === 0) return fullName;

  // Check each part to see if it's a title
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Check if this part is a title (case insensitive)
    const isTitle = titles.some(
      (title) =>
        part.toLowerCase() === title.toLowerCase() ||
        part.toLowerCase() === title.toLowerCase() + "."
    );

    if (isTitle) {
      // Remove the title from its current position
      const title = parts.splice(i, 1)[0];
      // Add it to the front
      parts.unshift(title);
      // Join and return
      return parts.join(" ");
    }
  }

  // If no title found in the name, return as is
  return fullName;
};

// Function to get baggage info
const getBaggageInfo = (flight, bookingData) => {
  const isHitit = bookingData?.api?.toLowerCase() === "hitit";
  let checkInVal = "";
  let cabinVal = "";

  if (isHitit) {
    const bagInfo =
      bookingData?.selectedBrandedFare?.baggageInformation?.[0] ||
      bookingData?.brandedFare?.baggageInformation?.[0] ||
      flight?.baggageInformation?.[0];
    checkInVal = bagInfo ? `${bagInfo.weight} ${bagInfo.unit}` : "20 KG";
    cabinVal = "7 KG";
  } else {
    if (flight?.checkedBaggage) checkInVal = flight.checkedBaggage;
    else if (flight?.baggage) checkInVal = flight.baggage;
    else if (flight?.pieceCount) checkInVal = `${flight.pieceCount} PC`;

    cabinVal = flight?.cabinBaggage || "7 KG";
  }

  const parts = [];
  if (checkInVal && checkInVal !== "N/A") parts.push(`Check-in: ${checkInVal}`);
  if (cabinVal && cabinVal !== "N/A") parts.push(`Cabin: ${cabinVal}`);

  return parts.length > 0 ? parts.join(", ") : "Not Available";
};

const TicketPDF = ({
  ticketData = {},
  resData = {},
  agencyLogoUrl = "",
  formattedData,
}) => {
  // Log all incoming data
  console.log("TicketPDF - ticketData:", ticketData);
  console.log("TicketPDF - resData:", resData);
  console.log("TicketPDF - agencyLogoUrl:", agencyLogoUrl);
  console.log("TicketPDF - formattedData:", formattedData);

  // Extract data from the new API response structure
  const messageData = resData?.message || {};
  const bookingData = messageData?.booking || {};
  const agencyData = messageData?.agency || {};
  const issuedBy = messageData?.issuedBy || {};

  const airlineDetails = messageData?.airlineDetails || [];

  // Get flight type from booking data
  const flightType = bookingData?.flightType || "one-way";

  // Extract traveler information
  const travelers = bookingData?.travelers || [];
  const ticketNumber = travelers[0]?.ticketNumber;

  // Extract agency information
  const agencyName = agencyData?.name || agencyData?.affiliateName || "N/A";
  const agencyLogo = agencyData?.logoUrl || agencyLogoUrl;
  const agencyPhone = agencyData?.phone || "N/A";
  const agencyEmail = agencyData?.email || "N/A";

  // Log extracted data
  console.log("TicketPDF - messageData:", messageData);
  console.log("TicketPDF - bookingData:", bookingData);
  console.log("TicketPDF - agencyData:", agencyData);
  console.log("TicketPDF - airlineDetails:", airlineDetails);
  console.log("TicketPDF - agencyName:", agencyName);
  console.log("TicketPDF - agencyLogo:", agencyLogo);
  console.log("TicketPDF - agencyPhone:", agencyPhone);
  console.log("TicketPDF - agencyEmail:", agencyEmail);
  console.log("TicketPDF - travelers:", travelers);

  const departureFlights = bookingData?.departure || [];
  const returnFlights = bookingData?.return || [];

  const multiCityFlights = airlineDetails;

  // Extract flight information for one-way/round-trip
  const oneWayFlight = departureFlights[0] || {};
  const lastDepartureFlight =
    departureFlights[departureFlights.length - 1] || {};
  const roundFlight = returnFlights[0] || {};
  const lastReturnFlight = returnFlights[returnFlights.length - 1] || {};

  const oneWaydepAtRaw =
    oneWayFlight?.DepartureDateTime || oneWayFlight?.departureTime;
  const oneWayarrAtRaw =
    oneWayFlight?.ArrivalDateTime || oneWayFlight?.arrivalTime;
  const oneWaydepTime = formatTime(oneWaydepAtRaw);
  const oneWayarrTime = formatTime(oneWayarrAtRaw);
  const oneWayStops = "N/A";
  const oneWayMeals = "N/A";
  const oneWayDistance = "N/A";
  const oneWayAircraft = "N/A";
  const oneWayClass = "Economy";
  const oneWayFlightNumber =
    oneWayFlight?.FlightNumber || oneWayFlight?.flightNumber || "";
  const oneWayFlightName =
    oneWayFlight?.MarketingAirline?.Code || oneWayFlight?.marketing || "";
  const oneWayAirlineName =
    oneWayFlight?.MarketingAirline?.Code || oneWayFlight?.marketing || "";
  const oneWayOperatedBy =
    oneWayFlight?.OperatingAirline?.Code || oneWayFlight?.operatedBy || "";
  const oneWayMarketedBy =
    oneWayFlight?.MarketingAirline?.Code || oneWayFlight?.marketing || "";

  const oneWayFromCode =
    oneWayFlight?.OriginLocation?.LocationCode ||
    oneWayFlight?.departureLocation ||
    oneWayFlight?.from ||
    "—";
  const oneWayToCode =
    lastDepartureFlight?.DestinationLocation?.LocationCode ||
    lastDepartureFlight?.arrivalLocation ||
    lastDepartureFlight?.to ||
    "—";
  const oneWayFromCity = oneWayFlight?.fromAirport?.city;
  const oneWayToCity = lastDepartureFlight?.toAirport?.city;
  const oneWayFromCountry = oneWayFlight?.fromAirport?.country;
  const oneWayToCountry = lastDepartureFlight?.toAirport?.country;
  const oneWayFromName = oneWayFlight?.fromAirport?.name;
  const oneWayToName = lastDepartureFlight?.toAirport?.name;

  const rounddepAtRaw =
    roundFlight?.DepartureDateTime || roundFlight?.departureTime;
  const roundarrAtRaw =
    roundFlight?.ArrivalDateTime || roundFlight?.arrivalTime;
  const rounddepTime = formatTime(rounddepAtRaw);
  const roundarrTime = formatTime(roundarrAtRaw);
  const roundStops = "N/A";
  const roundMeals = "N/A";
  const roundDistance = "N/A";
  const roundAircraft = "N/A";
  const roundClass = "Economy";
  const roundFlightNumber =
    roundFlight?.FlightNumber || roundFlight?.flightNumber || "";
  const roundFlightName =
    roundFlight?.MarketingAirline?.Code || roundFlight?.marketing || "";
  const roundAirlineName =
    roundFlight?.MarketingAirline?.Code || roundFlight?.marketing || "";

  // Extract location information for round-trip
  const roundFromCode =
    roundFlight?.OriginLocation?.LocationCode ||
    roundFlight?.departureLocation ||
    roundFlight?.from ||
    "—";
  const roundToCode =
    lastReturnFlight?.DestinationLocation?.LocationCode ||
    lastReturnFlight?.arrivalLocation ||
    lastReturnFlight?.to ||
    "—";
  const roundFromCity = roundFromCode;
  const roundToCity = roundToCode;

  const onewayticketDate = formatDate(oneWaydepAtRaw || bookingData?.createdAt);
  const roundticketDate = formatDate(rounddepAtRaw);

  const status = bookingData?.status || "hold";
  const createdAt = bookingData?.createdAt || ticketData?.createdAt;

  // Calculate payment deadline (20 minutes from createdAt if not provided by backend)
  const paymentDeadlineRaw = bookingData?.paymentDeadline;

  console.log("TicketPDF - Final status:", status);
  console.log("TicketPDF - Final paymentDeadlineRaw:", paymentDeadlineRaw);
  console.log("TicketPDF - departureFlights:", departureFlights);
  console.log("TicketPDF - returnFlights:", returnFlights);
  console.log("TicketPDF - multiCityFlights:", multiCityFlights);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerDate}>
              {onewayticketDate}{" "}
              <Text style={styles.headerTrip}>
                ▸ {flightType.toUpperCase()}{" "}
                {flightType !== "round-trip" ? "TRIP" : ""}
              </Text>
            </Text>
            <Text style={styles.headerDate}>
              {flightType === "multi-city"
                ? (() => {
                  // For multi-city, show departure of first flight, then arrivals of all flights
                  if (multiCityFlights.length > 0) {
                    let routeString = multiCityFlights[0]?.from || "—";
                    multiCityFlights.forEach((flight) => {
                      routeString += ` - ${flight?.to || "—"}`;
                    });
                    return routeString;
                  }
                  return "—";
                })()
                : flightType === "round-trip"
                  ? `${oneWayFromCode} - ${oneWayToCode} - ${roundToCode}`
                  : `${oneWayFromCode} - ${oneWayToCode}`}
            </Text>
            {paymentDeadlineRaw && status?.toLowerCase() !== "confirmed" && (
              <Text style={styles.deadlineText}>
                Booking Deadline: {formatDate(paymentDeadlineRaw)} {formatTime(paymentDeadlineRaw)}
                {"\n"}(Booking will be automatically cancelled if not paid by this time)
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.preparedLabel}>PREPARED FOR</Text>
            <Text style={styles.preparedName}>
              {movePostfixToFront(
                `${travelers[0]?.name?.firstName || ""} ${travelers[0]?.name?.lastName || ""
                  }`.trim()
              )}
            </Text>
          </View>
        </View>

        {/* Agency Section for */}
        <View style={styles.preparedSection}>
          <View style={styles.preparedLeft}>
            {agencyName && agencyName !== "N/A" && (
              <Text style={[styles.preparedName, { marginBottom: 4 }]}>{agencyName}</Text>
            )}
            <Text style={styles.preparedLabel}>{issuedBy?.name || "N/A"}</Text>
            <Text style={styles.preparedLabel}>{issuedBy?.phone || ""}</Text>
            <Text style={styles.preparedLabel}>{issuedBy?.email || "N/A"}</Text>
          </View>
          <View style={styles.preparedRight}>
            <View style={{ alignItems: "flex-end" }}>
              {agencyLogo && (
                <Image src={agencyLogo} style={styles.airlineLogo} />
              )}
            </View>
          </View>
        </View>

        {/* Passenger section */}
        <View style={styles.passengerSection}>
          <View style={styles.passengerHeader}>
            <Text style={[styles.passengerNameCol]}>Passenger Name</Text>
            <Text style={[styles.passengerTickCol]}>PNR</Text>
            <Text style={[styles.passengerSeatsCol]}>Seats</Text>
            <Text style={[styles.passengerBookingCol]}>Booking</Text>
          </View>

          {travelers && travelers.length > 0 ? (
            travelers.map((trav, i) => (
              <View key={i} style={styles.passengerRow}>
                <Text style={[styles.passengerNameCol]}>
                  {movePostfixToFront(
                    `${trav?.name?.firstName || ""} ${trav?.name?.lastName || ""
                      }`.trim()
                  )}
                </Text>
                <Text style={styles.passengerTickCol}>
                  {bookingData?.id || "—"}
                </Text>

                <Text style={[styles.passengerSeatsCol]}>
                  Check-in required
                </Text>
                <Text style={[styles.passengerBookingCol]}>
                  {bookingData?.status === "confirmed"
                    ? "CONFIRMED"
                    : bookingData?.status?.toUpperCase() || "CONFIRMED"}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.passengerRow}>
              <Text style={[styles.passengerNameCol]}>
                Passenger information not available
              </Text>
              <Text style={[styles.passengerSeatsCol]}>Check-in required</Text>
              <Text style={[styles.passengerBookingCol]}>CONFIRMED</Text>
            </View>
          )}
        </View>

        {/* Handle one-way flights */}
        {flightType === "one-way" &&
          departureFlights.map((flight, index) => (
            <React.Fragment key={index}>
              {/* Departure section */}
              <View style={styles.departureSection}>
                <Text style={styles.departureTitle}>
                  DEPARTURE:{" "}
                  {formatDate(
                    flight?.DepartureDateTime || flight?.departureTime
                  )}
                </Text>
                <Text style={styles.departureNote}>
                  Please verify flight times prior to departure
                </Text>
              </View>

              {/* Flight container */}
              <View style={styles.flightContainer}>
                <View style={styles.flightTop}>
                  {/* Left */}
                  <View style={styles.leftPanel}>
                    <View>
                      <Text style={styles.flightLabel}>FLIGHT</Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.flightNumber}>
                          {flight?.MarketingAirline?.Code ||
                            flight?.marketing ||
                            flight?.marketingCarrier ||
                            ""}{" "}
                          {flight?.FlightNumber || flight?.flightNumber || flight?.marketingFlightNumber || ""}
                        </Text>
                      </View>
                    </View>
                    <View>
                      {flight?.marketedBy && (
                        <Text style={styles.airlineInfo}>
                          {flight?.marketedBy || "N/A"}
                        </Text>
                      )}

                      {flight?.operatedBy && (
                        <Text style={styles.airlineInfo}>
                          {flight?.operatedBy || "N/A"}
                        </Text>
                      )}

                      <Text style={styles.airlineInfo}>
                        Class: {flight?.class || flight?.cabin?.name || "Economy"}
                      </Text>
                      <Text style={styles.statusLabel}>
                        Status:{" "}
                        {bookingData?.status === "confirmed"
                          ? "CONFIRMED"
                          : bookingData?.status?.toUpperCase() || "CONFIRMED"}
                      </Text>
                    </View>
                  </View>

                  {/* Center */}
                  <View style={styles.centerPanel}>
                    <View style={styles.routeRow}>
                      <View style={styles.routeCity}>
                        <Text style={styles.routeCode}>
                          {flight?.OriginLocation?.LocationCode ||
                            flight?.departureLocation ||
                            flight?.from ||
                            "—"}
                        </Text>
                        {/* <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.name || "—"}
                        </Text> */}

                        <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.city}
                        </Text>
                        <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.country}
                        </Text>
                      </View>
                      <Text style={styles.arrow}>→</Text>
                      <View style={styles.routeCity1}>
                        <Text style={styles.routeCode}>
                          {flight?.DestinationLocation?.LocationCode ||
                            flight?.arrivalLocation ||
                            flight?.to ||
                            "—"}
                        </Text>
                        {/* <Text style={styles.routeCityText}>
                          {flight?.toAirport?.name || "—"}
                        </Text> */}
                        <Text style={styles.routeCityText}>
                          {flight?.toAirport?.city}
                        </Text>
                        <Text style={styles.routeCityText}>
                          {flight?.toAirport?.country}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.timesRow}>
                      <View style={styles.timeCol}>
                        <Text style={styles.timeLabel}>Departing At</Text>
                        <Text style={styles.timeLabel}>
                          {formatTime(
                            flight?.DepartureDateTime || flight?.departureTime
                          )}
                        </Text>
                        <Text style={styles.timeLabel}>
                          {formatDate(
                            flight?.DepartureDateTime || flight?.departureTime
                          )}
                        </Text>
                      </View>
                      <View style={styles.timeCol1}>
                        <Text style={styles.timeLabel}>Arriving At</Text>
                        <Text style={styles.timeLabel}>
                          {formatTime(
                            flight?.ArrivalDateTime || flight?.arrivalTime
                          )}
                        </Text>
                        <Text style={styles.timeLabel}>
                          {formatDate(
                            flight?.ArrivalDateTime || flight?.arrivalTime
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right */}
                  <View style={styles.rightPanel}>
                    <View>
                      <Text style={styles.detailLabel}>Aircraft:</Text>
                      <Text style={styles.detailValue}>
                        {flight?.aircraft || "N/A"}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Meals:</Text>
                      <Text style={styles.detailValue}>
                        {flight?.MarketingAirline?.Code === "EK"
                          ? "Available"
                          : bookingData?.api?.toLowerCase() === "hitit"
                            ? (flight?.meal || "No Meal")
                            : flight?.meals === "true"
                              ? "Available"
                              : "Not Available"}
                      </Text>{" "}
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Baggage:</Text>
                      <Text style={styles.detailValue}>
                        {getBaggageInfo(flight, bookingData)}
                      </Text>
                    </View>
                    {/* Distance / Duration */}
                    {(() => {
                      const isHitit = bookingData?.api?.toLowerCase() === "hitit";
                      const formattedDuration = isHitit ? formatISODuration(flight?.duration) : null;
                      const showRow = isHitit ? (formattedDuration || flight?.distance) : true;
                      if (!showRow) return null;
                      return (
                        <View>
                          <Text style={styles.detailLabel}>
                            {isHitit ? "Duration:" : "Distance(miles):"}
                          </Text>
                          <Text style={styles.detailValue}>
                            {isHitit
                              ? (formattedDuration || flight?.distance || "N/A")
                              : (flight?.distance || "N/A")}
                          </Text>
                        </View>
                      );
                    })()}
                  </View>
                </View>
              </View>
            </React.Fragment>
          ))}

        {/* Handle round-trip flights */}
        {flightType === "round-trip" && (
          <>
            {/* Departure section */}
            {departureFlights.map((flight, index) => (
              <React.Fragment key={index}>
                {/* Departure section */}
                <View style={styles.departureSection}>
                  <Text style={styles.departureTitle}>
                    DEPARTURE:{" "}
                    {formatDate(
                      flight?.DepartureDateTime || flight?.departureTime
                    )}
                  </Text>
                  <Text style={styles.departureNote}>
                    Please verify flight times prior to departure
                  </Text>
                </View>

                {/* Flight container */}
                <View style={styles.flightContainer}>
                  <View style={styles.flightTop}>
                    {/* Left */}
                    <View style={styles.leftPanel}>
                      <View>
                        <Text style={styles.flightLabel}>FLIGHT</Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={styles.flightNumber}>
                            {flight?.MarketingAirline?.Code ||
                              flight?.marketing ||
                              flight?.marketingCarrier ||
                              ""}{" "}
                            {flight?.FlightNumber || flight?.flightNumber || flight?.marketingFlightNumber || ""}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {flight?.marketedBy && (
                          <Text style={styles.airlineInfo}>
                            {flight?.marketedBy || "N/A"}
                          </Text>
                        )}

                        {flight?.operatedBy && (
                          <Text style={styles.airlineInfo}>
                            {flight?.operatedBy || "N/A"}
                          </Text>
                        )}

                        <Text style={styles.airlineInfo}>
                          Class: {flight?.class || flight?.cabin?.name || "Economy"}
                        </Text>
                        <Text style={styles.statusLabel}>
                          Status:{" "}
                          {bookingData?.status === "confirmed"
                            ? "CONFIRMED"
                            : bookingData?.status?.toUpperCase() || "CONFIRMED"}
                        </Text>
                      </View>
                    </View>

                    {/* Center */}
                    <View style={styles.centerPanel}>
                      <View style={styles.routeRow}>
                        <View style={styles.routeCity}>
                          <Text style={styles.routeCode}>
                            {flight?.OriginLocation?.LocationCode ||
                              flight?.departureLocation ||
                              flight?.from ||
                              "—"}
                          </Text>
                          {/* <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.name || "—"}
                        </Text> */}

                          <Text style={styles.routeCityText}>
                            {flight?.fromAirport?.city}
                          </Text>
                          <Text style={styles.routeCityText}>
                            {flight?.fromAirport?.country}
                          </Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                        <View style={styles.routeCity1}>
                          <Text style={styles.routeCode}>
                            {flight?.DestinationLocation?.LocationCode ||
                              flight?.arrivalLocation ||
                              flight?.to ||
                              "—"}
                          </Text>
                          {/* <Text style={styles.routeCityText}>
                          {flight?.toAirport?.name || "—"}
                        </Text> */}
                          <Text style={styles.routeCityText}>
                            {flight?.toAirport?.city}
                          </Text>
                          <Text style={styles.routeCityText}>
                            {flight?.toAirport?.country}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.timesRow}>
                        <View style={styles.timeCol}>
                          <Text style={styles.timeLabel}>Departing At</Text>
                          <Text style={styles.timeLabel}>
                            {formatTime(
                              flight?.DepartureDateTime || flight?.departureTime
                            )}
                          </Text>
                          <Text style={styles.timeLabel}>
                            {formatDate(
                              flight?.DepartureDateTime || flight?.departureTime
                            )}
                          </Text>
                        </View>
                        <View style={styles.timeCol1}>
                          <Text style={styles.timeLabel}>Arriving At</Text>
                          <Text style={styles.timeLabel}>
                            {formatTime(
                              flight?.ArrivalDateTime || flight?.arrivalTime
                            )}
                          </Text>
                          <Text style={styles.timeLabel}>
                            {formatDate(
                              flight?.ArrivalDateTime || flight?.arrivalTime
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Right */}
                    <View style={styles.rightPanel}>
                      <View>
                        <Text style={styles.detailLabel}>Aircraft:</Text>
                        <Text style={styles.detailValue}>
                          {flight?.aircraft || "N/A"}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Meals:</Text>
                        <Text style={styles.detailValue}>
                          {flight?.MarketingAirline?.Code === "EK"
                            ? "Available"
                            : bookingData?.api?.toLowerCase() === "hitit"
                              ? (flight?.meal || "No Meal")
                              : flight?.meals === "true"
                                ? "Available"
                                : "Not Available"}
                        </Text>{" "}
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Baggage:</Text>
                        <Text style={styles.detailValue}>
                          {getBaggageInfo(flight, bookingData)}
                        </Text>
                      </View>
                      {/* Distance / Duration */}
                      {(() => {
                        const isHitit = bookingData?.api?.toLowerCase() === "hitit";
                        const formattedDuration = isHitit ? formatISODuration(flight?.duration) : null;
                        const showRow = isHitit ? (formattedDuration || flight?.distance) : true;
                        if (!showRow) return null;
                        return (
                          <View>
                            <Text style={styles.detailLabel}>
                              {isHitit ? "Duration:" : "Distance(miles):"}
                            </Text>
                            <Text style={styles.detailValue}>
                              {isHitit
                                ? (formattedDuration || flight?.distance || "N/A")
                                : (flight?.distance || "N/A")}
                            </Text>
                          </View>
                        );
                      })()}
                    </View>
                  </View>
                </View>
              </React.Fragment>
            ))}

            {/* Return flights */}
            {returnFlights.map((flight, index) => (
              <React.Fragment key={index}>
                {/* Arrival */}
                <View style={styles.departureSection}>
                  <Text style={styles.departureTitle}>
                    ARRIVAL:{" "}
                    {formatDate(
                      flight?.DepartureDateTime || flight?.departureTime
                    )}
                  </Text>
                  <Text style={styles.departureNote}>
                    Please verify flight times prior to arrival
                  </Text>
                </View>

                {/* Flight container */}
                <View style={styles.flightContainer}>
                  <View style={styles.flightTop}>
                    {/* Left */}
                    <View style={styles.leftPanel}>
                      <View>
                        <Text style={styles.flightLabel}>FLIGHT</Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={styles.flightNumber}>
                            {flight?.MarketingAirline?.Code ||
                              flight?.marketing ||
                              flight?.marketingCarrier ||
                              ""}{" "}
                            {flight?.FlightNumber || flight?.flightNumber || flight?.marketingFlightNumber || ""}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {flight?.marketedBy && (
                          <Text style={styles.airlineInfo}>
                            {flight?.marketedBy || "N/A"}
                          </Text>
                        )}

                        {flight?.operatedBy && (
                          <Text style={styles.airlineInfo}>
                            {flight?.operatedBy || "N/A"}
                          </Text>
                        )}

                        <Text style={styles.airlineInfo}>
                          Class: {flight?.class || flight?.cabin?.name || "Economy"}
                        </Text>
                        <Text style={styles.statusLabel}>
                          Status:{" "}
                          {bookingData?.status === "confirmed"
                            ? "CONFIRMED"
                            : bookingData?.status?.toUpperCase() || "CONFIRMED"}
                        </Text>
                      </View>
                    </View>

                    {/* Center */}
                    <View style={styles.centerPanel}>
                      <View style={styles.routeRow}>
                        <View style={styles.routeCity}>
                          <Text style={styles.routeCode}>
                            {flight?.OriginLocation?.LocationCode ||
                              flight?.departureLocation ||
                              flight?.from ||
                              "—"}
                          </Text>
                          {/* <Text style={styles.routeCityText}>
                            {flight?.fromAirport?.name || "—"}
                          </Text> */}
                          <Text style={styles.routeCityText}>
                            {flight?.fromAirport?.city}
                          </Text>
                          <Text style={styles.routeCityText}>
                            {flight?.fromAirport?.country}
                          </Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                        <View style={styles.routeCity1}>
                          <Text style={styles.routeCode}>
                            {flight?.DestinationLocation?.LocationCode ||
                              flight?.arrivalLocation ||
                              flight?.to ||
                              "—"}
                          </Text>
                          {/* <Text style={styles.routeCityText}>
                            {flight?.toAirport?.name || "—"}
                          </Text> */}

                          <Text style={styles.routeCityText}>
                            {flight?.toAirport?.city}
                          </Text>
                          <Text style={styles.routeCityText}>
                            {flight?.toAirport?.country}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.timesRow}>
                        <View style={styles.timeCol}>
                          <Text style={styles.timeLabel}>Departing At</Text>
                          <Text style={styles.timeLabel}>
                            {formatTime(
                              flight?.DepartureDateTime || flight?.departureTime
                            )}
                          </Text>
                          <Text style={styles.timeLabel}>
                            {formatDate(
                              flight?.DepartureDateTime || flight?.departureTime
                            )}
                          </Text>

                        </View>
                        <View style={styles.timeCol1}>
                          <Text style={styles.timeLabel}>Arriving At</Text>
                          <Text style={styles.timeLabel}>
                            {formatTime(
                              flight?.ArrivalDateTime || flight?.arrivalTime
                            )}
                          </Text>
                          <Text style={styles.timeLabel}>
                            {formatDate(
                              flight?.ArrivalDateTime || flight?.arrivalTime
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Right */}
                    <View style={styles.rightPanel}>
                      <View>
                        <Text style={styles.detailLabel}>Aircraft:</Text>
                        <Text style={styles.detailValue}>{flight?.aircraft || "N/A"}</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Meals:</Text>
                        <Text style={styles.detailValue}>
                          {flight?.MarketingAirline?.Code === "EK"
                            ? "Available"
                            : bookingData?.api?.toLowerCase() === "hitit"
                              ? (flight?.meal || "No Meal")
                              : departureFlights?.[0]?.meals === "true"
                                ? "Available"
                                : "Not Available"}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Baggage:</Text>
                        <Text style={styles.detailValue}>
                          {getBaggageInfo(flight, bookingData)}
                        </Text>
                      </View>
                      {/* Distance / Duration */}
                      {(() => {
                        const isHitit = bookingData?.api?.toLowerCase() === "hitit";
                        const formattedDuration = isHitit ? formatISODuration(flight?.duration) : null;
                        const showRow = isHitit ? (formattedDuration || flight?.distance) : true;
                        if (!showRow) return null;
                        return (
                          <View>
                            <Text style={styles.detailLabel}>
                              {isHitit ? "Duration:" : "Distance(miles):"}
                            </Text>
                            <Text style={styles.detailValue}>
                              {isHitit
                                ? (formattedDuration || flight?.distance || "N/A")
                                : (flight?.distance || "N/A")}
                            </Text>
                          </View>
                        );
                      })()}
                    </View>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </>
        )}

        {/* Handle multi-city flights */}
        {flightType === "multi-city" &&
          multiCityFlights.map((flight, index) => (
            <React.Fragment key={index}>
              {/* Departure section */}
              <View style={styles.departureSection}>
                <Text style={styles.departureTitle}>
                  FLIGHT {index + 1}: {formatDate(flight?.departureTime)}
                </Text>
                <Text style={styles.departureNote}>
                  Please verify flight times prior to departure
                </Text>
              </View>

              {/* Flight container */}
              <View style={styles.flightContainer}>
                <View style={styles.flightTop}>
                  {/* Left */}
                  <View style={styles.leftPanel}>
                    <View>
                      <Text style={styles.flightLabel}>FLIGHT</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text style={styles.flightNumber}>
                          {flight?.airlineCode} {flight?.flightNumber}
                        </Text>
                      </View>
                    </View>
                    <View>
                      {flight?.marketedBy && (
                        <Text style={styles.airlineInfo}>
                          {flight?.marketedBy || "N/A"}
                        </Text>
                      )}

                      {flight?.operatedBy && (
                        <Text style={styles.airlineInfo}>
                          {flight?.operatedBy || "N/A"}
                        </Text>
                      )}
                      <Text style={styles.airlineInfo}>
                        Class: {flight?.class || "Economy"}
                      </Text>
                      <Text style={styles.statusLabel}>
                        Status:{" "}
                        {bookingData?.status === "confirmed"
                          ? "CONFIRMED"
                          : bookingData?.status?.toUpperCase() || "CONFIRMED"}
                      </Text>
                    </View>
                  </View>

                  {/* Center */}
                  <View style={styles.centerPanel}>
                    <View style={styles.routeRow}>
                      <View style={styles.routeCity}>
                        <Text style={styles.routeCode}>{flight?.from}</Text>
                        {/* <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.name || "—"}
                        </Text> */}

                        <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.city}
                        </Text>
                        <Text style={styles.routeCityText}>
                          {flight?.fromAirport?.country}
                        </Text>
                      </View>
                      <Text style={styles.arrow}>→</Text>
                      <View style={styles.routeCity1}>
                        <Text style={styles.routeCode}>{flight?.to}</Text>
                        {/* <Text style={styles.routeCityText}>
                          {flight?.toAirport?.name || "—"}
                        </Text> */}

                        <Text style={styles.routeCityText}>
                          {flight?.toAirport?.city}
                        </Text>
                        <Text style={styles.routeCityText}>
                          {flight?.toAirport?.country}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.timesRow}>
                      <View style={styles.timeCol}>
                        <Text style={styles.timeLabel}>Departing At</Text>
                        <Text style={styles.timeLabel}>
                          {formatTime(flight?.departureTime)}
                        </Text>
                        <Text style={styles.timeLabel}>
                          {formatDate(flight?.departureTime)}
                        </Text>
                      </View>
                      <View style={styles.timeCol1}>
                        <Text style={styles.timeLabel}>Arriving At</Text>
                        <Text style={styles.timeLabel}>
                          {formatTime(flight?.arrivalTime)}
                        </Text>
                        <Text style={styles.timeLabel}>
                          {formatDate(flight?.arrivalTime)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right */}
                  <View style={styles.rightPanel}>
                    <View>
                      <Text style={styles.detailLabel}>Aircraft:</Text>
                      <Text style={styles.detailValue}>
                        {flight?.aircraft || "N/A"}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Meals:</Text>
                      <Text style={styles.detailValue}>
                        {flight?.airlineCode === "EK"
                          ? "Available"
                          : flight?.meals === "true"
                            ? "Available"
                            : bookingData?.api?.toLowerCase() === "hitit" ? "No Information Available" : "Not Available"}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Baggage:</Text>
                      <Text style={styles.detailValue}>
                        {getBaggageInfo(flight, bookingData)}
                      </Text>
                    </View>
                    {/* <View><Text style={styles.detailLabel}>Stops:</Text>
                  <Text style={styles.detailValue}>{flight?.stops || "0"}</Text>
                  </View> */}
                    <View>
                      <Text style={styles.detailLabel}>Distance(miles):</Text>
                      <Text style={styles.detailValue}>
                        {flight?.distance || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </React.Fragment>
          ))}

        {/* {status === "confirmed" && ( */}
        <View style={styles.footerSection}>
          <Text style={styles.totalPriceLabel}>Total Price:</Text>
          <Text style={styles.totalPriceValue}>
            RS {bookingData?.finalPrice || "N/A"}
          </Text>
        </View>
        {/* )} */}
      </Page>
    </Document>
  );
};

export const generatePDFTicket = async (
  ticketData,
  resData,
  agencyLogoUrl,
  formattedData
) => {
  try {
    // Log the parameters being passed to the PDF generation
    console.log("generatePDFTicket - ticketData:", ticketData);
    console.log("generatePDFTicket - resData:", resData);
    console.log("generatePDFTicket - agencyLogoUrl:", agencyLogoUrl);
    console.log("generatePDFTicket - formattedData:", formattedData);

    const blob = await pdf(
      <TicketPDF
        ticketData={ticketData}
        resData={resData}
        agencyLogoUrl={agencyLogoUrl}
        formattedData={formattedData}
      />
    ).toBlob();

    console.log("PDF generated successfully, saving file...");
    try {
      saveAs(blob, `ticket_${ticketData?.id || Date.now()}.pdf`);
      console.log("PDF saved successfully");
    } catch (saveError) {
      console.error("Error saving PDF:", saveError);
    }
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

export default TicketPDF;

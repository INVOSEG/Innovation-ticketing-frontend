import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/joy';
import axios from 'axios';

// const ItinerarySegment = ({ segment }) => (
//     <Card variant="outlined" sx={{ minWidth: 300, marginRight: 2 }}>
//         <CardContent>
//             <Typography level="h6">Flight Details</Typography>
//             <Typography>Flight: {segment.carrier.marketing} {segment.carrier.marketingFlightNumber}</Typography>
//             <Typography>Operating: {segment.carrier.operating} {segment.carrier.operatingFlightNumber}</Typography>
//             <Typography>Departure: {segment.departure.city} ({segment.departure.airport}) at {segment.departure.time} Terminal {segment.departure.terminal}</Typography>
//             <Typography>Arrival: {segment.arrival.city} ({segment.arrival.airport}) at {segment.arrival.time} Terminal {segment.arrival.terminal}</Typography>
//             <Typography>Total Miles Flown: {segment.totalMilesFlown} Miles</Typography>
//             <Typography>Elapsed Time: {segment.elapsedTime} minutes</Typography>
//             <Typography>Frequency: {segment.frequency}</Typography>
//         </CardContent>
//     </Card>
// );


const FlightTicket = ({ ticketData }) => {
    const { groupDescription, itineraries } = ticketData;

    // Extracting data from the JSON object
    const { departureDate, departureLocation, arrivalLocation } = groupDescription.legDescriptions[0];
    const { fare } = itineraries[0].pricingInformation[0];
    const { passengerInfoList } = fare;

    // Passenger details
    const adultPassenger = passengerInfoList.find(p => p.passengerInfo.passengerType === "ADT");
    const infantPassenger = passengerInfoList.find(p => p.passengerInfo.passengerType === "INF");

    return (
        <Card variant="outlined" sx={{ p: 3, width: "400px", mx: "auto", backgroundColor: "#F3F4F6", borderColor: "#592647" }}>
            <Typography level="h2" fontSize="lg" sx={{ mb: 1.5, textAlign: "center", color: "#592647" }}>
                Flight Ticket
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Typography level="h3" fontSize="md" sx={{ fontWeight: "bold" }}>
                    {departureLocation} → {arrivalLocation}
                </Typography>
                <Typography level="body2" sx={{ color: "#888" }}>
                    Departure: {new Date(departureDate).toDateString()}
                </Typography>
            </Box>

            <Divider />

            <Box sx={{ my: 2 }}>
                <Typography level="h3" fontSize="md" sx={{ fontWeight: "bold" }}>
                    Adult Fare
                </Typography>
                <Typography level="body2">Total Fare: PKR {adultPassenger.passengerInfo.passengerTotalFare.totalFare}</Typography>
                <Typography level="body2">Base Fare: EUR {adultPassenger.passengerInfo.passengerTotalFare.baseFareAmount}</Typography>
                <Typography level="body2">Taxes: PKR {adultPassenger.passengerInfo.passengerTotalFare.totalTaxAmount}</Typography>
            </Box>

            <Divider />

            <Box sx={{ my: 2 }}>
                <Typography level="h3" fontSize="md" sx={{ fontWeight: "bold" }}>
                    Infant Fare
                </Typography>
                <Typography level="body2">Total Fare: PKR {infantPassenger.passengerInfo.passengerTotalFare.totalFare}</Typography>
                <Typography level="body2">Base Fare: EUR {infantPassenger.passengerInfo.passengerTotalFare.baseFareAmount}</Typography>
                <Typography level="body2">Taxes: PKR {infantPassenger.passengerInfo.passengerTotalFare.totalTaxAmount}</Typography>
            </Box>

            <Divider />
            <Box sx={{ my: 2 }}>
                <Typography level="h3" fontSize="md" sx={{ fontWeight: "bold" }}>
                    Stops
                </Typography>
                <Typography level="body2">Number of Stops</Typography>
               
            </Box>

            <Divider />
            <Box sx={{ mt: 2 }}>
                <Typography level="h3" fontSize="md" sx={{ fontWeight: "bold" }}>
                    Baggage Information
                </Typography>
                <Typography level="body2">Allowance for Adult: {adultPassenger.passengerInfo.baggageInformation[0].allowance.ref} bags</Typography>
                <Typography level="body2">Airline: {fare.validatingCarrierCode}</Typography>
            </Box>
        </Card>
    );
};



const AppTicket = () => {
    const [apiResponse, setApiResponse] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = {
                    "OTA_AirLowFareSearchRQ": {
                        "Version": "6.1.0",
                        "POS": {
                            "Source": [
                                {
                                    "PseudoCityCode": "R148",
                                    "RequestorID": {
                                        "Type": "1",
                                        "ID": "1",
                                        "CompanyName": {
                                            "Code": "TN",
                                            "content": "TN"
                                        }
                                    }
                                }
                            ]
                        },
                        "OriginDestinationInformation": [
                            {
                                "RPH": "1",
                                "DepartureDateTime": "2024-10-08T11:00:00",
                                "OriginLocation": {
                                    "LocationCode": "MOW"
                                },
                                "DestinationLocation": {
                                    "LocationCode": "LON"
                                }
                            }
                            // {
                            //     "RPH": "2",
                            //     "DepartureDateTime": "2024-10-12T11:00:00",
                            //     "OriginLocation": {
                            //         "LocationCode": "LON"
                            //     },
                            //     "DestinationLocation": {
                            //         "LocationCode": "MOW"
                            //     }
                            // }
                        ],
                        "TravelPreferences": {
                            "ValidInterlineTicket": true
                        },
                        "TravelerInfoSummary": {
                            "SeatsRequested": [
                                1
                            ],
                            "AirTravelerAvail": [
                                {
                                    "PassengerTypeQuantity": [
                                        {
                                            "Code": "ADT",
                                            "Quantity": 2
                                        },
                                        {
                                            "Code": "INF",
                                            "Quantity": 2
                                        }
                                    ]
                                }
                            ]
                        },
                        "TPA_Extensions": {
                            "IntelliSellTransaction": {
                                "RequestType": {
                                    "Name": "AD7"
                                }
                            }
                        }
                    }
                };

                const response = await axios.post(
                    `https://api.cert.platform.sabre.com/v6.1.0/shop/altdates/flights?mode=live`,
                    body,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer T1RLAQJrhihbA2SgtB6mal4GnjTXuT/xe1CA867p6YuJVH73MhD0csh+WBBU9xemNGJ5ZY74AADQvvrVX6GHrHTW4AVBw/FuMONzVOiDS6O1McbRsqb9KFuaLAYzALSobnpUUAhO0LqCZI3Cby6/P9TuyLFNGl8B+PVR8NA9zbm6kfLJZ+VztkdV7wpYeDys6wKUa6HdsMFMeAQ2QEAolUVZ9LBasC5ZZkLUXWiBlxelEj9FglaelnF3quPq85G5fW4cRZMQ9u/Ov3+Y2gfa9jX+NDf6bPghjR3fN/DlGFUdx4B4sLHOEfu7wSYv/oj4/0YcGKlth3XfQb6P+Wryko058BgMWuESEg**' // Replace with actual token if needed
                        }
                    }
                );
console.log("res======data", response)
                setApiResponse(response.data);
            } catch (error) {
                console.error('Error fetching flight data:', error);
            }
        };

        fetchData();
    }, []);

    if (!apiResponse) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: 2 }}>
            <Typography level="h4" sx={{ mb: 2 }}>Itinerary Information</Typography>
            {console.log("itenary groups", apiResponse.itineraryGroups)}

            <Box sx={{ display: 'inline-flex', flexDirection: 'row' }}>


{/* 
                {apiResponse.groupedItineraryResponse?.itineraryGroups.map((segment) => (
                    <FlightTicket key={segment.id} ticketData={segment} />
                ))}
 */}

            </Box>




            {/* <Box sx={{ display: 'inline-flex', flexDirection: 'row' }}>



                {apiResponse.groupedItineraryResponse.scheduleDescs.map((segment) => (
                    <ItinerarySegment key={segment.id} segment={segment} />
                ))}


            </Box> */}
        </Box>
    );
};

export default AppTicket;

const FlightTab = ({ flight }) => {
    console.log(flight)
    return (
        <>
            {/* Handle one-way flights */}
            {flight?.flightType === "one-way" && flight?.departure?.map((item, index) => (
                <Box key={index} sx={{ border: '1px solid black', borderRadius: '20px', marginTop: index !== 0 && '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="h4">{item?.OriginLocation?.LocationCode || item?.departureLocation}</Typography>
                            <Typography level="title-sm" color="neutral">{formatDate(item?.DepartureDateTime || item?.departureTime)}</Typography>
                        </Box>

                        <Box>
                            <ArrowForwardIcon sx={{ fontSize: '30px' }} />
                        </Box>

                        <Box>
                            <Typography level="h4" sx={{ textAlign: 'right' }}>{item?.DestinationLocation?.LocationCode || item?.arrivalLocation}</Typography>
                            <Typography level="title-sm" color="neutral" sx={{ textAlign: 'right' }}>{formatDate(item?.ArrivalDateTime || item?.arrivalTime)}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="h3">{extractTime(item?.DepartureDateTime || item?.departureTime)}</Typography>
                        </Box>

                        <Box>
                            <Typography level="title-md">{formatDuration(item?.elapsedTime)}</Typography>
                        </Box>

                        <Box>
                            <Typography level="h3" sx={{ textAlign: 'right' }}>{extractTime(item?.ArrivalDateTime || item?.arrivalTime)}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Airline</Typography>
                            <Typography level="title-lg">{item?.MarketingAirline?.Code || flight?.arCode}</Typography>
                        </Box>

                        <Box>
                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Flight Number</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{item?.MarketingAirline?.FlightNumber || item?.FlightNumber || item?.marketing}-{item?.marketingFlightNumber}</Typography>
                        </Box>
                    </Box>

                    {flight?.api === "amadus" || flight?.api === "amadeus" && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                            <Box>
                                <Typography level="title-sm">Class</Typography>
                                <Typography level="title-lg">{flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment[index]?.cabin} {`(${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment[index]?.class})`}</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            ))}

            {/* Handle round-trip flights */}
            {flight?.flightType === "round-trip" && (
                <>
                    {/* Departure flights */}
                    {flight?.departure?.map((item, index) => (
                        <Box key={index} sx={{ border: '1px solid black', borderRadius: '20px', marginTop: index !== 0 && '10px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <Box>
                                    <Typography level="h4">{item?.OriginLocation?.LocationCode || item?.departureLocation}</Typography>
                                    <Typography level="title-sm" color="neutral">{formatDate(item?.DepartureDateTime || item?.departureTime)}</Typography>
                                </Box>

                                <Box>
                                    <ArrowForwardIcon sx={{ fontSize: '30px' }} />
                                </Box>

                                <Box>
                                    <Typography level="h4" sx={{ textAlign: 'right' }}>{item?.DestinationLocation?.LocationCode || item?.arrivalLocation}</Typography>
                                    <Typography level="title-sm" color="neutral" sx={{ textAlign: 'right' }}>{formatDate(item?.ArrivalDateTime || item?.arrivalTime)}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <Box>
                                    <Typography level="h3">{extractTime(item?.DepartureDateTime || item?.departureTime)}</Typography>
                                </Box>

                                <Box>
                                    <Typography level="title-md">{formatDuration(item?.elapsedTime)}</Typography>
                                </Box>

                                <Box>
                                    <Typography level="h3" sx={{ textAlign: 'right' }}>{extractTime(item?.ArrivalDateTime || item?.arrivalTime)}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <Box>
                                    <Typography level="title-sm">Airline</Typography>
                                    <Typography level="title-lg">{item?.MarketingAirline?.Code || flight?.arCode}</Typography>
                                </Box>

                                <Box>
                                    <Typography level="title-sm" sx={{ textAlign: 'right' }}>Flight Number</Typography>
                                    <Typography level="title-lg" sx={{ textAlign: 'right' }}>{item?.MarketingAirline?.FlightNumber || item?.FlightNumber || item?.marketing}-{item?.marketingFlightNumber}</Typography>
                                </Box>
                            </Box>

                            {flight?.api === "amadus" || flight?.api === "amadeus" && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                    <Box>
                                        <Typography level="title-sm">Class</Typography>
                                        <Typography level="title-lg">{flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment[index]?.cabin} {`(${flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment[index]?.class})`}</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))}

                    {/* Return flights */}
                    {flight?.return?.map((item, index) => (
                        <Box key={index} sx={{ border: '1px solid black', borderRadius: '20px', marginTop: '10px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <Box>
                                    <Typography level="h4">{item?.OriginLocation?.LocationCode || item?.departureLocation}</Typography>
                                    <Typography level="title-sm" color="neutral">{formatDate(item?.DepartureDateTime || item?.departureTime)}</Typography>
                                </Box>

                                <Box>
                                    <ArrowBackIcon sx={{ fontSize: '30px' }} />
                                </Box>

                                <Box>
                                    <Typography level="h4" sx={{ textAlign: 'right' }}>{item?.DestinationLocation?.LocationCode || item?.arrivalLocation}</Typography>
                                    <Typography level="title-sm" color="neutral" sx={{ textAlign: 'right' }}>{formatDate(item?.ArrivalDateTime || item?.arrivalTime)}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <Box>
                                    <Typography level="h3">{extractTime(item?.DepartureDateTime || item?.departureTime)}</Typography>
                                </Box>

                                <Box>
                                    <Typography level="title-md">{formatDuration(item?.elapsedTime)}</Typography>
                                </Box>

                                <Box>
                                    <Typography level="h3" sx={{ textAlign: 'right' }}>{extractTime(item?.ArrivalDateTime || item?.arrivalTime)}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                                <Box>
                                    <Typography level="title-sm">Airline</Typography>
                                    <Typography level="title-lg">{item?.MarketingAirline?.Code || flight?.arCode}</Typography>
                                </Box>

                                <Box>
                                    <Typography level="title-sm" sx={{ textAlign: 'right' }}>Flight Number</Typography>
                                    <Typography level="title-lg" sx={{ textAlign: 'right' }}>{item?.MarketingAirline?.FlightNumber || item?.FlightNumber || item?.marketing}-{item?.marketingFlightNumber}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </>
            )}

            {/* Handle multi-city flights */}
            {flight?.flightType === "multi-city" && flight?.airlineDetails?.map((item, index) => (
                <Box key={index} sx={{ border: '1px solid black', borderRadius: '20px', marginTop: index !== 0 && '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="h4">{item?.from}</Typography>
                            <Typography level="title-sm" color="neutral">{formatDate(item?.departureTime)}</Typography>
                        </Box>

                        <Box>
                            <ArrowForwardIcon sx={{ fontSize: '30px' }} />
                        </Box>

                        <Box>
                            <Typography level="h4" sx={{ textAlign: 'right' }}>{item?.to}</Typography>
                            <Typography level="title-sm" color="neutral" sx={{ textAlign: 'right' }}>{formatDate(item?.arrivalTime)}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="h3">{extractTime(item?.departureTime)}</Typography>
                        </Box>

                        <Box>
                            <Typography level="title-md">{item?.duration}</Typography>
                        </Box>

                        <Box>
                            <Typography level="h3" sx={{ textAlign: 'right' }}>{extractTime(item?.arrivalTime)}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Airline</Typography>
                            <Typography level="title-lg">{item?.airlineCode}</Typography>
                        </Box>

                        <Box>
                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Flight Number</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{item?.flightNumber}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Aircraft</Typography>
                            <Typography level="title-lg">{item?.aircraft}</Typography>
                        </Box>

                        <Box>
                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Class</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{item?.class}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                        <Box>
                            <Typography level="title-sm">Stops</Typography>
                            <Typography level="title-lg">{item?.stops}</Typography>
                        </Box>

                        <Box>
                            <Typography level="title-sm" sx={{ textAlign: 'right' }}>Meals</Typography>
                            <Typography level="title-lg" sx={{ textAlign: 'right' }}>{item?.meals}</Typography>
                        </Box>
                    </Box>
                </Box>
            ))}

            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <Typography level="title-lg">Class :</Typography>
                <Typography level="title-lg" color="neutral" sx={{ marginLeft: '4px' }}>{flight?.brandedFare?.data?.[0]?.brandName ? flight?.brandedFare?.data?.[0]?.brandName : flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ? flight?.itineraries?.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin : 'N/A'}</Typography>
            </Box>

            {flight?.api === "sabre" && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <Typography level="title-lg">Available Seats :</Typography>
                    <Typography level="title-lg" color="neutral" sx={{ marginLeft: '4px' }}>{flight?.brandedFare?.data?.[0]?.totalSeats}</Typography>
                </Box>
            )}

            {flight?.api === "sabre" && (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <Typography level="title-lg">Feature :</Typography>
                    <Typography level="title-lg" color="neutral" sx={{ marginLeft: '4px' }}>{flight?.brandedFare?.data?.[0]?.brandFeatures?.[0]}</Typography>
                </Box>
            )}
        </>
    )
}

export default function FlightDetail({ state, setState, toggleDrawer, flight }) {
    console.log(flight)
    return (
        <React.Fragment>
            <Drawer
                // key={anchor}
                anchor="right"
                open={state}
                onClose={toggleDrawer(false)}
                size="lg"
            >
                <Header {...{ setState }} />
                <Tabs aria-label="Basic tabs" defaultValue={0}>
                    <TabList>
                        <Tab>Flight</Tab>
                        <Tab>Fare Summary</Tab>
                        <Tab>Baggage</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <FlightTab {...{ flight }} />
                    </TabPanel>
                    <TabPanel value={1}>
                        <FareSummary {...{ flight }} />
                    </TabPanel>
                    <TabPanel value={2}>
                        <BaggageInfo {...{ flight }} />
                    </TabPanel>
                </Tabs>
            </Drawer>
        </React.Fragment>
    );
}
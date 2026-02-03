import React, { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Button from "@mui/joy/Button";
import axios from "axios";
import { getTicketsByMonth } from "../../server/api";
import { Box, Typography, Select, MenuItem, Card, Option, Stack, Chip, IconButton } from '@mui/joy';
import B2bHeader from "../../components/utils/b2bHeader";
import { NavbarDivData } from "../../utils/DummyData";
import moment from "moment";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import ViewBooking from "../../components/Drawers/ViewBooking";

const BookingCard = ({ key, data, toggleDrawer }) => {
    function formatDate(dateStr) {
        // Create a Date object from the input string
        const date = new Date(dateStr);

        // Format the day as a two-digit number
        const day = String(date.getDate()).padStart(2, '0');

        // Array of abbreviated month names
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];

        // Extract last two digits of the year
        const year = date.getFullYear().toString().slice(-2);

        // Return the formatted date string
        return `${day} ${month}'${year}`;
    }

    function removeSecondsFromTime(time) {
        const parts = time.split(':');
        if (parts.length === 3) {
            return `${parts[0]}:${parts[1]}`; // return HH:MM only
        }
        return time; // already in HH:MM format
    }

    function checkFlightType() {
        const routes = data?.routes;

        if (!routes || routes.length === 0) return 'N/A';

        const firstRoute = routes[0];
        const lastRoute = routes[routes.length - 1];

        // Round Trip: 2 routes and destination of 1st equals origin of 2nd
        if (routes.length === 2 && firstRoute.to === lastRoute.from) {
            return 'Round Trip';
        }

        // One Way: origin ≠ final destination
        if (firstRoute.from !== lastRoute.to) {
            return 'One Way';
        }

        // Multi City: origin === final destination (but not a Round Trip)
        if (firstRoute.from === lastRoute.to) {
            return 'Multi City';
        }

        return 'N/A';
    }

    return (
        <Box
            key={key}
            onClick={toggleDrawer(true, data.pnr, data.gds)}
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: 2,
                maxWidth: 400,
                boxShadow: 'sm',
                backgroundColor: '#fff',
                cursor: 'pointer'
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <FlightTakeoffIcon fontSize="small" />
                <Typography level="body-sm">{formatDate(data?.routes?.[0]?.date)} | {data?.routes?.[0]?.time}</Typography>
            </Stack>

            <Typography level="body-md" fontWeight="lg">
                {data?.routes?.[0]?.from} → {data?.routes?.[data?.routes?.length - 1]?.to} <Typography level="body-sm" component="span" color="neutral">{checkFlightType()} | {formatDate(data?.routes?.[data?.routes?.length - 1]?.arrivalDate)} | {removeSecondsFromTime(data?.routes?.[data?.routes?.length - 1]?.arrivalTime)}</Typography>
            </Typography>

            <Box mt={1}>
                <Typography level="body-sm" fontWeight="md">
                    PNR.No : <Typography component="span" color="primary" fontWeight="lg">{data?.pnr}</Typography>
                </Typography>

                <Typography level="body-sm" mt={0.5}>
                    Status : <Chip sx={{ textTransform: "capitalize" }} color={['confirmed'].includes(data?.status) ? "success" : ['hold'].includes(data?.status) ? "warning" : "danger"} size="sm">{data?.status}</Chip>
                </Typography>
            </Box>

            <Typography level="body-sm" mt={1.5} fontWeight="md">
                {data?.travelerName} {data?.numberOfTravelers && `+${data?.numberOfTravelers}`}
            </Typography>
        </Box>
    );
};

const TravelCalendar = () => {
    const navigate = useNavigate();
    const cellRefs = useRef({});
    const currentYear = new Date().getFullYear();

    const [events, setEvents] = useState([]);
    const [state, setState] = useState(false);
    const [prevMonth, setPrevMonth] = useState();
    const [activeDiv, setActiveDiv] = useState(0);
    const [calendar, setCalendar] = useState(null);
    const [monthTotal, setMonthTotal] = useState(0);
    const [allBooking, setAllBooking] = useState([]);
    const [calendarKey, setCalendarKey] = useState(0);
    const [dailyCounts, setDailyCounts] = useState({});
    const [activeOption, setActiveOption] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredBooking, setFilteredBooking] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [pendingMonthYear, setPendingMonthYear] = useState(null);
    const [prevYear, setPrevYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [initialDate, setInitialDate] = useState(new Date(selectedYear, selectedMonth, 1));

    const handleYearChange = (event, newValue) => {
        setSelectedYear(parseInt(newValue));
    };

    const handleMonthChange = (event, newValue) => {
        setSelectedMonth(parseInt(newValue));
    };

    function checkMonthRange(startDate, endDate) {
        const startMonth = parseInt(startDate?.slice(5, 7), 10);
        const endMonth = parseInt(endDate?.slice(5, 7), 10);

        if (startMonth === 12 && endMonth === 1) {
            return { isTrue: true, value: 11 };
        }

        if (startMonth === 11 && endMonth === 1) {
            return { isTrue: true, value: 11 };
        }

        if (startMonth === 12 && endMonth === 2) {
            return { isTrue: true, value: 0 };
        }

        return { isTrue: false };
    }

    function filterByBookingDate(dataArray, targetDate) {
        return dataArray.filter(item => item.bookingDate === targetDate);
    }

    const handleSearch = async (newMonth, newYear) => {
        if (calendar && (selectedMonth !== null && selectedYear !== null)) {
            const year = newYear ? parseInt(newYear) : selectedYear;
            const month = (newMonth && typeof newMonth === 'number') || newMonth === 0 ? parseInt(newMonth) : selectedMonth;

            if (typeof year === 'number' && typeof month === 'number' && !Number.isNaN(year) &&
                !Number.isNaN(month) && calendar) {
                setInitialDate(new Date(year, month, 1));
                calendar.gotoDate(new Date(year, month, 1));
            } else {
                console.log('Invalid year or month', { year, month });
            }
        }

        try {
            const response = await getTicketsByMonth(parseInt(newMonth) || newMonth === 0 ? parseInt(newMonth) + 1 : selectedMonth + 1, parseInt(newYear) ? parseInt(newYear) : selectedYear);
            const data = response.result;

            setFilteredBooking([]);
            setSelectedDate(null);

            setMonthTotal(data.totalBookingsInMonth);
            setDailyCounts(data.totalBookingsPerDay);

            const eventUpdation = Object.entries(data.totalBookingsPerDay).map(([date, count]) => ({
                title: `${count} booking${count > 1 ? 's' : ''}`,
                date: date
            }));

            setEvents(eventUpdation);
            setAllBooking(data?.bookings);
            // setInitialDate(new Date(parseInt(newYear) ? parseInt(newYear) : selectedYear, parseInt(newMonth) || newMonth === 0 ? parseInt(newMonth) + 1 : selectedMonth + 1, 1))
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    // const handleSearch = async (newMonth, newYear) => {
    //     if (calendar && (selectedMonth !== null && selectedYear !== null)) {
    //         const year = newYear ? parseInt(newYear) : selectedYear;
    //         const month = (newMonth && typeof newMonth === 'number') || newMonth === 0 ? parseInt(newMonth) : selectedMonth;

    //         if (typeof year === 'number' && typeof month === 'number' && !Number.isNaN(year) &&
    //             !Number.isNaN(month) && calendar) {
    //             calendar.gotoDate(new Date(year, month, 1));
    //         } else {
    //             console.log('Invalid year or month', { year, month });
    //         }
    //     }

    //     try {
    //         const response = await getTicketsByMonth(parseInt(newMonth) || newMonth === 0 ? parseInt(newMonth) + 1 : selectedMonth + 1, parseInt(newYear) ? parseInt(newYear) : selectedYear);
    //         const data = response.result;

    //         // Only clear if it's a manual search (both newMonth and newYear are provided)
    //         // Don't clear when navigating months automatically
    //         const isManualSearch = (newMonth !== undefined && newMonth !== null) && (newYear !== undefined && newYear !== null);

    //         if (isManualSearch) {
    //             setFilteredBooking([]);
    //             setSelectedDate(null);
    //         }

    //         setMonthTotal(data.totalBookingsInMonth);
    //         setDailyCounts(data.totalBookingsPerDay);

    //         const eventUpdation = Object.entries(data.totalBookingsPerDay).map(([date, count]) => ({
    //             title: `${count} booking${count > 1 ? 's' : ''}`,
    //             date: date
    //         }));

    //         setEvents(eventUpdation);
    //         setAllBooking(data?.bookings);
    //     } catch (error) {
    //         console.error("Error fetching bookings:", error);
    //     }
    // };

    const toggleDrawer = (open, id, apiName) => async (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (!open) {
            setState(false);
            return;
        }

        setState({ value: open, id, api: apiName })
    };

    const handleDatesSet = (dateInfo) => {
        const newStart = new Date(dateInfo.end); // This is actually next month
        const rawMonth = newStart.getMonth();
        const rawYear = newStart.getFullYear();


        const customCheck = checkMonthRange(dateInfo?.startStr, dateInfo?.endStr);
        let currentMonth = customCheck?.isTrue ? customCheck?.value : rawMonth - 1;
        let currentYear = rawYear;

        // Handle December wrap-around
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear -= 1;
        }

        // Only update if month or year has changed
        if (currentMonth !== prevMonth || currentYear !== prevYear) {
            setPendingMonthYear({ month: currentMonth, year: currentMonth === 11 ? currentYear - 1 : currentYear });
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        setCalendarKey((prev) => prev + 1);
    }, [events]);

    useEffect(() => {
        if (selectedDate) {
            Object.entries(cellRefs.current).forEach(([date, el]) => {
                if (el) {
                    if (date === selectedDate) {
                        el.style.backgroundColor = '#B5CB13';
                        el.style.borderRadius = '6px';
                    } else {
                        el.style.backgroundColor = '';
                        el.style.borderRadius = '';
                    }
                }
            });

            const filteredData = filterByBookingDate(allBooking, selectedDate);
            setFilteredBooking(filteredData);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (!pendingMonthYear) return;

        const { month, year } = pendingMonthYear;

        handleSearch(month, year);
        setPrevMonth(month);
        setPrevYear(year);
        setInitialDate(new Date(year, month, 1));

        // Clear pending to prevent repeated trigger
        setPendingMonthYear(null);
    }, []); //pendingMonthYear

    useEffect(() => {

        const today = new Date();

        const formattedDate = moment(today)?.format('YYYY-MM-DD')

        const count = dailyCounts?.[formattedDate] || 0;

        if (count) {
            setSelectedDate(formattedDate)
        }
    }, [dailyCounts])

    return (
        <Box sx={{
            display: "flex", justifyContent: "center", flexDirection: "column", width: "100%",
            backgroundColor: "#ebebeb",
            height: "auto",
            paddingBottom: "100px"
        }}>
            <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} showDiv={false} />

            <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 4, padding: 4 }}>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        variant="plain"
                        sx={{ position: 'absolute', left: 0 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography level="h1" sx={{ fontWeight: 'bold', fontSize: '2xl', color: 'text.primary' }}>
                        Travel Calendar
                    </Typography>
                </Box>

                {/* Dropdowns and Search */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mb: 4 }}>
                    <Box>
                        <Select
                            defaultValue={selectedYear}
                            onChange={handleYearChange}
                            label="Year"
                            sx={{
                                width: 120,
                                paddingY: 2,
                                fontSize: 'lg',
                                borderRadius: 'xl',
                                boxShadow: 'md',
                                '&:hover': { borderColor: 'primary.main' },
                            }}
                        >
                            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </Box>
                    <Box>
                        <Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            sx={{
                                width: 200,
                                paddingY: 2,
                                fontSize: 'lg',
                                borderRadius: 'xl',
                                boxShadow: 'md',
                                '&:hover': { borderColor: 'primary.main' },
                            }}
                        >
                            {Array.from({ length: 12 }, (_, index) => (
                                <Option key={index} value={index}>
                                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                </Option>
                            ))}
                        </Select>
                    </Box>
                    <Button
                        variant="solid"
                        color="primary"
                        size="lg"
                        onClick={handleSearch}
                        sx={{
                            height: '48px',
                            fontWeight: '600',
                            borderRadius: '10px',
                            boxShadow: 'lg',
                        }}
                    >
                        Search
                    </Button>
                </Box>

                {/* Total Bookings This Month Display */}
                <Typography level="body1" sx={{ textAlign: 'center', fontSize: 'lg', fontWeight: 'semibold', color: 'indigo.700', mb: 4 }}>
                    Total Bookings This Month: {monthTotal}
                </Typography>

                {/* Full Calendar */}
                <FullCalendar
                    key={calendarKey}
                    initialDate={initialDate}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    height="auto"
                    ref={(el) => setCalendar(el ? el.getApi() : null)}
                    buttonText={{ today: 'Today' }}
                    headerToolbar={{
                        left: 'title',
                        center: '',
                        right: ''
                    }}
                    dateClick={(info) => {
                        const clickedDate = info.dateStr;
                        const count = dailyCounts[clickedDate] || 0;

                        if (count) {
                            setSelectedDate(clickedDate);
                            setCalendarKey(calendarKey + 1);
                        }
                    }}
                    dayCellDidMount={(arg) => {
                        const date = moment(arg.date).format('YYYY-MM-DD');
                        const count = dailyCounts[date] || 0;

                        if (count) {
                            arg.el.style.cursor = 'pointer';

                            if (selectedDate) {
                                cellRefs.current[date] = arg.el;
                            }

                            if (date === selectedDate) {
                                arg.el.style.backgroundColor = '#B5CB13';
                                arg.el.style.borderRadius = '6px';
                            }

                            arg.el.addEventListener('mouseenter', () => {
                                arg.el.style.backgroundColor = '#B5CB13';
                            });

                            arg.el.addEventListener('mouseleave', () => {
                                if (date !== selectedDate) {
                                    arg.el.style.backgroundColor = '';
                                }
                            });
                        }
                    }}
                    dayCellContent={(arg) => {
                        const date = moment(arg.date).format('YYYY-MM-DD');
                        const count = dailyCounts[date] || 0;

                        return (
                            <Box
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    padding: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography
                                        sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                        }}
                                    >
                                        {arg.dayNumberText}
                                    </Typography>
                                </Box>

                                {count > 0 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: '4px',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                backgroundColor: '#FCD34D',
                                                color: '#4C1D95',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                borderRadius: '9999px',
                                                padding: '2px 8px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {count}
                                        </Box>
                                        <Box sx={{ fontSize: '1rem' }}>
                                            <span role="img" aria-label="flight">✈️</span>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        );
                    }}
                    datesSet={handleDatesSet}
                />

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        justifyContent: 'flex-start',
                    }}
                >
                    {filteredBooking && filteredBooking?.map((item, index) => (
                        <BookingCard key={index} data={item} toggleDrawer={toggleDrawer} />
                    ))}
                </Box>
            </Card>

            {state?.value && (
                <ViewBooking {...{ state: state?.value, setState, toggleDrawer, id: state?.id, api: state?.api }} />
            )}
        </Box>
    );
};

export default TravelCalendar;
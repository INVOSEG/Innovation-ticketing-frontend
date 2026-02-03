import { createContext, useContext, useState } from "react";

export const TicketFilterContext = createContext();

export const TicketFilterProvider = ({ children }) => {
    const [tripType, setTripType] = useState("One Way");
    const [adultsCount, setAdultsCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [infantsCount, setInfantsCount] = useState(0);
    const [flightTickets, setFlightTickets] = useState([]);
    const [departureCity, setDepartureCity] = useState(null);
    const [arrivalCity, setArrivalCity] = useState(null);
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [flightStops, setFlightStops] = useState(false);
    const [flightPriceRange, setFlightPriceRange] = useState(null);
    const [ticketCount, setTicketCount] = useState(null);
    const [ticketClass, setTicketClass] = useState(null);
    const [airLinePreference, setAirLinePreference] = useState(null);
    const [currencyPreference, setCurrencyPreference] = useState("PKR");
    const [multicityFlights, setMulticityFlights] = useState([
        {
            from: { code: 'LHE', name: 'Lahore' },
            to: { code: 'JED', name: 'King Abdulaziz International' },
            depart: new Date(),
        },
        {
            from: { code: 'JED', name: 'King Abdulaziz International' },
            to: { code: '', name: 'Select a City' },
            depart: new Date(),
        },
    ]);
    const [selectedArCode, setSelectedArCode] = useState(null);
    const [markupPreference, setMarkupPreference] = useState('Amount');
    const [markupvalue, setMarkupValue] = useState('');
    const [directFlight, setDirectFlight] = useState(false);
    const [nearByAirport, setNearByAirport] = useState(true);
    const [onwardClass, setOnwardClass] = useState('Economy');
    const [returnClass, setReturnClass] = useState('Economy');
    const [gdsSelection, setGdsSelection] = useState('Sabre');
    const [departDate, setDepartDate] = useState(new Date());
    const [toLocation, setToLocation] = useState({
        code: 'JED',
        name: 'King Abdulaziz International',
        flag: 'KSA'
    });
    const [fromLocation, setFromLocation] = useState({
        code: 'LHE',
        name: 'Lahore',
        flag: 'PK'
    });
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
    const [selectedAirlines, setSelectedAirlines] = useState([])


    function resetFilters() {
        setFlightStops(false);
        setFlightPriceRange(null);
        setTicketCount(null)
        setTicketClass(null);
        setAirLinePreference(null)
        setCurrencyPreference("PKR")
        setSelectedArCode(null);
        setMarkupPreference('Amount');
        setMarkupValue('');
        // setOnwardClass("Economy");
        // setReturnClass("Economy");
        // setDirectFlight(false);
        // setNearByAirport(true);
    }

    function resetFiltersState() {
        setTripType("One Way");
        setAdultsCount(1);
        setChildrenCount(0);
        setInfantsCount(0);
        setFlightTickets([]);
        setDepartureCity(null);
        setArrivalCity(null);
        setDepartureDate(new Date());
        setDepartDate(new Date());
        setReturnDate(new Date());
        setFlightStops(false);
        setFlightPriceRange(null);
        setTicketCount(null);
        setTicketClass(null);
        setAirLinePreference(null);
        setCurrencyPreference("PKR");
        // setMulticityFlights([{ departureCity: null, arrivalCity: null, departureDate: null }]);
        setSelectedArCode(null);
        setMarkupPreference('Amount');
        setMarkupValue('');
        setDirectFlight(false);
        setNearByAirport(true);
        // setOnwardClass("Economy");
        // setReturnClass("Economy");
    }

    return (
        <TicketFilterContext.Provider
            value={{
                tripType, setTripType,
                adultsCount, setAdultsCount,
                childrenCount, setChildrenCount,
                infantsCount, setInfantsCount,
                flightTickets, setFlightTickets,
                departureCity, setDepartureCity,
                arrivalCity, setArrivalCity,
                departureDate, setDepartureDate,
                returnDate, setReturnDate,
                flightStops, setFlightStops,
                flightPriceRange, setFlightPriceRange,
                ticketCount, setTicketCount,
                ticketClass, setTicketClass,
                airLinePreference, setAirLinePreference,
                currencyPreference, setCurrencyPreference,
                multicityFlights, setMulticityFlights,
                selectedArCode, setSelectedArCode,
                markupPreference, setMarkupPreference,
                markupvalue, setMarkupValue,
                directFlight, setDirectFlight,
                nearByAirport, setNearByAirport,
                onwardClass, setOnwardClass,
                returnClass, setReturnClass,
                toLocation, setToLocation,
                fromLocation, setFromLocation,
                departDate, setDepartDate,
                isAlreadyAdded, setIsAlreadyAdded,
                gdsSelection, setGdsSelection,
                selectedAirlines, setSelectedAirlines,

                resetFilters, resetFiltersState
            }}
        >
            {children}
        </TicketFilterContext.Provider>
    );
};

export function useTicketFilterValues() {
    return useContext(TicketFilterContext);
}
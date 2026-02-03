import React from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchSelect from "../../components/common/SearchSelect";
import AppDatePicker from "../../components/common/AppDatePicker";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useTicketFilterValues } from "../../context/ticketFilterValues";

const MulticityFlights = ({ loadCityOptions, isFlightData }) => {
  const { setMulticityFlights, multicityFlights } = useTicketFilterValues()

  const handleCityChange = (selectedOption, name, index) => {
    const updatedFlights = multicityFlights.map((flight, i) => {
      if (i === index) {
        return { ...flight, [name]: selectedOption };
      }
      return flight;
    });
    setMulticityFlights(updatedFlights)
  };

  const handleDateChange = (selectedDate, index) => {
    const updatedFlights = multicityFlights.map((flight, i) => {
      if (i === index) {
        return { ...flight, departureDate: selectedDate };
      }
      return flight;
    });
    setMulticityFlights(updatedFlights)
  };

  const addFlight = () => {
    setMulticityFlights([...multicityFlights, { departureCity: multicityFlights[multicityFlights?.length - 1]?.arrivalCity, arrivalCity: null, departureDate: null }])
  };

  const removeFlight = (index) => {
    const updatedFlights = multicityFlights.filter((_, i) => i !== index);
    setMulticityFlights(updatedFlights)
  };

  return (
    <Box>
      {isFlightData ? (
        <>
          {multicityFlights.map((flight, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                alignItems: "end",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <p style={{ marginRight: '5px' }}>Departure</p>
                  <FlightTakeoffIcon sx={{ fontSize: '20px', color: 'goldenrod' }} />
                </Box>
                <SearchSelect
                  placeholder="i.e. JFK"
                  onChange={(selectedOption, name) => handleCityChange(selectedOption, name, index)}
                  _name="departureCity"
                  loadOptions={loadCityOptions}
                  value={flight.departureCity}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <p style={{ marginRight: '5px' }}>Arrival</p>
                  <FlightLandIcon sx={{ fontSize: '20px', color: 'goldenrod' }} />
                </Box>
                <SearchSelect
                  placeholder="i.e. LON"
                  onChange={(selectedOption, name) => handleCityChange(selectedOption, name, index)}
                  _name="arrivalCity"
                  loadOptions={loadCityOptions}
                  value={flight.arrivalCity}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <p style={{ marginRight: '5px' }}>Departure Date</p>
                  <CalendarMonthIcon sx={{ fontSize: '20px', color: 'goldenrod' }} />
                </Box>
                <AppDatePicker
                  // zIndex="99999"
                  size="lg"
                  startDecorator={<FlightTakeoffIcon />}
                  placeholder="Select Date"
                  name={`departureDate-${index}`}
                  date={flight.departureDate}
                  handleChange={(date) => handleDateChange(date, index)}
                  minDate={index > 0 ? multicityFlights[index - 1].departureDate : new Date()}
                />
              </Box>
              {index > 0 && (
                <IconButton onClick={() => removeFlight(index)} color="danger">
                  <DeleteIcon />
                </IconButton>
              )}
              {index === 0 && (
                <IconButton >
                  {/* <DeleteIcon /> */}
                </IconButton>
              )}
            </Box>
          ))}
          {multicityFlights.length < 5 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <IconButton onClick={addFlight} color="primary">
                <AddIcon /> Add Another Flight
              </IconButton>
            </Box>
          )}
        </>
      ) : (
        <>
          {multicityFlights.map((flight, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                alignItems: "end",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <SearchSelect
                  placeholder="Departure"
                  onChange={(selectedOption, name) => handleCityChange(selectedOption, name, index)}
                  _name="departureCity"
                  loadOptions={loadCityOptions}
                  value={flight.departureCity}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SearchSelect
                  placeholder="Arrival"
                  onChange={(selectedOption, name) => handleCityChange(selectedOption, name, index)}
                  _name="arrivalCity"
                  loadOptions={loadCityOptions}
                  value={flight.arrivalCity}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <AppDatePicker
                  // zIndex="99999"
                  size="lg"
                  startDecorator={<FlightTakeoffIcon />}
                  placeholder="Departure Date"
                  name={`departureDate-${index}`}
                  date={flight.departureDate}
                  handleChange={(date) => handleDateChange(date, index)}
                  minDate={index > 0 ? multicityFlights[index - 1].departureDate : new Date()}
                />
              </Box>
              {index > 0 && (
                <IconButton onClick={() => removeFlight(index)} color="danger">
                  <DeleteIcon />
                </IconButton>
              )}
              {index === 0 && (
                <IconButton >
                  {/* <DeleteIcon /> */}
                </IconButton>
              )}
            </Box>
          ))}
          {multicityFlights.length < 5 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <IconButton onClick={addFlight} color="primary">
                <AddIcon /> Add Another Flight
              </IconButton>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default MulticityFlights;
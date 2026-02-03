import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from '@mui/joy';
import { FormControlLabel, CardHeader } from '@mui/material';

const FlightSearchForm = () => {
  const [tripType, setTripType] = React.useState('oneWay');
  const [from, setFrom] = React.useState('Muscat');
  const [to, setTo] = React.useState('Dubai');
  const [departDate, setDepartDate] = React.useState('24 Mar 2025');
  const [returnDate, setReturnDate] = React.useState('');
  const [airlineOptions, setAirlineOptions] = React.useState({
    allAirlines: true,
    lowCostAirlines: true,
    gdsAirlines: true,
  });
  const [directFlight, setDirectFlight] = React.useState(false);
  const [nearbyAirports, setNearbyAirports] = React.useState(true);
  const [passengers, setPassengers] = React.useState(1);
  const [cabinClass, setCabinClass] = React.useState('first');

  const handleTripTypeChange = (event) => {
    setTripType(event?.target.value);
  };

  const handleAirlineOptionChange = (event) => {
    setAirlineOptions({
      ...airlineOptions,
      [event?.target.name]: event?.target.checked,
    });
  };

  const handleDirectFlightChange = (event) => {
    setDirectFlight(event?.target.checked);
  };

  const handleNearbyAirportsChange = (event) => {
    setNearbyAirports(event?.target.checked);
  };

  const handlePassengersChange = (event) => {
    setPassengers(event?.target.value);
  };

  const handleCabinClassChange = (event) => {
    setCabinClass(event?.target.value);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        p: 2,
        borderRadius: 'sm',
        boxShadow: 'lg',
      }}
    >
      <CardHeader
        title="Search Flights"
        // titleTypographyProps={{ fontSize: 'xl', fontWeight: 'lg' }}
        action={
          <Stack direction="row" alignItems="center" gap={1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="red"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <Typography color="danger" fontSize="sm">
              HOW TO USE PORTAL
            </Typography>
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a.55 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Stack>
        }
      />

      <FormControl sx={{ my: 2 }}>
        <RadioGroup
          row
          value={tripType}
          onChange={handleTripTypeChange}
          sx={{ gap: 2 }}
        >
          <FormControlLabel
            value="oneWay"
            control={<Radio size="sm" color="success" />}
            label="One Way"
            labelPlacement="end"
            sx={{ typography: 'bodyxs' }}
          />
          <FormControlLabel
            value="roundTrip"
            control={<Radio size="sm" color="neutral" />}
            label="Round Trip"
            labelPlacement="end"
            sx={{ typography: 'bodyxs' }}
          />
          <FormControlLabel
            value="multiCity"
            control={<Radio size="sm" color="neutral" />}
            label="Multi City"
            labelPlacement="end"
            sx={{ typography: 'bodyxs' }}
          />
        </RadioGroup>
      </FormControl>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          p: 1,
          bgcolor: 'background.surface',
          borderRadius: 'sm',
        }}
      >
        <Box>
          <Typography fontSize="xs" color="text.tertiary" sx={{ mb: 0.5 }}>
            FROM
          </Typography>
          <Typography fontSize="lg" fontWeight="md" sx={{ mb: 0.5 }}>
            {from}
          </Typography>
          <Typography fontSize="xs" color="text.tertiary">
            [MCT] Muscat International Air...
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </Box>

        <Box>
          <Typography fontSize="xs" color="text.tertiary" sx={{ mb: 0.5 }}>
            TO
          </Typography>
          <Typography fontSize="lg" fontWeightmd="" sx={{ mb: 0.5 }}>
            {to}
          </Typography>
          <Typography fontSize="xs" color="text.tertiary">
            [DXB] Dubai International Airport
          </Typography>
        </Box>

        <Box>
          <Typography fontSize="xs" color="text.tertiary" sx={{ mb: 0.5 }}>
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            DEPART
          </Typography>
          <Typography fontSize="lg" fontWeight="md" sx={{ mb: 0.5 }}>
            {departDate}
          </Typography>
          <Typography fontSize="xs" color="text.tertiary">
            Monday
          </Typography>
        </Box>

        <Box>
          <Typography fontSize="xs" color="text.tertiary" sx={{ mb: 0.5 }}>
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
            RETURN
          </Typography>
          <Typography fontSize="lg" fontWeight="md" sx={{ mb: 0.5 }}>
            {returnDate || 'Select Return Date'}
          </Typography>
          <Typography fontSize="xs" color="text.tertiary">
            Book a round trip
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography fontSize="xs" color="text.tertiary" sx={{ mb: 0.5 }}>
          Airline Preference
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            size="sm"
            color={airlineOptions.allAirlines ? 'success' : 'neutral'}
            variant="outlined"
            label="All Airlines"
            onClick={() => setAirlineOptions({ ...airlineOptions, allAirlines: !airlineOptions.allAirlines })}
          />
          <Chip
            size="sm"
            color="success"

            label="Low Cost Airlines"
            onClick={() => setAirlineOptions({ ...airlineOptions, lowCostAirlines: !airlineOptions.lowCostAirlines })}
          />
          <Chip
            size="sm"
            color="success"
            variant="outlined"
            label="GDS Airlines"
            onClick={() => setAirlineOptions({ ...airlineOptions, gdsAirlines: !airlineOptions.gdsAirlines })}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Checkbox
          size="sm"
          color="neutral"
          checked={directFlight}
          onChange={handleDirectFlightChange}
        />
        <Typography fontSize="xs">Direct Flight</Typography>
        <Checkbox
          size="sm"
          color="success"
          checked={nearbyAirports}
          onChange={handleNearbyAirportsChange}
        />
        <Typography fontSize="xs">Nearby Airports</Typography>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography fontSize="xs" color="text.tertiary">
            Travellers
          </Typography>
          <Select
            size="sm"
            value={passengers}
            onChange={handlePassengersChange}
            sx={{ width: 120 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
              <MenuItem key={p} value={p}>
                {p} Passenger{p > 1 ? 's' : ''}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          <Typography fontSize="xs" color="text.tertiary">
            Onward Cabin Class
          </Typography>
          <Select
            size="sm"
            value={cabinClass}
            onChange={handleCabinClassChange}
            sx={{ width: 150 }}
          >
            <MenuItem value="first">First Class</MenuItem>
            <MenuItem value="business">Business Class</MenuItem>
            <MenuItem value="economy">Economy Class</MenuItem>
          </Select>
        </Box>

        <Box>
          <Button
            variant="solid"
            color="success"
            sx={{ px: 4, height: '100%' }}
          >
            Search Flights
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default FlightSearchForm;
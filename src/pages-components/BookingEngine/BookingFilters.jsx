import * as React from 'react';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/joy/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';
import Switch from '@mui/joy/Switch';
import Stack from '@mui/joy/Stack';
import Input from "@mui/joy/Input"
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import ListItemContent from '@mui/joy/ListItemContent';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import Slider from '@mui/joy/Slider';
import PaidIcon from '@mui/icons-material/Paid';
import { Box, Button, Checkbox, Radio, RadioGroup } from '@mui/joy';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Airlines, Currencies, TravelOptions } from '../../components/utils/constants';
import AirlinesIcon from '@mui/icons-material/Airlines';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import AddCardIcon from '@mui/icons-material/AddCard';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InputField from '../../components/common/InputField';
import { useTicketFilterValues } from '../../context/ticketFilterValues';

const markupCheckboxData = [
  { id: 1, value: 'whole', title: 'Amount' },
  { id: 2, value: 'percentage', title: 'Percentage' },
]

export default function BookingFilters({ refetchData, allTickets }) {
  const dispatch = useDispatch();
  const { flightStops, setFlightStops, flightPriceRange, setFlightPriceRange,
    ticketCount, setTicketCount,
    ticketClass, setTicketClass,
    airLinePreference, setAirLinePreference,
    currencyPreference, setCurrencyPreference,
    markupPreference, setMarkupPreference,
    markupvalue, setMarkupValue,
    selectedArCode, setSelectedArCode,
    resetFilters } = useTicketFilterValues()

  const handleStopsChange = (event, newValue) => {
    setFlightStops(newValue)

    setTimeout(() => {
      refetchData(null, null, true, newValue, ticketClass, airLinePreference, currencyPreference);
    }, 2000);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setFlightPriceRange(newValue)
    setTimeout(() => {
      refetchData(null, null, true, flightStops, ticketClass, airLinePreference, currencyPreference);
    }, 500);
  };

  const handleTicketCountChange = (event, newValue) => {
    setTicketCount(newValue)
    setTimeout(() => {
      refetchData(null, null, true, flightStops, ticketClass, airLinePreference, currencyPreference)
    }, 500);
  };

  const handleTravelClassChange = (event) => {
    setTicketClass(event.target.value)
    setTimeout(() => {
      refetchData(null, null, true, flightStops, event.target.value, airLinePreference, currencyPreference);
    }, 500);
  };

  const handleMarkupPreferencesChange = (event) => {
    setMarkupPreference(event.target.value)
  }

  const handleResetFilters = () => {
    resetFilters()
    refetchData(null, null, true, null, null, null, null)
  };


  const [selectedAirlines, setSelectedAirlines] = React.useState([]);

  // ... other handler functions remain the same

  const handleAirlinePreferenceChange = (event) => {
    const { value, checked } = event.target;
    let airlineString2
    setSelectedAirlines(prevSelected => {
      let newSelected;
      if (checked) {
        newSelected = [...prevSelected, value];
      } else {
        newSelected = prevSelected.filter(airline => airline !== value);
      }

      // Dispatch the comma-separated string of airline codes
      const airlineString = newSelected.join(',');
      airlineString2 = airlineString
      setAirLinePreference(airlineString)

      return newSelected;
    });

    setTimeout(() => {
      refetchData(null, null, true, flightStops, ticketClass, airlineString2, currencyPreference)
    }, 500);
  };
  const handleCurrencyChange = (event) => {
    setCurrencyPreference(event.target.value)

    setTimeout(() => {
      refetchData(null, null, true, flightStops, ticketClass, airLinePreference, event.target.value)
    }, 500);
  };

  const handleCalculateMarkup = () => {
    refetchData(markupvalue, markupPreference, true, flightStops, ticketClass, airLinePreference, currencyPreference)
  }

  return (
    <Box
      sx={{
        width: "20%",

        backgroundColor: "white",
        borderRadius: 1.2,

        display: {
          xs: 'none',
          sm: 'none',
          md: 'none',
          lg: 'block',
          xl: 'block',
        },
      }}

    >
      <AccordionGroup
        variant="plain"
        transition="0.2s"
        sx={{
          // height: '100%',
          border: '1px solid #CCD6E0',

          borderRadius: 'md',
          [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]: {
            paddingBlock: '1rem',
          },
          [`& .${accordionSummaryClasses.button}`]: {
            paddingBlock: '1rem',
          },
        }}
      >

        <Accordion>
          <AccordionSummary indicator={false} onClick={handleResetFilters}>
            <Avatar color="danger">
              <RestartAltIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Reset</Typography>
              {/* <Typography level="body-sm">Reset all your filters</Typography> */}
            </ListItemContent>
          </AccordionSummary>
          {/* <AccordionDetails>
          <Stack spacing={1.5}>
            <FormControl orientation="horizontal" sx={{ gap: 1 }}>
              <AirlineStopsIcon fontSize="xl2" sx={{ mx: 1 }} />
              <FormLabel>Non Stop</FormLabel>
              <Switch size="md" onChange={handleStopsChange} checked={flightStops} />
            </FormControl>
          </Stack>
        </AccordionDetails> */}
        </Accordion>



        <Accordion expanded>
          <AccordionSummary>
            <Avatar color="primary">
              <AirplanemodeActiveIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Stops</Typography>
              {/* <Typography level="body-sm">Select stops from here</Typography> */}
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            {/* <Stack spacing={1.5}>
              <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                <AirlineStopsIcon fontSize="xl2" sx={{ mx: 1 }} />
                <FormLabel>Non Stop</FormLabel>
                <Switch size="md" onChange={handleStopsChange} checked={flightStops} />
              </FormControl>
            </Stack> */}
            {flightStops && <InputField value={flightStops} width="5rem" />}
            <Slider max={5} min={1} onChange={handleStopsChange} valueLabelDisplay="auto" value={flightStops} />
          </AccordionDetails>
        </Accordion>

        {/* <Accordion expanded>
          <AccordionSummary>
            <Avatar color="warning">
              <LocalActivityOutlinedIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Ticket Count</Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              <FormControl sx={{ gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'end', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <ConfirmationNumberOutlinedIcon fontSize="xl2" />
                    <FormLabel sx={{ m: 0 }}>Count</FormLabel></Box>
                  <Box>
                    {ticketCount && <InputField value={ticketCount} width="5rem" />}
                  </Box>

                </Box>
                <Slider max={250} min={1} onChange={handleTicketCountChange} valueLabelDisplay="auto" value={ticketCount} />
              </FormControl>
            </Stack>
          </AccordionDetails>
        </Accordion> */}

        {/* <Accordion expanded>
          <AccordionSummary>
            <Avatar color="success">
              <RequestQuoteIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Price Range</Typography>
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              <FormControl sx={{ gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'end', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <PaidIcon fontSize="xl2" />
                    <FormLabel sx={{ m: 0 }}>Range</FormLabel></Box>
                  <Box>
                    {flightPriceRange && <InputField value={flightPriceRange} width="5rem" />}
                  </Box>
                </Box>
                <Slider max={100000} min={50} onChange={handlePriceRangeChange} valueLabelDisplay="auto" value={flightPriceRange} />
              </FormControl>
            </Stack>
          </AccordionDetails>
        </Accordion> */}

        <Accordion expanded>
          <AccordionSummary>
            <Avatar color="danger">
              <AccessibilityNewRoundedIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Travel Class</Typography>
              {/* <Typography level="body-sm">Toggle your travel class settings</Typography> */}
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup name="accessibility-options" defaultValue="economy" onChange={handleTravelClassChange} value={ticketClass}>
              <Stack>
                {TravelOptions.map((option) => (
                  <FormControl key={option.value} orientation="horizontal" sx={{ gap: 1, mx: 2 }}>
                    {/* <AirlinesIcon fontSize="xl2" sx={{ mx: 1 }} /> */}
                    <Radio value={option.value} size="sm" />
                    <FormLabel>{option.label}</FormLabel>
                  </FormControl>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded>
          <AccordionSummary>
            <Avatar color="warning">
              <AirplaneTicketIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Airlines</Typography>
              {/* <Typography level="body-sm">Toggle your travel line settings</Typography> */}
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup name="airline-preferences"  >
              <Stack>
                {allTickets?.map((option) => (
                  <FormControl key={option.arCode} orientation="horizontal" sx={{ gap: 1, mx: 2 }}>
                    {/* <ConnectingAirportsIcon fontSize="xl2" sx={{ mx: 1 }} /> */}
                    <Checkbox value={option.arAbbreviation} size="sm" onChange={handleAirlinePreferenceChange} checked={typeof airLinePreference === 'string' && airLinePreference.split(',').includes(option.arAbbreviation)} />
                    <FormLabel>{option.arCode}</FormLabel>
                  </FormControl>
                ))}
              </Stack>
            </RadioGroup>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded>
          <AccordionSummary>
            <Avatar color="warning">
              <AddCardIcon />
            </Avatar>
            <ListItemContent>
              <Typography level="title-md">Markup</Typography>
              {/* <Typography level="body-sm">Toggle your markup settings</Typography> */}
            </ListItemContent>
          </AccordionSummary>
          <AccordionDetails>
            <Typography level="p" sx={{ textDecoration: 'underline', mb: 1 }}>Add Markup By:</Typography>
            <RadioGroup name="currency-options" onChange={handleMarkupPreferencesChange} value={markupPreference} defaultValue={markupPreference} >
              <Stack display={'flex'} flexDirection={"row"} justifyContent={'space-between'}>
                {markupCheckboxData?.map(item => (
                  <FormControl key={item.id} orientation="horizontal" sx={{ gap: 1, mb: 1 }}>
                    <Radio value={item.value} size="sm" />
                    <FormLabel>{item.title}</FormLabel>
                  </FormControl>
                ))}
              </Stack>
            </RadioGroup>
            <Stack display={'flex'} flexDirection={"row"}>
              <Input placeholder={markupPreference === 'whole' ? 'i.e. 200' : 'i.e. 3'} type="number" value={markupvalue} onChange={(e) => { setMarkupValue(e.target.value) }} />
              <Button onClick={() => { handleCalculateMarkup() }}>Calculate</Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </Box>
  );
}

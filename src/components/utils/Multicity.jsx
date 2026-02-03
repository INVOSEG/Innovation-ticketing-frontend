import { Box, Button, Input, List, ListItem, Typography } from '@mui/joy';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import DatePicker from './DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import { searchCityCode } from '../../server/api';
import { useSnackbar } from 'notistack';

const Multicity = ({ flightSegments, setFlightSegments, activeDropdown, setActiveDropdown, searchTerms, setSearchTerms, setMulticityFlights }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [locations, setLocations] = useState([
    { code: 'LHE', name: 'Lahore' },
    { code: 'KWI', name: 'Kuwait International Airport' },
    { code: 'RUH', name: 'Riyadh International Airport' },
    { code: 'CAI', name: 'Cairo International Airport' },
    { code: 'DXB', name: 'Dubai International Airport' },
  ])

  const formatDate = (date) => {
    const day = date?.getDate();
    const month = date?.toLocaleString('default', { month: 'short' });
    const year = date?.getFullYear();
    return `${day} ${month}'${year.toString().slice(-2)}`;
  };

  const formatDayOfWeek = (date) => {
    return date?.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleLocationSelect = (location, type, index) => {
    const updateCascadingLocations = (prevSegments) => {
      const updatedSegments = [...prevSegments];
      updatedSegments[index][type] = location;

      // City Cascading: If 'to' changes, update the next segment's 'from'
      if (type === 'to' && index + 1 < updatedSegments.length) {
        updatedSegments[index + 1].from = location;
      }
      return updatedSegments;
    };

    setFlightSegments(updateCascadingLocations);
    setMulticityFlights(updateCascadingLocations);
    setActiveDropdown({ type: null, index: null });
  };

  const handleDateSelect = (date, index) => {
    const updateCascadingDates = (prevSegments) => {
      const updatedSegments = prevSegments.map(segment => ({ ...segment }));
      updatedSegments[index].depart = date;

      for (let i = index + 1; i < updatedSegments.length; i++) {
        updatedSegments[i].depart = new Date(updatedSegments[i - 1].depart.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
      return updatedSegments;
    };

    setFlightSegments(updateCascadingDates);
    setMulticityFlights(updateCascadingDates);
    setActiveDropdown({ type: null, index: null });
  };

  const addFlightSegment = () => {
    if (flightSegments.length < 5) {
      const lastSegment = flightSegments[flightSegments.length - 1];

      if (!lastSegment?.to?.code) {
        enqueueSnackbar("Please select Arrival City first", {
          variant: "warning",
        });
        return;
      }
      setFlightSegments([
        ...flightSegments,
        {
          from: lastSegment.to,
          to: { code: '', name: 'Select a City' },
          depart: new Date(lastSegment.depart.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      ]);
      setMulticityFlights([
        ...flightSegments,
        {
          from: lastSegment.to,
          to: { code: '', name: 'Select a City' },
          depart: new Date(lastSegment.depart.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      ]);
    }
  };

  const removeFlightSegment = (index) => {
    setFlightSegments((prev) => prev.filter((_, i) => i !== index));
    setMulticityFlights((prev) => prev.filter((_, i) => i !== index));
  };

  const getFilteredLocations = (type, index) => {
    const searchTerm = searchTerms[`${type}-${index}`] || '';
    return locations.filter((location) =>
      location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const loadCityOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await searchCityCode(inputValue);
      const res = response.result.map((city) => ({
        code: city.id,
        name: city.name,
      }));
      setLocations(res);
    } catch (error) {
      console.error("Error fetching city options:", error);
      return [];
    }
  }, []);

  const dropdownRefs = useRef(Object.create(null));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown.type) {
        const refKey = `${activeDropdown.type}-${activeDropdown.index}`;
        if (dropdownRefs.current[refKey] && !dropdownRefs.current[refKey].contains(e.target)) {
          setActiveDropdown({ type: null, index: null });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  console.log('flightSegments', flightSegments)

  return (
    <>
      {flightSegments.map((segment, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            gap: 1,
            bgcolor: 'background.surface',
            width: '98%',
            borderRadius: 'sm',
            height: '100px',
            mt: 1,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: '60%',
              display: 'flex',
              borderRadius: 'lg',
              border: '1px solid lightgrey',
              p: 1,
            }}
          >
            <Box
              sx={{ width: '45%' }}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown.type === 'from' && activeDropdown.index === index
                    ? { type: null, index: null }
                    : { type: 'from', index }
                )
              }
            >
              <Typography color="text.tertiary" sx={{ mb: 0.5, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                FROM
              </Typography>
              <Typography fontSize="24px" fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "18px", md: "21px", lg: "24px" } }}>
                {segment?.from?.code || 'Select'}
              </Typography>
              <Typography fontSize="12px" color="text.tertiary" sx={{ fontSize: { sm: "9px", md: "11px", lg: "12px" }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {segment?.from?.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '2%',
                borderRight: '1px solid lightgrey',
              }}
            ></Box>

            <Box
              sx={{ width: '45%', pl: '20px' }}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown.type === 'to' && activeDropdown.index === index
                    ? { type: null, index: null }
                    : { type: 'to', index }
                )
              }
            >
              <Typography fontSize="16px" color="text.tertiary" sx={{ mb: 0.5, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
                TO
              </Typography>
              <Typography fontSize="24px" fontWeight="700" sx={{ mb: 0., fontSize: { sm: "18px", md: "21px", lg: "24px" } }}>
                {segment?.to?.code || 'Select'}
              </Typography>
              <Typography color="text.tertiary" sx={{ fontSize: { sm: "9px", md: "11px", lg: "12px" }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {segment?.to?.name || ''}
              </Typography>
            </Box>

            {activeDropdown.type === 'from' && activeDropdown.index === index && (
              <Box
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current[`from-${index}`] = el;
                  }
                }}
                sx={{
                  position: 'absolute',
                  top: '120px',
                  left: '0',
                  zIndex: 1000,
                  width: 300,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: 'sm',
                  bgcolor: 'background.body',
                  p: 2,
                }}
              >
                <Input
                  placeholder="Search From..."
                  value={searchTerms[`from-${index}`] || ''}
                  onChange={(e) => {
                    loadCityOptions(e.target.value)
                    const newSearchTerms = { ...searchTerms };
                    newSearchTerms[`from-${index}`] = e.target.value;
                    setSearchTerms(newSearchTerms);
                  }}
                  sx={{ mb: 1 }}
                />
                <Typography level="h4" sx={{ mb: 2 }}>
                  Select Departure Location
                </Typography>
                <List>
                  {getFilteredLocations('from', index).map((location) => (
                    <ListItem
                      key={location?.code}
                      onClick={() => handleLocationSelect(location, 'from', index)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'neutral.100' } }}
                    >
                      <Typography>{location?.code}</Typography>
                      <Typography level="body2" sx={{ ml: 1 }}>
                        {location?.name}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {activeDropdown.type === 'to' && activeDropdown.index === index && (
              <Box
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current[`to-${index}`] = el;
                  }
                }}
                sx={{
                  position: 'absolute',
                  top: '120px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  width: 300,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderRadius: 'sm',
                  bgcolor: 'background.body',
                  p: 2,
                }}
              >
                <Typography level="h4" sx={{ mb: 2 }}>
                  Select Destination Location
                </Typography>
                <Input
                  placeholder="Search To..."
                  value={searchTerms[`to-${index}`] || ''}
                  onChange={(e) => {
                    loadCityOptions(e.target.value)
                    const newSearchTerms = { ...searchTerms };
                    newSearchTerms[`to-${index}`] = e.target.value;
                    setSearchTerms(newSearchTerms);
                  }}
                  sx={{ mb: 1 }}
                />
                <List>
                  {getFilteredLocations('to', index).map((location) => (
                    <ListItem
                      key={location.code}
                      onClick={() => handleLocationSelect(location, 'to', index)}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'neutral.100' } }}
                    >
                      <Typography>{location.code}</Typography>
                      <Typography level="body2" sx={{ ml: 1 }}>
                        {location.name}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: '40%',
              display: 'flex',
              borderRadius: 'lg',
              border: '1px solid lightgrey',
              p: 1,
              position: 'relative',
            }}
          >
            <Box
              sx={{ width: '50%' }}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown.type === 'depart' && activeDropdown.index === index
                    ? { type: null, index: null }
                    : { type: 'depart', index }
                )
              }
            >
              <Typography
                color="text.tertiary"
                sx={{ mb: 0.5, display: 'flex', alignItems: 'center', fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
              >
                DEPART
              </Typography>
              <Typography fontSize="24px" fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "16px", md: "18px", lg: "22px" } }}>
                {formatDate(segment?.depart)}
              </Typography>
              <Typography fontSize="14px" color="text.tertiary" sx={{ fontSize: { sm: "9px", md: "12px", lg: "14px" } }}>
                {formatDayOfWeek(segment?.depart)}
              </Typography>
            </Box>

            {/* <Box sx={{ width: '50%', pl: '10px' }}>
              <Typography
                color="text.tertiary"
                sx={{ mb: 0.5, display: 'flex', alignItems: 'center', fontSize: { sm: "12px", md: "14px", lg: "16px" } }}
              >
                TRAVEL CLASS
              </Typography>
              <Typography fontSize="24px" fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "14px", md: "16px", lg: "24px" } }}>
                ECONOMY
              </Typography>
            </Box> */}

            {activeDropdown.type === 'depart' && activeDropdown.index === index && (
              <DatePicker
                isOpen={activeDropdown.type === 'depart' && activeDropdown.index === index}
                onClose={() => setActiveDropdown({ type: null, index: null })}
                onDateSelect={(date) => handleDateSelect(date, index)}
                selectedDate={segment.depart}
                title="Select Departure Date"
                openDatePicker={true}
                minDate={new Date()}
              />
            )}

            {flightSegments.length > 1 && (
              <DeleteIcon
                onClick={() => removeFlightSegment(index)}
                sx={{
                  cursor: 'pointer',
                  width: { sm: "20px", md: "30px", lg: "50px" },
                  height: { sm: "10px", md: "15px", lg: "30px" },
                  position: 'absolute',
                  top: { sm: "40%", md: "40%", lg: "40%" },
                  right: 0,
                  transform: 'translateY(-50%)',
                }}
              />
            )}
          </Box>
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {flightSegments.length < 5 && (
          <Button
            onClick={addFlightSegment}
            sx={{
              backgroundColor: '#036bb0',
              color: 'white',
              width: { sm: "100px", md: '120px', lg: '120px' },
              height: { sm: "20px", md: '25px', lg: '30px' },
              borderRadius: '20px',
              border: 'none',
              fontSize: { sm: '14px', md: "16px", lg: '18px' },
              fontWeight: '400',
              marginRight: '20px',
              my: '8px',
            }}
          >
            Add More
          </Button>
        )}
      </Box>
    </>
  );
};

export default Multicity;
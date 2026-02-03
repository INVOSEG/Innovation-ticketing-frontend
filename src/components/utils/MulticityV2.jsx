import { Box, Button, Input, List, ListItem, Typography } from '@mui/joy';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LocationDropdown from './LocationDropdown';
import DatePicker from './DatePicker';
import { searchCityCode } from '../../server/api';

const MulticityV2 = ({ flightSegments, setFlightSegments, multicityFlights, setMulticityFlights }) => {
  const [locations, setLocations] = useState([
    { code: 'LHE', name: 'Lahore' },
    { code: 'KWI', name: 'Kuwait International Airport' },
    { code: 'RUH', name: 'Riyadh International Airport' },
    { code: 'CAI', name: 'Cairo International Airport' },
    { code: 'DXB', name: 'Dubai International Airport' },
  ]);

  const [activeDropdown, setActiveDropdown] = useState({ type: null, index: null });
  const [isDepartOpen, setIsDepartOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState({});

  const formatDate = (date) => {
    const day = date?.getDate();
    const month = date?.toLocaleString('default', { month: 'short' });
    const year = date?.getFullYear();
    return `${day} ${month}'${year.toString().slice(-2)}`;
  };

  const formatDayOfWeek = (date) => {
    return date?.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const loadCityOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      // Replace with your actual API call
      const response = await searchCityCode(inputValue);
      const res = response.result.map((city) => ({
        code: city.id,
        name: city.name,
      }));
      console.log("RES", res)
      setLocations(res);
    } catch (error) {
      console.error("Error fetching city options:", error);
      return [];
    }
  }, []);

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
      const updatedSegments = prevSegments.map((segment) => ({ ...segment }));
      updatedSegments[index].depart = date;

      for (let i = index + 1; i < updatedSegments.length; i++) {
        updatedSegments[i].depart = new Date(
          updatedSegments[i - 1].depart.getTime() + 7 * 24 * 60 * 60 * 1000
        );
      }
      return updatedSegments;
    };

    setFlightSegments(updateCascadingDates);
    setMulticityFlights(updateCascadingDates);
    setIsDatePickerOpen((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const addFlightSegment = () => {
    if (multicityFlights.length < 5) {
      const lastSegment = multicityFlights[multicityFlights.length - 1];
      setFlightSegments([
        ...multicityFlights,
        {
          from: lastSegment.to,
          to: { code: '', name: 'Select a City' },
          depart: new Date(lastSegment.depart.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      ]);
      setMulticityFlights([
        ...multicityFlights,
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

  const dropdownRefs = useRef(Object.create(null));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown.type) {
        const refKey = `${activeDropdown.type}-${activeDropdown.index}`;
        if (dropdownRefs.current[refKey] && !dropdownRefs.current[refKey].contains(e.target)) {
          setActiveDropdown({ type: null, index: null });
        }
      }
      // if (isDatePickerOpen && !e.target.closest('.DatePicker')) {
      //   setIsDatePickerOpen(false);
      // }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, isDatePickerOpen]);

  return (
    <Box>
      {multicityFlights.map((segment, index) => (
        <Box
          key={index}
          sx={{
            border: "1px solid lightgrey",
            borderRadius: "15px",
            height: "50px",
            display: "flex",
            width: "90%",
            my: 1,
            position: 'relative',
            mx: 'auto'
          }}
        >
          {/* FROM Container */}
          <Box
            sx={{
              width: "30%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: 'center',
              pl: 1.5,
              cursor: index === 0 ? 'default' : 'pointer'
            }}
            onClick={() =>
              setActiveDropdown(
                activeDropdown.type === 'from' && activeDropdown.index === index
                  ? { type: null, index: null }
                  : { type: 'from', index }
              )
            }
          >
            <Typography sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" }, fontWeight: "700" }}>
              {segment.from.code}
            </Typography>
            <Typography sx={{ fontSize: { sm: "11px", md: "12px", lg: "14px" } }}>
              {segment.from.name}
            </Typography>
          </Box>

          {/* TO Container */}
          <Box
            sx={{
              width: "30%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: 'center',
              pl: 1.5,
              borderLeft: "1px solid lightgrey",
              cursor: index === 0 ? 'default' : 'pointer'
            }}
            onClick={() =>
              setActiveDropdown(
                activeDropdown.type === 'to' && activeDropdown.index === index
                  ? { type: null, index: null }
                  : { type: 'to', index }
              )
            }
          >
            <Typography sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" }, fontWeight: "700" }}>
              {segment.to.code}
            </Typography>
            <Typography sx={{ fontSize: { sm: "11px", md: "12px", lg: "14px" } }}>
              {segment.to.name}
            </Typography>
          </Box>

          {/* Depart Section */}
          <Box
            sx={{
              width: "30%",
              height: "100%",
              borderLeft: "1px solid lightgrey",
              display: "flex",
              flexDirection: "column",
              justifyContent: 'center',
              pl: 1.5,
              cursor: 'pointer',

            }}
            onClick={() =>
              setIsDatePickerOpen(prev => ({
                ...prev,
                [index]: !prev[index]
              }))
            }
          >
            <Typography color="text.tertiary" sx={{ display: 'flex', alignItems: 'center', fontSize: { sm: "11px", md: "12px", lg: "14px" } }}>
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
              {' DEPART'}
            </Typography>
            <Typography fontWeight="700" sx={{ mb: 0.5, fontSize: { sm: "12px", md: "14px", lg: "16px" } }}>
              {formatDate(segment?.depart)} {formatDayOfWeek(segment?.depart)}
            </Typography>
          </Box>

          {flightSegments.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                zIndex: 10
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeFlightSegment(index);
              }}
            >
              <HighlightOffIcon sx={{ color: 'error.main' }} />
            </Box>
          )}

          {/* <Box
            sx={{
              width: "31%",
              height: "100%",
              borderLeft: "1px solid lightgrey",
              display: "flex",
              flexDirection: "row",
              alignItems: 'center',
              px: 1.5,
              justifyContent: "space-between",
              cursor: 'pointer'
            }}
          >
            <Box>
              <Typography sx={{ fontSize: { sm: "11px", md: "12px", lg: "14px" } }}>
                TRAVEL CLASS
              </Typography>
              <Typography sx={{ fontSize: { sm: "12px", md: "14px", lg: "16px" }, fontWeight: "700" }}>
                {segment.travelClass || "ECONOMY"}
              </Typography>
            </Box>
            {flightSegments.length > 2 && (
              <HighlightOffIcon
                sx={{ width: "20px", height: "20px", cursor: 'pointer' }}
                onClick={() => removeFlightSegment(index)}
              />
            )}
          </Box> */}

          {/* FROM Location Dropdown */}
          {activeDropdown.type === 'from' && activeDropdown.index === index && (
            <Box
              ref={(el) => {
                if (el) {
                  dropdownRefs.current[`from-${index}`] = el;
                }
              }}
              sx={{
                position: 'absolute',
                top: '40px',
                left: '7.5%',
                zIndex: 1000,
                width: 340,
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
                    key={location.code}
                    onClick={() => handleLocationSelect(location, 'from', index)}
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

          {/* TO Location Dropdown */}
          {activeDropdown.type === 'to' && activeDropdown.index === index && (
            <Box
              ref={(el) => {
                if (el) {
                  dropdownRefs.current[`to-${index}`] = el;
                }
              }}
              sx={{
                position: 'absolute',
                top: '40px',
                left: '27%',
                zIndex: 1000,
                width: 340,
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
                  console.log('Loading city options for:', e.target.value);
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

          {/* Depart Date Picker */}
          {isDatePickerOpen[index] && (
            <DatePicker
              isOpen={isDatePickerOpen[index]}
              onClose={() => {
                setIsDatePickerOpen(prev => ({
                  ...prev,
                  [index]: false
                }));
              }}
              onDateSelect={(date) => handleDateSelect(date, index)}
              selectedDate={segment.depart}
              title="Select Departure Date"
              page="search flight"
              tripTypeCategory="Multi City"
              onChange={(e) => {
                e.stopPropagation()
              }}
            />
          )}
        </Box>
      ))}

      {flightSegments.length < 5 && (
        <Button
          sx={{
            backgroundColor: "#036bb0",
            color: "white",
            width: { sm: "110px", md: "130px", lg: "150px" },
            height: { xs: "25px", lg: "45px" },
            borderRadius: "10px",
            border: "none",
            fontSize: { sm: "12px", md: "14px", lg: "18px" },
            fontWeight: "400",
            marginRight: "20px",
            mb: 1
          }}
          onClick={addFlightSegment}
        >
          Add Flight
        </Button>
      )}
    </Box>
  );
};

export default MulticityV2;
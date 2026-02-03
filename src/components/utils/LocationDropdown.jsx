import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Sheet,
  Divider,
  Input
} from '@mui/joy';
import { searchCityCode } from '../../server/api';

const LocationDropdown = ({
  isOpen,
  onClose,
  onLocationSelect,
  anchorEl,
  title,
  initialLocation,
  type,
  index,
  segmentIndex,
  page,
  tripTypeCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([
    { code: 'LHE', name: 'Lahore' },
    { code: 'KWI', name: 'Kuwait International Airport' },
    { code: 'RUH', name: 'Riyadh International Airport' },
    { code: 'CAI', name: 'Cairo International Airport' }
  ]);

  const handleSearch = (e) => {
    loadCityOptions(e.target.value);
    setSearchQuery(e.target.value);
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

  const handleLocationSelect = (location, type, segmentIndex) => {
    onLocationSelect(location, type, segmentIndex);
    onClose();
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: 'absolute',
        top: `${anchorEl?.clientHeight}px`,
        left: page === "search flight" && tripTypeCategory === "Multi City" ? "18%" :
          page === "search flight" ? "12.5%" : type === "to" ? "21%" :
            "0%",
        top: page === "search flight" && tripTypeCategory === "Multi City" ? "40%" : page === "search flight" ? "28%" : "50%",
        zIndex: 1000,
        width: 300,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: 'sm',
        bgcolor: 'background.body',
        p: 2
      }}
    >
      <Typography level="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Input
        placeholder="Search locations..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        fullWidth
      />
      <List>
        {locations.map((location) => (
          <ListItem sx={{ cursor: "pointer", '&:hover': { bgcolor: 'neutral.100' } }} key={location.code} onClick={() => handleLocationSelect(location, type, segmentIndex)}>
            <Typography>{location.code}</Typography>
            <Typography level="body2" sx={{ ml: 1 }}>
              {location.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LocationDropdown;
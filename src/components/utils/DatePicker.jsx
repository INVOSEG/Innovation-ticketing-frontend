import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  CalendarPicker,
  Sheet,
  IconButton
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import AppDatePicker from '../common/AppDatePicker';

const DatePicker = ({ isOpen, onClose, onDateSelect, selectedDate, title, icon, name, page, tripTypeCategory, onChange, openDatePicker, minDate }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const datePickerRef = useRef(null);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleDateChange = (newValue) => {
    setCurrentDate(newValue);
    onDateSelect(newValue, name);
    onClose()
  };

  if (!isOpen) return null;

  return (
    <Box
      onChange={onChange}
      ref={datePickerRef}
      sx={{
        position: 'absolute',
        top: page === "search flight" && tripTypeCategory === "Multi City" ? "40%" : page === "search flight" ? "28%" : '50%',
        right: page === "search flight" && tripTypeCategory === "Multi City" ? "34%" : page === "search flight" ? "38.5%" : 0,
        zIndex: 1000,
        mt: 1,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: 'sm',
        bgcolor: 'background.body',
        p: 2,
        width: page === "search flight" && tripTypeCategory === "Multi City" ? 340 : 300
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <AppDatePicker
          date={currentDate}
          handleChange={handleDateChange}
          datePickerRef={datePickerRef}
          openDatePicker={openDatePicker}
          minDate={minDate}
          slotProps={{
            textField: {
              readOnly: true,
            },

          }}
        />
        <IconButton variant="plain" color="neutral" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DatePicker;
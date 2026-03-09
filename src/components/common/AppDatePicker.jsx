import React from 'react';
import { FormControl, FormLabel, Input } from "@mui/joy";

import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';

// Safely convert any value (string, Date, null) to a Date object or null
const toDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const AppDatePicker = ({ label, size, placeholder, name, date, minDate, handleChange, zIndex, width, maxDate, disabled, onClick, datePickerRef, openDatePicker }) => {
  const safeDate = toDate(date);
  const safeMinDate = toDate(minDate);

  return (
    <FormControl size={size || "lg"} sx={{ zIndex: zIndex && zIndex }}>
      <FormLabel>{label}</FormLabel>

      <DatePicker
        value={safeDate}
        onChange={(selectedDate) => handleChange(selectedDate, name)}
        format="dd/MM/yyyy"
        placeholder={placeholder || "Choose a date"}
        size={size || 'lg'}
        editable={false}
        container={() => datePickerRef && datePickerRef?.current}
        placement="bottomEnd"
        cleanable={false}
        oneTap={true}
        block={false}
        open={openDatePicker}
        shouldDisableDate={(d) => {
          if (!safeMinDate) return false;
          const normalize = (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
          return normalize(d) < normalize(safeMinDate);
        }}
      />

    </FormControl>
  );
};

export default AppDatePicker;

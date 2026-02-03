import React from 'react';
import { FormControl, FormLabel, Input } from "@mui/joy";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite-no-reset.min.css';

const AppDatePicker = ({ label, size, placeholder, name, date, minDate, handleChange, zIndex, width, maxDate, disabled, onClick, datePickerRef, openDatePicker }) => {
  return (
    <FormControl size={size || "lg"} sx={{ zIndex: zIndex && zIndex }}>
      <FormLabel>{label}</FormLabel>
      {/* <DatePicker
        selected={date || new Date()}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(selectedDate) => handleChange(selectedDate, name)}
        placeholderText={placeholder}
        name={`date-${name}-${Math.random()}`}
        disabled={disabled}
        customInput={
          <Input
            size={size || "lg"}
            placeholder={placeholder || "Choose a date"}
            sx={{ height: size === "lg" ? '48px' : '30px', width: size === "sm" ? width : "auto" }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            readOnly
            inputProps={{
              "data-lpignore": "true", // Ignore LastPass autofill
              "data-form-type": "other" // Confuse browser autofill
            }}
          />
        }
        dateFormat="dd/MM/yyyy"
      /> */}

      <DatePicker
        value={date}
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
        shouldDisableDate={(date) => {
          if (!minDate) return false;
          // Disable if date is strictly before minDate (ignoring time if needed, but simple comparison often works for simple cases, 
          // usually we want to allow minDate itself. Rsuite date comparison might include time.)
          // Let's normalize to start of day for accurate comparison if minDate is provided.
          const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
          return normalizeDate(date) < normalizeDate(minDate);
        }}
      />



    </FormControl>
  );
};

export default AppDatePicker;
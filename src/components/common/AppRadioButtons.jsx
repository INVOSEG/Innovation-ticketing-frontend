import React, { useState } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';

const AppRadioButtons = ({ label, options, value, defaultValue, onChange, direction = 'row' }) => {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <RadioGroup
                name={`${label}-radio-group`}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                sx={{ flexDirection: direction, gap: 2 }}
            >
                {options.map((option) => (
                    <Radio key={option.value} value={option.value} label={option.label} sx={{ mt: 0 }} />
                ))}
            </RadioGroup>
        </FormControl>
    );
};
export default AppRadioButtons
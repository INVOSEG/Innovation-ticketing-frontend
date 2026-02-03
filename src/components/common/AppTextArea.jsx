import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Textarea from '@mui/joy/Textarea';

const AppTextArea = ({ label, placeholder, minRows, width, onChange, value, defaultValue, maxRows, name }) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Textarea name={name} placeholder={placeholder || "Write your text here"} minRows={minRows ? minRows : 3} sx={{ width: width ? width : "100%" }} onChange={onChange} value={value} defaultValue={defaultValue} maxRows={maxRows ? maxRows : 10} />
      {/* <FormHelperText>Write your text here.</FormHelperText> */}
    </FormControl>
  );
}
export default AppTextArea
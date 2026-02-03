import * as React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";

export default function InputField({
  label,
  placeholder,
  helpertext,
  size,
  width,
  error,
  defaultValue,
  onChange,
  type = "text", 
  value,
  ...props
}) {
  return (
    <FormControl size={size || "sm"}>
      <FormLabel>{label}</FormLabel>
      <Input
        value={value}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        error={error}
        sx={{
          ...(width && { width: width }), // Apply width only if it exists
        }}
        {...props}
      />
      {helpertext && <FormHelperText>{helpertext}</FormHelperText>}
    </FormControl>
  );
}

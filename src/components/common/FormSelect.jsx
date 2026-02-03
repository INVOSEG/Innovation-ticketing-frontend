import React, { useMemo, useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { IconButton, Input } from "@mui/joy";

const FormSelect = ({
  label,
  options = [],
  onChange,
  name,
  error,
  placeholder,
  startDecorator,
  size,
  defaultOption,
  disabled,
  value,
  searchable = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const isObjectArray =
    options.length > 0 &&
    typeof options[0] === "object" &&
    options[0].hasOwnProperty("id") &&
    options[0].hasOwnProperty("name");

  const defaultValue =
    isObjectArray && typeof defaultOption === "object"
      ? defaultOption?._id
      : defaultOption;

  const filteredOptions = useMemo(() => {
    return options.filter((option) => {
      const optionText = isObjectArray ? option.name : option;
      return optionText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, options, isObjectArray]);

  return (
    <FormControl size={size || "sm"} error={error}>
      <FormLabel>{label}</FormLabel>
      <Select
        size={size || "sm"}
        placeholder={placeholder || "Select"}
        onChange={(_, newValue) => {
          onChange({ target: { name, value: newValue } });
          // ❌ Don't clear searchTerm here
        }}
        startDecorator={startDecorator && <IconButton>{startDecorator}</IconButton>}
        defaultValue={defaultValue ?? ""}
        disabled={disabled}
        {...(value !== undefined && { value: value ?? "" })}
        slotProps={{
          listbox: {
            sx: { maxHeight: 300, overflow: "auto" }
          },
          root: {
            onKeyDown: (e) => {
              // ⛔ Prevent Joy Select from navigating with keyboard
              if (!e.target.closest('input')) {
                e.stopPropagation();
                e.preventDefault();
              }
            }
          }
        }}
      >
        {["nationality", "passportIssuanceCountry"].includes(name) && (
          <Input
            size="sm"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            sx={{ mx: 1, my: 1 }}
          />
        )}

        {filteredOptions.length === 0 ? (
          <Option disabled>No results found</Option>
        ) : (
          filteredOptions.map((option, index) => (
            <Option
              key={isObjectArray ? option.id : index}
              value={isObjectArray ? option.id : option}
            >
              {isObjectArray ? option.name : option}
            </Option>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default FormSelect;

import { useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { FORM_AUTOCOMPLETE_SLOT_PROPS } from "./formAutocompleteSlotProps";

const filterOptions = createFilterOptions({
  ignoreAccents: true,
  trim: true,
});

function dedupeOptions(options) {
  const seen = new Set();
  return options.filter((option) => {
    if (!option?.value || seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
}

/**
 * Autocomplete controlado (value = code/id string), sem fetch.
 */
export default function EntityAutocompleteField({ fieldKey, ...props }) {
  return <EntityAutocompleteFieldInner key={fieldKey ?? props.value} {...props} />;
}

function EntityAutocompleteFieldInner({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  fullWidth = true,
  loading = false,
  disabled = false,
  noOptionsText = "Nenhuma opção encontrada",
  options = [],
  valueLabel,
}) {
  const [typedValue, setTypedValue] = useState(null);

  const displayOptions = useMemo(() => {
    const deduped = dedupeOptions(options);
    if (value && valueLabel && !deduped.some((option) => option.value === value)) {
      return [{ value, label: valueLabel }, ...deduped];
    }
    return deduped;
  }, [options, value, valueLabel]);

  const selectedOption = useMemo(
    () => displayOptions.find((option) => option.value === value) ?? null,
    [displayOptions, value],
  );

  const inputValue =
    typedValue !== null ? typedValue : selectedOption?.label ?? "";

  const handleInputChange = (_event, newInputValue, reason) => {
    if (reason === "reset") {
      setTypedValue(null);
      return;
    }
    if (reason === "clear") {
      setTypedValue("");
      return;
    }
    setTypedValue(newInputValue);
    if (reason === "input" && value) {
      onChange("");
    }
  };

  return (
    <Autocomplete
      options={displayOptions}
      value={selectedOption}
      inputValue={inputValue}
      disabled={disabled}
      onInputChange={handleInputChange}
      loading={loading}
      onChange={(_event, option) => {
        onChange(option?.value ?? "");
        setTypedValue(null);
      }}
      onBlur={onBlur}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, current) => option.value === current.value}
      filterOptions={filterOptions}
      noOptionsText={noOptionsText}
      slotProps={FORM_AUTOCOMPLETE_SLOT_PROPS}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth={fullWidth}
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key ?? `${option.value}-${option.label}`} {...optionProps}>
            {option.label}
          </li>
        );
      }}
    />
  );
}

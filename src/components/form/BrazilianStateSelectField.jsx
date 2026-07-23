import { listBrazilianStates } from "../../services/brazilianStateService";
import { buildBrazilianStateOptions } from "../../utils/entitySelectOptions";
import EntityAutocompleteField from "./EntityAutocompleteField";
import { useEntitySelectOptions } from "./useEntitySelectOptions";

export default function BrazilianStateSelectField({
  label = "UF",
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  brazilianStates,
}) {
  const { options, loading } = useEntitySelectOptions({
    items: brazilianStates,
    loadItems: listBrazilianStates,
    mapOptions: buildBrazilianStateOptions,
  });

  return (
    <EntityAutocompleteField
      label={label}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      options={options}
      loading={loading}
      noOptionsText="Nenhuma UF encontrada"
    />
  );
}

import { listBrazilianStates } from "../../services/brazilianStateService";
import { buildBrazilianStateOptions } from "../../utils/entitySelectOptions";
import EntityAutocompleteField from "./EntityAutocompleteField";
import { useEntitySelectOptions } from "./useEntitySelectOptions";

/**
 * @typedef {import('../../services/brazilianStateService').BrazilianState} BrazilianState
 */

/**
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {() => void} [props.onBlur]
 * @param {boolean} [props.error]
 * @param {string} [props.helperText]
 * @param {boolean} [props.required]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.disabled]
 * @param {BrazilianState[]} [props.brazilianStates]
 */
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

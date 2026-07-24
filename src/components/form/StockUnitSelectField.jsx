import { listStockUnits } from "../../services/stockUnitService";
import EntityAutocompleteField from "./EntityAutocompleteField";
import { useEntitySelectOptions } from "./useEntitySelectOptions";

/**
 * @typedef {import('../../services/stockUnitService').StockUnit} StockUnit
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
 * @param {'small'|'medium'} [props.size]
 * @param {StockUnit[]} [props.stockUnits]
 */
export default function StockUnitSelectField({
  label = "Unidade",
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  size = "medium",
  stockUnits,
}) {
  const { options, loading } = useEntitySelectOptions({
    items: stockUnits,
    loadItems: listStockUnits,
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
      size={size}
      options={options}
      loading={loading}
      noOptionsText="Nenhuma unidade encontrada"
    />
  );
}

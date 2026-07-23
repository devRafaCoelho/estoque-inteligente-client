import { listStockUnits } from "../../services/stockUnitService";
import EntityAutocompleteField from "./EntityAutocompleteField";
import { useEntitySelectOptions } from "./useEntitySelectOptions";

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
      options={options}
      loading={loading}
      noOptionsText="Nenhuma unidade encontrada"
    />
  );
}

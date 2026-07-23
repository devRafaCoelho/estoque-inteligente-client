import { listProductCategories } from "../../services/productCategoryService";
import EntityAutocompleteField from "./EntityAutocompleteField";
import { useEntitySelectOptions } from "./useEntitySelectOptions";

export default function ProductCategorySelectField({
  label = "Categoria",
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  productCategories,
}) {
  const { options, loading } = useEntitySelectOptions({
    items: productCategories,
    loadItems: listProductCategories,
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
      noOptionsText="Nenhuma categoria encontrada"
    />
  );
}

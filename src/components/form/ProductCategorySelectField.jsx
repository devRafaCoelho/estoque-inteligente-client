import { listProductCategories } from "../../services/productCategoryService";
import EntityAutocompleteField from "./EntityAutocompleteField";
import { useEntitySelectOptions } from "./useEntitySelectOptions";

/**
 * @typedef {import('../../services/productCategoryService').ProductCategory} ProductCategory
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
 * @param {ProductCategory[]} [props.productCategories]
 */
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
  size = "medium",
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
      size={size}
      options={options}
      loading={loading}
      noOptionsText="Nenhuma categoria encontrada"
    />
  );
}

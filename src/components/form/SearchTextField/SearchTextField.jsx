import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { SEARCH_TEXT_FIELD_CONFIG } from "./searchTextFieldConfig";

/**
 * Campo de busca padronizado (ícone de lupa à esquerda).
 *
 * @param {import('@mui/material').TextFieldProps} props
 */
export default function SearchTextField({
  InputProps,
  size = SEARCH_TEXT_FIELD_CONFIG.defaultSize,
  ...props
}) {
  return (
    <TextField
      size={size}
      fullWidth
      {...props}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="action" />
          </InputAdornment>
        ),
        ...InputProps,
      }}
    />
  );
}

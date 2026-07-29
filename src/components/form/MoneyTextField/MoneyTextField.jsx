import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { moneyToDisplay, parseMoneyInput } from "../../../utils/moneyInput";
import { formOutlinedInputMinHeightSx } from "../../../styles/formStyles";
import { MONEY_TEXT_FIELD_CONFIG } from "./moneyTextFieldConfig";

/**
 * Campo monetário padronizado (máscara pt-BR por centavos + prefixo R$).
 * value/onChange trabalham com número em reais (ou "" quando vazio).
 *
 * @param {object} props
 * @param {number|string|null|undefined} props.value
 * @param {(next: number|"") => void} props.onChange
 * @param {string} [props.currencyAdornment]
 */
export default function MoneyTextField({
  value,
  onChange,
  currencyAdornment = MONEY_TEXT_FIELD_CONFIG.currencyAdornment,
  size = MONEY_TEXT_FIELD_CONFIG.defaultSize,
  fullWidth = true,
  sx,
  slotProps,
  InputProps,
  inputProps,
  ...props
}) {
  const mergedInputSlot = {
    ...InputProps,
    ...slotProps?.input,
  };

  return (
    <TextField
      {...props}
      size={size}
      fullWidth={fullWidth}
      value={moneyToDisplay(value)}
      onChange={(event) => onChange?.(parseMoneyInput(event.target.value))}
      sx={[formOutlinedInputMinHeightSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      slotProps={{
        ...slotProps,
        inputLabel: {
          shrink: true,
          ...slotProps?.inputLabel,
        },
        htmlInput: {
          inputMode: "numeric",
          autoComplete: "off",
          ...inputProps,
          ...slotProps?.htmlInput,
        },
        input: {
          ...mergedInputSlot,
          startAdornment:
            mergedInputSlot.startAdornment ?? (
              <InputAdornment position="start">{currencyAdornment}</InputAdornment>
            ),
        },
      }}
    />
  );
}

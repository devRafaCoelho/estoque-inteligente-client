import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { PASSWORD_TEXT_FIELD_CONFIG } from "./passwordTextFieldConfig";
import { PASSWORD_TEXT_FIELD_COPY } from "./passwordTextFieldCopy";

export default function PasswordTextField({
  label = PASSWORD_TEXT_FIELD_COPY.defaultLabel,
  error,
  helperText,
  registerProps,
  autoComplete = PASSWORD_TEXT_FIELD_CONFIG.defaultAutoComplete,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
      fullWidth
      autoComplete={autoComplete}
      error={Boolean(error)}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword
                  ? PASSWORD_TEXT_FIELD_COPY.hidePasswordAria
                  : PASSWORD_TEXT_FIELD_COPY.showPasswordAria
              }
              onClick={() => setShowPassword((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...registerProps}
      {...props}
    />
  );
}

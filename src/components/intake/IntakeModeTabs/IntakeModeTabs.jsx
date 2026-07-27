import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  INTAKE_MODE_TABS_CONFIG,
  INTAKE_MODE_TABS_COPY,
} from "./intakeModeTabsConfig";
import { intakeModeTabsGroupSx, intakeModeTabSx } from "./IntakeModeTabs.styled";

/**
 * Escolha Texto | Voz | Foto na entrada.
 * @param {{ value: string, onChange: (mode: string) => void, disabled?: boolean }} props
 */
export default function IntakeModeTabs({
  value = INTAKE_MODE_TABS_CONFIG.defaultMode,
  onChange,
  disabled = false,
}) {
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      size="small"
      color="primary"
      value={value}
      disabled={disabled}
      onChange={(_event, next) => {
        if (next != null) onChange?.(next);
      }}
      aria-label={INTAKE_MODE_TABS_COPY.groupAria}
      sx={intakeModeTabsGroupSx}
    >
      <ToggleButton value="text" sx={intakeModeTabSx}>
        {INTAKE_MODE_TABS_COPY.text}
      </ToggleButton>
      <ToggleButton value="voice" sx={intakeModeTabSx}>
        {INTAKE_MODE_TABS_COPY.voice}
      </ToggleButton>
      <ToggleButton value="photo" sx={intakeModeTabSx}>
        {INTAKE_MODE_TABS_COPY.photo}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

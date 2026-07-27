import SegmentedControl from "../../common/SegmentedControl/SegmentedControl";
import {
  INTAKE_MODE_TABS_CONFIG,
  INTAKE_MODE_TABS_COPY,
} from "./intakeModeTabsConfig";

/**
 * Escolha Texto | Voz | Foto na entrada (wrapper do SegmentedControl).
 * @param {{ value: string, onChange: (mode: string) => void, disabled?: boolean }} props
 */
export default function IntakeModeTabs({
  value = INTAKE_MODE_TABS_CONFIG.defaultMode,
  onChange,
  disabled = false,
}) {
  return (
    <SegmentedControl
      value={value}
      onChange={onChange}
      disabled={disabled}
      ariaLabel={INTAKE_MODE_TABS_COPY.groupAria}
      options={[
        { value: "text", label: INTAKE_MODE_TABS_COPY.text },
        { value: "voice", label: INTAKE_MODE_TABS_COPY.voice },
        { value: "photo", label: INTAKE_MODE_TABS_COPY.photo },
      ]}
    />
  );
}

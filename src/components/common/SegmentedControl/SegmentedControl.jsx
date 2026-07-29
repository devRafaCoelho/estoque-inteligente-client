import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { SEGMENTED_CONTROL_CONFIG } from "./segmentedControlConfig";
import {
  segmentedControlGroupSx,
  segmentedControlScrollSx,
  segmentedControlTrackSx,
  segmentedOptionSx,
} from "./SegmentedControl.styled";

function toInternal(value) {
  if (value === "" || value == null) {
    return SEGMENTED_CONTROL_CONFIG.emptySentinel;
  }
  return String(value);
}

function fromInternal(value, options) {
  if (value === SEGMENTED_CONTROL_CONFIG.emptySentinel) return "";
  const match = options.find((option) => String(option.value) === String(value));
  return match ? match.value : value;
}

/**
 * Controle segmentado reutilizável (track + opção selecionada em branco).
 * Em modo scrollable, o radius fica no frame externo (viewport), não no conteúdo.
 *
 * @param {{
 *   value: string | number,
 *   onChange: (next: string | number) => void,
 *   options: Array<{ value: string | number, label: string }>,
 *   ariaLabel?: string,
 *   disabled?: boolean,
 *   fullWidth?: boolean,
 *   scrollable?: boolean,
 * }} props
 */
export default function SegmentedControl({
  value,
  onChange,
  options = [],
  ariaLabel,
  disabled = false,
  fullWidth = true,
  scrollable = false,
}) {
  const selectedRef = useRef(null);
  const stretch = fullWidth && !scrollable;

  useEffect(() => {
    if (!scrollable || !selectedRef.current) return;
    selectedRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [value, scrollable]);

  return (
    <Box sx={scrollable ? segmentedControlScrollSx : undefined}>
      <ToggleButtonGroup
        exclusive
        fullWidth={stretch}
        size="small"
        color="primary"
        value={toInternal(value)}
        disabled={disabled}
        onChange={(_event, next) => {
          if (next == null) return;
          onChange?.(fromInternal(next, options));
        }}
        aria-label={ariaLabel}
        sx={segmentedControlGroupSx({ stretch, scrollable })}
      >
        {options.map((option) => {
          const internal = toInternal(option.value);
          const selected = toInternal(value) === internal;
          return (
            <ToggleButton
              key={String(option.value)}
              value={internal}
              ref={selected ? selectedRef : undefined}
              sx={segmentedOptionSx({ stretch, scrollable })}
            >
              {option.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}

export { segmentedControlTrackSx };

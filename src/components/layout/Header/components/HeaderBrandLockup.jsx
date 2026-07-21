import Box from "@mui/material/Box";
import brandIcon from "../../../../assets/brand-icon.png";
import brandWordmark from "../../../../assets/brand-wordmark.png";
import { HEADER_COPY } from "../headerCopy";
import {
  brandLockupIconSx,
  brandLockupRootSx,
  brandLockupWordmarkSx,
} from "../Header.styled";

/**
 * Lockup do header: ícone + wordmark na mesma altura
 * (proporção controlada via CSS, como na marcenaria).
 */
export default function HeaderBrandLockup({ onClick, centered = false, height }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={HEADER_COPY.logoAlt}
      sx={brandLockupRootSx(centered, height, Boolean(onClick))}
    >
      <Box component="img" src={brandIcon} alt="" sx={brandLockupIconSx} />
      <Box component="img" src={brandWordmark} alt="" sx={brandLockupWordmarkSx} />
    </Box>
  );
}

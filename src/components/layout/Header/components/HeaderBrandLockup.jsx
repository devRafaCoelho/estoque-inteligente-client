import Box from "@mui/material/Box";
import brandIcon from "../../../assets/brand-icon.png";
import brandWordmark from "../../../assets/brand-wordmark.png";
import { HEADER_COPY } from "./headerCopy";

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
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 1.25 },
        height: height ?? { xs: 44, sm: 52 },
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0,
        ...(centered
          ? {
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }
          : null),
      }}
    >
      <Box
        component="img"
        src={brandIcon}
        alt=""
        sx={{
          height: "100%",
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
      <Box
        component="img"
        src={brandWordmark}
        alt=""
        sx={{
          height: "100%",
          width: "auto",
          maxWidth: { xs: "46vw", sm: 200, md: 240 },
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  );
}

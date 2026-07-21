import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { desktopNavButtonSx, desktopNavRootSx } from "../Header.styled";

export default function HeaderDesktopNav({ items, isActive, onNavigate }) {
  return (
    <Box sx={desktopNavRootSx}>
      {items.map((item) => {
        const active = isActive(item.path);
        return (
          <Button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            sx={desktopNavButtonSx(active)}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}

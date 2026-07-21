import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import brandLogo from "../../../../assets/brand-logo.png";
import { HEADER_COPY } from "../headerCopy";
import { HEADER_PATHS } from "../headerConfig";
import {
  mobileDrawerHeaderSx,
  mobileDrawerItemIconSx,
  mobileDrawerItemSx,
  mobileDrawerListSx,
  mobileDrawerLogoSx,
  mobileDrawerPaperSx,
} from "../Header.styled";

export default function HeaderMobileDrawer({
  open,
  onClose,
  items,
  isActive,
  onNavigate,
}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: mobileDrawerPaperSx,
      }}
    >
      <Box sx={mobileDrawerHeaderSx}>
        <Box
          component="img"
          src={brandLogo}
          alt={HEADER_COPY.logoAlt}
          onClick={() => onNavigate(HEADER_PATHS.dashboard)}
          sx={mobileDrawerLogoSx}
        />
        <IconButton onClick={onClose} aria-label={HEADER_COPY.closeMenuAria}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={mobileDrawerListSx}>
        {items.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => onNavigate(item.path)}
              selected={active}
              sx={mobileDrawerItemSx}
            >
              {Icon ? (
                <ListItemIcon sx={mobileDrawerItemIconSx(active)}>
                  <Icon />
                </ListItemIcon>
              ) : null}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: active ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

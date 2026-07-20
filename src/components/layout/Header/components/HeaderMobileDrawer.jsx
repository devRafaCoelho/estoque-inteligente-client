import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import brandLogo from "../../../../assets/brand-logo.png";
import { HEADER_COPY, HEADER_PATHS } from "../headerCopy";

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
        sx: { width: 300, borderRadius: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="img"
          src={brandLogo}
          alt={HEADER_COPY.logoAlt}
          onClick={() => onNavigate(HEADER_PATHS.dashboard)}
          sx={{
            height: 36,
            width: "auto",
            maxWidth: 180,
            objectFit: "contain",
            display: "block",
            cursor: "pointer",
          }}
        />
        <IconButton onClick={onClose} aria-label={HEADER_COPY.closeMenuAria}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 1.5 }}>
        {items.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => onNavigate(item.path)}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(31,122,77,0.12)",
                  color: "primary.dark",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              {Icon ? (
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? "primary.main" : "text.secondary",
                  }}
                >
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

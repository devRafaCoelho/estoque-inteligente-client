import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { bottomNavItems, moreMenuItems } from "../../../config/navigation";
import { BOTTOM_NAV_COPY } from "./bottomNavCopy";
import {
  bottomNavActionLabelSx,
  bottomNavPaperSx,
  bottomNavProminentIconWrapSx,
  bottomNavSx,
  moreSheetHeaderSx,
  moreSheetListSx,
  moreSheetPaperSx,
} from "./BottomNav.styled";

function isPathActive(pathname, path) {
  if (!path) return false;
  if (path === "/dashboard") return pathname === "/dashboard";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const activeValue = useMemo(() => {
    const match = bottomNavItems.find(
      (item) => item.path && isPathActive(location.pathname, item.path),
    );
    if (match) return match.id;

    const inMore = moreMenuItems.some((item) =>
      isPathActive(location.pathname, item.path),
    );
    return inMore ? "more" : false;
  }, [location.pathname]);

  const handleChange = (_event, nextValue) => {
    const item = bottomNavItems.find((entry) => entry.id === nextValue);
    if (!item) return;
    if (item.action === "more") {
      setMoreOpen(true);
      return;
    }
    if (item.path) navigate(item.path);
  };

  const handleMoreNavigate = (path) => {
    setMoreOpen(false);
    navigate(path);
  };

  return (
    <>
      <Paper elevation={8} square sx={bottomNavPaperSx}>
        <BottomNavigation
          showLabels
          value={activeValue}
          onChange={handleChange}
          sx={bottomNavSx}
        >
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const selected = activeValue === item.id;
            return (
              <BottomNavigationAction
                key={item.id}
                value={item.id}
                label={item.label}
                sx={{
                  "& .MuiBottomNavigationAction-label": bottomNavActionLabelSx,
                }}
                icon={
                  item.prominent ? (
                    <Box sx={bottomNavProminentIconWrapSx(selected)}>
                      <Icon fontSize="small" />
                    </Box>
                  ) : (
                    <Icon />
                  )
                }
              />
            );
          })}
        </BottomNavigation>
      </Paper>

      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        PaperProps={{ sx: moreSheetPaperSx }}
      >
        <Box sx={moreSheetHeaderSx}>
          <Typography variant="subtitle1" fontWeight={800}>
            {BOTTOM_NAV_COPY.moreTitle}
          </Typography>
          <IconButton
            onClick={() => setMoreOpen(false)}
            aria-label={BOTTOM_NAV_COPY.closeAria}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={moreSheetListSx}>
          {moreMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isPathActive(location.pathname, item.path);
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => handleMoreNavigate(item.path)}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? "primary.main" : "inherit" }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}

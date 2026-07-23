import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  desktopNavButtonSx,
  desktopNavMenuItemIconSx,
  desktopNavMenuItemSx,
  desktopNavMenuPaperSx,
  desktopNavRootSx,
} from "../Header.styled";

/**
 * @param {Object} props
 * @param {Array<object>} props.items
 * @param {(path: string) => boolean} props.isActive
 * @param {(path: string) => void} props.onNavigate
 */
export default function HeaderDesktopNav({ items, isActive, onNavigate }) {
  const [menuAnchorById, setMenuAnchorById] = useState({});

  const openMenu = (id, anchor) => {
    setMenuAnchorById((prev) => ({ ...prev, [id]: anchor }));
  };

  const closeMenu = (id) => {
    setMenuAnchorById((prev) => ({ ...prev, [id]: null }));
  };

  const isGroupActive = (item) =>
    (item.children || []).some((child) => isActive(child.path));

  return (
    <Box sx={desktopNavRootSx}>
      {items.map((item) => {
        if (item.children?.length) {
          const menuId = `nav-menu-${item.id}`;
          const anchorEl = menuAnchorById[item.id] || null;
          const open = Boolean(anchorEl);
          const active = isGroupActive(item);

          return (
            <Box key={item.id}>
              <Button
                onClick={(event) => openMenu(item.id, event.currentTarget)}
                endIcon={<ArrowDropDownIcon />}
                sx={desktopNavButtonSx(active)}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                {item.label}
              </Button>
              <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={() => closeMenu(item.id)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: { sx: desktopNavMenuPaperSx },
                }}
              >
                {item.children.map((child) => {
                  const childActive = isActive(child.path);
                  const Icon = child.icon;
                  return (
                    <MenuItem
                      key={child.path}
                      selected={childActive}
                      onClick={() => {
                        closeMenu(item.id);
                        onNavigate(child.path);
                      }}
                      sx={desktopNavMenuItemSx(childActive)}
                    >
                      {Icon ? (
                        <ListItemIcon sx={desktopNavMenuItemIconSx(childActive)}>
                          <Icon fontSize="small" />
                        </ListItemIcon>
                      ) : null}
                      {child.label}
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          );
        }

        const active = isActive(item.path);
        return (
          <Button
            key={item.id || item.path}
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

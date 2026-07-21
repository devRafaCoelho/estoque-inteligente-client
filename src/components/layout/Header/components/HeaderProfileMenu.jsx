import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { HEADER_COPY } from "../headerCopy";
import {
  profileMenuItemSx,
  profileMenuLogoutItemSx,
  profileMenuPaperSx,
  profileMenuUserBoxSx,
} from "../Header.styled";

export default function HeaderProfileMenu({
  anchorEl,
  onClose,
  userDisplayName,
  userEmail,
  onMinhaConta,
  onLogout,
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        sx: profileMenuPaperSx,
      }}
    >
      <Box sx={profileMenuUserBoxSx}>
        <Typography variant="subtitle2" fontWeight={700}>
          {userDisplayName || HEADER_COPY.loadingUser}
        </Typography>
        {userEmail && (
          <Typography variant="caption" color="text.secondary">
            {userEmail}
          </Typography>
        )}
      </Box>
      <Divider />
      <MenuItem onClick={onMinhaConta} sx={profileMenuItemSx}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2">{HEADER_COPY.minhaConta}</Typography>
      </MenuItem>
      <MenuItem onClick={onLogout} sx={profileMenuLogoutItemSx}>
        <LogoutIcon fontSize="small" />
        <Typography variant="body2">{HEADER_COPY.sair}</Typography>
      </MenuItem>
    </Menu>
  );
}

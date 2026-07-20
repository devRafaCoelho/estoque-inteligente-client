import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { HEADER_COPY } from "../headerCopy";

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
        sx: {
          mt: 1,
          minWidth: 220,
          borderRadius: 2,
          boxShadow: "0 8px 30px rgba(15,61,40,0.18)",
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
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
      <MenuItem
        onClick={onMinhaConta}
        sx={{ gap: 1.5, py: 1.25 }}
      >
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2">{HEADER_COPY.minhaConta}</Typography>
      </MenuItem>
      <MenuItem
        onClick={onLogout}
        sx={{ gap: 1.5, py: 1.25, color: "error.main" }}
      >
        <LogoutIcon fontSize="small" />
        <Typography variant="body2">{HEADER_COPY.sair}</Typography>
      </MenuItem>
    </Menu>
  );
}

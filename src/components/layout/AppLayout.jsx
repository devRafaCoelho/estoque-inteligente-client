import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Header from "./Header/Header";

export default function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
      }}
    >
      <Header />
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 960,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

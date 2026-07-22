import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import BottomNav from "../BottomNav/BottomNav";
import Header from "../Header/Header";
import {
  appLayoutMainSx,
  appLayoutRootSx,
  appLayoutToolbarSx,
} from "./AppLayout.styled";

export default function AppLayout() {
  return (
    <Box sx={appLayoutRootSx}>
      <Header />
      <Toolbar sx={appLayoutToolbarSx} />
      <Box component="main" sx={appLayoutMainSx}>
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  );
}

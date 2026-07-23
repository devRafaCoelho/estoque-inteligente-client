import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

/**
 * Navegação do header desktop.
 * Alertas e Minha conta ficam só no menu do avatar.
 */
export const mainNavItems = [
  { id: "home", label: "Início", path: "/dashboard", icon: HomeOutlinedIcon },
  {
    id: "finance",
    label: "Financeiro",
    path: "/financeiro",
    icon: AccountBalanceWalletOutlinedIcon,
  },
  {
    id: "products",
    label: "Produtos",
    icon: Inventory2OutlinedIcon,
    children: [
      { label: "Estoque", path: "/produtos", icon: Inventory2OutlinedIcon },
      { label: "Entrada", path: "/entrada", icon: PlaylistAddOutlinedIcon },
      { label: "Baixa", path: "/baixa", icon: RemoveCircleOutlineIcon },
      {
        label: "Lista de compras",
        path: "/lista-compras",
        icon: ShoppingCartOutlinedIcon,
      },
    ],
  },
];

/** Bottom nav mobile — `intake` abre sheet; `more` abre menu adicional */
export const bottomNavItems = [
  { id: "home", label: "Início", path: "/dashboard", icon: HomeOutlinedIcon },
  { id: "products", label: "Produtos", path: "/produtos", icon: Inventory2OutlinedIcon },
  {
    id: "intake",
    label: "Entrada",
    path: null,
    icon: AddCircleOutlineIcon,
    prominent: true,
    action: "intake-menu",
  },
  {
    id: "list",
    label: "Lista",
    path: "/lista-compras",
    icon: ShoppingCartOutlinedIcon,
  },
  { id: "more", label: "Mais", path: null, icon: MoreHorizIcon, action: "more" },
];

/** Itens do sheet "Mais" no mobile (conta e alertas ficam no menu do avatar) */
export const moreMenuItems = [
  { label: "Baixa", path: "/baixa", icon: RemoveCircleOutlineIcon },
  {
    label: "Financeiro",
    path: "/financeiro",
    icon: AccountBalanceWalletOutlinedIcon,
  },
];

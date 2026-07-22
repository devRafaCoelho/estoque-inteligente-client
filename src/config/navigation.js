import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

/** Navegação do header desktop (conta fica no menu do avatar) */
export const mainNavItems = [
  { label: "Início", path: "/dashboard", icon: HomeOutlinedIcon },
  { label: "Produtos", path: "/produtos", icon: Inventory2OutlinedIcon },
  { label: "Entrada", path: "/entrada", icon: PlaylistAddOutlinedIcon },
  { label: "Lista", path: "/lista-compras", icon: ShoppingCartOutlinedIcon },
  { label: "Financeiro", path: "/financeiro", icon: AccountBalanceWalletOutlinedIcon },
  { label: "Baixa", path: "/baixa", icon: RemoveCircleOutlineIcon },
  { label: "Alertas", path: "/notificacoes", icon: NotificationsOutlinedIcon },
];

/** Bottom nav mobile — item `more` abre o menu adicional */
export const bottomNavItems = [
  { id: "home", label: "Início", path: "/dashboard", icon: HomeOutlinedIcon },
  { id: "products", label: "Produtos", path: "/produtos", icon: Inventory2OutlinedIcon },
  {
    id: "intake",
    label: "Entrada",
    path: "/entrada",
    icon: AddCircleOutlineIcon,
    prominent: true,
  },
  {
    id: "list",
    label: "Lista",
    path: "/lista-compras",
    icon: ShoppingCartOutlinedIcon,
  },
  { id: "more", label: "Mais", path: null, icon: MoreHorizIcon, action: "more" },
];

/** Itens do sheet "Mais" no mobile */
export const moreMenuItems = [
  { label: "Baixa", path: "/baixa", icon: RemoveCircleOutlineIcon },
  {
    label: "Financeiro",
    path: "/financeiro",
    icon: AccountBalanceWalletOutlinedIcon,
  },
  {
    label: "Alertas",
    path: "/notificacoes",
    icon: NotificationsOutlinedIcon,
  },
  { label: "Minha conta", path: "/minha-conta", icon: PersonOutlineIcon },
  {
    label: "Novo produto",
    path: "/produtos/novo",
    icon: AddCircleOutlineIcon,
  },
];

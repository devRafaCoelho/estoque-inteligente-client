import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

/** Navegação principal do header / drawer (conta fica no menu do avatar) */
export const mainNavItems = [
  { label: "Início", path: "/dashboard", icon: HomeOutlinedIcon },
  { label: "Entrada", path: "/entrada", icon: PlaylistAddOutlinedIcon },
  { label: "Baixa", path: "/baixa", icon: RemoveCircleOutlineIcon },
  { label: "Lista", path: "/lista-compras", icon: ShoppingCartOutlinedIcon },
  { label: "Alertas", path: "/notificacoes", icon: NotificationsOutlinedIcon },
  { label: "Produtos", path: "/produtos", icon: Inventory2OutlinedIcon },
  { label: "Novo produto", path: "/produtos/novo", icon: AddCircleOutlineIcon },
];

/** @deprecated use mainNavItems — mantido para compatibilidade pontual */
export const bottomNavItems = mainNavItems;

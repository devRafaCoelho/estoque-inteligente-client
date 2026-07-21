import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { productService } from "../../services/productService";
import ProductCard from "../../components/products/ProductCard";
import { useDebounce } from "../../hooks/useDebounce";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

export default function ProductListPage() {
  const navigate = useNavigate();
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await productService.list({
          search: debouncedSearch || undefined,
          status: status || undefined,
        });
        if (active) setProducts(data.products || []);
      } catch (err) {
        error(err instanceof ApiError ? err.message : "Erro ao listar produtos");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [debouncedSearch, status, error]);

  const emptyLabel = useMemo(() => {
    if (search || status) return "Nenhum produto encontrado com esses filtros.";
    return "Seu estoque ainda está vazio. Adicione o primeiro produto.";
  }, [search, status]);

  return (
    <Box sx={{ pb: 8 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Produtos</Typography>
        <TextField
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={status}
          onChange={(_e, value) => setStatus(value || "")}
          sx={{ flexWrap: "wrap" }}
        >
          <ToggleButton value="">Todos</ToggleButton>
          <ToggleButton value="ok">Ok</ToggleButton>
          <ToggleButton value="low">Acabando</ToggleButton>
          <ToggleButton value="out">Zerados</ToggleButton>
        </ToggleButtonGroup>

        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography color="text.secondary">{emptyLabel}</Typography>
        ) : (
          <Stack spacing={1.5}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Stack>
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ position: "fixed", right: 20, bottom: { xs: 88, md: 28 } }}>
        <Fab
          color="secondary"
          variant="extended"
          aria-label="Entrada por texto"
          onClick={() => navigate("/entrada")}
          sx={{ px: 2 }}
        >
          Entrada
        </Fab>
        <Fab
          color="primary"
          aria-label="Novo produto"
          onClick={() => navigate("/produtos/novo")}
        >
          <AddIcon />
        </Fab>
      </Stack>
    </Box>
  );
}

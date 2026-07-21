import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { productService } from "../services/productService";
import { useAuth } from "../hooks/useAuth";
import { useAppSnackbar } from "../hooks/useAppSnackbar";
import { ApiError } from "../services/apiClient";
import ProductCard from "../components/products/ProductCard";

function StatCard({ label, value, color }) {
  return (
    <Card sx={{ flex: 1, minWidth: 0 }}>
      <CardContent sx={{ py: 1.75, "&:last-child": { pb: 1.75 } }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ color, mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await productService.list();
        if (active) setProducts(data.products || []);
      } catch (err) {
        error(err instanceof ApiError ? err.message : "Erro ao carregar dashboard");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [error]);

  const ok = products.filter((p) => p.stockStatus === "ok").length;
  const low = products.filter((p) => p.stockStatus === "low").length;
  const out = products.filter((p) => p.stockStatus === "out").length;
  const critical = products.filter((p) => p.stockStatus !== "ok").slice(0, 4);

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5">Olá, {user?.name?.split(" ")[0] || "você"}</Typography>
        <Typography color="text.secondary">Resumo do seu estoque doméstico</Typography>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <StatCard label="Ok" value={ok} color="stock.ok" />
        <StatCard label="Acabando" value={low} color="stock.low" />
        <StatCard label="Zerados" value={out} color="stock.out" />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="contained" onClick={() => navigate("/entrada")}>
          Entrada por texto
        </Button>
        <Button variant="outlined" onClick={() => navigate("/baixa")}>
          Dar baixa
        </Button>
        <Button variant="outlined" onClick={() => navigate("/lista-compras")}>
          Lista de compras
        </Button>
        <Button variant="outlined" onClick={() => navigate("/produtos")}>
          Ver todos
        </Button>
      </Stack>

      <Box>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Precisa de atenção
        </Typography>
        {critical.length === 0 ? (
          <Typography color="text.secondary">Nada urgente por enquanto.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {critical.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

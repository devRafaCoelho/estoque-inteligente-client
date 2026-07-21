import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { productService } from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";
import ProductCard from "../../components/products/ProductCard/ProductCard";
import { pageLoadingBoxSx, pageHeaderSubtitleSx, pageSectionTitleSx } from "../../styles/pageStyles";
import { DASHBOARD_COPY } from "./dashboardCopy";
import { DASHBOARD_CONFIG } from "./dashboardConfig";
import {
  pageStackSpacing,
  statsRowSpacing,
  actionsRowSx,
  actionsRowSpacing,
  statCardSx,
  statCardContentSx,
  statValueSx,
  criticalListSpacing,
} from "./DashboardPage.styled";

function StatCard({ label, value, color }) {
  return (
    <Card sx={statCardSx}>
      <CardContent sx={statCardContentSx}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={statValueSx(color)}>
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
        error(err instanceof ApiError ? err.message : DASHBOARD_COPY.loadError);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [error]);

  const { stockStatus, criticalLimit, paths } = DASHBOARD_CONFIG;
  const ok = products.filter((p) => p.stockStatus === stockStatus.ok).length;
  const low = products.filter((p) => p.stockStatus === stockStatus.low).length;
  const out = products.filter((p) => p.stockStatus === stockStatus.out).length;
  const critical = products.filter((p) => p.stockStatus !== stockStatus.ok).slice(0, criticalLimit);

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  const firstName = user?.name?.split(" ")[0] || DASHBOARD_COPY.greetingFallback;

  return (
    <Stack spacing={pageStackSpacing}>
      <Box>
        <Typography variant="h5">Olá, {firstName}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{DASHBOARD_COPY.subtitle}</Typography>
      </Box>

      <Stack direction="row" spacing={statsRowSpacing}>
        <StatCard label={DASHBOARD_COPY.statOk} value={ok} color="stock.ok" />
        <StatCard label={DASHBOARD_COPY.statLow} value={low} color="stock.low" />
        <StatCard label={DASHBOARD_COPY.statOut} value={out} color="stock.out" />
      </Stack>

      <Stack direction={actionsRowSx.direction} spacing={actionsRowSpacing}>
        <Button variant="contained" onClick={() => navigate(paths.intake)}>
          {DASHBOARD_COPY.ctaIntake}
        </Button>
        <Button variant="outlined" onClick={() => navigate(paths.stockOut)}>
          {DASHBOARD_COPY.ctaStockOut}
        </Button>
        <Button variant="outlined" onClick={() => navigate(paths.shopping)}>
          {DASHBOARD_COPY.ctaShopping}
        </Button>
        <Button variant="outlined" onClick={() => navigate(paths.products)}>
          {DASHBOARD_COPY.ctaAllProducts}
        </Button>
      </Stack>

      <Box>
        <Typography variant="h6" sx={pageSectionTitleSx}>
          {DASHBOARD_COPY.attentionTitle}
        </Typography>
        {critical.length === 0 ? (
          <Typography color="text.secondary">{DASHBOARD_COPY.nothingUrgent}</Typography>
        ) : (
          <Stack spacing={criticalListSpacing}>
            {critical.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

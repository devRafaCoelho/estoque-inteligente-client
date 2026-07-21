import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProductCard from "../../components/products/ProductCard/ProductCard";
import StockStatusChip from "../../components/products/StockStatusChip/StockStatusChip";
import LoadingButton from "../../components/common/LoadingButton/LoadingButton";
import { useAuth } from "../../hooks/useAuth";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";
import { dashboardService } from "../../services/dashboardService";
import { notificationService } from "../../services/notificationService";
import { pageLoadingBoxSx, pageHeaderSubtitleSx, pageSectionTitleSx } from "../../styles/pageStyles";
import { DASHBOARD_COPY } from "./dashboardCopy";
import { DASHBOARD_CONFIG } from "./dashboardConfig";
import {
  pageStackSpacing,
  statsRowSpacing,
  statsRowDirection,
  statsRowSx,
  actionsRowSx,
  actionsRowSpacing,
  statCardSx,
  statCardContentSx,
  statValueSx,
  criticalListSpacing,
  alertsListSpacing,
  alertItemSx,
  alertItemTitleSx,
  alertActionsSx,
  alertActionsSpacing,
} from "./DashboardPage.styled";

function StatCard({ status, value }) {
  return (
    <Card sx={statCardSx}>
      <CardContent sx={statCardContentSx}>
        <StockStatusChip status={status} />
        <Typography variant="h4" fontWeight={800} color="text.primary" sx={statValueSx}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ok: 0, low: 0, out: 0 });
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const { stockStatus, paths, locale } = DASHBOARD_CONFIG;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const data = await dashboardService.getStats();
        setStats({
          ok: data.stats?.ok || 0,
          low: data.stats?.low || 0,
          out: data.stats?.out || 0,
        });
        setCriticalProducts(data.criticalProducts || []);
        setRecentAlerts(data.recentAlerts || []);
      } catch (err) {
        error(err instanceof ApiError ? err.message : DASHBOARD_COPY.loadError);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [error],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (alert) => {
    if (!alert.unread) return;
    setBusyId(alert.id);
    try {
      await notificationService.markRead(alert.id);
      success(DASHBOARD_COPY.markReadSuccess);
      await load({ silent: true });
    } catch (err) {
      error(err instanceof ApiError ? err.message : DASHBOARD_COPY.markReadError);
    } finally {
      setBusyId(null);
    }
  };

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

      <Stack direction={statsRowDirection} spacing={statsRowSpacing} sx={statsRowSx}>
        <StatCard status={stockStatus.ok} value={stats.ok} />
        <StatCard status={stockStatus.low} value={stats.low} />
        <StatCard status={stockStatus.out} value={stats.out} />
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
          {DASHBOARD_COPY.alertsTitle}
        </Typography>
        {recentAlerts.length === 0 ? (
          <Typography color="text.secondary">{DASHBOARD_COPY.noRecentAlerts}</Typography>
        ) : (
          <Stack spacing={alertsListSpacing}>
            {recentAlerts.map((alert) => (
              <Box key={alert.id} sx={alertItemSx(alert.unread)}>
                <Typography variant="subtitle1" sx={alertItemTitleSx}>
                  {alert.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {alert.body}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                  {new Date(alert.createdAt).toLocaleString(locale)}
                </Typography>
                <Stack direction="row" spacing={alertActionsSpacing} sx={alertActionsSx}>
                  {alert.unread && (
                    <LoadingButton
                      size="small"
                      variant="text"
                      loading={busyId === alert.id}
                      onClick={() => handleMarkRead(alert)}
                    >
                      {DASHBOARD_COPY.markRead}
                    </LoadingButton>
                  )}
                  {alert.productId && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => navigate(paths.product(alert.productId))}
                    >
                      {DASHBOARD_COPY.openProduct}
                    </Button>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Typography variant="h6" sx={pageSectionTitleSx}>
          {DASHBOARD_COPY.attentionTitle}
        </Typography>
        {criticalProducts.length === 0 ? (
          <Typography color="text.secondary">{DASHBOARD_COPY.nothingUrgent}</Typography>
        ) : (
          <Stack spacing={criticalListSpacing}>
            {criticalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

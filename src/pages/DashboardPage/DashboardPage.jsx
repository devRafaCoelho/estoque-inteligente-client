import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
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
import { financeService } from "../../services/financeService";
import { notificationService } from "../../services/notificationService";
import { pageLoadingBoxSx, pageHeaderSubtitleSx, pageSectionTitleSx } from "../../styles/pageStyles";
import { DASHBOARD_COPY } from "./dashboardCopy";
import { DASHBOARD_CONFIG } from "./dashboardConfig";
import {
  pageStackSpacing,
  statsRowSpacing,
  statsRowDirection,
  statsRowSx,
  statCardSx,
  statCardContentSx,
  statValueSx,
  heroCardSx,
  heroActionsSx,
  monthSpendCardSx,
  monthSpendContentSx,
  criticalListSpacing,
  alertsListSpacing,
  alertItemSx,
  alertItemTitleSx,
  alertActionsSx,
  alertActionsSpacing,
} from "./DashboardPage.styled";

function formatMoney(value, { locale, currency } = DASHBOARD_CONFIG) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

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
  const { success, error, info } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ok: 0, low: 0, out: 0 });
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [monthSpend, setMonthSpend] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { stockStatus, paths, locale, types, actions } = DASHBOARD_CONFIG;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const [data, finance] = await Promise.all([
          dashboardService.getStats(),
          financeService.getSummary().catch(() => null),
        ]);
        setStats({
          ok: data.stats?.ok || 0,
          low: data.stats?.low || 0,
          out: data.stats?.out || 0,
        });
        setCriticalProducts(data.criticalProducts || []);
        setRecentAlerts(data.recentAlerts || []);
        setMonthSpend(finance?.month || null);
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

      <Box sx={heroCardSx}>
        <Typography variant="h6" fontWeight={800}>
          {DASHBOARD_COPY.addStockTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {DASHBOARD_COPY.addStockSubtitle}
        </Typography>
        <Box sx={heroActionsSx}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<DocumentScannerOutlinedIcon />}
            onClick={() => info(DASHBOARD_COPY.scannerComingSoon)}
            sx={{ justifyContent: "space-between", flex: 1, pr: 1.5 }}
          >
            <Box component="span" sx={{ flex: 1, textAlign: "left" }}>
              {DASHBOARD_COPY.ctaScanner}
            </Box>
            <Chip size="small" label={DASHBOARD_COPY.ctaScannerHint} variant="outlined" />
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<EditNoteOutlinedIcon />}
            onClick={() => navigate(paths.intake)}
            sx={{ flex: 1 }}
          >
            {DASHBOARD_COPY.ctaText}
          </Button>
        </Box>
      </Box>

      <Card sx={monthSpendCardSx} variant="outlined">
        <CardActionArea onClick={() => navigate(paths.finance)}>
          <CardContent sx={monthSpendContentSx}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {DASHBOARD_COPY.monthlySpendTitle}
              </Typography>
              <Typography variant="h5" fontWeight={800} mt={0.5}>
                {monthSpend ? formatMoney(monthSpend.total) : formatMoney(0)}
              </Typography>
              {!monthSpend?.count ? (
                <Typography variant="caption" color="text.secondary">
                  {DASHBOARD_COPY.monthlySpendEmpty}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main" }}>
              <Typography variant="body2" fontWeight={700}>
                {DASHBOARD_COPY.monthlySpendCta}
              </Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <Stack direction={statsRowDirection} spacing={statsRowSpacing} sx={statsRowSx}>
        <StatCard status={stockStatus.ok} value={stats.ok} />
        <StatCard status={stockStatus.low} value={stats.low} />
        <StatCard status={stockStatus.out} value={stats.out} />
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
                  {(alert.type === types.consumptionNudge ||
                    alert.payload?.action === actions.openQuickConsume) && (
                    <Button size="small" variant="text" onClick={() => navigate(paths.stockOut)}>
                      {DASHBOARD_COPY.registerStockOut}
                    </Button>
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

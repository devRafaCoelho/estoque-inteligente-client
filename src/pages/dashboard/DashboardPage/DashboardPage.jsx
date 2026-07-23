import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ProductCard from "../../../components/products/ProductCard/ProductCard";
import StockStatusChip from "../../../components/products/StockStatusChip/StockStatusChip";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { getDashboardStats } from "../../../services/dashboardService";
import { getFinanceSummary } from "../../../services/financeService";
import { markNotificationRead } from "../../../services/notificationService";
import { pageLoadingBoxSx, pageHeaderSubtitleSx, pageSectionTitleSx } from "../../../styles/pageStyles";
import { DASHBOARD_PAGE_COPY } from "./dashboardPageCopy";
import { DASHBOARD_PAGE_CONFIG } from "./dashboardPageConfig";
import {
  pageStackSpacing,
  headerRowSx,
  headerTextSx,
  headerIntakeActionsSx,
  headerIntakeButtonSx,
  statsRowSpacing,
  statsRowDirection,
  statsRowSx,
  statCardSx,
  statCardContentSx,
  statValueSx,
  monthSpendCardSx,
  monthSpendContentSx,
  criticalListSpacing,
  alertsListSpacing,
  alertItemSx,
  alertItemTitleSx,
  alertActionsSx,
  alertActionsSpacing,
} from "./DashboardPage.styled";

function formatMoney(value, { locale, currency } = DASHBOARD_PAGE_CONFIG) {
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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ok: 0, low: 0, out: 0 });
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [monthSpend, setMonthSpend] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { stockStatus, paths, locale, types, actions } = DASHBOARD_PAGE_CONFIG;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const [data, finance] = await Promise.all([
          getDashboardStats(),
          getFinanceSummary().catch(() => null),
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
        error(err instanceof ApiError ? err.message : DASHBOARD_PAGE_COPY.loadError);
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
      await markNotificationRead(alert.id);
      success(DASHBOARD_PAGE_COPY.markReadSuccess);
      await load({ silent: true });
    } catch (err) {
      error(err instanceof ApiError ? err.message : DASHBOARD_PAGE_COPY.markReadError);
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

  const firstName = user?.name?.split(" ")[0] || DASHBOARD_PAGE_COPY.greetingFallback;

  return (
    <Stack spacing={pageStackSpacing}>
      <Box sx={headerRowSx}>
        <Box sx={headerTextSx}>
          <Typography variant="h5">Olá, {firstName}</Typography>
          <Typography sx={pageHeaderSubtitleSx}>{DASHBOARD_PAGE_COPY.subtitle}</Typography>
        </Box>

        {isDesktop ? (
          <Box sx={headerIntakeActionsSx}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DocumentScannerOutlinedIcon />}
              disabled
              sx={headerIntakeButtonSx}
            >
              {DASHBOARD_PAGE_COPY.ctaScanner}
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditNoteOutlinedIcon />}
              onClick={() => navigate(paths.intake)}
              sx={headerIntakeButtonSx}
            >
              {DASHBOARD_PAGE_COPY.ctaText}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Inventory2OutlinedIcon />}
              onClick={() => navigate(paths.productCreate)}
              sx={headerIntakeButtonSx}
            >
              {DASHBOARD_PAGE_COPY.ctaManual}
            </Button>
          </Box>
        ) : null}
      </Box>

      <Card sx={monthSpendCardSx} variant="outlined">
        <CardActionArea onClick={() => navigate(paths.finance)}>
          <CardContent sx={monthSpendContentSx}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {DASHBOARD_PAGE_COPY.monthlySpendTitle}
              </Typography>
              <Typography variant="h5" fontWeight={800} mt={0.5}>
                {monthSpend ? formatMoney(monthSpend.total) : formatMoney(0)}
              </Typography>
              {!monthSpend?.count ? (
                <Typography variant="caption" color="text.secondary">
                  {DASHBOARD_PAGE_COPY.monthlySpendEmpty}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main" }}>
              <Typography variant="body2" fontWeight={700}>
                {DASHBOARD_PAGE_COPY.monthlySpendCta}
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

      {recentAlerts.length > 0 ? (
        <Box>
          <Typography variant="h6" sx={pageSectionTitleSx}>
            {DASHBOARD_PAGE_COPY.alertsTitle}
          </Typography>
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
                      {DASHBOARD_PAGE_COPY.markRead}
                    </LoadingButton>
                  )}
                  {(alert.type === types.consumptionNudge ||
                    alert.payload?.action === actions.openQuickConsume) && (
                    <Button size="small" variant="text" onClick={() => navigate(paths.stockOut)}>
                      {DASHBOARD_PAGE_COPY.registerStockOut}
                    </Button>
                  )}
                  {alert.productId && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => navigate(paths.product(alert.productId))}
                    >
                      {DASHBOARD_PAGE_COPY.openProduct}
                    </Button>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      ) : null}

      <Box>
        <Typography variant="h6" sx={pageSectionTitleSx}>
          {DASHBOARD_PAGE_COPY.attentionTitle}
        </Typography>
        {criticalProducts.length === 0 ? (
          <EmptyState
            size="sm"
            icon={CheckCircleOutlineIcon}
            title={DASHBOARD_PAGE_COPY.nothingUrgentTitle}
            description={DASHBOARD_PAGE_COPY.nothingUrgentDescription}
          />
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

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ProductCard from "../../../components/products/ProductCard/ProductCard";
import StockStatusChip from "../../../components/products/StockStatusChip/StockStatusChip";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import NotificationCard from "../../../components/notifications/NotificationCard/NotificationCard";
import { useAuth } from "../../../hooks/useAuth";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { useNotificationActions } from "../../../hooks/useNotificationActions";
import { ApiError } from "../../../services/apiClient";
import { getDashboardStats } from "../../../services/dashboardService";
import { getFinanceSummary } from "../../../services/financeService";
import { formatMoney } from "../../../utils/money";
import { isNotificationNavigable } from "../../../utils/notifications/resolveNotificationDestination";
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
  assistantCardContentSx,
  assistantCardCtaLabelSx,
  assistantCardCtaSx,
  assistantCardDescriptionSx,
  assistantCardIconSx,
  assistantCardSx,
  assistantCardTextSx,
  assistantCardTitleRowSx,
  monthSpendCardSx,
  monthSpendContentSx,
  criticalListSpacing,
  alertsListSpacing,
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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ ok: 0, low: 0, out: 0 });
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [monthSpend, setMonthSpend] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [addProductAnchorEl, setAddProductAnchorEl] = useState(null);

  const { stockStatus, paths, locale } = DASHBOARD_PAGE_CONFIG;
  const addProductMenuOpen = Boolean(addProductAnchorEl);

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

  const { markRead, openNotification } = useNotificationActions({
    onAfterMarkRead: () => load({ silent: true }),
    markReadSuccessMessage: DASHBOARD_PAGE_COPY.markReadSuccess,
    markReadErrorMessage: DASHBOARD_PAGE_COPY.markReadError,
  });

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (alert) => {
    setBusyId(alert.id);
    try {
      await markRead(alert);
    } finally {
      setBusyId(null);
    }
  };

  const handleAddProductMenuClose = () => {
    setAddProductAnchorEl(null);
  };

  const handleAddProductOption = (path) => {
    handleAddProductMenuClose();
    navigate(path);
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
              startIcon={<Inventory2OutlinedIcon />}
              endIcon={<KeyboardArrowDownIcon />}
              aria-haspopup="menu"
              aria-expanded={addProductMenuOpen ? "true" : undefined}
              aria-controls={addProductMenuOpen ? "dashboard-add-product-menu" : undefined}
              aria-label={DASHBOARD_PAGE_COPY.ctaAddProductAria}
              onClick={(event) => setAddProductAnchorEl(event.currentTarget)}
              sx={headerIntakeButtonSx}
            >
              {DASHBOARD_PAGE_COPY.ctaAddProduct}
            </Button>
            <Menu
              id="dashboard-add-product-menu"
              anchorEl={addProductAnchorEl}
              open={addProductMenuOpen}
              onClose={handleAddProductMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => handleAddProductOption(paths.intake)}>
                <ListItemIcon>
                  <EditNoteOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{DASHBOARD_PAGE_COPY.ctaText}</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleAddProductOption(paths.productCreate)}>
                <ListItemIcon>
                  <Inventory2OutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{DASHBOARD_PAGE_COPY.ctaManual}</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        ) : null}
      </Box>

      <Card sx={assistantCardSx} variant="outlined">
        <CardActionArea onClick={() => navigate(paths.chat)}>
          <CardContent sx={assistantCardContentSx}>
            <Box sx={assistantCardTextSx}>
              <Box sx={assistantCardTitleRowSx}>
                <ChatOutlinedIcon sx={assistantCardIconSx} />
                <Typography variant="body2" color="text.secondary">
                  {DASHBOARD_PAGE_COPY.assistantTitle}
                </Typography>
              </Box>
              <Typography sx={assistantCardDescriptionSx}>
                {DASHBOARD_PAGE_COPY.assistantDescription}
              </Typography>
            </Box>
            <Box sx={assistantCardCtaSx}>
              <Typography variant="body2" sx={assistantCardCtaLabelSx}>
                {DASHBOARD_PAGE_COPY.assistantCta}
              </Typography>
              <ChevronRightIcon fontSize="small" />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

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
            {recentAlerts.map((alert) => {
              const navigable = isNotificationNavigable(alert);
              return (
                <NotificationCard
                  key={alert.id}
                  notification={alert}
                  locale={locale}
                  busy={busyId === alert.id}
                  onMarkRead={() => handleMarkRead(alert)}
                  onNavigate={navigable ? () => openNotification(alert) : undefined}
                />
              );
            })}
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

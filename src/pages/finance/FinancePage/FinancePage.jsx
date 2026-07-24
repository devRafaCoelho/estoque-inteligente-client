import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  getFinanceByCategory,
  getFinanceSeries,
  getFinanceSummary,
  getFinanceTips,
} from "../../../services/financeService";
import { categoryLabel } from "../../../utils/categoryLabels";
import { pageHeaderSubtitleSx, pageLoadingBoxSx, pageSectionTitleSx } from "../../../styles/pageStyles";
import {
  FINANCE_PAGE_CONFIG,
  getAvailableFinanceMonths,
} from "./financePageConfig";
import { FINANCE_PAGE_COPY } from "./financePageCopy";
import {
  categoryBarFillSx,
  categoryBarTrackSx,
  categoryMonthChipsSx,
  categoryRowSx,
  deltaSx,
  pageStackSpacing,
  recentItemSx,
  sectionCardSx,
  seriesBarFillSx,
  seriesBarTrackSx,
  seriesRowSx,
  summaryCardContentSx,
  summaryCardSx,
  tipItemSx,
} from "./FinancePage.styled";

function formatMoney(value, { locale, currency } = FINANCE_PAGE_CONFIG) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

function formatDelta(percent) {
  const value = Number(percent) || 0;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

function formatShortDate(value, locale) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export default function FinancePage() {
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const [tips, setTips] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const { locale } = FINANCE_PAGE_CONFIG;
  const year = new Date().getFullYear();
  const monthOptions = useMemo(() => getAvailableFinanceMonths(), []);
  const [selectedMonth, setSelectedMonth] = useState(
    () => monthOptions[monthOptions.length - 1]?.month || new Date().getMonth() + 1,
  );
  const selectedMonthChipRef = useRef(null);

  const loadCategoriesAndTips = useCallback(
    async (month) => {
      setCategoriesLoading(true);
      try {
        const [categoriesData, tipsData] = await Promise.all([
          getFinanceByCategory({ year, month }),
          getFinanceTips({ year, month }),
        ]);
        setByCategory(categoriesData.byCategory || []);
        setTips(tipsData.tips || []);
      } catch (err) {
        error(
          err instanceof ApiError ? err.message : FINANCE_PAGE_COPY.categoriesLoadError,
        );
      } finally {
        setCategoriesLoading(false);
      }
    },
    [error, year],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const currentMonth =
        monthOptions[monthOptions.length - 1]?.month || new Date().getMonth() + 1;
      const [summaryData, seriesData, tipsData, categoriesData] = await Promise.all([
        getFinanceSummary(),
        getFinanceSeries({ year }),
        getFinanceTips({ year, month: currentMonth }),
        getFinanceByCategory({ year, month: currentMonth }),
      ]);
      setSummary(summaryData);
      setSeries(seriesData.series || []);
      setTips(tipsData.tips || []);
      setByCategory(categoriesData.byCategory || []);
      setSelectedMonth(currentMonth);
    } catch (err) {
      error(err instanceof ApiError ? err.message : FINANCE_PAGE_COPY.loadError);
    } finally {
      setLoading(false);
    }
  }, [error, year, monthOptions]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (loading) return;
    selectedMonthChipRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [loading, selectedMonth]);

  const handleSelectMonth = (month) => {
    if (month === selectedMonth) return;
    setSelectedMonth(month);
    loadCategoriesAndTips(month);
  };

  const maxCategory = useMemo(() => {
    return Math.max(...byCategory.map((c) => Number(c.total) || 0), 0);
  }, [byCategory]);

  const maxSeries = useMemo(
    () => Math.max(...series.map((s) => Number(s.total) || 0), 0),
    [series],
  );

  const hasSeriesSpend = useMemo(
    () => series.some((point) => Number(point.total) > 0),
    [series],
  );

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  const rising = (Number(summary?.month?.deltaPercent) || 0) > 0;

  return (
    <Stack spacing={pageStackSpacing}>
      <Box>
        <Typography variant="h5">{FINANCE_PAGE_COPY.title}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{FINANCE_PAGE_COPY.subtitle}</Typography>
      </Box>

      <Card sx={summaryCardSx}>
        <CardContent sx={summaryCardContentSx}>
          <Typography variant="body2" color="text.secondary">
            {FINANCE_PAGE_COPY.monthTitle}
          </Typography>
          <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
            {formatMoney(summary?.month?.total)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            {FINANCE_PAGE_COPY.purchasesCount(summary?.month?.count || 0)}
          </Typography>
          <Typography variant="body2" sx={deltaSx(rising)} mt={0.75}>
            {formatDelta(summary?.month?.deltaPercent)}{" "}
            <Typography component="span" variant="caption" color="text.secondary">
              {FINANCE_PAGE_COPY.vsPrevious}
            </Typography>
          </Typography>
          {summary?.month?.projectedTotal > 0 ? (
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {FINANCE_PAGE_COPY.projectionLabel}:{" "}
              <Typography component="span" variant="caption" fontWeight={700} color="text.primary">
                {formatMoney(summary.month.projectedTotal)}
              </Typography>
            </Typography>
          ) : null}
        </CardContent>
      </Card>

      <Box>
        <Typography sx={pageSectionTitleSx}>{FINANCE_PAGE_COPY.yearSeriesTitle}</Typography>
        <Box sx={sectionCardSx}>
          {!hasSeriesSpend ? (
            <EmptyState
              size="sm"
              icon={AccountBalanceWalletOutlinedIcon}
              title={FINANCE_PAGE_COPY.emptySeriesTitle}
              description={FINANCE_PAGE_COPY.emptySeriesDescription}
            />
          ) : (
            series.map((point) => {
              const ratio = maxSeries > 0 ? point.total / maxSeries : 0;
              return (
                <Box key={`${point.year}-${point.month}`} sx={{ mb: 1 }}>
                  <Box sx={seriesRowSx}>
                    <Typography variant="body2" fontWeight={700}>
                      {point.label}
                    </Typography>
                    <Typography variant="body2">
                      {point.total > 0 ? formatMoney(point.total) : "—"}
                    </Typography>
                  </Box>
                  <Box sx={seriesBarTrackSx}>
                    <Box sx={seriesBarFillSx(ratio)} />
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      <Box>
        <Typography sx={pageSectionTitleSx}>{FINANCE_PAGE_COPY.categoriesTitle}</Typography>
        <Box
          sx={categoryMonthChipsSx}
          role="group"
          aria-label={FINANCE_PAGE_COPY.categoriesMonthAria}
        >
          {monthOptions.map((option) => {
            const selected = option.month === selectedMonth;
            return (
              <Chip
                key={option.month}
                ref={selected ? selectedMonthChipRef : undefined}
                label={option.label}
                clickable
                color={selected ? "primary" : "default"}
                variant={selected ? "filled" : "outlined"}
                onClick={() => handleSelectMonth(option.month)}
              />
            );
          })}
        </Box>
        <Box sx={sectionCardSx}>
          {categoriesLoading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : byCategory.length === 0 ? (
            <EmptyState
              size="sm"
              icon={CategoryOutlinedIcon}
              title={FINANCE_PAGE_COPY.emptyCategoriesTitle}
              description={FINANCE_PAGE_COPY.emptyCategoriesDescription}
            />
          ) : (
            byCategory.map((row) => {
              const ratio = maxCategory > 0 ? row.total / maxCategory : 0;
              return (
                <Box key={row.category} sx={{ mb: 1 }}>
                  <Box sx={categoryRowSx}>
                    <Typography variant="body2" fontWeight={700}>
                      {categoryLabel(row.category)}
                    </Typography>
                    <Typography variant="body2">{formatMoney(row.total)}</Typography>
                  </Box>
                  <Box sx={categoryBarTrackSx}>
                    <Box sx={categoryBarFillSx(ratio)} />
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      <Box>
        <Typography sx={pageSectionTitleSx}>{FINANCE_PAGE_COPY.tipsTitle}</Typography>
        <Stack spacing={1.25}>
          {tips.length === 0 ? (
            <EmptyState
              size="sm"
              icon={LightbulbOutlinedIcon}
              title={FINANCE_PAGE_COPY.emptyTipsTitle}
              description={FINANCE_PAGE_COPY.emptyTipsDescription}
            />
          ) : (
            tips.map((tip) => {
              const message =
                tip.category && tip.message
                  ? tip.message.replaceAll(`"${tip.category}"`, `"${categoryLabel(tip.category)}"`)
                  : tip.message;
              return (
                <Alert
                  key={tip.id}
                  severity={tip.severity || "info"}
                  variant="outlined"
                  sx={tipItemSx}
                >
                  {message}
                </Alert>
              );
            })
          )}
        </Stack>
      </Box>

      <Box>
        <Typography sx={pageSectionTitleSx}>{FINANCE_PAGE_COPY.recentTitle}</Typography>
        <Box sx={sectionCardSx}>
          {(summary?.recentPurchases || []).length === 0 ? (
            <EmptyState
              size="sm"
              icon={ReceiptLongOutlinedIcon}
              title={FINANCE_PAGE_COPY.emptyRecentTitle}
              description={FINANCE_PAGE_COPY.emptyRecentDescription}
            />
          ) : (
            (summary.recentPurchases || []).map((purchase) => (
              <Box key={purchase.id} sx={recentItemSx}>
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    {purchase.storeName || FINANCE_PAGE_COPY.storeFallback}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatShortDate(purchase.purchasedAt, locale)}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={700}>
                  {formatMoney(purchase.totalAmount)}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Stack>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { getFinanceSeries, getFinanceSummary, getFinanceTips } from "../../../services/financeService";
import { categoryLabel } from "../../../utils/categoryLabels";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  pageSectionTitleSx,
} from "../../../styles/pageStyles";
import { FINANCE_PAGE_CONFIG } from "./financePageConfig";
import { FINANCE_PAGE_COPY } from "./financePageCopy";
import {
  categoryBarFillSx,
  categoryBarTrackSx,
  categoryRowSx,
  deltaSx,
  pageStackSpacing,
  recentItemSx,
  sectionCardSx,
  seriesBarColumnSx,
  seriesBarSx,
  seriesChartSx,
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

  const { locale } = FINANCE_PAGE_CONFIG;
  const year = new Date().getFullYear();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, seriesData, tipsData] = await Promise.all([
        getFinanceSummary(),
        getFinanceSeries({ year }),
        getFinanceTips(),
      ]);
      setSummary(summaryData);
      setSeries(seriesData.series || []);
      setTips(tipsData.tips || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : FINANCE_PAGE_COPY.loadError);
    } finally {
      setLoading(false);
    }
  }, [error, year]);

  useEffect(() => {
    load();
  }, [load]);

  const maxCategory = useMemo(() => {
    const cats = summary?.byCategory || [];
    return Math.max(...cats.map((c) => Number(c.total) || 0), 0);
  }, [summary]);

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
            <Typography color="text.secondary">{FINANCE_PAGE_COPY.emptySeries}</Typography>
          ) : (
            <Box sx={seriesChartSx}>
              {series.map((point) => {
                const ratio = maxSeries > 0 ? point.total / maxSeries : 0;
                return (
                  <Box key={`${point.year}-${point.month}`} sx={seriesBarColumnSx}>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {point.total > 0 ? formatMoney(point.total) : "—"}
                    </Typography>
                    <Box sx={seriesBarSx(ratio)} />
                    <Typography variant="caption" color="text.secondary">
                      {point.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      <Box>
        <Typography sx={pageSectionTitleSx}>{FINANCE_PAGE_COPY.categoriesTitle}</Typography>
        <Box sx={sectionCardSx}>
          {(summary?.byCategory || []).length === 0 ? (
            <Typography color="text.secondary">{FINANCE_PAGE_COPY.emptyCategories}</Typography>
          ) : (
            (summary.byCategory || []).map((row) => {
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
            <Typography color="text.secondary">{FINANCE_PAGE_COPY.emptyTips}</Typography>
          ) : (
            tips.map((tip) => (
              <Alert
                key={tip.id}
                severity={tip.severity || "info"}
                variant="outlined"
                sx={tipItemSx}
              >
                {tip.message}
              </Alert>
            ))
          )}
        </Stack>
      </Box>

      <Box>
        <Typography sx={pageSectionTitleSx}>{FINANCE_PAGE_COPY.recentTitle}</Typography>
        <Box sx={sectionCardSx}>
          {(summary?.recentPurchases || []).length === 0 ? (
            <Typography color="text.secondary">{FINANCE_PAGE_COPY.emptyRecent}</Typography>
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

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PaperShoppingList from "../../../components/shopping/PaperShoppingList/PaperShoppingList";
import {
  getSharedShoppingList,
  updateSharedShoppingListItem,
} from "../../../services/shoppingListShareService";
import { ApiError } from "../../../services/apiClient";
import { formatMoney } from "../../../utils/money";
import { pageLoadingBoxSx } from "../../../styles/pageStyles";
import { SHARED_SHOPPING_LIST_PAGE_COPY } from "./sharedShoppingListPageCopy";
import {
  sharedBrandSx,
  sharedPageInnerSx,
  sharedPageRootSx,
  sharedSpendBannerSx,
} from "./SharedShoppingListPage.styled";

export default function SharedShoppingListPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await getSharedShoppingList(token);
        if (!cancelled) setList(data.list || null);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 410) {
          setErrorMessage(SHARED_SHOPPING_LIST_PAGE_COPY.gone);
        } else if (err instanceof ApiError && err.status === 404) {
          setErrorMessage(SHARED_SHOPPING_LIST_PAGE_COPY.invalidLink);
        } else {
          setErrorMessage(
            err instanceof ApiError ? err.message : SHARED_SHOPPING_LIST_PAGE_COPY.loadError,
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleToggle = useCallback(
    async (item) => {
      if (!token || !item?.id || busyId) return;
      const nextChecked = !item.checked;
      setBusyId(item.id);
      setList((prev) => {
        if (!prev) return prev;
        const items = (prev.items || []).map((row) =>
          row.id === item.id ? { ...row, checked: nextChecked } : row,
        );
        const checked = items.filter((row) => row.checked).length;
        return {
          ...prev,
          items,
          stats: {
            total: items.length,
            checked,
            pending: items.length - checked,
          },
        };
      });
      try {
        const data = await updateSharedShoppingListItem(token, item.id, nextChecked);
        if (data?.list) setList(data.list);
      } catch {
        setList((prev) => {
          if (!prev) return prev;
          const items = (prev.items || []).map((row) =>
            row.id === item.id ? { ...row, checked: item.checked } : row,
          );
          const checked = items.filter((row) => row.checked).length;
          return {
            ...prev,
            items,
            stats: {
              total: items.length,
              checked,
              pending: items.length - checked,
            },
          };
        });
      } finally {
        setBusyId(null);
      }
    },
    [token, busyId],
  );

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage || !list) {
    return (
      <Box sx={sharedPageRootSx}>
        <Stack spacing={2} sx={sharedPageInnerSx} alignItems="flex-start">
          <Typography variant="h5" sx={sharedBrandSx}>
            {SHARED_SHOPPING_LIST_PAGE_COPY.brand}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {errorMessage || SHARED_SHOPPING_LIST_PAGE_COPY.loadError}
          </Typography>
        </Stack>
      </Box>
    );
  }

  const items = list.items || [];
  const spend = list.spendEstimate;
  const hasEstimate = Boolean(spend?.hasEstimate);

  return (
    <Box sx={sharedPageRootSx}>
      <Stack spacing={2} sx={sharedPageInnerSx}>
        <Box>
          <Typography variant="h5" sx={sharedBrandSx}>
            {SHARED_SHOPPING_LIST_PAGE_COPY.brand}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {SHARED_SHOPPING_LIST_PAGE_COPY.footerHint}
          </Typography>
        </Box>

        {list.stats ? (
          <Typography variant="body2" color="text.secondary">
            {SHARED_SHOPPING_LIST_PAGE_COPY.stats(list.stats.pending, list.stats.checked)}
          </Typography>
        ) : null}

        {hasEstimate ? (
          <Box sx={sharedSpendBannerSx}>
            <PaymentsOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight={700}>
              {spend.isPartial
                ? SHARED_SHOPPING_LIST_PAGE_COPY.spendValuePartial(
                    formatMoney(spend.estimatedTotal),
                  )
                : SHARED_SHOPPING_LIST_PAGE_COPY.spendValue(
                    formatMoney(spend.estimatedTotal),
                  )}
            </Typography>
          </Box>
        ) : null}

        {items.length ? (
          <PaperShoppingList
            title={list.title}
            items={items}
            onToggle={handleToggle}
            busyId={busyId}
            canToggle
            canDelete={false}
          />
        ) : (
          <Typography color="text.secondary">{SHARED_SHOPPING_LIST_PAGE_COPY.empty}</Typography>
        )}
      </Stack>
    </Box>
  );
}

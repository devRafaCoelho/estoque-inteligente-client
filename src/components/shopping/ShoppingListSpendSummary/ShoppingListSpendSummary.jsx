import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import MoneyTextField from "../../form/MoneyTextField/MoneyTextField";
import { formatMoney } from "../../../utils/money";
import { formatQuantity } from "../../../utils/unitLabels";
import { SHOPPING_LIST_PAGE_COPY } from "../../../pages/shopping/ShoppingListPage/shoppingListPageCopy";
import {
  spendBannerRowSx,
  spendBannerSx,
  spendMissingCardSx,
  spendMissingHeaderSx,
  spendMissingInfoSx,
  spendMissingListSx,
  spendMissingNameSx,
  spendMissingPanelSx,
  spendMissingPriceFieldSx,
  spendSectionSx,
  spendShareSlotSx,
} from "./ShoppingListSpendSummary.styled";

const SAVE_ALL_BUSY_ID = "__all__";

/**
 * Resumo de estimativa da lista + cadastro rápido de preço unitário faltante.
 * @param {import("react").ReactNode} [shareSlot] — ação abaixo do banner (ex.: compartilhar)
 */
export default function ShoppingListSpendSummary({
  spendEstimate,
  pendingCount = 0,
  busyProductId = null,
  onSaveUnitPrices,
  shareSlot = null,
}) {
  const [draftPrices, setDraftPrices] = useState({});
  const unpricedItems = spendEstimate?.unpricedItems || [];
  const priceable = unpricedItems.filter((item) => item.canSetPrice && item.productId);
  const priceableIdsKey = priceable.map((item) => item.productId).join("|");

  // Mantém drafts dos itens ainda listados; remove só os que já saíram após salvar.
  useEffect(() => {
    const alive = new Set(priceableIdsKey ? priceableIdsKey.split("|") : []);
    setDraftPrices((prev) => {
      let changed = false;
      const next = {};
      for (const [productId, value] of Object.entries(prev)) {
        if (alive.has(productId)) {
          next[productId] = value;
        } else {
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [priceableIdsKey]);

  const readyEntries = useMemo(
    () =>
      priceable
        .map((item) => ({
          productId: item.productId,
          avgUnitPrice: Number(draftPrices[item.productId]),
        }))
        .filter((entry) => Number.isFinite(entry.avgUnitPrice) && entry.avgUnitPrice > 0),
    [priceable, draftPrices],
  );

  if (!spendEstimate && pendingCount <= 0 && !shareSlot) return null;

  const hasEstimate = Boolean(spendEstimate?.hasEstimate);
  const showBanner = Boolean(spendEstimate) || pendingCount > 0;
  const showMissing = unpricedItems.length > 0;
  const saving = busyProductId === SAVE_ALL_BUSY_ID;
  const allPricesFilled =
    priceable.length > 0 && readyEntries.length === priceable.length;
  const canSave = allPricesFilled && !busyProductId;
  const saveLabel =
    priceable.length <= 1
      ? SHOPPING_LIST_PAGE_COPY.saveUnitPrice
      : SHOPPING_LIST_PAGE_COPY.saveAllUnitPrices(priceable.length);

  return (
    <Stack spacing={1.25} sx={spendSectionSx}>
      {showBanner || shareSlot ? (
        <Box sx={spendBannerRowSx}>
          {showBanner ? (
            <Box sx={spendBannerSx(hasEstimate)}>
              <PaymentsOutlinedIcon
                color={hasEstimate ? "primary" : "disabled"}
                fontSize="small"
              />
              {hasEstimate ? (
                <Typography variant="body2" fontWeight={700} noWrap sx={{ minWidth: 0 }}>
                  {spendEstimate.isPartial
                    ? SHOPPING_LIST_PAGE_COPY.spendEstimatePartial(
                        formatMoney(spendEstimate.estimatedTotal),
                        spendEstimate.unpricedItemCount,
                      )
                    : SHOPPING_LIST_PAGE_COPY.spendEstimate(
                        formatMoney(spendEstimate.estimatedTotal),
                      )}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
                  {SHOPPING_LIST_PAGE_COPY.spendEstimateEmpty}
                </Typography>
              )}
            </Box>
          ) : null}
          {shareSlot ? <Box sx={spendShareSlotSx}>{shareSlot}</Box> : null}
        </Box>
      ) : null}

      {showMissing ? (
        <Box sx={spendMissingPanelSx}>
          <Box sx={spendMissingHeaderSx}>
            <InfoOutlinedIcon color="info" fontSize="small" sx={{ mt: 0.15 }} />
            <Typography variant="body2" sx={{ minWidth: 0, flex: 1 }}>
              {SHOPPING_LIST_PAGE_COPY.missingPricesAlert(unpricedItems.length)}
            </Typography>
          </Box>

          {priceable.length > 0 ? (
            <Stack spacing={1} sx={spendMissingListSx}>
              {priceable.map((item) => {
                const value = draftPrices[item.productId] ?? "";
                return (
                  <Box key={item.productId} sx={spendMissingCardSx}>
                    <Box sx={spendMissingInfoSx}>
                      <Typography variant="body2" fontWeight={700} noWrap sx={spendMissingNameSx}>
                        {item.name}
                      </Typography>
                      {item.quantity != null ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={formatQuantity(item.quantity, item.unit)}
                        />
                      ) : null}
                    </Box>
                    <MoneyTextField
                      label={SHOPPING_LIST_PAGE_COPY.unitPriceLabel}
                      value={value}
                      disabled={Boolean(busyProductId)}
                      onChange={(next) =>
                        setDraftPrices((prev) => ({
                          ...prev,
                          [item.productId]: next,
                        }))
                      }
                      sx={spendMissingPriceFieldSx}
                    />
                  </Box>
                );
              })}
              <LoadingButton
                type="button"
                variant="contained"
                fullWidth
                loading={saving}
                disabled={!canSave && !saving}
                onClick={() => onSaveUnitPrices?.(readyEntries)}
              >
                {saveLabel}
              </LoadingButton>
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary">
              {SHOPPING_LIST_PAGE_COPY.missingPricesNoProduct}
            </Typography>
          )}
        </Box>
      ) : null}
    </Stack>
  );
}

export { SAVE_ALL_BUSY_ID };

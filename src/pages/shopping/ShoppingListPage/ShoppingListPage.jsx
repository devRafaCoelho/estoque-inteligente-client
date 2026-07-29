import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import {
  addShoppingListItem,
  clearShoppingListItems,
  deleteShoppingListItem,
  generateShoppingList,
  getActiveShoppingList,
  previewShoppingListSuggestions,
  setShoppingListViewMode,
} from "../../../services/shoppingListService";
import ShoppingChecklist from "../../../components/shopping/ShoppingChecklist/ShoppingChecklist";
import PaperShoppingList from "../../../components/shopping/PaperShoppingList/PaperShoppingList";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import SegmentedControl from "../../../components/common/SegmentedControl/SegmentedControl";
import SpeechTextField from "../../../components/voice/SpeechRecordButton/SpeechTextField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { formatMoney } from "../../../utils/money";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
} from "../../../styles/pageStyles";
import { SHOPPING_LIST_PAGE_COPY } from "./shoppingListPageCopy";
import { SHOPPING_LIST_PAGE_CONFIG } from "./shoppingListPageConfig";
import {
  actionButtonSx,
  addSectionSpacing,
  listToolbarRowProps,
  shoppingListStackSpacing,
} from "./ShoppingListPage.styled";

export default function ShoppingListPage() {
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [clearListOpen, setClearListOpen] = useState(false);
  const [clearingList, setClearingList] = useState(false);
  const [list, setList] = useState(null);
  const [viewMode, setViewMode] = useState(SHOPPING_LIST_PAGE_CONFIG.defaultViewMode);
  const [addText, setAddText] = useState("");
  const [newSuggestionCount, setNewSuggestionCount] = useState(0);

  const applyList = useCallback((next) => {
    setList(next);
    setViewMode(
      next?.viewMode === SHOPPING_LIST_PAGE_CONFIG.listViewMode
        ? SHOPPING_LIST_PAGE_CONFIG.listViewMode
        : SHOPPING_LIST_PAGE_CONFIG.defaultViewMode,
    );
  }, []);

  const refreshSuggestions = useCallback(async () => {
    try {
      const data = await previewShoppingListSuggestions(
        SHOPPING_LIST_PAGE_CONFIG.generateMode,
      );
      setNewSuggestionCount(data.preview?.newCount ?? data.preview?.newSuggestions?.length ?? 0);
    } catch {
      // Mantém o último valor conhecido; o botão de gerar ainda funciona.
    }
  }, []);

  const patchListItems = useCallback((mapItems) => {
    setList((prev) => {
      if (!prev) return prev;
      const items = mapItems(prev.items || []);
      return {
        ...prev,
        items,
        stats: {
          total: items.length,
          checked: items.filter((item) => item.checked).length,
          pending: items.filter((item) => !item.checked).length,
        },
      };
    });
  }, []);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const data = await getActiveShoppingList();
        applyList(data.list);
        await refreshSuggestions();
      } catch (err) {
        error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.loadError);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [applyList, error, refreshSuggestions],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateShoppingList(SHOPPING_LIST_PAGE_CONFIG.generateMode);
      applyList(data.list);
      await refreshSuggestions();
      success(
        data.list.stats.pending
          ? SHOPPING_LIST_PAGE_COPY.generatePending(data.list.stats.pending)
          : SHOPPING_LIST_PAGE_COPY.generateEmpty,
      );
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.generateError);
    } finally {
      setGenerating(false);
    }
  };

  const handleViewMode = async (value) => {
    if (!value || value === viewMode) return;
    const previous = viewMode;
    setViewMode(value);
    try {
      const data = await setShoppingListViewMode(value);
      applyList(data.list);
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.viewModeError);
      setViewMode(previous);
    }
  };

  const handleToggle = (item) => {
    patchListItems((items) =>
      items.map((row) =>
        row.id === item.id ? { ...row, checked: !item.checked } : row,
      ),
    );
  };

  const handleDeleteRequest = (item) => {
    setItemToDelete(item);
  };

  const handleDeleteCancel = () => {
    if (busyId) return;
    setItemToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    const removedId = itemToDelete.id;
    setBusyId(removedId);
    try {
      await deleteShoppingListItem(removedId);
      setItemToDelete(null);
      patchListItems((items) => items.filter((row) => row.id !== removedId));
      await refreshSuggestions();
      success(SHOPPING_LIST_PAGE_COPY.itemRemoved);
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.deleteError);
    } finally {
      setBusyId(null);
    }
  };

  const handleClearListConfirm = async () => {
    setClearingList(true);
    try {
      const data = await clearShoppingListItems();
      applyList(data.list);
      await refreshSuggestions();
      setClearListOpen(false);
      success(SHOPPING_LIST_PAGE_COPY.listCleared);
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.clearError);
    } finally {
      setClearingList(false);
    }
  };

  const handleAdd = async () => {
    const text = addText.trim();
    if (!text) return;
    setAdding(true);
    try {
      const data = await addShoppingListItem({ text });
      setAddText("");
      if (data.list) {
        applyList(data.list);
      } else if (data.items?.length) {
        patchListItems((items) => [...items, ...data.items]);
      } else {
        await load({ silent: true });
      }
      await refreshSuggestions();
      const created = data.createdCount ?? data.items?.length ?? 1;
      const updated = data.updatedCount ?? 0;
      if (updated > 0 && created === 0) {
        success(SHOPPING_LIST_PAGE_COPY.itemsMerged);
      } else if (updated > 0 && created > 0) {
        success(SHOPPING_LIST_PAGE_COPY.itemsAddedAndMerged(created, updated));
      } else if (created > 1) {
        success(SHOPPING_LIST_PAGE_COPY.itemsAdded(created));
      } else {
        success(SHOPPING_LIST_PAGE_COPY.itemAdded);
      }
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.addError);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  const items = list?.items || [];
  const hasListItems = items.length > 0;
  const canGenerate = newSuggestionCount > 0;
  const generateLabel = hasListItems
    ? SHOPPING_LIST_PAGE_COPY.generateUpdate
    : SHOPPING_LIST_PAGE_COPY.generate;

  return (
    <Stack spacing={shoppingListStackSpacing}>
      <Box>
        <Typography variant="h5">{SHOPPING_LIST_PAGE_COPY.title}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{SHOPPING_LIST_PAGE_COPY.subtitle}</Typography>
      </Box>

      <LoadingButton
        variant="contained"
        loading={generating}
        disabled={!canGenerate}
        onClick={handleGenerate}
        title={!canGenerate ? SHOPPING_LIST_PAGE_COPY.generateDisabledHint : undefined}
        sx={actionButtonSx}
      >
        {generateLabel}
      </LoadingButton>

      <Stack spacing={addSectionSpacing}>
        <SpeechTextField
          label={SHOPPING_LIST_PAGE_COPY.addLabel}
          placeholder={SHOPPING_LIST_PAGE_COPY.addPlaceholder}
          value={addText}
          onChange={setAddText}
          fullWidth
          speechDisabled={adding || generating}
          showSubmit
          submitType="button"
          onSubmitClick={handleAdd}
          submitLoading={adding}
          submitDisabled={!addText.trim() || generating}
          submitAriaLabel={SHOPPING_LIST_PAGE_COPY.addSubmit}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <Stack spacing={1}>
        <Stack {...listToolbarRowProps}>
          <Box sx={{ minWidth: { sm: 220 }, maxWidth: { sm: 320 }, width: { xs: "100%", sm: "auto" } }}>
            <SegmentedControl
              value={viewMode}
              onChange={handleViewMode}
              ariaLabel={SHOPPING_LIST_PAGE_COPY.viewModeAria}
              options={[
                {
                  value: SHOPPING_LIST_PAGE_CONFIG.paperViewMode,
                  label: SHOPPING_LIST_PAGE_COPY.viewPaper,
                },
                {
                  value: SHOPPING_LIST_PAGE_CONFIG.listViewMode,
                  label: SHOPPING_LIST_PAGE_COPY.viewList,
                },
              ]}
            />
          </Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: "space-between", sm: "flex-end" }}
            flexWrap="wrap"
            useFlexGap
          >
            {list?.stats && (
              <Typography variant="body2" color="text.secondary">
                {SHOPPING_LIST_PAGE_COPY.stats(list.stats.pending, list.stats.checked)}
              </Typography>
            )}
            {list?.spendEstimate?.hasEstimate ? (
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {list.spendEstimate.isPartial
                  ? SHOPPING_LIST_PAGE_COPY.spendEstimatePartial(
                      formatMoney(list.spendEstimate.estimatedTotal),
                      list.spendEstimate.unpricedItemCount,
                    )
                  : SHOPPING_LIST_PAGE_COPY.spendEstimate(
                      formatMoney(list.spendEstimate.estimatedTotal),
                    )}
              </Typography>
            ) : items.some((item) => !item.checked) ? (
              <Typography variant="caption" color="text.secondary">
                {SHOPPING_LIST_PAGE_COPY.spendEstimateEmpty}
              </Typography>
            ) : null}
            {items.length > 0 && (
              <LoadingButton
                type="button"
                variant="text"
                color="error"
                size="small"
                disabled={clearingList || Boolean(busyId)}
                onClick={() => setClearListOpen(true)}
              >
                {SHOPPING_LIST_PAGE_COPY.clearList}
              </LoadingButton>
            )}
          </Stack>
        </Stack>

        {viewMode === SHOPPING_LIST_PAGE_CONFIG.paperViewMode ? (
          <PaperShoppingList
            title={list?.title}
            items={items}
            onToggle={handleToggle}
            onDelete={handleDeleteRequest}
            busyId={busyId}
          />
        ) : (
          <ShoppingChecklist
            items={items}
            onToggle={handleToggle}
            onDelete={handleDeleteRequest}
            busyId={busyId}
          />
        )}
      </Stack>

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onClose={handleDeleteCancel}
        title={SHOPPING_LIST_PAGE_COPY.deleteConfirmTitle}
        description={
          itemToDelete
            ? SHOPPING_LIST_PAGE_COPY.deleteConfirmDescription(itemToDelete.name)
            : ""
        }
        onConfirm={handleDeleteConfirm}
        confirmLoading={Boolean(itemToDelete && busyId === itemToDelete.id)}
        confirmLabel={SHOPPING_LIST_PAGE_COPY.deleteConfirmLabel}
        cancelLabel={SHOPPING_LIST_PAGE_COPY.deleteCancelLabel}
      />

      <ConfirmDialog
        open={clearListOpen}
        onClose={() => {
          if (clearingList) return;
          setClearListOpen(false);
        }}
        title={SHOPPING_LIST_PAGE_COPY.clearConfirmTitle}
        description={SHOPPING_LIST_PAGE_COPY.clearConfirmDescription}
        onConfirm={handleClearListConfirm}
        confirmLoading={clearingList}
        confirmLabel={SHOPPING_LIST_PAGE_COPY.clearConfirmLabel}
        cancelLabel={SHOPPING_LIST_PAGE_COPY.clearCancelLabel}
      />
    </Stack>
  );
}

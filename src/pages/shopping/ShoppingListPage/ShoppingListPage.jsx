import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
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
import { createShoppingListShare } from "../../../services/shoppingListShareService";
import ShoppingChecklist from "../../../components/shopping/ShoppingChecklist/ShoppingChecklist";
import PaperShoppingList from "../../../components/shopping/PaperShoppingList/PaperShoppingList";
import ShoppingListSpendEstimate, {
  ShoppingListSpendMissingPrices,
  SAVE_ALL_BUSY_ID,
} from "../../../components/shopping/ShoppingListSpendSummary/ShoppingListSpendSummary";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import SegmentedControl from "../../../components/common/SegmentedControl/SegmentedControl";
import SpeechTextField from "../../../components/voice/SpeechRecordButton/SpeechTextField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { updateProduct } from "../../../services/productService";
import {
  buildSharedListUrl,
  buildWhatsAppShareUrl,
  copyTextToClipboard,
} from "../../../utils/shopping/shoppingListShare";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
} from "../../../styles/pageStyles";
import { SHOPPING_LIST_PAGE_COPY } from "./shoppingListPageCopy";
import { SHOPPING_LIST_PAGE_CONFIG } from "./shoppingListPageConfig";
import {
  actionButtonSx,
  addSectionSpacing,
  estimateShareRowSx,
  listToolbarRowProps,
  shareButtonDesktopSx,
  shareButtonMobileSx,
  shoppingListStackSpacing,
  spendBlockSpacing,
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
  const [viewMode, setViewMode] = useState(
    SHOPPING_LIST_PAGE_CONFIG.defaultViewMode,
  );
  const [addText, setAddText] = useState("");
  const [newSuggestionCount, setNewSuggestionCount] = useState(0);
  const [priceBusyId, setPriceBusyId] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);

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
      setNewSuggestionCount(
        data.preview?.newCount ?? data.preview?.newSuggestions?.length ?? 0,
      );
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
        error(
          err instanceof ApiError
            ? err.message
            : SHOPPING_LIST_PAGE_COPY.loadError,
        );
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
      const data = await generateShoppingList(
        SHOPPING_LIST_PAGE_CONFIG.generateMode,
      );
      applyList(data.list);
      await refreshSuggestions();
      success(
        data.list.stats.pending
          ? SHOPPING_LIST_PAGE_COPY.generatePending(data.list.stats.pending)
          : SHOPPING_LIST_PAGE_COPY.generateEmpty,
      );
    } catch (err) {
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.generateError,
      );
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
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.viewModeError,
      );
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
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.deleteError,
      );
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
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.clearError,
      );
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
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.addError,
      );
    } finally {
      setAdding(false);
    }
  };

  const handleSaveUnitPrices = async (entries = []) => {
    const valid = entries.filter(
      (entry) => entry?.productId && Number(entry.avgUnitPrice) > 0,
    );
    if (valid.length === 0) return;
    setPriceBusyId(SAVE_ALL_BUSY_ID);
    try {
      await Promise.all(
        valid.map((entry) =>
          updateProduct(entry.productId, {
            avgUnitPrice: Number(entry.avgUnitPrice),
          }),
        ),
      );
      success(SHOPPING_LIST_PAGE_COPY.unitPricesSaved(valid.length));
      await load({ silent: true });
    } catch (err) {
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.unitPricesError,
      );
    } finally {
      setPriceBusyId(null);
    }
  };

  const handleShareOpen = async (event) => {
    const anchor = event.currentTarget;
    const currentItems = list?.items || [];
    if (!currentItems.length) {
      error(SHOPPING_LIST_PAGE_COPY.shareEmptyList);
      return;
    }
    setSharing(true);
    try {
      const data = await createShoppingListShare();
      const url = buildSharedListUrl(data.token);
      setShareUrl(url);
      setShareMenuAnchor(anchor);
    } catch (err) {
      error(
        err instanceof ApiError
          ? err.message
          : SHOPPING_LIST_PAGE_COPY.shareError,
      );
    } finally {
      setSharing(false);
    }
  };

  const handleShareMenuClose = () => {
    setShareMenuAnchor(null);
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;
    try {
      await copyTextToClipboard(shareUrl);
      success(SHOPPING_LIST_PAGE_COPY.shareLinkCopied);
      handleShareMenuClose();
    } catch {
      error(SHOPPING_LIST_PAGE_COPY.shareCopyError);
    }
  };

  const handleShareWhatsApp = () => {
    if (!shareUrl) return;
    window.open(
      buildWhatsAppShareUrl(shareUrl),
      "_blank",
      "noopener,noreferrer",
    );
    handleShareMenuClose();
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
        <Typography sx={pageHeaderSubtitleSx}>
          {SHOPPING_LIST_PAGE_COPY.subtitle}
        </Typography>
      </Box>

      <LoadingButton
        variant="contained"
        loading={generating}
        disabled={!canGenerate}
        onClick={handleGenerate}
        title={
          !canGenerate
            ? SHOPPING_LIST_PAGE_COPY.generateDisabledHint
            : undefined
        }
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

      <Stack spacing={1.25}>
        <Stack {...listToolbarRowProps}>
          <Box
            sx={{
              minWidth: { sm: 220 },
              maxWidth: { sm: 320 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
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
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {list?.stats ? (
              <Typography variant="body2" color="text.secondary">
                {SHOPPING_LIST_PAGE_COPY.stats(
                  list.stats.pending,
                  list.stats.checked,
                )}
              </Typography>
            ) : null}
            {items.length > 0 ? (
              <LoadingButton
                type="button"
                variant="text"
                color="error"
                size="small"
                disabled={clearingList || Boolean(busyId) || sharing}
                onClick={() => setClearListOpen(true)}
              >
                {SHOPPING_LIST_PAGE_COPY.clearList}
              </LoadingButton>
            ) : null}
            {items.length > 0 ? (
              <Button
                type="button"
                variant="text"
                size="small"
                startIcon={<IosShareOutlinedIcon />}
                onClick={handleShareOpen}
                disabled={clearingList || Boolean(busyId) || sharing}
                aria-haspopup="menu"
                aria-expanded={Boolean(shareMenuAnchor) ? "true" : undefined}
                aria-controls={
                  shareMenuAnchor ? "shopping-list-share-menu" : undefined
                }
                sx={shareButtonDesktopSx}
              >
                {SHOPPING_LIST_PAGE_COPY.share}
              </Button>
            ) : null}
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

        <Stack spacing={spendBlockSpacing}>
          <Box sx={estimateShareRowSx}>
            <ShoppingListSpendEstimate
              spendEstimate={list?.spendEstimate}
              pendingCount={list?.stats?.pending || 0}
            />
            {items.length > 0 ? (
              <Button
                type="button"
                variant="text"
                size="small"
                startIcon={<IosShareOutlinedIcon />}
                onClick={handleShareOpen}
                disabled={clearingList || Boolean(busyId) || sharing}
                aria-haspopup="menu"
                aria-expanded={Boolean(shareMenuAnchor) ? "true" : undefined}
                aria-controls={
                  shareMenuAnchor ? "shopping-list-share-menu" : undefined
                }
                sx={shareButtonMobileSx}
              >
                {SHOPPING_LIST_PAGE_COPY.share}
              </Button>
            ) : null}
          </Box>
          <ShoppingListSpendMissingPrices
            spendEstimate={list?.spendEstimate}
            busyProductId={priceBusyId}
            onSaveUnitPrices={handleSaveUnitPrices}
          />
        </Stack>
        {items.length > 0 ? (
          <Menu
            id="shopping-list-share-menu"
            anchorEl={shareMenuAnchor}
            open={Boolean(shareMenuAnchor)}
            onClose={handleShareMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleCopyShareLink}>
              <ListItemIcon>
                <ContentCopyOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {SHOPPING_LIST_PAGE_COPY.shareCopyLink}
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShareWhatsApp}>
              <ListItemIcon>
                <WhatsAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {SHOPPING_LIST_PAGE_COPY.shareWhatsApp}
              </ListItemText>
            </MenuItem>
          </Menu>
        ) : null}
      </Stack>

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onClose={handleDeleteCancel}
        title={SHOPPING_LIST_PAGE_COPY.deleteConfirmTitle}
        description={
          itemToDelete
            ? SHOPPING_LIST_PAGE_COPY.deleteConfirmDescription(
                itemToDelete.name,
              )
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

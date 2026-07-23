import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import {
  addShoppingListItem,
  deleteShoppingListItem,
  generateShoppingList,
  getActiveShoppingList,
  setShoppingListViewMode,
  updateShoppingListItem,
} from "../../../services/shoppingListService";
import ShoppingChecklist from "../../../components/shopping/ShoppingChecklist/ShoppingChecklist";
import PaperShoppingList from "../../../components/shopping/PaperShoppingList/PaperShoppingList";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  exampleChipSx,
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
} from "../../../styles/pageStyles";
import { SHOPPING_LIST_PAGE_COPY } from "./shoppingListPageCopy";
import { SHOPPING_LIST_PAGE_CONFIG } from "./shoppingListPageConfig";
import {
  addSectionSpacing,
  examplesRowSx,
  shoppingListStackSpacing,
  toolbarRowProps,
  viewToggleSx,
} from "./ShoppingListPage.styled";

export default function ShoppingListPage() {
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [list, setList] = useState(null);
  const [viewMode, setViewMode] = useState(SHOPPING_LIST_PAGE_CONFIG.defaultViewMode);
  const [addText, setAddText] = useState("");

  const applyList = useCallback((next) => {
    setList(next);
    setViewMode(
      next?.viewMode === SHOPPING_LIST_PAGE_CONFIG.paperViewMode
        ? SHOPPING_LIST_PAGE_CONFIG.paperViewMode
        : SHOPPING_LIST_PAGE_CONFIG.defaultViewMode,
    );
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActiveShoppingList();
      applyList(data.list);
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.loadError);
    } finally {
      setLoading(false);
    }
  }, [applyList, error]);

  useEffect(() => {
    load();
  }, [load]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateShoppingList(SHOPPING_LIST_PAGE_CONFIG.generateMode);
      applyList(data.list);
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

  const handleViewMode = async (_e, value) => {
    if (!value || value === viewMode) return;
    setViewMode(value);
    try {
      const data = await setShoppingListViewMode(value);
      applyList(data.list);
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.viewModeError);
      setViewMode(viewMode);
    }
  };

  const handleToggle = async (item) => {
    setBusyId(item.id);
    try {
      await updateShoppingListItem(item.id, { checked: !item.checked });
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.toggleError);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    setBusyId(item.id);
    try {
      await deleteShoppingListItem(item.id);
      await load();
      success(SHOPPING_LIST_PAGE_COPY.itemRemoved);
    } catch (err) {
      error(err instanceof ApiError ? err.message : SHOPPING_LIST_PAGE_COPY.deleteError);
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async () => {
    const text = addText.trim();
    if (!text) return;
    setAdding(true);
    try {
      const data = await addShoppingListItem({ text });
      setAddText("");
      await load();
      const count = data.items?.length || 1;
      success(
        count > 1
          ? SHOPPING_LIST_PAGE_COPY.itemsAdded(count)
          : SHOPPING_LIST_PAGE_COPY.itemAdded,
      );
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

  return (
    <Stack spacing={shoppingListStackSpacing}>
      <Box>
        <Typography variant="h5">{SHOPPING_LIST_PAGE_COPY.title}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{SHOPPING_LIST_PAGE_COPY.subtitle}</Typography>
      </Box>

      <Stack {...toolbarRowProps}>
        <LoadingButton
          variant="contained"
          loading={generating}
          onClick={handleGenerate}
          fullWidth
        >
          {SHOPPING_LIST_PAGE_COPY.generate}
        </LoadingButton>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={viewMode}
          onChange={handleViewMode}
          sx={viewToggleSx}
        >
          <ToggleButton value={SHOPPING_LIST_PAGE_CONFIG.defaultViewMode}>
            {SHOPPING_LIST_PAGE_COPY.viewList}
          </ToggleButton>
          <ToggleButton value={SHOPPING_LIST_PAGE_CONFIG.paperViewMode}>
            {SHOPPING_LIST_PAGE_COPY.viewPaper}
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {list?.stats && (
        <Typography variant="body2" color="text.secondary">
          {SHOPPING_LIST_PAGE_COPY.stats(list.stats.pending, list.stats.checked)}
        </Typography>
      )}

      {viewMode === SHOPPING_LIST_PAGE_CONFIG.paperViewMode ? (
        <PaperShoppingList
          title={list?.title}
          items={items}
          onToggle={handleToggle}
          onDelete={handleDelete}
          busyId={busyId}
        />
      ) : (
        <ShoppingChecklist
          items={items}
          onToggle={handleToggle}
          onDelete={handleDelete}
          busyId={busyId}
        />
      )}

      <Stack spacing={addSectionSpacing}>
        <Typography variant="h6">{SHOPPING_LIST_PAGE_COPY.addSectionTitle}</Typography>
        <TextField
          label={SHOPPING_LIST_PAGE_COPY.addLabel}
          placeholder={SHOPPING_LIST_PAGE_COPY.addPlaceholder}
          helperText={SHOPPING_LIST_PAGE_COPY.addHelper}
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
        <Stack {...examplesRowSx}>
          {SHOPPING_LIST_PAGE_CONFIG.examples.map((example) => (
            <Chip
              key={example}
              label={example}
              variant="outlined"
              onClick={() => setAddText(example)}
              sx={exampleChipSx}
            />
          ))}
        </Stack>
        <LoadingButton
          variant="contained"
          size="large"
          loading={adding}
          disabled={!addText.trim()}
          onClick={handleAdd}
        >
          {SHOPPING_LIST_PAGE_COPY.addSubmit}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

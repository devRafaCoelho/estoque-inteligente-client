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
import { shoppingListService } from "../../services/shoppingListService";
import ShoppingChecklist from "../../components/shopping/ShoppingChecklist";
import PaperShoppingList from "../../components/shopping/PaperShoppingList";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

export default function ShoppingListPage() {
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [list, setList] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [addText, setAddText] = useState("");

  const applyList = useCallback((next) => {
    setList(next);
    setViewMode(next?.viewMode === "paper" ? "paper" : "list");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await shoppingListService.getActive();
      applyList(data.list);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao carregar lista");
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
      const data = await shoppingListService.generate("rules");
      applyList(data.list);
      success(
        data.list.stats.pending
          ? `Lista atualizada (${data.list.stats.pending} pendentes)`
          : "Nada novo para sugerir agora",
      );
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao gerar lista");
    } finally {
      setGenerating(false);
    }
  };

  const handleViewMode = async (_e, value) => {
    if (!value || value === viewMode) return;
    setViewMode(value);
    try {
      const data = await shoppingListService.setViewMode(value);
      applyList(data.list);
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao salvar visualização");
      setViewMode(viewMode);
    }
  };

  const handleToggle = async (item) => {
    setBusyId(item.id);
    try {
      await shoppingListService.updateItem(item.id, { checked: !item.checked });
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao atualizar item");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    setBusyId(item.id);
    try {
      await shoppingListService.deleteItem(item.id);
      await load();
      success("Item removido");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao remover item");
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async () => {
    const text = addText.trim();
    if (!text) return;
    setAdding(true);
    try {
      const data = await shoppingListService.addItem({ text });
      setAddText("");
      await load();
      const count = data.items?.length || 1;
      success(count > 1 ? `${count} itens adicionados à lista` : "Item adicionado");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao adicionar item");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const items = list?.items || [];

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5">Lista de compras</Typography>
        <Typography color="text.secondary">
          Sugestões por regras: zerados, acabando e recompra por tempo
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
        <LoadingButton
          variant="contained"
          loading={generating}
          onClick={handleGenerate}
          fullWidth
        >
          Gerar com regras
        </LoadingButton>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={viewMode}
          onChange={handleViewMode}
          sx={{ alignSelf: { sm: "center" } }}
        >
          <ToggleButton value="list">Lista</ToggleButton>
          <ToggleButton value="paper">Paper</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {list?.stats && (
        <Typography variant="body2" color="text.secondary">
          {list.stats.pending} pendente(s) · {list.stats.checked} marcado(s)
        </Typography>
      )}

      {viewMode === "paper" ? (
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

      <Stack spacing={1.5}>
        <Typography variant="h6">Adicionar à lista</Typography>
        <TextField
          label="O que você precisa comprar?"
          placeholder="Ex.: 2kg de arroz, 1 lata de leite em pó"
          helperText='Separe por vírgula ou "e" — igual à tela de entrada'
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {[
            "2kg de arroz, 1 lata de leite em pó",
            "500g feijão, 1 azeite, 3 bananas",
            "1 pacote de café e 2 litros de leite",
          ].map((example) => (
            <Chip
              key={example}
              label={example}
              variant="outlined"
              onClick={() => setAddText(example)}
              sx={{ maxWidth: "100%" }}
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
          Interpretar e adicionar
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

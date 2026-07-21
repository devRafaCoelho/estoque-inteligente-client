import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UndoIcon from "@mui/icons-material/Undo";
import { CATEGORY_LABELS, UNIT_LABELS } from "../../config/constants";
import { intakeService } from "../../services/intakeService";
import LoadingButton from "../../components/common/LoadingButton";
import { useAppSnackbar } from "../../hooks/useAppSnackbar";
import { ApiError } from "../../services/apiClient";

function confidenceLabel(confidence) {
  if (confidence == null) return null;
  if (confidence >= 0.75) return { label: "Alta confiança", color: "success" };
  if (confidence >= 0.6) return { label: "Média confiança", color: "warning" };
  return { label: "Baixa confiança", color: "error" };
}

export default function IntakePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [intake, setIntake] = useState(null);
  const [items, setItems] = useState([]);
  const [storeName, setStoreName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await intakeService.get(id);
      setIntake(data.intake);
      setItems(data.intake.items || []);
      setStoreName(data.intake.storeName || "");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao carregar preview");
      navigate("/entrada");
    } finally {
      setLoading(false);
    }
  }, [id, error, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount = useMemo(
    () => items.filter((item) => !item.excluded).length,
    [items],
  );

  const updateItem = (itemId, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );
  };

  const buildPayload = () => ({
    storeName: storeName.trim() || null,
    items: items.map((item, index) => ({
      id: item.id,
      productId: item.productId || null,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      category: item.category || "other",
      unitPrice:
        item.unitPrice === "" || item.unitPrice == null
          ? null
          : Number(item.unitPrice),
      excluded: Boolean(item.excluded),
      confidence: item.confidence ?? null,
      matchedExisting: Boolean(item.matchedExisting),
      sortOrder: index,
    })),
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const data = await intakeService.update(id, buildPayload());
      setIntake(data.intake);
      setItems(data.intake.items || []);
      success("Rascunho atualizado");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao salvar rascunho");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (activeCount === 0) {
      error("Selecione ao menos um item para confirmar");
      return;
    }
    setConfirming(true);
    try {
      const data = await intakeService.confirm(id, buildPayload());
      const count = data.products?.length || activeCount;
      success(
        data.purchase
          ? `Estoque atualizado (${count} itens) e compra registrada`
          : `Estoque atualizado (${count} itens)`,
      );
      navigate("/produtos");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao confirmar entrada");
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await intakeService.cancel(id);
      success("Entrada cancelada");
      navigate("/entrada");
    } catch (err) {
      error(err instanceof ApiError ? err.message : "Erro ao cancelar");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!intake) return null;

  if (intake.status !== "draft") {
    return (
      <Stack spacing={2}>
        <Typography variant="h5">Entrada {intake.status === "confirmed" ? "confirmada" : "cancelada"}</Typography>
        <Typography color="text.secondary">Este rascunho não pode mais ser editado.</Typography>
        <Button variant="contained" onClick={() => navigate("/produtos")}>
          Ver produtos
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => navigate("/entrada")} aria-label="Voltar">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5">Conferir compra</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Revise os itens antes de gravar no estoque
          </Typography>
        </Box>
      </Stack>

      {intake.rawInput && (
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            Texto original
          </Typography>
          <Typography variant="body2">{intake.rawInput}</Typography>
        </Box>
      )}

      <TextField
        label="Estabelecimento (opcional)"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        fullWidth
      />

      <Stack spacing={1.5}>
        {items.map((item) => {
          const conf = confidenceLabel(item.confidence);
          return (
            <Box
              key={item.id}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: item.excluded ? "divider" : "primary.light",
                opacity: item.excluded ? 0.55 : 1,
              }}
            >
              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  {item.matchedExisting && (
                    <Chip size="small" color="primary" variant="outlined" label="Já no estoque" />
                  )}
                  {conf && (
                    <Chip size="small" color={conf.color} variant="outlined" label={conf.label} />
                  )}
                  <Box sx={{ flex: 1 }} />
                  <IconButton
                    size="small"
                    onClick={() => updateItem(item.id, { excluded: !item.excluded })}
                    aria-label={item.excluded ? "Reincluir item" : "Excluir item"}
                  >
                    {item.excluded ? <UndoIcon fontSize="small" /> : <DeleteOutlineIcon fontSize="small" />}
                  </IconButton>
                </Stack>

                <TextField
                  label="Nome"
                  size="small"
                  value={item.name}
                  disabled={item.excluded}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  fullWidth
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <TextField
                    label="Qtd"
                    type="number"
                    size="small"
                    value={item.quantity}
                    disabled={item.excluded}
                    inputProps={{ step: "any", min: 0 }}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Unidade"
                    size="small"
                    value={item.unit || "un"}
                    disabled={item.excluded}
                    onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                    sx={{ minWidth: { sm: 120 } }}
                    fullWidth
                  >
                    {Object.entries(UNIT_LABELS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Categoria"
                    size="small"
                    value={item.category || "other"}
                    disabled={item.excluded}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    fullWidth
                  >
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Preço un."
                    type="number"
                    size="small"
                    value={item.unitPrice ?? ""}
                    disabled={item.excluded}
                    inputProps={{ step: "0.01", min: 0 }}
                    onChange={(e) => updateItem(item.id, { unitPrice: e.target.value })}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <Divider />

      <Typography variant="body2" color="text.secondary">
        {activeCount} de {items.length} item(ns) serão gravados
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
        <LoadingButton
          variant="contained"
          size="large"
          loading={confirming}
          disabled={activeCount === 0 || saving || cancelling}
          onClick={handleConfirm}
          fullWidth
        >
          Confirmar no estoque
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          size="large"
          loading={saving}
          disabled={confirming || cancelling}
          onClick={handleSaveDraft}
          fullWidth
        >
          Salvar rascunho
        </LoadingButton>
      </Stack>

      <Button
        color="inherit"
        disabled={confirming || saving || cancelling}
        onClick={handleCancel}
      >
        {cancelling ? "Cancelando…" : "Cancelar entrada"}
      </Button>
    </Stack>
  );
}

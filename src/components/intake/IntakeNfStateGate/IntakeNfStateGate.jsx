import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BrazilianStateSelectField from "../../form/BrazilianStateSelectField";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import { getNfCoverage } from "../../../services/nfService";
import { INTAKE_NF_STATE_GATE_COPY } from "./intakeNfStateGateConfig";

/**
 * Pedido único de UF quando o usuário ainda não tem default_state (F2-5.4).
 * Com preferência salva, o fluxo de QR pula este passo.
 */
export default function IntakeNfStateGate({
  initialState = "",
  loading = false,
  disabled = false,
  onConfirm,
  onCancel,
  onUsePhoto,
}) {
  const [stateCode, setStateCode] = useState(String(initialState || "").toUpperCase());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [supportedHint, setSupportedHint] = useState(
    INTAKE_NF_STATE_GATE_COPY.supportedDefault,
  );

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const data = await getNfCoverage();
        if (!ativo) return;
        const list = data.supportedStates || [];
        if (list.length) {
          setSupportedHint(
            INTAKE_NF_STATE_GATE_COPY.supportedHint(list.join(", ")),
          );
        }
      } catch {
        // mantém hint padrão
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const busy = Boolean(loading || disabled || saving);
  const canContinue = /^[A-Z]{2}$/.test(stateCode);

  const handleConfirm = async () => {
    if (!canContinue || busy) return;
    setError("");
    setSaving(true);
    try {
      await onConfirm?.(stateCode);
    } catch (err) {
      setError(err?.message || INTAKE_NF_STATE_GATE_COPY.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography fontWeight={700}>{INTAKE_NF_STATE_GATE_COPY.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {INTAKE_NF_STATE_GATE_COPY.hint}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 0.75 }}
        >
          {supportedHint}
        </Typography>
      </Box>

      <BrazilianStateSelectField
        label={INTAKE_NF_STATE_GATE_COPY.label}
        value={stateCode}
        onChange={(next) => {
          setError("");
          setStateCode(String(next || "").toUpperCase());
        }}
        required
        disabled={busy}
        error={Boolean(error)}
        helperText={error || INTAKE_NF_STATE_GATE_COPY.helper}
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <LoadingButton
          type="button"
          variant="contained"
          loading={saving}
          disabled={busy || !canContinue}
          onClick={handleConfirm}
        >
          {INTAKE_NF_STATE_GATE_COPY.continue}
        </LoadingButton>
        {onCancel && (
          <LoadingButton
            type="button"
            variant="text"
            disabled={busy}
            onClick={() => onCancel()}
          >
            {INTAKE_NF_STATE_GATE_COPY.cancel}
          </LoadingButton>
        )}
        {onUsePhoto && (
          <LoadingButton
            type="button"
            variant="text"
            disabled={busy}
            onClick={() => onUsePhoto()}
          >
            {INTAKE_NF_STATE_GATE_COPY.usePhoto}
          </LoadingButton>
        )}
      </Stack>
    </Stack>
  );
}

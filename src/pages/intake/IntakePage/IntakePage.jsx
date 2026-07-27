import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { textParseSchema } from "../../../schemas/intake/textParseSchema";
import {
  cancelIntake,
  clearIntakeDrafts,
  listIntakes,
  parseIntakeImage,
  parseIntakeNfQr,
  parseIntakeText,
} from "../../../services/intakeService";
import { buildIntakeParsePayload } from "../../../utils/intake/intakeForm";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import IntakeModeTabs from "../../../components/intake/IntakeModeTabs/IntakeModeTabs";
import IntakePhotoPanel from "../../../components/intake/IntakePhotoPanel/IntakePhotoPanel";
import { INTAKE_PHOTO_CONFIG } from "../../../components/intake/IntakePhotoPanel/intakePhotoConfig";
import ManualProductStage from "../../../components/products/ManualProductStage/ManualProductStage";
import SpeechTextField from "../../../components/voice/SpeechRecordButton/SpeechTextField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import { ApiError } from "../../../services/apiClient";
import { updateMe } from "../../../services/userService";
import { resolveOcrError, withTimeout } from "../../../utils/intake/ocrError";
import { compressReceiptImage } from "../../../utils/intake/compressReceiptImage";
import { resolveNfError } from "../../../utils/intake/nfError";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import {
  formatIntakeDraftTitle,
  formatIntakeDraftUpdatedAt,
  INTAKE_PAGE_COPY,
} from "./intakePageCopy";
import { INTAKE_PAGE_CONFIG } from "./intakePageConfig";
import {
  draftItemBodySx,
  draftItemMetaSx,
  draftItemSx,
  draftsHeaderIconSx,
  draftsHeaderRowSx,
  draftsHeaderTitleRowSx,
  draftsHeaderTitleSx,
  draftsSectionSpacing,
  intakeFormStackSpacing,
  textModeStackSpacing,
  voiceHintSx,
} from "./IntakePage.styled";

function resolveInitialMode(searchParams) {
  const raw = String(searchParams.get("mode") || "").toLowerCase();
  if (raw === "photo" || raw === "qr" || raw === "nfe" || raw === "nf") {
    return INTAKE_PAGE_CONFIG.modes.photo;
  }
  if (raw === "manual") return INTAKE_PAGE_CONFIG.modes.manual;
  // voice legado → texto (mic no mesmo campo)
  if (raw === "text" || raw === "voice") return INTAKE_PAGE_CONFIG.modes.text;
  return INTAKE_PAGE_CONFIG.defaultMode;
}

function shouldStartInQr(searchParams) {
  const raw = String(searchParams.get("mode") || "").toLowerCase();
  return raw === "qr" || raw === "nfe" || raw === "nf";
}

export default function IntakePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateSessionUser } = useAuth();
  const { success, error } = useAppSnackbar();
  const [mode, setMode] = useState(() => resolveInitialMode(searchParams));
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [nfLoading, setNfLoading] = useState(false);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [draftToDiscard, setDraftToDiscard] = useState(null);
  const [discarding, setDiscarding] = useState(false);
  const [clearDraftsOpen, setClearDraftsOpen] = useState(false);
  const [clearingDrafts, setClearingDrafts] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(textParseSchema),
    defaultValues: INTAKE_PAGE_CONFIG.defaultValues,
    mode: INTAKE_PAGE_CONFIG.formMode,
  });

  const text = watch("text");
  const { ref: textRef, ...textField } = register("text");
  const busy = loading || photoLoading || nfLoading;
  const isTextMode = mode === INTAKE_PAGE_CONFIG.modes.text;
  const isPhotoMode = mode === INTAKE_PAGE_CONFIG.modes.photo;
  const isManualMode = mode === INTAKE_PAGE_CONFIG.modes.manual;
  const startPhotoInQr = shouldStartInQr(searchParams);

  const loadDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const data = await listIntakes({
        status: INTAKE_PAGE_CONFIG.draftsStatus,
        limit: INTAKE_PAGE_CONFIG.draftsLimit,
      });
      setDrafts(data.intakes || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.draftsLoadError);
    } finally {
      setDraftsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  useEffect(() => {
    setMode(resolveInitialMode(searchParams));
  }, [searchParams]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await parseIntakeText(buildIntakeParsePayload(values));
      navigate(INTAKE_PAGE_CONFIG.paths.preview(data.intake.id));
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.parseError);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSubmit = async (file) => {
    setPhotoError(null);
    setPhotoLoading(true);
    try {
      const compressed = await compressReceiptImage(file, {
        maxEdge: INTAKE_PHOTO_CONFIG.compressMaxEdge,
        quality: INTAKE_PHOTO_CONFIG.compressQuality,
        maxBytes: INTAKE_PHOTO_CONFIG.compressMaxBytes,
      });
      const data = await withTimeout(
        parseIntakeImage(compressed),
        INTAKE_PHOTO_CONFIG.parseTimeoutMs,
      );
      const intake = data?.intake;
      if (!intake?.id || !Array.isArray(intake.items) || intake.items.length === 0) {
        setPhotoError({
          message: INTAKE_PAGE_COPY.photoEmptyError,
          canRetry: true,
        });
        return;
      }
      navigate(INTAKE_PAGE_CONFIG.paths.preview(intake.id));
    } catch (err) {
      const resolved = resolveOcrError(err);
      setPhotoError({
        message: resolved.message,
        canRetry: resolved.canRetry,
      });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleModeChange = (next) => {
    setPhotoError(null);
    setMode(next);
  };

  const handleUseTextFromPhoto = () => {
    setPhotoError(null);
    setMode(INTAKE_PAGE_CONFIG.modes.text);
  };

  const handleSaveDefaultState = async (code) => {
    const data = await updateMe({ defaultState: code });
    const nextUser = data?.user || { ...user, defaultState: code };
    updateSessionUser(nextUser);
    return nextUser;
  };

  const handleNfValidated = async (payload) => {
    setPhotoError(null);
    setNfLoading(true);
    try {
      const data = await parseIntakeNfQr({
        qrContent: payload.qrContent || undefined,
        accessKey: payload.accessKey,
        // Preferência default_state preenche quando o QR não traz UF clara (F2-5.4).
        stateCode: payload.stateCode || user?.defaultState || undefined,
      });
      const intake = data?.intake;
      if (!intake?.id || !Array.isArray(intake.items) || intake.items.length === 0) {
        setPhotoError({
          message: INTAKE_PAGE_COPY.nfEmptyError,
          canRetry: true,
          fallbackPhoto: true,
          needsState: false,
        });
        throw new Error("empty");
      }
      navigate(INTAKE_PAGE_CONFIG.paths.preview(intake.id));
    } catch (err) {
      if (err?.message === "empty") throw err;
      const resolved = resolveNfError(err);
      setPhotoError({
        message: resolved.message,
        canRetry: resolved.canRetryQr,
        fallbackPhoto: resolved.fallbackPhoto,
        needsState: Boolean(resolved.needsState),
      });
      throw err;
    } finally {
      setNfLoading(false);
    }
  };

  const handleContinueDraft = (draft) => {
    navigate(INTAKE_PAGE_CONFIG.paths.preview(draft.id));
  };

  const handleDiscardConfirm = async () => {
    if (!draftToDiscard) return;
    setDiscarding(true);
    try {
      await cancelIntake(draftToDiscard.id);
      setDrafts((prev) => prev.filter((row) => row.id !== draftToDiscard.id));
      setDraftToDiscard(null);
      success(INTAKE_PAGE_COPY.draftDiscarded);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.draftDiscardError);
    } finally {
      setDiscarding(false);
    }
  };

  const handleClearDraftsConfirm = async () => {
    setClearingDrafts(true);
    try {
      await clearIntakeDrafts();
      setDrafts([]);
      setClearDraftsOpen(false);
      success(INTAKE_PAGE_COPY.clearDraftsSuccess);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.clearDraftsError);
    } finally {
      setClearingDrafts(false);
    }
  };

  return (
    <Stack
      spacing={intakeFormStackSpacing}
      component={isTextMode ? "form" : "div"}
      onSubmit={isTextMode ? handleSubmit(onSubmit) : undefined}
      noValidate={isTextMode || undefined}
    >
      <Box>
        <Typography variant="h5">{INTAKE_PAGE_COPY.title}</Typography>
        <Typography variant="body2" sx={pageHeaderSubtitleSx}>
          {INTAKE_PAGE_COPY.subtitle}
        </Typography>
      </Box>

      <IntakeModeTabs value={mode} onChange={handleModeChange} disabled={busy} />

      {isTextMode && (
        <Stack spacing={textModeStackSpacing}>
          <Typography variant="body2" color="text.secondary" sx={voiceHintSx}>
            {INTAKE_PAGE_COPY.textHint}
          </Typography>
          <SpeechTextField
            label={INTAKE_PAGE_COPY.textLabel}
            placeholder={INTAKE_PAGE_COPY.textPlaceholder}
            fullWidth
            minRows={2}
            maxRows={8}
            error={Boolean(errors.text)}
            helperText={errors.text?.message}
            value={text ?? ""}
            inputRef={textRef}
            speechDisabled={busy}
            showSubmit
            submitType="submit"
            submitLoading={loading}
            submitDisabled={String(text || "").trim().length < 3 || busy}
            submitAriaLabel={INTAKE_PAGE_COPY.submitAria}
            slotProps={{ inputLabel: { shrink: true } }}
            {...textField}
            onChange={(next) =>
              setValue("text", next, { shouldValidate: true, shouldDirty: true })
            }
          />
        </Stack>
      )}

      {isPhotoMode && (
        <IntakePhotoPanel
          loading={photoLoading || nfLoading}
          disabled={busy}
          startInQr={startPhotoInQr}
          defaultState={user?.defaultState || ""}
          onSaveDefaultState={handleSaveDefaultState}
          errorMessage={photoError?.message || null}
          sefazFallback={Boolean(photoError?.fallbackPhoto)}
          needsState={Boolean(photoError?.needsState)}
          canRetry={photoError?.canRetry !== false}
          onClearError={() => setPhotoError(null)}
          onUseText={handleUseTextFromPhoto}
          onNfValidated={handleNfValidated}
          onInvalid={(message) => error(message)}
          onSubmit={handlePhotoSubmit}
        />
      )}

      {isManualMode && (
        <ManualProductStage
          disabled={busy}
          onSaved={() => navigate(INTAKE_PAGE_CONFIG.paths.products)}
        />
      )}

      {!draftsLoading && drafts.length > 0 && (
        <Stack spacing={draftsSectionSpacing}>
          <Box sx={draftsHeaderRowSx}>
            <Box sx={draftsHeaderTitleRowSx}>
              <DraftsOutlinedIcon sx={draftsHeaderIconSx} aria-hidden />
              <Typography variant="h6" sx={draftsHeaderTitleSx}>
                {INTAKE_PAGE_COPY.draftsTitle}
              </Typography>
            </Box>
            <LoadingButton
              type="button"
              variant="text"
              color="error"
              size="small"
              disabled={clearingDrafts || busy}
              onClick={() => setClearDraftsOpen(true)}
            >
              {INTAKE_PAGE_COPY.clearDrafts}
            </LoadingButton>
          </Box>
          <Stack spacing={1}>
            {drafts.map((draft) => {
              const updatedLabel = formatIntakeDraftUpdatedAt(draft.updatedAt);
              return (
                <Box
                  key={draft.id}
                  onClick={() => handleContinueDraft(draft)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleContinueDraft(draft);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  sx={draftItemSx}
                  aria-label={INTAKE_PAGE_COPY.draftContinueAria}
                >
                  <Box sx={draftItemBodySx}>
                    <Typography fontWeight={700} noWrap>
                      {formatIntakeDraftTitle(draft)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={draftItemMetaSx}>
                      {INTAKE_PAGE_COPY.draftItems(draft.itemCount)}
                      {updatedLabel ? ` · ${updatedLabel}` : ""}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={INTAKE_PAGE_COPY.draftDiscardAria}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDraftToDiscard(draft);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      )}

      {!isManualMode && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {INTAKE_PAGE_COPY.stockOutPrompt}{" "}
          <Link component={RouterLink} to={INTAKE_PAGE_CONFIG.paths.stockOut} fontWeight={700}>
            {INTAKE_PAGE_COPY.stockOutLink}
          </Link>
        </Typography>
      )}

      <ConfirmDialog
        open={Boolean(draftToDiscard)}
        onClose={() => {
          if (discarding) return;
          setDraftToDiscard(null);
        }}
        title={INTAKE_PAGE_COPY.draftDiscardTitle}
        description={INTAKE_PAGE_COPY.draftDiscardDescription}
        onConfirm={handleDiscardConfirm}
        confirmLoading={discarding}
        confirmLabel={INTAKE_PAGE_COPY.draftDiscardConfirm}
        cancelLabel={INTAKE_PAGE_COPY.draftDiscardCancel}
      />

      <ConfirmDialog
        open={clearDraftsOpen}
        onClose={() => {
          if (clearingDrafts) return;
          setClearDraftsOpen(false);
        }}
        title={INTAKE_PAGE_COPY.clearDraftsTitle}
        description={INTAKE_PAGE_COPY.clearDraftsDescription}
        onConfirm={handleClearDraftsConfirm}
        confirmLoading={clearingDrafts}
        confirmLabel={INTAKE_PAGE_COPY.clearDraftsConfirm}
        cancelLabel={INTAKE_PAGE_COPY.clearDraftsCancel}
      />
    </Stack>
  );
}

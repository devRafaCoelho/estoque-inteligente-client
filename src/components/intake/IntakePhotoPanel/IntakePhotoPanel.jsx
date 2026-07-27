import { useEffect, useId, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import IntakeNfPanel from "../IntakeNfPanel/IntakeNfPanel";
import IntakeNfStateGate from "../IntakeNfStateGate/IntakeNfStateGate";
import {
  INTAKE_PHOTO_CONFIG,
  INTAKE_PHOTO_COPY,
} from "./intakePhotoConfig";
import {
  photoActionsSx,
  photoChangeButtonSx,
  photoClearButtonSx,
  photoDropSx,
  photoErrorActionsSx,
  photoErrorAlertSx,
  photoOverlaySx,
  photoPreviewImgSx,
  photoPreviewWrapSx,
  photoSubmitButtonSx,
  photoSubmitRowSx,
} from "./IntakePhotoPanel.styled";

function isAllowedFile(file) {
  if (!file) return false;
  if (INTAKE_PHOTO_CONFIG.acceptList.includes(file.type)) return true;
  const name = String(file.name || "").toLowerCase();
  return /\.(jpe?g|png|webp)$/.test(name);
}

/**
 * Captura/galeria de nota + QR + fallback SEFAZ → foto (F2-5.3).
 * F2-5.4: com default_state, QR abre direto; sem preferência, pede UF uma vez.
 */
export default function IntakePhotoPanel({
  onSubmit,
  onNfValidated,
  startInQr = false,
  defaultState = "",
  onSaveDefaultState,
  loading = false,
  disabled = false,
  errorMessage = null,
  sefazFallback = false,
  needsState = false,
  canRetry = true,
  onClearError,
  onUseText,
  onInvalid,
}) {
  const cameraInputId = useId();
  const galleryInputId = useId();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [qrMode, setQrMode] = useState(false);
  const [stateGate, setStateGate] = useState(false);

  const hasDefaultState = /^[A-Z]{2}$/i.test(String(defaultState || "").trim());

  const openQrFlow = () => {
    onClearError?.();
    if (hasDefaultState) {
      setStateGate(false);
      setQrMode(true);
      return;
    }
    setQrMode(false);
    setStateGate(true);
  };

  useEffect(() => {
    if (sefazFallback) {
      setQrMode(false);
      setStateGate(false);
      return;
    }
    if (needsState) {
      setQrMode(false);
      setStateGate(true);
      return;
    }
    if (!startInQr) return;
    if (hasDefaultState) {
      setStateGate(false);
      setQrMode(true);
    } else {
      setQrMode(false);
      setStateGate(true);
    }
  }, [startInQr, sefazFallback, needsState, hasDefaultState]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pickFile = (next) => {
    if (!next) return;
    if (!isAllowedFile(next)) {
      onInvalid?.(INTAKE_PHOTO_COPY.invalidType);
      return;
    }
    if (next.size > INTAKE_PHOTO_CONFIG.maxBytes) {
      onInvalid?.(INTAKE_PHOTO_COPY.tooLarge);
      return;
    }
    onClearError?.();
    setQrMode(false);
    setStateGate(false);
    setFile(next);
  };

  const clearFile = () => {
    if (loading) return;
    onClearError?.();
    setFile(null);
    if (cameraRef.current) cameraRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const busy = Boolean(loading || disabled);
  const hasError = Boolean(errorMessage) && !sefazFallback && !needsState;

  if (stateGate && !sefazFallback) {
    return (
      <IntakeNfStateGate
        initialState={defaultState}
        loading={busy}
        disabled={busy}
        onConfirm={async (code) => {
          await onSaveDefaultState?.(code);
          onClearError?.();
          setStateGate(false);
          setQrMode(true);
        }}
        onCancel={() => {
          onClearError?.();
          setStateGate(false);
          setQrMode(false);
        }}
        onUsePhoto={() => {
          onClearError?.();
          setStateGate(false);
          setQrMode(false);
        }}
      />
    );
  }

  if (qrMode && !sefazFallback) {
    return (
      <IntakeNfPanel
        disabled={busy}
        loading={loading}
        errorMessage={errorMessage}
        onValidated={onNfValidated}
        onCancel={() => {
          onClearError?.();
          setQrMode(false);
        }}
        onUsePhoto={() => {
          onClearError?.();
          setQrMode(false);
        }}
      />
    );
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography fontWeight={700}>{INTAKE_PHOTO_COPY.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {INTAKE_PHOTO_COPY.hint}
        </Typography>
      </Box>

      {sefazFallback ? (
        <Alert
          severity="warning"
          onClose={busy ? undefined : () => onClearError?.()}
          role="alert"
          sx={photoErrorAlertSx}
        >
          <AlertTitle>{INTAKE_PHOTO_COPY.sefazFallbackTitle}</AlertTitle>
          {errorMessage || INTAKE_PHOTO_COPY.sefazFallbackHint}
          <Typography variant="body2" sx={{ mt: 1 }}>
            {INTAKE_PHOTO_COPY.sefazFallbackHint}
          </Typography>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={1}
            sx={photoErrorActionsSx}
            flexWrap={{ lg: "wrap" }}
          >
            <LoadingButton
              type="button"
              size="small"
              variant="contained"
              disabled={busy}
              startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => cameraRef.current?.click()}
            >
              {INTAKE_PHOTO_COPY.sefazFallbackCamera}
            </LoadingButton>
            <LoadingButton
              type="button"
              size="small"
              variant="outlined"
              disabled={busy}
              startIcon={<CollectionsOutlinedIcon />}
              onClick={() => galleryRef.current?.click()}
            >
              {INTAKE_PHOTO_COPY.sefazFallbackGallery}
            </LoadingButton>
            <LoadingButton
              type="button"
              size="small"
              variant="text"
              disabled={busy}
              startIcon={<QrCodeScannerOutlinedIcon />}
              onClick={openQrFlow}
            >
              {INTAKE_PHOTO_COPY.sefazFallbackRetryQr}
            </LoadingButton>
          </Stack>
        </Alert>
      ) : null}

      <input
        id={cameraInputId}
        ref={cameraRef}
        type="file"
        accept={INTAKE_PHOTO_CONFIG.accept}
        capture={INTAKE_PHOTO_CONFIG.cameraCapture}
        hidden
        disabled={busy}
        onChange={(e) => {
          pickFile(e.target.files?.[0] || null);
        }}
      />
      <input
        id={galleryInputId}
        ref={galleryRef}
        type="file"
        accept={INTAKE_PHOTO_CONFIG.accept}
        hidden
        disabled={busy}
        onChange={(e) => {
          pickFile(e.target.files?.[0] || null);
        }}
      />

      {previewUrl ? (
        <Box sx={photoPreviewWrapSx}>
          <Box
            component="img"
            src={previewUrl}
            alt={INTAKE_PHOTO_COPY.previewAlt}
            sx={photoPreviewImgSx}
          />
          {!loading && (
            <IconButton
              size="small"
              aria-label={INTAKE_PHOTO_COPY.clearAria}
              onClick={clearFile}
              sx={photoClearButtonSx}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          )}
          {loading && (
            <Box sx={photoOverlaySx} role="status" aria-live="polite">
              <CircularProgress size={36} color="inherit" />
              <Typography fontWeight={700}>{INTAKE_PHOTO_COPY.reading}</Typography>
            </Box>
          )}
        </Box>
      ) : !sefazFallback ? (
        <Box sx={photoDropSx}>
          <Stack spacing={1} direction={{ xs: "column", lg: "row" }} sx={photoActionsSx}>
            <LoadingButton
              type="button"
              variant="outlined"
              startIcon={<PhotoCameraOutlinedIcon />}
              disabled={busy}
              onClick={() => cameraRef.current?.click()}
            >
              {INTAKE_PHOTO_COPY.camera}
            </LoadingButton>
            <LoadingButton
              type="button"
              variant="outlined"
              startIcon={<CollectionsOutlinedIcon />}
              disabled={busy}
              onClick={() => galleryRef.current?.click()}
            >
              {INTAKE_PHOTO_COPY.gallery}
            </LoadingButton>
            <LoadingButton
              type="button"
              variant="outlined"
              startIcon={<QrCodeScannerOutlinedIcon />}
              disabled={busy}
              onClick={openQrFlow}
            >
              {INTAKE_PHOTO_COPY.qr}
            </LoadingButton>
          </Stack>
        </Box>
      ) : null}

      {hasError && (
        <Alert
          severity="warning"
          onClose={busy ? undefined : () => onClearError?.()}
          role="alert"
          sx={photoErrorAlertSx}
        >
          <AlertTitle>{INTAKE_PHOTO_COPY.errorTitle}</AlertTitle>
          {errorMessage}
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={1}
            sx={photoErrorActionsSx}
            flexWrap={{ lg: "wrap" }}
          >
            {canRetry && file && (
              <LoadingButton
                type="button"
                size="small"
                variant="contained"
                disabled={busy}
                onClick={() => {
                  onClearError?.();
                  onSubmit?.(file);
                }}
              >
                {INTAKE_PHOTO_COPY.retry}
              </LoadingButton>
            )}
            <LoadingButton
              type="button"
              size="small"
              variant="outlined"
              disabled={busy}
              onClick={() => galleryRef.current?.click()}
            >
              {INTAKE_PHOTO_COPY.change}
            </LoadingButton>
            {onUseText && (
              <LoadingButton
                type="button"
                size="small"
                variant="text"
                disabled={busy}
                onClick={() => onUseText()}
              >
                {INTAKE_PHOTO_COPY.useText}
              </LoadingButton>
            )}
          </Stack>
        </Alert>
      )}

      {file && (!hasError || sefazFallback) && (
        <Stack direction="row" spacing={1.5} sx={photoSubmitRowSx}>
          {!loading && !sefazFallback && (
            <LoadingButton
              type="button"
              variant="outlined"
              disabled={busy}
              onClick={() => galleryRef.current?.click()}
              sx={photoChangeButtonSx}
            >
              {INTAKE_PHOTO_COPY.change}
            </LoadingButton>
          )}
          <LoadingButton
            type="button"
            variant="contained"
            loading={loading}
            disabled={busy || !file}
            onClick={() => onSubmit?.(file)}
            sx={photoSubmitButtonSx}
          >
            {INTAKE_PHOTO_COPY.submit}
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  );
}

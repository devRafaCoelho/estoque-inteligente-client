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
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import {
  INTAKE_PHOTO_CONFIG,
  INTAKE_PHOTO_COPY,
} from "./intakePhotoConfig";
import {
  photoActionsSx,
  photoDropSx,
  photoErrorActionsSx,
  photoOverlaySx,
  photoPreviewImgSx,
  photoPreviewWrapSx,
} from "./IntakePhotoPanel.styled";

function isAllowedFile(file) {
  if (!file) return false;
  if (INTAKE_PHOTO_CONFIG.acceptList.includes(file.type)) return true;
  const name = String(file.name || "").toLowerCase();
  return /\.(jpe?g|png|webp)$/.test(name);
}

/**
 * Captura/galeria de cupom + “Lendo cupom…” + erro com retry (mantém a prévia).
 *
 * @param {{
 *   onSubmit: (file: File) => void | Promise<void>,
 *   loading?: boolean,
 *   disabled?: boolean,
 *   errorMessage?: string | null,
 *   canRetry?: boolean,
 *   onClearError?: () => void,
 *   onUseText?: () => void,
 *   onInvalid?: (message: string) => void,
 * }} props
 */
export default function IntakePhotoPanel({
  onSubmit,
  loading = false,
  disabled = false,
  errorMessage = null,
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
  const hasError = Boolean(errorMessage);

  return (
    <Stack spacing={2}>
      <Box>
        <Typography fontWeight={700}>{INTAKE_PHOTO_COPY.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {INTAKE_PHOTO_COPY.hint}
        </Typography>
      </Box>

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
              sx={{ position: "absolute", top: 8, right: 8, bgcolor: "background.paper" }}
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
      ) : (
        <Box sx={photoDropSx}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {INTAKE_PHOTO_COPY.hint}
          </Typography>
          <Stack direction="row" spacing={1} sx={photoActionsSx}>
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
          </Stack>
        </Box>
      )}

      {hasError && (
        <Alert
          severity="warning"
          onClose={busy ? undefined : () => onClearError?.()}
          role="alert"
        >
          <AlertTitle>{INTAKE_PHOTO_COPY.errorTitle}</AlertTitle>
          {errorMessage}
          <Stack direction="row" spacing={1} sx={photoErrorActionsSx} flexWrap="wrap">
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

      {file && !hasError && (
        <Stack direction="row" spacing={1}>
          {!loading && (
            <LoadingButton
              type="button"
              variant="text"
              disabled={busy}
              onClick={() => galleryRef.current?.click()}
            >
              {INTAKE_PHOTO_COPY.change}
            </LoadingButton>
          )}
          <LoadingButton
            type="button"
            variant="contained"
            fullWidth
            loading={loading}
            disabled={!file || disabled}
            onClick={() => onSubmit?.(file)}
          >
            {loading ? INTAKE_PHOTO_COPY.reading : INTAKE_PHOTO_COPY.submit}
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  );
}

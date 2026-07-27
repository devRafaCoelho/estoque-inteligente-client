import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BrowserQRCodeReader } from "@zxing/browser";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import { parseNfQrPayload } from "../../../utils/nf/nfQrPayload";
import {
  INTAKE_NF_CONFIG,
  INTAKE_NF_COPY,
  nfPayloadErrorMessage,
} from "./intakeNfConfig";
import {
  nfPanelStackSpacing,
  nfScannerHintSx,
  nfScannerVideoSx,
  nfScannerWrapSx,
  nfOverlaySx,
} from "./IntakeNfPanel.styled";

function waitForVideoElement(ref, { attempts = 20 } = {}) {
  return new Promise((resolve, reject) => {
    let left = attempts;
    const tick = () => {
      if (ref.current) {
        resolve(ref.current);
        return;
      }
      left -= 1;
      if (left <= 0) {
        reject(new Error("video_missing"));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

/**
 * Scanner de QR da NF-e: abre a câmera direto e devolve o payload validado.
 */
export default function IntakeNfPanel({
  disabled = false,
  loading = false,
  errorMessage = null,
  onValidated,
  onCancel,
  onUsePhoto,
}) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const onValidatedRef = useRef(onValidated);
  const handledRef = useRef(false);
  const sessionRef = useRef(0);

  /** live = câmera ativa / abrindo; error = falhou (mostra retry) */
  const [phase, setPhase] = useState("live");
  const [scanMessage, setScanMessage] = useState("");
  const [startToken, setStartToken] = useState(0);

  useEffect(() => {
    onValidatedRef.current = onValidated;
  }, [onValidated]);

  const stopTracksOnly = useCallback(() => {
    try {
      controlsRef.current?.stop();
    } catch {
      // ignore
    }
    controlsRef.current = null;
  }, []);

  const restartScanner = useCallback(() => {
    handledRef.current = false;
    setScanMessage("");
    setPhase("live");
    setStartToken((value) => value + 1);
  }, []);

  const handleDecoded = useCallback(
    async (text) => {
      if (handledRef.current || loading) return;
      const result = parseNfQrPayload(text);
      if (!result.ok) {
        setScanMessage(nfPayloadErrorMessage(result.reason));
        setPhase("error");
        stopTracksOnly();
        return;
      }
      handledRef.current = true;
      setScanMessage("");
      stopTracksOnly();
      setPhase("live");
      try {
        await onValidatedRef.current?.(result);
      } catch {
        handledRef.current = false;
        setPhase("error");
      }
    },
    [loading, stopTracksOnly],
  );

  useEffect(() => {
    if (loading || phase !== "live") return undefined;

    const session = sessionRef.current + 1;
    sessionRef.current = session;
    let cancelled = false;
    const reader = new BrowserQRCodeReader();

    (async () => {
      try {
        const video = await waitForVideoElement(videoRef);
        if (cancelled || session !== sessionRef.current) return;

        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: INTAKE_NF_CONFIG.facingMode },
            },
          },
          video,
          (result, _error, ctrl) => {
            if (cancelled || session !== sessionRef.current || !result || handledRef.current) {
              return;
            }
            const text = result.getText();
            try {
              ctrl.stop();
            } catch {
              // ignore
            }
            controlsRef.current = null;
            handleDecoded(text);
          },
        );

        if (cancelled || session !== sessionRef.current) {
          try {
            controls.stop();
          } catch {
            // ignore
          }
          return;
        }
        controlsRef.current = controls;
      } catch (err) {
        if (cancelled || session !== sessionRef.current) return;
        const name = err?.name || "";
        // Strict Mode / remount costuma abortar o 1º getUserMedia — tenta de novo em seguida.
        if (name === "AbortError" || name === "NotReadableError" || err?.message === "video_missing") {
          window.setTimeout(() => {
            if (!cancelled && session === sessionRef.current) {
              setStartToken((value) => value + 1);
            }
          }, 150);
          return;
        }
        setPhase("error");
        setScanMessage(INTAKE_NF_COPY.cameraDenied);
      }
    })();

    return () => {
      cancelled = true;
      stopTracksOnly();
    };
  }, [phase, loading, startToken, handleDecoded, stopTracksOnly]);

  useEffect(() => () => stopTracksOnly(), [stopTracksOnly]);

  const showCamera = phase === "live" || loading;

  return (
    <Stack spacing={nfPanelStackSpacing}>
      <Box sx={{ position: "relative" }}>
        {showCamera ? (
          <Box sx={nfScannerWrapSx}>
            <Box
              component="video"
              ref={videoRef}
              muted
              playsInline
              autoPlay
              sx={nfScannerVideoSx}
            />
            <Typography variant="body2" sx={nfScannerHintSx}>
              {loading ? INTAKE_NF_COPY.reading : INTAKE_NF_COPY.scanning}
            </Typography>
            {loading ? (
              <Box sx={nfOverlaySx} role="status" aria-live="polite">
                <CircularProgress size={36} color="inherit" />
                <Typography fontWeight={700}>{INTAKE_NF_COPY.reading}</Typography>
              </Box>
            ) : null}
          </Box>
        ) : null}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: showCamera ? 1.5 : 0 }}
        >
          {phase === "live" && !loading ? (
            <LoadingButton
              type="button"
              variant="outlined"
              color="inherit"
              onClick={() => {
                stopTracksOnly();
                onCancel?.();
              }}
            >
              {INTAKE_NF_COPY.stopScan}
            </LoadingButton>
          ) : null}
          {phase === "error" && !loading ? (
            <>
              <LoadingButton
                type="button"
                variant="contained"
                disabled={disabled}
                onClick={restartScanner}
              >
                {INTAKE_NF_COPY.scanAgain}
              </LoadingButton>
              {onCancel ? (
                <LoadingButton type="button" variant="text" disabled={disabled} onClick={onCancel}>
                  {INTAKE_NF_COPY.backToPhoto}
                </LoadingButton>
              ) : null}
              {onUsePhoto ? (
                <LoadingButton
                  type="button"
                  variant="outlined"
                  disabled={disabled}
                  onClick={onUsePhoto}
                >
                  {INTAKE_NF_COPY.usePhoto}
                </LoadingButton>
              ) : null}
            </>
          ) : null}
        </Stack>
      </Box>

      {scanMessage || errorMessage ? (
        <Alert
          severity="warning"
          onClose={scanMessage ? () => setScanMessage("") : undefined}
          action={
            onUsePhoto ? (
              <LoadingButton color="inherit" size="small" onClick={onUsePhoto}>
                {INTAKE_NF_COPY.usePhoto}
              </LoadingButton>
            ) : undefined
          }
        >
          {scanMessage || errorMessage}
        </Alert>
      ) : null}
    </Stack>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import {
  SPEECH_ERROR,
  useSpeechToText,
} from "../../../hooks/useSpeechToText";
import { appendSpeechTranscript } from "../../../utils/speech/speechRecognition";
import { SPEECH_RECORD_BUTTON_CONFIG } from "./speechRecordButtonConfig";
import {
  SPEECH_RECORD_BUTTON_COPY,
  speechErrorMessage,
} from "./speechRecordButtonCopy";
import {
  speechFieldInputSx,
  speechFieldRootSx,
  speechMicAdornmentSx,
  speechMicButtonSx,
  speechRecordErrorSx,
  speechRecordHintSx,
  speechRecordInterimSx,
  speechStatusRowSx,
  speechSubmitButtonSx,
} from "./SpeechRecordButton.styled";

/**
 * TextField com microfone no canto (voz → texto editável).
 * Estados: ouvindo, permissão/erro, cancelamento; teclado sempre disponível.
 *
 * @param {Object} props — props de TextField + value/onChange controlados
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange — string do texto (não o evento)
 * @param {boolean} [props.speechDisabled]
 * @param {string} [props.lang]
 * @param {boolean} [props.showSubmit] — seta circular ao lado do mic
 * @param {"button"|"submit"} [props.submitType]
 * @param {() => void} [props.onSubmitClick]
 * @param {boolean} [props.submitDisabled]
 * @param {boolean} [props.submitLoading]
 * @param {string} [props.submitAriaLabel]
 * @param {boolean} [props.multiline] — se omitido: false (altura padrão); true se minRows > 1
 * @param {number} [props.minRows=1]
 * @param {number} [props.maxRows=6]
 */
export default function SpeechTextField({
  value,
  onChange,
  speechDisabled = false,
  lang = SPEECH_RECORD_BUTTON_CONFIG.lang,
  showSubmit = false,
  submitType = "button",
  onSubmitClick,
  submitDisabled = false,
  submitLoading = false,
  submitAriaLabel = SPEECH_RECORD_BUTTON_COPY.submitAria,
  multiline,
  minRows = 1,
  maxRows = 6,
  slotProps,
  sx,
  ...textFieldProps
}) {
  const valueRef = useRef(value);
  const [cancelledHint, setCancelledHint] = useState(false);
  const cancelTimerRef = useRef(null);

  const effectiveMultiline =
    multiline != null ? Boolean(multiline) : minRows > 1;
  const compact = !effectiveMultiline || Number(minRows) <= 1;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(
    () => () => {
      if (cancelTimerRef.current) window.clearTimeout(cancelTimerRef.current);
    },
    [],
  );

  const handleFinalTranscript = useCallback(
    (chunk) => {
      const next = appendSpeechTranscript(valueRef.current, chunk);
      valueRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const handleCancelled = useCallback(() => {
    setCancelledHint(true);
    if (cancelTimerRef.current) window.clearTimeout(cancelTimerRef.current);
    cancelTimerRef.current = window.setTimeout(() => {
      setCancelledHint(false);
      cancelTimerRef.current = null;
    }, 2800);
  }, []);

  const {
    supported,
    listening,
    interimTranscript,
    error,
    clearError,
    toggle,
  } = useSpeechToText({
    lang,
    onFinalTranscript: handleFinalTranscript,
    onCancelled: handleCancelled,
  });

  const handleTextChange = (event) => {
    if (error && error !== SPEECH_ERROR.unsupported) {
      clearError();
    }
    if (cancelledHint) setCancelledHint(false);
    onChange(event.target.value);
  };

  const errorMessage = speechErrorMessage(error);
  const voiceBlocked = !supported || error === SPEECH_ERROR.audioCapture;
  const showMicOff =
    voiceBlocked || error === SPEECH_ERROR.permission;
  const inputSlotProps = slotProps?.input || {};

  let micIcon = <MicNoneOutlinedIcon fontSize="small" />;
  if (listening) micIcon = <StopRoundedIcon fontSize="small" />;
  else if (showMicOff) micIcon = <MicOffOutlinedIcon fontSize="small" />;

  let micAria = SPEECH_RECORD_BUTTON_COPY.startAria;
  if (listening) micAria = SPEECH_RECORD_BUTTON_COPY.stopAria;
  else if (showMicOff) micAria = SPEECH_RECORD_BUTTON_COPY.unavailableAria;

  return (
    <Stack sx={speechFieldRootSx}>
      <TextField
        {...textFieldProps}
        value={value}
        onChange={handleTextChange}
        multiline={effectiveMultiline}
        minRows={effectiveMultiline ? minRows : undefined}
        maxRows={effectiveMultiline ? maxRows : undefined}
        sx={[
          speechFieldInputSx({ compact }),
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        slotProps={{
          ...slotProps,
          input: {
            ...inputSlotProps,
            endAdornment: (
              <InputAdornment position="end" sx={speechMicAdornmentSx({ compact })}>
                {inputSlotProps.endAdornment}
                <IconButton
                  type="button"
                  size="small"
                  onClick={toggle}
                  disabled={speechDisabled || voiceBlocked}
                  aria-label={micAria}
                  aria-pressed={listening}
                  title={micAria}
                  sx={speechMicButtonSx(listening)}
                >
                  {micIcon}
                </IconButton>
                {showSubmit ? (
                  <IconButton
                    type={submitType}
                    size="small"
                    onClick={submitType === "button" ? onSubmitClick : undefined}
                    disabled={submitDisabled || submitLoading || speechDisabled}
                    aria-label={submitAriaLabel}
                    title={submitAriaLabel}
                    sx={speechSubmitButtonSx}
                  >
                    {submitLoading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <ArrowUpwardRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                ) : null}
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack sx={speechStatusRowSx} aria-live="polite">
        {listening ? (
          <Typography variant="caption" sx={speechRecordHintSx}>
            {SPEECH_RECORD_BUTTON_COPY.listeningHint}
          </Typography>
        ) : null}

        {listening && interimTranscript ? (
          <Typography variant="caption" sx={speechRecordInterimSx}>
            {SPEECH_RECORD_BUTTON_COPY.interimPrefix} {interimTranscript}
          </Typography>
        ) : null}

        {!listening && cancelledHint && !errorMessage ? (
          <Typography variant="caption" sx={speechRecordHintSx}>
            {SPEECH_RECORD_BUTTON_COPY.cancelledHint}
          </Typography>
        ) : null}

        {errorMessage ? (
          <Typography variant="caption" sx={speechRecordErrorSx} role="alert">
            {errorMessage}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}

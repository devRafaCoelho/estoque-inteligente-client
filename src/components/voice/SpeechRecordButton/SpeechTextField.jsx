import { useCallback, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { useSpeechToText } from "../../../hooks/useSpeechToText";
import { appendSpeechTranscript } from "../../../utils/speech/speechRecognition";
import { SPEECH_RECORD_BUTTON_CONFIG } from "./speechRecordButtonConfig";
import {
  SPEECH_RECORD_BUTTON_COPY,
  speechErrorMessage,
} from "./speechRecordButtonCopy";
import {
  speechFieldRootSx,
  speechMicAdornmentSx,
  speechMicButtonSx,
  speechRecordErrorSx,
  speechRecordHintSx,
  speechRecordInterimSx,
} from "./SpeechRecordButton.styled";

/**
 * TextField com microfone no canto (voz → texto editável).
 *
 * @param {Object} props — props de TextField + value/onChange controlados
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange — string do texto (não o evento)
 * @param {boolean} [props.speechDisabled]
 * @param {string} [props.lang]
 */
export default function SpeechTextField({
  value,
  onChange,
  speechDisabled = false,
  lang = SPEECH_RECORD_BUTTON_CONFIG.lang,
  slotProps,
  ...textFieldProps
}) {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleFinalTranscript = useCallback(
    (chunk) => {
      const next = appendSpeechTranscript(valueRef.current, chunk);
      valueRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const { supported, listening, interimTranscript, error, toggle } =
    useSpeechToText({
      lang,
      onFinalTranscript: handleFinalTranscript,
    });

  const errorMessage = speechErrorMessage(error);
  const inputSlotProps = slotProps?.input || {};

  return (
    <Stack sx={speechFieldRootSx}>
      <TextField
        {...textFieldProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          ...slotProps,
          input: {
            ...inputSlotProps,
            endAdornment: (
              <InputAdornment position="end" sx={speechMicAdornmentSx}>
                {inputSlotProps.endAdornment}
                <IconButton
                  type="button"
                  size="small"
                  edge="end"
                  onClick={toggle}
                  disabled={speechDisabled || (!supported && !listening)}
                  aria-label={
                    listening
                      ? SPEECH_RECORD_BUTTON_COPY.stopAria
                      : SPEECH_RECORD_BUTTON_COPY.startAria
                  }
                  aria-pressed={listening}
                  sx={speechMicButtonSx(listening)}
                >
                  {listening ? (
                    <StopRoundedIcon fontSize="small" />
                  ) : (
                    <MicNoneOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

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

      {!supported ? (
        <Typography variant="caption" sx={speechRecordHintSx}>
          {SPEECH_RECORD_BUTTON_COPY.unsupported}
        </Typography>
      ) : null}

      {supported && errorMessage ? (
        <Typography variant="caption" sx={speechRecordErrorSx} role="alert">
          {errorMessage}
        </Typography>
      ) : null}
    </Stack>
  );
}

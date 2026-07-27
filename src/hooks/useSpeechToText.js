import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionConstructor,
  isSpeechRecognitionSupported,
} from "../utils/speech/speechRecognition";

export const SPEECH_ERROR = {
  unsupported: "unsupported",
  permission: "permission",
  noSpeech: "no_speech",
  aborted: "aborted",
  network: "network",
  audioCapture: "audio_capture",
  unknown: "unknown",
};

/** idle | listening | error */
export const SPEECH_STATUS = {
  idle: "idle",
  listening: "listening",
  error: "error",
};

function mapSpeechError(code) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return SPEECH_ERROR.permission;
    case "no-speech":
      return SPEECH_ERROR.noSpeech;
    case "aborted":
      return SPEECH_ERROR.aborted;
    case "network":
      return SPEECH_ERROR.network;
    case "audio-capture":
      return SPEECH_ERROR.audioCapture;
    default:
      return SPEECH_ERROR.unknown;
  }
}

/**
 * Speech-to-text via Web Speech API (pt-BR).
 *
 * Estados: idle → listening → idle (cancelamento) | error (permissão/rede/falha).
 *
 * @param {{
 *   lang?: string,
 *   continuous?: boolean,
 *   interimResults?: boolean,
 *   onFinalTranscript?: (text: string) => void,
 *   onCancelled?: () => void,
 * }} [options]
 */
export function useSpeechToText({
  lang = "pt-BR",
  continuous = true,
  interimResults = true,
  onFinalTranscript,
  onCancelled,
} = {}) {
  const supported = isSpeechRecognitionSupported();
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(
    supported ? null : SPEECH_ERROR.unsupported,
  );

  const recognitionRef = useRef(null);
  const wantListeningRef = useRef(false);
  const userStoppedRef = useRef(false);
  const gotFinalRef = useRef(false);
  const fatalErrorRef = useRef(false);
  const onFinalRef = useRef(onFinalTranscript);
  const onCancelledRef = useRef(onCancelled);

  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    onCancelledRef.current = onCancelled;
  }, [onCancelled]);

  const cleanupRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.stop();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
  }, []);

  useEffect(
    () => () => {
      wantListeningRef.current = false;
      cleanupRecognition();
    },
    [cleanupRecognition],
  );

  const clearError = useCallback(() => {
    if (!supported) {
      setError(SPEECH_ERROR.unsupported);
      return;
    }
    setError(null);
  }, [supported]);

  const stop = useCallback(() => {
    if (!wantListeningRef.current && !listening) return;
    userStoppedRef.current = true;
    wantListeningRef.current = false;
    setInterimTranscript("");
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    }
    setListening(false);
    onCancelledRef.current?.();
  }, [listening]);

  const start = useCallback(() => {
    if (!supported) {
      setError(SPEECH_ERROR.unsupported);
      return false;
    }

    userStoppedRef.current = false;
    gotFinalRef.current = false;
    fatalErrorRef.current = false;
    setError(null);
    setInterimTranscript("");
    wantListeningRef.current = true;

    cleanupRecognition();

    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      setError(SPEECH_ERROR.unsupported);
      wantListeningRef.current = false;
      return false;
    }

    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finals = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result?.[0]?.transcript || "";
        if (!piece) continue;
        if (result.isFinal) {
          finals += piece;
        } else {
          interim += piece;
        }
      }

      if (finals.trim()) {
        gotFinalRef.current = true;
        onFinalRef.current?.(finals.trim());
      }
      setInterimTranscript(interim.trim());
    };

    recognition.onerror = (event) => {
      const mapped = mapSpeechError(event.error);

      if (mapped === SPEECH_ERROR.aborted && userStoppedRef.current) {
        return;
      }

      if (mapped === SPEECH_ERROR.noSpeech && wantListeningRef.current) {
        return;
      }

      if (mapped === SPEECH_ERROR.aborted && wantListeningRef.current) {
        return;
      }

      fatalErrorRef.current = true;
      setError(mapped);
      wantListeningRef.current = false;
      setListening(false);
      setInterimTranscript("");
    };

    recognition.onend = () => {
      if (wantListeningRef.current && continuous && !userStoppedRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          /* fall through */
        }
      }

      const endedWithoutResult =
        !gotFinalRef.current &&
        !userStoppedRef.current &&
        !fatalErrorRef.current;

      wantListeningRef.current = false;
      setListening(false);
      setInterimTranscript("");

      if (endedWithoutResult) {
        setError(SPEECH_ERROR.noSpeech);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      return true;
    } catch {
      fatalErrorRef.current = true;
      setError(SPEECH_ERROR.unknown);
      wantListeningRef.current = false;
      setListening(false);
      return false;
    }
  }, [cleanupRecognition, continuous, interimResults, lang, supported]);

  const toggle = useCallback(() => {
    if (listening || wantListeningRef.current) {
      stop();
      return;
    }
    start();
  }, [listening, start, stop]);

  const status = !supported
    ? SPEECH_STATUS.error
    : listening
      ? SPEECH_STATUS.listening
      : error
        ? SPEECH_STATUS.error
        : SPEECH_STATUS.idle;

  return {
    supported,
    status,
    listening,
    interimTranscript,
    error,
    clearError,
    start,
    stop,
    toggle,
  };
}

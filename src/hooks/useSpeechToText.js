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
  unknown: "unknown",
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
    default:
      return SPEECH_ERROR.unknown;
  }
}

/**
 * Speech-to-text via Web Speech API (pt-BR).
 *
 * @param {{
 *   lang?: string,
 *   continuous?: boolean,
 *   interimResults?: boolean,
 *   onFinalTranscript?: (text: string) => void,
 * }} [options]
 */
export function useSpeechToText({
  lang = "pt-BR",
  continuous = true,
  interimResults = true,
  onFinalTranscript,
} = {}) {
  const supported = isSpeechRecognitionSupported();
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const wantListeningRef = useRef(false);
  const onFinalRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

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

  useEffect(() => () => {
    wantListeningRef.current = false;
    cleanupRecognition();
  }, [cleanupRecognition]);

  const stop = useCallback(() => {
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
  }, []);

  const start = useCallback(() => {
    if (!supported) {
      setError(SPEECH_ERROR.unsupported);
      return false;
    }

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
        onFinalRef.current?.(finals.trim());
      }
      setInterimTranscript(interim.trim());
    };

    recognition.onerror = (event) => {
      const mapped = mapSpeechError(event.error);
      if (mapped === SPEECH_ERROR.aborted && !wantListeningRef.current) {
        return;
      }
      if (mapped === SPEECH_ERROR.noSpeech && wantListeningRef.current) {
        // Chrome dispara no-speech com frequência; mantém sessão se o user ainda grava.
        return;
      }
      setError(mapped);
      if (mapped === SPEECH_ERROR.permission) {
        wantListeningRef.current = false;
        setListening(false);
      }
    };

    recognition.onend = () => {
      if (wantListeningRef.current && continuous) {
        try {
          recognition.start();
          return;
        } catch {
          /* fall through */
        }
      }
      wantListeningRef.current = false;
      setListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      return true;
    } catch {
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

  return {
    supported,
    listening,
    interimTranscript,
    error,
    clearError: () => setError(null),
    start,
    stop,
    toggle,
  };
}

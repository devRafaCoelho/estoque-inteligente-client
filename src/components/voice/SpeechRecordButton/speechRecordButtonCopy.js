import { SPEECH_ERROR } from "../../../hooks/useSpeechToText";

export const SPEECH_RECORD_BUTTON_COPY = {
  listeningHint: "Ouvindo… toque no microfone para cancelar",
  cancelledHint: "Gravação cancelada. Continue digitando ou edite o texto.",
  interimPrefix: "Reconhecendo:",
  keyboardFallback: "Você pode digitar normalmente no campo.",
  unsupported:
    "Ditado por voz indisponível neste navegador. Digite o texto no campo.",
  permission:
    "Permissão do microfone negada. Libere o mic no navegador ou digite o texto no campo.",
  noSpeech:
    "Não captamos fala. Tente o microfone de novo ou digite no campo.",
  network:
    "Falha de rede no ditado. Verifique a conexão ou digite o texto no campo.",
  audioCapture:
    "Não encontramos um microfone. Conecte um mic ou digite o texto no campo.",
  unknown:
    "Não foi possível usar o microfone. Digite o texto no campo.",
  startAria: "Começar gravação de voz",
  stopAria: "Cancelar gravação de voz",
  unavailableAria: "Microfone indisponível — use o teclado",
};

export function speechErrorMessage(code) {
  switch (code) {
    case SPEECH_ERROR.unsupported:
      return SPEECH_RECORD_BUTTON_COPY.unsupported;
    case SPEECH_ERROR.permission:
      return SPEECH_RECORD_BUTTON_COPY.permission;
    case SPEECH_ERROR.noSpeech:
      return SPEECH_RECORD_BUTTON_COPY.noSpeech;
    case SPEECH_ERROR.network:
      return SPEECH_RECORD_BUTTON_COPY.network;
    case SPEECH_ERROR.audioCapture:
      return SPEECH_RECORD_BUTTON_COPY.audioCapture;
    case SPEECH_ERROR.aborted:
      return null;
    default:
      return code ? SPEECH_RECORD_BUTTON_COPY.unknown : null;
  }
}

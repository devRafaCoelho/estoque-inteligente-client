import { SPEECH_ERROR } from "../../../hooks/useSpeechToText";

export const SPEECH_RECORD_BUTTON_COPY = {
  start: "Falar",
  stop: "Parar",
  listeningHint: "Ouvindo… toque no microfone para parar",
  interimPrefix: "Ouvindo:",
  unsupported:
    "Seu navegador não suporta ditado por voz. Digite no campo acima.",
  permission:
    "Permissão do microfone negada. Libere o mic nas configurações do navegador ou digite o texto.",
  noSpeech: "Não captamos fala. Tente de novo ou digite no campo.",
  network: "Falha de rede no ditado. Verifique a conexão ou digite o texto.",
  unknown: "Não foi possível usar o microfone. Digite no campo acima.",
  startAria: "Começar gravação de voz",
  stopAria: "Parar gravação de voz",
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
    default:
      return code ? SPEECH_RECORD_BUTTON_COPY.unknown : null;
  }
}

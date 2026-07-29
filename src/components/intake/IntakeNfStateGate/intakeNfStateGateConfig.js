export const INTAKE_NF_STATE_GATE_COPY = {
  title: "Qual o seu estado?",
  hint: "Usamos a UF padrão para consultar a nota. Depois disso, o QR abre direto.",
  supportedDefault: "QR disponível hoje em: SP, MG, BA, RJ, PR. Demais UFs: use a foto.",
  supportedHint: (list) =>
    `QR disponível hoje em: ${list}. Demais UFs: use a foto da nota.`,
  label: "Estado (UF)",
  helper: "Salvo em Minha conta como preferência.",
  continue: "Continuar para o QR",
  cancel: "Voltar",
  usePhoto: "Usar foto da nota",
  saveError: "Não foi possível salvar o estado. Tente de novo.",
};

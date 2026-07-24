export const PRODUCT_CREATE_COPY = {
  title: "Cadastro manual",
  subtitle: "Monte a lista e salve tudo de uma vez",
  addProduct: "Adicionar produto",
  stageTitle: "Na lista",
  stageEmptyTitle: "Nenhum produto na lista",
  stageEmptyDescription:
    "Toque em “Adicionar produto” para incluir o primeiro item.",
  removeItem: "Remover",
  editItem: "Editar",
  deleteConfirmTitle: "Remover da lista?",
  deleteConfirmDescription: (name) =>
    `Deseja remover “${name}” da lista antes de salvar?`,
  deleteConfirmLabel: "Remover",
  deleteCancelLabel: "Cancelar",
  saveAll: (n) => (n === 1 ? "Salvar 1 produto" : `Salvar ${n} produtos`),
  successAll: (n) => (n === 1 ? "1 produto criado" : `${n} produtos criados`),
  partialSuccess: (ok, fail) =>
    `${ok} criado(s). ${fail} não puderam ser salvos — confira os nomes duplicados.`,
  error: "Erro ao criar produtos",
  duplicateInStage: "Este nome já está na lista",
};

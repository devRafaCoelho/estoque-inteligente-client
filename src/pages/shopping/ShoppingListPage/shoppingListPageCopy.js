export const SHOPPING_LIST_PAGE_COPY = {
  loadError: "Erro ao carregar lista",
  generatePending: (pending) => `Lista atualizada (${pending} pendentes)`,
  generateEmpty: "Nada novo para sugerir agora",
  generateError: "Erro ao gerar lista",
  viewModeError: "Erro ao salvar visualização",
  toggleError: "Erro ao atualizar item",
  itemRemoved: "Item removido",
  deleteError: "Erro ao remover item",
  deleteConfirmTitle: "Remover item?",
  deleteConfirmDescription: (name) =>
    `Deseja remover “${name}” da lista de compras? Essa ação não pode ser desfeita.`,
  deleteConfirmLabel: "Remover",
  deleteCancelLabel: "Cancelar",
  clearList: "Limpar lista",
  clearConfirmTitle: "Limpar lista?",
  clearConfirmDescription:
    "Todos os itens da lista de compras serão removidos. Essa ação não pode ser desfeita.",
  clearConfirmLabel: "Limpar lista",
  clearCancelLabel: "Cancelar",
  listCleared: "Lista limpa",
  clearError: "Erro ao limpar lista",
  itemsAdded: (count) => `${count} itens adicionados à lista`,
  itemAdded: "Item adicionado",
  itemsMerged: "Itens iguais foram somados na lista",
  itemsAddedAndMerged: (added, merged) =>
    `${added} novo(s) · ${merged} somado(s) na lista`,
  addError: "Erro ao adicionar item",
  title: "Lista de compras",
  subtitle: "Monte a lista pelo estoque, texto ou voz",
  generate: "Gerar lista automática",
  generateUpdate: "Atualizar lista automática",
  generateDisabledHint: "Nada novo para sugerir agora",
  viewList: "Lista",
  viewPaper: "Paper",
  viewModeAria: "Modo de visualização",
  stats: (pending, checked) => `${pending} pendente(s) · ${checked} marcado(s)`,
  spendBannerLabel: "Estimativa",
  spendEstimate: (totalLabel) => `Estimativa: ${totalLabel}`,
  spendEstimatePartial: (totalLabel, missing) =>
    `Estimativa: ${totalLabel} · parcial (${missing} sem preço)`,
  spendEstimateEmpty: "Cadastre o preço médio dos itens para estimar o gasto.",
  missingPricesAlert: (count) =>
    count === 1
      ? "Falta o preço unitário de 1 produto. Cadastre agora e a estimativa fica completa."
      : `Falta o preço unitário de ${count} produtos. Cadastre agora e a estimativa fica completa.`,
  missingPricesNoProduct:
    "Itens manuais sem produto vinculado não entram no cálculo até serem associados a um produto.",
  unitPriceLabel: "Preço unitário",
  saveUnitPrice: "Salvar",
  saveAllUnitPrices: (count) =>
    count > 0 ? `Salvar todos (${count})` : "Salvar todos",
  unitPricesSaved: (count) =>
    count === 1
      ? "Preço unitário atualizado"
      : `${count} preços unitários atualizados`,
  unitPricesError: "Não foi possível salvar os preços",
  addLabel: "O que você precisa comprar?",
  addPlaceholder: "Ex.: 2kg de arroz, 1 lata de leite em pó",
  addSubmit: "Adicionar",
  share: "Compartilhar lista",
  shareMenuAria: "Opções de compartilhamento",
  shareCopyLink: "Copiar link",
  shareWhatsApp: "WhatsApp",
  shareLinkCopied: "Link copiado",
  shareCopyError: "Não foi possível copiar o link",
  shareError: "Não foi possível gerar o link",
  shareEmptyList: "Adicione itens antes de compartilhar",
};

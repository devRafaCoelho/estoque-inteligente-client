export const NOTIFICATIONS_PAGE_COPY = {
  title: "Alertas",
  subtitle: "Avisos de estoque baixo e produtos zerados",
  loadError: "Erro ao carregar alertas",
  markReadError: "Erro ao marcar alerta como lido",
  markAllReadError: "Erro ao marcar todos como lidos",
  markAllReadSuccess: "Todos os alertas foram marcados como lidos",
  markReadSuccess: "Alerta marcado como lido",
  emptyAll: "Nenhum alerta por enquanto.",
  emptyUnread: "Nenhum alerta não lido.",
  filterAll: "Todos",
  filterUnread: "Não lidos",
  markAllRead: "Marcar todos como lidos",
  markRead: "Marcar como lido",
  openProduct: "Ver produto",
  unreadCount: (count) =>
    count === 1 ? "1 não lido" : `${count} não lidos`,
};

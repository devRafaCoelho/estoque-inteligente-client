export const HOUSEHOLD_SECTION_COPY = {
  title: "Conta familiar",
  subtitle:
    "Compartilhe estoque e lista de compras com pessoas da sua casa.",
  emptyTitle: "Nenhuma conta familiar",
  emptyDescription:
    "Crie uma conta familiar para convidar pessoas e compartilhar o estoque.",
  createLabel: "Criar conta familiar",
  createDialogTitle: "Criar conta familiar",
  nameLabel: "Nome da conta",
  namePlaceholder: "Ex.: Família Coelho",
  createSubmit: "Criar",
  cancel: "Cancelar",
  createSuccess: "Conta familiar criada",
  createError: "Não foi possível criar a conta familiar.",
  editNameLabel: "Editar nome",
  editDialogTitle: "Editar nome da conta",
  editSubmit: "Salvar",
  editSuccess: "Nome atualizado",
  editError: "Não foi possível atualizar o nome.",
  loadError: "Não foi possível carregar a conta familiar.",
  roleOwner: "Dono",
  roleMember: "Membro",
  youSuffix: " (você)",
  membersTitle: "Membros",
  invitesTitle: "Convites pendentes",
  inviteLabel: "Convidar por e-mail",
  invitePlaceholder: "email@exemplo.com",
  inviteSubmit: "Convidar",
  inviteSuccess: "Convite enviado",
  inviteSuccessWithLink: "Convite enviado — link copiado para a área de transferência",
  inviteError: "Não foi possível enviar o convite.",
  revokeInvite: "Cancelar",
  revokeInviteSuccess: "Convite cancelado",
  revokeInviteError: "Não foi possível cancelar o convite.",
  removeMember: "Remover",
  removeMemberTitle: "Remover membro?",
  removeMemberDescription: (name) =>
    `Remover ${name} da conta familiar? Essa pessoa perde acesso ao estoque compartilhado.`,
  removeMemberConfirm: "Remover",
  removeMemberSuccess: "Membro removido",
  removeMemberError: "Não foi possível remover o membro.",
  leaveLabel: "Sair da conta familiar",
  leaveTitle: "Sair da conta familiar?",
  leaveDescriptionMember:
    "Você deixa de ver o estoque compartilhado. Os dados da família permanecem.",
  leaveDescriptionOwnerSolo:
    "Você é o único membro. Ao sair, a conta familiar será encerrada e o estoque volta a ser só seu.",
  leaveDescriptionOwnerWithMembers:
    "Enquanto houver outros membros, o dono não pode sair. Remova os membros primeiro.",
  leaveConfirm: "Sair",
  leaveSuccess: "Você saiu da conta familiar",
  leaveError: "Não foi possível sair da conta familiar.",
  noInvites: "Nenhum convite pendente.",
  expiresAt: (iso) => {
    try {
      return `Expira em ${new Date(iso).toLocaleDateString("pt-BR")}`;
    } catch {
      return "";
    }
  },
};

export const HOUSEHOLD_INVITE_PAGE_COPY = {
  title: "Convite para conta familiar",
  subtitle: "Aceite o convite para compartilhar estoque e lista com a família.",
  missingToken: "Link de convite inválido ou incompleto.",
  accepting: "Aceitando convite…",
  success: "Convite aceito! Você já faz parte da conta familiar.",
  error: "Não foi possível aceitar o convite.",
  goAccount: "Ir para Minha Conta",
  goDashboard: "Ir para o início",
  loginHint: "Entre com o e-mail que recebeu o convite para aceitar.",
};

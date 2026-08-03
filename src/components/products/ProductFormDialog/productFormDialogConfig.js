import {
  nonNegativeDecimalInputProps,
  positiveIntegerInputProps,
} from "../../../utils/numberInput";

export const PRODUCT_FORM_DIALOG_COPY = {
  createTitle: "Novo produto",
  editTitle: "Editar produto",
  nameLabel: "Nome",
  categoryLabel: "Categoria",
  quantityLabel: "Quantidade",
  unitLabel: "Unidade",
  minQuantityLabel: "Quantidade mínima",
  avgUnitPriceLabel: "Preço unitário",
  avgUnitPriceHelper: "Opcional. Usado na estimativa da lista de compras.",
  repurchaseDaysLabel: "Recompra a cada (dias)",
  repurchaseDaysHelper: "Opcional. Ex.: 14 = lembrar depois de duas semanas.",
  notesLabel: "Observações",
  cancel: "Cancelar",
  addToStage: "Adicionar à lista",
  updateStage: "Atualizar item",
  save: "Salvar",
};

export const PRODUCT_FORM_DIALOG_CONFIG = {
  formId: "product-stage-form",
  maxWidth: "sm",
  quantityInputProps: nonNegativeDecimalInputProps(),
  minQuantityInputProps: nonNegativeDecimalInputProps(),
  repurchaseDaysInputProps: positiveIntegerInputProps(),
};

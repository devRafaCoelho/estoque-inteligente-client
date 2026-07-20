import { CATEGORY_LABELS } from "../config/constants";

export function categoryLabel(category) {
  return CATEGORY_LABELS[category] || category || "Outros";
}

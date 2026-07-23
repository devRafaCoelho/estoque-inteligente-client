import { CATEGORY_LABELS } from "../config/constants";
import { resolveCodeEntityLabel } from "./entitySelectOptions";

const CATEGORY_ENTITIES = Object.entries(CATEGORY_LABELS).map(([code, label]) => ({
  code,
  label,
}));

/**
 * @param {string|null|undefined} category
 * @param {Array<{ code: string, label?: string }>} [categories]
 * @returns {string}
 */
export function categoryLabel(category, categories) {
  return resolveCodeEntityLabel(
    category,
    categories?.length ? categories : CATEGORY_ENTITIES,
    category || "Outros",
  );
}

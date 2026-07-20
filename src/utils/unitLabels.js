import { UNIT_LABELS } from "../config/constants";

export function unitLabel(unit) {
  return UNIT_LABELS[unit] || unit || "un";
}

export function formatQuantity(quantity, unit) {
  const n = Number(quantity);
  const formatted = Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, "");
  return `${formatted} ${unitLabel(unit)}`;
}

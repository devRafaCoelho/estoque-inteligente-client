import { UNIT_LABELS } from "../config/constants";
import { resolveCodeEntityLabel } from "./entitySelectOptions";

const UNIT_ENTITIES = Object.entries(UNIT_LABELS).map(([code, label]) => ({
  code,
  label,
}));

/**
 * @param {string|null|undefined} unit
 * @param {Array<{ code: string, label?: string }>} [units]
 * @returns {string}
 */
export function unitLabel(unit, units) {
  return resolveCodeEntityLabel(
    unit,
    units?.length ? units : UNIT_ENTITIES,
    unit || "un",
  );
}

/**
 * @param {number|string} quantity
 * @param {string|null|undefined} unit
 * @param {Array<{ code: string, label?: string }>} [units]
 * @returns {string}
 */
export function formatQuantity(quantity, unit, units) {
  const n = Number(quantity);
  const formatted = Number.isInteger(n)
    ? String(n)
    : n.toFixed(3).replace(/\.?0+$/, "");
  return `${formatted} ${unitLabel(unit, units)}`;
}

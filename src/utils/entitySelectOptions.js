/**
 * @typedef {{ code: string, label?: string, name?: string }} CodeLabelEntity
 */

/**
 * @param {CodeLabelEntity | null | undefined} entity
 * @returns {string}
 */
export function getCodeEntityDisplayName(entity) {
  if (!entity) return "";
  if (entity.label != null) return String(entity.label);
  if (entity.name != null) return String(entity.name);
  return "";
}

/**
 * @param {CodeLabelEntity[]} entities
 * @returns {Array<{ value: string, label: string }>}
 */
export function buildCodeLabelOptions(entities = []) {
  return entities
    .map((entity) => ({
      value: entity.code,
      label: getCodeEntityDisplayName(entity),
    }))
    .filter((option) => Boolean(option.value) && Boolean(option.label));
}

/**
 * UFs: "SP — São Paulo"
 * @param {Array<{ code: string, name: string }>} states
 * @returns {Array<{ value: string, label: string }>}
 */
export function buildBrazilianStateOptions(states = []) {
  return states
    .map((state) => ({
      value: state.code,
      label: state.name ? `${state.code} — ${state.name}` : state.code,
    }))
    .filter((option) => Boolean(option.value) && Boolean(option.label));
}

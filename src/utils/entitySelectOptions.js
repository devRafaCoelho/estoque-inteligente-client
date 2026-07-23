/**
 * Entidade de catálogo com `code` (categoria, unidade, UF).
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
 * UFs: "SP - São Paulo"
 * @param {Array<{ code: string, name: string }>} states
 * @returns {Array<{ value: string, label: string }>}
 */
export function buildBrazilianStateOptions(states = []) {
  return states
    .map((state) => ({
      value: state.code,
      label: state.name ? `${state.code} - ${state.name}` : state.code,
    }))
    .filter((option) => Boolean(option.value) && Boolean(option.label));
}

/**
 * @param {string|null|undefined} code
 * @param {CodeLabelEntity[]} entities
 * @param {string} [fallback]
 * @returns {string}
 */
export function resolveCodeEntityLabel(code, entities = [], fallback = "—") {
  if (!code) return fallback;
  const entity = entities.find((item) => item.code === code);
  return getCodeEntityDisplayName(entity) || code || fallback;
}

/**
 * Resolve label de UF a partir da lista carregada (ou fallback local).
 * @param {string|null|undefined} code
 * @param {Array<{ code: string, name: string }>} [states]
 * @returns {string}
 */
export function resolveBrazilianStateLabel(code, states) {
  if (!code) return "—";
  const list = states?.length ? states : FALLBACK_BRAZILIAN_STATES;
  const found = list.find((state) => state.code === code);
  if (!found) return code;
  return found.name ? `${found.code} - ${found.name}` : found.code;
}

/** Fallback estático só para exibição quando a lista da API ainda não está em memória. */
const FALLBACK_BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

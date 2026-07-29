/**
 * Resolve um path interno seguro pós-login (evita open redirect).
 * @param {string|null|undefined} redirectParam
 * @param {string} fallback
 * @returns {string}
 */
export function resolveSafeInternalPath(redirectParam, fallback = "/dashboard") {
  if (!redirectParam || typeof redirectParam !== "string") {
    return fallback;
  }
  if (!redirectParam.startsWith("/") || redirectParam.startsWith("//")) {
    return fallback;
  }
  return redirectParam;
}

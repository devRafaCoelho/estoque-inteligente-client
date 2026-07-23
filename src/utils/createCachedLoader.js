/**
 * Loader com cache em memória + promise in-flight (padrão Neoenergia / permissoesCache).
 * Evita chamadas HTTP duplicadas quando StrictMode remonta ou vários consumidores pedem o mesmo recurso.
 *
 * @template T
 * @param {() => Promise<T>} fetcher
 */
export function createCachedLoader(fetcher) {
  /** @type {T | null} */
  let cached = null;
  /** @type {Promise<T> | null} */
  let loadPromise = null;

  /**
   * @param {boolean} [force=false]
   * @returns {Promise<T>}
   */
  function load(force = false) {
    if (!force && cached != null) {
      return Promise.resolve(cached);
    }

    if (!force && loadPromise) {
      return loadPromise;
    }

    loadPromise = Promise.resolve()
      .then(() => fetcher())
      .then((data) => {
        cached = data;
        return data;
      })
      .finally(() => {
        loadPromise = null;
      });

    return loadPromise;
  }

  function clear() {
    cached = null;
    loadPromise = null;
  }

  function getCached() {
    return cached;
  }

  return { load, clear, getCached };
}

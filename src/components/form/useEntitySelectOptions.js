import { useEffect, useMemo, useState } from "react";
import { buildCodeLabelOptions } from "../../utils/entitySelectOptions";

/**
 * @template T
 * @param {Object} params
 * @param {T[]|undefined} params.items — se definido, não faz fetch
 * @param {() => Promise<T[]>} [params.loadItems]
 * @param {(items: T[]) => Array<{ value: string, label: string }>} [params.mapOptions]
 * @returns {{ options: Array<{ value: string, label: string }>, loading: boolean }}
 */
export function useEntitySelectOptions({
  items,
  loadItems,
  mapOptions = buildCodeLabelOptions,
}) {
  const loadOptions = items == null;
  const [loadedItems, setLoadedItems] = useState([]);
  const [loading, setLoading] = useState(loadOptions);

  useEffect(() => {
    if (!loadOptions || !loadItems) return undefined;

    let ativo = true;

    async function carregar() {
      setLoading(true);
      try {
        const lista = await loadItems();
        if (ativo) setLoadedItems(lista);
      } catch {
        if (ativo) setLoadedItems([]);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [loadOptions, loadItems]);

  const options = useMemo(
    () => mapOptions(loadOptions ? loadedItems : items ?? []),
    [loadOptions, loadedItems, items, mapOptions],
  );

  return { options, loading: loadOptions && loading };
}

import { useEffect, useMemo, useState } from "react";
import { buildCodeLabelOptions } from "../../utils/entitySelectOptions";

/**
 * @template T
 * @param {Object} params
 * @param {T[]|undefined} params.items — se definido, não faz fetch
 * @param {() => Promise<T[]>} [params.loadItems]
 * @param {(items: T[]) => Array<{ value: string, label: string }>} [params.mapOptions]
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

    let active = true;

    async function load() {
      setLoading(true);
      try {
        const list = await loadItems();
        if (active) setLoadedItems(list);
      } catch {
        if (active) setLoadedItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [loadOptions, loadItems]);

  const options = useMemo(
    () => mapOptions(loadOptions ? loadedItems : items ?? []),
    [loadOptions, loadedItems, items, mapOptions],
  );

  return { options, loading: loadOptions && loading };
}

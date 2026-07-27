import { useCallback, useState } from "react";

/**
 * Expansão exclusiva (um item aberto por vez) — preview de entrada/baixa, listas, etc.
 *
 * @param {string|number|null} [initialId]
 * @returns {{
 *   expandedId: string|number|null,
 *   isExpanded: (id: string|number) => boolean,
 *   setExpanded: (id: string|number, expanded: boolean) => void,
 *   toggle: (id: string|number) => void,
 *   collapseAll: () => void,
 * }}
 */
export function useExclusiveExpand(initialId = null) {
  const [expandedId, setExpandedId] = useState(initialId);

  const isExpanded = useCallback((id) => expandedId === id, [expandedId]);

  const setExpanded = useCallback((id, expanded) => {
    setExpandedId(expanded ? id : null);
  }, []);

  const toggle = useCallback((id) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedId(null);
  }, []);

  return { expandedId, setExpandedId, isExpanded, setExpanded, toggle, collapseAll };
}

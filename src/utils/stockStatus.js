import { STOCK_STATUS_LABELS } from "../config/constants";

export function getStockStatusColor(status, theme) {
  if (status === "out") return theme.palette.stock?.out || "#d32f2f";
  if (status === "low") return theme.palette.stock?.low || "#ed6c02";
  return theme.palette.stock?.ok || "#2e7d32";
}

export function getStockStatusLabel(status) {
  return STOCK_STATUS_LABELS[status] || status;
}

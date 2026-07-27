import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSnackbar } from "./useAppSnackbar";
import { ApiError } from "../services/apiClient";
import { markNotificationRead } from "../services/notificationService";
import { resolveNotificationDestination } from "../utils/notifications/resolveNotificationDestination";

/**
 * Ações reutilizáveis de notificação (dashboard + página de alertas).
 *
 * @param {{
 *   onAfterMarkRead?: () => void | Promise<void>,
 *   markReadSuccessMessage?: string,
 *   markReadErrorMessage?: string,
 * }} [options]
 */
export function useNotificationActions({
  onAfterMarkRead,
  markReadSuccessMessage = "Alerta marcado como lido",
  markReadErrorMessage = "Não foi possível marcar o alerta",
} = {}) {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();

  const markRead = useCallback(
    async (notification, { silent = false } = {}) => {
      if (!notification?.unread) return false;
      try {
        await markNotificationRead(notification.id);
        if (!silent && markReadSuccessMessage) {
          success(markReadSuccessMessage);
        }
        if (onAfterMarkRead) await onAfterMarkRead();
        return true;
      } catch (err) {
        if (!silent) {
          error(err instanceof ApiError ? err.message : markReadErrorMessage);
        }
        return false;
      }
    },
    [error, markReadErrorMessage, markReadSuccessMessage, onAfterMarkRead, success],
  );

  const openNotification = useCallback(
    async (notification) => {
      const destination = resolveNotificationDestination(notification);
      if (!destination) return false;

      if (notification?.unread) {
        await markRead(notification, { silent: true });
      }

      navigate(destination.path, destination.state ? { state: destination.state } : undefined);
      return true;
    },
    [markRead, navigate],
  );

  return { markRead, openNotification };
}

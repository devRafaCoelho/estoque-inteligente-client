import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import {
  isConsumptionNudge,
  resolveNotificationCtaLabel,
  resolveNotificationTone,
} from "./notificationCardConfig";
import { NOTIFICATION_CARD_COPY } from "./notificationCardCopy";
import {
  notificationCardActionsSpacing,
  notificationCardActionsSx,
  notificationCardClickableSx,
  notificationCardSx,
  notificationCardTimestampSx,
  notificationCardTitleSx,
} from "./NotificationCard.styled";

/**
 * Card de notificação/alerta compartilhado (dashboard e página de alertas).
 *
 * Casca reutilizável: tom + título/corpo + ações. A navegação fica no hook
 * `useNotificationActions` (onNavigate).
 *
 * @param {Object} props
 * @param {object} props.notification
 * @param {string} [props.locale]
 * @param {boolean} [props.busy]
 * @param {() => void} [props.onMarkRead]
 * @param {() => void} [props.onNavigate] — tap no card / Ver produto / Registrar baixa
 */
export default function NotificationCard({
  notification,
  locale = "pt-BR",
  busy = false,
  onMarkRead,
  onNavigate,
}) {
  const unread = Boolean(notification.unread);
  const tone = resolveNotificationTone(notification.type);
  const isNudge = isConsumptionNudge(notification);
  const clickable = Boolean(onNavigate);
  const primaryCta = resolveNotificationCtaLabel(notification, {
    usual: NOTIFICATION_CARD_COPY.registerUsualStockOut,
    stockOut: NOTIFICATION_CARD_COPY.registerStockOut,
    product: NOTIFICATION_CARD_COPY.openProduct,
  });

  return (
    <Box
      sx={{
        ...notificationCardSx(tone, unread),
        ...(clickable ? notificationCardClickableSx : null),
      }}
      onClick={onNavigate}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!clickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNavigate?.();
        }
      }}
    >
      <Typography variant="subtitle1" sx={notificationCardTitleSx(unread)}>
        {notification.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {notification.body}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={notificationCardTimestampSx}
      >
        {new Date(notification.createdAt).toLocaleString(locale)}
      </Typography>

      <Stack direction="row" spacing={notificationCardActionsSpacing} sx={notificationCardActionsSx}>
        {unread && onMarkRead ? (
          <LoadingButton
            size="small"
            variant="text"
            loading={busy}
            onClick={(event) => {
              event.stopPropagation();
              onMarkRead();
            }}
          >
            {NOTIFICATION_CARD_COPY.markRead}
          </LoadingButton>
        ) : null}

        {isNudge && onNavigate ? (
          <Button
            size="small"
            variant="text"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate();
            }}
          >
            {primaryCta || NOTIFICATION_CARD_COPY.registerStockOut}
          </Button>
        ) : null}

        {notification.productId && onNavigate && !isNudge ? (
          <Button
            size="small"
            variant="text"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate();
            }}
          >
            {primaryCta || NOTIFICATION_CARD_COPY.openProduct}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}

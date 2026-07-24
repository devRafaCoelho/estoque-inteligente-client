import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import {
  isConsumptionNudge,
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
 * @param {Object} props
 * @param {object} props.notification
 * @param {string} [props.locale]
 * @param {boolean} [props.busy]
 * @param {() => void} [props.onMarkRead]
 * @param {() => void} [props.onOpenProduct]
 * @param {() => void} [props.onRegisterStockOut]
 * @param {() => void} [props.onClick]
 */
export default function NotificationCard({
  notification,
  locale = "pt-BR",
  busy = false,
  onMarkRead,
  onOpenProduct,
  onRegisterStockOut,
  onClick,
}) {
  const unread = Boolean(notification.unread);
  const tone = resolveNotificationTone(notification.type);
  const isNudge = isConsumptionNudge(notification);
  const clickable = Boolean(onClick);

  return (
    <Box
      sx={{
        ...notificationCardSx(tone, unread),
        ...(clickable ? notificationCardClickableSx : null),
      }}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!clickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
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

        {isNudge && onRegisterStockOut ? (
          <Button
            size="small"
            variant="text"
            onClick={(event) => {
              event.stopPropagation();
              onRegisterStockOut();
            }}
          >
            {NOTIFICATION_CARD_COPY.registerStockOut}
          </Button>
        ) : null}

        {notification.productId && onOpenProduct ? (
          <Button
            size="small"
            variant="text"
            onClick={(event) => {
              event.stopPropagation();
              onOpenProduct();
            }}
          >
            {NOTIFICATION_CARD_COPY.openProduct}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}

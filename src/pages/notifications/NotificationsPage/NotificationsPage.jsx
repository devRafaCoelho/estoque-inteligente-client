import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { notificationService } from "../../../services/notificationService";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  pageToolbarActionsSx,
} from "../../../styles/pageStyles";
import { NOTIFICATIONS_PAGE_CONFIG } from "./notificationsPageConfig";
import { NOTIFICATIONS_PAGE_COPY } from "./notificationsPageCopy";
import {
  alertActionsSpacing,
  alertActionsSx,
  alertCardClickableSx,
  alertCardSx,
  alertTitleSx,
  filterGroupSx,
  listSpacing,
  pageStackSpacing,
  toolbarRowProps,
} from "./NotificationsPage.styled";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState(NOTIFICATIONS_PAGE_CONFIG.defaultFilter);

  const { filters, listLimit, productPath, locale } = NOTIFICATIONS_PAGE_CONFIG;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const data = await notificationService.list({
          unreadOnly: filter === filters.unread ? true : undefined,
          limit: listLimit,
        });
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch (err) {
        error(err instanceof ApiError ? err.message : NOTIFICATIONS_PAGE_COPY.loadError);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [error, filter, filters.unread, listLimit],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (notification, event) => {
    event?.stopPropagation();
    if (!notification.unread) return;
    setBusyId(notification.id);
    try {
      await notificationService.markRead(notification.id);
      success(NOTIFICATIONS_PAGE_COPY.markReadSuccess);
      await load({ silent: true });
    } catch (err) {
      error(err instanceof ApiError ? err.message : NOTIFICATIONS_PAGE_COPY.markReadError);
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllRead();
      success(NOTIFICATIONS_PAGE_COPY.markAllReadSuccess);
      await load({ silent: true });
    } catch (err) {
      error(err instanceof ApiError ? err.message : NOTIFICATIONS_PAGE_COPY.markAllReadError);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleOpen = (notification) => {
    if (!notification.productId) return;
    navigate(productPath(notification.productId));
  };

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  const emptyLabel =
    filter === filters.unread
      ? NOTIFICATIONS_PAGE_COPY.emptyUnread
      : NOTIFICATIONS_PAGE_COPY.emptyAll;

  return (
    <Stack spacing={pageStackSpacing}>
      <Box>
        <Typography variant="h5">{NOTIFICATIONS_PAGE_COPY.title}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{NOTIFICATIONS_PAGE_COPY.subtitle}</Typography>
      </Box>

      <Stack {...toolbarRowProps}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={filter}
          onChange={(_e, value) => {
            if (value) setFilter(value);
          }}
          sx={filterGroupSx}
        >
          <ToggleButton value={filters.all}>{NOTIFICATIONS_PAGE_COPY.filterAll}</ToggleButton>
          <ToggleButton value={filters.unread}>{NOTIFICATIONS_PAGE_COPY.filterUnread}</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={pageToolbarActionsSx}>
          <Typography variant="body2" color="text.secondary">
            {NOTIFICATIONS_PAGE_COPY.unreadCount(unreadCount)}
          </Typography>
          <LoadingButton
            variant="outlined"
            size="small"
            loading={markingAll}
            disabled={unreadCount === 0}
            onClick={handleMarkAllRead}
          >
            {NOTIFICATIONS_PAGE_COPY.markAllRead}
          </LoadingButton>
        </Box>
      </Stack>

      {notifications.length === 0 ? (
        <Typography color="text.secondary">{emptyLabel}</Typography>
      ) : (
        <Stack spacing={listSpacing}>
          {notifications.map((notification) => {
            const clickable = Boolean(notification.productId);
            return (
              <Box
                key={notification.id}
                sx={{
                  ...alertCardSx(notification.unread),
                  ...(clickable ? alertCardClickableSx : null),
                }}
                onClick={() => handleOpen(notification)}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={(event) => {
                  if (!clickable) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleOpen(notification);
                  }
                }}
              >
                <Typography variant="subtitle1" sx={alertTitleSx(notification.unread)}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.body}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                  {new Date(notification.createdAt).toLocaleString(locale)}
                </Typography>
                <Stack direction="row" spacing={alertActionsSpacing} sx={alertActionsSx}>
                  {notification.unread && (
                    <LoadingButton
                      size="small"
                      variant="text"
                      loading={busyId === notification.id}
                      onClick={(event) => handleMarkRead(notification, event)}
                    >
                      {NOTIFICATIONS_PAGE_COPY.markRead}
                    </LoadingButton>
                  )}
                  {notification.productId && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpen(notification);
                      }}
                    >
                      {NOTIFICATIONS_PAGE_COPY.openProduct}
                    </Button>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

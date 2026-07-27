import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import SegmentedControl from "../../../components/common/SegmentedControl/SegmentedControl";
import NotificationCard from "../../../components/notifications/NotificationCard/NotificationCard";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { useNotificationActions } from "../../../hooks/useNotificationActions";
import { ApiError } from "../../../services/apiClient";
import {
  listNotifications,
  markAllNotificationsRead,
} from "../../../services/notificationService";
import { isNotificationNavigable } from "../../../utils/notifications/resolveNotificationDestination";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  pageToolbarActionsSx,
} from "../../../styles/pageStyles";
import { NOTIFICATIONS_PAGE_CONFIG } from "./notificationsPageConfig";
import { NOTIFICATIONS_PAGE_COPY } from "./notificationsPageCopy";
import {
  listSpacing,
  pageStackSpacing,
  toolbarRowProps,
} from "./NotificationsPage.styled";

export default function NotificationsPage() {
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState(NOTIFICATIONS_PAGE_CONFIG.defaultFilter);

  const { filters, listLimit, locale } = NOTIFICATIONS_PAGE_CONFIG;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const data = await listNotifications({
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

  const { markRead, openNotification } = useNotificationActions({
    onAfterMarkRead: () => load({ silent: true }),
    markReadSuccessMessage: NOTIFICATIONS_PAGE_COPY.markReadSuccess,
    markReadErrorMessage: NOTIFICATIONS_PAGE_COPY.markReadError,
  });

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (notification) => {
    setBusyId(notification.id);
    try {
      await markRead(notification);
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      success(NOTIFICATIONS_PAGE_COPY.markAllReadSuccess);
      await load({ silent: true });
    } catch (err) {
      error(err instanceof ApiError ? err.message : NOTIFICATIONS_PAGE_COPY.markAllReadError);
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  const emptyContent =
    filter === filters.unread
      ? {
          icon: MarkEmailReadOutlinedIcon,
          title: NOTIFICATIONS_PAGE_COPY.emptyUnreadTitle,
          description: NOTIFICATIONS_PAGE_COPY.emptyUnreadDescription,
        }
      : {
          icon: NotificationsNoneOutlinedIcon,
          title: NOTIFICATIONS_PAGE_COPY.emptyAllTitle,
          description: NOTIFICATIONS_PAGE_COPY.emptyAllDescription,
        };

  const filterOptions = [
    { value: filters.all, label: NOTIFICATIONS_PAGE_COPY.filterAll },
    { value: filters.unread, label: NOTIFICATIONS_PAGE_COPY.filterUnread },
  ];

  return (
    <Stack spacing={pageStackSpacing}>
      <Box>
        <Typography variant="h5">{NOTIFICATIONS_PAGE_COPY.title}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{NOTIFICATIONS_PAGE_COPY.subtitle}</Typography>
      </Box>

      <Stack {...toolbarRowProps}>
        <Box sx={{ minWidth: { sm: 240 }, maxWidth: { sm: 360 }, width: { xs: "100%", sm: "auto" } }}>
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            ariaLabel={NOTIFICATIONS_PAGE_COPY.title}
            options={filterOptions}
          />
        </Box>

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
        <EmptyState
          icon={emptyContent.icon}
          title={emptyContent.title}
          description={emptyContent.description}
        />
      ) : (
        <Stack spacing={listSpacing}>
          {notifications.map((notification) => {
            const navigable = isNotificationNavigable(notification);
            return (
              <NotificationCard
                key={notification.id}
                notification={notification}
                locale={locale}
                busy={busyId === notification.id}
                onMarkRead={() => handleMarkRead(notification)}
                onNavigate={navigable ? () => openNotification(notification) : undefined}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import NotificationCard from "../../../components/notifications/NotificationCard/NotificationCard";
import {
  isConsumptionNudge,
} from "../../../components/notifications/NotificationCard/notificationCardConfig";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../../services/notificationService";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
  pageToolbarActionsSx,
} from "../../../styles/pageStyles";
import { NOTIFICATIONS_PAGE_CONFIG } from "./notificationsPageConfig";
import { NOTIFICATIONS_PAGE_COPY } from "./notificationsPageCopy";
import {
  filterChipsSx,
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

  const { filters, listLimit, productPath, stockOutPath, locale } = NOTIFICATIONS_PAGE_CONFIG;

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

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (notification) => {
    if (!notification.unread) return;
    setBusyId(notification.id);
    try {
      await markNotificationRead(notification.id);
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
      await markAllNotificationsRead();
      success(NOTIFICATIONS_PAGE_COPY.markAllReadSuccess);
      await load({ silent: true });
    } catch (err) {
      error(err instanceof ApiError ? err.message : NOTIFICATIONS_PAGE_COPY.markAllReadError);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleOpen = async (notification) => {
    if (isConsumptionNudge(notification)) {
      if (notification.unread) {
        try {
          await markNotificationRead(notification.id);
        } catch {
          /* segue para a baixa mesmo se falhar marcar lida */
        }
      }
      navigate(stockOutPath);
      return;
    }
    if (notification.productId) {
      navigate(productPath(notification.productId));
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
        <Box sx={filterChipsSx} role="group" aria-label={NOTIFICATIONS_PAGE_COPY.title}>
          {filterOptions.map((option) => {
            const selected = filter === option.value;
            return (
              <Chip
                key={option.value}
                label={option.label}
                clickable
                color={selected ? "primary" : "default"}
                variant={selected ? "filled" : "outlined"}
                onClick={() => setFilter(option.value)}
              />
            );
          })}
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
            const clickable =
              Boolean(notification.productId) || isConsumptionNudge(notification);
            return (
              <NotificationCard
                key={notification.id}
                notification={notification}
                locale={locale}
                busy={busyId === notification.id}
                onMarkRead={() => handleMarkRead(notification)}
                onRegisterStockOut={() => handleOpen(notification)}
                onOpenProduct={() => navigate(productPath(notification.productId))}
                onClick={clickable ? () => handleOpen(notification) : undefined}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

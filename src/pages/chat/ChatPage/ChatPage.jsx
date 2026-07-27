import { useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { getChatSession, postChatMessage } from "../../../services/chatService";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
} from "../../../styles/pageStyles";
import { CHAT_PAGE_CONFIG } from "./chatPageConfig";
import { CHAT_PAGE_COPY, chatCtaLabel } from "./chatPageCopy";
import {
  bubbleCtaSx,
  bubbleMetaSx,
  bubbleRowSx,
  bubbleSx,
  composerFieldSx,
  composerRowSx,
  messagesBoxSx,
  pageStackSpacing,
} from "./ChatPage.styled";

export default function ChatPage() {
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChatSession();
      setSessionId(data.session?.id || null);
      setMessages(data.messages || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : CHAT_PAGE_COPY.loadError);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [loading, messages, scrollToBottom]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    setDraft("");
    try {
      const data = await postChatMessage({
        message: text,
        sessionId,
      });
      setSessionId(data.session?.id || sessionId);
      setMessages(data.messages || []);
    } catch (err) {
      setDraft(text);
      error(err instanceof ApiError ? err.message : CHAT_PAGE_COPY.sendError);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={pageStackSpacing}>
      <Box>
        <Typography variant="h5">{CHAT_PAGE_COPY.title}</Typography>
        <Typography sx={pageHeaderSubtitleSx}>{CHAT_PAGE_COPY.subtitle}</Typography>
      </Box>

      <Box sx={messagesBoxSx}>
        {messages.length === 0 ? (
          <EmptyState
            size="sm"
            icon={ChatOutlinedIcon}
            title={CHAT_PAGE_COPY.emptyTitle}
            description={CHAT_PAGE_COPY.emptyDescription}
          />
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";
            const path =
              !isUser && typeof message.payload?.path === "string"
                ? message.payload.path
                : null;
            return (
              <Box key={message.id} sx={bubbleRowSx(isUser)}>
                <Box sx={bubbleSx(isUser)}>
                  <Typography variant="caption" sx={bubbleMetaSx(isUser)}>
                    {isUser ? CHAT_PAGE_COPY.you : CHAT_PAGE_COPY.assistant}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {message.content}
                  </Typography>
                  {path && (
                    <Button
                      component={RouterLink}
                      to={path}
                      variant="contained"
                      size="small"
                      color="primary"
                      sx={bubbleCtaSx}
                    >
                      {chatCtaLabel(message.payload)}
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      <Box sx={composerRowSx}>
        <TextField
          label={CHAT_PAGE_COPY.inputLabel}
          placeholder={CHAT_PAGE_COPY.inputPlaceholder}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          fullWidth
          disabled={sending}
          slotProps={{ inputLabel: { shrink: true } }}
          inputProps={{ maxLength: CHAT_PAGE_CONFIG.maxMessageLength }}
          sx={composerFieldSx}
        />
        <LoadingButton
          variant="contained"
          loading={sending}
          disabled={!draft.trim()}
          onClick={handleSend}
        >
          {CHAT_PAGE_COPY.send}
        </LoadingButton>
      </Box>
    </Stack>
  );
}

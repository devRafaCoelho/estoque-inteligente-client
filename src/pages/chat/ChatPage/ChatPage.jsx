import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ChatProposalCard from "../../../components/chat/ChatProposalCard/ChatProposalCard";
import { isProposalPayload } from "../../../components/chat/ChatProposalCard/chatProposalCardCopy";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { getChatSession, postChatMessage } from "../../../services/chatService";
import { generateShoppingList } from "../../../services/shoppingListService";
import {
  pageHeaderSubtitleSx,
  pageLoadingBoxSx,
} from "../../../styles/pageStyles";
import { CHAT_PAGE_CONFIG } from "./chatPageConfig";
import { CHAT_PAGE_COPY } from "./chatPageCopy";
import {
  bubbleMetaSx,
  bubbleRowSx,
  bubbleSx,
  composerFieldSx,
  composerRowSx,
  messageColumnSx,
  messagesBoxSx,
  pageStackSpacing,
} from "./ChatPage.styled";

export default function ChatPage() {
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [ctaBusyId, setCtaBusyId] = useState(null);
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

  const handleProposalCta = async (message) => {
    const payload = message?.payload;
    if (!payload || ctaBusyId) return;

    const type = payload.type;
    const path =
      typeof payload.path === "string" && payload.path
        ? payload.path
        : type === "finance_tip"
          ? CHAT_PAGE_CONFIG.paths.finance
          : type === "shopping_list_proposal" || type === "shopping_list"
            ? CHAT_PAGE_CONFIG.paths.shoppingList
            : null;

    if (type === "shopping_list_proposal" && payload.requiresSave) {
      setCtaBusyId(message.id);
      try {
        await generateShoppingList(CHAT_PAGE_CONFIG.shoppingListGenerateMode);
        success(CHAT_PAGE_COPY.saveListSuccess);
        navigate(path || CHAT_PAGE_CONFIG.paths.shoppingList);
      } catch (err) {
        error(err instanceof ApiError ? err.message : CHAT_PAGE_COPY.saveListError);
      } finally {
        setCtaBusyId(null);
      }
      return;
    }

    if (path) {
      navigate(path);
    }
  };

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
            const showProposal = !isUser && isProposalPayload(message.payload);
            return (
              <Box key={message.id} sx={bubbleRowSx(isUser)}>
                <Box sx={messageColumnSx(isUser, showProposal)}>
                  <Box sx={bubbleSx(isUser)}>
                    <Typography variant="caption" sx={bubbleMetaSx(isUser)}>
                      {isUser ? CHAT_PAGE_COPY.you : CHAT_PAGE_COPY.assistant}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {message.content}
                    </Typography>
                  </Box>
                  {showProposal ? (
                    <ChatProposalCard
                      payload={message.payload}
                      busy={ctaBusyId === message.id}
                      onCta={() => handleProposalCta(message)}
                    />
                  ) : null}
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

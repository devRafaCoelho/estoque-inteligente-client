import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { textParseSchema } from "../../../schemas/intake/textParseSchema";
import {
  cancelStockOut,
  clearStockOutDrafts,
  listStockOuts,
  parseStockOutText,
} from "../../../services/stockOutService";
import { buildStockOutParsePayload } from "../../../utils/stockOut/stockOutForm";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import SpeechTextField from "../../../components/voice/SpeechRecordButton/SpeechTextField";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import {
  formatStockOutDraftTitle,
  formatStockOutDraftUpdatedAt,
  STOCK_OUT_PAGE_COPY,
} from "./stockOutPageCopy";
import { STOCK_OUT_PAGE_CONFIG } from "./stockOutPageConfig";
import {
  draftItemBodySx,
  draftItemMetaSx,
  draftItemSx,
  draftsHeaderIconSx,
  draftsHeaderRowSx,
  draftsHeaderTitleRowSx,
  draftsHeaderTitleSx,
  draftsSectionSpacing,
  stockOutFormStackSpacing,
} from "./StockOutPage.styled";

export default function StockOutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [draftToDiscard, setDraftToDiscard] = useState(null);
  const [discarding, setDiscarding] = useState(false);
  const [clearDraftsOpen, setClearDraftsOpen] = useState(false);
  const [clearingDrafts, setClearingDrafts] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(textParseSchema),
    defaultValues: STOCK_OUT_PAGE_CONFIG.defaultValues,
    mode: STOCK_OUT_PAGE_CONFIG.formMode,
  });

  const text = watch("text");
  const { ref: textRef, ...textField } = register("text");

  const loadDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const data = await listStockOuts({
        status: STOCK_OUT_PAGE_CONFIG.draftsStatus,
        limit: STOCK_OUT_PAGE_CONFIG.draftsLimit,
      });
      setDrafts(data.stockOuts || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PAGE_COPY.draftsLoadError);
    } finally {
      setDraftsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  useEffect(() => {
    const draftText = location.state?.draftText;
    if (!draftText || typeof draftText !== "string") return;

    setValue("text", draftText, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate, setValue]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await parseStockOutText(buildStockOutParsePayload(values));
      navigate(STOCK_OUT_PAGE_CONFIG.paths.preview(data.stockOut.id));
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PAGE_COPY.parseError);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueDraft = (draft) => {
    navigate(STOCK_OUT_PAGE_CONFIG.paths.preview(draft.id));
  };

  const handleDiscardConfirm = async () => {
    if (!draftToDiscard) return;
    setDiscarding(true);
    try {
      await cancelStockOut(draftToDiscard.id);
      setDrafts((prev) => prev.filter((row) => row.id !== draftToDiscard.id));
      setDraftToDiscard(null);
      success(STOCK_OUT_PAGE_COPY.draftDiscarded);
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PAGE_COPY.draftDiscardError);
    } finally {
      setDiscarding(false);
    }
  };

  const handleClearDraftsConfirm = async () => {
    setClearingDrafts(true);
    try {
      await clearStockOutDrafts();
      setDrafts([]);
      setClearDraftsOpen(false);
      success(STOCK_OUT_PAGE_COPY.clearDraftsSuccess);
    } catch (err) {
      error(err instanceof ApiError ? err.message : STOCK_OUT_PAGE_COPY.clearDraftsError);
    } finally {
      setClearingDrafts(false);
    }
  };

  return (
    <Stack spacing={stockOutFormStackSpacing} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box>
        <Typography variant="h5">{STOCK_OUT_PAGE_COPY.title}</Typography>
        <Typography variant="body2" sx={pageHeaderSubtitleSx}>
          {STOCK_OUT_PAGE_COPY.subtitle}
        </Typography>
      </Box>

      <SpeechTextField
        label={STOCK_OUT_PAGE_COPY.textLabel}
        placeholder={STOCK_OUT_PAGE_COPY.textPlaceholder}
        fullWidth
        minRows={2}
        maxRows={8}
        error={Boolean(errors.text)}
        helperText={errors.text?.message}
        value={text ?? ""}
        inputRef={textRef}
        speechDisabled={loading}
        showSubmit
        submitType="submit"
        submitLoading={loading}
        submitDisabled={String(text || "").trim().length < 3}
        submitAriaLabel={STOCK_OUT_PAGE_COPY.submitAria}
        slotProps={{ inputLabel: { shrink: true } }}
        {...textField}
        onChange={(next) =>
          setValue("text", next, { shouldValidate: true, shouldDirty: true })
        }
      />

      {!draftsLoading && drafts.length > 0 && (
        <Stack spacing={draftsSectionSpacing}>
          <Box sx={draftsHeaderRowSx}>
            <Box sx={draftsHeaderTitleRowSx}>
              <DraftsOutlinedIcon sx={draftsHeaderIconSx} aria-hidden />
              <Typography variant="h6" sx={draftsHeaderTitleSx}>
                {STOCK_OUT_PAGE_COPY.draftsTitle}
              </Typography>
            </Box>
            <LoadingButton
              type="button"
              variant="text"
              color="error"
              size="small"
              disabled={clearingDrafts}
              onClick={() => setClearDraftsOpen(true)}
            >
              {STOCK_OUT_PAGE_COPY.clearDrafts}
            </LoadingButton>
          </Box>
          <Stack spacing={1}>
            {drafts.map((draft) => {
              const updatedLabel = formatStockOutDraftUpdatedAt(draft.updatedAt);
              return (
                <Box
                  key={draft.id}
                  onClick={() => handleContinueDraft(draft)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleContinueDraft(draft);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  sx={draftItemSx}
                  aria-label={STOCK_OUT_PAGE_COPY.draftContinueAria}
                >
                  <Box sx={draftItemBodySx}>
                    <Typography fontWeight={700} noWrap>
                      {formatStockOutDraftTitle(draft)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={draftItemMetaSx}>
                      {STOCK_OUT_PAGE_COPY.draftItems(draft.itemCount)}
                      {updatedLabel ? ` · ${updatedLabel}` : ""}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={STOCK_OUT_PAGE_COPY.draftDiscardAria}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDraftToDiscard(draft);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      )}

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {STOCK_OUT_PAGE_COPY.intakePrompt}{" "}
        <Link component={RouterLink} to={STOCK_OUT_PAGE_CONFIG.paths.intake} fontWeight={700}>
          {STOCK_OUT_PAGE_COPY.intakeLink}
        </Link>
      </Typography>

      <ConfirmDialog
        open={Boolean(draftToDiscard)}
        onClose={() => {
          if (discarding) return;
          setDraftToDiscard(null);
        }}
        title={STOCK_OUT_PAGE_COPY.draftDiscardTitle}
        description={STOCK_OUT_PAGE_COPY.draftDiscardDescription}
        onConfirm={handleDiscardConfirm}
        confirmLoading={discarding}
        confirmLabel={STOCK_OUT_PAGE_COPY.draftDiscardConfirm}
        cancelLabel={STOCK_OUT_PAGE_COPY.draftDiscardCancel}
      />

      <ConfirmDialog
        open={clearDraftsOpen}
        onClose={() => {
          if (clearingDrafts) return;
          setClearDraftsOpen(false);
        }}
        title={STOCK_OUT_PAGE_COPY.clearDraftsTitle}
        description={STOCK_OUT_PAGE_COPY.clearDraftsDescription}
        onConfirm={handleClearDraftsConfirm}
        confirmLoading={clearingDrafts}
        confirmLabel={STOCK_OUT_PAGE_COPY.clearDraftsConfirm}
        cancelLabel={STOCK_OUT_PAGE_COPY.clearDraftsCancel}
      />
    </Stack>
  );
}

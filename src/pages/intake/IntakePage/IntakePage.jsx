import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { textParseSchema } from "../../../schemas/intake/textParseSchema";
import {
  cancelIntake,
  clearIntakeDrafts,
  listIntakes,
  parseIntakeText,
} from "../../../services/intakeService";
import { buildIntakeParsePayload } from "../../../utils/intake/intakeForm";
import ConfirmDialog from "../../../components/common/ConfirmDialog/ConfirmDialog";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { exampleChipSx, pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import {
  formatIntakeDraftTitle,
  formatIntakeDraftUpdatedAt,
  INTAKE_PAGE_COPY,
} from "./intakePageCopy";
import { INTAKE_PAGE_CONFIG } from "./intakePageConfig";
import {
  draftItemBodySx,
  draftItemMetaSx,
  draftItemSx,
  draftsHeaderRowSx,
  draftsHeaderTitleSx,
  draftsSectionSpacing,
  examplesRowSx,
  intakeFormStackSpacing,
} from "./IntakePage.styled";

export default function IntakePage() {
  const navigate = useNavigate();
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
    defaultValues: INTAKE_PAGE_CONFIG.defaultValues,
    mode: INTAKE_PAGE_CONFIG.formMode,
  });

  const text = watch("text");
  const { ref: textRef, ...textField } = register("text");

  const loadDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const data = await listIntakes({
        status: INTAKE_PAGE_CONFIG.draftsStatus,
        limit: INTAKE_PAGE_CONFIG.draftsLimit,
      });
      setDrafts(data.intakes || []);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.draftsLoadError);
    } finally {
      setDraftsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await parseIntakeText(buildIntakeParsePayload(values));
      navigate(INTAKE_PAGE_CONFIG.paths.preview(data.intake.id));
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.parseError);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueDraft = (draft) => {
    navigate(INTAKE_PAGE_CONFIG.paths.preview(draft.id));
  };

  const handleDiscardConfirm = async () => {
    if (!draftToDiscard) return;
    setDiscarding(true);
    try {
      await cancelIntake(draftToDiscard.id);
      setDrafts((prev) => prev.filter((row) => row.id !== draftToDiscard.id));
      setDraftToDiscard(null);
      success(INTAKE_PAGE_COPY.draftDiscarded);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.draftDiscardError);
    } finally {
      setDiscarding(false);
    }
  };

  const handleClearDraftsConfirm = async () => {
    setClearingDrafts(true);
    try {
      await clearIntakeDrafts();
      setDrafts([]);
      setClearDraftsOpen(false);
      success(INTAKE_PAGE_COPY.clearDraftsSuccess);
    } catch (err) {
      error(err instanceof ApiError ? err.message : INTAKE_PAGE_COPY.clearDraftsError);
    } finally {
      setClearingDrafts(false);
    }
  };

  return (
    <Stack spacing={intakeFormStackSpacing} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => navigate(INTAKE_PAGE_CONFIG.paths.dashboard)}
          aria-label={INTAKE_PAGE_COPY.backAria}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{INTAKE_PAGE_COPY.title}</Typography>
          <Typography variant="body2" sx={pageHeaderSubtitleSx}>
            {INTAKE_PAGE_COPY.subtitle}
          </Typography>
        </Box>
      </Stack>

      <TextField
        label={INTAKE_PAGE_COPY.textLabel}
        placeholder={INTAKE_PAGE_COPY.textPlaceholder}
        multiline
        minRows={4}
        fullWidth
        error={Boolean(errors.text)}
        helperText={errors.text?.message}
        value={text ?? ""}
        inputRef={textRef}
        slotProps={{ inputLabel: { shrink: true } }}
        {...textField}
        onChange={(e) =>
          setValue("text", e.target.value, { shouldValidate: true, shouldDirty: true })
        }
      />

      <Stack {...examplesRowSx}>
        {INTAKE_PAGE_CONFIG.examples.map((example) => (
          <Chip
            key={example}
            label={example}
            variant="outlined"
            onClick={() =>
              setValue("text", example, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            sx={exampleChipSx}
          />
        ))}
      </Stack>

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={loading}
        disabled={String(text || "").trim().length < 3}
      >
        {INTAKE_PAGE_COPY.submit}
      </LoadingButton>

      {!draftsLoading && drafts.length > 0 && (
        <Stack spacing={draftsSectionSpacing}>
          <Box sx={draftsHeaderRowSx}>
            <Typography variant="h6" sx={draftsHeaderTitleSx}>
              {INTAKE_PAGE_COPY.draftsTitle}
            </Typography>
            <LoadingButton
              type="button"
              variant="text"
              color="error"
              size="small"
              disabled={clearingDrafts}
              onClick={() => setClearDraftsOpen(true)}
            >
              {INTAKE_PAGE_COPY.clearDrafts}
            </LoadingButton>
          </Box>
          <Stack spacing={1}>
            {drafts.map((draft) => {
              const updatedLabel = formatIntakeDraftUpdatedAt(draft.updatedAt);
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
                  aria-label={INTAKE_PAGE_COPY.draftContinueAria}
                >
                  <Box sx={draftItemBodySx}>
                    <Typography fontWeight={700} noWrap>
                      {formatIntakeDraftTitle(draft)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={draftItemMetaSx}>
                      {INTAKE_PAGE_COPY.draftItems(draft.itemCount)}
                      {updatedLabel ? ` · ${updatedLabel}` : ""}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={INTAKE_PAGE_COPY.draftDiscardAria}
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
        {INTAKE_PAGE_COPY.stockOutPrompt}{" "}
        <Link component={RouterLink} to={INTAKE_PAGE_CONFIG.paths.stockOut} fontWeight={700}>
          {INTAKE_PAGE_COPY.stockOutLink}
        </Link>
      </Typography>

      <ConfirmDialog
        open={Boolean(draftToDiscard)}
        onClose={() => {
          if (discarding) return;
          setDraftToDiscard(null);
        }}
        title={INTAKE_PAGE_COPY.draftDiscardTitle}
        description={INTAKE_PAGE_COPY.draftDiscardDescription}
        onConfirm={handleDiscardConfirm}
        confirmLoading={discarding}
        confirmLabel={INTAKE_PAGE_COPY.draftDiscardConfirm}
        cancelLabel={INTAKE_PAGE_COPY.draftDiscardCancel}
      />

      <ConfirmDialog
        open={clearDraftsOpen}
        onClose={() => {
          if (clearingDrafts) return;
          setClearDraftsOpen(false);
        }}
        title={INTAKE_PAGE_COPY.clearDraftsTitle}
        description={INTAKE_PAGE_COPY.clearDraftsDescription}
        onConfirm={handleClearDraftsConfirm}
        confirmLoading={clearingDrafts}
        confirmLabel={INTAKE_PAGE_COPY.clearDraftsConfirm}
        cancelLabel={INTAKE_PAGE_COPY.clearDraftsCancel}
      />
    </Stack>
  );
}

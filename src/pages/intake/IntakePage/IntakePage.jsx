import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { textParseSchema } from "../../../schemas/intake/textParseSchema";
import { parseIntakeText } from "../../../services/intakeService";
import { buildIntakeParsePayload } from "../../../utils/intake/intakeForm";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { exampleChipSx, pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import { INTAKE_PAGE_COPY } from "./intakePageCopy";
import { INTAKE_PAGE_CONFIG } from "./intakePageConfig";
import { examplesRowSx, intakeFormStackSpacing } from "./IntakePage.styled";

export default function IntakePage() {
  const navigate = useNavigate();
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(false);
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
        helperText={errors.text?.message || INTAKE_PAGE_COPY.textHelper}
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

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {INTAKE_PAGE_COPY.stockOutPrompt}{" "}
        <Link component={RouterLink} to={INTAKE_PAGE_CONFIG.paths.stockOut} fontWeight={700}>
          {INTAKE_PAGE_COPY.stockOutLink}
        </Link>
      </Typography>
    </Stack>
  );
}

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
import { parseStockOutText } from "../../../services/stockOutService";
import { buildStockOutParsePayload } from "../../../utils/stockOut/stockOutForm";
import LoadingButton from "../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import { STOCK_OUT_PAGE_COPY } from "./stockOutPageCopy";
import { STOCK_OUT_PAGE_CONFIG } from "./stockOutPageConfig";
import { examplesRowSx, stockOutFormStackSpacing } from "./StockOutPage.styled";

export default function StockOutPage() {
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
    defaultValues: STOCK_OUT_PAGE_CONFIG.defaultValues,
    mode: STOCK_OUT_PAGE_CONFIG.formMode,
  });

  const text = watch("text");
  const { ref: textRef, ...textField } = register("text");

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

  return (
    <Stack spacing={stockOutFormStackSpacing} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => navigate(STOCK_OUT_PAGE_CONFIG.paths.dashboard)}
          aria-label={STOCK_OUT_PAGE_COPY.backAria}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{STOCK_OUT_PAGE_COPY.title}</Typography>
          <Typography variant="body2" sx={pageHeaderSubtitleSx}>
            {STOCK_OUT_PAGE_COPY.subtitle}
          </Typography>
        </Box>
      </Stack>

      <TextField
        label={STOCK_OUT_PAGE_COPY.textLabel}
        placeholder={STOCK_OUT_PAGE_COPY.textPlaceholder}
        multiline
        minRows={4}
        fullWidth
        error={Boolean(errors.text)}
        helperText={errors.text?.message || STOCK_OUT_PAGE_COPY.textHelper}
        value={text ?? ""}
        inputRef={textRef}
        slotProps={{ inputLabel: { shrink: true } }}
        {...textField}
        onChange={(e) =>
          setValue("text", e.target.value, { shouldValidate: true, shouldDirty: true })
        }
      />

      <Stack {...examplesRowSx}>
        {STOCK_OUT_PAGE_CONFIG.examples.map((example) => (
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
          />
        ))}
      </Stack>

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={loading}
        disabled={!String(text || "").trim()}
      >
        {STOCK_OUT_PAGE_COPY.submit}
      </LoadingButton>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        {STOCK_OUT_PAGE_COPY.intakePrompt}{" "}
        <Link component={RouterLink} to={STOCK_OUT_PAGE_CONFIG.paths.intake} fontWeight={700}>
          {STOCK_OUT_PAGE_COPY.intakeLink}
        </Link>
      </Typography>
    </Stack>
  );
}

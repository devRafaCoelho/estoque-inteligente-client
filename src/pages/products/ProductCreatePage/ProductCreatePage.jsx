import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ManualProductStage from "../../../components/products/ManualProductStage/ManualProductStage";
import { formStackSpacing } from "../../../styles/formStyles";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import { PRODUCT_CREATE_CONFIG } from "./productCreateConfig";
import { PRODUCT_CREATE_COPY } from "./productCreateCopy";
import { pageHeaderLeftSx, pageHeaderRowSx } from "./ProductCreatePage.styled";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={formStackSpacing}>
      <Box sx={pageHeaderRowSx}>
        <Box sx={pageHeaderLeftSx}>
          <IconButton
            onClick={() => navigate(PRODUCT_CREATE_CONFIG.paths.list)}
            aria-label={PRODUCT_CREATE_COPY.backAria}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box minWidth={0}>
            <Typography variant="h5">{PRODUCT_CREATE_COPY.title}</Typography>
            <Typography sx={pageHeaderSubtitleSx}>{PRODUCT_CREATE_COPY.subtitle}</Typography>
          </Box>
        </Box>
      </Box>

      <ManualProductStage
        showIntro={false}
        onSaved={() => navigate(PRODUCT_CREATE_CONFIG.paths.list)}
      />
    </Stack>
  );
}

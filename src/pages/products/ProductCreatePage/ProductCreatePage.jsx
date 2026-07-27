import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ManualProductStage from "../../../components/products/ManualProductStage/ManualProductStage";
import { formStackSpacing } from "../../../styles/formStyles";
import {
  pageBackHeaderGridSx,
  pageBackIconCellSx,
  pageBackSubtitleCellSx,
  pageBackTitleCellSx,
} from "../../../styles/pageStyles";
import { PRODUCT_CREATE_CONFIG } from "./productCreateConfig";
import { PRODUCT_CREATE_COPY } from "./productCreateCopy";
import { pageHeaderRowSx } from "./ProductCreatePage.styled";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={formStackSpacing}>
      <Box sx={pageHeaderRowSx}>
        <Box sx={pageBackHeaderGridSx}>
          <IconButton
            onClick={() => navigate(PRODUCT_CREATE_CONFIG.paths.list)}
            aria-label={PRODUCT_CREATE_COPY.backAria}
            sx={pageBackIconCellSx}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={pageBackTitleCellSx}>
            {PRODUCT_CREATE_COPY.title}
          </Typography>
          <Typography sx={pageBackSubtitleCellSx}>{PRODUCT_CREATE_COPY.subtitle}</Typography>
        </Box>
      </Box>

      <ManualProductStage
        showIntro={false}
        onSaved={() => navigate(PRODUCT_CREATE_CONFIG.paths.list)}
      />
    </Stack>
  );
}

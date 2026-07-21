import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import brandLogo from "../../../assets/brand-logo.png";
import { AUTH_SPLIT_LAYOUT_COPY } from "./authSplitLayoutCopy";
import {
  authSplitBrandGlowSx,
  authSplitBrandLogoSx,
  authSplitBrandPanelSx,
  authSplitBrandSubtitleSx,
  authSplitFeatureIconSx,
  authSplitFeatureItemSx,
  authSplitFeatureTextSx,
  authSplitFeaturesStackSx,
  authSplitFormHeaderSx,
  authSplitFormPanelSx,
  authSplitFormSubtitleSx,
  authSplitPaperSx,
  authSplitRootSx,
} from "./AuthSplitLayout.styled";

/**
 * Layout split de autenticação:
 * painel de marca à esquerda + formulário à direita; no mobile/tablet, marca no topo.
 */
export default function AuthSplitLayout({
  formTitle,
  formSubtitle,
  brandSubtitle = AUTH_SPLIT_LAYOUT_COPY.defaultBrandSubtitle,
  children,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={authSplitRootSx(theme, isMobile)}>
      <Paper elevation={0} sx={authSplitPaperSx(theme)}>
        <Box sx={authSplitBrandPanelSx(theme, isMobile)}>
          <Box sx={authSplitBrandGlowSx} />

          <Box
            component="img"
            src={brandLogo}
            alt={AUTH_SPLIT_LAYOUT_COPY.logoAlt}
            sx={authSplitBrandLogoSx}
          />

          {brandSubtitle && (
            <Typography variant="body1" sx={authSplitBrandSubtitleSx}>
              {brandSubtitle}
            </Typography>
          )}

          {!isMobile && (
            <Stack spacing={1.75} sx={authSplitFeaturesStackSx}>
              {AUTH_SPLIT_LAYOUT_COPY.featureBullets.map((item) => (
                <Box key={item} sx={authSplitFeatureItemSx}>
                  <CheckCircleOutlineIcon sx={authSplitFeatureIconSx} />
                  <Typography variant="body2" sx={authSplitFeatureTextSx}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={authSplitFormPanelSx}>
          <Box sx={authSplitFormHeaderSx}>
            <Typography variant="h5" fontWeight={800}>
              {formTitle}
            </Typography>
            {formSubtitle ? (
              <Typography color="text.secondary" sx={authSplitFormSubtitleSx}>
                {formSubtitle}
              </Typography>
            ) : null}
          </Box>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}

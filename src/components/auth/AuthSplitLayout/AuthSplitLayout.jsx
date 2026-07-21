import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import brandIcon from "../../../assets/brand-icon.png";
import brandLogo from "../../../assets/brand-logo.png";
import { AUTH_SPLIT_LAYOUT_COPY } from "./authSplitLayoutCopy";
import {
  authSplitBrandGlowSx,
  authSplitBrandLogoSx,
  authSplitBrandPanelSx,
  authSplitBrandSubtitleSx,
  authSplitBrandTitleSx,
  authSplitFeatureItemSx,
  authSplitFeaturesStackSx,
  authSplitFormHeaderSx,
  authSplitFormPanelSx,
  authSplitFormSubtitleSx,
  authSplitPaperSx,
  authSplitRootSx,
} from "./AuthSplitLayout.styled";

/**
 * Layout split de autenticação (web), no espírito do my-products-front:
 * painel de marca à esquerda + formulário à direita; no mobile, marca no topo.
 */
export default function AuthSplitLayout({
  formTitle,
  formSubtitle,
  brandTitle = AUTH_SPLIT_LAYOUT_COPY.defaultBrandTitle,
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
            src={isMobile ? brandIcon : brandLogo}
            alt={brandTitle}
            sx={authSplitBrandLogoSx(isMobile)}
          />

          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={800}
            sx={authSplitBrandTitleSx}
          >
            {brandTitle}
          </Typography>
          <Typography variant="body1" sx={authSplitBrandSubtitleSx}>
            {brandSubtitle}
          </Typography>

          {!isMobile && (
            <Stack spacing={1} sx={authSplitFeaturesStackSx}>
              {AUTH_SPLIT_LAYOUT_COPY.featureBullets.map((item) => (
                <Typography key={item} variant="body2" sx={authSplitFeatureItemSx}>
                  • {item}
                </Typography>
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={authSplitFormPanelSx}>
          <Box sx={authSplitFormHeaderSx}>
            <Typography variant="h5" fontWeight={800}>
              {formTitle}
            </Typography>
            {formSubtitle && (
              <Typography color="text.secondary" sx={authSplitFormSubtitleSx}>
                {formSubtitle}
              </Typography>
            )}
          </Box>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}

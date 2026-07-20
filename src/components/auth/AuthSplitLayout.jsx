import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import brandIcon from "../../assets/brand-icon.png";
import brandLogo from "../../assets/brand-logo.png";

/**
 * Layout split de autenticação (web), no espírito do my-products-front:
 * painel de marca à esquerda + formulário à direita; no mobile, marca no topo.
 */
export default function AuthSplitLayout({
  formTitle,
  formSubtitle,
  brandTitle = "Estoque Inteligente",
  brandSubtitle = "Gerencie o estoque da casa com praticidade e inteligência",
  children,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isMobile
          ? theme.palette.background.default
          : `linear-gradient(90deg, ${theme.palette.primary.dark} 50%, ${theme.palette.background.default} 50%)`,
        p: { xs: 0, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: 960 },
          minHeight: { xs: "100dvh", md: 560 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          borderRadius: { xs: 0, md: 4 },
          border: "none",
          outline: "none",
          // fundo do Paper acompanha cada metade do layout:
          // esquerda = primary.dark (igual ao bg da página),
          // direita = paper — evita halo no anti-aliasing do radius
          background: {
            xs: theme.palette.background.paper,
            md: `linear-gradient(90deg, ${theme.palette.primary.dark} 46%, ${theme.palette.background.paper} 46%)`,
          },
          bgcolor: "transparent",
          boxShadow: {
            xs: "none",
            md: "0 18px 48px rgba(15, 61, 40, 0.28)",
          },
        }}
      >
        {/* Painel de marca */}
        <Box
          sx={{
            flex: { md: "0 0 46%" },
            alignSelf: "stretch",
            background: isMobile
              ? `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, #0b1220 55%, #122018 100%)`
              : `linear-gradient(160deg, #0b1220 0%, ${theme.palette.primary.dark} 55%, #163528 100%)`,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            position: "relative",
            overflow: "hidden",
            border: "none",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 20% 20%, rgba(46,160,67,0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(33,150,243,0.18), transparent 40%)",
              pointerEvents: "none",
            }}
          />

          <Box
            component="img"
            src={isMobile ? brandIcon : brandLogo}
            alt={brandTitle}
            sx={{
              position: "relative",
              width: isMobile ? 120 : "100%",
              maxWidth: isMobile ? 140 : 320,
              height: "auto",
              objectFit: "contain",
              mb: { xs: 2, md: 3 },
              filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.45))",
            }}
          />

          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={800}
            sx={{ position: "relative", lineHeight: 1.15 }}
          >
            {brandTitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{ position: "relative", mt: 1.25, opacity: 0.9, maxWidth: 340 }}
          >
            {brandSubtitle}
          </Typography>

          {!isMobile && (
            <Stack spacing={1} sx={{ position: "relative", mt: 4 }}>
              {[
                "Saiba o que está acabando",
                "Monte a lista de compras com IA",
                "Controle gastos do mercado",
              ].map((item) => (
                <Typography key={item} variant="body2" sx={{ opacity: 0.82 }}>
                  • {item}
                </Typography>
              ))}
            </Stack>
          )}
        </Box>

        {/* Formulário */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 3, md: 5 },
            mt: { xs: -2, md: 0 },
            bgcolor: "background.paper",
            borderRadius: { xs: "24px 24px 0 0", md: 0 },
            position: "relative",
            zIndex: 1,
            boxShadow: { xs: "0 -8px 24px rgba(0,0,0,0.12)", md: "none" },
          }}
        >
          <Box sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h5" fontWeight={800}>
              {formTitle}
            </Typography>
            {formSubtitle && (
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
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

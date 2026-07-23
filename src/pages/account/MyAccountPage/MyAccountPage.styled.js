/** Estilos da página Minha Conta (`MyAccountPage`). */

export const pageStackSpacing = 3;

export const layoutGridSx = {
  display: "grid",
  gap: 3,
  gridTemplateColumns: {
    xs: "1fr",
    lg: "minmax(280px, 380px) minmax(0, 1fr)",
  },
  alignItems: "start",
};

export const columnSx = {
  width: "100%",
  minWidth: 0,
};

export const rightColumnStackSpacing = 3;

export const resumoCardSx = {
  textAlign: "center",
  height: "100%",
};

export const cardContentSx = {
  p: 3,
};

export const avatarSx = {
  width: 96,
  height: 96,
  bgcolor: "primary.main",
  fontSize: "2rem",
  fontWeight: 700,
  mx: "auto",
  mb: 2,
};

export const dividerSx = {
  my: 3,
};

export const infoBlockSx = {
  textAlign: "left",
  mb: 2,
};

export const infoListSpacing = 1.25;

export const infoLabelRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  mb: 0.25,
};

export const infoLabelSx = {
  color: "text.secondary",
};

export const infoIconSx = {
  fontSize: 16,
  color: "text.secondary",
};

export const infoValueSx = {
  pl: "22px",
};

export const firstActionButtonSx = {
  mt: 2,
};

export const actionButtonSx = {
  mt: 1.5,
};

export const providersRowSx = {
  direction: "row",
  spacing: 1,
  flexWrap: "wrap",
  useFlexGap: true,
  justifyContent: "center",
  mt: 1.5,
};

export const sectionCardContentSx = {
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

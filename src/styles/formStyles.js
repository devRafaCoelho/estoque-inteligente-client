/**
 * Estilos compartilhados para formulários.
 */

export const formStackSpacing = 2.5;

export const formGridSx = {
  display: "grid",
  gap: { xs: 2, sm: 1.5 },
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  overflow: "visible",
  "& .MuiFormControl-root": {
    overflow: "visible",
  },
};

export const fullWidthFieldSx = {
  gridColumn: "1 / -1",
};

export const formFieldRowSx = {
  direction: { xs: "column", sm: "row" },
};

export const unitSelectMinWidthSx = {
  minWidth: { sm: 120 },
};

export const confirmationRowSx = {
  px: 1.5,
  py: 1,
  borderRadius: 2,
  bgcolor: "background.default",
};

export const confirmationHeaderSx = {
  mb: 2.5,
  textAlign: "center",
};

export const confirmationIconSx = {
  fontSize: 40,
};

import { useSnackbar } from "notistack";
import { useCallback } from "react";

export function useAppSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  const success = useCallback(
    (message) => enqueueSnackbar(message, { variant: "success" }),
    [enqueueSnackbar],
  );
  const error = useCallback(
    (message) => enqueueSnackbar(message, { variant: "error" }),
    [enqueueSnackbar],
  );
  const info = useCallback(
    (message) => enqueueSnackbar(message, { variant: "info" }),
    [enqueueSnackbar],
  );

  return { success, error, info };
}

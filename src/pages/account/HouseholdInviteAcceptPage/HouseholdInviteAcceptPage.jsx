import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  acceptHouseholdInvite,
  getMyHousehold,
} from "../../../services/householdService";
import { pageHeaderSubtitleSx } from "../../../styles/pageStyles";
import { HOUSEHOLD_INVITE_PAGE_COPY as COPY } from "../MyAccountPage/householdCopy";

const PENDING_HOUSEHOLD_INVITE_KEY = "pendingHouseholdInviteToken";

function clearPendingToken() {
  sessionStorage.removeItem(PENDING_HOUSEHOLD_INVITE_KEY);
}

export default function HouseholdInviteAcceptPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const tokenFromSession =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem(PENDING_HOUSEHOLD_INVITE_KEY) || ""
      : "";
  const token = tokenFromUrl || tokenFromSession;
  const { success, error } = useAppSnackbar();
  const [status, setStatus] = useState(token ? "loading" : "missing");
  const [message, setMessage] = useState("");
  const [householdName, setHouseholdName] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await acceptHouseholdInvite({ token });
        if (cancelled) return;
        clearPendingToken();
        setHouseholdName(data.household?.name || "");
        setStatus("ok");
        setMessage(COPY.success);
        success(COPY.success);
      } catch (err) {
        if (cancelled) return;

        // Convite já usado / já membro: se já está na casa, tratar como sucesso
        if (err instanceof ApiError && (err.status === 409 || err.status === 410)) {
          try {
            const me = await getMyHousehold();
            if (!cancelled && me.household) {
              clearPendingToken();
              setHouseholdName(me.household.name || "");
              setStatus("ok");
              setMessage(COPY.success);
              return;
            }
          } catch {
            // cai no erro abaixo
          }
        }

        const msg = err instanceof ApiError ? err.message : COPY.error;
        setStatus("error");
        setMessage(msg);
        error(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
    // snackbars omitidos de deps de propósito (evitam cancelar o request no Strict Mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 520, mx: "auto", width: "100%" }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {COPY.title}
        </Typography>
        <Typography sx={pageHeaderSubtitleSx}>{COPY.subtitle}</Typography>
      </Box>

      <Card>
        <CardContent>
          {status === "loading" ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary">
                {COPY.accepting}
              </Typography>
            </Stack>
          ) : null}

          {status === "missing" ? (
            <Typography color="error">{COPY.missingToken}</Typography>
          ) : null}

          {status === "ok" ? (
            <Stack spacing={2}>
              <Typography>{message}</Typography>
              {householdName ? (
                <Typography variant="body2" color="text.secondary">
                  {householdName}
                </Typography>
              ) : null}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  component={RouterLink}
                  to="/minha-conta"
                  variant="contained"
                >
                  {COPY.goAccount}
                </Button>
                <Button component={RouterLink} to="/dashboard" variant="outlined">
                  {COPY.goDashboard}
                </Button>
              </Stack>
            </Stack>
          ) : null}

          {status === "error" ? (
            <Stack spacing={2}>
              <Typography color="error">{message || COPY.error}</Typography>
              <Typography variant="body2" color="text.secondary">
                {COPY.loginHint}
              </Typography>
              <Button component={RouterLink} to="/minha-conta" variant="contained">
                {COPY.goAccount}
              </Button>
            </Stack>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  );
}

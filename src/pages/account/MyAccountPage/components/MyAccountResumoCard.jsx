import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalPostOfficeOutlinedIcon from "@mui/icons-material/LocalPostOfficeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatCpf, formatPhone, formatZipCode } from "../../../../utils/address";
import { MY_ACCOUNT_RESUMO_COPY } from "../myAccountCopy";
import {
  actionButtonSx,
  avatarSx,
  cardContentSx,
  dividerSx,
  firstActionButtonSx,
  infoBlockSx,
  infoIconSx,
  infoLabelRowSx,
  infoLabelSx,
  infoListSpacing,
  infoValueSx,
  providersRowSx,
  resumoCardSx,
} from "../MyAccountPage.styled";

/**
 * @param {Object} props
 * @param {string} props.displayName
 * @param {string} props.displayInitials
 * @param {string} [props.email]
 * @param {object} [props.user]
 * @param {string} props.estadoLabel
 * @param {string[]} [props.providers]
 * @param {() => void} props.onEditarDados
 * @param {() => void} props.onAlterarSenha
 * @param {() => void} props.onLogout
 */
export default function MyAccountResumoCard({
  displayName,
  displayInitials,
  email,
  user,
  estadoLabel,
  providers = [],
  onEditarDados,
  onAlterarSenha,
  onLogout,
}) {
  const phoneLabel = user?.phone
    ? formatPhone(user.phone)
    : MY_ACCOUNT_RESUMO_COPY.emptyValue;
  const cpfLabel = user?.cpf
    ? formatCpf(user.cpf)
    : MY_ACCOUNT_RESUMO_COPY.emptyValue;
  const zipLabel = user?.zipCode
    ? formatZipCode(user.zipCode)
    : MY_ACCOUNT_RESUMO_COPY.emptyValue;

  const streetLine = [user?.street, user?.streetNumber].filter(Boolean).join(", ");
  const addressLine = [
    streetLine,
    user?.complement,
    user?.neighborhood,
    [user?.city, user?.defaultState].filter(Boolean).join(" - "),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card sx={resumoCardSx}>
      <CardContent sx={cardContentSx}>
        <Avatar sx={avatarSx}>{displayInitials}</Avatar>
        <Typography variant="h6" fontWeight={700}>
          {displayName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>

        {providers.length > 0 && (
          <Stack
            direction={providersRowSx.direction}
            spacing={providersRowSx.spacing}
            flexWrap={providersRowSx.flexWrap}
            useFlexGap={providersRowSx.useFlexGap}
            justifyContent={providersRowSx.justifyContent}
            sx={{ mt: providersRowSx.mt }}
          >
            {providers.map((provider) => (
              <Chip
                key={provider}
                size="small"
                label={provider}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}

        <Divider sx={dividerSx} />

        <Stack spacing={infoListSpacing} sx={infoBlockSx}>
          <InfoRow
            icon={PhoneOutlinedIcon}
            label={MY_ACCOUNT_RESUMO_COPY.phoneLabel}
            value={phoneLabel}
          />
          <InfoRow
            icon={BadgeOutlinedIcon}
            label={MY_ACCOUNT_RESUMO_COPY.cpfLabel}
            value={cpfLabel}
          />
          <InfoRow
            icon={MapOutlinedIcon}
            label={MY_ACCOUNT_RESUMO_COPY.estadoLabel}
            value={estadoLabel}
          />
          <InfoRow
            icon={LocalPostOfficeOutlinedIcon}
            label={MY_ACCOUNT_RESUMO_COPY.zipCodeLabel}
            value={zipLabel}
          />
          <InfoRow
            icon={HomeOutlinedIcon}
            label={MY_ACCOUNT_RESUMO_COPY.addressLabel}
            value={addressLine || MY_ACCOUNT_RESUMO_COPY.emptyValue}
          />
        </Stack>

        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          fullWidth
          sx={firstActionButtonSx}
          onClick={onEditarDados}
        >
          {MY_ACCOUNT_RESUMO_COPY.editarDados}
        </Button>

        <Button
          variant="outlined"
          startIcon={<LockOutlinedIcon />}
          fullWidth
          sx={actionButtonSx}
          onClick={onAlterarSenha}
        >
          {MY_ACCOUNT_RESUMO_COPY.alterarSenha}
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<LogoutOutlinedIcon />}
          fullWidth
          sx={actionButtonSx}
          onClick={onLogout}
        >
          {MY_ACCOUNT_RESUMO_COPY.logout}
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <Box>
      <Box sx={infoLabelRowSx}>
        <Icon sx={infoIconSx} aria-hidden />
        <Typography variant="caption" sx={infoLabelSx} fontWeight={600}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight={500} sx={infoValueSx}>
        {value}
      </Typography>
    </Box>
  );
}

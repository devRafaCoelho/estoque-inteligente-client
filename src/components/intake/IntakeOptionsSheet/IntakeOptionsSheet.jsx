import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { INTAKE_OPTIONS_COPY } from "./intakeOptionsCopy";
import { INTAKE_OPTIONS_CONFIG } from "./intakeOptionsConfig";
import {
  intakeOptionsHeaderSx,
  intakeOptionsListSx,
  intakeOptionsPaperSx,
  intakeOptionSecondarySx,
} from "./IntakeOptionsSheet.styled";

/**
 * Sheet de escolha do fluxo de entrada (scanner / texto / manual).
 * Scanner fica preparado para a fase 2, sem ação real ainda.
 */
export default function IntakeOptionsSheet({ open, onClose }) {
  const navigate = useNavigate();
  const { info } = useAppSnackbar();

  const handleSelect = (option) => {
    if (option.comingSoon) {
      info(INTAKE_OPTIONS_COPY.scannerComingSoon);
      return;
    }
    onClose?.();
    if (option.path) navigate(option.path);
  };

  const options = [
    {
      id: "scanner",
      label: INTAKE_OPTIONS_COPY.scannerLabel,
      description: INTAKE_OPTIONS_COPY.scannerDescription,
      icon: DocumentScannerOutlinedIcon,
      comingSoon: true,
    },
    {
      id: "text",
      label: INTAKE_OPTIONS_COPY.textLabel,
      description: INTAKE_OPTIONS_COPY.textDescription,
      icon: EditNoteOutlinedIcon,
      path: INTAKE_OPTIONS_CONFIG.paths.text,
    },
    {
      id: "manual",
      label: INTAKE_OPTIONS_COPY.manualLabel,
      description: INTAKE_OPTIONS_COPY.manualDescription,
      icon: Inventory2OutlinedIcon,
      path: INTAKE_OPTIONS_CONFIG.paths.manual,
    },
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: intakeOptionsPaperSx }}
    >
      <Box sx={intakeOptionsHeaderSx}>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>
            {INTAKE_OPTIONS_COPY.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {INTAKE_OPTIONS_COPY.subtitle}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label={INTAKE_OPTIONS_COPY.closeAria} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={intakeOptionsListSx}>
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <ListItemButton key={option.id} onClick={() => handleSelect(option)} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 44, color: "primary.main" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={700}>{option.label}</Typography>
                    {option.comingSoon ? (
                      <Chip
                        size="small"
                        label={INTAKE_OPTIONS_COPY.comingSoonChip}
                        color="default"
                        variant="outlined"
                      />
                    ) : null}
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={intakeOptionSecondarySx}>
                    {option.description}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

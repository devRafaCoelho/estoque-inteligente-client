import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { INTAKE_OPTIONS_COPY } from "./intakeOptionsCopy";
import { INTAKE_OPTIONS_CONFIG } from "./intakeOptionsConfig";
import {
  intakeOptionsHeaderSx,
  intakeOptionsListSx,
  intakeOptionsPaperSx,
  intakeOptionSecondarySx,
} from "./IntakeOptionsSheet.styled";

/**
 * Sheet de escolha do fluxo de entrada (foto / texto / manual).
 * QR/NF-e fica preparado para a Sprint 5.
 */
export default function IntakeOptionsSheet({ open, onClose }) {
  const navigate = useNavigate();

  const handleSelect = (option) => {
    if (option.disabled) return;
    onClose?.();
    if (option.path) navigate(option.path);
  };

  const options = [
    {
      id: "photo",
      label: INTAKE_OPTIONS_COPY.photoLabel,
      description: INTAKE_OPTIONS_COPY.photoDescription,
      icon: PhotoCameraOutlinedIcon,
      path: INTAKE_OPTIONS_CONFIG.paths.photo,
    },
    {
      id: "text",
      label: INTAKE_OPTIONS_COPY.textLabel,
      description: INTAKE_OPTIONS_COPY.textDescription,
      icon: EditNoteOutlinedIcon,
      path: INTAKE_OPTIONS_CONFIG.paths.text,
    },
    {
      id: "scanner",
      label: INTAKE_OPTIONS_COPY.scannerLabel,
      description: INTAKE_OPTIONS_COPY.scannerDescription,
      icon: DocumentScannerOutlinedIcon,
      disabled: true,
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
            <ListItemButton
              key={option.id}
              disabled={Boolean(option.disabled)}
              onClick={() => handleSelect(option)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 44, color: "primary.main" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight={700}>{option.label}</Typography>
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

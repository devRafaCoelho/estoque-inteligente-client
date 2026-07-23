import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import EmptyState from "../../common/EmptyState/EmptyState";
import { formatQuantity } from "../../../utils/unitLabels";
import { SHOPPING_CHECKLIST_COPY } from "./shoppingChecklistCopy";
import { SHOPPING_CHECKLIST_CONFIG } from "./shoppingChecklistConfig";
import {
  checklistCheckboxSx,
  checklistChipsRowSx,
  checklistItemSx,
  checklistNameBoxSx,
  checklistNameSx,
} from "./ShoppingChecklist.styled";

export default function ShoppingChecklist({ items, onToggle, onDelete, busyId }) {
  if (!items?.length) {
    return (
      <EmptyState
        size="sm"
        icon={ShoppingCartOutlinedIcon}
        title={SHOPPING_CHECKLIST_COPY.emptyTitle}
        description={SHOPPING_CHECKLIST_COPY.emptyDescription}
      />
    );
  }

  return (
    <Stack spacing={1}>
      {items.map((item) => (
        <Box key={item.id} sx={checklistItemSx(item.checked)}>
          <Checkbox
            checked={Boolean(item.checked)}
            disabled={busyId === item.id}
            onChange={() => onToggle(item)}
            sx={checklistCheckboxSx}
          />
          <Box sx={checklistNameBoxSx}>
            <Typography fontWeight={700} sx={checklistNameSx(item.checked)} noWrap>
              {item.name}
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              flexWrap="wrap"
              useFlexGap
              sx={checklistChipsRowSx}
            >
              {item.suggestedQty != null && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={formatQuantity(item.suggestedQty, item.unit)}
                />
              )}
              <Chip
                size="small"
                color={
                  SHOPPING_CHECKLIST_CONFIG.priorityColor[item.priority] ||
                  SHOPPING_CHECKLIST_CONFIG.defaultPriorityColor
                }
                variant="outlined"
                label={
                  SHOPPING_CHECKLIST_COPY.originLabels[item.origin] || item.origin
                }
              />
            </Stack>
          </Box>
          <IconButton
            size="small"
            aria-label={SHOPPING_CHECKLIST_COPY.removeAria}
            disabled={busyId === item.id}
            onClick={() => onDelete(item)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
}

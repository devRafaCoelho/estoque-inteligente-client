import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatQuantity } from "../../../utils/unitLabels";
import { PAPER_SHOPPING_LIST_COPY } from "./paperShoppingListCopy";
import {
  paperCheckboxSx,
  paperDeleteSx,
  paperEmptySx,
  paperItemRowSx,
  paperItemTextSx,
  paperRootSx,
  paperTitleSx,
} from "./PaperShoppingList.styled";

/**
 * Mesmos dados/ações do checklist, visual de papel manuscrito.
 */
export default function PaperShoppingList({ items, onToggle, onDelete, busyId, title }) {
  return (
    <Box sx={paperRootSx}>
      <Typography sx={paperTitleSx}>
        {title || PAPER_SHOPPING_LIST_COPY.defaultTitle}
      </Typography>

      {!items?.length ? (
        <Typography sx={paperEmptySx}>{PAPER_SHOPPING_LIST_COPY.empty}</Typography>
      ) : (
        <Stack spacing={0.25}>
          {items.map((item) => (
            <Box key={item.id} sx={paperItemRowSx(item.checked)}>
              <Checkbox
                checked={Boolean(item.checked)}
                disabled={busyId === item.id}
                onChange={() => onToggle(item)}
                size="small"
                sx={paperCheckboxSx}
              />
              <Typography sx={paperItemTextSx(item.checked)}>
                {item.name}
                {item.suggestedQty != null
                  ? ` — ${formatQuantity(item.suggestedQty, item.unit)}`
                  : ""}
              </Typography>
              <IconButton
                size="small"
                aria-label={PAPER_SHOPPING_LIST_COPY.removeAria}
                disabled={busyId === item.id}
                onClick={() => onDelete(item)}
                sx={paperDeleteSx}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

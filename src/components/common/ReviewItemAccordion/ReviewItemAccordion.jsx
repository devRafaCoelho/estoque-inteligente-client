import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  reviewItemAccordionSx,
  reviewItemDetailsSx,
  reviewItemSummaryActionsSx,
  reviewItemSummaryMetaSx,
  reviewItemSummarySx,
  reviewItemSummaryTextSx,
  reviewItemWrapSx,
} from "./ReviewItemAccordion.styled";

/**
 * Card accordion reutilizável para revisão de itens (entrada / baixa).
 *
 * @param {Object} props
 * @param {boolean} props.expanded
 * @param {(expanded: boolean) => void} props.onExpandedChange
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {React.ReactNode} [props.chips]
 * @param {() => void} props.onDelete
 * @param {string} props.deleteAriaLabel
 * @param {string} props.expandAriaLabel
 * @param {string} [props.accentBorderColor]
 * @param {React.ReactNode} props.children
 */
export default function ReviewItemAccordion({
  expanded,
  onExpandedChange,
  title,
  subtitle,
  chips,
  onDelete,
  deleteAriaLabel,
  expandAriaLabel,
  accentBorderColor = "primary.light",
  children,
}) {
  return (
    <Box sx={reviewItemWrapSx}>
      <Accordion
        disableGutters
        expanded={expanded}
        onChange={(_event, isExpanded) => onExpandedChange(isExpanded)}
        sx={reviewItemAccordionSx(accentBorderColor)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label={expandAriaLabel}
          sx={reviewItemSummarySx}
        >
          <Box sx={reviewItemSummaryTextSx}>
            <Typography fontWeight={700} noWrap>
              {title}
            </Typography>
            <Typography variant="body2" sx={reviewItemSummaryMetaSx} noWrap>
              {subtitle}
            </Typography>
          </Box>
          <Box sx={reviewItemSummaryActionsSx}>
            {chips}
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              aria-label={deleteAriaLabel}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={reviewItemDetailsSx}>{children}</AccordionDetails>
      </Accordion>
    </Box>
  );
}

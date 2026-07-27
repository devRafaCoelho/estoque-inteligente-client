import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "../../common/LoadingButton/LoadingButton";
import {
  isProposalPayload,
  proposalCardBody,
  proposalCardTitle,
  proposalCtaLabel,
  proposalItems,
  CHAT_PROPOSAL_CARD_COPY,
} from "./chatProposalCardCopy";
import {
  proposalCardBodySx,
  proposalCardSx,
  proposalCardTitleSx,
  proposalItemListSx,
  proposalItemSx,
} from "./ChatProposalCard.styled";

/**
 * Card de proposta do assistente com CTA de revisão explícita.
 *
 * @param {Object} props
 * @param {object} props.payload
 * @param {boolean} [props.busy]
 * @param {() => void} [props.onCta]
 */
export default function ChatProposalCard({ payload, busy = false, onCta }) {
  if (!isProposalPayload(payload)) return null;

  const items = proposalItems(payload);
  const ctaLabel = proposalCtaLabel(payload);
  const body = proposalCardBody(payload);

  return (
    <Box sx={proposalCardSx}>
      <Typography variant="subtitle2" sx={proposalCardTitleSx}>
        {proposalCardTitle(payload)}
      </Typography>
      {body ? (
        <Typography variant="body2" sx={proposalCardBodySx}>
          {body}
        </Typography>
      ) : null}
      {items.length > 0 ? (
        <Box component="ul" sx={proposalItemListSx}>
          {items.map((item, index) => (
            <Box component="li" key={`${item.name}-${index}`} sx={proposalItemSx}>
              {CHAT_PROPOSAL_CARD_COPY.itemLine(item)}
            </Box>
          ))}
        </Box>
      ) : null}
      <LoadingButton
        type="button"
        variant="contained"
        size="small"
        loading={busy}
        disabled={!onCta}
        onClick={onCta}
        sx={{ textTransform: "none" }}
      >
        {ctaLabel}
      </LoadingButton>
    </Box>
  );
}

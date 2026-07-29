import assert from "node:assert/strict";
import {
  CHAT_PROPOSAL_CARD_COPY,
  isIntakeProposalPayload,
  isProposalPayload,
  proposalCardTitle,
  proposalCtaLabel,
  resolveProposalNavigatePath,
} from "../src/components/chat/ChatProposalCard/chatProposalCardCopy.js";

{
  const payload = {
    type: "intake_draft",
    tool: "propose_intake",
    intakeId: "abc-123",
    path: "/entrada/abc-123/preview",
    cta: "review_intake",
    requiresReview: true,
    itemCount: 2,
    items: [
      { name: "Arroz", quantity: 2, unit: "kg" },
      { name: "Leite", quantity: 1, unit: "l" },
    ],
  };

  assert.equal(isIntakeProposalPayload(payload), true);
  assert.equal(isProposalPayload(payload), true);
  assert.equal(proposalCardTitle(payload), "Proposta de entrada");
  assert.equal(proposalCtaLabel(payload), "Revisar entrada");
  assert.equal(proposalCtaLabel(payload), CHAT_PROPOSAL_CARD_COPY.ctaIntake);
  assert.equal(
    resolveProposalNavigatePath(payload),
    "/entrada/abc-123/preview",
  );
}

// tool propose_intake sem type explícito ainda abre o card
{
  const payload = {
    tool: "propose_intake",
    intakeId: "xyz",
    cta: "review_intake",
  };
  assert.equal(isProposalPayload(payload), true);
  assert.equal(proposalCtaLabel(payload), "Revisar entrada");
  assert.equal(resolveProposalNavigatePath(payload), "/entrada/xyz/preview");
}

// não confirma estoque: path é preview, não confirm
{
  const path = resolveProposalNavigatePath({
    type: "intake_draft",
    intakeId: "id-1",
  });
  assert.match(path, /\/entrada\/id-1\/preview$/);
  assert.doesNotMatch(path, /confirm/);
}

// baixa e lista continuam ok
{
  assert.equal(
    resolveProposalNavigatePath({
      type: "stock_out_draft",
      stockOutId: "s1",
      path: "/baixa/s1/preview",
    }),
    "/baixa/s1/preview",
  );
  assert.equal(
    resolveProposalNavigatePath({ type: "shopping_list_proposal" }, {
      shoppingList: "/lista-compras",
    }),
    "/lista-compras",
  );
}

console.log("chatProposalCardCopy.test.mjs: ok");

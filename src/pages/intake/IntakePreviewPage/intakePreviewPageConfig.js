import { INTAKE_PREVIEW_PAGE_COPY } from "./intakePreviewPageCopy";

export const INTAKE_PREVIEW_PAGE_CONFIG = {
  defaultCategory: "other",
  defaultUnit: "un",
  confidenceHighThreshold: 0.75,
  confidenceMediumThreshold: 0.6,
  draftStatus: "draft",
  confirmedStatus: "confirmed",
  paths: {
    entrada: "/entrada",
    produtos: "/produtos",
  },
};

export function confidenceLabel(confidence) {
  if (confidence == null) return null;
  if (confidence >= INTAKE_PREVIEW_PAGE_CONFIG.confidenceHighThreshold) {
    return { label: INTAKE_PREVIEW_PAGE_COPY.confidenceHigh, color: "success" };
  }
  if (confidence >= INTAKE_PREVIEW_PAGE_CONFIG.confidenceMediumThreshold) {
    return { label: INTAKE_PREVIEW_PAGE_COPY.confidenceMedium, color: "warning" };
  }
  return { label: INTAKE_PREVIEW_PAGE_COPY.confidenceLow, color: "error" };
}

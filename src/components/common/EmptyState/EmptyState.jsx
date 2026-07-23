import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EMPTY_STATE_CONFIG } from "./emptyStateConfig";
import {
  actionSx,
  descriptionSx,
  iconSx,
  iconWrapSx,
  imageSx,
  rootSx,
  titleSx,
} from "./EmptyState.styled";

/**
 * Empty state reutilizável (imagem/ícone + título + descrição).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import('react').ElementType} [props.icon] Ícone MUI usado como visual padrão
 * @param {string} [props.imageSrc] URL/path de imagem (tem prioridade sobre `icon`)
 * @param {string} [props.imageAlt]
 * @param {import('react').ReactNode} [props.image] Visual customizado (tem prioridade sobre `imageSrc` e `icon`)
 * @param {"md"|"sm"} [props.size]
 * @param {import('react').ReactNode} [props.action] CTA opcional abaixo da descrição
 * @param {import('@mui/material').SxProps} [props.sx]
 */
export default function EmptyState({
  title,
  description,
  icon: Icon,
  imageSrc,
  imageAlt = "",
  image,
  size = EMPTY_STATE_CONFIG.defaultSize,
  action,
  sx,
}) {
  const sizeTokens =
    EMPTY_STATE_CONFIG.sizes[size] || EMPTY_STATE_CONFIG.sizes.md;

  let visual = null;
  if (image) {
    visual = image;
  } else if (imageSrc) {
    visual = (
      <Box
        component="img"
        src={imageSrc}
        alt={imageAlt}
        sx={imageSx(sizeTokens)}
      />
    );
  } else if (Icon) {
    visual = (
      <Box sx={iconWrapSx(sizeTokens)} aria-hidden>
        <Icon sx={iconSx(sizeTokens)} />
      </Box>
    );
  }

  return (
    <Box sx={[rootSx(sizeTokens), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {visual}
      <Typography variant={sizeTokens.titleVariant} sx={titleSx}>
        {title}
      </Typography>
      {description ? (
        <Typography variant={sizeTokens.descriptionVariant} sx={descriptionSx}>
          {description}
        </Typography>
      ) : null}
      {action ? <Box sx={actionSx}>{action}</Box> : null}
    </Box>
  );
}

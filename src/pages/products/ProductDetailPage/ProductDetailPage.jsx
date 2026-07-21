import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { productService } from "../../../services/productService";
import StockStatusChip from "../../../components/products/StockStatusChip/StockStatusChip";
import ConsumeProductDialog from "../../../components/products/ConsumeProductDialog/ConsumeProductDialog";
import { categoryLabel } from "../../../utils/categoryLabels";
import { formatQuantity } from "../../../utils/unitLabels";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import {
  pageLoadingBoxSx,
  pageToolbarRowSx,
  pageBackHeaderSx,
  pageHeaderSubtitleSx,
} from "../../../styles/pageStyles";
import { PRODUCT_DETAIL_COPY } from "./productDetailCopy";
import { PRODUCT_DETAIL_CONFIG } from "./productDetailConfig";
import {
  pageStackSpacing,
  actionsRowSx,
  actionsRowSpacing,
  quantityTitleSx,
  notesSx,
  historyTitleSx,
  movementItemSx,
} from "./ProductDetailPage.styled";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useAppSnackbar();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consumeOpen, setConsumeOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await productService.get(id);
      setProduct(data.product);
    } catch (err) {
      error(err instanceof ApiError ? err.message : PRODUCT_DETAIL_COPY.loadError);
      navigate(PRODUCT_DETAIL_CONFIG.paths.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConsume = async ({ quantity, note }) => {
    try {
      await productService.consume(id, { quantity: Number(quantity), note });
      success(PRODUCT_DETAIL_COPY.consumeSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : PRODUCT_DETAIL_COPY.consumeError);
      throw err;
    }
  };

  const handleMarkOut = async () => {
    try {
      await productService.markOut(id);
      success(PRODUCT_DETAIL_COPY.markOutSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : PRODUCT_DETAIL_COPY.markOutError);
    }
  };

  if (loading || !product) {
    return (
      <Box sx={pageLoadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  const { movementTypes, locale } = PRODUCT_DETAIL_CONFIG;

  return (
    <Stack spacing={pageStackSpacing}>
      <Stack direction="row" alignItems="center" spacing={1} sx={pageToolbarRowSx}>
        <IconButton onClick={() => navigate(PRODUCT_DETAIL_CONFIG.paths.list)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={pageBackHeaderSx}>
          {product.name}
        </Typography>
        <StockStatusChip status={product.stockStatus} />
      </Stack>

      <Box>
        <Typography variant="h3" sx={quantityTitleSx}>
          {formatQuantity(product.quantity, product.unit)}
        </Typography>
        <Typography sx={pageHeaderSubtitleSx}>
          {categoryLabel(product.category)} · {PRODUCT_DETAIL_COPY.minPrefix}{" "}
          {formatQuantity(product.minQuantity, product.unit)}
        </Typography>
        {product.notes && (
          <Typography sx={{ ...notesSx, ...pageHeaderSubtitleSx }}>{product.notes}</Typography>
        )}
      </Box>

      <Stack direction={actionsRowSx.direction} spacing={actionsRowSpacing}>
        <Button
          variant="contained"
          disabled={Number(product.quantity) <= 0}
          onClick={() => setConsumeOpen(true)}
        >
          {PRODUCT_DETAIL_COPY.consumeAction}
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={Number(product.quantity) <= 0}
          onClick={handleMarkOut}
        >
          {PRODUCT_DETAIL_COPY.markOutAction}
        </Button>
      </Stack>

      <Divider />

      <Box>
        <Typography variant="h6" sx={historyTitleSx}>
          {PRODUCT_DETAIL_COPY.historyTitle}
        </Typography>
        {(product.movements || []).length === 0 ? (
          <Typography color="text.secondary">{PRODUCT_DETAIL_COPY.historyEmpty}</Typography>
        ) : (
          <List disablePadding>
            {product.movements.map((m) => {
              const sign =
                m.type === movementTypes.in
                  ? PRODUCT_DETAIL_COPY.movementIn
                  : m.type === movementTypes.out
                    ? PRODUCT_DETAIL_COPY.movementOut
                    : PRODUCT_DETAIL_COPY.movementAdjust;
              return (
                <ListItem key={m.id} divider sx={movementItemSx}>
                  <ListItemText
                    primary={`${sign}${formatQuantity(m.quantity, m.unit)}`}
                    secondary={`${m.note || m.type} · ${new Date(m.createdAt).toLocaleString(locale)}`}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      <ConsumeProductDialog
        open={consumeOpen}
        onClose={() => setConsumeOpen(false)}
        product={product}
        onConfirm={handleConsume}
      />
    </Stack>
  );
}

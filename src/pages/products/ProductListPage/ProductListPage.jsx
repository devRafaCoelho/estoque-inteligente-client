import { useEffect, useMemo, useState } from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import { listProducts } from "../../../services/productService";
import ProductCard from "../../../components/products/ProductCard/ProductCard";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { pageLoadingCompactSx } from "../../../styles/pageStyles";
import { PRODUCT_LIST_COPY } from "./productListCopy";
import { PRODUCT_LIST_CONFIG } from "./productListConfig";
import {
  filterGroupSx,
  pageStackSpacing,
  productListSpacing,
} from "./ProductListPage.styled";

export default function ProductListPage() {
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, PRODUCT_LIST_CONFIG.searchDebounceMs);

  useEffect(() => {
    let ativo = true;
    (async () => {
      setLoading(true);
      try {
        const data = await listProducts({
          search: debouncedSearch || undefined,
          status: status || undefined,
        });
        if (ativo) setProducts(data.products || []);
      } catch (err) {
        error(err instanceof ApiError ? err.message : PRODUCT_LIST_COPY.listError);
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [debouncedSearch, status, error]);

  const isFiltered = Boolean(search || status);
  const emptyContent = useMemo(
    () =>
      isFiltered
        ? {
            icon: SearchOffOutlinedIcon,
            title: PRODUCT_LIST_COPY.emptyFilteredTitle,
            description: PRODUCT_LIST_COPY.emptyFilteredDescription,
          }
        : {
            icon: Inventory2OutlinedIcon,
            title: PRODUCT_LIST_COPY.emptyDefaultTitle,
            description: PRODUCT_LIST_COPY.emptyDefaultDescription,
          },
    [isFiltered],
  );

  return (
    <Stack spacing={pageStackSpacing}>
      <Typography variant="h5">{PRODUCT_LIST_COPY.title}</Typography>
      <TextField
        placeholder={PRODUCT_LIST_COPY.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={status}
        onChange={(_e, value) => setStatus(value || "")}
        sx={filterGroupSx}
      >
        {PRODUCT_LIST_CONFIG.statusFilters.map((filter) => (
          <ToggleButton key={filter.value || "all"} value={filter.value}>
            {PRODUCT_LIST_COPY[filter.labelKey]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {loading ? (
        <Box sx={pageLoadingCompactSx}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <EmptyState
          icon={emptyContent.icon}
          title={emptyContent.title}
          description={emptyContent.description}
        />
      ) : (
        <Stack spacing={productListSpacing}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

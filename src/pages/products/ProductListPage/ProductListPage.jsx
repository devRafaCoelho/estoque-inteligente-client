import { useEffect, useMemo, useState } from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import SearchTextField from "../../../components/form/SearchTextField/SearchTextField";
import ProductCard from "../../../components/products/ProductCard/ProductCard";
import { CATEGORY_LABELS } from "../../../config/constants";
import { useAppSnackbar } from "../../../hooks/useAppSnackbar";
import { ApiError } from "../../../services/apiClient";
import { listProducts } from "../../../services/productService";
import { pageLoadingCompactSx } from "../../../styles/pageStyles";
import { PRODUCT_LIST_CONFIG } from "./productListConfig";
import { PRODUCT_LIST_COPY } from "./productListCopy";
import {
  categoryFieldSx,
  pageStackSpacing,
  productListSpacing,
  searchFieldSx,
  searchRowSx,
  statusChipsSx,
} from "./ProductListPage.styled";

const CATEGORY_ALL_VALUE = "all";

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function ProductListPage() {
  const { error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState(CATEGORY_ALL_VALUE);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setLoading(true);
      try {
        const data = await listProducts({
          status: status || undefined,
          category: category === CATEGORY_ALL_VALUE ? undefined : category,
        });
        if (ativo) setProducts(data.products || []);
      } catch (err) {
        if (ativo) {
          error(err instanceof ApiError ? err.message : PRODUCT_LIST_COPY.listError);
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [status, category, error]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      String(product.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [products, search]);

  const isFiltered = Boolean(
    search.trim() || status || category !== CATEGORY_ALL_VALUE,
  );
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

      <Box sx={searchRowSx}>
        <SearchTextField
          placeholder={PRODUCT_LIST_COPY.searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={searchFieldSx}
        />
        <TextField
          select
          label={PRODUCT_LIST_COPY.categoryLabel}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          sx={categoryFieldSx}
        >
          <MenuItem value={CATEGORY_ALL_VALUE}>{PRODUCT_LIST_COPY.categoryAll}</MenuItem>
          {CATEGORY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={statusChipsSx} role="group" aria-label={PRODUCT_LIST_COPY.title}>
        {PRODUCT_LIST_CONFIG.statusFilters.map((filter) => {
          const selected = status === filter.value;
          return (
            <Chip
              key={filter.value || "all"}
              label={PRODUCT_LIST_COPY[filter.labelKey]}
              clickable
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              onClick={() => setStatus(filter.value)}
            />
          );
        })}
      </Box>

      {loading ? (
        <Box sx={pageLoadingCompactSx}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={emptyContent.icon}
          title={emptyContent.title}
          description={emptyContent.description}
        />
      ) : (
        <Stack spacing={productListSpacing}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

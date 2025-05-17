// src/pages/ShopPage.jsx

import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
  Typography,
  Fade,
  Drawer,
  IconButton,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { fetchProducts } from "../store/productSlice";
import { ProductGrid, FilterSidebar, Loader } from "../Components";

const ITEMS_PER_PAGE = 16;

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { products, isLoading, error, pagination } = useSelector(
    (state) => state.product
  );

  // UI state
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountFilters, setDiscountFilters] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [page, setPage] = useState(1);

  // Build a plain-object of current filters/sort/page
  const filters = useMemo(
    () => ({
      categories: selectedCategories.join(","),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      inStockOnly,
      discount: discountFilters.join(","),
      countries: selectedCountries.join(","),
      search: searchQuery,
      sortBy,
      page,
      limit: ITEMS_PER_PAGE,
    }),
    [
      selectedCategories,
      priceRange,
      inStockOnly,
      discountFilters,
      selectedCountries,
      searchQuery,
      sortBy,
      page,
    ]
  );

  // Debounced fetch
  const debouncedFetch = useCallback(
    debounce((params) => dispatch(fetchProducts(params)), 300),
    [dispatch]
  );

  // Trigger fetch on any filters/sort/page change
  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  // Handlers just update UI state
  const handleCategoryChange = (cat, checked) =>
    setSelectedCategories((prev) =>
      checked ? [...prev, cat] : prev.filter((c) => c !== cat)
    );
  const handlePriceRangeChange = (range) => setPriceRange(range);
  const handleSearchChange = (v) => setSearchQuery(v);
  const handleInStockChange = (v) => setInStockOnly(v);
  const handleDiscountChange = (val, checked) =>
    setDiscountFilters((prev) =>
      checked ? [...prev, val] : prev.filter((d) => d !== val)
    );
  const handleCountryChange = (c, checked) =>
    setSelectedCountries((prev) =>
      checked ? [...prev, c] : prev.filter((x) => x !== c)
    );
  const clearAll = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
    setInStockOnly(false);
    setDiscountFilters([]);
    setSelectedCountries([]);
    setPage(1);
  };
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };
  const handlePageChange = (_, v) => setPage(v);
  const toggleFilterPane = () => setShowFilters((s) => !s);

  // Sidebar
  const FilterPane = (
    <Paper sx={{ p: 2, width: isMobile ? "85vw" : 300 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton size="small" onClick={toggleFilterPane}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <FilterSidebar
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchChange}
        inStockOnly={inStockOnly}
        onInStockOnlyChange={handleInStockChange}
        discountFilters={discountFilters}
        onDiscountChange={handleDiscountChange}
        selectedCountries={selectedCountries}
        onCountryChange={handleCountryChange}
        onClearAllFilters={clearAll}
      />
    </Paper>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: theme.palette.background.default, mt: 22, pb: 6 }}>
      <Container maxWidth="lg">
        {isMobile && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<FilterListIcon />}
            onClick={toggleFilterPane}
            sx={{ mb: 2 }}
          >
            Filters
          </Button>
        )}

        <Box display="flex" gap={3}>
          {isMobile ? (
            <Drawer open={showFilters} onClose={toggleFilterPane}>
              {FilterPane}
            </Drawer>
          ) : (
            <Fade in>
              {FilterPane}
            </Fade>
          )}

          <Box flex={1}>
            {/* Sort + Summary */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="body2" color="text.secondary">
                Showing {products.length} of {pagination.total} products
              </Typography>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                  <MenuItem value="featured:desc">Featured</MenuItem>
                  <MenuItem value="createdAt:desc">Newest</MenuItem>
                  <MenuItem value="price:asc">Price: Low to High</MenuItem>
                  <MenuItem value="price:desc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Product Grid */}
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <>
                <ProductGrid products={products} columns={3} />
                {pagination.pages > 1 && (
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                      count={pagination.pages}
                      page={page}
                      onChange={handlePageChange}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default memo(ShopPage);

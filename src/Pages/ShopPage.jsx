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
  Chip,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import SortIcon from "@mui/icons-material/Sort";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { fetchProducts } from "../store/productSlice";
import { ProductGrid, FilterSidebar, Loader } from "../Components";

const ITEMS_PER_PAGE = 16;

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
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
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list view

  // Build a plain-object of current filters/sort/page (remove category and discount filter for backend)
  const filters = useMemo(() => {
    const f = { sortBy, limit: ITEMS_PER_PAGE, page };
    if (priceRange[0] > 0) f.minPrice = priceRange[0];
    if (priceRange[1] < 10000) f.maxPrice = priceRange[1];
    if (inStockOnly) f.inStockOnly = true;
    if (searchQuery) f.search = searchQuery;
    return f;
  }, [priceRange, inStockOnly, searchQuery, sortBy, page]);

  // Filter products by selectedCategories and discount on the frontend
  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategories.length) {
      result = result.filter(p => selectedCategories.includes(p.category?.name));
    }
    if (discountFilters.length) {
      result = result.filter(p => {
        // Assume product.percentage_Discount is the discount percent
        return discountFilters.some(d => (p.percentage_Discount || 0) >= d);
      });
    }
    return result;
  }, [products, selectedCategories, discountFilters]);


  // Calculate active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length) count++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
    if (inStockOnly) count++;
    if (discountFilters.length) count++;
    return count;
  }, [selectedCategories, priceRange, searchQuery, inStockOnly, discountFilters]);

  // Debounced fetch
  const debouncedFetch = useCallback(
    debounce((params) => dispatch(fetchProducts(params)), 300),
    [dispatch]
  );

  // Trigger fetch on any filters/sort/page change
  useEffect(() => {
    debouncedFetch(filters);
    console.log('Incoming Filters:', filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  const handlePriceRangeChange = (range) => setPriceRange(range);
  const handleSearchChange = (v) => setSearchQuery(v);
  const handleInStockChange = (v) => setInStockOnly(v);

  const handleSortChange = (e) => {
    setPage(1);
  };
  const handlePageChange = (_, v) => setPage(v);
  const toggleFilterPane = () => setShowFilters((s) => !s);
  const toggleViewMode = () => setViewMode(prev => prev === "grid" ? "list" : "grid");

  const handleCategoryChange = (category, checked) => {
  setSelectedCategories(prev =>
    checked ? [...prev, category] : prev.filter(c => c !== category)
  );
};

const handleDiscountChange = (discount, checked) => {
  setDiscountFilters(prev =>
    checked ? [...prev, discount] : prev.filter(d => d !== discount)
  );
};


console.log('Sort:', sortBy);
const handleClearAll = () => {
  setSearchQuery('');
  setSelectedCategories([]);
  setPriceRange([0, 10000]);
  setInStockOnly(false);
  setDiscountFilters([]);
};

  // Active filter chips
  // const renderActiveFilters = () => {
  //   if (!activeFilterCount) return null;
    
  //   return (
  //       variant="outlined"
  //       sx={{
  //         p: 1.5,
  //         mb: 2,
  //         display: "flex",
  //         flexWrap: "wrap",
  //         gap: 1,
  //         alignItems: "center",
  //         borderRadius: 2,
  //         borderColor: theme.palette.divider,
  //       }}
  //     >
  //       {/* <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
  //         Active filters:
  //       </Typography> */}
        
  //       <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
  //         {/* {selectedCategories.map(cat => (
  //           <Chip 
  //             key={`cat-${cat}`}
  //             label={`Category: ${cat}`}
  //             size="small"
  //             onDelete={() => handleCategoryChange(cat, false)}
  //           />
  //         ))} */}
          
  //         {(priceRange[0] > 0 || priceRange[1] < 10000) && (
  //           <Chip 
  //             label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
  //             size="small"
  //             onDelete={() => setPriceRange([0, 10000])}
  //           />
  //         )}
          
  //         {searchQuery && (
  //           <Chip 
  //             label={`Search: ${searchQuery}`}
  //             size="small"
  //             onDelete={() => setSearchQuery("")}
  //           />
  //         )}
          
  //         {inStockOnly && (
  //           <Chip 
  //             label="In stock only"
  //             size="small"
  //             onDelete={() => setInStockOnly(false)}
  //           />
  //         )}
          
  //         {discountFilters.map(disc => (
  //           <Chip 
  //             key={`disc-${disc}`}
  //             label={`Discount: ${disc}`}
  //             size="small"
  //             onDelete={() => handleDiscountChange(disc, false)}
  //           />
  //         ))}
          
  //         {selectedCountries.map(country => (
  //           <Chip 
  //             key={`country-${country}`}
  //             label={`Origin: ${country}`}
  //             size="small"
  //             onDelete={() => handleCountryChange(country, false)}
  //           />
  //         ))}
          
  //         <Chip 
  //           label="Clear all"
  //           color="primary"
  //           variant="outlined"
  //           size="small"
  //           onClick={clearAll}
  //         />
  //       </Stack>
  //     </Paper>
  //   );
  // };

  // Sidebar
  const FilterPane = (
    <Paper 
      elevation={isMobile ? 0 : 3}
      sx={{ 
        p: 3, 
        width: isMobile ? "85vw" : 300,
        height: isMobile ? "auto" : "calc(100vh - 120px)",
        overflow: "auto",
        position: isMobile ? "static" : "sticky",
        top: isMobile ? "auto" : 100,
        borderRadius: 2
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          <TuneIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: "1.2em" }} />
          Filters
        </Typography>
        {isMobile && (
          <IconButton size="small" onClick={toggleFilterPane} sx={{ color: theme.palette.grey[700] }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <FilterSidebar
  searchQuery={searchQuery}
  onSearchQueryChange={setSearchQuery}
  selectedCategories={selectedCategories}
  onCategoryChange={handleCategoryChange}
  priceRange={priceRange}
  onPriceRangeChange={setPriceRange}
  inStockOnly={inStockOnly}
  onInStockOnlyChange={setInStockOnly}
  discountFilters={discountFilters}
  onDiscountChange={handleDiscountChange}
  onClearAllFilters={handleClearAll}
/>

    </Paper>
  );

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return showFilters ? 3 : 4;
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        background: theme.palette.grey[50],
        pt: { xs: 2, md: 4 },
        pb: 6,
        mt: 15
      }}
    >
      <Container maxWidth="xl">
        {/* Mobile/Tablet Toolbar */}
        <Box 
          sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 2,
            flexWrap: "wrap"
          }}
        >
          {isMobile && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={toggleFilterPane}
              sx={{ 
                flex: 1,
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          )}

          <FormControl 
            size="small" 
            sx={{ width: 200 /* px by default */ }}
            // sx={{ 
            //   minWidth: 160,
            //   flex: isMobile ? 1 : "auto"
            // }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select 
              value={sortBy} 
              onChange={handleSortChange} 
              label="Sort By"
              startAdornment={<SortIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="featured:desc">Featured</MenuItem>
              <MenuItem value="createdAt:desc">Newest</MenuItem>
              <MenuItem value="price:asc">Price: Low to High</MenuItem>
              <MenuItem value="price:desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>

          {/* <Button
            variant="outlined"
            color="inherit"
            onClick={toggleViewMode}
            startIcon={viewMode === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              borderRadius: 2
            }}
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button> */}
        </Box>

        <Box display="flex" gap={3}>
          {/* Filter Sidebar */}
          {isMobile ? (
            <Drawer 
              open={showFilters} 
              onClose={toggleFilterPane}
              PaperProps={{
                sx: {
                  borderRadius: "0 16px 16px 0"
                }
              }}
            >
              {FilterPane}
            </Drawer>
          ) : (
            <Fade in>
              {FilterPane}
            </Fade>
          )}

          {/* Main Content */}
          <Box flex={1}>
            {/* Active Filter Chips */}
            {/* {renderActiveFilters()} */}

            {/* Results Summary */}
            <Box 
              sx={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Showing {products.length} of {pagination.total} products
              </Typography>
              
              <Box display={{ xs: 'none', md: 'block' }}>
                <Typography variant="body2" color="text.secondary">
                  Page {page} of {pagination.pages || 1}
                </Typography>
              </Box>
            </Box>

            {/* Product Grid */}
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <Loader />
              </Box>
            ) : error ? (
              <Alert 
                severity="error"
                sx={{ borderRadius: 2, mt: 2 }}
              >
                {error}
              </Alert>
            ) : (
              <>
                <ProductGrid 
                  products={filteredProducts} 
                  columns={getGridColumns()}
                  viewMode={viewMode}
                />
                
                {pagination.pages > 1 && (
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    mt={4}
                    p={2}
                    bgcolor={theme.palette.background.paper}
                    borderRadius={2}
                  >
                    <Pagination
                      count={pagination.pages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      siblingCount={isMobile ? 0 : 1}
                      showFirstButton={!isMobile}
                      showLastButton={!isMobile}
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
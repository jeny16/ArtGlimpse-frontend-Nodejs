// FilterSidebar.js (Updated with working handlers)
import React, { useState, useMemo, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  TextField,
  Box,
  styled,
  useTheme,
  IconButton,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';

const FilterAccordion = styled(Accordion)(({ theme }) => ({
  overflow: 'visible',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:before': { display: 'none' },
  borderRadius: '8px !important',
  marginBottom: theme.spacing(1.5),
}));
const FilterAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  minHeight: 48,
  '&.Mui-expanded': { minHeight: 48, borderBottom: `1px solid ${theme.palette.divider}` },
}));
const FilterAccordionDetails = styled(AccordionDetails)(() => ({ overflow: 'visible' }));
const valueText = (v) => `₹${v.toLocaleString()}`;

const FilterSidebar = ({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  searchQuery,
  onSearchQueryChange,
  inStockOnly,
  onInStockOnlyChange,
  discountFilters,
  onDiscountChange,
  onClearAllFilters
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  // Use a static list of categories for frontend-only filtering
  const [allCategories] = useState([
    'Jewelry & Accessories',
    'Pooja Essentials',
    'Home Decor',
    'Kitchen & Dining',
    'Bags & Wallets',
    'Toys & Collectibles',
    'Garden Decor',
    'Clothing & Apparel'
  ]);

  const handleAccordionChange = (panel) => (e, isExp) => setExpanded(isExp ? panel : false);
  const handlePriceChange = (e, val) => onPriceRangeChange(val);
  const discountOptions = useMemo(() => [10, 12, 15, 20, 25], []);

  const totalActive = useMemo(() => {
    let c = 0;
    if (selectedCategories.length) c++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) c++;
    if (inStockOnly) c++;
    if (discountFilters.length) c++;
    if (searchQuery) c++;
    return c;
  }, [selectedCategories, priceRange, inStockOnly, discountFilters, searchQuery]);

  return (
    <Stack spacing={2}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        {totalActive > 0 && (
          <Button size="small" onClick={onClearAllFilters} sx={{ textTransform:'none', color: theme.palette.secondary.main }}>
            Clear All
          </Button>
        )}
      </Box>

      <TextField
        size="small"
        fullWidth
        placeholder="Search Products"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr:1 }} />,
          endAdornment: searchQuery && (
            <IconButton size="small" onClick={() => onSearchQueryChange('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )
        }}
      />

      <Box sx={{ border:`1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, p:2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStockOnly}
              onChange={(e) => onInStockOnlyChange(e.target.checked)}
              sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
            />
          }
          label="In Stock Only"
        />
      </Box>

      <FilterAccordion expanded={expanded==='categories'} onChange={handleAccordionChange('categories')}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Categories {selectedCategories.length ? `(${selectedCategories.length})` : ''}
          </Typography>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          {allCategories.map((cat) => (
            <FormControlLabel
              key={cat}
              control={
                <Checkbox
                  size="small"
                  checked={selectedCategories.includes(cat)}
                  onChange={(e) => onCategoryChange(cat, e.target.checked)}
                  sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                />
              }
              label={cat}
            />
          ))}
        </FilterAccordionDetails>
      </FilterAccordion>

      <FilterAccordion expanded={expanded==='priceRange'} onChange={handleAccordionChange('priceRange')}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Price Range {priceRange[0] > 0 || priceRange[1] < 10000 ? `(${valueText(priceRange[0])} - ${valueText(priceRange[1])})` : ''}
          </Typography>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>{valueText(priceRange[0])}</Typography>
            <Typography>{valueText(priceRange[1])}</Typography>
          </Box>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            min={0}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={valueText}
          />
        </FilterAccordionDetails>
      </FilterAccordion>

      <FilterAccordion expanded={expanded==='discount'} onChange={handleAccordionChange('discount')}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Discount {discountFilters.length ? `(${discountFilters.length})` : ''}
          </Typography>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          {discountOptions.map((d) => (
            <FormControlLabel
              key={d}
              control={
                <Checkbox
                  size="small"
                  checked={discountFilters.includes(d)}
                  onChange={(e) => onDiscountChange(d, e.target.checked)}
                  sx={{ '&.Mui-checked': { color: theme.palette.primary.main } }}
                />
              }
              label={`${d}% or more`}
            />
          ))}
        </FilterAccordionDetails>
      </FilterAccordion>

  {/* Countries filter removed */}
    </Stack>
  );
};

export default FilterSidebar;

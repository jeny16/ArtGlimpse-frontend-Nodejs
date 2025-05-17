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
  Chip,
  Button,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';

// ============================================================================
//  Styled Components (as before) …
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
// … (other styled pieces omitted for brevity) …
const valueText = (v) => `₹${v.toLocaleString()}`;
// ============================================================================

const FilterSidebar = ({
  selectedCategories = [],
  onCategoryChange = () => {},
  priceRange = [0, 10000],
  onPriceRangeChange = () => {},
  searchQuery = '',
  onSearchQueryChange = () => {},
  inStockOnly = false,
  onInStockOnlyChange = () => {},
  discountFilters = [],
  onDiscountChange = () => {},
  countries = [],
  selectedCountries = [],
  onCountryChange = () => {},
  onClearAllFilters = () => {}
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => {
        console.log("categories fetch status:", res.status);
        return res.json();
      })
      .then(cats => {
        console.log("categories payload:", cats);
        setAllCategories(cats.map(c => c.name));
      })
      .catch(err => {
        console.error("categories fetch failed:", err);
      });
  }, []);
  

  const handleAccordionChange = (panel) => (e, isExp) => {
    setExpanded(isExp ? panel : false);
  };
  const handlePriceChange = (e, val) => onPriceRangeChange(val);
  const discountOptions = useMemo(() => [10, 12, 15, 20, 25], []);

  // count how many filters are active
  const totalActive = useMemo(() => {
    let c = 0;
    if (selectedCategories.length) c++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) c++;
    if (inStockOnly) c++;
    if (discountFilters.length) c++;
    if (selectedCountries.length) c++;
    if (searchQuery) c++;
    return c;
  }, [selectedCategories, priceRange, inStockOnly, discountFilters, selectedCountries, searchQuery]);

  return (
    <Stack spacing={2}>
      {/* Header */}
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Box sx={{ display:'flex', alignItems:'center' }}>
          <TuneIcon sx={{ mr:1, color: theme.palette.text.secondary }} />
          <Typography variant="subtitle1" fontWeight={600}>Filters</Typography>
        </Box>
        {totalActive > 0 && (
          <Button size="small" onClick={onClearAllFilters} sx={{ textTransform:'none', color: theme.palette.custom?.highlight }}>
            Clear All
          </Button>
        )}
      </Box>

      {/* Search */}
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

      {/* In Stock */}
      <Box sx={{ border:`1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, p:2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStockOnly}
              onChange={(e) => onInStockOnlyChange(e.target.checked)}
              sx={{ '&.Mui-checked': { color: theme.palette.custom?.highlight || theme.palette.primary.main } }}
            />
          }
          label="In Stock Only"
        />
      </Box>

      {/* Active Filter Chips */}
      {totalActive > 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary">Applied Filters:</Typography>
          <Box sx={{ display:'flex', flexWrap:'wrap', mt:1 }}>
            {inStockOnly && <Chip label="In Stock" size="small" onDelete={() => onInStockOnlyChange(false)} />}
            {priceRange[0] > 0 && <Chip label={`Min ${valueText(priceRange[0])}`} size="small" onDelete={() => onPriceRangeChange([0, priceRange[1]])} />}
            {priceRange[1] < 10000 && <Chip label={`Max ${valueText(priceRange[1])}`} size="small" onDelete={() => onPriceRangeChange([priceRange[0],10000])} />}
            {searchQuery && <Chip label={`"${searchQuery}"`} size="small" onDelete={() => onSearchQueryChange('')} />}
            {discountFilters.map((d) => (
              <Chip key={d} label={`${d}%+ Off`} size="small" onDelete={() => onDiscountChange(d, false)} />
            ))}
          </Box>
        </Box>
      )}

      {/* Categories Accordion (from fetched data) */}
      <FilterAccordion expanded={expanded==='categories'} onChange={handleAccordionChange('categories')}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Categories {selectedCategories.length ? `(${selectedCategories.length})` : ''}
          </Typography>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          {allCategories.map((cat) => {
            const isSel = selectedCategories.includes(cat);
            return (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    size="small"
                    checked={isSel}
                    onChange={(e) => onCategoryChange(cat, e.target.checked)}
                    sx={{ '&.Mui-checked': { color: theme.palette.custom?.highlight || theme.palette.primary.main } }}
                  />
                }
                label={cat}
              />
            );
          })}
        </FilterAccordionDetails>
      </FilterAccordion>

      {/* Price Range Accordion */}
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

      {/* Discount Accordion */}
      <FilterAccordion expanded={expanded==='discount'} onChange={handleAccordionChange('discount')}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Discount {discountFilters.length ? `(${discountFilters.length})` : ''}
          </Typography>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          {discountOptions.map((d) => {
            const isSel = discountFilters.includes(d);
            return (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    size="small"
                    checked={isSel}
                    onChange={(e) => onDiscountChange(d, e.target.checked)}
                    sx={{ '&.Mui-checked': { color: theme.palette.custom?.highlight || theme.palette.primary.main } }}
                  />
                }
                label={`${d}% or more`}
              />
            );
          })}
        </FilterAccordionDetails>
      </FilterAccordion>

      {/* Countries Accordion */}
      <FilterAccordion expanded={expanded==='countries'} onChange={handleAccordionChange('countries')}>
        <FilterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Countries {selectedCountries.length ? `(${selectedCountries.length})` : ''}
          </Typography>
        </FilterAccordionSummary>
        <FilterAccordionDetails>
          {countries.map((c) => {
            const isSel = selectedCountries.includes(c);
            return (
              <FormControlLabel
                key={c}
                control={
                  <Checkbox
                    size="small"
                    checked={isSel}
                    onChange={(e) => onCountryChange(c, e.target.checked)}
                    sx={{ '&.Mui-checked': { color: theme.palette.custom?.highlight || theme.palette.primary.main } }}
                  />
                }
                label={c}
              />
            );
          })}
        </FilterAccordionDetails>
      </FilterAccordion>
    </Stack>
  );
};

export default FilterSidebar;

import React, { memo, useMemo } from 'react';
import { Box, useTheme, Fade } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  const theme = useTheme();

  // Only ever map over an array
  const safeProducts = Array.isArray(products) ? products : [];

  const productItems = useMemo(
    () =>
      safeProducts.map((product, index) => (
        <Fade in key={product._id || index} timeout={500 + index * 200}>
          <Box>
            <ProductCard product={product} />
          </Box>
        </Fade>
      )),
    [safeProducts]
  );

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        width: '100%',
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {productItems}
    </Box>
  );
};

export default memo(ProductGrid);

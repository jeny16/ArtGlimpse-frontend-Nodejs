import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { useSelector, shallowEqual } from 'react-redux';
import CartItem from './CartItem';
import { useTheme } from '@mui/material/styles';

const CartReview = () => {
  const theme = useTheme();
  const cart = useSelector((s) => s.cart.cart, shallowEqual);
  const { products } = useSelector((s) => s.product, shallowEqual);

  if (!cart?.items?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', border: `1px solid ${theme.palette.shades.light}` }}>
        <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
        <Typography variant="body2" gutterBottom>Add some items first!</Typography>
        <Button variant="contained" sx={{ mt: 2 }}>Continue Shopping</Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          My Shopping Bag ({cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'})
        </Typography>
        <Chip label="100% SECURE" color="success" />
      </Box>

      <Paper sx={{ border: `1px solid ${theme.palette.shades.light}` }}>
        <Box sx={{ p: 3 }}>
          {/* Offers bar */}
          <Box sx={{ mb: 2, borderBottom: `1px solid ${theme.palette.shades.light}`, pb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Available Offers:</Typography>
            <Typography variant="body2">10% Instant on PNB Credit Cards (₹3,000+)</Typography>
          </Box>

          {/* Cart items */}
          {cart.items.map((item) => {
  const product = typeof item.productId === 'object'
    ? item.productId
    : products.find(p => p._id === item.productId);

  return product ? (
   <CartItem
  key={item._id || (typeof item.productId === 'object' ? item.productId._id : item.productId)}
  item={{ ...item, product }}
/>

  ) : null;
})}

        </Box>
      </Paper>
    </Box>
  );
};

export default CartReview;

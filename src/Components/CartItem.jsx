// components/CartItem.jsx
import React from 'react';
import { Box, Grid, Typography, Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartQuantity } from '../store/cartSlice';
import { toast } from 'react-toastify';
import { getImageUrl } from '../actions/getImage';  // ← IMPORTED

const CartItem = ({ item }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const uid = userData?.userId || userData?._id;

  const { products } = useSelector((state) => state.product);
  const productDetail =
    products.find((prod) => prod._id === item.productId) || item.productData || {};

  const name = item.name || productDetail.name || 'Product Name';
  const price = Number(item.price || productDetail.price || 0);
  const originalPrice = Number(item.originalPrice || productDetail.originalPrice || 0);
  const discountPercent = Number(item.discountPercent || productDetail.percentage_Discount || 0);
  const images = item.images || productDetail.images || [];
  const discountedPrice = price - (price * discountPercent) / 100;
  const { quantity, size } = item;

  const handleQuantityChange = (newQty) => {
    if (newQty >= 1) {
      dispatch(updateCartQuantity({ userId: uid, productId: item.productId, quantity: newQty }));
    }
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCart({ userId: uid, productId: item.productId }));
    toast.success("Product removed from cart");
  };

  // ← wrap fallback in getImageUrl too
  const imgSrc = getImageUrl(images[0] || '/api/placeholder/120/160');

  return (
    <Box
      sx={{
        py: 2,
        borderBottom: `1px solid ${theme.palette.shades.light}`,
      }}
    >
      <Grid container spacing={2}>
        {/* Product Image */}
        <Grid item xs={3} sm={2}>
          <Box
            component="img"
            src={imgSrc}   // ← UPDATED
            alt={name}
            sx={{
              width: '100%',
              height: '160px',
              objectFit: 'cover',
              borderRadius: '4px',
              border: `1px solid ${theme.palette.shades.light}`,
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={9} sm={10}>
          <Grid container>
            {/* Left Side */}
            <Grid item xs={12} md={7}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '16px',
                  color: theme.palette.custom.highlight || '#282c3f',
                }}
              >
                {name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {size && (
                  <Box sx={{ mr: 3 }}>
                    <Typography component="span" sx={{ fontSize: '13px', color: '#666', mr: 1 }}>
                      Size:
                    </Typography>
                    <Typography component="span" sx={{ fontSize: '13px', fontWeight: 600 }}>
                      {size}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography component="span" sx={{ fontSize: '13px', color: '#666', mr: 1 }}>
                    Qty:
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    sx={{
                      p: 0.5,
                      color:
                        quantity <= 1
                          ? theme.palette.shades.medium
                          : theme.palette.custom.highlight,
                    }}
                  >
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      mx: 1,
                      fontWeight: 600,
                      fontSize: '14px',
                      width: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    sx={{
                      p: 0.5,
                      color: theme.palette.custom.highlight,
                    }}
                  >
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '13px' }}>
                Delivery by 21 Mar 2025
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px' }}>
                7 days return available
              </Typography>
            </Grid>

            {/* Right Side */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                textAlign: { xs: 'left', md: 'right' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  mb: 1,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '16px', mr: 1 }}>
                  ₹{price}
                </Typography>
                {originalPrice > price && (
                  <>
                    <Typography
                      sx={{
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '14px',
                        mr: 1,
                      }}
                    >
                      ₹{originalPrice}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#ff3f6c',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {discountPercent}% OFF
                    </Typography>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleRemoveItem}
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  sx={{
                    color: '#282c3f',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    fontWeight: 600,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: theme.palette.custom.highlight,
                    },
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartItem;

  import React from 'react';
  import {
    Box, Grid, Typography, Button, IconButton
  } from '@mui/material';
  import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
  import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
  import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
  import { useTheme } from '@mui/material/styles';
  import { useDispatch, useSelector } from 'react-redux';
  import { removeFromCart, updateCartQuantity } from '../store/cartSlice';
  import { toast } from 'react-toastify';
  import { getImageUrl } from '../actions/getImage';

  const CartItem = ({ item }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.auth);
    const uid = userData?.userId || userData?._id;

    const { products } = useSelector((state) => state.product);

    const prodId = typeof item.productId === 'object'
      ? item.productId?._id
      : item.productId;

    const debugId = prodId || 'Unknown Product ID';

    // console.groupCollapsed(`🧩 CartItem Debug: ${debugId}`);
    // console.log("🛒 item:", item);
    // console.log("📦 products from Redux:", products);

    const matchedProduct = products.find((p) => p._id?.toString() === prodId?.toString());
    // if (matchedProduct) {
    //   console.log("✅ Matched product from Redux:", matchedProduct);
    // } else {
    //   console.warn("❌ No matching product in Redux");
    // }

    const productDetail = item.productData || matchedProduct || {};
    // console.log("📌 Final productDetail used:", productDetail);
    console.groupEnd();

    const productId = prodId || productDetail._id || 'unknown-id';
    const name = item.name || productDetail.name || '';
    const basePrice = Number(item.price || productDetail.price || 0);
    const originalPrice = Number(item.originalPrice || productDetail.originalPrice || basePrice);
    const discountPercent = Number(item.discountPercent || productDetail.percentage_Discount || 0);
    const finalPrice = discountPercent > 0
      ? Math.round(basePrice - (basePrice * discountPercent) / 100)
      : basePrice;

    const images = item.images || productDetail.images || [];
    const imgSrc = getImageUrl(images?.[0] || '/placeholder/120x160');

    const { quantity = 1, size = '' } = item;

    const handleQuantityChange = (newQty) => {
      if (newQty >= 1) {
        dispatch(updateCartQuantity({ userId: uid, productId, quantity: newQty }));
      }
    };

    const handleRemoveItem = () => {
      dispatch(removeFromCart({ userId: uid, productId }));
      toast.success("Product removed from cart");
    };

    // Optional fallback UI if something really goes wrong
    if (!name) {
      return (
        <Box sx={{ p: 2, border: '1px dashed red', mb: 2 }}>
          <Typography variant="body2">⚠️ Product info unavailable for now.</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ py: 2, borderBottom: `1px solid ${theme.palette.shades.light}` }}>
        <Grid container spacing={2}>
          <Grid item xs={3} sm={2}>
            <Box
              component="img"
              src={imgSrc}
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

          <Grid item xs={9} sm={10}>
            <Grid container>
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: theme.palette.custom.highlight || '#282c3f'
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
                        color: quantity <= 1
                          ? theme.palette.shades.medium
                          : theme.palette.custom.highlight
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
                        textAlign: 'center'
                      }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      sx={{ p: 0.5, color: theme.palette.custom.highlight }}
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

              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  textAlign: { xs: 'left', md: 'right' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '16px', mr: 1 }}>
                    ₹{finalPrice}
                  </Typography>

                  {originalPrice > finalPrice && (
                    <>
                      <Typography
                        sx={{
                          textDecoration: 'line-through',
                          color: '#999',
                          fontSize: '14px',
                          mr: 1
                        }}
                      >
                        ₹{originalPrice}
                      </Typography>
                      <Typography sx={{ color: '#ff3f6c', fontSize: '14px', fontWeight: 600 }}>
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

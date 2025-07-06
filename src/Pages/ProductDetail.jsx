// src/Pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/productSlice';
import { addItemToCart, fetchCart } from '../store/cartSlice';
import { addToWishlist, fetchWishlist } from '../store/wishlistSlice';
import { toast } from 'react-toastify';

import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Rating,
  Chip,
} from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
  ImageGrid,
  InfoTabs,
  ActionButton,
  PriceDisplay,
  FeatureBadge,
  ChipGroup,
} from '../Components/index';

const ProductDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { product, isLoading, error } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { userData, isLoggedIn } = useSelector((state) => state.auth);

  // Determine product ID
  const prodId = useMemo(
    () => (product?._id || product?.id)?.toString(),
    [product]
  );

  // Tab state
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e, v) => setTabValue(v);

  // Fetch product (and optionally cart+wishlist)
  useEffect(() => {
    dispatch(fetchProductById(id));
    if (isLoggedIn && userData?.userId) {
      dispatch(fetchCart(userData.userId));
      dispatch(fetchWishlist(userData.userId));
    }
  }, [dispatch, id, isLoggedIn, userData]);

  // Cart button handler
  const handleCartClick = async () => {
    if (!prodId) {
      toast.error('Product ID not available');
      return;
    }
    const inCart = cart?.items?.some(
      (item) => (item.productId || item.product?._id)?.toString() === prodId
    );
    if (inCart) return navigate('/cart');

    try {
      await dispatch(
        addItemToCart({
          userId: isLoggedIn ? userData.userId : null,
          product,
          quantity: 1,
        })
      ).unwrap();
      toast.success('Added to cart!');
      if (isLoggedIn) dispatch(fetchCart(userData.userId));
    } catch (err) {
      toast.error('Failed to add to cart');
      console.error('Cart error:', err);
    }
  };

  // Wishlist button handler
  const handleWishlistClick = async () => {
    if (!prodId) {
      toast.error('Product ID not available');
      return;
    }
    const inWishlist = wishlist?.products?.some(
      (p) => (p._id || p.id)?.toString() === prodId
    );
    if (inWishlist) return navigate('/wishlist');

    try {
      await dispatch(
        addToWishlist({ userId: userData.userId, productId: prodId })
      ).unwrap();
      toast.success('Added to wishlist!');
      dispatch(fetchWishlist(userData.userId));
    } catch (err) {
      toast.error('Failed to add to wishlist');
      console.error(err);
    }
  };

  // Button labels
  const inCart = cart?.items?.some(
    (item) => (item.productId || item.product?._id)?.toString() === prodId
  );
  const inWishlist = wishlist?.products?.some(
    (p) => (p._id || p.id)?.toString() === prodId
  );
  const cartButtonText = inCart ? 'Go to Cart' : 'Add to Bag';
  const wishlistButtonText = inWishlist ? 'Go to Wishlist' : 'Add to Wishlist';

  // Loading / error states
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
  if (!product) return null;

  // Layout
  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: isMobile ? 4 : 20 }}>
      {/* Breadcrumb & back */}
      {isMobile ? (
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIosIcon />
        </IconButton>
      ) : (
        <Typography
          variant="subtitle2"
          onClick={() => navigate('/shop')}
          sx={{ cursor: 'pointer', mb: 2 }}
        >
          {product.category?.name} / {product.name}
        </Typography>
      )}

      <Stack direction={isMobile ? 'column' : 'row'} spacing={5}>
        {/* Images */}
        <Box flex={1}>
          <ImageGrid images={product.images || []} productName={product.name} />
        </Box>

        {/* Details */}
        <Box flex={1}>
          <Stack spacing={3}>
            <PriceDisplay
              price={product.price}
              discountActive={product.discount}
              discountPercent={product.percentage_Discount}
              currency={product.currency || '₹'}
            />
            {/* Seller Rating */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating
                value={product.seller?.rating || 4}
                readOnly
              />
              <Typography>({product.seller?.rating || 4})</Typography>
            </Stack>

            {/* Features */}
            <Stack direction="row" spacing={1}>
              <FeatureBadge icon={<LocalShippingIcon />} text={`Ships in ${product.shipping_Time}`} />
              <FeatureBadge icon={<InventoryIcon />} text="Easy Returns" />
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <ActionButton
                buttonType="highlight"
                startIcon={inCart ? <ShoppingCartIcon /> : <ShoppingCartOutlinedIcon />}
                onClick={handleCartClick}
                fullWidth
              >
                {cartButtonText}
              </ActionButton>
              <ActionButton
                buttonType="outline"
                startIcon={inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleWishlistClick}
                fullWidth
              >
                {wishlistButtonText}
              </ActionButton>
            </Stack>

            {/* Info Tabs */}
            <InfoTabs value={tabValue} onChange={handleTabChange} tabs={[
              { label: 'Description', content: <Typography>{product.description}</Typography> },
              { label: 'Shipping', content: <Typography>Ships in {product.shipping_Time}</Typography> },
              { label: 'Reviews', content: <Typography>No reviews yet</Typography> }
            ]} />

            {/* Share */}
            <Box>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="flex-end">
                <IconButton><ShareIcon /></IconButton>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default ProductDetail;

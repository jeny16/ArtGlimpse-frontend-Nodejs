import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/productSlice';
import { addToCart, fetchCart } from '../store/cartSlice';
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
  Chip
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
import { ImageGrid, InfoTabs, ActionButton, PriceDisplay, FeatureBadge, ChipGroup } from '../Components/index';

const ProductDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux slices
  const { product, isLoading, error } = useSelector((state) => state.product);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { userData, isLoggedIn } = useSelector((state) => state.auth);

  // Compute product ID using id or _id
  const prodId = useMemo(() => (product?.id || product?._id)?.toString(), [product]);

  // Tab state for InfoTabs
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // ---------------------------
  // Add to Cart or View Cart
  // ---------------------------
  const handleCartClick = async () => {
    if (!isLoggedIn || !userData?.userId) {
      toast.error("Please log in to add to cart");
      return;
    }
    if (!prodId) {
      toast.error("Product ID not available");
      return;
    }

    // Updated cart check: checks for productId or product.id/_id
    const inCart = cart?.items?.some(item => {
      const itemId = (item.productId || item.product?.id || item.product?._id)?.toString();
      return itemId === prodId;
    });

    if (inCart) {
      navigate("/cart");
      return;
    }

    try {
      await dispatch(
        addToCart({
          userId: userData.userId,
          productId: prodId,
          quantity: 1,
        })
      ).unwrap();
      toast.success("Added to cart!");
      // Refresh cart data so the button text updates
      dispatch(fetchCart(userData.userId));
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error("Cart error:", err);
    }
  };

  // ---------------------------
  // Add to Wishlist or View Wishlist
  // ---------------------------
  const handleWishlistClick = async () => {
    if (!isLoggedIn || !userData?.userId) {
      toast.error("Please log in to modify your wishlist");
      return;
    }
    if (!prodId) {
      toast.error("Product ID not available");
      return;
    }

    const inWishlist = wishlist?.products?.some(p => {
      const wishId = (p.id || p._id)?.toString();
      return wishId === prodId;
    });

    if (inWishlist) {
      navigate("/wishlist");
      return;
    }

    try {
      await dispatch(
        addToWishlist({
          userId: userData.userId,
          productId: prodId,
        })
      ).unwrap();
      toast.success("Added to wishlist!");
      // Refresh wishlist data so the button text updates
      dispatch(fetchWishlist(userData.userId));
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.error("Wishlist error:", err);
    }
  };

  // Determine current state using prodId
  const inCart = cart?.items?.some(item => {
    const itemId = (item.productId || item.product?.id || item.product?._id)?.toString();
    return itemId === prodId;
  });
  const inWishlist = wishlist?.products?.some(p => {
    const wishId = (p.id || p._id)?.toString();
    return wishId === prodId;
  });

  const cartButtonText = inCart ? "Go to Cart" : "Add to Bag";
  const wishlistButtonText = inWishlist ? "Go to Wishlist" : "Add to Wishlist";

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <CircularProgress size={60} sx={{ color: theme.palette.custom.highlight }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Typography variant="h5" sx={{ color: theme.palette.error.main, mb: 2 }}>
          Error: {error}
        </Typography>
        <ActionButton
          buttonType="highlight"
          onClick={() => navigate('/products')}
          sx={{ mt: 3 }}
        >
          Return to Products
        </ActionButton>
      </Box>
    );
  }

  if (!product) return null;

  const price = product.price || 0;
  const discountActive = product.discount;
  const discountPercent = product.percentage_Discount || 0;
  const images = product.images || [];

  const tabContent = [
    {
      label: 'Description',
      content: (
        <Box>
          <Typography
            variant="body1"
            paragraph
            sx={{
              color: theme.palette.neutral.main,
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {product.description ||
              "This beautiful handcrafted product showcases the finest craftsmanship with attention to detail. Made with premium materials, this item promises both style and durability for years to come."}
          </Typography>
          <ChipGroup
            title="Materials"
            items={product.materials_Made || ["Cotton", "Linen", "Natural Dye"]}
            variant="highlight"
          />
          <ChipGroup
            title="Tags"
            items={product.tags || ["Handcrafted", "Eco-friendly", "Traditional"]}
            variant="outline"
          />
        </Box>
      )
    },
    {
      label: 'Shipping',
      content: (
        <Box>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: theme.palette.custom.highlight, mb: 1 }}
              >
                Shipping Information
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.neutral.main }}>
                Estimated delivery time: {product.shipping_Time || product.shipping_time || '3-5 days'}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: theme.palette.custom.highlight, mb: 1 }}
              >
                Return Policy
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.neutral.main }}>
                30 days return policy. See terms and conditions for more details.
              </Typography>
            </Box>
          </Stack>
        </Box>
      )
    },
    {
      label: 'Reviews',
      content: (
        <Box>
          <Typography variant="body1" sx={{ color: theme.palette.neutral.main, mb: 3 }}>
            Customer reviews will be displayed here.
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 6 },
        my: { xs: 4, md: 20 },
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: theme.palette.custom.highlight }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Box mb={2}>
          <Typography
            variant="subtitle2"
            sx={{
              cursor: 'pointer',
              color: theme.palette.custom.highlight,
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => navigate('/shop')}
          >
            {product.category.name || 'Home Decor'} / {product.name || 'Handcrafted Product'}
          </Typography>
        </Box>
      )}

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 3 : 5}
        sx={{
          p: 3,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <ImageGrid images={images} productName={product.name} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            {/* Added product name as title */}
            <Typography variant="h5" sx={{ color: theme.palette.custom.highlight, fontWeight: 600 }}>
              {product.name}
            </Typography>
            <PriceDisplay
              price={price}
              discountActive={discountActive}
              discountPercent={discountPercent}
              currency={product.currency || '₹'}
            />

            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating
                value={product.seller?.rating || 4.2}
                precision={0.1}
                readOnly
                size={isMobile ? 'small' : 'medium'}
                sx={{ color: theme.palette.custom.highlight }}
              />
              <Typography variant="body2" sx={{ color: theme.palette.custom.highlight }}>
                ({product.seller?.rating || 4.2})
              </Typography>
              {product.seller && (
                <Chip
                  icon={<VerifiedIcon sx={{ color: theme.palette.custom.highlight }} />}
                  label="Verified"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.tints.tint1,
                    color: theme.palette.custom.highlight,
                    fontWeight: 600,
                    borderRadius: 1,
                  }}
                />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <FeatureBadge
                icon={<LocalShippingIcon fontSize="small" />}
                text={`Ships in ${product.shipping_Time || '3-5 days'}`}
              />
              <FeatureBadge
                icon={<InventoryIcon fontSize="small" />}
                text="Easy Returns"
              />
              <FeatureBadge
                icon={<LocationOnIcon fontSize="small" />}
                text={product.seller?.location || 'India'}
              />
            </Stack>

            {/* Buttons for cart and wishlist (50% width each) */}
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <ActionButton
                  buttonType="highlight"
                  size="medium"
                  startIcon={inCart ? <ShoppingCartIcon /> : <ShoppingCartOutlinedIcon />}
                  onClick={handleCartClick}
                  sx={{ width: '100%' }}
                >
                  {cartButtonText}
                </ActionButton>
              </Box>
              <Box sx={{ flex: 1 }}>
                <ActionButton
                  buttonType="outline"
                  size="medium"
                  startIcon={inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleWishlistClick}
                  sx={{ width: '100%' }}
                >
                  {wishlistButtonText}
                </ActionButton>
              </Box>
            </Stack>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                border: `1px dashed ${theme.palette.custom.highlight}40`,
                backgroundColor: theme.palette.tints.tint1,
              }}
            >
              <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: theme.palette.custom.highlight }}>
                      DELIVERY OPTIONS
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocalShippingIcon sx={{ color: theme.palette.custom.highlight }} fontSize="small" />
                      <Typography variant="body2">
                        {product.shipping_Time || product.shipping_time || '3-5 days'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: theme.palette.custom.highlight }}>
                      PROCESSING TIME
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeIcon sx={{ color: theme.palette.custom.highlight }} fontSize="small" />
                      <Typography variant="body2">
                        {product.processing_Time || product.processing_time || '1-2 days'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <InfoTabs tabs={tabContent} />

            <Box>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Typography variant="body2" sx={{ alignSelf: 'center', color: theme.palette.custom.highlight }}>
                  Share:
                </Typography>
                <IconButton size="small" sx={{ color: theme.palette.custom.highlight }}>
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default ProductDetail;

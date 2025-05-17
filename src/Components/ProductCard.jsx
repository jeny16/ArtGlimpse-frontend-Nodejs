import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../store/wishlistSlice";
import { addToCart, fetchCart } from "../store/cartSlice";
// Import the helper function to get a viewable image URL from Appwrite or a public URL.
import { getImageUrl } from "../actions/getImage";

// Module-level flags to ensure wishlist and cart are fetched only once
let wishlistFetched = false;
let cartFetched = false;

const ProductCard = ({ product }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const wishlistState = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);

  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Use product.images if available; otherwise use a placeholder.
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://via.placeholder.com/150"];
  const isOutOfStock = product.stock <= 0;

  // Calculate product id as a string.
  const prodId = (product.id || product._id)?.toString();

  // Check if product is in cart (comparing as strings).
  const inCart =
    cart &&
    cart.items &&
    cart.items.find((item) => {
      const idStr =
        typeof item.productId === "string"
          ? item.productId
          : item.productId?.toString();
      return idStr === prodId;
    });

  // Fetch wishlist if not loaded already.
  useEffect(() => {
    if (
      auth.isLoggedIn &&
      auth.userData?.userId &&
      !wishlistState &&
      !wishlistFetched
    ) {
      dispatch(fetchWishlist(auth.userData.userId));
      wishlistFetched = true;
    }
  }, [auth, dispatch, wishlistState]);

  // Fetch cart if not loaded already.
  useEffect(() => {
    if (
      auth.isLoggedIn &&
      auth.userData?.userId &&
      !cart &&
      !cartFetched
    ) {
      dispatch(fetchCart(auth.userData.userId));
      cartFetched = true;
    }
  }, [auth, dispatch, cart]);

  // Update local favorite state when wishlist changes.
  useEffect(() => {
    if (wishlistState?.products) {
      const exists = wishlistState.products.some(
        (p) =>
          (p.id || p._id)?.toString() === prodId ||
          (p.productId?._id || p.productId)?.toString() === prodId
      );
      setIsFavorite(exists);
    }
  }, [wishlistState, prodId]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setCurrentImage(0);
  }, []);

  useEffect(() => {
    let timer;
    if (isHovered && images.length > 1 && !isOutOfStock) {
      timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 1500);
    }
    return () => timer && clearInterval(timer);
  }, [isHovered, images, isOutOfStock]);

  // Determine if we're on the wishlist page.
  const isOnWishlistPage = location.pathname.includes("/wishlist");

  const handleWishlistToggle = async () => {
    if (!auth.isLoggedIn || !auth.userData?.userId) {
      toast.error("Please log in to modify your wishlist");
      return;
    }
    if (!prodId) {
      toast.error("Product ID not available");
      return;
    }
    try {
      if (isFavorite) {
        if (isOnWishlistPage) {
          await dispatch(
            removeFromWishlist({
              userId: auth.userData.userId,
              productId: prodId,
            })
          ).unwrap();
          toast.success("Removed from wishlist!");
        } else {
          navigate("/wishlist");
        }
      } else {
        await dispatch(
          addToWishlist({
            userId: auth.userData.userId,
            productId: prodId,
          })
        ).unwrap();
        toast.success("Added to wishlist!");
      }
      dispatch(fetchWishlist(auth.userData.userId));
    } catch (error) {
      toast.error(isFavorite ? "Failed to remove from wishlist" : "Failed to add to wishlist");
      console.error("Wishlist operation error:", error);
    }
  };

  const handleCartAdd = async () => {
    if (!auth.isLoggedIn || !auth.userData?.userId) {
      toast.error("Please log in to add to cart");
      return;
    }
    if (!prodId) {
      toast.error("Product ID not available");
      return;
    }
    if (inCart) {
      navigate("/cart");
      return;
    }
    try {
      await dispatch(
        addToCart({
          userId: auth.userData.userId,
          productId: prodId,
          quantity: 1,
        })
      ).unwrap();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Cart add error:", error);
    }
  };

  const wishlistTooltip = useMemo(() => {
    if (isFavorite) {
      return isOnWishlistPage ? "Remove from wishlist" : "View your wishlist";
    }
    return "Add to wishlist";
  }, [isFavorite, isOnWishlistPage]);

  const cartTooltip = useMemo(() => {
    return inCart ? "View Cart" : "Add to Cart";
  }, [inCart]);

  // Discount badge displayed on hover.
  const discountBadge = useMemo(() => {
    if (product.discount) {
      return (
        <Box
          sx={{
            position: "absolute",
            top: isMobile ? 8 : 16,
            left: isMobile ? 8 : 16,
            backgroundColor: theme.palette.error.main,
            px: isMobile ? 0.5 : 1,
            py: isMobile ? 0.25 : 0.5,
            borderRadius: 1,
            zIndex: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.common.white,
              fontWeight: 600,
              fontSize: isMobile ? "0.65rem" : "0.75rem",
            }}
          >
            {product.percentage_Discount}% OFF
          </Typography>
        </Box>
      );
    }
    return null;
  }, [product.discount, product.percentage_Discount, isMobile, theme]);

  return (
    <Card
      sx={{
        borderRadius: isHovered ? 0 : 2,
        overflow: "hidden",
        backgroundColor: isHovered ? theme.palette.primary.main : "transparent",
        boxShadow: isHovered ? theme.shadows[4] : "none",
        position: "relative",
        width: "100%",
        maxWidth: { xs: "160px", sm: "200px", md: "100%" },
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${prodId}`} style={{ textDecoration: "none" }}>
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: { xs: "133%", sm: "130%", md: "125%" },
            }}
          >
            <CardMedia
              component="img"
              image={
                // Using getImageUrl on the first image in the images array
                images && images.length > 0
                  ? getImageUrl(images[currentImage])
                  : "/api/placeholder/150"
              }
              alt={product.name}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
                transform: isHovered ? "scale(1.03)" : "scale(1)",
                borderRadius: isHovered ? 0 : 2,
              }}
            />
          </Box>
          {discountBadge}
          {isOutOfStock && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.common.white,
                  fontWeight: "bold",
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
              >
                OUT OF STOCK
              </Typography>
            </Box>
          )}
        </Box>
        <CardContent
          sx={{
            pt: { xs: 1.5, sm: 2, md: 3 },
            pb: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1, sm: 1.5, md: 2 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.secondary.main,
              textTransform: "uppercase",
              letterSpacing: 1,
              mb: 0.5,
              fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.75rem" },
            }}
          >
            {product.category.name}
          </Typography>
          <Divider
            sx={{
              width: { xs: 20, sm: 30, md: 40 },
              borderColor: theme.palette.custom?.highlight || "black",
              borderWidth: { xs: 1, sm: 1.5, md: 2 },
              mb: { xs: 1, sm: 1.5, md: 2 },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.neutral?.light || "black",
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
              fontWeight: 500,
              mb: 0.5,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.custom?.highlight || "black",
              fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1.1rem" },
              fontWeight: 600,
            }}
          >
            {product.currency === "INR" ? "₹" : ""}
            {product.price}
          </Typography>
        </CardContent>
      </Link>
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? 4 : 8,
          right: isMobile ? 4 : 8,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 0.5 : 1,
          zIndex: 2,
        }}
      >
        {(isHovered || isFavorite) && (
          <Tooltip title={wishlistTooltip}>
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={(e) => {
                e.preventDefault();
                handleWishlistToggle();
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon
                  sx={{
                    color: theme.palette.custom?.highlight || "red",
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  sx={{
                    color: theme.palette.custom?.highlight || "red",
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        )}
        {(isHovered || inCart) && (
          <Tooltip title={cartTooltip}>
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={(e) => {
                e.preventDefault();
                handleCartAdd();
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              }}
            >
              {inCart ? (
                <ShoppingCartIcon
                  sx={{
                    color: theme.palette.custom?.highlight || "green",
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                />
              ) : (
                <ShoppingCartOutlinedIcon
                  sx={{
                    color: theme.palette.custom?.highlight || "green",
                    fontSize: isMobile ? "1rem" : "1.25rem",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Card>
  );
};

export default memo(ProductCard);

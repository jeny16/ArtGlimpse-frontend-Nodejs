import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Container } from "@mui/material";
import {
  ProductGrid,
  Loader,
  ErrorState,
  EmptyState,
  CommonButton,
} from "../Components";
import { fetchWishlist } from "../store/wishlistSlice";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const userId = auth.userData?.userId || auth.userData?._id;

  // Pull the entire slice state, not just `.products`
  const {
    products: wishlist,
    isLoading,
    error,
  } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (userId) dispatch(fetchWishlist(userId));
  }, [dispatch, userId]);

  // Filter & normalize into a flat array of product objects
  const validProducts = useMemo(() => {
    if (Array.isArray(wishlist)) {
      return wishlist
        .filter((item) => {
          const prod = item.productId || item;
          return prod?.name?.trim();
        })
        .map((item) => item.productId || item);
    }
    return [];
  }, [wishlist]);

  if (isLoading) return <Loader />;

  if (error) {
    const msg =
      typeof error === "object" ? error.message || JSON.stringify(error) : error;
    return (
      <ErrorState
        title="Wishlist Error"
        description={msg}
        buttonText="Retry"
        onRetry={() => dispatch(fetchWishlist(userId))}
      />
    );
  }

  if (validProducts.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Looks like you haven't added any products to your wishlist yet. Start exploring and add your favorite products."
        buttonText="Explore Products"
        redirectTo="/"
        IconComponent={FavoriteBorderIcon}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 24, pb: 10 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "center",
          mb: { xs: 4, sm: 5, md: 6 },
          color: "#814d0b",
          fontWeight: 650,
          fontSize: {
            xs: "1.8rem",
            sm: "2.2rem",
            md: "2.5rem",
            lg: "3rem",
          },
        }}
      >
        Your Wishlist
      </Typography>
      <ProductGrid products={validProducts} />
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <CommonButton btnText="Back to Home" onClick={() => navigate("/")} />
      </Box>
    </Container>
  );
};

export default WishlistPage;

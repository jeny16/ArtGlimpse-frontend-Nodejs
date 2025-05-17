import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Container } from "@mui/material";
import { ProductGrid, Loader, ErrorState, EmptyState, CommonButton } from "../Components";
import { fetchWishlist } from "../store/wishlistSlice";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const WishlistPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    // Use either userData.userId or userData._id based on your auth slice
    const userId = auth.userData?.userId || auth.userData?._id;

    useEffect(() => {
        if (userId) {
            dispatch(fetchWishlist(userId));
        }
    }, [dispatch, userId]);

    const { wishlist, isLoading, error } = useSelector((state) => state.wishlist);
    // Normalize wishlist products
    const validProducts = useMemo(() => {
        if (wishlist?.products) {
            return wishlist.products
                .filter(p => {
                    // Handle both direct product objects and nested productId objects
                    const product = p.productId || p;
                    return product && product.name && product.name.trim() !== "";
                })
                .map(p => p.productId || p);
        }
        return [];
    }, [wishlist]);

    if (isLoading) return <Loader />;
    if (error)
        return (
            <ErrorState
                title="Wishlist Error"
                description={typeof error === "object" ? error.message || JSON.stringify(error) : error}
                buttonText="Retry"
                onRetry={() => dispatch(fetchWishlist(userId))}
            />
        );

    if (validProducts.length === 0)
        return (
            <EmptyState
                title="Your wishlist is empty"
                description="Looks like you haven't added any products to your wishlist yet. Start exploring and add your favorite products."
                buttonText="Explore Products"
                redirectTo="/"
                IconComponent={FavoriteBorderIcon}
            />
        );

    return (
        <Container maxWidth="lg" sx={{ pt: 24, pb: 10 }}>
            <Typography variant="h3"
                component="h2"
                sx={{
                    textAlign: "center",
                    mb: { xs: 4, sm: 5, md: 6 },
                    color: "#814d0b",
                    fontWeight: 650,
                    fontSize: {
                        xs: '1.8rem',
                        sm: '2.2rem',
                        md: '2.5rem',
                        lg: '3rem'
                    }
                }}
            >
                Your Wishlist
            </Typography>
            <ProductGrid products={validProducts} />
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <CommonButton
                    btnText="Back to Home"
                    onClick={() => navigate("/")}
                />
            </Box>
        </Container>
    );
};

export default WishlistPage;

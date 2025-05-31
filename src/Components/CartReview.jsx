import React from 'react';
import { Typography, Box, Paper, Chip, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import CartItem from './CartItem';
import { useTheme } from '@mui/material/styles';

const CartReview = () => {
    const theme = useTheme();
    const cart = useSelector((state) => state.cart.cart);
    // console.log("cart items", cart);

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.shades.light}`,
                    borderRadius: '4px',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Your cart is empty
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    Looks like you haven't added anything to your cart yet.
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.custom?.highlight,
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: theme.palette.custom?.accent,
                        },
                    }}
                >
                    CONTINUE SHOPPING
                </Button>
            </Paper>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        fontSize: '18px',
                    }}
                >
                    My Shopping Bag ({cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'})
                </Typography>

                <Chip
                    label="100% SECURE"
                    icon={
                        <Box
                            component="span"
                            sx={{
                                width: 16,
                                height: 16,
                                bgcolor: '#14cda8',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '10px',
                                mr: '4px !important',
                            }}
                        >
                            ✓
                        </Box>
                    }
                    sx={{
                        backgroundColor: '#fff',
                        border: '1px solid #14cda8',
                        color: '#14cda8',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '24px',
                    }}
                />
            </Box>

            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.shades.light}`,
                    borderRadius: '4px',
                }}
            >
                <Box sx={{ px: 3 }}>
                    <Box
                        sx={{
                            py: 2,
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: `1px solid ${theme.palette.shades.light}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: '14px',
                                color: '#282c3f',
                                mr: 1,
                            }}
                        >
                            Available Offers:
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                color: '#282c3f',
                            }}
                        >
                            10% Instant Discount on PNB Credit Cards on a min spend of ₹3,000. TCA
                        </Typography>
                    </Box>

                    {cart.items.map((item) => (
                        <Box key={item.productData._id}>
                            <CartItem item={item} />
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default CartReview;

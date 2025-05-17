import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const PriceDetails = ({ onContinue }) => {
    const theme = useTheme();
    const cart = useSelector((state) => state.cart.cart) || {};
    const items = cart.items || [];
    const couponCode = cart.couponCode || "";
    const donationAmount = Number(cart.donationAmount) || 0;

    let totalMRP = 0;
    let totalDiscount = 0;
    let shippingCost = 0;

    items.forEach((item) => {
        const itemPrice = Number(item.productData.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemTotal = itemPrice * quantity;
        totalMRP += itemTotal;

        const discountPercent = Number(item.discountPercent) || 0;
        if (discountPercent) {
            totalDiscount += (itemPrice * discountPercent * quantity) / 100;
        }

        const itemShipping = Number(item.shippingCost) || 0;
        shippingCost = Math.max(shippingCost, itemShipping);
    });

    let couponDiscount = 0;
    if (couponCode === 'NEWUSER') {
        couponDiscount = totalMRP * 0.1;
    }

    const totalPayable =
        totalMRP - totalDiscount - couponDiscount + shippingCost + donationAmount;

    const estimatedDeliveryDate = '29 Mar 2025';

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 0,
                border: `1px solid ${theme.palette.shades.medium}`,
                p: 2,
            }}
        >
            {/* Estimated Delivery */}
            <Box
                sx={{
                    mb: 2,
                    backgroundColor: theme.palette.tints.tint3,
                    p: 1.5,
                    borderRadius: 1,
                }}
            >
                <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ color: theme.palette.custom.highlight }}
                >
                    Estimated delivery: {estimatedDeliveryDate}
                </Typography>
            </Box>

            {/* Price Breakdown */}
            <CardContent sx={{ py: 0, px: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    PRICE DETAILS
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                        Price ({items.length} {items.length > 1 ? 'items' : 'item'})
                    </Typography>
                    <Typography variant="body2">₹{totalMRP.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.custom.highlight }}>
                        -₹{totalDiscount.toFixed(2)}
                    </Typography>
                </Box>

                {couponCode && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Coupon Discount</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.custom.highlight }}>
                            -₹{couponDiscount.toFixed(2)}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">₹{shippingCost.toFixed(2)}</Typography>
                </Box>

                {donationAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Donation</Typography>
                        <Typography variant="body2">₹{donationAmount.toFixed(2)}</Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                        Total Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                        ₹{totalPayable.toFixed(2)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PriceDetails;

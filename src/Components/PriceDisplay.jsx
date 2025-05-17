import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const DiscountedPrice = styled(Typography)(({ theme }) => ({
    color: theme.palette.custom.highlight,
    fontWeight: 'bold',
    fontFamily: theme.typography.h2.fontFamily,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.main,
    textDecoration: 'line-through',
    marginLeft: theme.spacing(1),
    fontFamily: theme.typography.body1.fontFamily,
}));

const DiscountLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.custom.accent,
    marginLeft: theme.spacing(1),
    fontWeight: 600,
    fontFamily: theme.typography.body1.fontFamily,
    backgroundColor: theme.palette.tints.tint1,
    padding: '4px 8px',
    borderRadius: '4px',
}));

const PriceDisplay = ({ price, discountActive, discountPercent, currency = '₹' }) => {
    const discountedPrice = discountActive
        ? price - (price * discountPercent / 100)
        : price;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 2, mb: 2 }}>
            <DiscountedPrice variant="h4">
                {currency} {discountedPrice.toFixed(2)}
            </DiscountedPrice>
            {discountActive && (
                <>
                    <OriginalPrice variant="h6">
                        {currency} {price.toFixed(2)}
                    </OriginalPrice>
                    <DiscountLabel variant="body1">
                        {discountPercent}% OFF
                    </DiscountLabel>
                </>
            )}
        </Box>
    );
};

export default PriceDisplay;

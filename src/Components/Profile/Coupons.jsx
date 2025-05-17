import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Divider,
    Grid,
    Card,
    CardContent,
    Chip,
    IconButton,
    Alert,
    Collapse,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Coupons = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [couponCode, setCouponCode] = useState('');
    const [copied, setCopied] = useState(null);
    const [redeemAlert, setRedeemAlert] = useState(false);

    // Static coupon data for demonstration
    const availableCoupons = [
        {
            code: "SAVE15",
            type: "percent",
            discount: "15% OFF",
            description: "Get 15% off on your next purchase of art prints.",
            expires: "Expires in 3 days"
        },
        {
            code: "ARTFIX20",
            type: "fixed",
            discount: "$20 OFF",
            description: "Save $20 when you spend over $100 on any art piece.",
            expires: "Expires in 5 days"
        },
        {
            code: "FREESHIP",
            type: "shipping",
            discount: "Free Shipping",
            description: "Enjoy free shipping on all orders over $50.",
            expires: "Expires in 7 days"
        }
    ];

    const handleCouponSubmit = (e) => {
        e.preventDefault();
        // In a real app, coupon validation would occur here.
        setRedeemAlert(true);
        setTimeout(() => setRedeemAlert(false), 3000);
        setCouponCode('');
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const getCouponIcon = (type) => {
        switch (type) {
            case 'percent':
                return <PercentIcon />;
            case 'fixed':
                return <AttachMoneyIcon />;
            case 'shipping':
                return <ShoppingCartIcon />;
            default:
                return <CardGiftcardIcon />;
        }
    };

    return (
        <Paper
            sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #fdf7ed, #fefaf4)',
                    borderBottom: '1px solid',
                    borderColor: 'shades.light'
                }}
            >
                <CardGiftcardIcon sx={{ fontSize: 40, color: 'custom.highlight', mb: 1 }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'custom.highlight', mb: 1 }}>
                    Exclusive Coupons
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Unlock special discounts on your favorite art pieces.
                </Typography>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
                {/* Redeem Coupon Form */}
                <Collapse in={redeemAlert}>
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setRedeemAlert(false)}>
                        Coupon code submitted successfully!
                    </Alert>
                </Collapse>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                        Have a coupon code? Enter it below:
                    </Typography>
                    <form onSubmit={handleCouponSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                            <TextField
                                variant="outlined"
                                placeholder="Enter coupon code"
                                fullWidth
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                size="small"
                                sx={{
                                    flexGrow: 1,
                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'custom.highlight'
                                    },
                                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'custom.accent'
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'custom.highlight'
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!couponCode}
                                sx={{
                                    px: 3,
                                    whiteSpace: 'nowrap',
                                    color: 'white',
                                    width: isMobile ? '100%' : 'auto',
                                    backgroundColor: 'custom.highlight',
                                    borderColor: 'custom.highlight',
                                    '&:hover': { backgroundColor: 'custom.accent' }
                                }}
                            >
                                Apply Coupon
                            </Button>
                        </Box>
                    </form>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Available Coupons Section */}
                <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 'medium' }}>
                    Available Coupons
                </Typography>
                {availableCoupons.length > 0 ? (
                    <Grid container spacing={3}>
                        {availableCoupons.map((coupon) => (
                            <Grid item xs={12} sm={6} key={coupon.code}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        borderColor: 'primary.light',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    {/* Left Accent */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '6px',
                                            height: '100%',
                                            bgcolor: 'custom.highlight'
                                        }}
                                    />
                                    <CardContent sx={{ pl: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ mr: 1.5, color: 'custom.highlight' }}>
                                                    {getCouponIcon(coupon.type)}
                                                </Box>
                                                <Typography variant="h6" fontWeight="medium">
                                                    {coupon.discount}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={coupon.expires}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {coupon.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    bgcolor: 'action.hover',
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    py: 0.5
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight="medium" sx={{ mr: 1, fontFamily: 'monospace' }}>
                                                    {coupon.code}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleCopy(coupon.code)}
                                                    color={copied === coupon.code ? "success" : "default"}
                                                >
                                                    {copied === coupon.code ? (
                                                        <CheckCircleOutlineIcon fontSize="small" />
                                                    ) : (
                                                        <ContentCopyIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </Box>
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={() => handleCopy(coupon.code)}
                                                sx={{ color: 'custom.highlight' }}
                                            >
                                                Use Now
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Fade in={true}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 5,
                                px: 2,
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                textAlign: 'center'
                            }}
                        >
                            <CardGiftcardIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                No Coupons Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                                Check back soon for special offers and discounts on your favorite art pieces.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    px: 3,
                                    color: 'white',
                                    backgroundColor: 'custom.highlight',
                                    borderColor: 'custom.highlight',
                                    '&:hover': { backgroundColor: 'custom.accent' }
                                }}
                                href="/shop"
                            >
                                Browse Gallery
                            </Button>
                        </Box>
                    </Fade>
                )}

                <Divider sx={{ my: 4 }} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Subscribe to our newsletter to receive exclusive coupon codes and special offers.
                </Typography>
            </Box>
        </Paper>
    );
};

export default Coupons;

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Button,
    Grid,
    Chip,
    Rating,
    useTheme
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../store/orderSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OrderStatusTracker from '../Components/OrderStatusTracker';
import { getImageUrl } from '../actions/getImage';

const getStatusChipColor = (status) => {
    switch (status) {
        case 'Delivered':
            return 'success';
        case 'Processing':
        case 'New':
            return 'warning';
        case 'Shipped':
            return 'info';
        case 'Cancelled':
            return 'error';
        default:
            return 'default';
    }
};

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, status } = useSelector((state) => state.order);
    const [order, setOrder] = useState(null);
    const theme = useTheme();
    const auth = useSelector((state) => state.auth);
    const userId = auth.userData?.userId;

    useEffect(() => {
        dispatch(fetchOrders(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (orders && orders.length > 0) {
            const found = orders.find((o) => o.id === orderId);
            setOrder(found || null);
        }
    }, [orders, orderId]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (status === 'loading') {
        return (
            <Container>
                <Typography>Loading order details...</Typography>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container>
                <Typography>No order found for ID: {orderId}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 24 }}>
            {/* Top bar */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/profile')}
                    sx={{
                        textTransform: 'none',
                        color: theme.palette.custom.highlight
                    }}
                >
                    Back to Orders
                </Button>
                <Button
                    variant="text"
                    onClick={() => alert('Help clicked')}
                    sx={{
                        textTransform: 'none',
                        color: theme.palette.custom.highlight
                    }}
                >
                    Need help?
                </Button>
            </Box>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Order ID: {order.id} ({order.items?.length} item{order.items?.length !== 1 ? 's' : ''})
                        </Typography>
                        <Chip
                            label={order.orderStatus}
                            color={getStatusChipColor(order.orderStatus)}
                            size="medium"
                            sx={{
                                fontWeight: 'bold',
                                '& .MuiChip-label': { px: 2, py: 0.5 }
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Placed on: {formatDate(order.createdAt)}
                    </Typography>
                </Box>

                {/* Status Tracker */}
                <Box sx={{ my: 4, px: { xs: 0, md: 2 } }}>
                    <OrderStatusTracker status={order.orderStatus} createdAt={order.createdAt} />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Shipping Info */}
                <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalShippingIcon sx={{ color: theme.palette.custom.highlight, mr: 1.5 }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                            Shipping Information
                        </Typography>
                    </Box>
                    {order.orderStatus === 'Delivered' ? (
                        <Typography variant="body2" sx={{ ml: 4 }}>
                            Your order was delivered on {formatDate(order.createdAt)}
                        </Typography>
                    ) : order.orderStatus === 'Cancelled' ? (
                        <Typography variant="body2" color="error" sx={{ ml: 4 }}>
                            Order was cancelled on {formatDate(order.createdAt)}
                        </Typography>
                    ) : (
                        <Box sx={{ ml: 4 }}>
                            <Typography variant="body2">
                                {order.orderStatus === 'New' && 'Your order has been received and is being prepared for processing.'}
                                {order.orderStatus === 'Processing' && "Your order is being processed. We'll notify you once it ships."}
                                {order.orderStatus === 'Shipped' && 'Your order is on the way! Expect delivery in 3-5 business days.'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                {order.orderStatus === 'Shipped' && `Tracking Number: ${order.id}123456789`}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Grid container spacing={3}>
                    {/* Items */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            Items in Your Order
                        </Typography>
                        {order.items?.map((item, idx) => {
                            const productData = item.productData || {};
                            const images = productData.images || [];
                            const productImage = getImageUrl(images[0] || '/api/placeholder/120/160');
                            const productName = productData.name || 'Product Name';
                            const price = item.price || productData.price || 0;
                            const productId = item.productId;
                            return (
                                <Box
                                    key={idx}
                                    onClick={() => navigate(`/product/${productId}`)}
                                    sx={{
                                        display: 'flex',
                                        mb: 2,
                                        p: 2,
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        bgcolor: '#fcfcfc',
                                        cursor: "pointer",
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            bgcolor: '#f9f9f9',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={3} sm={2}>
                                            <Box
                                                component="img"
                                                src={productImage}  // ← UPDATED
                                                alt={productName}
                                                sx={{
                                                    width: { xs: '100px', md: '120px' },
                                                    height: '160px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: `1px solid ${theme.palette.shades.light}`
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={9} sm={10}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} md={7}>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '16px' }}>
                                                        {productName}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                                                        Quantity: {item.quantity || 1}
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
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mb: 1 }}>
                                                        <Typography sx={{ fontWeight: 600, fontSize: '16px', mr: 1 }}>
                                                            ₹{price}
                                                        </Typography>
                                                        <Rating name="read-only" value={4} readOnly size="small" sx={{ ml: 1 }} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            );
                        })}
                        {/* Shipping Address */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Shipping Address
                            </Typography>
                            {order.shippingAddress ? (
                                <Box sx={{ ml: 1, p: 2, borderRadius: 2, border: '1px solid #eee', bgcolor: '#fcfcfc' }}>
                                    <Typography variant="body2" fontWeight="bold">{order.shippingAddress.name}</Typography>
                                    <Typography variant="body2">{order.shippingAddress.street}</Typography>
                                    <Typography variant="body2">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                    </Typography>
                                    <Typography variant="body2">{order.shippingAddress.country}</Typography>
                                    <Typography variant="body2">Mobile: {order.shippingAddress.mobile}</Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2">No address found.</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Payment Details */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                p: 3,
                                mb: 3,
                                bgcolor: '#fcfcfc'
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Order Payment Details
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order Amount</Typography>
                                <Typography variant="body2">₹{order.totalAmount.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Shipping</Typography>
                                <Typography variant="body2">₹0.00</Typography>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    Total
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color={theme.palette.custom.highlight}>
                                    ₹{order.totalAmount.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                p: 3,
                                mb: 3,
                                bgcolor: '#fcfcfc'
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Payment Method
                            </Typography>
                            <Typography variant="body2">UPI</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Txn Ref: #123456789
                            </Typography>
                        </Box>

                        {/* Support Box */}
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: theme.palette.custom.highlight,
                                borderRadius: 2,
                                p: 3,
                                bgcolor: `${theme.palette.custom.highlight}10`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Need Help?
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                                If you have any questions about your order, our customer support team is here to help.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    bgcolor: theme.palette.custom.highlight,
                                    '&:hover': {
                                        bgcolor: theme.palette.custom.highlight,
                                        opacity: 0.9
                                    }
                                }}
                            >
                                Contact Support
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default OrderDetailsPage;

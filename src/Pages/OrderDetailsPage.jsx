// Extracted from the first component and adapted into the second dynamic version

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  Rating,
  Divider,
  Paper,
  Button,
  Avatar,
  Skeleton,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Stack
} from '@mui/material';
import {
  ArrowBack,
  LocalShipping,
  Payment,
  Phone,
  Home,
  HelpOutline,
  CreditCard
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../store/orderSlice';
import OrderStatusTracker from '../Components/OrderStatusTracker';
import { styled } from '@mui/material/styles';
import { getImageUrl } from '../actions/getImage';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)'
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colorMap = {
    Delivered: ['#e8f5e8', '#2e7d32'],
    Processing: ['#fff3e0', '#f57c00'],
    Shipped: ['#e3f2fd', '#1976d2'],
    Cancelled: ['#ffebee', '#d32f2f'],
    default: ['#f5f5f5', '#666']
  };
  const [bg, text] = colorMap[status] || colorMap.default;
  return {
    backgroundColor: bg,
    color: text,
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: '8px 16px',
    borderRadius: 20,
    border: `2px solid ${text}20`
  };
});

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
}));

const OrderDetailsStyled = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, status } = useSelector((s) => s.order);
  const userId = useSelector((s) => s.auth.userData?.userId);
  const theme = useTheme();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (userId) dispatch(fetchOrders(userId));
  }, [userId]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      const found = orders.find((o) => o._id === orderId);
      setOrder(found || null);
    }
  }, [orders]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (status === 'loading') {
    return (
      <Container sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>No order found for ID: {orderId}</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/profile')}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 20 }}>
      <StyledCard>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Order #{order._id}
              </Typography>
              <Typography color="text.secondary">
                Placed on {formatDate(order.createdAt)}
              </Typography>
            </Box>
            <StatusChip label={order.status} status={order.status} />
          </Box>

          <OrderStatusTracker status={order.status} createdAt={order.createdAt} />
        </CardContent>
      </StyledCard>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          {order.items.map((item, idx) => {
            const p = typeof item.productId === 'object' ? item.productId : {};
            const image = getImageUrl(p.images?.[0] || `${import.meta.env.VITE_API_URL}/placeholder/200/200`);
            return (
              <ProductCard key={idx} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <CardMedia component="img" image={image} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontWeight="bold">{p.name}</Typography>
                      <Typography variant="body2">Qty: {item.quantity}</Typography>
                      <Rating value={4} size="small" readOnly />
                    </Grid>
                    <Grid item xs={3} display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography fontWeight="bold">₹{item.price.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </ProductCard>
            );
          })}
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Payment />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Payment Summary
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography>Subtotal</Typography>
                <Typography>₹{order.totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Tax</Typography>
                <Typography>₹0.00</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" fontWeight="bold">
                <Typography>Total</Typography>
                <Typography color="primary">₹{order.totalAmount.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailsStyled;

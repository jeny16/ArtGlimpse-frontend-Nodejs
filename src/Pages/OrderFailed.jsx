import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useParams } from 'react-router-dom';
import orderService from '../actions/orderService';

const OrderFailed = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        console.log("data in failed order", data);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleRetry = () => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ textAlign: 'center', mt: 20 }}>
        <Typography variant="h6" color="error">
          {error || 'Order not found.'}
        </Typography>
        <Button onClick={() => navigate('/cart')} sx={{ mt: 2 }} variant="outlined">
          Back to Cart
        </Button>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 480,
        mx: 'auto',
        mt: 30,
        mb: 20,
        textAlign: 'center',
        borderRadius: 3,
      }}
    >
      <Avatar
        sx={{
          bgcolor: 'error.main',
          width: 60,
          height: 60,
          mb: 2,
          mx: 'auto',
        }}
      >
        <ErrorOutlineIcon fontSize="large" sx={{ color: '#fff' }} />
      </Avatar>

      <Typography
        variant="h5"
        fontWeight={700}
        color="error.main"
        gutterBottom
      >
        Payment Failed
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        We're sorry, there was an issue processing your payment.
        Please try again or use a different payment method.
      </Typography>

      <Typography variant="body2" fontWeight={600} mb={3}>
        Order ID:{' '}
        <span style={{ fontFamily: 'monospace' }}>{orderId}</span>
      </Typography>
      {/* <Typography variant="body2" fontWeight={600} mb={3}>
        Txn:{' '}
        <span style={{ fontFamily: 'monospace' }}>
          {order.paymentInfo?.razorpayPaymentId || 'N/A'}
        </span>
      </Typography> */}

      <Stack justifyContent="center">
        <Button
          variant="contained"
          color="error"
          onClick={handleRetry}
          sx={{ px: 4, py: 1.5, fontWeight: 600 }}
        >
          Try Again
        </Button>
      </Stack>
    </Paper>
  );
};

export default OrderFailed;

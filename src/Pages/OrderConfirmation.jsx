import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import orderService from "../actions/orderService"; // adjust path if needed

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleGoToOrders = () => {
    navigate("/profile/orders");
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  if (loading) {
    return (
      <Box sx={{ mt: 20, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ mt: 20, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error || "Order not found."}
        </Typography>
        <Button onClick={() => navigate("/shop")} sx={{ mt: 2 }} variant="outlined">
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 8,
        mb: 8,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 480,
          mx: "auto",
          mt: 12,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "success.main",
            width: 60,
            height: 60,
            mb: 2,
            mx: "auto",
          }}
        >
          <CheckCircle fontSize="large" sx={{ color: "#fff" }} />
        </Avatar>
        <Typography
          variant="h5"
          fontWeight={700}
          color="success.main"
          gutterBottom
        >
          Order Placed Successfully!
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Thank you for your purchase. Your order has been confirmed and will be
          shipped soon.
        </Typography>

        <Typography variant="body2" fontWeight={600}>
          Order ID:{" "}
          <span style={{ fontFamily: "monospace" }}>{order._id}</span>
        </Typography>
        <Typography variant="body2" fontWeight={600} mb={3}>
          Transaction:{" "}
          <span style={{ fontFamily: "monospace" }}>
            {order?.paymentInfo?.razorpayPaymentId || "N/A"}
          </span>
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Link to={`/orders/${orderId}`}>
            <Button variant="contained" color="success">
              View Order
            </Button>
          </Link>
          <Link to="/">
          <Button variant="contained" onClick={handleContinueShopping}>
            Back to Home
          </Button>
          </Link>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;

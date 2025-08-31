// src/Pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Grid, Box, Typography, RadioGroup, FormControlLabel, Radio, Paper } from "@mui/material";
import {
  PriceDetails,
  AddressSelection,
  CartReview,
  StepperNav,
  Loader,
  ErrorState,
  EmptyState,
  CommonButton,
} from "../Components";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, updateOrderPayment } from "../store/orderSlice";
import { clearCartOnServer, fetchCart } from "../store/cartSlice";
import { fetchProducts } from "../store/productSlice";
import { fetchProfile } from "../store/profileSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import conf from "../conf";
import { fetchRazorpayOrder, verifyRazorpayPayment } from '../store/paymentSlice';

const computeCartTotal = (cart) => {
  let totalMRP = 0;
  let totalDiscount = 0;
  let shippingCost = 0;

  if (!cart?.items) return 0;

  cart.items.forEach((item) => {
    const prod = typeof item.productId === "object"
      ? item.productId
      : {};

    const price = Number(prod.price) || 0;
    const qty   = Number(item.quantity) || 0;
    totalMRP += price * qty;

    const discPct = Number(prod.percentage_Discount) || 0;
    totalDiscount += (price * discPct * qty) / 100;

    const ship = Number(prod.shipping_Cost) || 0;
    shippingCost += ship * qty;  
  });

  const couponDisc = cart.couponCode === "NEWUSER"
    ? totalMRP * 0.1
    : 0;
  const donation = Number(cart.donationAmount) || 0;

  return totalMRP
    - totalDiscount
    - couponDisc
    + shippingCost
    + donation;
};

// Payment Method Selection Component
const PaymentMethodSelection = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Online Payment',
      description: 'Pay securely using Credit/Debit Card, Net Banking, UPI, Wallets',
      icon: <PaymentIcon sx={{ fontSize: 32 }} />,
      enabled: true,
      color: '#3f51b5',
      bgColor: '#e8eaf6',
      features: ['Instant Payment', 'Secure Transaction', 'Multiple Options']
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <LocalShippingIcon sx={{ fontSize: 32 }} />,
      enabled: true,
      color: '#ff9800',
      bgColor: '#fff3e0',
      features: ['No Online Payment', 'Pay at Doorstep', 'Convenient']
    }
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          mb: 3,
          color: '#333'
        }}
      >
        Choose Payment Method
      </Typography>
      
      <RadioGroup
        value={selectedPaymentMethod}
        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
        sx={{ gap: 2 }}
      >
        {paymentMethods.map((method) => (
          <Paper 
            key={method.id} 
            elevation={selectedPaymentMethod === method.id ? 4 : 1}
            sx={{ 
              p: 3,
              border: selectedPaymentMethod === method.id 
                ? `2px solid ${method.color}` 
                : '1px solid #e0e0e0',
              borderRadius: 2,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderColor: method.color
              },
              backgroundColor: selectedPaymentMethod === method.id 
                ? method.bgColor 
                : '#fff'
            }}
            onClick={() => method.enabled && setSelectedPaymentMethod(method.id)}
          >
            <FormControlLabel
              value={method.id}
              control={
                <Radio 
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: method.color,
                    '&.Mui-checked': {
                      color: method.color
                    }
                  }}
                />
              }
              disabled={!method.enabled}
              label={
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, pr: 5 }}>
                  <Box
                    sx={{
                      backgroundColor: method.bgColor,
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: method.color,
                      minWidth: 56,
                      height: 56
                    }}
                  >
                    {method.icon}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="600"
                      sx={{ 
                        color: '#333',
                        mb: 0.5
                      }}
                    >
                      {method.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ mb: 2, lineHeight: 1.5 }}
                    >
                      {method.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {method.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            backgroundColor: selectedPaymentMethod === method.id 
                              ? method.color 
                              : '#f5f5f5',
                            color: selectedPaymentMethod === method.id 
                              ? '#fff' 
                              : '#666',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {feature}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              }
              sx={{ margin: 0, width: '100%' }}
            />
            
            {selectedPaymentMethod === method.id && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 4,
                  backgroundColor: method.color,
                  borderRadius: '8px 8px 0 0'
                }}
              />
            )}
          </Paper>
        ))}
      </RadioGroup>
      
      <Box 
        sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}
      >
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          💡 <strong>Payment Security:</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          All online payments are processed through secure, encrypted channels. 
          Your payment information is never stored on our servers.
        </Typography>
      </Box>
    </Box>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, status, error } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.product);
  const profile = useSelector((state) => state.profile.profile);
  const { userData } = useSelector((state) => state.auth);
  const userId = userData?.userId || userData?._id;

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');

  // Load product catalog
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Load cart for this user
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Load profile for this user
  useEffect(() => {
    if (userId && !profile) {
      dispatch(fetchProfile({ userId }));
    }
  }, [dispatch, userId, profile]);

  // Handle COD Order Creation
  const handleCODOrder = async () => {
    try {
      const orderPayload = {
        userId: profile._id || profile.id,
        items: cart.items.map(item => ({
          productId: String(item.productId._id || item.productId),
          quantity: item.quantity,
          productData: item.productId,
          price:
            products.find(p => p._id === item.productId)?.price ||
            item.productData?.price ||
            0,
        })),
        totalAmount: computeCartTotal(cart),
        shippingAddress: selectedAddress,
        paymentInfo: {
          method: 'cashOnDelivery',
          status: 'Pending'
        },
        orderStatus: 'confirmed',
         paymentType: 'cashOnDelivery',
       paymentStatus: 'Pending'
      };

      const createdOrder = await dispatch(createOrder(orderPayload)).unwrap();
      
      // Clear cart after successful order creation
      await dispatch(clearCartOnServer(userId)).unwrap();
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderId}`, { 
        state: { 
          orderId: createdOrder.order._id,
          paymentMethod: 'COD' 
        } 
      });
      
      toast.success("Order placed successfully! Pay when you receive your order.");
    } catch (err) {
      console.error("Could not create COD order:", err);
      toast.error("Could not place order: " + (err.message || err));
    }
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    try {
      const orderPayload = {
        userId: profile._id || profile.id,
        items: cart.items.map(item => ({
          productId: String(item.productId._id || item.productId),
          quantity: item.quantity,
          productData: item.productId,
          price:
            products.find(p => p._id === item.productId)?.price ||
            item.productData?.price ||
            0,
        })),
        totalAmount: computeCartTotal(cart),
        shippingAddress: selectedAddress,
        paymentInfo: {
          method: 'razorpay',
          status: 'Pending'
        },
         paymentType: 'razorpay',
       paymentStatus: 'Pending'
      };

      const createdOrder = await dispatch(createOrder(orderPayload)).unwrap();
      const internalOrderId = createdOrder.order._id;
      
      const amount = orderPayload.totalAmount;
      const razorpayRes = await dispatch(fetchRazorpayOrder({ orderId: internalOrderId, amount })).unwrap();
      
      const { key, order: razorpayOrder } = razorpayRes || {};
      if (!key || !razorpayOrder) {
        throw new Error("Invalid Razorpay response: key or order missing");
      }

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Verify signature on server
            await dispatch(verifyRazorpayPayment(response)).unwrap();

            // Update order with payment info
            await dispatch(updateOrderPayment({
           orderId: internalOrderId,
           // align with your updated schema
           paymentType: 'razorpay',
           paymentStatus: 'Paid',
           paymentInfo: { razorpayPaymentId: response.razorpay_payment_id },
           paidAt: new Date().toISOString()
         }));

            // Clear cart and navigate
            await dispatch(clearCartOnServer(userId)).unwrap();
            navigate(`/order-confirmation/${internalOrderId}`, {
              state: {
                orderId: internalOrderId,
                paymentMethod: 'razorpay'
              }
            });
          } catch (verifyErr) {
            console.error("Payment verification failed:", verifyErr);
            navigate(`/order-failed/${internalOrderId}`);
          }
        },
        modal: { 
          ondismiss: () => {
            toast.error("Payment was cancelled");
            navigate(`/order-failed/${internalOrderId}`);
          }
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: profile?.phone || ''
        }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Could not initiate Razorpay payment:", err);
      toast.error("Could not initiate payment: " + (err.message || err));
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      return setActiveStep(1);
    }

    if (activeStep === 1) {
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }
      return setActiveStep(2);
    }

    if (activeStep === 2) {
      if (!selectedPaymentMethod) {
        toast.error("Please select a payment method");
        return;
      }
      return setActiveStep(3);
    }

    // activeStep === 3: Final confirmation
    if (selectedPaymentMethod === 'cod') {
      await handleCODOrder();
    } else if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getNextLabel = () => {
    switch (activeStep) {
      case 0: return "Place Order";
      case 1: return "Continue";
      case 2: return "Continue";
      case 3: return selectedPaymentMethod === 'cod' ? "Confirm Order" : "Pay Now";
      default: return "Continue";
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "failed") {
    return (
      <ErrorState
        onRetry={() => dispatch(fetchCart(userId))}
        description={error}
      />
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven't added anything to your cart yet. Start shopping now and easily check out when you're ready."
        buttonText="SHOP NOW"
        redirectTo="/"
        IconComponent={ShoppingCartOutlinedIcon}
      />
    );
  }

  const totalPrice = computeCartTotal(cart, products);

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 20 }}>
      <StepperNav activeStep={activeStep} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {activeStep === 0 && <CartReview />}
          
          {activeStep === 1 && (
            <AddressSelection
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          )}
          
          {activeStep === 2 && (
            <PaymentMethodSelection
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          )}
          
          {activeStep === 3 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Total Amount: ₹{totalPrice.toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Payment Method: {selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedPaymentMethod === 'cod' 
                    ? 'You will pay when your order is delivered.' 
                    : 'Click "Pay Now" to complete your payment through Razorpay.'}
                </Typography>
              </Paper>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <PriceDetails />
          <Box
            sx={{
              mt: 3,
              gap: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {activeStep > 0 && (
              <CommonButton
                btnText="Back"
                onClick={handleBack}
                sx={{
                  bgcolor: "transparent",
                  color: (theme) => theme.palette.custom.highlight,
                  border: (theme) =>
                    `1px solid ${theme.palette.custom.highlight}`,
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.custom.accent,
                    color: "#fff",
                  },
                }}
              />
            )}
            <CommonButton
              btnText={getNextLabel()}
              onClick={handleNext}
              fullWidth
              sx={{
                bgcolor: (theme) => theme.palette.custom.highlight,
                color: "#fff",
                "&:hover": {
                  bgcolor: (theme) => theme.palette.custom.accent,
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
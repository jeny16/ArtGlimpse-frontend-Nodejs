// src/Pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/orderSlice";
import {
  clearCartServer, // <-- updated import
  fetchCart
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../store/profileSlice";
import { toast } from "react-toastify";
import conf from "../conf";

// Helper to compute total payable (in rupees)
const computeCartTotal = (cart) => {
  let totalMRP = 0;
  let totalDiscount = 0;
  let shippingCost = 0;
  if (!cart || !cart.items) return 0;

  cart.items.forEach((item) => {
    // item.productData.price is the product’s price from your populated payload
    const price = Number(item.productData?.price) || 0;
    const quantity = Number(item.quantity) || 0;
    totalMRP += price * quantity;

    // If you stored a percentage_Discount in item.productData, use it:
    const discount = Number(item.productData?.percentage_Discount) || 0;
    if (discount) {
      totalDiscount += (price * discount * quantity) / 100;
    }
    const shipping = Number(item.productData?.shipping_Cost) || 0;
    shippingCost = Math.max(shippingCost, shipping);
  });

  let couponDiscount = 0;
  if (cart.couponCode === "NEWUSER") couponDiscount = totalMRP * 0.1;
  const donation = Number(cart.donationAmount) || 0;

  return totalMRP - totalDiscount - couponDiscount + shippingCost + donation;
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, status, error } = useSelector((state) => state.cart);
  const profile = useSelector((state) => state.profile.profile);
  const { userData } = useSelector((state) => state.auth);
  const userId = userData?.userId || userData?._id;

  // Checkout steps:
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // 1) Fetch cart on mount (when userId is known)
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // 2) Fetch profile for address list
  useEffect(() => {
    if (userId && !profile) {
      dispatch(fetchProfile({ userId }));
    }
  }, [dispatch, userId, profile]);

  // 3) Razorpay checkout logic (unchanged except for the “clear cart” part)
  const openRazorpayCheckout = async () => {
    const amountInPaise = computeCartTotal(cart) * 100;
    const options = {
      key: conf.razorpayKey,
      amount: amountInPaise,
      currency: "INR",
      name: "Your Shop Name",
      description: "Order Payment",
      handler: async function (response) {
        const razorpayPaymentId = response.razorpay_payment_id;

        // Build orderData exactly as your backend expects:
        const orderData = {
          userId: profile._id || profile.id,
          items: cart.items.map((item) => ({
            productId: String(item.productId._id || item.productId),
            quantity: item.quantity,
            price: item.productData?.price
          })),
          totalAmount: computeCartTotal(cart),
          shippingAddress: selectedAddress,
          paymentInfo: { razorpayPaymentId }
        };

        try {
          // 3a) Create order on back end
          await dispatch(createOrder(orderData)).unwrap();

          // 3b) Clear cart on the server and in Redux
          await dispatch(clearCartServer(userId)).unwrap();
          // Now state.cart.items === []

          // 3c) (Optional) Refetch from back end if you want to double‐check
          // await dispatch(fetchCart(userId)).unwrap();

          // 3d) Navigate to confirmation page
          navigate("/order-confirmation");
        } catch (err) {
          toast.error(
            "Order creation or cart clear failed: " +
              (err.message || JSON.stringify(err))
          );
        }
      },
      prefill: {
        name: profile.name || "",
        email: userData.email || "",
        contact: profile.phone || ""
      },
      notes: {
        address: selectedAddress
      },
      theme: {
        color: "#F37254"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      toast.error(
        "Payment failed: " +
          (response.error.description || response.error.reason)
      );
    });
    rzp.open();
  };

  // 4) Stepper logic
  const handleNext = async () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      try {
        await openRazorpayCheckout();
      } catch (err) {
        toast.error("Could not initiate payment: " + (err.message || err));
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const nextLabel =
    activeStep === 0
      ? "Place Order"
      : activeStep === 1
      ? "Continue"
      : "Confirm Payment";

  // ──────────────────────────────────────────────────────────────────────────
  // Rendering logic (loading / error / empty / normal)
  if (!userId) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" align="center">
          Please login to view your cart.
        </Typography>
      </Container>
    );
  }

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

  // If the cart object doesn’t exist or has zero items:
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven’t added anything to your cart yet. Start shopping now and easily check out when you're ready."
        buttonText="SHOP NOW"
        redirectTo="/"
        IconComponent={ShoppingCartOutlinedIcon}
      />
    );
  }

  const totalPrice = computeCartTotal(cart);

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 20 }}>
      <StepperNav activeStep={activeStep} />
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && <CartReview />}
          {activeStep === 1 && (
            <AddressSelection
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          )}
          {activeStep === 2 && (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Total to pay: ₹{totalPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Click “Confirm Payment” to open Razorpay checkout.
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <PriceDetails />
          <Box
            sx={{
              mt: 3,
              gap: 2,
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            {activeStep > 0 && (
              <CommonButton
                btnText="Back"
                onClick={handleBack}
                sx={{
                  bgcolor: "transparent",
                  color: (theme) => theme.palette.custom.highlight,
                  border: (theme) => `1px solid ${theme.palette.custom.highlight}`,
                  "&:hover": {
                    bgcolor: (theme) => theme.palette.custom.accent,
                    color: "#fff"
                  }
                }}
              />
            )}
            <CommonButton
              btnText={nextLabel}
              onClick={handleNext}
              fullWidth
              sx={{
                bgcolor: (theme) => theme.palette.custom.highlight,
                color: "#fff",
                "&:hover": {
                  bgcolor: (theme) => theme.palette.custom.accent
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;

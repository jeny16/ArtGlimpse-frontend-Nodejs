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
import { clearCartOnServer, fetchCart } from "../store/cartSlice";
import { fetchProducts } from "../store/productSlice";
import { fetchProfile } from "../store/profileSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import conf from "../conf";

const computeCartTotal = (cart, products = []) => {
  let totalMRP = 0;
  let totalDiscount = 0;
  let shippingCost = 0;
  if (!cart || !cart.items) return 0;
  // console.log("Cart And Products", cart, products);
  cart.items.forEach((item) => {
    const product =
      products.find(
        (prod) => prod._id === (item.productId._id ?? item.productId)
      ) ||
      item.productData ||
      {};

    const price = Number(product.price) || 0;
    const quantity = Number(item.quantity) || 0;
    totalMRP += price * quantity;

    const discount = Number(product.percentage_Discount) || 0;
    if (discount) {
      totalDiscount += (price * discount * quantity) / 100;
    }

    const shipping = Number(product.shipping_Cost) || 0;
    shippingCost = Math.max(shippingCost, shipping);
  });

  let couponDiscount = 0;
  if (cart.couponCode === "NEWUSER") couponDiscount = totalMRP * 0.1;
  const donation = Number(cart.donationAmount) || 0;
  // console.log("price::", totalMRP - totalDiscount - couponDiscount + shippingCost + donation);
  return totalMRP - totalDiscount - couponDiscount + shippingCost + donation;
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

  // 1️⃣ Load product catalog
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 2️⃣ Load cart for this user
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // 3️⃣ Load profile for this user
  useEffect(() => {
    if (userId && !profile) {
      dispatch(fetchProfile({ userId }));
    }
  }, [dispatch, userId, profile]);

  const openRazorpayCheckout = async () => {
    if (!userId) {
      toast.error("Please login to proceed with payment.");
      navigate("/login");
      return;
    }

    const amountInPaise = computeCartTotal(cart, products) * 100;
    const options = {
      key: conf.razorpayKey,
      amount: amountInPaise,
      currency: "INR",
      name: "Jeny Seller",
      description: "Order Payment",
      handler: async function (response) {
        const razorpayPaymentId = response.razorpay_payment_id;

        const orderData = {
          userId: profile._id || profile.id,
          items: cart.items.map((item) => ({
            productId: String(item.productId._id || item.productId),
            quantity: item.quantity,
            productData: item.productId,
            price:
              products.find((p) => p._id === item.productId)?.price ||
              item.productData?.price ||
              0,
          })),
          totalAmount: computeCartTotal(cart, products),
          shippingAddress: selectedAddress,
          paymentInfo: { razorpayPaymentId },
        };

        try {
          await dispatch(createOrder(orderData)).unwrap();
          await dispatch(clearCartOnServer(userId)).unwrap();
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
        contact: profile.phone || "",
      },
      notes: {
        address: selectedAddress,
      },
      theme: {
        color: "#F37254",
      },
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
        description="Looks like you haven’t added anything to your cart yet. Start shopping now and easily check out when you're ready."
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
              btnText={nextLabel}
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

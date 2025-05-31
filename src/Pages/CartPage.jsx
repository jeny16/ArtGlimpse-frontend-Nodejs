import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import {
    PriceDetails,
    CheckoutPayment,
    AddressSelection,
    CartReview,
    StepperNav,
    Loader,
    ErrorState,
    EmptyState,
    CommonButton
} from '../Components';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/orderSlice';
import { clearCart, fetchCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../store/profileSlice';
import { toast } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import conf from '../conf';

const stripePromise = loadStripe(conf.stripePublishableKey);

const computeCartTotal = (cart) => {
    let totalMRP = 0;
    let totalDiscount = 0;
    let shippingCost = 0;
    if (!cart || !cart.items) return 0;

    cart.items.forEach((item) => {
        const price = Number(item.productId.price) || 0;
        const quantity = Number(item.quantity) || 0;
        totalMRP += price * quantity;
        const discount = Number(item.productId.percentage_Discount) || 0;
        if (discount) {
            totalDiscount += (price * discount * quantity) / 100;
        }
        const shipping = Number(item.productId.shipping_Cost) || 0;
        shippingCost = Math.max(shippingCost, shipping);
    });

    let couponDiscount = 0;
    if (cart.couponCode === 'NEWUSER') couponDiscount = totalMRP * 0.1;
    const donation = Number(cart.donationAmount) || 0;
    const totalPayable = totalMRP - totalDiscount - couponDiscount + shippingCost + donation;
    return totalPayable;
};

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart, status, error } = useSelector((state) => state.cart);
    const profile = useSelector((state) => state.profile.profile);
    const { userData } = useSelector((state) => state.auth);
    const userId = userData?.userId || userData?._id;

    // Checkout steps
    const [activeStep, setActiveStep] = useState(0);
    // Selected address for shipping
    const [selectedAddress, setSelectedAddress] = useState(null);
    const steps = ['Bag', 'Address', 'Payment'];
    const paymentRef = useRef();

    useEffect(() => {
        if (userId) {
            dispatch(fetchCart(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (userId && !profile) {
            dispatch(fetchProfile({ userId }));
        }
    }, [dispatch, userId, profile]);

    const handleNext = async () => {
        if (activeStep === 0) {
            setActiveStep(1);
        } else if (activeStep === 1) {
            if (!selectedAddress) {
                toast.error('Please select an address');
                return;
            }
            setActiveStep(2);
        } else if (activeStep === 2) {
            try {
                await paymentRef.current.confirmPayment();
                const orderData = {
                    userId: profile.id,
                    cart: cart,
                    shippingAddress: selectedAddress,
                };
                await dispatch(createOrder(orderData)).unwrap();
                dispatch(clearCart());
                navigate('/order-confirmation');
            } catch (err) {
                toast.error('Payment failed: ' + err.message);
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const nextLabel =
        activeStep === 0 ? 'Place Order' : activeStep === 1 ? 'Continue' : 'Confirm Payment';

    if (!userId) {
        return (
            <Container maxWidth="lg" sx={{ py: 2 }}>
                <Typography variant="h5" align="center">
                    Please login to view your cart.
                </Typography>
            </Container>
        );
    }

    if (status === 'loading') {
        return <Loader />;
    }

    if (status === 'failed') {
        return <ErrorState onRetry={() => dispatch(fetchCart(userId))} description={error} />;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
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
                        <Elements stripe={stripePromise}>
                            <CheckoutPayment ref={paymentRef} totalPrice={totalPrice} />
                        </Elements>
                    )}
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4}>
                    <PriceDetails />
                    <Box
                        sx={{
                            mt: 3,
                            gap: 2,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        {activeStep > 0 && (
                            <CommonButton
                                btnText="Back"
                                onClick={handleBack}
                                sx={{
                                    bgcolor: 'transparent',
                                    color: (theme) => theme.palette.custom.highlight,
                                    border: (theme) => `1px solid ${theme.palette.custom.highlight}`,
                                    '&:hover': {
                                        bgcolor: (theme) => theme.palette.custom.accent,
                                        color: '#fff'
                                    }
                                }}
                            />
                        )}
                        <CommonButton
                            btnText={nextLabel}
                            onClick={handleNext}
                            fullWidth={true}
                            sx={{
                                bgcolor: (theme) => theme.palette.custom.highlight,
                                color: '#fff',
                                '&:hover': {
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

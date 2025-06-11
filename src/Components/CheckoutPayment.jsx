import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography, CircularProgress, Grid, Divider, Alert, Paper, Button } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material';
import { FormField } from './index';
import { createRazorpayOrder } from '../actions/paymentService'; 

const CheckoutPayment = forwardRef(({ totalPrice }, ref) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const amount = Math.round(totalPrice * 100); // amount in paise
    console.log("amount at checkout", amount);
    const { register, formState: { errors }, watch } = useForm({
        defaultValues: {
            name: '',
            email: ''
        },
        mode: 'onChange'
    });

    useImperativeHandle(ref, () => ({
        async confirmPayment() {
            setLoading(true);
            setError(null);

            try {
                const name = watch('name');
                const email = watch('email');

                // 1. Call backend to create Razorpay order
                // createRazorpayOrder(amount) resolves to { success: true, order: { id: "...", ... } }
                const { order } = await createRazorpayOrder(amount);
                const orderId = order.id;
                const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

                // 2. Configure Razorpay options
                const options = {
                    key: razorpayKey, // Replace with your Razorpay key_id
                    amount,
                    currency: 'INR',
                    name: 'ArtGlimpse',
                    description: 'Purchase Order',
                    image: '/logo192.png',
                    order_id: orderId,
                    handler: function (response) {
                        // Send response.razorpay_payment_id and order_id to backend for verification
                        console.log("Payment successful!", response);
                    },
                    prefill: {
                        name,
                        email
                    },
                    theme: {
                        color: '#6366f1'
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Payment failed. Try again.");
                setLoading(false);
            }
        }
    }));

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <CreditCardIcon sx={{ color: theme.palette.custom.highlight, mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.custom.highlight }}>
                    Payment Details
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Alert
                icon={<SecurityIcon />}
                severity="info"
                sx={{
                    mb: 3,
                    bgcolor: theme.palette.tints.tint1,
                    border: `1px solid ${theme.palette.custom.highlight}`,
                    '& .MuiAlert-icon': { color: theme.palette.custom.highlight }
                }}
            >
                Your payment information is securely processed via Razorpay.
            </Alert>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <FormField
                        label="Full Name"
                        name="name"
                        register={register}
                        validationRules={{ required: "Name is required" }}
                        error={errors.name}
                        helperText={errors.name?.message}
                        autoComplete="off"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        validationRules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        }}
                        error={errors.email}
                        helperText={errors.email?.message}
                        autoComplete="off"
                    />
                </Grid>
            </Grid>

            {error && <Typography color="error" mt={2}>{error}</Typography>}

            {loading && (
                <Box mt={3} textAlign="center">
                    <CircularProgress />
                </Box>
            )}
        </Paper>
    );
});

export default CheckoutPayment;

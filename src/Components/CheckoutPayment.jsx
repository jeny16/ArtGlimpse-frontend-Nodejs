import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography, CircularProgress, Grid, Divider, Alert, Paper, Stack, Fade } from '@mui/material';
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from '@stripe/react-stripe-js';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import { createPaymentIntent } from '../actions/paymentService';
import { FormField } from './index';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import visaImg from '../../public/assets/visa.svg';
import mastercardImg from '../../public/assets/mastercard.svg';
import amexImg from '../../public/assets/amex.svg';
import discoverImg from '../../public/assets/discover.svg';

const CheckoutPayment = forwardRef(({ totalPrice }, ref) => {
    const amount = Math.round(totalPrice * 100);
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cardBrand, setCardBrand] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const theme = useTheme();

    const { register, formState: { errors }, watch } = useForm({
        defaultValues: {
            cardholderName: '',
            email: ''
        },
        mode: 'onChange'
    });

    const baseCardElementStyle = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: 'Raleway, Arial, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                lineHeight: '1.4375em',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '16.5px 14px',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    const handleCardChange = (event) => {
        if (event.brand && event.brand !== 'unknown') {
            setCardBrand(event.brand);
        }

        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    };

    useImperativeHandle(ref, () => ({
        async confirmPayment() {
            setLoading(true);
            setError(null);

            try {
                const data = await createPaymentIntent(amount, 'inr');
                const clientSecret = data.clientSecret;

                const cardholderName = watch('cardholderName');
                const email = watch('email');

                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: cardholderName,
                            email: email,
                        }
                    }
                });

                setLoading(false);

                if (result.error) {
                    setError(result.error.message);
                    throw new Error(result.error.message);
                } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    return result.paymentIntent;
                }
            } catch (err) {
                setLoading(false);
                throw err;
            }
        }
    }));

    const getCardBrandIcon = () => {
        if (!cardBrand) return null;

        const brandIcons = {
            visa: visaImg,
            mastercard: mastercardImg,
            amex: amexImg,
            discover: discoverImg
        };

        return brandIcons[cardBrand.toLowerCase()];
    };

    const getFieldBorderColor = (fieldName) => {
        if (error && error.toLowerCase().includes(fieldName.toLowerCase())) {
            return '#d32f2f';
        }
        if (focusedField === fieldName) {
            return theme.palette.custom.highlight;
        }
        return '#ccc';
    };

    const getFieldBoxShadow = (fieldName) => {
        if (focusedField === fieldName) {
            return `0 0 0 2px ${theme.palette.tints.tint3}`;
        }
        return 'none';
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                transition: 'all 0.3s ease'
            }}
        >
            <Box display="flex" alignItems="center" mb={2}>
                <CreditCardIcon sx={{ color: theme.palette.custom.highlight, mr: 1 }} />
                <Typography variant="h5" sx={{
                    color: theme.palette.custom.highlight,
                    fontWeight: 600
                }}>
                    Payment Details
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box mb={4}>
                <Alert
                    icon={<SecurityIcon />}
                    severity="info"
                    sx={{
                        mb: 3,
                        bgcolor: theme.palette.tints.tint1,
                        border: `1px solid ${theme.palette.custom.highlight}`,
                        '& .MuiAlert-icon': {
                            color: theme.palette.custom.highlight
                        },
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    Your payment information is securely processed. We don't store your card details.
                </Alert>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                            Billing Information
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Cardholder Name"
                            name="cardholderName"
                            placeholder=""
                            register={register}
                            validationRules={{ required: "Name is required" }}
                            error={errors.cardholderName}
                            helperText={errors.cardholderName?.message}
                            autoComplete="off"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Email for Receipt"
                            name="email"
                            type="email"
                            placeholder=""
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

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 1, mt: 1, fontWeight: 500 }}>
                            Card Information
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box
                            sx={{
                                mb: 2,
                                border: `1px solid ${getFieldBorderColor('card number')}`,
                                borderRadius: '4px',
                                position: 'relative',
                                boxShadow: getFieldBoxShadow('card number'),
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: theme.palette.custom.highlight,
                                },
                                // Match MUI TextField height
                                height: '56px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="caption" sx={{
                                position: 'absolute',
                                top: '-10px',
                                left: '10px',
                                bgcolor: 'white',
                                px: 1,
                                color: focusedField === 'card number' ? theme.palette.custom.highlight : 'inherit',
                                transition: 'color 0.2s ease'
                            }}>
                                Card Number
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <CardNumberElement
                                        options={baseCardElementStyle}
                                        onChange={handleCardChange}
                                        onFocus={() => setFocusedField('card number')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </Box>
                                <Fade in={!!cardBrand}>
                                    <Box sx={{ ml: 2, width: '40px', height: '25px' }}>
                                        {cardBrand && (
                                            <img
                                                src={getCardBrandIcon()}
                                                alt={cardBrand}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        )}
                                    </Box>
                                </Fade>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                border: `1px solid ${getFieldBorderColor('expiration')}`,
                                borderRadius: '4px',
                                position: 'relative',
                                boxShadow: getFieldBoxShadow('expiration'),
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: theme.palette.custom.highlight,
                                },
                                // Match MUI TextField height
                                height: '56px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="caption" sx={{
                                position: 'absolute',
                                top: '-10px',
                                left: '10px',
                                bgcolor: 'white',
                                px: 1,
                                color: focusedField === 'expiration' ? theme.palette.custom.highlight : 'inherit',
                                transition: 'color 0.2s ease'
                            }}>
                                Expiration Date
                            </Typography>
                            <Box sx={{ width: '100%', px: 2 }}>
                                <CardExpiryElement
                                    options={baseCardElementStyle}
                                    onChange={handleCardChange}
                                    onFocus={() => setFocusedField('expiration')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                border: `1px solid ${getFieldBorderColor('cvc')}`,
                                borderRadius: '4px',
                                position: 'relative',
                                boxShadow: getFieldBoxShadow('cvc'),
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: theme.palette.custom.highlight,
                                },
                                height: '56px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Typography variant="caption" sx={{
                                position: 'absolute',
                                top: '-10px',
                                left: '10px',
                                bgcolor: 'white',
                                px: 1,
                                color: focusedField === 'cvc' ? theme.palette.custom.highlight : 'inherit',
                                transition: 'color 0.2s ease'
                            }}>
                                Security Code (CVV/CVC)
                            </Typography>
                            <Box sx={{ width: '100%', px: 2 }}>
                                <CardCvcElement
                                    options={baseCardElementStyle}
                                    onChange={handleCardChange}
                                    onFocus={() => setFocusedField('cvc')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    '& img': {
                                        filter: 'grayscale(0.5)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            filter: 'grayscale(0)',
                                            transform: 'scale(1.05)'
                                        }
                                    }
                                }}
                            >
                                <img src={visaImg} alt="Visa" style={{ height: '24px' }} />
                                <img src={mastercardImg} alt="Mastercard" style={{ height: '24px' }} />
                                <img src={amexImg} alt="American Express" style={{ height: '24px' }} />
                                <img src={discoverImg} alt="Discover" style={{ height: '24px' }} />
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress size={24} sx={{ color: theme.palette.custom.highlight }} />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{
                    mt: 2,
                    animation: 'pulse 1s',
                    '@keyframes pulse': {
                        '0%': { opacity: 0, transform: 'translateY(-10px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                }}>
                    {error}
                </Alert>
            )}

            <Box
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.shades.dark }} />
                <Typography variant="caption" color="text.secondary">
                    Your transaction is secured with SSL encryption
                </Typography>
            </Box>
        </Paper>
    );
});

export default CheckoutPayment;
import React, { memo } from 'react';
import { Container, Box, Typography, Button, Divider, Link, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormField } from './index';
import LoginImg from '/assets/WhatsApp Image 2025-01-14 at 12.19.10 AM.jpeg';
import { useNavigate } from 'react-router-dom';
import authService from '../actions/authService';
import { useDispatch } from 'react-redux';
import { login as loginUser } from '../store/authSlice';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const theme = useTheme();
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async (data) => {
        try {
            setError(null);
            console.log("data", data);
            const userData = await authService.login(data.email, data.password);
            dispatch(loginUser(userData));
            navigate('/');
        } catch (err) {
            console.error("Login failed", err);
            setError(err.message || 'Login failed. Please try again.');
        }
    };


    const fieldStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-error': {
                '& fieldset': {
                    borderColor: 'red',
                }
            }
        },
        '& .MuiFormHelperText-root.Mui-error': {
            color: 'red',
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '100px',
                paddingBottom: '64px',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Container
                maxWidth="lg"
                disableGutters
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    boxShadow: { md: 10 },
                    backgroundColor: 'white',
                    minHeight: { xs: '70vh', sm: '85vh' },
                    width: { xs: '95%', sm: '80%', md: '75%' },
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `url(${LoginImg})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '50%',
                    }}
                />
                <Box
                    sx={{
                        flex: 1,
                        paddingInline: { xs: 5, sm: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        align="center"
                        sx={{
                            marginBottom: 2,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                            color: theme.palette.custom.highlight,
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            marginBottom: 4,
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Please log in to your account to continue.
                    </Typography>
                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit(login)}
                        sx={{ width: '100%', maxWidth: 400 }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <FormField
                                name="email"
                                label="Email"
                                placeholder="Enter Your Email"
                                type="email"
                                register={register}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                autoComplete="username"
                                sx={fieldStyle}
                                validationRules={{
                                    required: 'Email address is required!',
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: 'Please enter a valid email address'
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <FormField
                                name="password"
                                label="Password"
                                placeholder="Enter Your Password"
                                type="password"
                                register={register}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                autoComplete="current-password"
                                sx={fieldStyle}
                                validationRules={{
                                    required: 'Password is required!',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long'
                                    }
                                }}
                            />
                        </Box>
                        {error && (
                            <Typography
                                color="error"
                                sx={{
                                    mb: 2,
                                    textAlign: 'center',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                bgcolor: theme.palette.custom.highlight,
                                color: '#fff',
                                '&:hover': { bgcolor: theme.palette.custom.accent },
                            }}
                        >
                            Log in
                        </Button>
                    </Box>
                    <Divider sx={{ mt: 4, mb: 4, width: '100%', maxWidth: 400 }}>
                        <Typography color="textSecondary">OR</Typography>
                    </Divider>
                    <Typography align="center" variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                        Don&apos;t have an account?&nbsp;
                        <Link
                            href="/signup"
                            sx={{
                                fontWeight: 'medium',
                                color: theme.palette.custom.highlight,
                            }}
                        >
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default memo(Login);
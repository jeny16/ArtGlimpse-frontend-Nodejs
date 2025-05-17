import React, { memo } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Divider,
    Link,
    useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import SignupImg from '/assets/WhatsApp Image 2025-01-14 at 12.19.10 AM.jpeg';
import { FormField } from './index';
import { useNavigate } from 'react-router-dom';
import authService from '../actions/authService';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

function Signup() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const theme = useTheme();
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const password = React.useRef({});
    password.current = watch("password", "");

    const signup = async (data) => {
        try {
          setError(null);
          const userData = await authService.signup(data.username, data.email, data.password);
          dispatch(login(userData));
          navigate('/');
        } catch (err) {
          console.error("Signup failed", err);
          setError(err.message || 'Registration failed. Please try again.');
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
                        backgroundImage: `url(${SignupImg})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <Box
                    sx={{
                        flex: 1,
                        paddingInline: { xs: 5, sm: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginY: { xs: 7, md: 10 }
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
                        Create an Account
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
                        Please fill in the details to sign up.
                    </Typography>
                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit(signup)}
                        sx={{ width: '100%', maxWidth: 400 }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <FormField
                                name="username"
                                label="Full Name"
                                placeholder="Enter Your Full Name"
                                autoComplete="name"
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                register={register}
                                sx={fieldStyle}
                                validationRules={{
                                    required: 'Full Name is required!',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters long'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z\s]*$/,
                                        message: 'Name can only contain letters and spaces'
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <FormField
                                name="email"
                                label="Email"
                                placeholder="Enter Your Email"
                                type="email"
                                autoComplete="username"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                register={register}
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
                                autoComplete="new-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                register={register}
                                sx={fieldStyle}
                                validationRules={{
                                    required: 'Password is required!',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long'
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <FormField
                                name="confirmPassword"
                                label="Confirm Password"
                                autoComplete="new-password"
                                placeholder="Confirm Your Password"
                                type="password"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                register={register}
                                sx={fieldStyle}
                                validationRules={{
                                    required: 'Please confirm your password!',
                                    validate: value =>
                                        value === password.current || "Passwords do not match"
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
                            Sign Up
                        </Button>
                    </Box>

                    <Divider sx={{ mt: 4, mb: 4, width: '100%', maxWidth: 400 }}>
                        <Typography color="textSecondary">OR</Typography>
                    </Divider>

                    <Typography
                        align="center"
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 2 }}
                    >
                        Already have an account?&nbsp;
                        <Link
                            href="/login"
                            sx={{
                                fontWeight: 'medium',
                                color: theme.palette.custom.highlight,
                            }}
                        >
                            Log In
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default memo(Signup);
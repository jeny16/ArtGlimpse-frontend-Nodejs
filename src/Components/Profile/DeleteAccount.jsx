import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Checkbox,
    FormControlLabel,
    Divider,
    Alert,
    Stack
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUserAccount } from '../../store/profileSlice';

const DeleteAccount = () => {
    const [checked, setChecked] = useState(false);
    const auth = useSelector((state) => state.auth);
    const userId = auth?.userData?.userId || auth?.userData?._id;
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (!userId) {
            alert('You must be logged in to delete your account.');
            return;
        }
        try {
            await dispatch(deleteUserAccount({ userId })).unwrap();
            localStorage.removeItem('user');
            window.location.href = '/';
        } catch (error) {
            console.error('Delete error:', error);
            alert(error || 'Failed to delete account');
        }
    };

    const handleKeepAccount = () => {
        window.history.back();
    };

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                backgroundColor: 'tints.tint3',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Header - Styled like the Saved Addresses component */}
            <Box
                sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundImage: 'linear-gradient(to right, #fdf7ed, #fefaf4)',
                    borderBottom: '1px solid',
                    borderColor: 'shades.light',
                }}
            >
                <Typography variant="h5" component="h2" fontWeight="bold" sx={{ color: 'custom.highlight' }}>
                    Delete Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Permanently remove your account and data
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: { xs: 4, md: 6 }, position: 'relative' }}>
                <Alert severity="warning" sx={{
                    mb: 4,
                    backgroundColor: 'rgba(193, 121, 18, 0.1)',
                    color: 'custom.accent',
                    '& .MuiAlert-icon': { color: 'custom.highlight' }
                }}>
                    <Typography variant="body2" fontWeight="500">
                        This action is permanent and cannot be undone. All your data will be permanently removed.
                    </Typography>
                </Alert>

                <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                    <strong>Is this goodbye?</strong> We're sad to see you go. Before you proceed, please understand what happens when you delete your account:
                </Typography>

                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(193, 121, 18, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'custom.highlight',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>1</Box>
                        <Typography variant="body2">
                            You will lose your entire <strong>order history</strong> and any saved credits or coupons.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(193, 121, 18, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'custom.highlight',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>2</Box>
                        <Typography variant="body2">
                            All pending orders, <strong>cart items</strong>, and wishlist products will be removed.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(193, 121, 18, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'custom.highlight',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>3</Box>
                        <Typography variant="body2">
                            You'll need to <strong>re-register</strong> to shop again on ArtGlimpse.
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(193, 121, 18, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'custom.highlight',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>4</Box>
                        <Typography variant="body2">
                            Some data may be retained for <strong>regulatory or fraud prevention</strong> purposes.
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(193, 121, 18, 0.05)',
                    mb: 4
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                sx={{
                                    color: 'custom.highlight',
                                    '&.Mui-checked': { color: 'custom.highlight' }
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                I understand this action is permanent and I want to delete my account
                            </Typography>
                        }
                    />
                </Box>

                <Box sx={{
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleKeepAccount}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            fontWeight: '600',
                            borderRadius: 2,
                            py: 1.5,
                            px: 3,
                            color: 'custom.highlight',
                            borderColor: 'custom.highlight',
                            order: { xs: 2, sm: 1 },
                            '&:hover': {
                                backgroundColor: 'rgba(193, 121, 18, 0.05)',
                                borderColor: 'custom.highlight'
                            }
                        }}
                    >
                        Keep My Account
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleDelete}
                        disabled={!checked}
                        startIcon={<WarningAmberIcon />}
                        sx={{
                            fontWeight: '600',
                            borderRadius: 2,
                            py: 1.5,
                            px: 3,
                            order: { xs: 1, sm: 2 },
                            backgroundColor: 'custom.highlight',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'custom.accent',
                            },
                            '&:disabled': {
                                opacity: 0.5,
                                backgroundColor: 'shades.medium',
                                color: 'white'
                            }
                        }}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default DeleteAccount;
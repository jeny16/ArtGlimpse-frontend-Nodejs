import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Card,
    CardContent,
    Box,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Fade,
    Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Upi = () => {
    // Enhanced static data with more details
    const [upiIds, setUpiIds] = useState([
        {
            id: 1,
            upiId: 'user1@sbi',
            bank: 'State Bank of India',
            isDefault: true,
            lastUsed: '2 days ago'
        },
        {
            id: 2,
            upiId: 'user2@icici',
            bank: 'ICICI Bank',
            isDefault: false,
            lastUsed: '5 days ago'
        },
        {
            id: 3,
            upiId: 'user3@hdfc',
            bank: 'HDFC Bank',
            isDefault: false,
            lastUsed: '1 week ago'
        }
    ]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [upiToDelete, setUpiToDelete] = useState(null);

    const handleDeleteClick = (upi) => {
        setUpiToDelete(upi);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setUpiIds(upiIds.filter(upi => upi.id !== upiToDelete.id));
        setDeleteDialogOpen(false);
    };

    const setAsDefault = (upiId) => {
        setUpiIds(upiIds.map(upi => ({
            ...upi,
            isDefault: upi.id === upiId
        })));
    };

    // Helper function to get bank avatar (simplified for example)
    const getBankAvatar = (bank) => {
        // First letter of bank name
        return bank.charAt(0);
    };

    const getBankColor = (bank) => {
        const colors = {
            'State Bank of India': '#2d8259',
            'ICICI Bank': '#F58220',
            'HDFC Bank': '#004C8F',
            // Default color
            'default': '#928b80'
        };

        return colors[bank] || colors.default;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'shades.light'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: 'neutral.main' }}
                >
                    UPI Payment Methods
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                        borderColor: 'custom.highlight',
                        color: 'custom.highlight',
                        '&:hover': {
                            borderColor: 'custom.accent',
                            backgroundColor: 'tints.tint1'
                        }
                    }}
                >
                    Add New UPI ID
                </Button>
            </Box>

            <Grid container spacing={2}>
                {upiIds.map((upi) => (
                    <Grid item xs={12} sm={6} md={4} key={upi.id}>
                        <Fade in={true} timeout={500}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    position: 'relative',
                                    transition: 'all 0.2s ease-in-out',
                                    border: upi.isDefault ? '2px solid' : '1px solid',
                                    borderColor: upi.isDefault ? 'custom.highlight' : 'shades.light',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: getBankColor(upi.bank),
                                                    width: 36,
                                                    height: 36,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {getBankAvatar(upi.bank)}
                                            </Avatar>
                                            <Box sx={{ ml: 1.5 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {upi.bank}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {upi.isDefault && (
                                            <Chip
                                                size="small"
                                                label="Default"
                                                icon={<StarIcon fontSize="small" />}
                                                sx={{
                                                    bgcolor: 'custom.highlight',
                                                    color: 'white',
                                                    fontWeight: 'medium',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mt: 1.5,
                                            mb: 1.5,
                                            fontWeight: 'bold',
                                            color: 'neutral.main'
                                        }}
                                    >
                                        {upi.upiId}
                                    </Typography>

                                    <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                                        Last used: {upi.lastUsed}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'shades.light' }}>
                                        {!upi.isDefault && (
                                            <Button
                                                size="small"
                                                onClick={() => setAsDefault(upi.id)}
                                                sx={{
                                                    color: 'custom.highlight',
                                                    '&:hover': {
                                                        bgcolor: 'tints.tint1'
                                                    }
                                                }}
                                            >
                                                Set as Default
                                            </Button>
                                        )}
                                        {upi.isDefault && <Box />}
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteClick(upi)}
                                            sx={{
                                                color: 'secondary.main',
                                                '&:hover': {
                                                    color: 'secondary.dark'
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                ))}
            </Grid>

            {upiIds.length === 0 && (
                <Box
                    sx={{
                        mt: 2,
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'shades.medium',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body1" sx={{ color: 'secondary.main' }}>
                        You have no saved UPI IDs.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            mt: 2,
                            bgcolor: 'custom.highlight',
                            '&:hover': {
                                bgcolor: 'custom.accent'
                            }
                        }}
                    >
                        Add Your First UPI ID
                    </Button>
                </Box>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ color: 'neutral.main', fontWeight: 'medium' }}>
                    Remove UPI ID?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to remove the UPI ID
                        {upiToDelete ? ` ${upiToDelete.upiId}` : ''}?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{ color: 'secondary.main' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        sx={{
                            bgcolor: 'custom.highlight',
                            '&:hover': {
                                bgcolor: 'custom.accent'
                            }
                        }}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Upi;

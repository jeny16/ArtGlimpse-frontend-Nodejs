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
    Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const SavedCards = () => {
    // Enhanced static data with more details
    const [cards, setCards] = useState([
        {
            id: 1,
            cardNumber: '**** **** **** 1234',
            expiry: '12/25',
            name: 'John Doe',
            type: 'VISA',
            isDefault: true
        },
        {
            id: 2,
            cardNumber: '**** **** **** 5678',
            expiry: '11/24',
            name: 'John Doe',
            type: 'Mastercard',
            isDefault: false
        },
        {
            id: 3,
            cardNumber: '**** **** **** 9012',
            expiry: '03/26',
            name: 'John Doe',
            type: 'American Express',
            isDefault: false
        }
    ]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);

    const handleDeleteClick = (card) => {
        setCardToDelete(card);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setCards(cards.filter(card => card.id !== cardToDelete.id));
        setDeleteDialogOpen(false);
    };

    const setAsDefault = (cardId) => {
        setCards(cards.map(card => ({
            ...card,
            isDefault: card.id === cardId
        })));
    };

    // Helper function to get card type logo (simplified for example)
    const getCardTypeIcon = (type) => {
        return <CreditCardIcon fontSize="small" />;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'shades.light',
                mb: 4
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ color: 'neutral.main' }}
                >
                    Payment Cards
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
                    Add New Card
                </Button>
            </Box>

            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.id}>
                        <Fade in={true} timeout={500}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    position: 'relative',
                                    transition: 'all 0.2s ease-in-out',
                                    border: card.isDefault ? '2px solid' : '1px solid',
                                    borderColor: card.isDefault ? 'custom.highlight' : 'shades.light',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {getCardTypeIcon(card.type)}
                                            <Typography
                                                variant="body2"
                                                sx={{ ml: 1, fontWeight: 'medium' }}
                                            >
                                                {card.type}
                                            </Typography>
                                        </Box>
                                        {card.isDefault && (
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

                                    <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
                                        {card.cardNumber}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ color: 'neutral.light' }}>
                                            Expires: {card.expiry}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'neutral.light' }}>
                                            {card.name}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'shades.light' }}>
                                        {!card.isDefault && (
                                            <Button
                                                size="small"
                                                onClick={() => setAsDefault(card.id)}
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
                                        {card.isDefault && <Box />}
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteClick(card)}
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

            {cards.length === 0 && (
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
                        You have no saved cards.
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
                        Add Your First Card
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
                    Remove Card?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to remove the card ending with
                        {cardToDelete ? cardToDelete.cardNumber.slice(-4) : ''}?
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

export default SavedCards;
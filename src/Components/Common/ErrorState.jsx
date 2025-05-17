import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { keyframes } from '@mui/system';

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const ErrorState = ({
    title = "Something went wrong",
    description = "An error occurred while fetching data. Please try again later.",
    buttonText = "RETRY",
    onRetry,
    width,
}) => {
    const minHeight = width ? '50vh' : '100vh';
    const displayDescription =
        typeof description === 'object'
            ? description.message || JSON.stringify(description)
            : description;

    return (
        <Box
            sx={{
                p: 6,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                minHeight,
            }}
        >
            <ErrorOutlineIcon
                sx={{
                    fontSize: 52,
                    color: 'error.main',
                    animation: `${bounceAnimation} 2s infinite`,
                }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'error.main' }}>
                {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: '600px' }}>
                {displayDescription}
            </Typography>
            <Button variant="contained" color="error" onClick={onRetry}>
                {buttonText}
            </Button>
        </Box>
    );
};

export default ErrorState;

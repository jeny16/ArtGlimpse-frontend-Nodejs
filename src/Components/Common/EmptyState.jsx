import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { CommonButton } from '../index';

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const EmptyState = ({ title, description, buttonText, redirectTo, IconComponent, width }) => {
    const navigate = useNavigate();
    const minHeight = width ? '50vh' : '100vh';

    const handleClick = () => {
        navigate(redirectTo);
    };

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
            {IconComponent && (
                <IconComponent
                    sx={{
                        fontSize: 52,
                        color: 'grey.400',
                        animation: `${bounceAnimation} 2s infinite`,
                    }}
                />
            )}
            <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'grey.700' }}>
                {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'grey.500', mb: 3, maxWidth: '600px' }}>
                {description}
            </Typography>
            <CommonButton variant="contained" onClick={handleClick} btnText={buttonText} />
        </Box>
    );
};

export default EmptyState;

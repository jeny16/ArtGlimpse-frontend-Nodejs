import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const BadgeWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5, 1.5),
    borderRadius: '16px',
    backgroundColor: '#fff',
    border: `1px solid ${theme.palette.shades.light}`,
    maxWidth: 'fit-content',
    transition: 'all 0.2s ease',
    '&:hover': {
        borderColor: theme.palette.custom.highlight,
        transform: 'translateY(-2px)',
    }
}));

const BadgeText = styled(Typography)(({ theme }) => ({
    fontFamily: theme.typography.body1.fontFamily,
    fontWeight: 500,
    color: theme.palette.neutral.light,
}));

const FeatureBadge = ({ icon, text }) => {
    return (
        <BadgeWrapper>
            {React.cloneElement(icon, { style: { color: '#814d0b' } })}
            <BadgeText variant="body2">
                {text}
            </BadgeText>
        </BadgeWrapper>
    );
};

export default FeatureBadge;
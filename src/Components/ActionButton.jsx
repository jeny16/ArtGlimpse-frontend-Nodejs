import React from 'react';
import { Button, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme, buttontype }) => {
    const buttonTypes = {
        highlight: {
            backgroundColor: theme.palette.custom.highlight,
            color: '#fff',
            '&:hover': {
                backgroundColor: theme.palette.custom.accent,
                transform: 'translateY(-2px)',
            }
        },
        outline: {
            backgroundColor: 'transparent',
            color: theme.palette.custom.highlight,
            border: `1px solid ${theme.palette.custom.highlight}`,
            '&:hover': {
                backgroundColor: theme.palette.tints.tint1,
                transform: 'translateY(-2px)',
            }
        }
    };

    return {
        ...buttonTypes[buttontype] || buttonTypes.highlight,
        fontFamily: theme.typography.button.fontFamily,
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        padding: '10px 16px',
    };
});

const ActionButton = ({
    children,
    startIcon,
    endIcon,
    buttonType = 'highlight',
    size = 'medium',
    fullWidth = false,
    ...props
}) => {
    return (
        <StyledButton
            buttontype={buttonType}
            size={size}
            startIcon={startIcon}
            endIcon={endIcon}
            fullWidth={fullWidth}
            disableElevation
            {...props}
        >
            {children}
        </StyledButton>
    );
};

export default ActionButton;
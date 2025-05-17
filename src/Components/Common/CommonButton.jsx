import { Button, useTheme } from '@mui/material';
import React from 'react';

const CommonButton = ({ btnText, onClick, rest, fullWidth, mt }) => {
    const theme = useTheme();
    return (
        <Button
            {...rest}
            fullWidth={fullWidth}
            onClick={onClick}
            sx={{
                backgroundColor: 'transparent',
                color: theme.palette.custom.highlight,
                border: `2px solid ${theme.palette.custom.highlight}`,
                textTransform: 'none',
                fontSize: '1rem',
                px: 3,
                py: 1,
                mt: mt,
                transition: 'all 0.3s ease',
                '&:hover': {
                    backgroundColor: theme.palette.custom.highlight,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.custom.highlight,
                },
            }}
        >
            {btnText}
        </Button>
    );
}

export default CommonButton;

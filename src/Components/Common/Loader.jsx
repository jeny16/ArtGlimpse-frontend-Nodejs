import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';

const Loader = ({ width }) => {
    const theme = useTheme();
    const minHeight = width ? '50vh' : '100vh';
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight,
            }}
        >
            <CircularProgress sx={{ color: theme.palette.custom.highlight }} />
        </Box>
    );
};

export default Loader;

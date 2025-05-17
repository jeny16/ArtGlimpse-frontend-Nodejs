import React, { memo } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';

const Stats = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const stats = [
        { number: '5000+', label: 'Happy Customers' },
        { number: '1000+', label: 'Custom Designs' },
        { number: '50+', label: 'Product Categories' },
        { number: '4.8/5', label: 'Average Rating' }
    ];

    return (
        <Box sx={{
            padding: {
                xs: '40px 20px',
                sm: '60px 30px',
                md: '80px',
                lg: '120px'
            },
            bgcolor: "#fdf6e9"
        }}>
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={{ xs: 3, sm: 4, md: 4 }}
                    sx={{
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}
                >
                    {stats.map((stat) => (
                        <Grid
                            item
                            xs={6}
                            md={3}
                            key={stat.label}
                        >
                            <Box
                                sx={{
                                    textAlign: "center",
                                    padding: { xs: 1, sm: 2, md: 3 },
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: {
                                            xs: 'none',
                                            md: 'translateY(-5px)'
                                        }
                                    }
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        color: '#c17912',
                                        fontWeight: 'bold',
                                        mb: { xs: 0.5, sm: 1 },
                                        fontSize: {
                                            xs: '1.8rem',
                                            sm: '2.2rem',
                                            md: '2.5rem',
                                            lg: '3rem'
                                        }
                                    }}
                                >
                                    {stat.number}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: {
                                            xs: '0.9rem',
                                            sm: '1rem',
                                            md: '1.25rem'
                                        },
                                        fontWeight: {
                                            xs: 500,
                                            md: 600
                                        },
                                        lineHeight: 1.3,
                                        maxWidth: '200px',
                                        margin: '0 auto'
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default memo(Stats);
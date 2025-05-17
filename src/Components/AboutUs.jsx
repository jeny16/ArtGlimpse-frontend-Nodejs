import React, { memo } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    useMediaQuery,
} from '@mui/material';
import HandymanIcon from '@mui/icons-material/Handyman';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AboutUs = () => {
    const features = [
        {
            icon: <HandymanIcon />,
            title: 'Handcrafted with Love',
            description: 'Each piece is carefully crafted by skilled artisans, bringing traditional techniques to modern designs.'
        },
        {
            icon: <LocalShippingIcon />,
            title: 'Pan India Delivery',
            description: 'We deliver our handcrafted treasures across India, bringing artisanal beauty to your doorstep.'
        },
        {
            icon: <AutoAwesomeIcon />,
            title: 'Eco-Friendly Materials',
            description: 'We prioritize sustainable materials like resin and wool, ensuring our crafts are kind to the environment.'
        },
        {
            icon: <FavoriteIcon />,
            title: 'Made with Passion',
            description: 'Our homegrown business combines tradition with innovation across 25+ categories of authentic Indian handicrafts.'
        }
    ];

    return (
        <Box 
            sx={{
                position: 'relative',
                overflow: 'hidden', // Prevents background element from extending outside
                backgroundColor: 'white',
                pt: { xs: '88px', md: '96px' },
                pb: { xs: 6, md: 8 },
                minHeight: { xs: `calc(100vh - 64px)`, md: `calc(100vh - 64px)` },
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Decorative Background Element */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 64,
                    right: 0,
                    width: '40%',
                    height: '100%',
                    backgroundColor: 'secondary.light', // #dbd4c7
                    clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    zIndex: 0,
                    bottom: 0, // Ensures it stops at the container bottom
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
                {/* Header Section */}
                <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
                    <Grid item xs={12} md={6}>
                        <Typography 
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                color: 'custom.highlight',
                                mb: 2,
                                lineHeight: 1.2
                            }}
                        >
                            Our Story
                        </Typography>
                        <Divider sx={{ 
                            width: 100,
                            borderWidth: 3,
                            backgroundColor: 'custom.accent',
                            mb: 3
                        }} />
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'neutral.main',
                                mb: 4
                            }}
                        >
                            Bringing India's Rich Handicraft Heritage to Your Home
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            backgroundColor: 'tints.tint1',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(193,121,18,0.12)'
                        }}>
                            <Typography variant="body1" sx={{ mb: 2, color: 'neutral.light' }}>
                                Welcome to our homegrown handicraft haven, where tradition meets creativity. Starting as a small family venture, we've grown into a vibrant marketplace celebrating India's rich artistic heritage through contemporary expressions.
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'neutral.light' }}>
                                Our collection spans over 25 categories, from sacred Pooja Thalis to trendy Jumakas, each piece telling a unique story of craftsmanship.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Features Grid */}
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    backgroundColor: index % 2 === 0 ? 'tints.tint1' : 'tints.tint2',
                                    border: 'none',
                                    borderRadius: 2,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: 'custom.highlight',
                                            color: 'primary.main',
                                            width: 56,
                                            height: 56,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2
                                        }}
                                    >
                                        {React.cloneElement(feature.icon, {
                                            sx: { fontSize: 28 }
                                        })}
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mb: 2,
                                            color: 'custom.highlight'
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'neutral.light',
                                            lineHeight: 1.7
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Additional Content Section */}
                <Box
                    sx={{
                        mt: 8,
                        p: 4,
                        backgroundColor: 'tints.tint3',
                        borderRadius: 2,
                        position: 'relative'
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'neutral.light',
                            maxWidth: 800,
                            mx: 'auto',
                            textAlign: 'center',
                            lineHeight: 1.8
                        }}
                    >
                        Our artisans specialize in creating beautiful pieces using both traditional and modern materials like resin and wool. Whether it's festive Rakhis, decorative Diyas, or elegant home décor, each item is crafted with attention to detail and cultural significance.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default memo(AboutUs);
import { Facebook, Instagram } from "lucide-react";
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    TextField,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { memo } from "react";

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const quickLinks = ['Privacy Policy', 'Terms & Conditions', 'FAQ', 'Returns & Refunds'];

    return (
        <Box
            sx={{
                bgcolor: theme.palette.custom.accent,
                color: 'white',
                py: { xs: 4, sm: 5, md: 6, lg: 8 },
                px: { xs: 2, sm: 3, md: 4 },
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
                    {/* Brand Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontFamily: 'Raleway, serif',
                                mb: { xs: 1, sm: 2 },
                                fontWeight: 600,
                                letterSpacing: 1,
                                fontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.8rem' },
                                background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: { xs: 'center', sm: 'left' }
                            }}
                        >
                            ArtGlimpse
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.9,
                                lineHeight: 1.6,
                                fontWeight: 300,
                                textAlign: { xs: 'center', sm: 'left' },
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                        >
                            Crafting memories with resin, one piece at a time.
                        </Typography>
                    </Grid>

                    {/* Quick Links Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'left' },
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' }
                            }}
                        >
                            Quick Links
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                            sx={{
                                alignItems: { xs: 'center', sm: 'flex-start' }
                            }}
                        >
                            {quickLinks.map((link) => (
                                <Button
                                    key={link}
                                    sx={{
                                        color: 'white',
                                        justifyContent: 'flex-start',
                                        px: 0,
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            opacity: 0.8,
                                            transform: 'translateX(5px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {link}
                                </Button>
                            ))}
                        </Box>
                    </Grid>

                    {/* Contact Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'left' },
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' }
                            }}
                        >
                            Contact Us
                        </Typography>
                        <Box
                            sx={{
                                opacity: 0.9,
                                textAlign: { xs: 'center', sm: 'left' }
                            }}
                        >
                            <Typography
                                variant="body2"
                                paragraph
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1,
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}
                            >
                                Email: hello@artglimpse.com
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}
                            >
                                Phone: +91 98765 43210
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Newsletter Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                fontWeight: 500,
                                textAlign: { xs: 'center', sm: 'left' },
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' }
                            }}
                        >
                            Newsletter
                        </Typography>
                        <Box sx={{ maxWidth: { xs: '300px', sm: 'none' }, mx: { xs: 'auto', sm: 0 } }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your email"
                                size="small"
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 2,
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        '&:hover fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    bgcolor: 'white',
                                    color: theme.palette.custom.highlight,
                                    mb: 3,
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                    },
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    fontSize: { xs: '0.9rem', sm: '1rem' }
                                }}
                            >
                                Subscribe
                            </Button>
                            <Box
                                display="flex"
                                gap={2}
                                sx={{
                                    justifyContent: { xs: 'center', sm: 'flex-start' }
                                }}
                            >
                                <IconButton
                                    sx={{
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-3px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Instagram size={isMobile ? 20 : 24} />
                                </IconButton>
                                <IconButton
                                    sx={{
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-3px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Facebook size={isMobile ? 20 : 24} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Copyright Section */}
                <Box
                    sx={{
                        mt: { xs: 4, sm: 5, md: 6 },
                        pt: { xs: 2, sm: 3 },
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.7,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}
                    >
                        © {new Date().getFullYear()} ArtGlimpse. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default memo(Footer);
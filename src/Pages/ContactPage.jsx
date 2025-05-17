import React, { memo } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    IconButton,
    Container,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const ContactPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const contactInfo = [
        {
            icon: <LocationOnIcon />,
            title: 'Address',
            content: 'Ahmedabad, India'
        },
        {
            icon: <PhoneIcon />,
            title: 'Phone',
            content: '+91 8511998086'
        },
        {
            icon: <EmailIcon />,
            title: 'Email',
            content: 'hello@artglimpse.com'
        },
        // {
        //     icon: <AccessTimeIcon />,
        //     title: 'Working Hours',
        //     content: 'Monday - Friday, 9:00 AM - 6:00 PM'
        // }
    ];

    return (
        <Box 
            sx={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'smokewhite',
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
                    backgroundColor: 'secondary.light',
                    clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    zIndex: 0,
                    bottom: 0,
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
                            Contact Us
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
                            We're here to help and answer any questions
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
                                Have questions about our handcrafted products? Want to learn more about our artisans? 
                                Or just want to say hello? We'd love to hear from you!
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Contact Information Cards */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {contactInfo.map((info, index) => (
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
                                        {React.cloneElement(info.icon, {
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
                                        {info.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'neutral.light',
                                            lineHeight: 1.7
                                        }}
                                    >
                                        {info.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Contact Form and Map Section */}
                <Grid container spacing={4}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ 
                            backgroundColor: 'tints.tint1',
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(193,121,18,0.12)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{
                                        color: 'custom.highlight',
                                        mb: 3
                                    }}
                                >
                                    Send Us a Message
                                </Typography>
                                <Box component="form">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Name" 
                                                variant="outlined" 
                                                required 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Email" 
                                                type="email" 
                                                variant="outlined" 
                                                required 
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                label="Subject" 
                                                variant="outlined" 
                                                required 
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                multiline
                                                rows={4}
                                                variant="outlined"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<SendIcon />}
                                                sx={{ 
                                                    mt: 2,
                                                    backgroundColor: 'custom.highlight',
                                                    color:"common.white",
                                                    '&:hover': {
                                                        backgroundColor: 'custom.accent'
                                                    }
                                                }}
                                            >
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Map Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ 
                            height: '100%',
                            backgroundColor: 'tints.tint1',
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(193,121,18,0.12)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{
                                        color: 'custom.highlight',
                                        mb: 3
                                    }}
                                >
                                    Find Us
                                </Typography>
                                <Box sx={{ height: 400 }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.0783840356157!2d72.51826947350894!3d23.05758771502405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9d0845742b0f%3A0x7e05407cae921b5a!2sPalladium%20Ahmedabad!5e0!3m2!1sen!2sin!4v1736960125168!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, borderRadius: '8px' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Google Maps Location"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Social Media Section */}
                <Box sx={{ mt: 6 }}>
                    <Card sx={{ 
                        backgroundColor: 'tints.tint3',
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(193,121,18,0.12)'
                    }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Typography 
                                variant="h5" 
                                sx={{
                                    color: 'custom.highlight',
                                    mb: 3
                                }}
                            >
                                Follow Us on Instagram
                            </Typography>
                            <Grid container spacing={3} justifyContent="center">
                                {[
                                    { username: 'artistglimpse_', url: 'https://www.instagram.com/artglimpse_?igsh=MTNnYnVrNnNwbXhiNQ==' },
                                    { username: 'artistglimpse_', url: 'https://www.instagram.com/artglimpse_?igsh=MTNnYnVrNnNwbXhiNQ==' }
                                ].map((account, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 2
                                        }}>
                                            <Typography variant="h6" sx={{ color: 'neutral.light' }}>
                                                {account.username}
                                            </Typography>
                                            <IconButton
                                                href={account.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                    color: 'custom.highlight',
                                                    '&:hover': {
                                                        color: 'custom.accent'
                                                    }
                                                }}
                                            >
                                                <InstagramIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default memo(ContactPage);
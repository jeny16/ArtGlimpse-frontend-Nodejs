import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Button,
    Container,
    Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';

const Privacy = () => {
    const [expanded, setExpanded] = useState('introduction');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const privacySections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            content: `ArtGlimpse is dedicated to ensuring your privacy and security. This Privacy Policy details how we collect, use, share, and protect your personal data when you interact with our services. We believe transparency is key to building trust with our community.`
        },
        {
            id: 'data-collection',
            title: '2. Data Collection',
            content: `We collect information that you provide directly—such as your name, email, shipping address, and payment details—as well as data generated during your interactions with our website (e.g., browsing patterns and search queries). This helps us tailor your experience and improve our offerings.`
        },
        {
            id: 'data-usage',
            title: '3. How We Use Your Data',
            content: `Your information is used to process orders, deliver personalized recommendations, and enhance our products and services. Additionally, we analyze your usage data to optimize our platform and communicate updates, promotions, and important service notifications to you.`
        },
        {
            id: 'data-sharing',
            title: '4. Data Sharing and Third Parties',
            content: `We do not sell your personal data. However, we may share your information with trusted third-party partners who help us operate our platform, process transactions, and provide a seamless user experience. All partners must adhere to strict confidentiality guidelines.`
        },
        {
            id: 'cookies',
            title: '5. Cookies and Tracking',
            content: `Our website uses cookies and similar tracking technologies to remember your preferences, manage sessions, and offer personalized content. These tools allow us to analyze site traffic and improve our services. You can manage your cookie settings through your browser.`
        },
        {
            id: 'your-rights',
            title: '6. Your Rights',
            content: `You have the right to access, update, or delete your personal information at any time. If you suspect any misuse or have questions about how your data is handled, please contact our support team. We are committed to promptly addressing any concerns you may have.`
        },
        {
            id: 'security',
            title: '7. Security & Updates',
            content: `We implement industry-leading security measures to safeguard your data. Although no system can be completely impervious, we continually work to ensure your information is protected. This Privacy Policy may be updated periodically—any significant changes will be posted on our website.`
        }
    ];

    return (
        <Container>
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: 'tints.tint3'
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundImage: 'linear-gradient(to right, #fdf7ed, #fefaf4)',
                        borderBottom: '1px solid',
                        borderColor: 'shades.light'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                        <SecurityIcon sx={{ color: 'custom.highlight', fontSize: 32, mr: 1 }} />
                        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ color: 'custom.highlight' }}>
                            Privacy Policy
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Last updated: March 8, 2025
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Your privacy is our priority. Please review our policy carefully.
                        </Typography>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <Typography variant="body1" paragraph>
                        At ArtGlimpse, we value your trust and are committed to safeguarding your personal data. Below you will find details on our data practices and your rights.
                    </Typography>

                    {privacySections.map((section) => (
                        <Accordion
                            key={section.id}
                            expanded={expanded === section.id}
                            onChange={handleChange(section.id)}
                            sx={{
                                mb: 2,
                                '&:before': { display: 'none' },
                                boxShadow: 'none',
                                border: '1px solid',
                                borderColor: 'shades.light',
                                borderRadius: '8px !important',
                                overflow: 'hidden'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'custom.highlight' }} />}
                                sx={{
                                    bgcolor: 'rgba(193, 121, 18, 0.05)',
                                    '&:hover': { bgcolor: 'rgba(193, 121, 18, 0.1)' }
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="600">
                                    {section.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" paragraph>
                                    {section.content}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Divider sx={{ my: 4 }} />

                    {/* Contact Information */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'custom.highlight', mb: 1 }}>
                            Contact Us
                        </Typography>
                        <Typography variant="body2">
                            For any questions regarding our Privacy Policy, please email us at:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                            <EmailIcon sx={{ color: 'custom.highlight', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                support@artglimpse.com
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                color: 'white',
                                bgcolor: 'custom.highlight',
                                '&:hover': { bgcolor: 'custom.accent' }
                            }}
                        >
                            Get in Touch
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Privacy;

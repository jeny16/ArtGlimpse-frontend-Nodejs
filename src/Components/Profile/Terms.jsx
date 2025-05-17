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
  Container
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import UpdateIcon from '@mui/icons-material/Update';
import EmailIcon from '@mui/icons-material/Email';

const Terms = () => {
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const accordionSections = [
    {
      id: 'panel1',
      title: '1. User Account, Password, and Security',
      details: [
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Always use a strong password and do not share your login details.",
        "If you suspect any unauthorized access, please contact our support immediately."
      ]
    },
    {
      id: 'panel2',
      title: '2. Services Offered',
      details: [
        "ArtGlimpse offers a curated selection of physical and digital artwork along with personalized recommendations. Our platform is designed to connect artists with enthusiasts, ensuring a seamless shopping experience.",
        "We continuously update our product range and services, so please review our latest offerings periodically."
      ]
    },
    {
      id: 'panel3',
      title: '3. Platform for Transaction and Communication',
      details: [
        "Our platform facilitates secure transactions between buyers and sellers, as well as seamless communication. We employ advanced encryption to safeguard your financial and personal data during every transaction.",
        "However, ArtGlimpse is not liable for communication issues or disputes between third-party users."
      ]
    },
    {
      id: 'panel4',
      title: '4. User Conduct and Rules on the Platform',
      details: [
        "Users must abide by all applicable laws and refrain from any fraudulent, abusive, or harmful activities. This includes, but is not limited to, the prohibition of posting offensive or misleading content.",
        "Violations of these rules may result in suspension or termination of your account."
      ]
    },
    {
      id: 'panel5',
      title: '5. Contents Posted on Platform',
      details: [
        "Any content that you post on ArtGlimpse remains your responsibility. While we strive to maintain a safe and respectful environment, you agree that ArtGlimpse is not liable for any content posted by users.",
        "Please ensure that your posts do not infringe on copyrights or violate any laws."
      ]
    },
    {
      id: 'panel6',
      title: '6. Limitation of Liability and Termination',
      details: [
        "ArtGlimpse shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our liability is limited to the amount paid for the product that gave rise to any claim.",
        "We reserve the right to terminate or suspend your account immediately, without notice, for any breach of these Terms."
      ]
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
            <GavelIcon sx={{ color: 'custom.highlight', fontSize: 32, mr: 1 }} />
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{ color: 'custom.highlight' }}>
              Terms of Use
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: March 1, 2025
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Please read these Terms carefully. By using ArtGlimpse, you agree to be bound by these Terms.
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          {/* Introduction */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph>
              Welcome to ArtGlimpse. These Terms of Use govern your use of our website, mobile application, and services. If you do not agree with these Terms, please refrain from using our platform.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                bgcolor: 'rgba(193, 121, 18, 0.05)',
                borderRadius: 2,
                mb: 4,
                mt: 3
              }}
            >
              <UpdateIcon sx={{ color: 'custom.highlight', mr: 2 }} />
              <Typography variant="body2">
                These Terms were last updated on March 1, 2025. Continued use of our platform after changes constitutes your acceptance of the revised Terms.
              </Typography>
            </Box>
          </Box>

          {/* Accordion Sections */}
          {accordionSections.map((section) => (
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
                {section.details.map((text, index) => (
                  <Typography variant="body2" paragraph key={index}>
                    {text}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* Contact Information */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'custom.highlight', mb: 1 }}>
              Contact Us
            </Typography>
            <Typography variant="body2">
              For any questions regarding these Terms of Use, please email us at:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <EmailIcon sx={{ color: 'custom.highlight', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                support@artglimpse.com
              </Typography>
            </Box>
            <Button variant="contained" sx={{ mt: 2, textTransform: 'uppercase', fontWeight: 'bold', borderRadius: 2, color: 'white', bgcolor: 'custom.highlight', '&:hover': { bgcolor: 'custom.accent' } }}>
              Get in Touch
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms;

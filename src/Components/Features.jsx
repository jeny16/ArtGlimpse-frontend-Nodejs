import { Box, Container, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import {
  Gem,
  Gift,
  HandIcon,
  Leaf,
  Palette,
  Truck,
} from "lucide-react";
import { memo } from "react";

const Features = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <HandIcon size={isMobile ? 32 : 40} style={{ color: "#c17912", marginBottom: "1rem" }} />,
      title: "100% Handmade",
      description: "Each Piece Crafted With Care"
    },
    {
      icon: <Palette size={isMobile ? 32 : 40} style={{ color: "#c17912", marginBottom: "1rem" }} />,
      title: "Fully Customizable",
      description: "Design Your Perfect Piece",
    },
    {
      icon: <Gift size={isMobile ? 32 : 40} style={{ color: "#c17912", marginBottom: "1rem" }} />,
      title: "Perfect for Gifting",
      description: "Unique Presents For Loved Ones",
    },
    {
      icon: <Gem size={isMobile ? 32 : 40} style={{ color: "#c17912", marginBottom: "1rem" }} />,
      title: "Premium Materials",
      description: "High-Quality Resin and Accessories",
    },
    {
      icon: <Truck size={isMobile ? 32 : 40} style={{ color: "#c17912", marginBottom: "1rem" }} />,
      title: "Ships Across India",
      description: "Nationwide Delivery Available",
    },
    {
      icon: <Leaf size={isMobile ? 32 : 40} style={{ color: "#c17912", marginBottom: "1rem" }} />,
      title: "Eco-Friendly Practices",
      description: "Committed to Sustainable Crafting",
    },
  ];

  return (
    <Box sx={{
      padding: {
        xs: '40px 20px',
        sm: '60px 30px',
        md: '80px',
        lg: '100px'
      },
      bgcolor: "#fdf6e9"
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: "center",
            mb: { xs: 4, sm: 5, md: 6 },
            color: "#814d0b",
            fontWeight: 650,
            fontSize: {
              xs: '1.8rem',
              sm: '2.2rem',
              md: '2.5rem',
              lg: '3rem'
            }
          }}
        >
          WHY CHOOSE US
        </Typography>
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 4 }}
          sx={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
            >
              <Box
                sx={{
                  textAlign: "center",
                  padding: { xs: 2, sm: 2.5, md: 3 },
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: {
                      xs: 'none',
                      md: 'translateY(-5px)'
                    }
                  }
                }}
              >
                {feature.icon}
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontSize: {
                      xs: '1.1rem',
                      sm: '1.2rem',
                      md: '1.25rem'
                    },
                    fontWeight: 600,
                    mb: { xs: 1, md: 1.5 }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem'
                    },
                    lineHeight: 1.6,
                    maxWidth: '280px',
                    margin: '0 auto'
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(Features);
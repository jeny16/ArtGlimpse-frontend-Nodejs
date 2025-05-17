import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Quote } from "lucide-react";
import { memo } from "react";

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const testimonials = [
    {
      name: "Priya Shah",
      location: "Mumbai",
      text: "The custom pooja thali I ordered was absolutely stunning. The attention to detail and the quality of work exceeded my expectations.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      location: "Delhi",
      text: "Ordered a personalized rakhi set for my sisters. The craftmanship was exceptional, and the delivery was right on time.",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      location: "Bangalore",
      text: "Beautiful Ganesh idol with amazing detailing. The resin work is flawless, and it looks perfect in my prayer room.",
      rating: 5,
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        padding: {
          xs: '40px 20px',
          sm: '60px 30px',
          md: '80px 40px',
          lg: '100px'
        }
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: { xs: 4, sm: 6, md: 10 }, // Adjust margin for headings
            fontWeight: 650,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }, // Responsive font sizes
            color: "#814d0b",
          }}
        >
          CUSTOMER REVIEWS
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 4, md: 6 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: isMobile ? "none" : "translateY(-5px)", // Add hover effect only on larger screens
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 }, // Responsive padding
                  }}
                >
                  <Quote
                    size={32}
                    style={{
                      color: "#c17912",
                      marginBottom: "16px",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      mb: 2,
                    }}
                  >
                    {testimonial.text}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#c17912",
                        width: { xs: 40, sm: 48 }, // Responsive avatar size
                        height: { xs: 40, sm: 48 },
                      }}
                    >
                      {testimonial.name[0]}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.1rem" }, // Responsive text sizes
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" }, // Responsive location text
                        }}
                      >
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(Testimonials);

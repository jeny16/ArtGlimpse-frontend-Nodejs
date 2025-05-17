import { Heart, Package, Sparkles, Weight } from "lucide-react";
import { Box, Container, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import { memo } from "react";

const Story = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{
      padding: {
        xs: '40px 20px',
        sm: '60px 30px',
        md: '80px 40px',
        lg: '100px'
      }
    }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              padding: {
                xs: '15px',
                sm: '20px',
                md: '25px'
              }
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#814d0b",
                mb: { xs: 2, sm: 2.5, md: 3 },
                fontSize: {
                  xs: '1.8rem',
                  sm: '2.2rem',
                  md: '2.5rem',
                  lg: '3rem'
                }
              }}
            >
              OUR STORY
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontWeight: 500,
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem'
                },
                lineHeight: {
                  xs: 1.5,
                  md: 1.7
                }
              }}
              paragraph
            >
              Founded in 2020, ArtGlimpse began as a small workshop crafting
              personalized resin gifts. Today, we're proud to be one of India's
              leading artisanal resin crafting studios, serving customers
              nationwide with our unique, handcrafted creations.
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontWeight: 500,
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.1rem'
                },
                lineHeight: {
                  xs: 1.5,
                  md: 1.7
                }
              }}
              paragraph
            >
              Our team of skilled artisans combines traditional Indian aesthetics
              with modern resin art techniques to create pieces that are both
              beautiful and meaningful. Each item is carefully crafted to preserve
              the cultural significance while adding a contemporary touch.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-around",
                alignItems: "center",
                gap: { xs: 4, sm: 2, md: 3 },
                mt: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 0 }
              }}
            >
              {[
                {
                  icon: <Heart size={isMobile ? 24 : 32} style={{ color: "#c17912", marginBottom: "8px" }} />,
                  title: "HandCrafted",
                  subtitle: "Made With Love ❤️"
                },
                {
                  icon: <Package size={isMobile ? 24 : 32} style={{ color: "#c17912", marginBottom: "8px" }} />,
                  title: "Custom Orders",
                  subtitle: "Your Vision, our Craft"
                },
                {
                  icon: <Sparkles size={isMobile ? 24 : 32} style={{ color: "#c17912", marginBottom: "8px" }} />,
                  title: "Premium Quality",
                  subtitle: "Built to Last"
                }
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  {item.icon}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 400,
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem',
                        md: '1.25rem'
                      },
                      mb: 0.5
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: '0.75rem',
                        sm: '0.8rem',
                        md: '0.875rem'
                      }
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/assets/image (9).jpg"
              alt="Workshop"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: { xs: 1, sm: 1.5, md: 2 },
                boxShadow: { xs: 2, md: 3 },
                mb: { xs: 2, sm: 0 }
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(Story);
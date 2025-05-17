import React, { memo } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

const Hero = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Paper
            sx={{
                position: "relative",
                height: "95vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                mt: 12,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("src/assets/hero.jpeg")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                textAlign: "center",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
            }}
        >
            <Container>
                <Box
                    px={2}
                    sx={{
                        animation: "fadeIn 1.2s ease-out",
                        "@keyframes fadeIn": {
                            "0%": { opacity: 0, transform: "translateY(20px)" },
                            "100%": { opacity: 1, transform: "translateY(0)" }
                        }
                    }}
                >
                    <Typography
                        variant={isSmallScreen ? "h4" : "h2"}
                        component="h1"
                        sx={{
                            fontFamily: "'Raleway', serif",
                            fontWeight: "bold",
                            mb: 3,
                            letterSpacing: "0.05em",
                            textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
                            animation: "fadeIn 1s ease-in-out",
                            position: "relative",
                            display: "inline-block",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "80px",
                                height: "3px",
                                backgroundColor: theme.palette.custom.highlight,
                            }
                        }}
                    >
                        ArtGlimpse
                    </Typography>

                    <Typography
                        variant={isSmallScreen ? "h5" : "h4"}
                        sx={{
                            mb: 2,
                            fontFamily: "'Raleway', serif",
                            fontWeight: "500",
                            textShadow: "1px 1px 5px rgba(0,0,0,0.6)",
                            animation: "fadeIn 1.3s ease-in-out",
                            mt: 4
                        }}
                    >
                        Ethereal Resin Artistry
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 6,
                            fontSize: isSmallScreen ? "1rem" : "1.25rem",
                            fontFamily: "'Raleway', sans-serif",
                            textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
                            animation: "fadeIn 1.5s ease-in-out",
                            maxWidth: "800px",
                            mx: "auto",
                            lineHeight: 1.6
                        }}
                    >
                        Exquisite handcrafted resin pieces capturing nature's beauty in timeless art.
                        Each creation tells a unique story, perfect for special moments and cherished spaces.
                    </Typography>

                    <Box
                        display="flex"
                        gap={4}
                        justifyContent="center"
                        flexWrap="wrap"
                        sx={{
                            animation: "fadeIn 1.8s ease-in-out",
                        }}
                    >
                        <Link to='/shop' style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: theme.palette.custom.highlight,
                                    color: "#fff",
                                    px: 5,
                                    py: 1.8,
                                    fontFamily: "'Raleway', sans-serif",
                                    fontSize: "1.1rem",
                                    fontWeight: "500",
                                    borderRadius: "30px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        bgcolor: theme.palette.custom.accent,
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 6px 15px rgba(193, 121, 18, 0.3)"
                                    },
                                }}
                            >
                                Explore Collection
                            </Button>
                        </Link>
                        <Link to='/aboutUs' style={{ textDecoration: 'none' }}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: "1.1rem",
                                    fontWeight: "500",
                                    fontFamily: "'Raleway', sans-serif",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    borderColor: "#fff",
                                    borderWidth: "2px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        borderColor: theme.palette.tints.tint3,
                                        color: theme.palette.tints.tint3,
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 6px 15px rgba(255, 255, 255, 0.2)"
                                    },
                                }}
                            >
                                Our Story
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Paper>
    );
};

export default memo(Hero);
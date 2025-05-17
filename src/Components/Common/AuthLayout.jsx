// src/layouts/AuthLayout.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        if (authentication && !isLoggedIn) {
            // Protected routes: if not logged in, redirect to login
            navigate("/login");
        } else if (!authentication && isLoggedIn) {
            // Public routes: if logged in, redirect to home
            navigate("/");
        }
        setLoader(false);
    }, [isLoggedIn, navigate, authentication]);

    return loader ? (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <CircularProgress />
        </Box>
    ) : (
        <>{children}</>
    );
}

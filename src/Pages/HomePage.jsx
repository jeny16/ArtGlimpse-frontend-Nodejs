import React, { memo } from 'react';
import {
    Box
} from '@mui/material';
import { Hero, FeaturedProducts, Story, Stats, Testimonials, Features } from '../Components/index';
import Chatbot from '../Components/ChatBot/ChatBot';
const HomePage = () => {
    return (
        <Box>
            <Hero />
            <FeaturedProducts />
            <Story />
            <Stats />
            <Testimonials />
            <Features />
            <Chatbot />
        </Box>
    );
};

export default memo(HomePage);
import React, { useState } from 'react';
import { Box, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getImageUrl } from '../actions/getImage';

const MainImageWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const ThumbnailWrapper = styled(Box)(({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    border: active
        ? `2px solid ${theme.palette.custom.highlight}`
        : `1px solid ${theme.palette.shades.light}`,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'scale(1.03)',
    },
}));

const StyledImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: theme.shape.borderRadius,
}));

const ThumbnailImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const ImageGrid = ({ images = [] }) => {
    const [activeImage, setActiveImage] = useState(0);

    if (images.length === 0) {
        return (
            <MainImageWrapper>
                <CardMedia
                    component="img"
                    image="https://via.placeholder.com/500"
                    alt="Product"
                />
            </MainImageWrapper>
        );
    }

    if (images.length === 1) {
        return (
            <MainImageWrapper sx={{ p: 0, height: { xs: '350px', sm: '400px', md: '550px' } }}>
                {/* ← wrap in getImageUrl */}
                <StyledImage src={getImageUrl(images[0])} alt="Product" />
            </MainImageWrapper>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    maxWidth: { xs: 80, md: 100 },
                }}
            >
                {images.map((img, index) => (
                    <ThumbnailWrapper
                        key={index}
                        active={index === activeImage}
                        onClick={() => setActiveImage(index)}
                    >
                        <Box sx={{ height: { xs: 60, md: 80 } }}>
                            {/* ← wrap in getImageUrl */}
                            <ThumbnailImage
                                src={getImageUrl(img)}
                                alt={`Thumbnail ${index + 1}`}
                            />
                        </Box>
                    </ThumbnailWrapper>
                ))}
            </Box>
            <MainImageWrapper sx={{ flex: 1, height: { xs: '350px', sm: '400px', md: '550px' } }}>
                {/* ← wrap in getImageUrl */}
                <StyledImage
                    src={getImageUrl(images[activeImage])}
                    alt={`Product view ${activeImage + 1}`}
                />
            </MainImageWrapper>
        </Box>
    );
};

export default ImageGrid;

import React from 'react';
import { Box, Chip, Typography, styled } from '@mui/material';

const GroupTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    fontFamily: theme.typography.h3.fontFamily,
    color: theme.palette.neutral.light,
}));

const ChipsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
}));

const StyledChip = styled(Chip)(({ theme, chipvariant }) => {
    const variants = {
        highlight: {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.custom.highlight,
            border: `1px solid ${theme.palette.custom.highlight}`,
            '& .MuiChip-deleteIcon': {
                color: theme.palette.custom.highlight,
            },
            '&:hover': {
                backgroundColor: theme.palette.tints.tint1,
            }
        },
        outline: {
            backgroundColor: '#fff',
            border: `1px solid ${theme.palette.shades.light}`,
            color: theme.palette.neutral.main,
            '&:hover': {
                borderColor: theme.palette.custom.highlight,
                color: theme.palette.custom.highlight,
            }
        },
        default: {
            backgroundColor: theme.palette.tints.tint2,
            color: theme.palette.secondary.dark,
        }
    };

    return {
        ...variants[chipvariant] || variants.default,
        fontFamily: theme.typography.body1.fontFamily,
        borderRadius: '4px',
        transition: 'all 0.2s ease',
    };
});

const ChipGroup = ({
    title,
    items = [],
    variant = 'default',
    size = 'small',
    onDelete = null
}) => {
    if (!items || items.length === 0) return null;

    return (
        <Box sx={{ mb: 3 }}>
            {title && <GroupTitle variant="subtitle1">{title}</GroupTitle>}
            <ChipsContainer>
                {items.map((item, index) => (
                    <StyledChip
                        key={index}
                        label={item}
                        size={size}
                        chipvariant={variant}
                        onDelete={onDelete ? () => onDelete(item) : undefined}
                    />
                ))}
            </ChipsContainer>
        </Box>
    );
};

export default ChipGroup;
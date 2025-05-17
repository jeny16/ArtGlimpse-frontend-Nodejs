import React, { useState } from 'react';
import { Box, Tabs, Tab, styled, Accordion, AccordionSummary, AccordionDetails, Typography, useMediaQuery, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledTab = styled(Tab)(({ theme }) => ({
    fontWeight: 600,
    fontFamily: theme.typography.button.fontFamily,
    color: theme.palette.neutral.main,
    '&.Mui-selected': {
        color: theme.palette.custom.highlight,
    },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.shades.light}`,
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.custom.highlight,
        height: 3,
    },
}));

const AccordionHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontFamily: theme.typography.h3.fontFamily,
    color: theme.palette.neutral.light,
}));

const InfoTabs = ({ tabs = [] }) => {
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (isMobile) {
        return (
            <Box>
                {tabs.map((tab, index) => (
                    <Accordion
                        key={index}
                        defaultExpanded={index === 0}
                        sx={{
                            backgroundColor: '#fff',
                            '&:before': { display: 'none' },
                            border: `1px solid ${theme.palette.shades.light}`,
                            mb: 2,
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.custom.highlight }} />}
                            sx={{ backgroundColor: theme.palette.tints.tint1, py: 2, px: 2 }}
                        >
                            <AccordionHeader variant="body1">
                                {tab.label}
                            </AccordionHeader>
                        </AccordionSummary>
                        <AccordionDetails sx={{ py: 3, px: 2 }}>
                            {tab.content}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        );
    }

    return (
        <Box>
            <StyledTabs value={value} onChange={handleChange} aria-label="product info tabs" sx={{ mb: 4 }}>
                {tabs.map((tab, index) => (
                    <StyledTab key={index} label={tab.label} id={`tab-${index}`} />
                ))}
            </StyledTabs>
            {tabs.map((tab, index) => (
                <Box
                    key={index}
                    role="tabpanel"
                    hidden={value !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                    sx={{ py: 4 }}
                >
                    {value === index && tab.content}
                </Box>
            ))}
        </Box>
    );
};

export default InfoTabs;

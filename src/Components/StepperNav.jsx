import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const steps = ['CART', 'ADDRESS', 'PAYMENT'];

const StepperNav = ({ activeStep = 0 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '50%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 5,
        px: 1
      }}
    >
      {steps.map((label, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const circleColor = isActive || isCompleted
          ? theme.palette.custom.highlight
          : theme.palette.shades.medium;
        const labelColor = isActive || isCompleted
          ? theme.palette.custom.highlight
          : theme.palette.shades.dark;

        return (
          <React.Fragment key={label}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Smaller Circular step indicator */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: circleColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '0.65rem',
                }}
              >
                {index + 1}
              </Box>
              {/* Step label in a smaller font */}
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  color: labelColor,
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {label}
              </Typography>
            </Box>
            {/* Thinner connector line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  backgroundColor: isCompleted
                    ? theme.palette.custom.highlight
                    : theme.palette.shades.medium,
                  mx: 1,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default StepperNav;

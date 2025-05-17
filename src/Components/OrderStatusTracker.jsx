import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepConnector, styled } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';

// Custom styled components
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderTopWidth: 3,
    borderRadius: 1,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.custom.highlight,
    },
  },
}));

const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: 24,
  },
  ...(ownerState.active && {
    color: theme.palette.custom.highlight,
    fontWeight: 700,
  }),
  ...(ownerState.completed && {
    color: theme.palette.custom.highlight,
  }),
}));

// Helper functions
const getStepIcon = (step) => {
  switch (step) {
    case 0:
      return <ShoppingCartIcon />;
    case 1:
      return <InventoryIcon />;
    case 2:
      return <LocalShippingIcon />;
    case 3:
      return <CheckCircleIcon />;
    default:
      return <ShoppingCartIcon />;
  }
};

// Map order status to step index
const getActiveStep = (status) => {
  switch (status) {
    case 'New':
      return 0;
    case 'Processing':
      return 1;
    case 'Shipped':
      return 2;
    case 'Delivered':
      return 3;
    case 'Cancelled':
      return -1; // Special case for cancelled orders
    default:
      return 0;
  }
};

// Order status steps
const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];

const OrderStatusTracker = ({ status, createdAt, compact = false }) => {
  const activeStep = getActiveStep(status);
  const isCancelled = status === 'Cancelled';
  
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Return a simpler version for the OrderHistory compact view
  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        {isCancelled ? (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
            <CancelIcon sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2">Cancelled on {formatDate(createdAt)}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {activeStep === 3 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <CheckCircleIcon sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">Delivered on {formatDate(createdAt)}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                {getStepIcon(activeStep)}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {steps[activeStep]} - {formatDate(createdAt)}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  }

  // Full stepper for OrderDetails page
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {isCancelled ? (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 2,
            backgroundColor: 'error.light',
            borderRadius: 1,
            color: 'error.dark'
          }}
        >
          <CancelIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            Order was cancelled on {formatDate(createdAt)}
          </Typography>
        </Box>
      ) : (
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          connector={<CustomStepConnector />}
          sx={{ py: 2 }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={index <= activeStep}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon {...props}>
                    {getStepIcon(index)}
                  </CustomStepIcon>
                )}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: index === activeStep ? 600 : 400,
                    color: index <= activeStep ? 'custom.highlight' : 'text.secondary'
                  }}
                >
                  {label}
                </Typography>
                {index <= activeStep && (
                  <Typography variant="caption" color="text.secondary">
                    {index === activeStep ? 'In Progress' : (
                      index === 3 ? `Delivered on ${formatDate(createdAt)}` : 'Completed'
                    )}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
};

export default OrderStatusTracker;
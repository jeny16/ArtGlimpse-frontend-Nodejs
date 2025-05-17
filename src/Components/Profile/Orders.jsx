import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Orders = ({ orders }) => {
  return (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ color: 'custom.highlight', mb: 2 }}>
        Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1">
          You have no orders yet.
        </Typography>
      ) : (
        orders.map((order, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Order #{order.orderId}
            </Typography>
            <Typography variant="body2">
              Total: {order.total}
            </Typography>
            {/* Add more order details here as needed */}
          </Box>
        ))
      )}
    </Paper>
  );
};

export default Orders;

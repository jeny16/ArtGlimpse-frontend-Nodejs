import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Radio,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AddressCard = ({
  address,
  selected,
  onSelect,
  onRemove,
  onEdit,
  onSetDefault,
  isCheckout = false,
}) => {
  // Force a boolean for isDefault (in case someone passed undefined)
  const isDefault = !!address.isDefault; // ← FIX

  // Icon based on addressType
  const icon =
    address.addressType?.toLowerCase() === 'work' ? (
      <BusinessIcon />
    ) : (
      <HomeIcon />
    );

  // In “checkout” mode, we show a radio button; otherwise we show action buttons
  const showButtons = onSelect ? selected : true;
  const showSetDefault =
    !isCheckout && onSetDefault && !isDefault && showButtons;

  // Handler for container click
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(address.id);
    }
  };

  // Content portion (common)
  const content = (
    <Box>
      {/* Top row: Icon + Name + “AddressType” chip */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            mr: 2,
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(193, 121, 18, 0.1)',
            color: 'custom.highlight',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ lineHeight: 1.2 }}
        >
          {address.name || 'Name Not Provided'}
        </Typography>
        {address.addressType && (
          <Chip
            label={address.addressType.toUpperCase()}
            size="small"
            icon={<LocationOnIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              ml: 2,
              bgcolor: 'transparent',
              border: '1px solid #d4d4d4',
              borderRadius: 4,
              color: 'text.secondary',
              height: 28,
              fontSize: '0.75rem',
              fontWeight: 'medium',
            }}
          />
        )}
      </Box>

      {/* Address Details */}
      <Box sx={{ mt: 2 }}>
        {address.street && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {address.street}
          </Typography>
        )}
        {(address.city || address.zip) && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {address.city} {address.zip ? `- ${address.zip}` : ''}
          </Typography>
        )}
        {address.state && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {address.state}
          </Typography>
        )}
        {address.country && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {address.country}
          </Typography>
        )}
        {address.mobile && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            <strong>Mobile:</strong> {address.mobile}
          </Typography>
        )}
      </Box>

      {/* Action buttons appear only if showButtons = true */}
      {showButtons && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {showSetDefault && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefault(address.id);
                }}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 'medium',
                  borderRadius: 2,
                  fontSize: '0.7rem',
                  color: 'custom.highlight',
                  borderColor: 'custom.highlight',
                  '&:hover': {
                    backgroundColor: 'rgba(193, 121, 18, 0.05)',
                    borderColor: 'custom.highlight',
                  },
                }}
              >
                Set as default
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address.id);
              }}
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'medium',
                borderRadius: 2,
                fontSize: '0.7rem',
                color: 'info.main',
                borderColor: 'info.light',
                '&:hover': {
                  backgroundColor: 'info.lightest',
                  borderColor: 'info.main',
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(address.id);
              }}
              sx={{
                color: 'error.main',
                borderColor: 'error.light',
                textTransform: 'uppercase',
                fontWeight: 'medium',
                borderRadius: 2,
                fontSize: '0.7rem',
                '&:hover': {
                  backgroundColor: 'error.lightest',
                  borderColor: 'error.main',
                },
              }}
            >
              Remove
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  // ─────────── Checkout mode: show a radio button to pick this address ───────────
  if (isCheckout && onSelect) {
    return (
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: selected ? 'custom.highlight' : 'shades.light',
          transition: 'all 0.3s ease',
          backgroundColor: selected
            ? 'rgba(193, 121, 18, 0.03)'
            : 'white',
          cursor: 'pointer',
        }}
        onClick={handleCardClick}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'start',
            gap: 2,
          }}
        >
          <Radio
            checked={!!selected}       // ← FIX: ensure checked is boolean
            onChange={() => onSelect(address.id)}
            value={address.id}
            name="address-selection"
            color="secondary"
          />
          {content}
        </Box>
      </Paper>
    );
  }

  // ─────────── Normal (non‐checkout) mode ───────────
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: selected ? 'custom.highlight' : 'shades.light',
        transition: 'all 0.3s ease',
        backgroundColor: selected
          ? 'rgba(193, 121, 18, 0.03)'
          : 'white',
        cursor: onSelect ? 'pointer' : 'default',
      }}
      onClick={handleCardClick}
    >
      {content}
    </Paper>
  );
};

export default AddressCard;

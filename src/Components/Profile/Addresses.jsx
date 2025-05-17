import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import { AddAddressForm, AddressCard } from '../index';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/profileSlice';

const Addresses = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const addresses = profile?.addresses || [];

  // State for editing/adding
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Helper to update addresses in the profile
  const saveAddresses = async (newAddresses) => {
    const updatedProfileData = { ...profile, addresses: newAddresses };
    await dispatch(updateProfile({ userId: profile.id, profileData: updatedProfileData }));
  };

  // Save (create/edit) an address
  const handleSaveAddress = async (formData) => {
    const newAddress = { ...formData };
    let updatedAddresses = [];

    // If editing
    if (editData !== null && editIndex !== null) {
      if (newAddress.isDefault) {
        updatedAddresses = addresses.map((addr, i) =>
          i === editIndex ? newAddress : { ...addr, isDefault: false }
        );
      } else {
        updatedAddresses = addresses.map((addr, i) =>
          i === editIndex ? newAddress : addr
        );
      }
    } else {
      // If adding
      if (newAddress.isDefault) {
        // Unset default on all existing addresses
        updatedAddresses = addresses.map((addr) => ({ ...addr, isDefault: false }));
      } else {
        updatedAddresses = [...addresses];
      }
      // Provide a unique id if needed
      newAddress.id = newAddress.id || String(Date.now());
      updatedAddresses.push(newAddress);
    }

    await saveAddresses(updatedAddresses);
    setEditIndex(null);
    setEditData(null);
    setShowAddForm(false);
  };

  // Edit an address
  const handleEditAddress = (address, index) => {
    setEditData(address);
    setEditIndex(index);
    setShowAddForm(false);
  };

  // Remove an address
  const handleRemoveAddress = async (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    await saveAddresses(updatedAddresses);
    if (index === editIndex) {
      setEditIndex(null);
      setEditData(null);
    }
  };

  // Set an address as default
  const handleSetDefault = async (index) => {
    const updatedAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    await saveAddresses(updatedAddresses);
  };

  const defaultIndex = addresses.findIndex((addr) => addr.isDefault);
  const otherIndices = addresses
    .map((addr, index) => ({ addr, index }))
    .filter(({ addr }) => !addr.isDefault);

  // ─────────────────────────────────────────────────────────────────────────────
  // If there are NO addresses, show the AddAddressForm directly
  // ─────────────────────────────────────────────────────────────────────────────
  if (addresses.length === 0) {
    return (
      <Paper>
        <AddAddressForm
          onSave={handleSaveAddress}
          onCancel={() => { }}
        />
      </Paper>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // If addresses exist, show them
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(to right, #fdf7ed, #fefaf4)',
          borderBottom: '1px solid',
          borderColor: 'shades.light',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ color: 'custom.highlight' }}
        >
          Saved Addresses
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your delivery addresses
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 4 }}>
        {/* Add New Address button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditIndex(null);
              setEditData(null);
              setShowAddForm(true);
            }}
            sx={{
              backgroundColor: 'custom.highlight',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 'medium',
              borderRadius: 1,
              '&:hover': { backgroundColor: 'custom.accent' },
            }}
          >
            Add New Address
          </Button>
        </Box>

        {/* Inline Add Form if user clicks "Add New Address" */}
        {showAddForm && (
          <Box sx={{ mb: 4 }}>
            <AddAddressForm
              onSave={handleSaveAddress}
              onCancel={() => setShowAddForm(false)}
            />
          </Box>
        )}

        {/* Default Address */}
        {defaultIndex !== -1 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: 'custom.highlight' }}
            >
              <StarIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />
              Default Address
            </Typography>
            <AddressCard
              address={addresses[defaultIndex]}
              onEdit={() => handleEditAddress(addresses[defaultIndex], defaultIndex)}
              onRemove={() => handleRemoveAddress(defaultIndex)}
              onSetDefault={() => { }}
            />
            {editIndex === defaultIndex && (
              <Box sx={{ mt: 2, ml: 4 }}>
                <AddAddressForm
                  onSave={handleSaveAddress}
                  onCancel={() => {
                    setEditIndex(null);
                    setEditData(null);
                  }}
                  initialData={editData}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Other Addresses */}
        {otherIndices.length > 0 && (
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Other Addresses
            </Typography>
            {otherIndices.map(({ addr, index }) => (
              <Box key={index} sx={{ mb: 4 }}>
                <AddressCard
                  address={addr}
                  onEdit={() => handleEditAddress(addr, index)}
                  onRemove={() => handleRemoveAddress(index)}
                  onSetDefault={() => handleSetDefault(index)}
                />
                {editIndex === index && (
                  <Box sx={{ mt: 2, ml: 4 }}>
                    <AddAddressForm
                      onSave={handleSaveAddress}
                      onCancel={() => {
                        setEditIndex(null);
                        setEditData(null);
                      }}
                      initialData={editData}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Addresses;

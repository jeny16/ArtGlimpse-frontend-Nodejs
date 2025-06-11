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
  // Note: we’ll ensure that editData, when used, always has a defined isDefault field
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null); 
  const [showAddForm, setShowAddForm] = useState(false);

  // Helper to update addresses in the profile
  const saveAddresses = async (newAddresses) => {
    const updatedProfileData = { ...profile, addresses: newAddresses };
    await dispatch(updateProfile({ userId: profile._id, profileData: updatedProfileData }));
  };

  // Save (create/edit) an address
  const handleSaveAddress = async (formData) => {
    // Ensure that formData.isDefault is always a boolean (it may come from AddAddressForm)
    const newAddress = { 
      ...formData,
      isDefault: !!formData.isDefault  // ← FIX: force a boolean
    };

    let updatedAddresses = [];

    // If editing
    if (editData !== null && editIndex !== null) {
      if (newAddress.isDefault) {
        // Unset isDefault on all others, set on the edited one
        updatedAddresses = addresses.map((addr, i) =>
          i === editIndex
            ? newAddress
            : { ...addr, isDefault: false }  // ← FIX: force every other addr.isDefault = false
        );
      } else {
        updatedAddresses = addresses.map((addr, i) =>
          i === editIndex ? newAddress : addr
        );
      }
    } else {
      // If adding a brand new address
      if (newAddress.isDefault) {
        // Unset default on all existing addresses
        updatedAddresses = addresses.map((addr) => ({
          ...addr,
          isDefault: false  // ← FIX: force boolean
        }));
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
    // When we load `address` into editData, ensure it has isDefault always defined:
    setEditData({
      ...address,
      isDefault: !!address.isDefault  // ← FIX: force boolean
    });
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
      isDefault: i === index  // ← FIX: always produce true/false
    }));
    await saveAddresses(updatedAddresses);
  };

  // Find which address is marked default
  const defaultIndex = addresses.findIndex((addr) => !!addr.isDefault); // ← FIX: coerce to boolean
  // All others that are not default
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
          onCancel={() => {}}
          // initialData is not provided, so AddAddressForm must fall back to empty defaults
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
              // No initialData (so AddAddressForm must use its own defaults)
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
              address={{
                ...addresses[defaultIndex],
                isDefault: !!addresses[defaultIndex].isDefault  // ← FIX: force boolean
              }}
              onEdit={() =>
                handleEditAddress(addresses[defaultIndex], defaultIndex)
              }
              onRemove={() => handleRemoveAddress(defaultIndex)}
              onSetDefault={() => {}}
            />
            {editIndex === defaultIndex && (
              <Box sx={{ mt: 2, ml: 4 }}>
                <AddAddressForm
                  onSave={handleSaveAddress}
                  onCancel={() => {
                    setEditIndex(null);
                    setEditData(null);
                  }}
                  initialData={{
                    ...editData,
                    isDefault: !!editData.isDefault, // ← FIX: force boolean
                  }}
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
                  address={{
                    ...addr,
                    isDefault: !!addr.isDefault  // ← FIX: force boolean
                  }}
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
                      initialData={{
                        ...editData,
                        isDefault: !!editData.isDefault, // ← FIX: force boolean
                      }}
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

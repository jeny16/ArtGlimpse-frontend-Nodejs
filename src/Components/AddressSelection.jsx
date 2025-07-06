import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { fetchProfile, updateProfile } from '../store/profileSlice';
import { AddAddressForm, AddressCard } from '../Components/index';

const AddressSelection = ({ selectedAddress, setSelectedAddress }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);

  // Fetch profile on mount if not already loaded
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [profile, dispatch]);

  // Don’t render the address UI until profile is loaded
  if (!profile || !profile._id) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1">Loading your addresses…</Typography>
      </Box>
    );
  }

  // Ensure every address has an id and a defined isDefault (boolean)
  const addresses = (profile.addresses || []).map((addr, index) => ({
    id: addr.id || index.toString(),
    isDefault: !!addr.isDefault,
    ...addr,
  }));

  // Local state for editing or adding addresses
  const [editAddressId, setEditAddressId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mobile: "",
    isDefault: false,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Auto‐select default or first available address if none is selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
  };

  const handleRemove = (id) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id);
    const updatedProfile = { ...profile, addresses: updatedAddresses };
    dispatch(updateProfile({ userId: profile._id, profileData: updatedProfile }));
    if (selectedAddress && selectedAddress.id === id) {
      setSelectedAddress(null);
    }
  };

  const handleEditAddress = (id, addressData) => {
    setEditAddressId(id);
    setEditData({
      ...addressData,
      isDefault: !!addressData.isDefault,
    });
    setShowAddForm(false);
  };

  const handleSaveAddress = (formData) => {
    // Always coerce formData.isDefault to boolean
    const normalizedForm = { ...formData, isDefault: !!formData.isDefault };
    let updatedAddresses = [];

    if (editAddressId !== null) {
      // Edit existing address
      updatedAddresses = addresses.map((addr) =>
        addr.id === editAddressId ? { ...addr, ...normalizedForm } : addr
      );
    } else {
      // Add new address
      if (normalizedForm.isDefault) {
        updatedAddresses = addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      } else {
        updatedAddresses = [...addresses];
      }
      const newAddress = {
        ...normalizedForm,
        id: normalizedForm.id || String(Date.now()),
      };
      updatedAddresses.push(newAddress);
    }

    const updatedProfile = { ...profile, addresses: updatedAddresses };
    dispatch(updateProfile({ userId: profile._id, profileData: updatedProfile }));

    // Reset form state
    setEditAddressId(null);
    setEditData({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      mobile: "",
      isDefault: false,
    });
    setShowAddForm(false);

    // Auto‐select newly added address if none selected
    if (!selectedAddress) {
      setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]);
    }
  };

  const handleCancelEdit = () => {
    setEditAddressId(null);
    setEditData({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      mobile: "",
      isDefault: false,
    });
    setShowAddForm(false);
  };

  const handleSetDefault = (id) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    const updatedProfile = { ...profile, addresses: updatedAddresses };
    dispatch(updateProfile({ userId: profile._id, profileData: updatedProfile }));
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.custom.highlight,
            fontSize: '18px',
          }}
        >
          Select Delivery Address
        </Typography>
        {addresses.length > 0 && (
          <Button
            variant="outlined"
            sx={{
              textTransform: 'uppercase',
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: '4px',
              color: theme.palette.custom.highlight,
              borderColor: theme.palette.custom.highlight,
              '&:hover': {
                backgroundColor: 'transparent',
                borderColor: theme.palette.custom.accent,
              },
            }}
            onClick={() => {
              setEditAddressId(null);
              setEditData({
                name: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
                mobile: "",
                isDefault: false,
              });
              setShowAddForm(true);
            }}
          >
            Add New Address
          </Button>
        )}
      </Box>

      {addresses.length === 0 ? (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            No addresses available. Please add a new address below.
          </Typography>
          <AddAddressForm
            sx={{ width: '100%' }}
            onSave={handleSaveAddress}
            onCancel={() => {}}
          />
        </Box>
      ) : (
        <>
          {/* Default Address Section */}
          {addresses.find((addr) => addr.isDefault) && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: '#666',
                  textTransform: 'uppercase',
                  fontSize: '13px',
                }}
              >
                Default Address
              </Typography>
              <AddressCard
                address={addresses.find((addr) => addr.isDefault)}
                selected={
                  selectedAddress &&
                  selectedAddress.id === addresses.find((addr) => addr.isDefault).id
                }
                onSelect={() =>
                  handleSelect(addresses.find((addr) => addr.isDefault))
                }
                onRemove={() =>
                  handleRemove(addresses.find((addr) => addr.isDefault).id)
                }
                onEdit={() =>
                  handleEditAddress(
                    addresses.find((addr) => addr.isDefault).id,
                    addresses.find((addr) => addr.isDefault)
                  )
                }
                onSetDefault={() =>
                  handleSetDefault(addresses.find((addr) => addr.isDefault).id)
                }
                isCheckout
              />
              {editAddressId === addresses.find((addr) => addr.isDefault).id && (
                <Box sx={{ mt: 2 }}>
                  <AddAddressForm
                    sx={{ width: '100%' }}
                    onSave={handleSaveAddress}
                    onCancel={handleCancelEdit}
                    initialData={editData}
                  />
                </Box>
              )}
            </Box>
          )}

          {/* Other Addresses Section */}
          {addresses.filter((addr) => !addr.isDefault).length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: '#666',
                  textTransform: 'uppercase',
                  fontSize: '13px',
                }}
              >
                Other Addresses
              </Typography>
              {addresses
                .filter((addr) => !addr.isDefault)
                .map((addr) => (
                  <Box key={addr.id} sx={{ mb: 2 }}>
                    <AddressCard
                      address={addr}
                      selected={selectedAddress && selectedAddress.id === addr.id}
                      onSelect={() => handleSelect(addr)}
                      onRemove={() => handleRemove(addr.id)}
                      onEdit={() => handleEditAddress(addr.id, addr)}
                      onSetDefault={() => handleSetDefault(addr.id)}
                      isCheckout
                    />
                    {editAddressId === addr.id && (
                      <Box sx={{ mt: 2, ml: 2 }}>
                        <AddAddressForm
                          sx={{ width: '100%' }}
                          onSave={handleSaveAddress}
                          onCancel={handleCancelEdit}
                          initialData={editData} // ← FIX: editData always has isDefault boolean
                        />
                      </Box>
                    )}
                  </Box>
                ))}
            </Box>
          )}

          {/* Inline Add Address Form for new address */}
          {showAddForm && !editAddressId && (
            <Box sx={{ mb: 3, width: '100%' }}>
              <AddAddressForm
                sx={{ width: '100%' }}
                onSave={handleSaveAddress}
                onCancel={handleCancelEdit}
                initialData={{
                  name: "",
                  street: "",
                  city: "",
                  state: "",
                  zip: "",
                  country: "",
                  mobile: "",
                  isDefault: false, // ← FIX: always pass a defined boolean
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AddressSelection;

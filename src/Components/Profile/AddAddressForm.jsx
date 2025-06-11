import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  FormControlLabel,
  Divider,
  RadioGroup,
  FormLabel,
  Stack,
  Radio,
  Checkbox
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { FormField } from '../index';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';

const AddAddressForm = ({ onSave, onCancel, initialData }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? { 
          ...initialData, 
          isDefault: initialData.isDefault ?? false  // ← FIX: ensure boolean
        }
      : {
          addressType: 'HOME',
          isDefault: false,  // ← FIX: start as a defined boolean
          name: '',
          mobile: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
  });

  useEffect(() => {
    if (initialData) {
      // If initialData omitted some fields, fill them with defined defaults
      reset({
        addressType: initialData.addressType ?? 'HOME',        // ← FIX
        isDefault: initialData.isDefault ?? false,             // ← FIX
        name: initialData.name ?? '',                          // ← FIX
        mobile: initialData.mobile ?? '',
        street: initialData.street ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        zip: initialData.zip ?? '',
        country: initialData.country ?? '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    // Ensure isDefault is a boolean
    data.isDefault = !!data.isDefault; // ← FIX: coerce to boolean
    onSave(data);
  };

  return (
    <Paper
      sx={{
        p: 4,
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'shades.light',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 3, color: 'custom.highlight' }}
      >
        {initialData ? 'Edit Address' : 'Add a New Address'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* ─────────── Address Type (HOME / WORK) ─────────── */}
            <Controller
              name="addressType"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormLabel
                    component="legend"
                    sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}
                  >
                    Address Type
                  </FormLabel>
                  <RadioGroup {...field} row>
                    <Stack direction="row" spacing={2}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor:
                            field.value === 'HOME'
                              ? 'custom.highlight'
                              : 'shades.light',
                          backgroundColor:
                            field.value === 'HOME'
                              ? 'rgba(193, 121, 18, 0.03)'
                              : 'transparent',
                          width: 120,
                        }}
                      >
                        <FormControlLabel
                          value="HOME"
                          control={
                            <Radio
                              // NO need for defaultChecked—RadioGroup already controls value
                              sx={{
                                color: 'shades.medium',
                                '&.Mui-checked': {
                                  color: 'custom.highlight',
                                },
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <HomeIcon
                                sx={{
                                  mr: 1,
                                  fontSize: 18,
                                  color:
                                    field.value === 'HOME'
                                      ? 'custom.highlight'
                                      : 'shades.dark',
                                }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight={
                                  field.value === 'HOME' ? 600 : 400
                                }
                              >
                                Home
                              </Typography>
                            </Box>
                          }
                          sx={{ mx: 1 }}
                        />
                      </Paper>

                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor:
                            field.value === 'WORK'
                              ? 'custom.highlight'
                              : 'shades.light',
                          backgroundColor:
                            field.value === 'WORK'
                              ? 'rgba(193, 121, 18, 0.03)'
                              : 'transparent',
                          width: 120,
                        }}
                      >
                        <FormControlLabel
                          value="WORK"
                          control={
                            <Radio
                              sx={{
                                color: 'shades.medium',
                                '&.Mui-checked': {
                                  color: 'custom.highlight',
                                },
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <BusinessIcon
                                sx={{
                                  mr: 1,
                                  fontSize: 18,
                                  color:
                                    field.value === 'WORK'
                                      ? 'custom.highlight'
                                      : 'shades.dark',
                                }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight={
                                  field.value === 'WORK' ? 600 : 400
                                }
                              >
                                Work
                              </Typography>
                            </Box>
                          }
                          sx={{ mx: 1 }}
                        />
                      </Paper>
                    </Stack>
                  </RadioGroup>
                </Box>
              )}
            />
          </Grid>

          {/* ─────────── Full Name ─────────── */}
          <Grid item xs={12}>
            <FormField
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              register={register}
              error={errors.name}
              helperText={errors.name?.message}
              validationRules={{ required: 'Name is required' }}
              inputProps={{
                // Always pass a defined `value` internally (FormField should do value={...})
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>

          {/* ─────────── Mobile Number ─────────── */}
          <Grid item xs={12}>
            <FormField
              name="mobile"
              label="Mobile Number"
              placeholder="Enter 10 digit mobile number"
              register={register}
              error={errors.mobile}
              helperText={errors.mobile?.message}
              validationRules={{
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Enter a valid 10-digit mobile number',
                },
              }}
              inputProps={{
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>

          {/* ─────────── Street / Area ─────────── */}
          <Grid item xs={12}>
            <FormField
              name="street"
              label="Address (House No, Building, Street, Area)"
              placeholder="Enter your complete address"
              register={register}
              error={errors.street}
              helperText={errors.street?.message}
              validationRules={{
                required: 'Address is required',
              }}
              multiline
              rows={3}
              inputProps={{
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>

          {/* ─────────── City ─────────── */}
          <Grid item xs={12} sm={6}>
            <FormField
              name="city"
              label="City / District"
              placeholder="Enter city"
              register={register}
              error={errors.city}
              helperText={errors.city?.message}
              validationRules={{ required: 'City is required' }}
              inputProps={{
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>

          {/* ─────────── State ─────────── */}
          <Grid item xs={12} sm={6}>
            <FormField
              name="state"
              label="State"
              placeholder="Enter state"
              register={register}
              error={errors.state}
              helperText={errors.state?.message}
              validationRules={{ required: 'State is required' }}
              inputProps={{
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>

          {/* ─────────── ZIP / PIN ─────────── */}
          <Grid item xs={12} sm={6}>
            <FormField
              name="zip"
              label="PIN / ZIP Code"
              placeholder="Enter 6 digit PIN code"
              register={register}
              error={errors.zip}
              helperText={errors.zip?.message}
              validationRules={{
                required: 'PIN code is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Enter a valid 6-digit PIN code',
                },
              }}
              inputProps={{
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>

          {/* ─────────── Country ─────────── */}
          <Grid item xs={12} sm={6}>
            <FormField
              name="country"
              label="Country"
              placeholder="Enter country"
              register={register}
              error={errors.country}
              helperText={errors.country?.message}
              validationRules={{
                required: 'Country is required',
              }}
              inputProps={{
                sx: {
                  borderRadius: 1,
                  '&:focus': {
                    borderColor: 'custom.highlight',
                    boxShadow: '0 0 0 2px rgba(193, 121, 18, 0.2)',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* ─────────── Make Default Checkbox ─────────── */}
        <Box>
          {/* 
            Instead of <Checkbox {...register('isDefault')} defaultChecked={…} />,
            we use <Controller> so that `checked` is always explicitly `true/false`. 
          */}
          <Controller
            name="isDefault"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!field.value}                  // ← FIX: force boolean
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={{
                      color: 'shades.medium',
                      '&.Mui-checked': {
                        color: 'custom.highlight',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(193, 121, 18, 0.05)',
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500 }}
                  >
                    Make this my default address
                  </Typography>
                }
                sx={{ color: 'text.primary' }}
              />
            )}
          />
          <Typography
            variant="caption"
            sx={{ display: 'block', ml: 4, mt: -0.5, color: 'text.secondary' }}
          >
            All future orders will be delivered to this address unless changed at checkout
          </Typography>
        </Box>

        {/* ─────────── Buttons: Cancel / Save ─────────── */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              mr: 2,
              borderColor: 'shades.light',
              color: 'text.primary',
              textTransform: 'uppercase',
              fontWeight: 500,
              borderRadius: 1,
              py: 1,
              px: 3,
              fontSize: '0.8rem',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderColor: 'shades.medium',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: 'custom.highlight',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 500,
              borderRadius: 1,
              py: 1,
              px: 4,
              fontSize: '0.8rem',
              '&:hover': {
                backgroundColor: 'custom.accent',
              },
            }}
          >
            Save Address
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddAddressForm;

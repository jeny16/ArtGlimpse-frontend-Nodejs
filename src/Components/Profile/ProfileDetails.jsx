import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ContactsIcon from '@mui/icons-material/Contacts';
import { FormField } from '../index';
import { updateProfile, fetchProfile } from '../../store/profileSlice';

const ProfileHeader = ({ userData }) => (
    <Box
        sx={{
            p: 4,
            textAlign: 'center',
            backgroundImage: 'linear-gradient(to right, #fdf7ed, #fefaf4)',
            borderBottom: '1px solid',
            borderColor: 'shades.light'
        }}
    >
        <Avatar
            sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'custom.highlight',
                boxShadow: '0 4px 12px rgba(193, 121, 18, 0.3)'
            }}
        >
            {userData?.username ? userData.username.charAt(0).toUpperCase() : 'NA'}
        </Avatar>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'custom.highlight', mb: 1 }}>
            Profile Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Manage your personal information
        </Typography>
    </Box>
);

const ProfileFieldDisplay = ({ label, value, icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, borderBottom: '1px solid #f0f0f0' }}>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(193, 121, 18, 0.1)',
                color: 'custom.highlight',
                mr: 2
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            <Typography
                variant="body1"
                fontWeight={value !== 'NA' ? 'medium' : 'regular'}
                color={value !== 'NA' ? 'text.primary' : 'text.secondary'}
            >
                {value}
            </Typography>
        </Box>
    </Box>
);

const ProfileDetailsForm = ({ register, errors, handleSubmit, onSubmit, onCancel }) => (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <FormField
                    label="Full Name"
                    name="username"
                    placeholder="Enter full name"
                    register={register}
                    error={errors.username}
                    helperText={errors.username?.message}
                    rules={{ required: 'Full name is required' }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormField
                    label="Mobile Number"
                    name="mobile"
                    placeholder="Enter mobile number"
                    register={register}
                    error={errors.mobile}
                    helperText={errors.mobile?.message}
                    rules={{
                        required: 'Mobile number is required',
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Enter a valid 10-digit mobile number'
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormField
                    label="Email ID"
                    name="email"
                    placeholder="Enter email"
                    type="email"
                    register={register}
                    error={errors.email}
                    helperText={errors.email?.message}
                    autoComplete="email"
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Enter a valid email'
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormField
                    label="Gender"
                    name="gender"
                    placeholder="Enter gender"
                    register={register}
                    error={errors.gender}
                    helperText={errors.gender?.message}
                    rules={{ required: 'Gender is required' }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormField
                    label="Date of Birth"
                    name="dateOfBirth"
                    placeholder="YYYY-MM-DD"
                    register={register}
                    error={errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    rules={{
                        required: 'Date of birth is required',
                        pattern: {
                            value: /^\d{4}-\d{2}-\d{2}$/,
                            message: 'Enter date in YYYY-MM-DD format'
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormField
                    label="Alternate Mobile"
                    name="alternateMobile"
                    placeholder="Enter alternate mobile"
                    register={register}
                    error={errors.alternateMobile}
                    helperText={errors.alternateMobile?.message}
                    rules={{
                        required: 'Alternate mobile is required',
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Enter a valid 10-digit mobile number'
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormField
                    label="Hint Name"
                    name="hintName"
                    placeholder="Enter hint name"
                    register={register}
                    error={errors.hintName}
                    helperText={errors.hintName?.message}
                    rules={{ required: 'Hint name is required' }}
                />
            </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2, textAlign: 'center' }}>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: 'custom.highlight',
                    color: 'white',
                    textTransform: 'uppercase',
                    fontWeight: 'medium',
                    borderRadius: 1,
                }}
            >
                Save
            </Button>
            <Button
                variant="outlined"
                sx={{
                    borderColor: 'custom.highlight',
                    color: 'custom.highlight',
                    textTransform: 'uppercase',
                    fontWeight: 'medium',
                    borderRadius: 1,
                }}
                onClick={onCancel}
            >
                Cancel
            </Button>
        </Box>
    </Box>
);

const ProfileDetails = () => {
    const dispatch = useDispatch();
    const { profile: userData, loading } = useSelector(state => state.profile);
    const auth = useSelector(state => state.auth);
    const userId = auth.userData?.userId || auth.userData?._id;
    const [editing, setEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            username: userData?.username || '',
            mobile: userData?.mobile || '',
            email: userData?.email || '',
            gender: userData?.gender || '',
            dateOfBirth: userData?.dateOfBirth || '',
            alternateMobile: userData?.alternateMobile || '',
            hintName: userData?.hintName || ''
        }
    });

    useEffect(() => {
        // If userData is missing, fetch it
        if (userId && !userData) {
            dispatch(fetchProfile({ userId }));
        }
    }, [dispatch, userId, userData]);

    // Reset form whenever userData changes
    useEffect(() => {
        reset({
            username: userData?.username || '',
            mobile: userData?.mobile || '',
            email: userData?.email || '',
            gender: userData?.gender || '',
            dateOfBirth: userData?.dateOfBirth || '',
            alternateMobile: userData?.alternateMobile || '',
            hintName: userData?.hintName || ''
        });
    }, [userData, reset]);

    const onSubmit = async (data) => {
        try {
            if (userId) {
                // Merge new data with existing userData to preserve other fields
                const mergedData = { ...userData, ...data };
                await dispatch(updateProfile({ userId, profileData: mergedData }));
                setEditing(false);
            }
        } catch (error) {
            console.error('Profile update failed', error);
        }
    };

    const getValue = (value) =>
        value && value.trim() !== '' ? value : 'NA';

    const viewFields = [
        { label: 'Full Name', value: getValue(userData?.username), icon: <PersonIcon /> },
        { label: 'Mobile Number', value: getValue(userData?.mobile), icon: <PhoneIcon /> },
        { label: 'Email ID', value: getValue(userData?.email), icon: <EmailIcon /> },
        { label: 'Gender', value: getValue(userData?.gender), icon: <WcIcon /> },
        { label: 'Date of Birth', value: getValue(userData?.dateOfBirth), icon: <CakeIcon /> },
        { label: 'Alternate Mobile', value: getValue(userData?.alternateMobile), icon: <PhoneAndroidIcon /> },
        { label: 'Hint Name', value: getValue(userData?.hintName), icon: <ContactsIcon /> }
    ];

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <ProfileHeader userData={userData} />
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
                {editing ? (
                    <ProfileDetailsForm
                        register={(name, rules) => register(name, rules)}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        onCancel={() => {
                            reset();
                            setEditing(false);
                        }}
                    />
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {viewFields.map((field, index) => (
                                <Grid item xs={12} key={index}>
                                    <ProfileFieldDisplay label={field.label} value={field.value} icon={field.icon} />
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                sx={{
                                    backgroundColor: 'custom.highlight',
                                    color: 'white',
                                    textTransform: 'uppercase',
                                    fontWeight: 'medium',
                                    borderRadius: 1,
                                }}
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
};

export default ProfileDetails;

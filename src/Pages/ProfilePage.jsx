import React, { useEffect } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { ProfileSidebar } from '../Components/index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/profileSlice';
import { Outlet, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.profile);
  const auth = useSelector(state => state.auth);
  const userId = auth.userData?.userId || auth.userData?._id;

  const location = useLocation();
  // Determine active section from URL; expecting URL like /profile/<section>
  const pathParts = location.pathname.split('/');
  const activeSection = pathParts[2] || 'profile';

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile({ userId }));
    }
  }, [dispatch, userId]);

  if (!userId) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" align="center">
          Please login to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5, my: 20 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #fdf7ed 0%, #fefaf4 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          borderLeft: '4px solid',
          borderColor: 'custom.highlight',
          transition: 'all 0.3s ease'
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          sx={{
            color: 'custom.highlight',
            mb: 1,
            fontFamily: 'Raleway, sans-serif',
          }}
        >
          My Account
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            mt: 2
          }}
        >
          {profile?.username ? `Welcome back, ${profile.username}` : 'Welcome back'}
        </Typography>
      </Paper>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography>Error: {error}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>
            <ProfileSidebar activeSection={activeSection} user={profile} />
          </Box>
          <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'calc(100% - 320px)' } }}>
            {/* Pass profile to child routes via Outlet context */}
            <Outlet context={{ profile }} />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;

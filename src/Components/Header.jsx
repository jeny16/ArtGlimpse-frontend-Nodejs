// src/components/Header.jsx

import React, { memo, useState } from 'react';
import { Search, Menu as MenuIcon, X as CloseIcon, Heart, ShoppingCart, User } from 'lucide-react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogActions,
  Drawer,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.neutral.light,
  boxShadow: 'none',
  borderBottom: '1px solid #dbd4c7'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.neutral.main,
  fontWeight: 500,
  textTransform: 'none',
  width: '100%',
  justifyContent: 'flex-start',
  padding: '8px 16px',
  '&:hover': { backgroundColor: 'transparent', color: '#000' },
  '&.MuiButtonBase-root': { disableRipple: true }
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.highlight,
  '&:hover': { backgroundColor: 'transparent', color: theme.palette.custom.accent }
}));

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const products = useSelector(state => state.product.products);
  const filteredProducts = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleWishlistClick = () => {
    // if (!isLoggedIn) setLoginDialogOpen(true);
    // else navigate('/wishlist');
    navigate(isLoggedIn ? '/wishlist' : '/login')
  };

  const renderIcons = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
      <IconWrapper onClick={handleWishlistClick}><Heart size={24} /></IconWrapper>
      <Link to="/cart"><IconWrapper><ShoppingCart size={24} /></IconWrapper></Link>
      <IconWrapper onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}>
        <User size={24} />
      </IconWrapper>
    </Box>
  );

  const renderMobileMenu = () => (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box
        width="250px"
        role="presentation"
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display="flex" justifyContent="flex-end" p={2}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: theme.palette.neutral.light }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {['Home', 'Shop', 'About Us', 'Contact'].map((label, i) => (
          <Link key={i} to={['/', '/shop', '/aboutUs', '/contact'][i]} style={{ width: '100%' }}>
            <StyledButton onClick={() => setDrawerOpen(false)}>{label}</StyledButton>
          </Link>
        ))}
        <Box sx={{
          borderTop: '1px solid #dbd4c7',
          mt: 2,
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <StyledButton startIcon={<Heart size={20} />} onClick={() => { setDrawerOpen(false); handleWishlistClick(); }}>
            Wishlist
          </StyledButton>
          <Link to="/cart"><StyledButton startIcon={<ShoppingCart size={20} />} onClick={() => setDrawerOpen(false)}>
            Cart
          </StyledButton></Link>
          <StyledButton
            startIcon={<User size={20} />}
            onClick={() => {
              setDrawerOpen(false);
              navigate(isLoggedIn ? '/profile' : '/login');
            }}
          >
            {isLoggedIn ? 'Profile' : 'Login'}
          </StyledButton>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Container>
          <Box display="flex" alignItems="center" justifyContent="space-between" py={3} px={1}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'serif', color: theme.palette.custom.highlight, fontWeight: 'bold' }}
              >
                ArtGlimpse
              </Typography>
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
              {['Home', 'Shop', 'About Us', 'Contact'].map((label, i) => (
                <Link key={i} to={['/', '/shop', '/aboutUs', '/contact'][i]}>
                  <StyledButton>{label}</StyledButton>
                </Link>
              ))}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              <Box position="relative">
                <TextField
                  size="small"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products, categories..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
                    sx: { paddingInline: '10px', fontSize: '14px' }
                  }}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '50px',
                    border: '1px solid #dbd4c7',
                    '& .MuiOutlinedInput-root fieldset': { border: 'none' },
                    '& input::placeholder': { color: theme.palette.secondary.main, fontStyle: 'italic' }
                  }}
                />
                {searchQuery && filteredProducts.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      zIndex: 10,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      maxHeight: 300,
                      overflowY: 'auto'
                    }}
                  >
                    {filteredProducts.map(p => (
                      <Box
                        key={p.id}
                        sx={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: theme.palette.action.hover }
                        }}
                        onClick={() => {
                          setSearchQuery('');
                          navigate(`/product/${p.id}`);
                        }}
                      >
                        <Typography variant="body2">{p.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              {renderIcons()}
            </Box>
            <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>
      </StyledAppBar>
      {renderMobileMenu()}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Please log in to view your wishlist</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setLoginDialogOpen(false); navigate('/login'); }}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(Header);

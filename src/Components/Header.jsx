import React, { memo, useState } from 'react';
import { Search, Menu as MenuIcon, X as CloseIcon, Heart, ShoppingCart, User } from 'lucide-react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from "react-redux";

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
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#000'
  },
  '&.MuiButtonBase-root': {
    disableRipple: true
  }
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.highlight,
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.custom.accent
  }
}));

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get isLoggedIn from Redux and products list for search filtering
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const products = useSelector((state) => state.product.products);

  // Filter products using the search query (simple filtering on product name)
  const filteredProducts = searchQuery.trim()
    ? products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const renderAuthButtons = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
      <Link to="/login">
        <Button
          variant="outlined"
          sx={{
            color: theme.palette.custom.highlight,
            borderColor: theme.palette.custom.highlight,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: theme.palette.custom.accent,
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.custom.highlight,
            textTransform: 'none',
            fontWeight: 500,
            color: '#fff',
            '&:hover': { backgroundColor: theme.palette.custom.accent }
          }}
        >
          Sign Up
        </Button>
      </Link>
    </Box>
  );

  const renderUserIcons = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
      <Link to="/wishlist">
        <IconWrapper>
          <Heart size={24} />
        </IconWrapper>
      </Link>
      <Link to="/cart">
        <IconWrapper>
          <ShoppingCart size={24} />
        </IconWrapper>
      </Link>
      <IconWrapper onClick={() => navigate("/profile")}>
        <User size={24} />
      </IconWrapper>
    </Box>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{ display: { xs: 'flex', md: 'none' } }}
    >
      {/* Mobile drawer content remains unchanged */}
      <Box
        width="250px"
        role="presentation"
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box display="flex" justifyContent="flex-end" p={2}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: theme.palette.neutral.light }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Link to="/" style={{ width: '100%' }}>
            <StyledButton onClick={() => setDrawerOpen(false)}>
              Home
            </StyledButton>
          </Link>
          <Link to="/shop" style={{ width: '100%' }}>
            <StyledButton onClick={() => setDrawerOpen(false)}>
              Shop
            </StyledButton>
          </Link>
          <Link to="/aboutUs" style={{ width: '100%' }}>
            <StyledButton onClick={() => setDrawerOpen(false)}>
              About Us
            </StyledButton>
          </Link>
          <Link to="/contact" style={{ width: '100%' }}>
            <StyledButton onClick={() => setDrawerOpen(false)}>
              Contact
            </StyledButton>
          </Link>
          {!isLoggedIn ? (
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link to="/login" style={{ width: '100%' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: theme.palette.custom.highlight,
                    borderColor: theme.palette.custom.highlight
                  }}
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup" style={{ width: '100%' }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    backgroundColor: theme.palette.custom.highlight,
                    color: '#fff'
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          ) : (
            <Box
              sx={{
                borderTop: '1px solid #dbd4c7',
                mt: 2,
                pt: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Link to="/wishlist" style={{ width: '100%' }}>
                <StyledButton
                  onClick={() => setDrawerOpen(false)}
                  startIcon={<Heart size={20} />}
                  sx={{
                    borderRadius: 1,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  Wishlist
                </StyledButton>
              </Link>
              <Link to="/cart" style={{ width: '100%' }}>
                <StyledButton
                  onClick={() => setDrawerOpen(false)}
                  startIcon={<ShoppingCart size={20} />}
                  sx={{
                    borderRadius: 1,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  Cart
                </StyledButton>
              </Link>
              <Link to="/profile" style={{ width: '100%' }}>
                <StyledButton
                  onClick={() => setDrawerOpen(false)}
                  startIcon={<User size={20} />}
                  sx={{
                    borderRadius: 1,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  Profile
                </StyledButton>
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Container>
          <Box display="flex" alignItems="center" py={3} px={1} justifyContent="space-between">
            <Link to='/' style={{ textDecoration: 'none' }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontFamily: 'serif',
                  color: theme.palette.custom.highlight,
                  fontWeight: 'bold'
                }}
              >
                ArtGlimpse
              </Typography>
            </Link>
            <Box display="flex" gap={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link to="/"><StyledButton>Home</StyledButton></Link>
              <Link to="/shop"><StyledButton>Shop</StyledButton></Link>
              <Link to="/aboutUs"><StyledButton>About Us</StyledButton></Link>
              <Link to="/contact"><StyledButton>Contact</StyledButton></Link>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
              {/* Search field with autocomplete */}
              <Box position="relative">
                <TextField
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, categories..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Search
                        size={20}
                        style={{ marginRight: 8, color: theme.palette.secondary.main }}
                      />
                    ),
                    sx: { paddingInline: '10px', fontSize: '14px' }
                  }}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '50px',
                    border: '1px solid #dbd4c7',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { borderColor: theme.palette.primary.dark },
                      '&.Mui-focused fieldset': { borderColor: theme.palette.custom.highlight }
                    },
                    '& input::placeholder': {
                      color: theme.palette.secondary.main,
                      fontStyle: 'italic'
                    }
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
                    {filteredProducts.map((product) => (
                      <Box
                        key={product.id}
                        onClick={() => {
                          setSearchQuery('');
                          navigate(`/product/${product.id}`);
                        }}
                        sx={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                      >
                        <Typography variant="body2">{product.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              {isLoggedIn ? renderUserIcons() : renderAuthButtons()}
            </Box>
            <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>
      </StyledAppBar>

      {renderMobileMenu()}
    </>
  );
};

export default memo(Header);

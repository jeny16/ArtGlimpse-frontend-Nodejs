import './App.css';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './Components/index';
import { memo, useEffect } from 'react';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const { token } = JSON.parse(storedUser);
        try {
          await axios.get('http://localhost:3000/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          dispatch(logout());
          localStorage.removeItem('user');
          console.error("Token validation failed, user has been logged out.", error);
        }
      }
    };

    validateToken();
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ flex: 1 }}>
        <Outlet />
        <ToastContainer position='top-right' />
      </Box>
      <Footer />
    </Box>
  );
}

export default memo(App);

import './App.css';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './Components/index';
import { memo, useEffect } from 'react';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { logout, login } from './store/authSlice';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
  const stored = localStorage.getItem('user');
  if (!stored) return;

  const userData = JSON.parse(stored);
  dispatch(login(userData));     

  axios.get('/auth/validate')   
    .catch(() => {
      dispatch(logout());
      localStorage.removeItem('user');
    });
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

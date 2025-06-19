import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthRoutes, MainRoutes } from './routes';
import { getUserProfile } from './store/slices/authSlice';
import apiClient from './config/api';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    // Check for stored auth token and set up axios headers
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(getUserProfile()).unwrap()
        .catch(() => {
          // If getting user profile fails, clear the token and headers
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['Authorization'];
        });
      // If on an auth page, redirect to products
      if (isAuthPage) {
        navigate('/products');
      }
    }
  }, [dispatch, isAuthPage, navigate]);

  if (isAuthPage) {
    return <AuthRoutes />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      
      <Box flex="1" as="main">
        <MainRoutes />
      </Box>
      
      <Footer />
    </Box>
  );
}

export default App;
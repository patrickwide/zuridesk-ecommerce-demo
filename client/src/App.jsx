import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthRoutes, MainRoutes } from './routes';
import { getUserProfile } from './store/slices/authSlice';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    // Check for stored auth token and fetch user profile if it exists
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserProfile());
    }
  }, [dispatch]);

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
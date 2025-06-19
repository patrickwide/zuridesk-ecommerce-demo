import React from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthRoutes, MainRoutes } from './routes';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

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
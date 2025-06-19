import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={useColorModeValue('gray.200', 'gray.700')}
            color="blue.500"
            size="xl"
          />
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Verifying authentication...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="60vh">
        <Text color="red.500">
          Authentication error: {error}
        </Text>
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    // If admin route but user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
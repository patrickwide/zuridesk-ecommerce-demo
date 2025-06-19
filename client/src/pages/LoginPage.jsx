import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  useToast,
  Stack,
  Text,
  Heading,
  Checkbox,
  Divider,
  useColorModeValue,
  Center,
  Icon,
  Container,
} from '@chakra-ui/react';
import { loginSchema } from '../utils/validationSchemas';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
    // Clear any previous auth errors when component mounts
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(login(values));
      if (login.fulfilled.match(resultAction)) {
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={{ base: 8, md: 16 }}
      px={4}
    >
      <Container maxW="md" py={{ base: 6, md: 8 }}>
        <Stack spacing={8} w="full">
          <Stack align="center" spacing={{ base: 2, md: 3 }}>
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              color={useColorModeValue('gray.900', 'white')}
            >
              Welcome back
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={useColorModeValue('gray.600', 'gray.400')}>
              to continue to ZuriDesk
            </Text>
          </Stack>

          <Box
            py={8}
            px={{ base: 6, md: 8 }}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow="xl"
            rounded="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ handleSubmit, errors, touched, handleChange, handleBlur }) => (
                <Form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    {error && (
                      <Text color="red.500" fontSize="sm">
                        {error}
                      </Text>
                    )}

                    <FormControl isInvalid={errors.email && touched.email}>
                      <FormLabel fontSize="sm">Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="email"
                        size="lg"
                        fontSize="md"
                        bg={useColorModeValue('white', 'gray.700')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{
                          borderColor: useColorModeValue('gray.400', 'gray.500')
                        }}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: 'outline'
                        }}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.password && touched.password}>
                      <FormLabel fontSize="sm">Password</FormLabel>
                      <Input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                        size="lg"
                        fontSize="md"
                        bg={useColorModeValue('white', 'gray.700')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{
                          borderColor: useColorModeValue('gray.400', 'gray.500')
                        }}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: 'outline'
                        }}
                      />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <Stack spacing={6} w="full">
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align="start"
                        justify="space-between"
                        fontSize="sm"
                      >
                        <Checkbox colorScheme="blue" size="md">
                          Remember me
                        </Checkbox>
                        <Text
                          as={Link}
                          to="/forgot-password"
                          color="blue.500"
                          _hover={{ color: 'blue.600' }}
                          fontWeight="medium"
                        >
                          Forgot password?
                        </Text>
                      </Stack>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        fontSize="md"
                        isLoading={loading}
                        w="full"
                      >
                        Sign in
                      </Button>
                    </Stack>

                    <Stack spacing={6} w="full" pt={6}>
                      <Stack direction="row" justify="center">
                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                          New to ZuriDesk?{' '}
                          <Text
                            as={Link}
                            to="/register"
                            color="blue.500"
                            _hover={{ color: 'blue.600' }}
                            fontWeight="semibold"
                          >
                            Create an account
                          </Text>
                        </Text>
                      </Stack>

                      <Divider />

                      <Stack spacing={4}>
                        <Button
                          variant="outline"
                          size="lg"
                          fontSize="md"
                          leftIcon={<Icon viewBox="0 0 24 24" w={5} h={5}>
                            <path
                              fill="currentColor"
                              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                            />
                          </Icon>}
                          w="full"
                          color={useColorModeValue('gray.700', 'gray.200')}
                          borderColor={useColorModeValue('gray.300', 'gray.600')}
                          _hover={{
                            bg: useColorModeValue('gray.50', 'gray.700')
                          }}
                        >
                          Continue with Google
                        </Button>
                      </Stack>
                    </Stack>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
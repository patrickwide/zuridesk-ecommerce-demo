import React, { useEffect, useState } from 'react';
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
  Heading,
  Text,
  useColorModeValue,
  Icon,
  Divider,
  Stack,
  Container,
} from '@chakra-ui/react';
import { registerSchema } from '../utils/validationSchemas';
import { register, clearError } from '../store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const resultAction = await dispatch(register(values));
      if (register.fulfilled.match(resultAction)) {
        toast({
          title: 'Registration successful',
          description: 'Your account has been created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/products');
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
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
              Create your account
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={useColorModeValue('gray.600', 'gray.400')}>
              to start shopping with ZuriDesk
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
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
            >
              {({ handleSubmit, errors, touched, handleChange, handleBlur }) => (
                <Form onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    {error && (
                      <Text color="red.500" fontSize="sm">
                        {error}
                      </Text>
                    )}

                    <FormControl isInvalid={errors.name && touched.name}>
                      <FormLabel fontSize="sm">Name</FormLabel>
                      <Input
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.email && touched.email}>
                      <FormLabel fontSize="sm">Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
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

                    <FormControl isInvalid={errors.confirmPassword && touched.confirmPassword}>
                      <FormLabel fontSize="sm">Confirm Password</FormLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      fontSize="md"
                      isLoading={loading || isLoading}
                      w="full"
                      mt={2}
                    >
                      Create Account
                    </Button>

                    <Stack spacing={6} w="full" pt={6}>
                      <Stack direction="row" justify="center">
                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                          Already have an account?{' '}
                          <Text
                            as={Link}
                            to="/login"
                            color="blue.500"
                            _hover={{ color: 'blue.600' }}
                            fontWeight="semibold"
                          >
                            Sign in
                          </Text>
                        </Text>
                      </Stack>

                      <Divider />

                      <Stack spacing={4}>
                        <Button
                          variant="outline"
                          size="lg"
                          fontSize="md"
                          leftIcon={
                            <Icon viewBox="0 0 24 24" w={5} h={5}>
                              <path
                                fill="currentColor"
                                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                              />
                            </Icon>
                          }
                          w="full"
                          color={useColorModeValue('gray.700', 'gray.200')}
                          borderColor={useColorModeValue('gray.300', 'gray.600')}
                          _hover={{
                            bg: useColorModeValue('gray.50', 'gray.700')
                          }}
                        >
                          Sign up with Google
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

export default RegisterPage;
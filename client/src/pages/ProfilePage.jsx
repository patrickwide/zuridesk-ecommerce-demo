import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  useColorModeValue,
  Avatar,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { updateProfile } from '../store/slices/authSlice';
import { saveShippingAddress } from '../store/slices/cartSlice';
import { shippingAddressSchema } from '../utils/validationSchemas';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);
  const { shippingAddress } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send fields that have changed
      const updatedFields = {};
      if (formData.name !== user.name) updatedFields.name = formData.name;
      if (formData.email !== user.email) updatedFields.email = formData.email;
      if (formData.password) updatedFields.password = formData.password;

      if (Object.keys(updatedFields).length === 0) {
        toast({
          title: 'No changes detected',
          description: 'Please make changes before saving',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        return;
      }

      const resultAction = await dispatch(updateProfile(updatedFields));
      if (updateProfile.fulfilled.match(resultAction)) {
        toast({
          title: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        // Reset password field after successful update
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        // Handle rejected case
        throw new Error(resultAction.error?.message || 'Update failed');
      }
    } catch (err) {
      toast({
        title: 'Error updating profile',
        description: err.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleShippingSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(saveShippingAddress(values));
      toast({
        title: 'Shipping address saved',
        description: 'Your shipping address has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error saving address',
        description: err.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="info">
          <AlertIcon />
          Loading profile...
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Unable to load profile. Please try logging in again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
          {/* Profile Summary */}
          <GridItem>
            <VStack spacing={4} align="center">
              <Avatar
                size="2xl"
                name={user.name}
                bg="blue.500"
              />
              <VStack spacing={1}>
                <Heading size="md">{user.name}</Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  {user.email}
                </Text>
              </VStack>
            </VStack>
          </GridItem>

          {/* Main Content */}
          <GridItem>
            <Tabs>
              <TabList>
                <Tab>Profile</Tab>
                <Tab>Addresses</Tab>
                <Tab>Orders</Tab>
              </TabList>

              <TabPanels>
                {/* Profile Tab */}
                <TabPanel>
                  <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    p={6}
                    rounded="lg"
                    shadow="base"
                  >
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={6}>
                        <Heading size="md">Personal Information</Heading>
                        <Grid templateColumns={{ base: '1fr' }} gap={6}>
                          <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              isReadOnly={!isEditing}
                              bg={isEditing ? 'white' : useColorModeValue('gray.50', 'gray.700')}
                              cursor={isEditing ? 'text' : 'default'}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              isReadOnly={!isEditing}
                              bg={isEditing ? 'white' : useColorModeValue('gray.50', 'gray.700')}
                              cursor={isEditing ? 'text' : 'default'}
                            />
                          </FormControl>
                          {isEditing && (
                            <FormControl>
                              <FormLabel>New Password (leave blank to keep current)</FormLabel>
                              <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter new password"
                              />
                            </FormControl>
                          )}
                        </Grid>
                        <Stack direction="row" spacing={4}>
                          {!isEditing ? (
                            <Button
                              colorScheme="blue"
                              onClick={handleEditClick}
                            >
                              Edit Profile
                            </Button>
                          ) : (
                            <>
                              <Button
                                type="submit"
                                colorScheme="green"
                                isLoading={loading}
                                loadingText="Saving..."
                              >
                                Save Changes
                              </Button>
                              <Button 
                                variant="ghost" 
                                onClick={handleCancel}
                                isDisabled={loading}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </form>
                  </Box>
                </TabPanel>

                {/* Addresses Tab */}
                <TabPanel>
                  <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    p={6}
                    rounded="lg"
                    shadow="base"
                  >
                    <Stack spacing={6}>
                      <Heading size="md">Shipping Address</Heading>
                      <Divider />
                      
                      <Formik
                        initialValues={{
                          name: shippingAddress?.name || '',
                          phone: shippingAddress?.phone || '',
                          address: shippingAddress?.address || '',
                          city: shippingAddress?.city || '',
                          county: shippingAddress?.county || '',
                          postalCode: shippingAddress?.postalCode || '',
                          country: shippingAddress?.country || 'Kenya'
                        }}
                        validationSchema={shippingAddressSchema}
                        onSubmit={handleShippingSubmit}
                      >
                        {({ handleSubmit, errors, touched, handleChange, handleBlur, values, isSubmitting }) => (
                          <Form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                <FormControl isInvalid={errors.name && touched.name}>
                                  <FormLabel>Full Name</FormLabel>
                                  <Input
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.phone && touched.phone}>
                                  <FormLabel>Phone Number</FormLabel>
                                  <Input
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g., 0712345678"
                                  />
                                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                                </FormControl>
                              </Grid>

                              <FormControl isInvalid={errors.address && touched.address}>
                                <FormLabel>Address</FormLabel>
                                <Input
                                  name="address"
                                  value={values.address}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <FormErrorMessage>{errors.address}</FormErrorMessage>
                              </FormControl>

                              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                <FormControl isInvalid={errors.city && touched.city}>
                                  <FormLabel>City</FormLabel>
                                  <Input
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <FormErrorMessage>{errors.city}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.county && touched.county}>
                                  <FormLabel>County</FormLabel>
                                  <Input
                                    name="county"
                                    value={values.county}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <FormErrorMessage>{errors.county}</FormErrorMessage>
                                </FormControl>
                              </Grid>

                              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                <FormControl isInvalid={errors.postalCode && touched.postalCode}>
                                  <FormLabel>Postal Code</FormLabel>
                                  <Input
                                    name="postalCode"
                                    value={values.postalCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  <FormErrorMessage>{errors.postalCode}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.country && touched.country}>
                                  <FormLabel>Country</FormLabel>
                                  <Input
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    readOnly
                                  />
                                  <FormErrorMessage>{errors.country}</FormErrorMessage>
                                </FormControl>
                              </Grid>

                              <Button
                                mt={4}
                                colorScheme="blue"
                                type="submit"
                                isLoading={isSubmitting}
                              >
                                Save Shipping Address
                              </Button>
                            </Stack>
                          </Form>
                        )}
                      </Formik>
                    </Stack>
                  </Box>
                </TabPanel>

                {/* Orders Tab */}
                <TabPanel>
                  <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    p={6}
                    rounded="lg"
                    shadow="base"
                  >
                    <Stack spacing={6}>
                      <Heading size="md">Order History</Heading>
                      <Text>Your order history will appear here once you make a purchase.</Text>
                    </Stack>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
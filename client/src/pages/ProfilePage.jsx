import React, { useState } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - will be replaced with Redux state
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+254 700 000000',
    avatar: 'https://bit.ly/sage-adebayo',
  };

  // Mock order history - will be replaced with API data
  const orders = [
    {
      id: '1234',
      date: '2025-06-15',
      total: 799.98,
      status: 'Delivered',
      items: 3
    },
    {
      id: '1235',
      date: '2025-06-10',
      total: 299.99,
      status: 'Processing',
      items: 1
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsEditing(false);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
          {/* Profile Summary */}
          <GridItem>
            <VStack spacing={4} align="center">
              <Avatar
                size="2xl"
                src={user.avatar}
                name={`${user.firstName} ${user.lastName}`}
              />
              <VStack spacing={1}>
                <Heading size="md">{`${user.firstName} ${user.lastName}`}</Heading>
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
                <Tab>Orders</Tab>
                <Tab>Addresses</Tab>
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
                    <Stack spacing={6}>
                      <Heading size="md">Personal Information</Heading>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <FormControl>
                          <FormLabel>First Name</FormLabel>
                          <Input
                            defaultValue={user.firstName}
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            defaultValue={user.lastName}
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            defaultValue={user.email}
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Phone</FormLabel>
                          <Input
                            defaultValue={user.phone}
                            isReadOnly={!isEditing}
                          />
                        </FormControl>
                      </Grid>
                      <Button
                        colorScheme={isEditing ? 'green' : 'blue'}
                        onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                      >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                      </Button>
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
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>Order ID</Th>
                            <Th>Date</Th>
                            <Th>Items</Th>
                            <Th>Total</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {orders.map((order) => (
                            <Tr key={order.id}>
                              <Td>#{order.id}</Td>
                              <Td>{order.date}</Td>
                              <Td>{order.items}</Td>
                              <Td>${order.total.toFixed(2)}</Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    order.status === 'Delivered' ? 'green' : 'orange'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Stack>
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
                      <Heading size="md">Saved Addresses</Heading>
                      <Text>No addresses saved yet.</Text>
                      <Button colorScheme="blue">Add New Address</Button>
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
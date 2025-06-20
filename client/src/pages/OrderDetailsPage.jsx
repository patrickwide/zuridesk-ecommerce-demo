import React from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Grid,
  GridItem,
  Text,
  Badge,
  Button,
  useColorModeValue,
  List,
  ListItem,
  Divider,
  Image,
  Flex,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import PayPalButton from '../components/ui/PayPalButton';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { order, loading, error } = useSelector((state) => state.order);

  // Mock order data - will be replaced with Redux state/API call
  const mockOrder = {
    id: '1234',
    date: '2025-06-15',
    status: 'Delivered',
    deliveryDate: '2025-06-18',
    total: 799.98,
    subtotal: 699.98,
    shipping: 29.99,
    tax: 70.01,
    items: [
      {
        id: 1,
        name: 'Ergonomic Office Chair',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 2,
        name: 'Standing Desk',
        price: 399.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Street Name',
      city: 'Nairobi',
      county: 'Nairobi',
      postalCode: '00100',
      phone: '+254 700 000000'
    },
    paymentMethod: 'M-PESA',
    paymentDetails: 'MPESA123456789'
  };

  const orderData = order || mockOrder;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'green';
      case 'Processing':
        return 'orange';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        {/* Header */}
        <Stack direction="row" justify="space-between" align="center">
          <Button
            as={RouterLink}
            to="/orders"
            leftIcon={<HiArrowLeft />}
            variant="ghost"
          >
            Back to Orders
          </Button>
          <Badge
            colorScheme={getStatusColor(orderData.status)}
            fontSize="md"
            px={4}
            py={2}
            rounded="full"
          >
            {orderData.status}
          </Badge>
        </Stack>

        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Order #{id}
        </Heading>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Content */}
          <GridItem>
            <Stack spacing={8}>
              {/* Order Items */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                rounded="lg"
                shadow="base"
              >
                <Heading size="md" mb={6}>Order Items</Heading>
                <Stack spacing={4}>
                  {orderData.items.map((item) => (
                    <Box key={item.id}>
                      <Flex gap={4}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          boxSize="100px"
                          objectFit="cover"
                          rounded="md"
                        />
                        <Stack flex="1">
                          <Text fontWeight="medium">{item.name}</Text>
                          <Text color={useColorModeValue('gray.600', 'gray.400')}>
                            Quantity: {item.quantity}
                          </Text>
                          <Text fontWeight="medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Stack>
                      </Flex>
                      <Divider mt={4} />
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Shipping Information */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                rounded="lg"
                shadow="base"
              >
                <Heading size="md" mb={6}>Shipping Information</Heading>
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="medium">{orderData.shippingAddress.name}</Text>
                  <Text>{orderData.shippingAddress.address}</Text>
                  <Text>
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.county} {orderData.shippingAddress.postalCode}
                  </Text>
                  <Text>{orderData.shippingAddress.phone}</Text>
                </VStack>
              </Box>
            </Stack>
          </GridItem>

          {/* Order Summary */}
          <GridItem>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="base"
              position="sticky"
              top="100px"
            >
              <Stack spacing={6}>
                <Heading size="md">Order Summary</Heading>
                
                <List spacing={3}>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Order Date
                      </Text>
                      <Text>{orderData.date}</Text>
                    </HStack>
                  </ListItem>
                  {orderData.deliveryDate && (
                    <ListItem>
                      <HStack justify="space-between">
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                          Delivery Date
                        </Text>
                        <Text>{orderData.deliveryDate}</Text>
                      </HStack>
                    </ListItem>
                  )}
                  <ListItem>
                    <HStack justify="space-between">
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Payment Method
                      </Text>
                      <Text>{orderData.paymentMethod}</Text>
                    </HStack>
                  </ListItem>
                  {orderData.paymentDetails && (
                    <ListItem>
                      <HStack justify="space-between">
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                          Transaction ID
                        </Text>
                        <Text fontSize="sm" fontFamily="mono">
                          {orderData.paymentDetails}
                        </Text>
                      </HStack>
                    </ListItem>
                  )}
                </List>

                <Divider />

                <List spacing={3}>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Subtotal</Text>
                      <Text>${orderData.subtotal.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Shipping</Text>
                      <Text>${orderData.shipping.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Tax</Text>
                      <Text>${orderData.tax.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Total</Text>
                      <Text fontWeight="bold">
                        ${orderData.total.toFixed(2)}
                      </Text>
                    </HStack>
                  </ListItem>
                </List>

                <Button
                  as={RouterLink}
                  to={`/support/order/${id}`}
                  colorScheme="blue"
                  variant="outline"
                >
                  Need Help?
                </Button>
              </Stack>
            </Box>
          </GridItem>
        </Grid>

        {/* PayPal Button - Shown only if order is not paid */}
        {!orderData.isPaid && (
          <Box mt={4}>
            <PayPalButton orderId={orderData.id} total={orderData.total} />
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default OrderDetailsPage;
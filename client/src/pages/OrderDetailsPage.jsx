import React, { useEffect } from 'react';
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
  Alert,
  AlertIcon,
  Center,
  Spinner,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import PayPalButton from '../components/ui/PayPalButton';
import { fetchOrderById } from '../store/slices/orderSlice';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { order, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const fallbackSrc = "https://via.placeholder.com/100x100?text=Product";

  // Call all hooks at the top level, before any conditional returns
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  // Add ownership validation
  useEffect(() => {
    if (order && user && !user.isAdmin && order.user._id !== user._id) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this order",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/orders');
    }
  }, [order, user, navigate]);

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

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
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

  if (!order) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Order not found
        </Alert>
      </Container>
    );
  }

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
            colorScheme={getStatusColor(order.status)}
            fontSize="md"
            px={4}
            py={2}
            rounded="full"
          >
            {order.status}
          </Badge>
        </Stack>

        <Heading
          as="h1"
          size="xl"
          color={textColor}
        >
          Order #{order._id}
        </Heading>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Content */}
          <GridItem>
            <Stack spacing={8}>
              {/* Order Items */}
              <Box
                bg={bgColor}
                p={6}
                rounded="lg"
                shadow="base"
              >
                <Heading size="md" mb={6}>Order Items</Heading>
                <Stack spacing={4}>
                  {order.orderItems.map((item) => (
                    <Box key={item._id}>
                      <Flex gap={4}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          boxSize="100px"
                          objectFit="cover"
                          rounded="md"
                          fallback={<Skeleton boxSize="100px" rounded="md" />}
                          fallbackSrc={fallbackSrc}
                          onError={(e) => {
                            e.target.src = fallbackSrc;
                          }}
                        />
                        <Stack flex="1">
                          <Text fontWeight="medium">{item.name}</Text>
                          <Text color={subtextColor}>
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
                bg={bgColor}
                p={6}
                rounded="lg"
                shadow="base"
              >
                <Heading size="md" mb={6}>Shipping Information</Heading>
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="medium">{order.shippingAddress.name}</Text>
                  <Text>{order.shippingAddress.address}</Text>
                  <Text>
                    {order.shippingAddress.city}, {order.shippingAddress.county} {order.shippingAddress.postalCode}
                  </Text>
                  <Text>{order.shippingAddress.phone}</Text>
                </VStack>
              </Box>
            </Stack>
          </GridItem>

          {/* Order Summary */}
          <GridItem>
            <Box
              bg={bgColor}
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
                      <Text color={subtextColor}>
                        Order Date
                      </Text>
                      <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
                    </HStack>
                  </ListItem>
                  {order.deliveredAt && (
                    <ListItem>
                      <HStack justify="space-between">
                        <Text color={subtextColor}>
                          Delivery Date
                        </Text>
                        <Text>{new Date(order.deliveredAt).toLocaleDateString()}</Text>
                      </HStack>
                    </ListItem>
                  )}
                  <ListItem>
                    <HStack justify="space-between">
                      <Text color={subtextColor}>
                        Payment Method
                      </Text>
                      <Text>{order.paymentMethod}</Text>
                    </HStack>
                  </ListItem>
                </List>

                <Divider />

                <List spacing={3}>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Subtotal</Text>
                      <Text>${order.subtotal.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Shipping</Text>
                      <Text>
                        {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Tax (16%)</Text>
                      <Text>${order.tax.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">Total</Text>
                      <Text fontWeight="bold">
                        ${order.total.toFixed(2)}
                      </Text>
                    </HStack>
                  </ListItem>
                </List>

                {/* PayPal Button - Shown only if order is not paid */}
                {!order.isPaid && (
                  <Box mt={4}>
                    <PayPalButton orderId={order._id} total={order.total} />
                  </Box>
                )}

                {/* Show payment status */}
                <Badge 
                  colorScheme={order.isPaid ? 'green' : 'yellow'}
                  p={2}
                  textAlign="center"
                >
                  {order.isPaid ? 'Paid' : 'Payment Pending'}
                </Badge>

                <Button
                  as={RouterLink}
                  to="/support"
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  Need Help?
                </Button>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
};

export default OrderDetailsPage;
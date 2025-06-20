import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Stack,
  Grid,
  GridItem,
  Text,
  Divider,
  useColorModeValue,
  Flex,
  VStack,
  useToast,
} from '@chakra-ui/react';
import PayPalButton from '../components/ui/PayPalButton';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Helper function to round to 2 decimal places
  const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  // Calculate totals with proper rounding
  const subtotal = roundToTwo(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shipping = subtotal > 100 ? 0 : 29.99; // Already has 2 decimal places
  const tax = roundToTwo(subtotal * 0.16); // Round tax to 2 decimal places
  const total = roundToTwo(subtotal + shipping + tax); // Round final total

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    if (!user) {
      navigate('/login');
    }
  }, [cartItems, user, navigate]);

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.qty,
          image: item.image,
          price: roundToTwo(item.price), // Ensure item prices are also rounded
          product: item._id,
        })),
        paymentMethod: 'PayPal',
        subtotal,
        tax,
        shipping,
        total,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${result._id}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create order',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
          textAlign="center"
        >
          Checkout
        </Heading>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          {/* Order Summary */}
          <GridItem>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="base"
            >
              <Stack spacing={4}>
                <Heading size="md">Order Summary</Heading>
                <Stack spacing={4}>
                  <Flex justify="space-between">
                    <Text>Subtotal</Text>
                    <Text>${subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Shipping</Text>
                    <VStack align="end" spacing={0}>
                      <Text>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text>
                      {subtotal < 100 && shipping > 0 && (
                        <Text fontSize="xs" color="gray.500">
                          Free shipping on orders over $100
                        </Text>
                      )}
                    </VStack>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Tax (16%)</Text>
                    <Text>${tax.toFixed(2)}</Text>
                  </Flex>
                  <Divider />
                  <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                    <Text>Total</Text>
                    <Text>${total.toFixed(2)}</Text>
                  </Flex>
                </Stack>
              </Stack>
            </Box>
          </GridItem>

          {/* Payment Section */}
          <GridItem>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="base"
            >
              <Stack spacing={6} bg={useColorModeValue('white', 'gray.800')} p={6} rounded="lg">
                <VStack align="stretch" spacing={4}>
                  <Text>
                    <strong>PayPal</strong> - Pay securely with your PayPal account or credit card
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    You will be redirected to PayPal to complete your payment securely.
                  </Text>
                </VStack>

                <PayPalButton 
                  orderId="12345" 
                  total={total}
                  onSuccess={handleCreateOrder}
                />

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </Text>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
};

export default CheckoutPage;
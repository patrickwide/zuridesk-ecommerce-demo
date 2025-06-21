import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
  RadioGroup,
  Radio,
  Button,
  Center,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import PayPalButton from '../components/ui/PayPalButton';
import { fetchOrderById, resetOrder, updatePaymentMethod } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { order, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/cart');
      return;
    }

    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    const loadOrder = async () => {
      try {
        await dispatch(fetchOrderById(orderId)).unwrap();
      } catch (err) {
        navigate('/cart');
      }
    };

    loadOrder();

    // Cleanup - reset order state when leaving checkout
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch, orderId, user, navigate]);

  useEffect(() => {
    if (order?.paymentMethod) {
      setPaymentMethod(order.paymentMethod);
    }
  }, [order]);

  const handlePaymentMethodSelect = async (value) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await dispatch(updatePaymentMethod({ orderId, paymentMethod: value })).unwrap();
      setPaymentMethod(value);
      
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not update payment method",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // Revert selection on error
      setPaymentMethod(order?.paymentMethod || 'PayPal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await dispatch(updatePaymentMethod({ 
        orderId, 
        paymentMethod: 'Cash on Delivery' 
      })).unwrap();
      
      dispatch(clearCart());
      navigate(`/orders/${orderId}`);
      
      toast({
        title: "Order confirmed",
        description: "Your cash on delivery order has been placed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Could not process cash on delivery',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while redirecting or while data is loading
  if (loading || !order) {
    return (
      <Container maxW="container.lg" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  // Don't show payment options if order is already paid
  if (order.isPaid) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="info">
          <AlertIcon />
          This order has already been paid for. You will be redirected to the order details page.
        </Alert>
      </Container>
    );
  }

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
                    <Text>${order.subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Shipping</Text>
                    <VStack align="end" spacing={0}>
                      <Text>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</Text>
                      {order.subtotal < 100 && order.shipping > 0 && (
                        <Text fontSize="xs" color="gray.500">
                          Free shipping on orders over $100
                        </Text>
                      )}
                    </VStack>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Tax (16%)</Text>
                    <Text>${order.tax.toFixed(2)}</Text>
                  </Flex>
                  <Divider />
                  <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                    <Text>Total</Text>
                    <Text>${order.total.toFixed(2)}</Text>
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
              <Stack spacing={6}>
                <Heading size="md">Payment Method</Heading>
                
                <RadioGroup onChange={handlePaymentMethodSelect} value={paymentMethod}>
                  <Stack spacing={4}>
                    <Radio value="PayPal">
                      <Text fontWeight="medium">PayPal</Text>
                      <Text fontSize="sm" color="gray.500">
                        Pay securely with your PayPal account
                      </Text>
                    </Radio>
                    
                    <Radio value="COD">
                      <Text fontWeight="medium">Cash on Delivery</Text>
                      <Text fontSize="sm" color="gray.500">
                        Pay when you receive your order
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>

                {paymentMethod === 'PayPal' && (
                  <Box mt={4}>
                    <PayPalButton 
                      orderId={orderId} 
                      total={order.total} 
                    />
                  </Box>
                )}

                {paymentMethod === 'COD' && (
                  <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    onClick={handleCashOnDelivery}
                    isLoading={isProcessing}
                  >
                    Confirm Order (Cash on Delivery)
                  </Button>
                )}

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
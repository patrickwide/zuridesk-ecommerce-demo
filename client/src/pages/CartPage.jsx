import React from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  IconButton,
  Flex,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { HiTrash } from 'react-icons/hi';
import { Link as RouterLink } from 'react-router-dom';

const CartPage = () => {
  // Mock cart data - will be replaced with real data from Redux store
  const cartItems = [
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
      price: 499.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80'
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 29.99;
  const tax = subtotal * 0.16; // 16% tax rate
  const total = subtotal + shipping + tax;

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Shopping Cart
        </Heading>

        {cartItems.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            Your cart is empty. <RouterLink to="/products">Continue shopping</RouterLink>
          </Alert>
        ) : (
          <Stack spacing={6}>
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              rounded="lg"
              shadow="base"
              overflow="hidden"
            >
              <Table>
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                    <Th>Total</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cartItems.map((item) => (
                    <Tr key={item.id}>
                      <Td>
                        <Flex align="center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            boxSize="50px"
                            objectFit="cover"
                            rounded="md"
                            mr={4}
                          />
                          <Text fontWeight="medium">{item.name}</Text>
                        </Flex>
                      </Td>
                      <Td>${item.price.toFixed(2)}</Td>
                      <Td>
                        <NumberInput
                          value={item.quantity}
                          min={1}
                          max={10}
                          w="100px"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </Td>
                      <Td>${(item.price * item.quantity).toFixed(2)}</Td>
                      <Td>
                        <IconButton
                          icon={<HiTrash />}
                          variant="ghost"
                          colorScheme="red"
                          aria-label="Remove item"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
              <Box flex="1">
                <Button
                  as={RouterLink}
                  to="/products"
                  variant="outline"
                  size="lg"
                  width={{ base: 'full', lg: 'auto' }}
                >
                  Continue Shopping
                </Button>
              </Box>

              <Box
                flex="1"
                p={6}
                bg={useColorModeValue('white', 'gray.800')}
                rounded="lg"
                shadow="base"
              >
                <Stack spacing={4}>
                  <Flex justify="space-between">
                    <Text>Subtotal</Text>
                    <Text>${subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Shipping</Text>
                    <Text>${shipping.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Tax (16%)</Text>
                    <Text>${tax.toFixed(2)}</Text>
                  </Flex>
                  <Divider />
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>Total</Text>
                    <Text>${total.toFixed(2)}</Text>
                  </Flex>
                  <Button
                    as={RouterLink}
                    to="/checkout"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    mt={4}
                  >
                    Proceed to Checkout
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default CartPage;
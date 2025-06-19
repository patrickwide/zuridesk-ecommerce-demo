import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Divider,
  useColorModeValue,
  Flex,
  Radio,
  RadioGroup,
  VStack,
} from '@chakra-ui/react';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  // Mock cart total from previous page
  const orderSummary = {
    subtotal: 799.98,
    shipping: 29.99,
    tax: 127.99,
    total: 957.96
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Checkout
        </Heading>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Stack spacing={8}>
              {/* Shipping Information */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                rounded="lg"
                shadow="base"
              >
                <Heading size="md" mb={6}>Shipping Information</Heading>
                <Stack spacing={4}>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input placeholder="John" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input placeholder="Doe" />
                    </FormControl>
                  </Grid>
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input type="email" placeholder="john@example.com" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input placeholder="+254 700 000000" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Address</FormLabel>
                    <Input placeholder="123 Street Name" />
                  </FormControl>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>City</FormLabel>
                      <Input placeholder="Nairobi" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>County</FormLabel>
                      <Select placeholder="Select county">
                        <option>Nairobi</option>
                        <option>Mombasa</option>
                        <option>Kisumu</option>
                        <option>Nakuru</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Postal Code</FormLabel>
                      <Input placeholder="00100" />
                    </FormControl>
                  </Grid>
                </Stack>
              </Box>

              {/* Payment Method */}
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                rounded="lg"
                shadow="base"
              >
                <Heading size="md" mb={6}>Payment Method</Heading>
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  <VStack align="stretch" spacing={4}>
                    <Radio value="mpesa">
                      M-PESA
                      <Text fontSize="sm" color="gray.500">Pay via M-PESA mobile money</Text>
                    </Radio>
                    <Radio value="card">
                      Credit/Debit Card
                      <Text fontSize="sm" color="gray.500">Pay with Visa, Mastercard, or American Express</Text>
                    </Radio>
                    <Radio value="bank">
                      Bank Transfer
                      <Text fontSize="sm" color="gray.500">Pay directly from your bank account</Text>
                    </Radio>
                  </VStack>
                </RadioGroup>
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
              <Heading size="md" mb={6}>Order Summary</Heading>
              <Stack spacing={4}>
                <Flex justify="space-between">
                  <Text>Subtotal</Text>
                  <Text>${orderSummary.subtotal.toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Shipping</Text>
                  <Text>${orderSummary.shipping.toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text>Tax (16%)</Text>
                  <Text>${orderSummary.tax.toFixed(2)}</Text>
                </Flex>
                <Divider />
                <Flex justify="space-between" fontWeight="bold">
                  <Text>Total</Text>
                  <Text>${orderSummary.total.toFixed(2)}</Text>
                </Flex>
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  mt={4}
                >
                  Place Order
                </Button>
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
import React from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Button,
  IconButton,
  Flex,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  HStack,
  VStack,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { HiTrash, HiPlus, HiMinus } from "react-icons/hi";
import { Link as RouterLink } from "react-router-dom";
import {
  removeFromCart,
  incrementCartItem,
  decrementCartItem,
  updateCartItemQty,
} from "../store/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { cartItems } = useSelector((state) => state.cart);
  const fallbackSrc = "https://via.placeholder.com/60x60?text=Product";

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shipping = subtotal > 100 ? 0 : 29.99; // Free shipping over $100
  const tax = subtotal * 0.16; // 16% tax rate
  const total = subtotal + shipping + tax;

  const handleRemoveFromCart = (id) => {
    // Debug logging
    console.log("Attempting to remove item with id:", id);
    console.log("Current cart items:", cartItems);

    dispatch(removeFromCart(id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleIncrement = (id, currentQty, maxStock) => {
    if (currentQty < maxStock) {
      dispatch(incrementCartItem(id));
    } else {
      toast({
        title: "Stock limit reached",
        description: "Cannot add more items than available in stock",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDecrement = (id) => {
    dispatch(decrementCartItem(id));
  };

  const handleQuantityChange = (id, newQty, maxStock) => {
    if (newQty >= 1 && newQty <= maxStock) {
      dispatch(updateCartItemQty({ id, qty: newQty }));
    } else if (newQty > maxStock) {
      toast({
        title: "Stock limit exceeded",
        description: `Only ${maxStock} items available in stock`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue("gray.900", "white")}
        >
          Shopping Cart ({cartItems.length}{" "}
          {cartItems.length === 1 ? "item" : "items"})
        </Heading>

        {cartItems.length === 0 ? (
          <Alert status="info" rounded="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text>Your cart is empty.</Text>
              <Button
                as={RouterLink}
                to="/products"
                colorScheme="blue"
                size="sm"
              >
                Continue Shopping
              </Button>
            </VStack>
          </Alert>
        ) : (
          <Stack spacing={6}>
            <Box
              bg={useColorModeValue("white", "gray.800")}
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
                  {cartItems.map((item, index) => (
                    <Tr key={`cart-item-${item._id || item.id || index}`}>
                      <Td>
                        <Flex align="center">
                          <Box mr={4}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              boxSize="60px"
                              objectFit="cover"
                              rounded="md"
                              fallback={
                                <Skeleton boxSize="60px" rounded="md" />
                              }
                              fallbackSrc={fallbackSrc}
                              onError={(e) => {
                                e.target.src = fallbackSrc;
                              }}
                            />
                          </Box>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{item.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {item.countInStock} in stock
                            </Text>
                          </VStack>
                        </Flex>
                      </Td>
                      <Td>
                        <Text fontWeight="semibold">
                          ${item.price.toFixed(2)}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<HiMinus />}
                            onClick={() => handleDecrement(item._id || item.id)}
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            aria-label="Decrease quantity"
                          />
                          <VStack spacing={0}>
                            <Text
                              fontWeight="bold"
                              minW="30px"
                              textAlign="center"
                            >
                              {item.qty}
                            </Text>
                          </VStack>
                          <IconButton
                            icon={<HiPlus />}
                            onClick={() =>
                              handleIncrement(
                                item._id || item.id,
                                item.qty,
                                item.countInStock
                              )
                            }
                            size="sm"
                            colorScheme="blue"
                            aria-label="Increase quantity"
                            isDisabled={item.qty >= item.countInStock}
                          />
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontWeight="semibold" fontSize="lg">
                          ${(item.price * item.qty).toFixed(2)}
                        </Text>
                      </Td>
                      <Td>
                        <IconButton
                          icon={<HiTrash />}
                          variant="ghost"
                          colorScheme="red"
                          aria-label="Remove item"
                          onClick={() => handleRemoveFromCart(item._id || item.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Flex direction={{ base: "column", lg: "row" }} gap={8}>
              <Box flex="1">
                <Button
                  as={RouterLink}
                  to="/products"
                  variant="outline"
                  size="lg"
                  width={{ base: "full", lg: "auto" }}
                >
                  Continue Shopping
                </Button>
              </Box>

              <Box
                flex="1"
                p={6}
                bg={useColorModeValue("white", "gray.800")}
                rounded="lg"
                shadow="base"
                maxW={{ lg: "400px" }}
              >
                <Stack spacing={4}>
                  <Heading
                    size="md"
                    color={useColorModeValue("gray.700", "gray.200")}
                  >
                    Order Summary
                  </Heading>

                  <Flex justify="space-between">
                    <Text>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                      items)
                    </Text>
                    <Text fontWeight="semibold">${subtotal.toFixed(2)}</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text>Shipping</Text>
                    <VStack align="end" spacing={0}>
                      <Text fontWeight="semibold">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </Text>
                      {subtotal < 100 && shipping > 0 && (
                        <Text fontSize="xs" color="gray.500">
                          Free shipping on orders over $100
                        </Text>
                      )}
                    </VStack>
                  </Flex>

                  <Flex justify="space-between">
                    <Text>Tax (16%)</Text>
                    <Text fontWeight="semibold">${tax.toFixed(2)}</Text>
                  </Flex>

                  <Divider />

                  <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                    <Text>Total</Text>
                    <Text color={useColorModeValue("blue.600", "blue.300")}>
                      ${total.toFixed(2)}
                    </Text>
                  </Flex>

                  <Button
                    as={RouterLink}
                    to="/checkout"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                  >
                    Proceed to Checkout (${total.toFixed(2)})
                  </Button>

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Secure checkout with SSL encryption
                  </Text>
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
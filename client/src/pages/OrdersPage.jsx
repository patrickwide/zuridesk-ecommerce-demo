import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Badge,
  Button,
  useColorModeValue,
  Text,
  HStack,
  Select,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useToast,
  Image,
  Skeleton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HiSearch, HiEye } from 'react-icons/hi';
import { fetchMyOrders, updateFilterParams } from '../store/slices/orderSlice';
import { useDebounce } from 'use-debounce';

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const ORDER_STATUSES = {
  ALL: 'all',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const fallbackSrc = "https://via.placeholder.com/50x50?text=Product";
  
  // Move all useColorModeValue calls to the top
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const tableBg = useColorModeValue('white', 'gray.800');
  const emptyStateBg = useColorModeValue('white', 'gray.800');
  
  const { orders: ordersData, loading, error, filterParams } = useSelector((state) => state.orders);
  
  // Local state for form inputs and message
  const [searchInput, setSearchInput] = useState(filterParams.search);
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];
  const noOrdersMessage = !Array.isArray(ordersData) ? ordersData?.message : "You haven't placed any orders yet.";

  // Handle filter changes
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    dispatch(updateFilterParams({ status: e.target.value }));
  };

  const handlePeriodChange = (e) => {
    dispatch(updateFilterParams({ period: e.target.value }));
  };

  // Effect to handle search debounce
  useEffect(() => {
    dispatch(updateFilterParams({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // Effect to fetch orders when filters change
  useEffect(() => {
    dispatch(fetchMyOrders(filterParams));
  }, [dispatch, filterParams]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUSES.DELIVERED:
        return 'green';
      case ORDER_STATUSES.PROCESSING:
        return 'orange';
      case ORDER_STATUSES.SHIPPED:
        return 'blue';
      case ORDER_STATUSES.CANCELLED:
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading
            as="h1"
            size="xl"
            mb={4}
            color={headingColor}
          >
            My Orders
          </Heading>
          <Text color={textColor}>
            View and track your orders
          </Text>
        </Box>

        {/* Filters */}
        <HStack spacing={4}>
          <InputGroup maxW="sm">
            <Input
              placeholder="Search orders..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <InputRightElement>
              <IconButton
                icon={<HiSearch />}
                variant="ghost"
                aria-label="Search orders"
              />
            </InputRightElement>
          </InputGroup>
          <Select
            placeholder="Status"
            maxW="xs"
            value={filterParams.status}
            onChange={handleStatusChange}
          >
            <option value={ORDER_STATUSES.ALL}>All Orders</option>
            <option value={ORDER_STATUSES.PROCESSING}>Processing</option>
            <option value={ORDER_STATUSES.SHIPPED}>Shipped</option>
            <option value={ORDER_STATUSES.DELIVERED}>Delivered</option>
            <option value={ORDER_STATUSES.CANCELLED}>Cancelled</option>
          </Select>
          <Select
            placeholder="Time period"
            maxW="xs"
            value={filterParams.period}
            onChange={handlePeriodChange}
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </Select>
        </HStack>

        {/* Orders Table */}
        {loading ? (
          <Box textAlign="center" py={4}>Loading...</Box>
        ) : error ? (
          <Box textAlign="center" py={4} color="red.500">{error}</Box>
        ) : orders.length > 0 ? (
          <Box
            bg={tableBg}
            rounded="lg"
            shadow="base"
            overflow="hidden"
          >
            <Table>
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Date & Time</Th>
                  <Th>Items</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td fontWeight="medium">#{order._id.slice(-6)}</Td>
                    <Td>{formatDateTime(order.createdAt)}</Td>
                    <Td>
                      <Stack spacing={1}>
                        {order.orderItems.map((item, index) => (
                          <HStack key={index} spacing={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              boxSize="30px"
                              objectFit="cover"
                              rounded="md"
                              fallback={<Skeleton boxSize="30px" rounded="md" />}
                              fallbackSrc={fallbackSrc}
                              onError={(e) => {
                                e.target.src = fallbackSrc;
                              }}
                            />
                            <Text fontSize="sm">
                              {item.quantity}x {item.name}
                            </Text>
                          </HStack>
                        ))}
                      </Stack>
                    </Td>
                    <Td>${order.total.toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={order.isPaid ? 'green' : 'yellow'}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          as={RouterLink}
                          to={`/orders/${order._id}`}
                          size="sm"
                          leftIcon={<HiEye />}
                          variant="ghost"
                        >
                          View
                        </Button>
                        {!order.isPaid && order.status !== 'Cancelled' && (
                          <Button
                            as={RouterLink}
                            to={`/checkout/${order._id}`}
                            size="sm"
                            colorScheme="blue"
                          >
                            Checkout
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box
            p={8}
            textAlign="center"
            bg={emptyStateBg}
            rounded="lg"
            shadow="base"
          >
            <Text mb={4}>{noOrdersMessage}</Text>
            <Button
              as={RouterLink}
              to="/products"
              colorScheme="blue"
            >
              Start Shopping
            </Button>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default OrdersPage;
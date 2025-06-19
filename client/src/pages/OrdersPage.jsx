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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HiSearch, HiEye } from 'react-icons/hi';

const OrdersPage = () => {
  // Mock orders data - will be replaced with Redux state
  const orders = [
    {
      id: '1234',
      date: '2025-06-15',
      total: 799.98,
      status: 'Delivered',
      items: [
        { name: 'Ergonomic Office Chair', quantity: 1 },
        { name: 'Standing Desk', quantity: 1 }
      ]
    },
    {
      id: '1235',
      date: '2025-06-10',
      total: 299.99,
      status: 'Processing',
      items: [
        { name: 'Filing Cabinet', quantity: 1 }
      ]
    },
    {
      id: '1236',
      date: '2025-06-05',
      total: 149.99,
      status: 'Cancelled',
      items: [
        { name: 'Desk Lamp', quantity: 1 }
      ]
    }
  ];

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

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading
            as="h1"
            size="xl"
            mb={4}
            color={useColorModeValue('gray.900', 'white')}
          >
            My Orders
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            View and track your orders
          </Text>
        </Box>

        {/* Filters */}
        <HStack spacing={4}>
          <InputGroup maxW="sm">
            <Input placeholder="Search orders..." />
            <InputRightElement>
              <IconButton
                icon={<HiSearch />}
                variant="ghost"
                aria-label="Search orders"
              />
            </InputRightElement>
          </InputGroup>
          <Select placeholder="Status" maxW="xs">
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Select placeholder="Time period" maxW="xs">
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </Select>
        </HStack>

        {/* Orders Table */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          rounded="lg"
          shadow="base"
          overflow="hidden"
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Date</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td fontWeight="medium">#{order.id}</Td>
                  <Td>{order.date}</Td>
                  <Td>
                    <Stack spacing={1}>
                      {order.items.map((item, index) => (
                        <Text key={index} fontSize="sm">
                          {item.quantity}x {item.name}
                        </Text>
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
                    <Button
                      as={RouterLink}
                      to={`/orders/${order.id}`}
                      size="sm"
                      leftIcon={<HiEye />}
                      variant="ghost"
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {orders.length === 0 && (
          <Box
            p={8}
            textAlign="center"
            bg={useColorModeValue('white', 'gray.800')}
            rounded="lg"
            shadow="base"
          >
            <Text mb={4}>You haven't placed any orders yet.</Text>
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
import React, { useState } from 'react';
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
  Button,
  useColorModeValue,
  HStack,
  Input,
  Select,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  List,
  ListItem,
  Divider,
} from '@chakra-ui/react';
import { 
  HiSearch, 
  HiDotsVertical,
  HiEye,
  HiPencil,
  HiX,
  HiCheck,
} from 'react-icons/hi';

const OrdersPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data - will be replaced with Redux state
  const orders = [
    {
      id: '1234',
      customer: 'John Doe',
      email: 'john@example.com',
      date: '2025-06-19',
      total: 799.98,
      status: 'Processing',
      paymentStatus: 'Paid',
      items: [
        { name: 'Ergonomic Office Chair', quantity: 1, price: 299.99 },
        { name: 'Standing Desk', quantity: 1, price: 499.99 }
      ],
      shippingAddress: {
        street: '123 Street Name',
        city: 'Nairobi',
        county: 'Nairobi',
        postalCode: '00100'
      }
    },
    {
      id: '1235',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      date: '2025-06-19',
      total: 299.99,
      status: 'Delivered',
      paymentStatus: 'Paid',
      items: [
        { name: 'Filing Cabinet', quantity: 1, price: 299.99 }
      ],
      shippingAddress: {
        street: '456 Avenue Road',
        city: 'Mombasa',
        county: 'Mombasa',
        postalCode: '80100'
      }
    }
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'orange';
      case 'Delivered':
        return 'green';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'green';
      case 'Pending':
        return 'yellow';
      case 'Failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Orders
        </Heading>

        {/* Filters */}
        <HStack spacing={4}>
          <Input
            placeholder="Search orders..."
            maxW="sm"
          />
          <Select placeholder="Status" maxW="xs">
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Select placeholder="Payment Status" maxW="xs">
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
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
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td fontWeight="medium">#{order.id}</Td>
                  <Td>
                    <Box>
                      <Text>{order.customer}</Text>
                      <Text fontSize="sm" color="gray.500">{order.email}</Text>
                    </Box>
                  </Td>
                  <Td>{order.date}</Td>
                  <Td>${order.total.toFixed(2)}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<HiDotsVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<HiEye />}
                          onClick={() => handleViewOrder(order)}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          icon={<HiCheck />}
                          isDisabled={order.status === 'Delivered'}
                        >
                          Mark as Delivered
                        </MenuItem>
                        <MenuItem
                          icon={<HiX />}
                          color="red.500"
                          isDisabled={order.status === 'Cancelled'}
                        >
                          Cancel Order
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      {/* Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Order #{selectedOrder?.id}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Stack spacing={6} pb={6}>
                {/* Order Status */}
                <HStack justify="space-between">
                  <Badge
                    colorScheme={getStatusColor(selectedOrder.status)}
                    px={3}
                    py={1}
                    rounded="full"
                  >
                    {selectedOrder.status}
                  </Badge>
                  <Text color="gray.500">
                    {selectedOrder.date}
                  </Text>
                </HStack>

                {/* Customer Info */}
                <Box>
                  <Heading size="sm" mb={2}>Customer Information</Heading>
                  <Text>{selectedOrder.customer}</Text>
                  <Text color="gray.500">{selectedOrder.email}</Text>
                </Box>

                {/* Shipping Address */}
                <Box>
                  <Heading size="sm" mb={2}>Shipping Address</Heading>
                  <Text>{selectedOrder.shippingAddress.street}</Text>
                  <Text>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.county} {selectedOrder.shippingAddress.postalCode}
                  </Text>
                </Box>

                {/* Order Items */}
                <Box>
                  <Heading size="sm" mb={4}>Order Items</Heading>
                  <List spacing={3}>
                    {selectedOrder.items.map((item, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <Text>
                            {item.quantity}x {item.name}
                          </Text>
                          <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider />

                {/* Order Total */}
                <HStack justify="space-between" fontWeight="bold">
                  <Text>Total</Text>
                  <Text>${selectedOrder.total.toFixed(2)}</Text>
                </HStack>

                {/* Action Buttons */}
                <HStack spacing={4}>
                  {selectedOrder.status !== 'Delivered' && (
                    <Button
                      leftIcon={<HiCheck />}
                      colorScheme="green"
                      flex={1}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  {selectedOrder.status !== 'Cancelled' && (
                    <Button
                      leftIcon={<HiX />}
                      colorScheme="red"
                      variant="outline"
                      flex={1}
                    >
                      Cancel Order
                    </Button>
                  )}
                </HStack>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default OrdersPage;
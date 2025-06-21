import React, { useState, useEffect } from 'react';
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
  Image,
  Skeleton,
  VStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  InputGroup,
} from '@chakra-ui/react';
import { 
  HiSearch, 
  HiDotsVertical,
  HiEye,
  HiCheck,
  HiX,
} from 'react-icons/hi';
import { 
  fetchAllOrders, 
  updateOrderToDelivered,
  cancelOrder,
  updateFilterParams 
} from '../../store/slices/orderSlice';
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

const OrdersPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelRef = React.useRef();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const fallbackSrc = "https://via.placeholder.com/50x50?text=Product";

  const { orders, loading, error, filterParams } = useSelector((state) => state.orders);

  // Handle filter changes
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (e) => {
    dispatch(updateFilterParams({ status: e.target.value }));
  };

  const handlePaymentStatusChange = (e) => {
    dispatch(updateFilterParams({ paymentStatus: e.target.value }));
  };

  // Effect to handle search debounce
  useEffect(() => {
    dispatch(updateFilterParams({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // Effect to fetch orders when filters change
  useEffect(() => {
    dispatch(fetchAllOrders(filterParams));
  }, [dispatch, filterParams]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      setIsProcessing(true);
      await dispatch(updateOrderToDelivered(orderId)).unwrap();
      toast({
        title: "Order updated",
        description: "Order has been marked as delivered",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not update order",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setIsProcessing(true);
      await dispatch(cancelOrder(orderId)).unwrap();
      toast({
        title: "Order cancelled",
        description: "Order has been cancelled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCancelDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not cancel order",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'orange';
      case 'Delivered':
        return 'green';
      case 'Cancelled':
        return 'red';
      case 'Shipped':
        return 'blue';
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
          <InputGroup maxW="sm">
            <Input
              placeholder="Search orders..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <IconButton
              icon={<HiSearch />}
              variant="ghost"
              aria-label="Search orders"
            />
          </InputGroup>
          <Select 
            placeholder="Status" 
            maxW="xs"
            value={filterParams.status}
            onChange={handleStatusChange}
          >
            <option value="all">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
          <Select 
            placeholder="Payment Status" 
            maxW="xs"
            value={filterParams.paymentStatus}
            onChange={handlePaymentStatusChange}
          >
            <option value="all">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </Select>
        </HStack>

        {/* Orders Table */}
        {loading ? (
          <Center py={8}>
            <Spinner size="xl" />
          </Center>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
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
                  <Th>Date & Time</Th>
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
                    <Td>
                      <Box>
                        <Text>{order.user?.name}</Text>
                        <Text fontSize="sm" color="gray.500">{order.user?.email}</Text>
                      </Box>
                    </Td>
                    <Td>{formatDateTime(order.createdAt)}</Td>
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
                            onClick={() => handleMarkDelivered(order._id)}
                            isDisabled={order.status === 'Delivered' || order.status === 'Cancelled' || !order.isPaid}
                          >
                            Mark as Delivered
                          </MenuItem>
                          <MenuItem
                            icon={<HiX />}
                            color="red.500"
                            onClick={() => {
                              setSelectedOrder(order);
                              setCancelDialogOpen(true);
                            }}
                            isDisabled={order.status === 'Delivered' || order.status === 'Cancelled' || order.isPaid}
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
        )}
      </Stack>

      {/* Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Order #{selectedOrder?._id.slice(-6)}
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
                  <VStack align="end" spacing={0}>
                    <Text color="gray.500">
                      Created: {formatDateTime(selectedOrder.createdAt)}
                    </Text>
                    {selectedOrder.paidAt && (
                      <Text fontSize="sm" color="green.500">
                        Paid: {formatDateTime(selectedOrder.paidAt)}
                      </Text>
                    )}
                    {selectedOrder.deliveredAt && (
                      <Text fontSize="sm" color="blue.500">
                        Delivered: {formatDateTime(selectedOrder.deliveredAt)}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                {/* Customer Info */}
                <Box>
                  <Heading size="sm" mb={2}>Customer Information</Heading>
                  <Text>{selectedOrder.user?.name}</Text>
                  <Text color="gray.500">{selectedOrder.user?.email}</Text>
                </Box>

                {/* Shipping Address */}
                <Box>
                  <Heading size="sm" mb={2}>Shipping Address</Heading>
                  <Text>{selectedOrder.shippingAddress.name}</Text>
                  <Text>{selectedOrder.shippingAddress.address}</Text>
                  <Text>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.county} {selectedOrder.shippingAddress.postalCode}
                  </Text>
                  <Text>{selectedOrder.shippingAddress.phone}</Text>
                </Box>

                {/* Order Items */}
                <Box>
                  <Heading size="sm" mb={4}>Order Items</Heading>
                  <List spacing={3}>
                    {selectedOrder.orderItems.map((item) => (
                      <ListItem key={item._id}>
                        <HStack justify="space-between" align="center">
                          <HStack>
                            <Image
                              src={item.image}
                              alt={item.name}
                              boxSize="50px"
                              objectFit="cover"
                              rounded="md"
                              fallback={<Skeleton boxSize="50px" rounded="md" />}
                              fallbackSrc={fallbackSrc}
                              onError={(e) => {
                                e.target.src = fallbackSrc;
                              }}
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">{item.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                Quantity: {item.quantity}
                              </Text>
                            </VStack>
                          </HStack>
                          <Text fontWeight="medium">${(item.price * item.quantity).toFixed(2)}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider />

                {/* Order Summary */}
                <List spacing={2}>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Subtotal</Text>
                      <Text>${selectedOrder.subtotal.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Shipping</Text>
                      <Text>
                        {selectedOrder.shipping === 0 ? "FREE" : `$${selectedOrder.shipping.toFixed(2)}`}
                      </Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack justify="space-between">
                      <Text>Tax</Text>
                      <Text>${selectedOrder.tax.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <HStack justify="space-between" fontWeight="bold">
                      <Text>Total</Text>
                      <Text>${selectedOrder.total.toFixed(2)}</Text>
                    </HStack>
                  </ListItem>
                </List>

                {/* Action Buttons */}
                <HStack spacing={4} mt={4}>
                  {selectedOrder.status !== 'Delivered' && selectedOrder.isPaid && (
                    <Button
                      leftIcon={<HiCheck />}
                      colorScheme="green"
                      flex={1}
                      onClick={() => handleMarkDelivered(selectedOrder._id)}
                      isLoading={isProcessing}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  {selectedOrder.status !== 'Cancelled' && !selectedOrder.isPaid && (
                    <Button
                      leftIcon={<HiX />}
                      colorScheme="red"
                      variant="outline"
                      flex={1}
                      onClick={() => setCancelDialogOpen(true)}
                      isLoading={isProcessing}
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

      {/* Cancel Order Dialog */}
      <AlertDialog
        isOpen={cancelDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setCancelDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setCancelDialogOpen(false)}>
                No, Keep Order
              </Button>
              <Button 
                colorScheme="red" 
                onClick={() => handleCancelOrder(selectedOrder?._id)} 
                ml={3}
                isLoading={isProcessing}
              >
                Yes, Cancel Order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default OrdersPage;
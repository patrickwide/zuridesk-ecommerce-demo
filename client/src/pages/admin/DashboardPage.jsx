import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

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

  if (!stats) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Dashboard
        </Heading>

        {/* Statistics Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            rounded="lg"
            shadow="base"
          >
            <Stat>
              <StatLabel>Total Sales</StatLabel>
              <StatNumber>${stats.totalSales.value.toLocaleString()}</StatNumber>
              <StatHelpText>
                <StatArrow type={stats.totalSales.change > 0 ? 'increase' : 'decrease'} />
                {stats.totalSales.change.toFixed(1)}%
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            rounded="lg"
            shadow="base"
          >
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{stats.totalOrders.value}</StatNumber>
              <StatHelpText>
                <StatArrow type={stats.totalOrders.change > 0 ? 'increase' : 'decrease'} />
                {stats.totalOrders.change.toFixed(1)}%
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            rounded="lg"
            shadow="base"
          >
            <Stat>
              <StatLabel>Average Order Value</StatLabel>
              <StatNumber>${stats.averageOrderValue.value.toFixed(2)}</StatNumber>
              <StatHelpText>
                <StatArrow type={stats.averageOrderValue.change > 0 ? 'increase' : 'decrease'} />
                {stats.averageOrderValue.change.toFixed(1)}%
              </StatHelpText>
            </Stat>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            rounded="lg"
            shadow="base"
          >
            <Stat>
              <StatLabel>Active Users</StatLabel>
              <StatNumber>{stats.activeUsers.value}</StatNumber>
              <StatHelpText>
                <StatArrow type={stats.activeUsers.change > 0 ? 'increase' : 'decrease'} />
                {stats.activeUsers.change.toFixed(1)}%
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Recent Orders */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          rounded="lg"
          shadow="base"
        >
          <Stack spacing={6}>
            <Heading size="md">Recent Orders</Heading>
            <Table>
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Date</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.recentOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td>#{order.id.slice(-6)}</Td>
                    <Td>{order.customer}</Td>
                    <Td>{new Date(order.date).toLocaleDateString()}</Td>
                    <Td>${order.total.toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
import React from 'react';
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
} from '@chakra-ui/react';

const DashboardPage = () => {
  // Mock statistics data - will be replaced with real data from backend
  const stats = {
    totalSales: {
      value: 25899.99,
      change: 12.5
    },
    totalOrders: {
      value: 156,
      change: 8.2
    },
    averageOrderValue: {
      value: 165.89,
      change: 3.7
    },
    activeUsers: {
      value: 892,
      change: 15.3
    }
  };

  // Mock recent orders - will be replaced with real data from backend
  const recentOrders = [
    {
      id: '1234',
      customer: 'John Doe',
      date: '2025-06-19',
      total: 799.98,
      status: 'Processing'
    },
    {
      id: '1235',
      customer: 'Jane Smith',
      date: '2025-06-19',
      total: 299.99,
      status: 'Delivered'
    },
    {
      id: '1236',
      customer: 'Mike Johnson',
      date: '2025-06-18',
      total: 459.97,
      status: 'Processing'
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
                {stats.totalSales.change}%
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
                {stats.totalOrders.change}%
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
              <StatNumber>${stats.averageOrderValue.value}</StatNumber>
              <StatHelpText>
                <StatArrow type={stats.averageOrderValue.change > 0 ? 'increase' : 'decrease'} />
                {stats.averageOrderValue.change}%
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
                {stats.activeUsers.change}%
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
                {recentOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td>#{order.id}</Td>
                    <Td>{order.customer}</Td>
                    <Td>{order.date}</Td>
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

        {/* Additional sections for charts and analytics can be added here */}
      </Stack>
    </Container>
  );
};

export default DashboardPage;
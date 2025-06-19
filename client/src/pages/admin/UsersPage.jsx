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
  FormControl,
  FormLabel,
  Switch,
  Avatar,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { 
  HiSearch, 
  HiDotsVertical,
  HiUserAdd,
  HiPencil,
  HiLockClosed,
  HiMail,
} from 'react-icons/hi';

const UsersPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();

  // Mock users data - will be replaced with Redux state
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Customer',
      status: 'Active',
      joinDate: '2025-01-15',
      lastLogin: '2025-06-19',
      orders: 5,
      avatar: 'https://bit.ly/sage-adebayo'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2025-02-20',
      lastLogin: '2025-06-18',
      orders: 3,
      avatar: 'https://bit.ly/dan-abramov'
    }
  ];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'purple';
      case 'Customer':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'red';
      case 'Pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const handleSendPasswordReset = (email) => {
    toast({
      title: 'Password reset email sent',
      description: `A password reset link has been sent to ${email}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <HStack justify="space-between">
          <Heading
            as="h1"
            size="xl"
            color={useColorModeValue('gray.900', 'white')}
          >
            Users
          </Heading>
          <Button
            leftIcon={<HiUserAdd />}
            colorScheme="blue"
            onClick={() => {
              setSelectedUser(null);
              onOpen();
            }}
          >
            Add User
          </Button>
        </HStack>

        {/* Filters */}
        <HStack spacing={4}>
          <Input
            placeholder="Search users..."
            maxW="sm"
          />
          <Select placeholder="Role" maxW="xs">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </Select>
          <Select placeholder="Status" maxW="xs">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </Select>
        </HStack>

        {/* Users Table */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          rounded="lg"
          shadow="base"
          overflow="hidden"
        >
          <Table>
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Join Date</Th>
                <Th>Last Login</Th>
                <Th>Orders</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack>
                      <Avatar
                        size="sm"
                        name={user.name}
                        src={user.avatar}
                      />
                      <Box>
                        <Text fontWeight="medium">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusBadgeColor(user.status)}>
                      {user.status}
                    </Badge>
                  </Td>
                  <Td>{user.joinDate}</Td>
                  <Td>{user.lastLogin}</Td>
                  <Td>{user.orders}</Td>
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
                          icon={<HiPencil />}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit User
                        </MenuItem>
                        <MenuItem
                          icon={<HiMail />}
                          onClick={() => handleSendPasswordReset(user.email)}
                        >
                          Send Password Reset
                        </MenuItem>
                        {user.status === 'Active' ? (
                          <MenuItem
                            icon={<HiLockClosed />}
                            color="red.500"
                          >
                            Deactivate Account
                          </MenuItem>
                        ) : (
                          <MenuItem
                            icon={<HiLockClosed />}
                            color="green.500"
                          >
                            Activate Account
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      {/* Add/Edit User Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={6}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input defaultValue={selectedUser?.name} />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" 
                  defaultValue={selectedUser?.email}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select defaultValue={selectedUser?.role?.toLowerCase()}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select defaultValue={selectedUser?.status?.toLowerCase()}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Select>
              </FormControl>

              {!selectedUser && (
                <FormControl>
                  <FormLabel>Send Welcome Email</FormLabel>
                  <Switch defaultChecked />
                </FormControl>
              )}

              <Button
                colorScheme="blue"
                width="full"
                mt={4}
              >
                {selectedUser ? 'Update User' : 'Create User'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UsersPage;
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Badge,
  HStack,
} from '@chakra-ui/react';
import {
  HiMenu,
  HiX,
  HiChevronDown,
  HiChevronRight,
  HiShoppingCart,
  HiUser,
} from 'react-icons/hi';
import { logout } from '../store/slices/authSlice';
import { selectCartItemsCount } from '../store/slices/cartSlice';

const NAV_ITEMS = [
  {
    label: 'Products',
    href: '/products',
  },
  {
    label: 'Categories',
    href: '/categories',
  },
];

const ADMIN_NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    label: 'Products',
    href: '/admin/products',
  },
  {
    label: 'Orders',
    href: '/admin/orders',
  },
  {
    label: 'Users',
    href: '/admin/users',
  },
];

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <Container maxW={'7xl'}>
          <Flex align={'center'} justify={'space-between'} w="full">
            {/* Mobile menu button */}
            <Flex
              display={{ base: 'flex', md: 'none' }}
              alignItems="center"
            >
              <IconButton
                onClick={onToggle}
                icon={isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
                size="md"
              />
            </Flex>

            {/* Logo section */}
            <Flex 
              flex={{ base: 1 }} 
              justify={{ base: 'center', md: 'flex-start' }}
              alignItems="center"
            >
              <Text
                as={RouterLink}
                to="/"
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily={'heading'}
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight={'bold'}
                color={useColorModeValue('gray.800', 'white')}
                _hover={{
                  textDecoration: 'none',
                  color: useColorModeValue('gray.600', 'gray.300'),
                }}
              >
                ZuriDesk
              </Text>

              {/* Desktop nav */}
              <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                <Stack direction={'row'} spacing={4}>
                  {NAV_ITEMS.map((navItem) => (
                    <Box key={navItem.label}>
                      <Text
                        as={RouterLink}
                        p={2}
                        to={navItem.href ?? '#'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={useColorModeValue('gray.600', 'gray.200')}
                        _hover={{
                          textDecoration: 'none',
                          color: useColorModeValue('gray.800', 'white'),
                        }}
                      >
                        {navItem.label}
                      </Text>
                    </Box>
                  ))}
                  
                  {/* Admin nav items */}
                  {user?.isAdmin && (
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                      <PopoverTrigger>
                        <Text
                          p={2}
                          fontSize={'sm'}
                          fontWeight={500}
                          color={useColorModeValue('gray.600', 'gray.200')}
                          _hover={{
                            textDecoration: 'none',
                            color: useColorModeValue('gray.800', 'white'),
                          }}
                          cursor="pointer"
                        >
                          Admin <Icon as={HiChevronDown} />
                        </Text>
                      </PopoverTrigger>

                      <PopoverContent
                        border={0}
                        boxShadow={'xl'}
                        bg={useColorModeValue('white', 'gray.800')}
                        p={4}
                        rounded={'xl'}
                        minW={'sm'}
                      >
                        <Stack>
                          {ADMIN_NAV_ITEMS.map((item) => (
                            <Box
                              key={item.label}
                              as={RouterLink}
                              to={item.href}
                              role={'group'}
                              p={2}
                              rounded={'md'}
                              _hover={{
                                bg: useColorModeValue('blue.50', 'gray.900'),
                              }}
                            >
                              <Stack direction={'row'} align={'center'}>
                                <Text
                                  transition={'all .3s ease'}
                                  _groupHover={{
                                    color: useColorModeValue('blue.500', 'blue.200'),
                                  }}
                                  fontWeight={500}
                                >
                                  {item.label}
                                </Text>
                                <Icon
                                  as={HiChevronRight}
                                  transition={'all .3s ease'}
                                  transform={'translateX(-10px)'}
                                  opacity={0}
                                  _groupHover={{
                                    opacity: '100%',
                                    transform: 'translateX(0)',
                                  }}
                                />
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                      </PopoverContent>
                    </Popover>
                  )}
                </Stack>
              </Flex>
            </Flex>

            {/* Right side section */}
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}
              align="center"
            >
              {/* Cart button */}
              <IconButton
                as={RouterLink}
                to="/cart"
                variant="ghost"
                aria-label="Shopping cart"
                icon={
                  <Box position="relative">
                    <HiShoppingCart size={20} />
                    {cartItemsCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-2"
                        right="-2"
                        colorScheme="blue"
                        rounded="full"
                        minW="4"
                        fontSize="xs"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Box>
                }
              />

              {/* Auth buttons */}
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar
                      size={'sm'}
                      src={user.avatar}
                      name={user.name}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                    <MenuItem as={RouterLink} to="/orders">My Orders</MenuItem>
                    {user.isAdmin && (
                      <>
                        <MenuDivider />
                        <MenuItem as={RouterLink} to="/admin/dashboard">Dashboard</MenuItem>
                      </>
                    )}
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
                  <Button
                    as={RouterLink}
                    to="/login"
                    fontSize={'sm'}
                    fontWeight={500}
                    variant={'ghost'}
                    leftIcon={<HiUser />}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.500'}
                    _hover={{
                      bg: 'blue.600',
                    }}
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </Stack>
          </Flex>
        </Container>
      </Flex>

      {/* Mobile menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          pb={4}
          mb={4}
          bg={useColorModeValue('white', 'gray.800')}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
        >
          <Stack spacing={4} px={4}>
            {NAV_ITEMS.map((navItem) => (
              <Text
                key={navItem.label}
                as={RouterLink}
                to={navItem.href}
                py={2}
                fontSize={'sm'}
                fontWeight={500}
                color={useColorModeValue('gray.600', 'gray.200')}
                _hover={{
                  textDecoration: 'none',
                  color: useColorModeValue('gray.800', 'white'),
                }}
              >
                {navItem.label}
              </Text>
            ))}

            {user?.isAdmin && ADMIN_NAV_ITEMS.map((navItem) => (
              <Text
                key={navItem.label}
                as={RouterLink}
                to={navItem.href}
                py={2}
                fontSize={'sm'}
                fontWeight={500}
                color={useColorModeValue('gray.600', 'gray.200')}
                _hover={{
                  textDecoration: 'none',
                  color: useColorModeValue('gray.800', 'white'),
                }}
              >
                {navItem.label}
              </Text>
            ))}

            {!isAuthenticated && (
              <Stack spacing={3} pt={4} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <Button
                  as={RouterLink}
                  to="/login"
                  w="full"
                  fontSize={'sm'}
                  fontWeight={500}
                  variant={'ghost'}
                  leftIcon={<HiUser />}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  w="full"
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.500'}
                  _hover={{
                    bg: 'blue.600',
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
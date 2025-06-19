import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
} from '@chakra-ui/react';
import {
  HiMenu,
  HiX,
  HiChevronDown,
  HiChevronRight,
  HiMoon,
  HiSun,
} from 'react-icons/hi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    public: true,
  },
  {
    label: 'Shop',
    children: [
      {
        label: 'All Products',
        subLabel: 'Browse our complete catalog',
        href: '/products',
      },
      {
        label: 'Categories',
        subLabel: 'Shop by product category',
        href: '/categories',
      },
      {
        label: 'New Arrivals',
        subLabel: 'See our latest products',
        href: '/products/new',
      },
    ],
    public: true,
  },
  {
    label: 'Orders',
    href: '/orders',
    private: true,
  },
  {
    label: 'Cart',
    href: '/cart',
    public: true,
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
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Filter navigation items based on auth status
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.private && !isAuthenticated) return false;
    if (item.public || isAuthenticated) return true;
    return false;
  });

  // Combine regular nav items with admin nav items if user is admin
  const allNavItems = user?.isAdmin 
    ? [...filteredNavItems, ...ADMIN_NAV_ITEMS] 
    : filteredNavItems;

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'70px'}
        py={{ base: 3, md: 4 }}
        px={{ base: 4, md: 6 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        align={'center'}
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow={useColorModeValue(
          '0 2px 4px rgba(0, 0, 0, 0.06)',
          '0 2px 4px rgba(0, 0, 0, 0.4)'
        )}
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
              <Link 
                as={RouterLink} 
                to="/" 
                _hover={{ textDecoration: 'none' }}
                display="flex"
                alignItems="center"
              >
                <Text
                  fontFamily={'heading'}
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight={'bold'}
                  color={useColorModeValue('gray.800', 'white')}
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                  letterSpacing="tight"
                >
                  ZuriDesk
                </Text>
              </Link>

              {/* Desktop Navigation */}
              <Flex 
                display={{ base: 'none', md: 'flex' }} 
                ml={12}
                alignItems="center"
              >
                <DesktopNav navItems={allNavItems} />
              </Flex>
            </Flex>

            {/* Right side actions */}
            <HStack
              spacing={{ base: 2, md: 4 }}
              alignItems="center"
              flex={{ base: 0, md: 'none' }}
            >
              {/* Color mode toggle */}
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <HiMoon size={18} /> : <HiSun size={18} />}
                onClick={toggleColorMode}
                variant="ghost"
                size="md"
                color={useColorModeValue('gray.600', 'gray.300')}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700'),
                  color: useColorModeValue('gray.800', 'white'),
                }}
              />

              {/* Desktop auth buttons */}
              <HStack
                spacing={3}
                display={{ base: 'none', md: 'flex' }}
                alignItems="center"
              >
                {!isAuthenticated ? (
                  <>
                    <Button
                      as={RouterLink}
                      to="/login"
                      fontSize={'sm'}
                      fontWeight={500}
                      variant={'ghost'}
                      color={useColorModeValue('gray.600', 'gray.300')}
                      _hover={{
                        bg: useColorModeValue('gray.100', 'gray.700'),
                        color: useColorModeValue('gray.800', 'white'),
                      }}
                      height="38px"
                      px={4}
                    >
                      Sign In
                    </Button>

                    <Button
                      as={RouterLink}
                      to="/register"
                      variant={'solid'}
                      fontSize={'sm'}
                      fontWeight={600}
                      color={'white'}
                      bg={'blue.500'}
                      _hover={{
                        bg: 'blue.600',
                        transform: 'translateY(-1px)',
                      }}
                      _active={{
                        bg: 'blue.700',
                        transform: 'translateY(0)',
                      }}
                      height="38px"
                      px={6}
                      borderRadius="md"
                      transition="all 0.2s"
                      boxShadow="sm"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                      p={0}
                      ml={2}
                    >
                      <Avatar
                        size={'sm'}
                        name={user?.name}
                        src={user?.avatar}
                        border="2px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                      <MenuItem as={RouterLink} to="/orders">My Orders</MenuItem>
                      {user?.isAdmin && (
                        <>
                          <MenuDivider />
                          {ADMIN_NAV_ITEMS.map((item) => (
                            <MenuItem 
                              key={item.label}
                              as={RouterLink} 
                              to={item.href}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                        </>
                      )}
                      <MenuDivider />
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Flex>

      {/* Mobile Navigation */}
      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={allNavItems} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <HStack spacing={1} alignItems="center">
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                to={navItem.href ?? '#'}
                px={4}
                py={2}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
                {navItem.children && (
                  <Icon as={HiChevronDown} ml={1} w={4} h={4} />
                )}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </HStack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={3}
      rounded={'lg'}
      transition="all 0.2s"
      _hover={{ 
        bg: useColorModeValue('blue.50', 'gray.700'),
        transform: 'translateY(-1px)',
      }}
    >
      <Stack direction={'row'} align={'center'} spacing={3}>
        <Box flex={1}>
          <Text
            transition={'all .2s ease'}
            _groupHover={{ color: 'blue.500' }}
            fontWeight={600}
            fontSize="sm"
          >
            {label}
          </Text>
          <Text 
            fontSize={'xs'} 
            color={useColorModeValue('gray.500', 'gray.400')}
            mt={1}
          >
            {subLabel}
          </Text>
        </Box>
        <Flex
          transition={'all .2s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'center'}
          align={'center'}
        >
          <Icon color={'blue.500'} w={4} h={4} as={HiChevronRight} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ navItems, isAuthenticated, user, onLogout }) => {
  // Combine regular nav items with admin nav items if user is admin
  const allNavItems = user?.isAdmin 
    ? [...navItems, ...ADMIN_NAV_ITEMS] 
    : navItems;

  return (
    <Stack 
      bg={useColorModeValue('white', 'gray.800')} 
      p={4} 
      display={{ md: 'none' }}
      borderTop="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      boxShadow={useColorModeValue(
        '0 4px 6px rgba(0, 0, 0, 0.05)',
        '0 4px 6px rgba(0, 0, 0, 0.3)'
      )}
    >
      {allNavItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      
      <Stack spacing={3} mt={6} pt={4} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        {!isAuthenticated ? (
          <>
            <Button
              as={RouterLink}
              to="/login"
              fontSize={'sm'}
              fontWeight={500}
              variant={'outline'}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              color={useColorModeValue('gray.700', 'gray.200')}
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.700'),
              }}
              height="44px"
            >
              Sign In
            </Button>
            <Button
              as={RouterLink}
              to="/signup"
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'blue.500'}
              _hover={{
                bg: 'blue.600',
              }}
              height="44px"
            >
              Sign Up
            </Button>
          </>
        ) : (
          <Button
            onClick={onLogout}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'red.500'}
            _hover={{
              bg: 'red.600',
            }}
            height="44px"
          >
            Logout
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={2}>
      <Flex
        py={3}
        as={children ? Box : Link}
        href={!children ? href : undefined}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.50', 'gray.700'),
        }}
        cursor="pointer"
        onClick={children && onToggle}
        borderRadius="md"
        px={2}
        transition="all 0.2s"
      >
        <Text 
          fontWeight={600} 
          color={useColorModeValue('gray.700', 'gray.200')}
          fontSize="sm"
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={HiChevronDown}
            transition={'all .2s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={5}
            h={5}
            color={useColorModeValue('gray.500', 'gray.400')}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          pl={4}
          borderLeft={2}
          borderStyle={'solid'}
          borderColor={useColorModeValue('blue.200', 'blue.700')}
          ml={2}
          spacing={2}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                as={RouterLink}
                to={child.href}
                py={2}
                px={2}
                fontSize="sm"
                color={useColorModeValue('gray.600', 'gray.300')}
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ 
                  textDecoration: 'none', 
                  color: 'blue.500',
                  bg: useColorModeValue('blue.50', 'gray.700'),
                }}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
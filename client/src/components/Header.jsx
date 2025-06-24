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
  Badge,
} from '@chakra-ui/react';
import {
  HiMenu,
  HiX,
  HiChevronDown,
  HiChevronRight,
  HiMoon,
  HiSun,
  HiShoppingCart,
  HiHeart,
} from 'react-icons/hi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { selectCartItemsCount } from '../store/slices/cartSlice';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    id: 'home',
    public: true,
  },
  {
    label: 'Shop',
    id: 'shop',
    children: [
      {
        label: 'All Products',
        subLabel: 'Browse our complete catalog',
        href: '/products',
        id: 'all-products',
      },
      {
        label: 'Categories',
        subLabel: 'Shop by product category',
        href: '/categories',
        id: 'categories',
      },
      {
        label: 'New Arrivals',
        subLabel: 'See our latest products',
        href: '/products/new',
        id: 'new-arrivals',
      },
    ],
    public: true,
  },
  {
    label: 'My Orders',
    href: '/orders',
    id: 'user-orders',
    private: true,
  },
  {
    label: (props) => {
      const { wishlistItems } = useSelector((state) => state.wishlist);
      return (
        <HStack spacing={2}>
          <HiHeart size={18} />
          <Box as="span">Wishlist</Box>
          {wishlistItems.length > 0 && (
            <Badge
              colorScheme="pink"
              borderRadius="full"
              px={2}
            >
              {wishlistItems.length}
            </Badge>
          )}
        </HStack>
      );
    },
    href: '/wishlist',
    id: 'wishlist',
    private: true,
  },
];

// Separate cart item for mobile navigation
const CART_NAV_ITEM = {
  label: (props) => {
    const itemCount = useSelector(selectCartItemsCount);
    return (
      <HStack spacing={2}>
        <HiShoppingCart size={18} />
        <Box as="span">Cart</Box>
        {itemCount > 0 && (
          <Badge
            colorScheme="blue"
            borderRadius="full"
            px={2}
          >
            {itemCount}
          </Badge>
        )}
      </HStack>
    );
  },
  href: '/cart',
  id: 'cart',
  public: true,
};

const ADMIN_NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    id: 'admin-dashboard',
  },
  {
    label: 'Products',
    href: '/admin/products',
    id: 'admin-products',
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    id: 'admin-orders',
  },
  {
    label: 'Users',
    href: '/admin/users',
    id: 'admin-users',
  },
];

// Cart Button Component for desktop
const CartButton = () => {
  const itemCount = useSelector(selectCartItemsCount);
  
  return (
    <Button
      as={RouterLink}
      to="/cart"
      variant="ghost"
      leftIcon={<HiShoppingCart size={18} />}
      fontSize="sm"
      fontWeight={500}
      color={useColorModeValue('gray.600', 'gray.300')}
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.700'),
        color: useColorModeValue('gray.800', 'white'),
      }}
      height="38px"
      px={4}
      position="relative"
    >
      Cart
      {itemCount > 0 && (
        <Badge
          colorScheme="blue"
          borderRadius="full"
          px={2}
          ml={2}
          minW="20px"
          height="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );
};

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

  // Filter navigation items based on auth status (excluding cart)
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.private && !isAuthenticated) return false;
    if (item.public || isAuthenticated) return true;
    return false;
  });

  // Combine regular nav items with admin nav items if user is admin
  const allNavItems = user?.isAdmin 
    ? [...filteredNavItems, ...ADMIN_NAV_ITEMS] 
    : filteredNavItems;

  // For mobile, include cart in navigation
  const mobileNavItems = user?.isAdmin 
    ? [...filteredNavItems, CART_NAV_ITEM, ...ADMIN_NAV_ITEMS] 
    : [...filteredNavItems, CART_NAV_ITEM];

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
              {/* Desktop Cart Button */}
              <Box display={{ base: 'none', md: 'block' }}>
                <CartButton />
              </Box>

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
                              key={item.id}
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
        <MobileNav navItems={mobileNavItems} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
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
        <Box key={navItem.id}>
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
                {typeof navItem.label === 'function' ? navItem.label() : navItem.label}
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
                    <DesktopSubNav key={child.id} {...child} />
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
      {navItems.map((navItem) => (
        <MobileNavItem key={`nav-${navItem.id}`} {...navItem} />
      ))}
      
      {/* Mobile Auth Section */}
      <Stack pt={4} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')} mt={4}>
        {!isAuthenticated ? (
          <HStack spacing={3}>
            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              size="sm"
              flex={1}
            >
              Sign In
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="blue"
              size="sm"
              flex={1}
            >
              Sign Up
            </Button>
          </HStack>
        ) : (
          <Stack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('gray.700', 'gray.200')}>
              Welcome, {user?.name}!
            </Text>
            <Button
              as={RouterLink}
              to="/profile"
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
            >
              Profile
            </Button>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
              color="red.500"
            >
              Logout
            </Button>
          </Stack>
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
        as={children ? Box : RouterLink}
        to={!children ? href : undefined}
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
        <Box 
          fontWeight={600} 
          color={useColorModeValue('gray.700', 'gray.200')}
          fontSize="sm"
        >
          {typeof label === 'function' ? label() : label}
        </Box>
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
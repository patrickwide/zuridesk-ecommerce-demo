import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Stack,
  Input,
  Select,
  HStack,
  useColorModeValue,
  Image,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Badge,
} from '@chakra-ui/react';
import { HiShoppingCart, HiEye } from 'react-icons/hi';

const ProductsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Mock products data - will be replaced with real data from backend
  const products = [
    { 
      id: 1, 
      name: 'Ergonomic Office Chair', 
      price: 299.99, 
      category: 'Chairs',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
      stock: 15
    },
    { 
      id: 2, 
      name: 'Standing Desk', 
      price: 499.99, 
      category: 'Desks',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80',
      stock: 8
    },
    { 
      id: 3, 
      name: 'Filing Cabinet', 
      price: 199.99, 
      category: 'Storage',
      image: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=200&q=80',
      stock: 12
    }
  ];

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleAddToCart = (product) => {
    // Add to cart logic will be implemented with Redux
    console.log('Adding to cart:', product);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading
          as="h1"
          size="xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Our Products
        </Heading>

        {/* Filters and Search */}
        <HStack spacing={4}>
          <Input
            placeholder="Search products..."
            maxW="sm"
          />
          <Select placeholder="Category" maxW="xs">
            <option value="chairs">Chairs</option>
            <option value="desks">Desks</option>
            <option value="storage">Storage</option>
          </Select>
          <Select placeholder="Sort by" maxW="xs">
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </Select>
        </HStack>

        {/* Products Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {products.map((product) => (
            <Box
              key={product.id}
              bg={useColorModeValue('white', 'gray.800')}
              p={6}
              rounded="lg"
              shadow="base"
              _hover={{
                transform: 'translateY(-5px)',
                shadow: 'lg',
              }}
              transition="all 0.3s"
            >
              <Stack spacing={4}>
                <Box
                  as={RouterLink}
                  to={`/products/${product.id}`}
                  position="relative"
                  h="200px"
                  rounded="md"
                  overflow="hidden"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
                <Stack spacing={2}>
                  <Heading 
                    as={RouterLink}
                    to={`/products/${product.id}`}
                    size="md"
                    _hover={{ color: useColorModeValue('blue.600', 'blue.300') }}
                  >
                    {product.name}
                  </Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.300')}>
                    {product.category}
                  </Text>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={useColorModeValue('blue.600', 'blue.300')}
                  >
                    ${product.price.toFixed(2)}
                  </Text>
                  <HStack>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      colorScheme="blue"
                      leftIcon={<HiShoppingCart />}
                      flex="1"
                    >
                      Add to Cart
                    </Button>
                    <IconButton
                      icon={<HiEye />}
                      variant="outline"
                      aria-label="Quick view"
                      onClick={() => handleQuickView(product)}
                    />
                  </HStack>
                </Stack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>

      {/* Quick View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProduct && (
              <Stack spacing={6}>
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  height="300px"
                  objectFit="cover"
                  rounded="md"
                />
                <Stack spacing={4}>
                  <Text color={useColorModeValue('gray.600', 'gray.300')}>
                    Category: {selectedProduct.category}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.300')}>
                    ${selectedProduct.price.toFixed(2)}
                  </Text>
                  <Badge colorScheme={selectedProduct.stock > 0 ? 'green' : 'red'}>
                    {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <Button
                    as={RouterLink}
                    to={`/products/${selectedProduct.id}`}
                    colorScheme="blue"
                    width="full"
                  >
                    View Details
                  </Button>
                </Stack>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductsPage;
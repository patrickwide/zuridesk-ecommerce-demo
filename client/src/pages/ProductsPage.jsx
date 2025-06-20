import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
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
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Skeleton,
} from '@chakra-ui/react';
import { HiShoppingCart, HiEye } from 'react-icons/hi';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import AddToCart from '../components/ui/AddToCart';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const fallbackSrc = "https://via.placeholder.com/400x400?text=Product+Image";

  // Initialize state from URL parameters on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const sortFromUrl = searchParams.get('sort') || '';

    setSearchQuery(searchFromUrl);
    setCategoryFilter(categoryFromUrl);
    setSortBy(sortFromUrl);
    setIsInitialized(true);
  }, [searchParams]);

  // Update URL when filters change (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const params = new URLSearchParams();
    if (categoryFilter) params.set('category', categoryFilter);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params);
  }, [categoryFilter, searchQuery, sortBy, setSearchParams, isInitialized]);

  useEffect(() => {
    // Load categories when component mounts
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products only after initialization is complete
  useEffect(() => {
    if (!isInitialized) return;
    
    dispatch(fetchProducts({
      keyword: searchQuery,
      category: categoryFilter,
    }));
  }, [dispatch, searchQuery, categoryFilter, isInitialized]);

  // Update URL when category filter changes
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const sortProducts = (productsToSort) => {
    if (!sortBy) return productsToSort;

    return [...productsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const groupProductsByCategory = (productsToGroup) => {
    // If a category filter is active, use a single group
    if (categoryFilter) {
      const activeCategory = categories.find(c => c._id === categoryFilter);
      const groupName = activeCategory ? activeCategory.name : 'Products';
      return {
        [groupName]: productsToGroup
      };
    }

    // Otherwise group by all categories
    return productsToGroup.reduce((acc, product) => {
      const category = typeof product.category === 'object' 
        ? product.category.name 
        : product.category;
      
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };

  // Don't render until initialization is complete
  if (!isInitialized || loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box>
          <Heading
            as="h1"
            size="xl"
            color={textColor}
            mb={4}
          >
            {categoryFilter ? categories.find(c => c._id === categoryFilter)?.name || 'Products' : 'Our Products'}
          </Heading>
          {!categoryFilter && (
            <Text
              color={textSecondary}
              fontSize="lg"
            >
              Browse our complete collection of office furniture and accessories
            </Text>
          )}
        </Box>

        {/* Filters and Search */}
        <HStack spacing={4} wrap="wrap" gap={4}>
          <Input
            placeholder="Search products..."
            maxW={{ base: "full", md: "sm" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select 
            placeholder="Category" 
            maxW={{ base: "full", md: "xs" }}
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select 
            placeholder="Sort by" 
            maxW={{ base: "full", md: "xs" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </Select>
        </HStack>

        {/* Products by Category */}
        {Object.entries(groupProductsByCategory(sortProducts(products))).map(([category, categoryProducts]) => (
          <Stack key={category} spacing={4}>
            {!categoryFilter && (
              <Heading 
                as="h2" 
                size="lg" 
                color={textColor}
                pt={4}
              >
                {category}
              </Heading>
            )}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {categoryProducts.map((product) => (
                <Box
                  key={product._id}
                  bg={bgColor}
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
                      to={`/products/${product._id}`}
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
                        fallback={<Skeleton height="200px" />}
                        fallbackSrc={fallbackSrc}
                        onError={(e) => {
                          e.target.src = fallbackSrc;
                        }}
                      />
                    </Box>
                    <Stack spacing={2}>
                      <Heading 
                        as={RouterLink}
                        to={`/products/${product._id}`}
                        size="md"
                        _hover={{ color: accentColor }}
                      >
                        {product.name}
                      </Heading>
                      <Text color={textSecondary}>
                        {product.brand}
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={accentColor}
                      >
                        ${product.price.toFixed(2)}
                      </Text>
                      <HStack>
                        <AddToCart 
                          product={product}
                          flex="1"
                        />
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
        ))}
      </Stack>

      {/* Quick View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct?.name || ''}</ModalHeader>
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
                  fallback={<Skeleton height="300px" width="100%" />}
                  fallbackSrc={fallbackSrc}
                  onError={(e) => {
                    e.target.src = fallbackSrc;
                  }}
                />
                <Stack spacing={4}>
                  <Text color={textSecondary}>
                    Category: {typeof selectedProduct.category === 'object' ? selectedProduct.category.name : selectedProduct.category}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                    ${selectedProduct.price.toFixed(2)}
                  </Text>
                  <Badge colorScheme={selectedProduct.countInStock > 0 ? 'green' : 'red'}>
                    {selectedProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <Text>{selectedProduct.description}</Text>
                  <AddToCart 
                    product={selectedProduct}
                    width="full"
                    onSuccess={onClose}
                  />
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
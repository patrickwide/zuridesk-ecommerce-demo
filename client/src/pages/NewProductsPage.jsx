import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Image,
  HStack,
  Badge,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Skeleton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import AddToCart from '../components/ui/AddToCart';

const NewProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  
  // Define all color mode values at the top level - never conditionally
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const accentColor = useColorModeValue('blue.600', 'blue.300');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    dispatch(fetchProducts({})); // This will get the latest products by default since they're sorted by createdAt
  }, [dispatch]);

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

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading as="h1" size="xl" color={textColor}>
          New Arrivals
        </Heading>
        <Text fontSize="lg" color={subtextColor}>
          Check out our latest products and newest additions to our catalog
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {products.map((product) => (
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
                  <Text color={subtextColor}>
                    {product.description.substring(0, 100)}...
                  </Text>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={accentColor}
                  >
                    ${product.price.toFixed(2)}
                  </Text>
                  <HStack>
                    <Badge colorScheme={product.countInStock > 0 ? 'green' : 'red'}>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </HStack>
                  <AddToCart product={product} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default NewProductsPage;
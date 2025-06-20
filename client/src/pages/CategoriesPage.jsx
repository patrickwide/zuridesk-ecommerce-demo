import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Stack,
  Image,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Skeleton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchCategories } from '../store/slices/categorySlice';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const fallbackImageUrl = "https://via.placeholder.com/800x600?text=Category+Image";

  useEffect(() => {
    dispatch(fetchCategories());
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
        <Box textAlign="center" mb={8}>
          <Heading
            as="h1"
            size="xl"
            mb={4}
            color={useColorModeValue('gray.900', 'white')}
          >
            Product Categories
          </Heading>
          <Text
            fontSize="lg"
            color={useColorModeValue('gray.600', 'gray.300')}
            maxW="2xl"
            mx="auto"
          >
            Explore our wide range of office furniture and accessories designed for modern workspaces
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {categories.map((category) => (
            <Box
              key={category._id}
              as={RouterLink}
              to={`/products?category=${category._id}`}
              bg={useColorModeValue('white', 'gray.800')}
              rounded="lg"
              overflow="hidden"
              shadow="base"
              _hover={{
                transform: 'translateY(-5px)',
                shadow: 'lg',
                textDecoration: 'none'
              }}
              transition="all 0.3s"
            >
              <Box position="relative" h="200px">
                <Image
                  src={category.image}
                  alt={category.name}
                  objectFit="cover"
                  w="full"
                  h="full"
                  fallback={<Skeleton height="200px" />}
                  fallbackSrc={fallbackImageUrl}
                  onError={(e) => {
                    e.target.src = fallbackImageUrl;
                  }}
                />
              </Box>
              <Box p={6}>
                <Stack spacing={2}>
                  <Heading
                    size="md"
                    color={useColorModeValue('gray.900', 'white')}
                  >
                    {category.name}
                  </Heading>
                  <Text
                    color={useColorModeValue('gray.600', 'gray.300')}
                  >
                    {category.description}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={useColorModeValue('blue.600', 'blue.300')}
                    fontWeight="semibold"
                  >
                    View Products →
                  </Text>
                </Stack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default CategoriesPage;
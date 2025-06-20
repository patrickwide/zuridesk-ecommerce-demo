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

  // Call all hooks at the top level, before any conditional returns
  const bgColor = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const linkColor = useColorModeValue('blue.600', 'blue.300');

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
            color={headingColor}
          >
            Product Categories
          </Heading>
          <Text
            fontSize="lg"
            color={textColor}
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
              bg={bgColor}
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
                    color={headingColor}
                  >
                    {category.name}
                  </Heading>
                  <Text
                    color={textColor}
                  >
                    {category.description}
                  </Text>
                  <Text
                    fontSize="sm"
                    color={linkColor}
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
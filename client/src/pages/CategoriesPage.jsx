import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  Stack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const CategoriesPage = () => {
  // Mock categories data - will be replaced with real data from backend
  const categories = [
    {
      id: 1,
      name: 'Office Chairs',
      description: 'Ergonomic seating solutions for your workspace',
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=500&q=80',
      productCount: 24
    },
    {
      id: 2,
      name: 'Desks',
      description: 'Standing desks and workstations',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=500&q=80',
      productCount: 18
    },
    {
      id: 3,
      name: 'Storage',
      description: 'Filing cabinets and organization solutions',
      image: 'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=500&q=80',
      productCount: 12
    },
    {
      id: 4,
      name: 'Accessories',
      description: 'Office essentials and desk accessories',
      image: 'https://images.unsplash.com/photo-1587467512961-120760940315?auto=format&fit=crop&w=500&q=80',
      productCount: 36
    }
  ];

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
              key={category.id}
              as={RouterLink}
              to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
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
                    {category.productCount} Products
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
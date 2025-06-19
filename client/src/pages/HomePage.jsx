import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Stack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('blue.50', 'gray.800')}
        borderBottom="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        py={{ base: 12, md: 20 }}
        mb={12}
      >
        <Container maxW="container.xl">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={8}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack flex={1} spacing={5} maxW={{ base: 'xl', lg: '2xl' }}>
              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="shorter"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                Premium Office Furniture for Modern Workspaces
              </Heading>
              <Text
                fontSize="xl"
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight="tall"
              >
                Transform your workspace with our carefully curated collection of ergonomic and stylish office furniture. Designed for comfort, built for productivity.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/products"
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  fontWeight="bold"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  as={RouterLink}
                  to="/categories"
                  size="lg"
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('gray.800', 'white')}
                  px={8}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.600'),
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  fontWeight="bold"
                >
                  Browse Categories
                </Button>
              </Stack>
            </Stack>
            <Box
              flex={1}
              position="relative"
              w="full"
              maxW={{ base: 'md', lg: '2xl' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern office space"
                borderRadius="2xl"
                objectFit="cover"
                w="full"
                h={{ base: '300px', lg: '400px' }}
                shadow="2xl"
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Container maxW="container.xl" py={12}>
        <Heading
          as="h2"
          size="xl"
          mb={8}
          textAlign="center"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
        >
          Featured Categories
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {['Office Chairs', 'Desks', 'Storage'].map((category) => (
            <Box
              key={category}
              bg={useColorModeValue('white', 'gray.800')}
              p={8}
              rounded="xl"
              shadow="lg"
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              _hover={{
                transform: 'translateY(-5px)',
                shadow: '2xl',
              }}
              transition="all 0.3s"
            >
              <Stack spacing={4}>
                <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                  {category}
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.300')}>
                  Explore our collection of {category.toLowerCase()}
                </Text>
                <Button
                  as={RouterLink}
                  to={`/categories/${category.toLowerCase().replace(' ', '-')}`}
                  colorScheme="blue"
                  variant="ghost"
                  size="lg"
                  rightIcon={
                    <Box as="span" ml={2} mb={2}>→</Box>
                  }
                >
                  View Collection
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HomePage;
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box maxW="400px" mx="auto">
          <Image
            src="https://illustrations.popsy.co/gray/falling.svg"
            alt="404 Illustration"
            width="full"
            height="auto"
          />
        </Box>

        <Heading
          as="h1"
          size="2xl"
          color={useColorModeValue('gray.900', 'white')}
        >
          Page Not Found
        </Heading>

        <Text
          fontSize="lg"
          color={useColorModeValue('gray.600', 'gray.400')}
          maxW="lg"
        >
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </Text>

        <Button
          as={RouterLink}
          to="/"
          size="lg"
          colorScheme="blue"
          px={8}
        >
          Back to Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;
import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Heading,
  Checkbox,
  Divider,
  useColorModeValue,
  Center,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LoginPage = () => {
  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      py={12}
      px={4}
    >
      <Center>
        <Stack spacing={8} mx="auto" maxW="lg" w="full">
          <Stack align="center" spacing={2}>
            <Heading
              fontSize="4xl"
              color={useColorModeValue('gray.900', 'white')}
            >
              Sign in to your account
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              to continue to ZuriDesk
            </Text>
          </Stack>

          <Box
            rounded="lg"
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow="lg"
            p={8}
            w="full"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  autoComplete="email"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  _hover={{
                    borderColor: useColorModeValue('gray.400', 'gray.500')
                  }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: 'outline'
                  }}
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  autoComplete="current-password"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  _hover={{
                    borderColor: useColorModeValue('gray.400', 'gray.500')
                  }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: 'outline'
                  }}
                />
              </FormControl>

              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align="start"
                  justify="space-between"
                >
                  <Checkbox
                    colorScheme="blue"
                  >
                    Remember me
                  </Checkbox>
                  <Text
                    as={RouterLink}
                    to="/forgot-password"
                    color="blue.500"
                    _hover={{ color: 'blue.600' }}
                    fontSize="sm"
                  >
                    Forgot password?
                  </Text>
                </Stack>

                <Button
                  bg="blue.500"
                  color="white"
                  _hover={{
                    bg: 'blue.600',
                  }}
                  _active={{
                    bg: 'blue.700',
                  }}
                  size="lg"
                  fontSize="md"
                >
                  Sign in
                </Button>
              </Stack>

              <Stack spacing={6} pt={6}>
                <Text align="center" fontSize="sm">
                  Don't have an account?{' '}
                  <Text
                    as={RouterLink}
                    to="/register"
                    color="blue.500"
                    _hover={{ color: 'blue.600' }}
                    display="inline-block"
                    fontWeight="semibold"
                  >
                    Register now
                  </Text>
                </Text>

                <Divider />

                <Stack spacing={4}>
                  <Button
                    variant="outline"
                    leftIcon={
                      <Icon viewBox="0 0 24 24" w={5} h={5}>
                        <path
                          fill="currentColor"
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        />
                      </Icon>
                    }
                    width="full"
                    fontSize="sm"
                    color={useColorModeValue('gray.700', 'gray.200')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{
                      bg: useColorModeValue('gray.50', 'gray.700')
                    }}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={
                      <Icon viewBox="0 0 24 24" w={5} h={5}>
                        <path
                          fill="currentColor"
                          d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"
                        />
                      </Icon>
                    }
                    width="full"
                    fontSize="sm"
                    color={useColorModeValue('gray.700', 'gray.200')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{
                      bg: useColorModeValue('gray.50', 'gray.700')
                    }}
                  >
                    Continue with Facebook
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Center>
    </Box>
  );
};

export default LoginPage;
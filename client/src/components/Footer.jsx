import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  const footerLinks = {
    'Shop': [
      { label: 'All Products', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'New Arrivals', href: '/products/new' },
    ],
    'Customer Service': [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
    ],
    'Company': [
      { label: 'About Us', href: '/about' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container maxW="container.xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {/* Brand section */}
          <Stack spacing={6}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={useColorModeValue('gray.800', 'white')}
            >
              ZuriDesk
            </Text>
            <Text fontSize="sm">
              Premium office furniture solutions for modern workspaces.
            </Text>
            <Stack direction="row" spacing={2}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebook />}
                size="sm"
                variant="ghost"
                _hover={{ color: 'blue.500' }}
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                size="sm"
                variant="ghost"
                _hover={{ color: 'blue.400' }}
              />
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                size="sm"
                variant="ghost"
                _hover={{ color: 'pink.500' }}
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                size="sm"
                variant="ghost"
                _hover={{ color: 'blue.600' }}
              />
            </Stack>
          </Stack>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Stack key={title} spacing={4}>
              <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                {title}
              </Text>
              <Stack spacing={2}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    as={RouterLink}
                    to={link.href}
                    fontSize="sm"
                    _hover={{ color: 'blue.500' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>

      {/* Copyright */}
      <Box
        borderTop="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        py={4}
      >
        <Container maxW="container.xl">
          <Text fontSize="sm" textAlign="center">
            © {new Date().getFullYear()} ZuriDesk. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
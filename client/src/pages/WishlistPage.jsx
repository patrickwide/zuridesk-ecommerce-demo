import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Button,
  Stack,
  useColorModeValue,
  IconButton,
  Badge,
  Skeleton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HiOutlineHeart, HiShoppingCart } from 'react-icons/hi';
import { removeFromWishlist } from '../store/actions/wishlistActions';
import AddToCart from '../components/ui/AddToCart';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading size="lg">My Wishlist</Heading>

        {wishlistItems.length === 0 ? (
          <Text>Your wishlist is empty</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {wishlistItems.map((product) => (
              <Box
                key={product._id}
                p={6}
                bg={bgColor}
                rounded="lg"
                shadow="sm"
                position="relative"
              >
                <IconButton
                  position="absolute"
                  top={4}
                  right={4}
                  icon={<HiOutlineHeart />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => dispatch(removeFromWishlist(product._id))}
                  aria-label="Remove from wishlist"
                />

                <Image
                  src={product.image}
                  alt={product.name}
                  height={200}
                  width="100%"
                  objectFit="cover"
                  rounded="md"
                  fallback={<Skeleton height={200} width="100%" rounded="md" />}
                />

                <Stack mt={4} spacing={2}>
                  <RouterLink to={`/products/${product._id}`}>
                    <Heading size="md" color={textColor}>
                      {product.name}
                    </Heading>
                  </RouterLink>

                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    ${product.price.toFixed(2)}
                  </Text>

                  {product.countInStock > 0 ? (
                    <Badge colorScheme="green">In Stock</Badge>
                  ) : (
                    <Badge colorScheme="red">Out of Stock</Badge>
                  )}

                  <AddToCart product={product} />
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
};

export default WishlistPage;
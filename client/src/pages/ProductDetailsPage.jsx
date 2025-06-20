import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Image,
  Stack,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  IconButton,
  Skeleton,
  Alert,
  AlertIcon,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiCheck, 
  HiShoppingCart, 
  HiStar,
  HiTruck,
  HiRefresh,
  HiShieldCheck,
  HiHeart,
  HiShare,
  HiPencilAlt,
} from 'react-icons/hi';
import { fetchProductById } from '../store/slices/productSlice';
import AddToCart from '../components/ui/AddToCart';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const [isWishListed, setIsWishListed] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Move ALL useColorModeValue calls to the top level - they must be called on every render
  const cardBg = useColorModeValue('white', 'gray.800');
  const priceColor = useColorModeValue('blue.600', 'blue.300');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const shippingInfoBg = useColorModeValue('gray.50', 'gray.700');
  const specColor = useColorModeValue('gray.600', 'gray.400');
  const reviewBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleToggleWishlist = () => {
    setIsWishListed(!isWishListed);
    // Add wishlist logic here when implementing wishlist feature
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

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

  if (!product) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
        {/* Product Images */}
        <GridItem>
          <Box
            bg={cardBg}
            p={6}
            rounded="lg"
            shadow="base"
          >
            <Image
              src={product.image}
              alt={product.name}
              width="full"
              height="500px"
              objectFit="cover"
              rounded="md"
              fallback={<Skeleton height="500px" />}
            />
          </Box>
        </GridItem>

        {/* Product Info */}
        <GridItem>
          <Stack spacing={6}>
            <Box>
              <HStack justify="space-between" mb={2}>
                <Badge colorScheme={product.countInStock > 0 ? 'green' : 'red'}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <HStack>
                  <HStack color="yellow.400">
                    <HiStar />
                    <Text>{product.rating}</Text>
                  </HStack>
                  <Text color="gray.500">({product.numReviews} reviews)</Text>
                </HStack>
              </HStack>
              <Heading size="xl" mb={2}>{product.name}</Heading>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={priceColor}
              >
                ${product.price.toFixed(2)}
              </Text>
            </Box>

            <Text color={descriptionColor}>
              {product.description}
            </Text>

            {/* Product Actions */}
            <Box>
              <AddToCart 
                product={product}
              />
              
              <HStack mt={4}>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  flex="1"
                  leftIcon={<HiHeart />}
                  colorScheme={isWishListed ? "pink" : "gray"}
                >
                  {isWishListed ? "Wishlisted" : "Add to Wishlist"}
                </Button>
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  flex="1"
                  leftIcon={<HiShare />}
                >
                  Share
                </Button>
              </HStack>
              
              <Button
                onClick={() => setIsReviewModalOpen(true)}
                variant="ghost"
                leftIcon={<HiPencilAlt />}
                mt={4}
                width="full"
              >
                Write a Review
              </Button>
            </Box>

            {/* Shipping Info */}
            <VStack
              bg={shippingInfoBg}
              p={4}
              rounded="md"
              align="stretch"
              spacing={3}
            >
              <HStack>
                <HiTruck size={20} />
                <Text>Free shipping on orders over $500</Text>
              </HStack>
              <HStack>
                <HiRefresh size={20} />
                <Text>30-day return policy</Text>
              </HStack>
              <HStack>
                <HiShieldCheck size={20} />
                <Text>2-year warranty</Text>
              </HStack>
            </VStack>
          </Stack>
        </GridItem>
      </Grid>

      {/* Product Details Tabs */}
      <Box mt={12}>
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Specifications</Tab>
            <Tab>Reviews</Tab>
            <Tab>Shipping</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Text>{product.description}</Text>
            </TabPanel>

            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                <Box>
                  <Text fontWeight="bold">Brand</Text>
                  <Text color={specColor}>
                    {product.brand}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Category</Text>
                  <Text color={specColor}>
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </Text>
                </Box>
              </Grid>
            </TabPanel>

            <TabPanel>
              <VStack align="stretch" spacing={4}>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <Box
                      key={index}
                      p={4}
                      bg={reviewBg}
                      rounded="md"
                    >
                      <HStack mb={2}>
                        <Text fontWeight="bold">{review.name}</Text>
                        <HStack color="yellow.400">
                          {Array(5).fill('').map((_, i) => (
                            <HiStar
                              key={i}
                              opacity={i < review.rating ? 1 : 0.3}
                            />
                          ))}
                        </HStack>
                      </HStack>
                      <Text>{review.comment}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No reviews yet. Be the first to review this product!</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="sm" mb={2}>Delivery Information</Heading>
                  <Text>
                    Free standard shipping on orders over $500. Delivery time is
                    typically 3-5 business days depending on your location.
                  </Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>Return Policy</Heading>
                  <Text>
                    We offer a 30-day return policy for all our products. Items must
                    be unused and in their original packaging.
                  </Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>Warranty</Heading>
                  <Text>
                    This product comes with a 2-year manufacturer's warranty covering
                    defects in materials and workmanship.
                  </Text>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <HStack spacing={2}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <IconButton
                      key={rating}
                      icon={<HiStar />}
                      variant="ghost"
                      color="yellow.400"
                      aria-label={`Rate ${rating} stars`}
                    />
                  ))}
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Review</FormLabel>
                <Textarea placeholder="Share your thoughts about this product..." />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Submit Review
            </Button>
            <Button onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductDetailsPage;
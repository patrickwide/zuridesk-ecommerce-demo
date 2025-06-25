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
  useToast,
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
  HiTrash,
} from 'react-icons/hi';
import { fetchProductById } from '../store/slices/productSlice';
import AddToCart from '../components/ui/AddToCart';
import { addToWishlist, removeFromWishlist } from '../store/actions/wishlistActions';
import { createReview, deleteReview } from '../store/actions/reviewActions';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();  // Add useToast hook
  const { product, loading, error } = useSelector((state) => state.products);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const { loading: isReviewLoading, error: reviewError } = useSelector((state) => state.reviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item._id === id);

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
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(product));
    }
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

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login?redirect=products/' + id);
      return;
    }

    if (!rating || !comment.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please provide both rating and comment",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(createReview({ productId: id, review: { rating, comment } })).unwrap();
      
      // Fetch fresh product data to update the reviews
      await dispatch(fetchProductById(id));
      
      setRating(0);
      setComment('');
      setIsReviewModalOpen(false);

      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Review Error",
        description: typeof error === 'string' ? error : error?.message || "Could not submit review",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await dispatch(deleteReview({ productId: id, reviewId })).unwrap();
      
      // Fetch fresh product data to update the reviews
      await dispatch(fetchProductById(id));
      
      toast({
        title: "Review deleted",
        description: "Your review has been removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Could not delete review",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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

  // Get reviews for this product
  const reviews = product?.reviews || [];

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
                  colorScheme={isInWishlist ? "pink" : "gray"}
                >
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
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
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Box
                      key={review._id}
                      p={4}
                      bg={reviewBg}
                      rounded="md"
                      position="relative"
                    >
                      <HStack mb={2} justify="space-between">
                        <HStack>
                          <Text fontWeight="bold">{review.name}</Text>
                          <HStack color="yellow.400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <HiStar
                                key={star}
                                opacity={star <= review.rating ? 1 : 0.3}
                              />
                            ))}
                          </HStack>
                        </HStack>
                        <Text color="gray.500" fontSize="sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                      <Text>{review.comment}</Text>
                      
                      {/* Show delete button if user owns review or is admin */}
                      {(user?._id === review.user || user?.isAdmin) && (
                        <IconButton
                          position="absolute"
                          top={2}
                          right={2}
                          size="sm"
                          icon={<HiTrash />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteReview(review._id)}
                          isLoading={isReviewLoading}
                          aria-label="Delete review"
                        />
                      )}
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
              <FormControl isRequired>
                <FormLabel>Rating</FormLabel>
                <HStack spacing={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                      key={star}
                      icon={<HiStar />}
                      variant="ghost"
                      color={star <= rating ? "yellow.400" : "gray.300"}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} stars`}
                    />
                  ))}
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Review</FormLabel>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSubmitReview}
              isLoading={isReviewLoading}
            >
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
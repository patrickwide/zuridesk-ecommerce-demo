import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
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

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isWishListed, setIsWishListed] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Mock product data - will be replaced with Redux state
  const product = {
    id: 1,
    name: 'Ergonomic Office Chair',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Premium ergonomic office chair designed for maximum comfort during long work hours. Features adjustable height, lumbar support, and breathable mesh material.',
    features: [
      'Adjustable height and armrests',
      'Breathable mesh back',
      'Ergonomic lumbar support',
      '360-degree swivel',
      'Heavy-duty base with smooth-rolling casters'
    ],
    specifications: {
      'Material': 'Mesh and High-grade Plastic',
      'Weight Capacity': '300 lbs',
      'Seat Height': '17-21 inches',
      'Assembly Required': 'Yes',
      'Warranty': '2 Years'
    },
    stock: 15,
    sku: 'CHAIR-001',
    category: 'Chairs',
    rating: 4.5,
    reviews: 128
  };

  const handleAddToCart = () => {
    // Handle add to cart logic here
    console.log('Adding to cart:', { productId: id, quantity });
  };

  const handleToggleWishlist = () => {
    setIsWishListed(!isWishListed);
    // Add wishlist logic here
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

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
        {/* Product Images */}
        <GridItem>
          <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            rounded="lg"
            shadow="base"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width="full"
              height="500px"
              objectFit="cover"
              rounded="md"
            />
            <HStack mt={4} spacing={4}>
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor={index === 0 ? 'blue.500' : 'transparent'}
                  rounded="md"
                  overflow="hidden"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width="100px"
                    height="100px"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </HStack>
          </Box>
        </GridItem>

        {/* Product Info */}
        <GridItem>
          <Stack spacing={6}>
            <Box>
              <HStack justify="space-between" mb={2}>
                <Badge colorScheme="green">In Stock</Badge>
                <HStack>
                  <HStack color="yellow.400">
                    <HiStar />
                    <Text>{product.rating}</Text>
                  </HStack>
                  <Text color="gray.500">({product.reviews} reviews)</Text>
                </HStack>
              </HStack>
              <Heading size="xl" mb={2}>{product.name}</Heading>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                ${product.price.toFixed(2)}
              </Text>
            </Box>

            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              {product.description}
            </Text>

            {/* Product Actions */}
            <Box>
              <HStack mb={4}>
                <Text>Quantity:</Text>
                <NumberInput
                  value={quantity}
                  onChange={(value) => setQuantity(Number(value))}
                  min={1}
                  max={product.stock}
                  maxW="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text color="gray.500">
                  {product.stock} units available
                </Text>
              </HStack>
              
              <Stack spacing={4}>
                <Button
                  onClick={handleAddToCart}
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  leftIcon={<HiShoppingCart />}
                >
                  Add to Cart
                </Button>
                
                <HStack>
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
                >
                  Write a Review
                </Button>
              </Stack>
            </Box>

            {/* Shipping Info */}
            <VStack
              bg={useColorModeValue('gray.50', 'gray.700')}
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
            <Tab>Features</Tab>
            <Tab>Specifications</Tab>
            <Tab>Shipping</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <List spacing={3}>
                {product.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListIcon as={HiCheck} color="green.500" />
                    {feature}
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Box key={key}>
                    <Text fontWeight="bold">{key}</Text>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      {value}
                    </Text>
                  </Box>
                ))}
              </Grid>
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
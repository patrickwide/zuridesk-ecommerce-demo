import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useColorModeValue,
  HStack,
  Input,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiSearch,
  HiDotsVertical,
  HiUpload,
} from 'react-icons/hi';

const ProductsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock products data - will be replaced with Redux state
  const products = [
    {
      id: 1,
      name: 'Ergonomic Office Chair',
      sku: 'CHAIR-001',
      price: 299.99,
      stock: 15,
      category: 'Chairs',
      status: 'In Stock',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Standing Desk',
      sku: 'DESK-001',
      price: 499.99,
      stock: 8,
      category: 'Desks',
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=100&q=80'
    }
  ];

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'green';
      case 'Low Stock':
        return 'orange';
      case 'Out of Stock':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <HStack justify="space-between">
          <Heading
            as="h1"
            size="xl"
            color={useColorModeValue('gray.900', 'white')}
          >
            Products
          </Heading>
          <Button
            leftIcon={<HiPlus />}
            colorScheme="blue"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </HStack>

        {/* Filters */}
        <HStack spacing={4}>
          <Input
            placeholder="Search products..."
            maxW="sm"
            leftIcon={<HiSearch />}
          />
          <Select placeholder="Category" maxW="xs">
            <option value="chairs">Chairs</option>
            <option value="desks">Desks</option>
            <option value="storage">Storage</option>
          </Select>
          <Select placeholder="Status" maxW="xs">
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </Select>
        </HStack>

        {/* Products Table */}
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          rounded="lg"
          shadow="base"
          overflow="hidden"
        >
          <Table>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <HStack>
                      <Image
                        src={product.image}
                        alt={product.name}
                        boxSize="40px"
                        objectFit="cover"
                        rounded="md"
                      />
                      <Box>
                        {product.name}
                      </Box>
                    </HStack>
                  </Td>
                  <Td>{product.sku}</Td>
                  <Td>{product.category}</Td>
                  <Td>${product.price.toFixed(2)}</Td>
                  <Td>{product.stock}</Td>
                  <Td>
                    <Badge colorScheme={getStockStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<HiDotsVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<HiPencil />}
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<HiTrash />}
                          color="red.500"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} as="form" onSubmit={handleSubmit} pb={6}>
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  defaultValue={selectedProduct?.name}
                  placeholder="Enter product name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>SKU</FormLabel>
                <Input
                  defaultValue={selectedProduct?.sku}
                  placeholder="Enter SKU"
                />
              </FormControl>

              <HStack>
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    defaultValue={selectedProduct?.price}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput
                    defaultValue={selectedProduct?.stock}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  defaultValue={selectedProduct?.category.toLowerCase()}
                  placeholder="Select category"
                >
                  <option value="chairs">Chairs</option>
                  <option value="desks">Desks</option>
                  <option value="storage">Storage</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter product description"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Product Image</FormLabel>
                <Button
                  leftIcon={<HiUpload />}
                  variant="outline"
                  width="full"
                >
                  Upload Image
                </Button>
              </FormControl>

              <Button type="submit" colorScheme="blue" mt={4}>
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProductsPage;
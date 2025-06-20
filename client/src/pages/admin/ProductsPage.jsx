import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
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
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useToast,
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
  const toast = useToast();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    image: '',
    brand: '',
  });

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        price: selectedProduct.price,
        stock: selectedProduct.countInStock, // Fix: use countInStock instead of stock
        category: selectedProduct.category,
        description: selectedProduct.description,
        image: selectedProduct.image,
        brand: selectedProduct.brand,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
        category: '',
        description: '',
        image: '',
        brand: '',
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: searchQuery,
        category: categoryFilter,
      })
    );
  }, [dispatch, searchQuery, categoryFilter]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    if (!statusFilter) return true;

    switch (statusFilter) {
      case 'in-stock':
        return product.countInStock > 10;
      case 'low-stock':
        return product.countInStock > 0 && product.countInStock <= 10;
      case 'out-of-stock':
        return product.countInStock === 0;
      default:
        return true;
    }
  });

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.countInStock, // Fix: use countInStock instead of stock
      category: product.category,
      description: product.description,
      image: product.image,
      brand: product.brand,
    });
    onOpen();
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        countInStock: formData.stock, // Fix: map stock to countInStock
      };
      
      if (selectedProduct) {
        const result = await dispatch(
          updateProduct({ id: selectedProduct._id, data: productData })
        ).unwrap();
        toast({
          title: 'Product updated.',
          description: String(result.name) + ' has been updated successfully.',
          status: 'success',
          duration: 5000,
        });
      } else {
        const result = await dispatch(createProduct(productData)).unwrap();
        toast({
          title: 'Product created.',
          description: String(result.name) + ' has been added successfully.',
          status: 'success',
          duration: 5000,
        });
      }
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast({
          title: 'Product deleted.',
          description: 'The product has been removed successfully.',
          status: 'success',
          duration: 5000,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to delete product',
          status: 'error',
          duration: 5000,
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<HiSearch />}
          />
          <Select
            placeholder="Category"
            maxW="xs"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Status"
            maxW="xs"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
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
              {filteredProducts.map((product) => (
                <Tr key={product._id}>
                  <Td>
                    <HStack>
                      <Image
                        src={product.image}
                        alt={product.name}
                        boxSize="40px"
                        objectFit="cover"
                        rounded="md"
                      />
                      <Box>{product.name}</Box>
                    </HStack>
                  </Td>
                  <Td>{product.sku}</Td>
                  <Td>{product.category}</Td>
                  <Td>${product.price.toFixed(2)}</Td>
                  <Td>{product.countInStock}</Td>
                  <Td>
                    <Badge
                      colorScheme={getStockStatusColor(
                        product.countInStock > 10
                          ? 'In Stock'
                          : product.countInStock > 0
                          ? 'Low Stock'
                          : 'Out of Stock'
                      )}
                    >
                      {product.countInStock > 10
                        ? 'In Stock'
                        : product.countInStock > 0
                        ? 'Low Stock'
                        : 'Out of Stock'}
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
                          onClick={() => handleDeleteProduct(product._id)}
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>SKU</FormLabel>
                <Input
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                />
              </FormControl>

              <HStack>
                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    value={formData.price}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, price: Number(value) }))
                    }
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
                    value={formData.stock}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, stock: Number(value) }))
                    }
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
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Select category"
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Brand</FormLabel>
                <Input
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
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
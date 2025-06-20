import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  IconButton,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { HiShoppingCart, HiPlus, HiMinus } from 'react-icons/hi';
import { 
  addToCart, 
  incrementCartItem, 
  decrementCartItem, 
  selectCartItem 
} from '../../store/slices/cartSlice';

const AddToCart = ({ 
  product, 
  showQuantity = false, 
  size = 'md',
  variant = 'solid',
  colorScheme = 'blue',
  isIconOnly = false,
  maxW,
  onSuccess
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  
  // Check if product is already in cart
  const cartItem = useSelector(state => selectCartItem(state, product._id));
  const isInCart = Boolean(cartItem);

  const handleAddToCart = () => {
    try {
      dispatch(addToCart({
        _id: product._id, // Use _id consistently
        name: product.name,
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
        qty: quantity
      }));

      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} added to cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not add to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleIncrement = () => {
    if (cartItem && cartItem.qty < product.countInStock) {
      dispatch(incrementCartItem(product._id));
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      dispatch(decrementCartItem(product._id));
    }
  };

  const handleQuantityChange = (value) => {
    const newQty = Number(value);
    if (newQty >= 1 && newQty <= product.countInStock) {
      setQuantity(newQty);
    }
  };

  // If product is out of stock
  if (!product.countInStock) {
    return (
      <Button
        colorScheme="gray"
        variant="outline"
        size={size}
        isDisabled={true}
        width={showQuantity ? "auto" : "full"}
      >
        Out of Stock
      </Button>
    );
  }

  // If showing as icon only
  if (isIconOnly) {
    if (isInCart) {
      return (
        <HStack spacing={1}>
          <IconButton
            icon={<HiMinus />}
            onClick={handleDecrement}
            size="sm"
            variant="outline"
            colorScheme={colorScheme}
            aria-label="Decrease quantity"
          />
          <Text fontSize="sm" fontWeight="bold" minW="30px" textAlign="center">
            {cartItem.qty}
          </Text>
          <IconButton
            icon={<HiPlus />}
            onClick={handleIncrement}
            size="sm"
            colorScheme={colorScheme}
            aria-label="Increase quantity"
            isDisabled={cartItem.qty >= product.countInStock}
          />
        </HStack>
      );
    }

    return (
      <IconButton
        icon={<HiShoppingCart />}
        onClick={handleAddToCart}
        variant={variant}
        colorScheme={colorScheme}
        size={size}
        aria-label="Add to cart"
      />
    );
  }

  // If product is already in cart, show quantity controls
  if (isInCart) {
    return (
      <VStack spacing={2} maxW={maxW}>
        <HStack spacing={3}>
          <IconButton
            icon={<HiMinus />}
            onClick={handleDecrement}
            size={size}
            variant="outline"
            colorScheme={colorScheme}
            aria-label="Decrease quantity"
          />
          <VStack spacing={0}>
            <Text fontSize="lg" fontWeight="bold" minW="40px" textAlign="center">
              {cartItem.qty}
            </Text>
            <Text fontSize="xs" color="gray.500">
              in cart
            </Text>
          </VStack>
          <IconButton
            icon={<HiPlus />}
            onClick={handleIncrement}
            size={size}
            colorScheme={colorScheme}
            aria-label="Increase quantity"
            isDisabled={cartItem.qty >= product.countInStock}
          />
        </HStack>
        {cartItem.qty >= product.countInStock && (
          <Badge colorScheme="orange" fontSize="xs">
            Max quantity reached
          </Badge>
        )}
      </VStack>
    );
  }

  // Default: Show add to cart button with optional quantity selector
  return (
    <HStack spacing={4} maxW={maxW}>
      {showQuantity && (
        <NumberInput
          value={quantity}
          onChange={handleQuantityChange}
          min={1}
          max={product.countInStock}
          maxW="100px"
          size={size}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
      
      <Button
        onClick={handleAddToCart}
        leftIcon={<HiShoppingCart />}
        colorScheme={colorScheme}
        variant={variant}
        size={size}
        width={showQuantity ? "auto" : "full"}
      >
        Add to Cart
      </Button>
    </HStack>
  );
};

export default AddToCart;
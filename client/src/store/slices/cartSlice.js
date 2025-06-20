import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

// Async Thunks
export const validateAndAddToCart = createAsyncThunk(
  'cart/validateAndAddToCart', // Update internal name to match export name
  async ({ productId, qty }, { rejectWithValue }) => {
    try {
      const product = await productService.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.countInStock < qty) {
        throw new Error('Not enough stock available');
      }
      return { ...product, qty };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get cart from localStorage
const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: null, paymentMethod: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartFromStorage,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        // Update the quantity (replace, don't add)
        existingItem.qty = item.qty;
        existingItem.countInStock = item.countInStock; // Update stock info
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      // Debug logging
      console.log('Remove from cart - ID to remove:', action.payload);
      console.log('Cart items before removal:', state.cartItems);
      
      state.cartItems = state.cartItems.filter((x) => {
        const itemId = x._id || x.id; // Handle both _id and id properties
        console.log('Comparing item id:', itemId, 'with id to remove:', action.payload);
        return itemId !== action.payload;
      });
      
      console.log('Cart items after removal:', state.cartItems);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateCartItemQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => (x._id === id || x.id === id));
      if (item && qty > 0) {
        item.qty = qty;
      } else if (item && qty <= 0) {
        // Remove item if quantity is 0 or less
        state.cartItems = state.cartItems.filter((x) => (x._id !== id && x.id !== id));
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    incrementCartItem: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((x) => (x._id === id || x.id === id));
      if (item && item.qty < item.countInStock) {
        item.qty += 1;
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    decrementCartItem: (state, action) => {
      const id = action.payload;
      const item = state.cartItems.find((x) => (x._id === id || x.id === id));
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          // Remove item if quantity becomes 0
          state.cartItems = state.cartItems.filter((x) => (x._id !== id && x.id !== id));
        }
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.cartItems = [];
      // Don't clear shipping address when clearing cart
      localStorage.setItem('cart', JSON.stringify(state));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateAndAddToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.cartItems.find((x) => x._id === item._id);

        if (existingItem) {
          // Add the new quantity to the existing quantity
          existingItem.qty += item.qty;
          existingItem.countInStock = item.countInStock; // Update stock info
        } else {
          state.cartItems.push(item);
        }
        localStorage.setItem('cart', JSON.stringify(state));
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQty,
  incrementCartItem,
  decrementCartItem,
  saveShippingAddress,
  savePaymentMethod,
  clearCart
} = cartSlice.actions;

// Selector for cart total
export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0);

// Selector for cart items count
export const selectCartItemsCount = (state) =>
  state.cart.cartItems.reduce((count, item) => count + item.qty, 0);

// Selector to check if product is in cart
export const selectCartItem = (state, productId) =>
  state.cart.cartItems.find((item) => item._id === productId);

export const selectShippingAddress = (state) => state.cart.shippingAddress;

export default cartSlice.reducer;
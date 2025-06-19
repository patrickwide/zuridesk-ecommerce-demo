import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Async thunk to add item to cart (validates stock first)
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const product = await productService.getById(productId);
      
      if (product.countInStock < quantity) {
        return rejectWithValue('Not enough items in stock');
      }

      return {
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

const initialState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity <= item.countInStock) {
          item.quantity = quantity;
          saveCartToStorage(state.items);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const existingItem = state.items.find(item => item.id === action.payload.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + action.payload.quantity;
          if (newQuantity <= existingItem.countInStock) {
            existingItem.quantity = newQuantity;
          }
        } else {
          state.items.push(action.payload);
        }
        
        saveCartToStorage(state.items);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { removeFromCart, updateQuantity, clearCart, clearError } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemsCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
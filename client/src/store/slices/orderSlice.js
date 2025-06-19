import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.create(orderData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getMyOrders();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.getById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateOrderToPaid = createAsyncThunk(
  'orders/updateOrderToPaid',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderService.updateToPaid(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order payment');
    }
  }
);

export const updateOrderToDelivered = createAsyncThunk(
  'orders/updateOrderToDelivered',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderService.updateToDelivered(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order delivery');
    }
  }
);

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrder: (state) => {
      state.order = null;
      state.success = false;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order To Paid
      .addCase(updateOrderToPaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderToPaid.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderToPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order To Delivered
      .addCase(updateOrderToDelivered.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderToDelivered.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderToDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrderError, resetOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
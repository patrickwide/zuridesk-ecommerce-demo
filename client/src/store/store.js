import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';
import dashboardReducer from './slices/dashboardSlice';
import wishlistReducer from './reducers/wishlistReducer';
import reviewReducer from './reducers/reviewReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,
    orders: orderReducer,
    products: productReducer,
    dashboard: dashboardReducer,
    wishlist: wishlistReducer,
    reviews: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
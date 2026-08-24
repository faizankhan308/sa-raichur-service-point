import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    booking: bookingReducer
  }
});

export default store;

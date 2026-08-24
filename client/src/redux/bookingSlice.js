import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  activeBooking: null,
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
      state.error = null;
    },
    fetchBookingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBookingStatusInStore: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(b => b.id === id || b._id === id);
      if (booking) {
        booking.status = status;
      }
    },
    setActiveBooking: (state, action) => {
      state.activeBooking = action.payload;
    },
    clearActiveBooking: (state) => {
      state.activeBooking = null;
    }
  }
});

export const {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  updateBookingStatusInStore,
  setActiveBooking,
  clearActiveBooking
} = bookingSlice.actions;

export const selectBookings = (state) => state.booking.bookings;
export const selectActiveBooking = (state) => state.booking.activeBooking;
export const selectBookingLoading = (state) => state.booking.loading;

export default bookingSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('saraichur_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('saraichur_cart', JSON.stringify(items));
  } catch (err) {}
};

const initialState = {
  items: loadCartFromStorage() // items format: [{ id, name, price, category, quantity }]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, category } = action.payload;
      const existing = state.items.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id, name, price, category, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existing = state.items.find(item => item.id === id);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;

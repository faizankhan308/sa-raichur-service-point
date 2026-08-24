import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('saraichur_admin_token');
const username = localStorage.getItem('saraichur_admin_user');

const initialState = {
  token: token || null,
  username: username || null,
  isAuthenticated: !!token,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('saraichur_admin_token', action.payload.token);
      localStorage.setItem('saraichur_admin_user', action.payload.username);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('saraichur_admin_token');
      localStorage.removeItem('saraichur_admin_user');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;

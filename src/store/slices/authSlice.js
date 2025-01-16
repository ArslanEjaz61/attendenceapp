import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
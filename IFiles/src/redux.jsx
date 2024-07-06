import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: {} },
  reducers: {
    addUserData: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { addUserData } = userSlice.actions;
const userReducer = userSlice.reducer;

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

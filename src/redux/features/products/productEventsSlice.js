import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shouldRefetch: false,
};

const productEventsSlice = createSlice({
  name: "productEvents",
  initialState,
  reducers: {
    triggerRefetch: (state) => {
      state.shouldRefetch = true;
    },
    resetTrigger: (state) => {
      state.shouldRefetch = false;
    },
  },
});

export const { triggerRefetch, resetTrigger } = productEventsSlice.actions;
export default productEventsSlice.reducer;

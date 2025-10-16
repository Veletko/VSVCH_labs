import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    category: 'all',
    sortBy: 'title',
  },
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
});

export const { setCategory, setSortBy } = filterSlice.actions;
export default filterSlice.reducer;
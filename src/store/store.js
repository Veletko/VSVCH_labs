import { configureStore } from '@reduxjs/toolkit';
import servicesSliceReducer from './Slices/servicesSlice.js';
import filterSliceReducer from './Slices/filterSlice.js';

const store = configureStore({
  reducer: {
    services: servicesSliceReducer,
    filters: filterSliceReducer,
  },
});

export default store;
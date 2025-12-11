import { configureStore } from '@reduxjs/toolkit';
import mastersSlice from './slices/mastersSlice';
import workersSlice from './slices/workersSlice';
import machinesSlice from './slices/machinesSlice';
import maintenanceSlice from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    masters: mastersSlice,
    workers: workersSlice,
    machines: machinesSlice,
    maintenance: maintenanceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
import { configureStore } from '@reduxjs/toolkit';
import mastersSlice from './slices/mastersSlice';
import workersSlice from './slices/workersSlice';
import machinesSlice from './slices/machinesSlice';
import maintenanceSlice from './slices/maintenanceSlice';
import workshopsSlice from './slices/workshopsSlice';
import authReducer from './slices/authSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    masters: mastersSlice,
    workers: workersSlice,
    machines: machinesSlice,
    maintenance: maintenanceSlice,
    workshops: workshopsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
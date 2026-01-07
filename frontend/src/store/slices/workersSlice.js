import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workersAPI } from '../../services/api';

export const fetchWorkers = createAsyncThunk(
  'workers/fetchWorkers',
  async (params = {}) => {
    const response = await workersAPI.getAll(params);
    return response.data;
  }
);

export const fetchWorkerById = createAsyncThunk(
  'workers/fetchWorkerById',
  async (id) => {
    const response = await workersAPI.getById(id);
    return response.data;
  }
);

export const createWorker = createAsyncThunk(
  'workers/createWorker',
  async (workerData) => {
    const response = await workersAPI.create(workerData);
    return response.data;
  }
);

export const updateWorker = createAsyncThunk(
  'workers/updateWorker',
  async ({ id, data }) => {
    // Конвертируем id в строку, если это ObjectId
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    const response = await workersAPI.update(idString, data);
    return response.data;
  }
);

export const deleteWorker = createAsyncThunk(
  'workers/deleteWorker',
  async (id) => {
    // Конвертируем id в строку, если это ObjectId
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    await workersAPI.delete(idString);
    return idString;
  }
);

const workersSlice = createSlice({
  name: 'workers',
  initialState: {
    items: [], // Теперь всегда содержит рабочих с информацией о мастере
    currentWorker: null,
    loading: false,
    error: null,
    pagination: {}
  },
  reducers: {
    clearCurrentWorker: (state) => {
      state.currentWorker = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all workers (теперь всегда с информацией о мастере)
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch worker by ID (теперь всегда с информацией о мастере)
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.currentWorker = action.payload.data;
      })
      // Create worker
      .addCase(createWorker.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      // Update worker
      .addCase(updateWorker.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload.data._id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.currentWorker && state.currentWorker._id === action.payload.data._id) {
          state.currentWorker = action.payload.data;
        }
      })
      // Delete worker
      .addCase(deleteWorker.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export const { clearCurrentWorker, clearError } = workersSlice.actions;
export default workersSlice.reducer;
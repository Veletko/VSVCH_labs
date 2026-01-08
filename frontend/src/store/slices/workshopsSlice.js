import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workshopsAPI } from '../../services/api';

export const fetchWorkshops = createAsyncThunk(
  'workshops/fetchWorkshops',
  async (params = {}) => {
    const response = await workshopsAPI.getAll(params);
    return response.data;
  }
);

export const fetchWorkshopById = createAsyncThunk(
  'workshops/fetchWorkshopById',
  async (id) => {
    const response = await workshopsAPI.getById(id);
    return response.data;
  }
);

export const createWorkshop = createAsyncThunk(
  'workshops/createWorkshop',
  async (workshopData) => {
    const response = await workshopsAPI.create(workshopData);
    return response.data;
  }
);

export const updateWorkshop = createAsyncThunk(
  'workshops/updateWorkshop',
  async ({ id, data }) => {
    const response = await workshopsAPI.update(id, data);
    return response.data;
  }
);

export const deleteWorkshop = createAsyncThunk(
  'workshops/deleteWorkshop',
  async (id) => {
    await workshopsAPI.delete(id);
    return id;
  }
);

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState: {
    items: [],
    currentWorkshop: null,
    loading: false,
    error: null,
    pagination: {}
  },
  reducers: {
    clearCurrentWorkshop: (state) => {
      state.currentWorkshop = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all workshops
      .addCase(fetchWorkshops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkshops.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch workshop by ID
      .addCase(fetchWorkshopById.fulfilled, (state, action) => {
        state.currentWorkshop = action.payload.data;
      })
      // Create workshop
      .addCase(createWorkshop.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      // Update workshop
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.data.id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.currentWorkshop && state.currentWorkshop.id === action.payload.data.id) {
          state.currentWorkshop = action.payload.data;
        }
      })
      // Delete workshop
      .addCase(deleteWorkshop.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentWorkshop && state.currentWorkshop.id === action.payload) {
          state.currentWorkshop = null;
        }
      });
  }
});

export const { clearCurrentWorkshop, clearError } = workshopsSlice.actions;
export default workshopsSlice.reducer;

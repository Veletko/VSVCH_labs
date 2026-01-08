import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workshopsAPI } from '../../services/api';

export const fetchWorkshops = createAsyncThunk(
  'workshops/fetchWorkshops',
  async () => {
    const response = await workshopsAPI.getAll();
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
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    const response = await workshopsAPI.update(idString, data);
    return response.data;
  }
);

export const saveWorkshopLayout = createAsyncThunk(
  'workshops/saveWorkshopLayout',
  async ({ id, elements, canvasWidth, canvasHeight }) => {
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    const response = await workshopsAPI.saveLayout(idString, { elements, canvasWidth, canvasHeight });
    return response.data;
  }
);

export const deleteWorkshop = createAsyncThunk(
  'workshops/deleteWorkshop',
  async (id) => {
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    await workshopsAPI.delete(idString);
    return idString;
  }
);

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState: {
    items: [],
    currentWorkshop: null,
    loading: false,
    error: null
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
      .addCase(fetchWorkshops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkshops.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || action.payload;
      })
      .addCase(fetchWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWorkshopById.fulfilled, (state, action) => {
        state.currentWorkshop = action.payload.data || action.payload;
      })
      .addCase(createWorkshop.fulfilled, (state, action) => {
        state.items.push(action.payload.data || action.payload);
        state.currentWorkshop = action.payload.data || action.payload;
      })
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        const updatedWorkshop = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item._id === updatedWorkshop._id);
        if (index !== -1) {
          state.items[index] = updatedWorkshop;
        }
        if (state.currentWorkshop && state.currentWorkshop._id === updatedWorkshop._id) {
          state.currentWorkshop = updatedWorkshop;
        }
      })
      .addCase(saveWorkshopLayout.fulfilled, (state, action) => {
        const updatedWorkshop = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item._id === updatedWorkshop._id);
        if (index !== -1) {
          state.items[index] = updatedWorkshop;
        }
        if (state.currentWorkshop && state.currentWorkshop._id === updatedWorkshop._id) {
          state.currentWorkshop = updatedWorkshop;
        }
      })
      .addCase(deleteWorkshop.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.currentWorkshop && state.currentWorkshop._id === action.payload) {
          state.currentWorkshop = null;
        }
      });
  }
});

export const { clearCurrentWorkshop, clearError } = workshopsSlice.actions;
export default workshopsSlice.reducer;

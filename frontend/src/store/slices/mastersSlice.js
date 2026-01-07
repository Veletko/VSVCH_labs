import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mastersAPI } from '../../services/api';

export const fetchMasters = createAsyncThunk(
  'masters/fetchMasters',
  async (params = {}) => {
    const response = await mastersAPI.getAll(params);
    return response.data;
  }
);

export const fetchMasterById = createAsyncThunk(
  'masters/fetchMasterById',
  async (id) => {
    const response = await mastersAPI.getById(id);
    return response.data;
  }
);

export const createMaster = createAsyncThunk(
  'masters/createMaster',
  async (masterData) => {
    const response = await mastersAPI.create(masterData);
    return response.data;
  }
);

export const updateMaster = createAsyncThunk(
  'masters/updateMaster',
  async ({ id, data }) => {
    // Конвертируем id в строку, если это ObjectId
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    const response = await mastersAPI.update(idString, data);
    return response.data;
  }
);

export const deleteMaster = createAsyncThunk(
  'masters/deleteMaster',
  async (id) => {
    // Конвертируем id в строку, если это ObjectId
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    await mastersAPI.delete(idString);
    return idString;
  }
);

const mastersSlice = createSlice({
  name: 'masters',
  initialState: {
    items: [],
    currentMaster: null,
    loading: false,
    error: null,
    pagination: {}
  },
  reducers: {
    clearCurrentMaster: (state) => {
      state.currentMaster = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all masters
      .addCase(fetchMasters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch master by ID
      .addCase(fetchMasterById.fulfilled, (state, action) => {
        state.currentMaster = action.payload.data;
      })
      // Create master
      .addCase(createMaster.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      // Update master
      .addCase(updateMaster.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload.data._id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.currentMaster && state.currentMaster._id === action.payload.data._id) {
          state.currentMaster = action.payload.data;
        }
      })
      // Delete master
      .addCase(deleteMaster.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export const { clearCurrentMaster, clearError } = mastersSlice.actions;
export default mastersSlice.reducer;
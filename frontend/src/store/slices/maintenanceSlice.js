import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { maintenanceAPI } from '../../services/api';

export const fetchMaintenance = createAsyncThunk(
  'maintenance/fetchMaintenance',
  async (params = {}) => {
    const response = await maintenanceAPI.getAll(params);
    return response.data;
  }
);

export const fetchMaintenanceDetailed = createAsyncThunk(
  'maintenance/fetchMaintenanceDetailed',
  async (params = {}) => {
    const response = await maintenanceAPI.getAllDetailed(params);
    return response.data;
  }
);

export const fetchMaintenanceByState = createAsyncThunk(
  'maintenance/fetchMaintenanceByState',
  async ({ state, params = {} }) => {
    const response = await maintenanceAPI.getByState(state, params);
    return { state, data: response.data };
  }
);

export const fetchMaintenanceById = createAsyncThunk(
  'maintenance/fetchMaintenanceById',
  async (id) => {
    const response = await maintenanceAPI.getById(id);
    return response.data;
  }
);

export const createMaintenance = createAsyncThunk(
  'maintenance/createMaintenance',
  async (maintenanceData) => {
    const response = await maintenanceAPI.create(maintenanceData);
    return response.data;
  }
);

export const updateMaintenance = createAsyncThunk(
  'maintenance/updateMaintenance',
  async ({ id, data }) => {
    // Конвертируем id в строку, если это ObjectId
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    const response = await maintenanceAPI.update(idString, data);
    return response.data;
  }
);

export const deleteMaintenance = createAsyncThunk(
  'maintenance/deleteMaintenance',
  async (id) => {
    // Конвертируем id в строку, если это ObjectId
    const idString = typeof id === 'object' && id?.toString ? id.toString() : String(id);
    await maintenanceAPI.delete(idString);
    return idString;
  }
);

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: {
    items: [],
    itemsDetailed: [],
    itemsByState: {},
    currentMaintenance: null,
    loading: false,
    error: null,
    pagination: {},
    paginationByState: {}
  },
  reducers: {
    clearCurrentMaintenance: (state) => {
      state.currentMaintenance = null;
    },
    clearItemsByState: (state, action) => {
      if (action.payload) {
        delete state.itemsByState[action.payload];
      } else {
        state.itemsByState = {};
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all maintenance
      .addCase(fetchMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch detailed maintenance
      .addCase(fetchMaintenanceDetailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceDetailed.fulfilled, (state, action) => {
        state.loading = false;
        state.itemsDetailed = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMaintenanceDetailed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch maintenance by state
      .addCase(fetchMaintenanceByState.fulfilled, (state, action) => {
        state.itemsByState[action.payload.state] = action.payload.data.data;
        state.paginationByState[action.payload.state] = action.payload.data.pagination;
      })
      // Fetch maintenance by ID
      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.currentMaintenance = action.payload.data;
      })
      // Create maintenance
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
        state.itemsDetailed.push(action.payload.data);
      })
      // Update maintenance
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload.data._id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        const indexDetailed = state.itemsDetailed.findIndex(item => item._id === action.payload.data._id);
        if (indexDetailed !== -1) {
          state.itemsDetailed[indexDetailed] = action.payload.data;
        }
        // Update in itemsByState if exists
        Object.keys(state.itemsByState).forEach(stateKey => {
          const stateIndex = state.itemsByState[stateKey].findIndex(item => item._id === action.payload.data._id);
          if (stateIndex !== -1) {
            if (action.payload.data.state === stateKey) {
              state.itemsByState[stateKey][stateIndex] = action.payload.data;
            } else {
              // Remove from current state array if state changed
              state.itemsByState[stateKey].splice(stateIndex, 1);
            }
          }
        });
        if (state.currentMaintenance && state.currentMaintenance._id === action.payload.data._id) {
          state.currentMaintenance = action.payload.data;
        }
      })
      // Delete maintenance
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        state.itemsDetailed = state.itemsDetailed.filter(item => item._id !== action.payload);
        // Remove from itemsByState
        Object.keys(state.itemsByState).forEach(stateKey => {
          state.itemsByState[stateKey] = state.itemsByState[stateKey].filter(item => item._id !== action.payload);
        });
      });
  }
});

export const { clearCurrentMaintenance, clearItemsByState, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
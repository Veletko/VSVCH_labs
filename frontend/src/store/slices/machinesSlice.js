import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { machinesAPI } from '../../services/api';

export const fetchMachines = createAsyncThunk(
  'machines/fetchMachines',
  async (params = {}) => {
    const response = await machinesAPI.getAll(params);
    return response.data;
  }
);

export const fetchMachineById = createAsyncThunk(
  'machines/fetchMachineById',
  async (id) => {
    const response = await machinesAPI.getById(id);
    return response.data;
  }
);

export const fetchMachineStatistics = createAsyncThunk(
  'machines/fetchMachineStatistics',
  async (id) => {
    const response = await machinesAPI.getStatistics(id);
    return response.data;
  }
);

export const createMachine = createAsyncThunk(
  'machines/createMachine',
  async (machineData) => {
    const response = await machinesAPI.create(machineData);
    return response.data;
  }
);

export const updateMachine = createAsyncThunk(
  'machines/updateMachine',
  async ({ id, data }) => {
    const response = await machinesAPI.update(id, data);
    return response.data;
  }
);

export const deleteMachine = createAsyncThunk(
  'machines/deleteMachine',
  async (id) => {
    await machinesAPI.delete(id);
    return id;
  }
);

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    items: [],
    currentMachine: null,
    statistics: {},
    loading: false,
    error: null,
    pagination: {}
  },
  reducers: {
    clearCurrentMachine: (state) => {
      state.currentMachine = null;
    },
    clearStatistics: (state) => {
      state.statistics = {};
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all machines
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch machine by ID
      .addCase(fetchMachineById.fulfilled, (state, action) => {
        state.currentMachine = action.payload.data;
      })
      // Fetch machine statistics
      .addCase(fetchMachineStatistics.fulfilled, (state, action) => {
        state.statistics[action.meta.arg] = action.payload.data;
      })
      // Create machine
      .addCase(createMachine.fulfilled, (state, action) => {
        state.items.push(action.payload.data);
      })
      // Update machine
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.data.id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.currentMachine && state.currentMachine.id === action.payload.data.id) {
          state.currentMachine = action.payload.data;
        }
      })
      // Delete machine
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearCurrentMachine, clearStatistics, clearError } = machinesSlice.actions;
export default machinesSlice.reducer;
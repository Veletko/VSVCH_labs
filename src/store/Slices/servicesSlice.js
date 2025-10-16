import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/cards');
      if (!response.ok) {
        throw new Error('Не удалось загрузить услуги');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      return rejectWithValue(error.message || 'Не удалось загрузить услуги');
    }
  }
);

export const addService = createAsyncThunk(
  'services/addService',
  async (service, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });
      if (!response.ok) {
        throw new Error('Не удалось добавить услугу');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при добавлении услуги:', error);
      return rejectWithValue(error.message || 'Не удалось добавить услугу');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async (updatedCard, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/cards/${updatedCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });
      if (!response.ok) {
        throw new Error('Не удалось обновить услугу');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении услуги:', error);
      return rejectWithValue(error.message || 'Не удалось обновить услугу');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/cards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Не удалось удалить услугу');
      }
      return id;
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      return rejectWithValue(error.message || 'Не удалось удалить услугу');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
        state.error = null;
      })
      .addCase(addService.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
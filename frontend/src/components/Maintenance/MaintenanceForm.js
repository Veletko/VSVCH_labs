import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createMaintenance, updateMaintenance, fetchMaintenanceDetailed } from '../../store/slices/maintenanceSlice';
import { fetchMasters } from '../../store/slices/mastersSlice';
import { fetchMachines } from '../../store/slices/machinesSlice';

const stateOptions = [
  { value: 'planned', label: 'Запланировано' },
  { value: 'in_progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершено' },
  { value: 'cancelled', label: 'Отменено' }
];

const MaintenanceForm = ({ maintenance, onClose }) => {
  const dispatch = useDispatch();
  const { items: masters } = useSelector(state => state.masters);
  const { items: machines } = useSelector(state => state.machines);
  const [formData, setFormData] = useState({
    machine_id: '',
    master_id: '',
    state: 'planned',
    start_date: '',
    end_date: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    dispatch(fetchMasters());
    dispatch(fetchMachines());
  }, [dispatch]);

  useEffect(() => {
    if (maintenance) {
      const startDate = maintenance.start_date 
        ? new Date(maintenance.start_date).toISOString().slice(0, 16)
        : '';
      const endDate = maintenance.end_date 
        ? new Date(maintenance.end_date).toISOString().slice(0, 16)
        : '';
      
      // Извлекаем ID правильно: если это объект (после populate), берем _id, иначе берем значение напрямую
      const machineId = maintenance.machine_id 
        ? (typeof maintenance.machine_id === 'object' ? maintenance.machine_id._id : maintenance.machine_id)
        : '';
      const masterId = maintenance.master_id 
        ? (typeof maintenance.master_id === 'object' ? maintenance.master_id._id : maintenance.master_id)
        : '';
      
      setFormData({
        machine_id: machineId || '',
        master_id: masterId || '',
        state: maintenance.state || 'planned',
        start_date: startDate,
        end_date: endDate
      });
    }
  }, [maintenance]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.machine_id) {
      newErrors.machine_id = 'Машина обязательна';
    }
    
    if (!formData.master_id) {
      newErrors.master_id = 'Мастер обязателен';
    }

    if (!formData.state) {
      newErrors.state = 'Статус обязателен';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Дата начала обязательна';
    }

    if (formData.end_date && formData.start_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        newErrors.end_date = 'Дата окончания должна быть после даты начала';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        machine_id: formData.machine_id, // MongoDB ObjectId - строка, не число
        master_id: formData.master_id,   // MongoDB ObjectId - строка, не число
        state: formData.state,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
      };

      if (maintenance) {
        await dispatch(updateMaintenance({ id: maintenance._id, data: submitData })).unwrap();
      } else {
        await dispatch(createMaintenance(submitData)).unwrap();
      }
      // Обновляем список обслуживания с детальной информацией
      await dispatch(fetchMaintenanceDetailed());
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при сохранении');
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {submitError && (
          <Alert severity="error">{submitError}</Alert>
        )}

        <FormControl fullWidth error={!!errors.machine_id}>
          <InputLabel>Машина *</InputLabel>
          <Select
            value={formData.machine_id || ''}
            label="Машина *"
            onChange={handleChange('machine_id')}
          >
            {machines.map((machine) => (
              <MenuItem key={machine._id} value={machine._id}>
                Машина #{machine._id}
              </MenuItem>
            ))}
          </Select>
          {errors.machine_id && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
              {errors.machine_id}
            </Box>
          )}
        </FormControl>

        <FormControl fullWidth error={!!errors.master_id}>
          <InputLabel>Мастер *</InputLabel>
          <Select
            value={formData.master_id || ''}
            label="Мастер *"
            onChange={handleChange('master_id')}
          >
            {masters.map((master) => (
              <MenuItem key={master._id} value={master._id}>
                {master.last_name} {master.first_name} {master.middle_name || ''}
              </MenuItem>
            ))}
          </Select>
          {errors.master_id && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
              {errors.master_id}
            </Box>
          )}
        </FormControl>

        <FormControl fullWidth error={!!errors.state}>
          <InputLabel>Статус *</InputLabel>
          <Select
            value={formData.state || 'planned'}
            label="Статус *"
            onChange={handleChange('state')}
          >
            {stateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors.state && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
              {errors.state}
            </Box>
          )}
        </FormControl>

        <TextField
          label="Дата начала *"
          type="datetime-local"
          value={formData.start_date}
          onChange={handleChange('start_date')}
          error={!!errors.start_date}
          helperText={errors.start_date}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Дата окончания"
          type="datetime-local"
          value={formData.end_date}
          onChange={handleChange('end_date')}
          error={!!errors.end_date}
          helperText={errors.end_date}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained">
          {maintenance ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default MaintenanceForm;


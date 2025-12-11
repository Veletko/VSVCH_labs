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
import { createWorker, updateWorker } from '../../store/slices/workersSlice';
import { fetchMasters } from '../../store/slices/mastersSlice';

const WorkerForm = ({ worker, onClose }) => {
  const dispatch = useDispatch();
  const { items: masters } = useSelector(state => state.masters);
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    master_id: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    dispatch(fetchMasters());
  }, [dispatch]);

  useEffect(() => {
    if (worker) {
      setFormData({
        last_name: worker.last_name || '',
        first_name: worker.first_name || '',
        middle_name: worker.middle_name || '',
        master_id: worker.master_id || ''
      });
    }
  }, [worker]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Фамилия обязательна';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Имя обязательно';
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
        ...formData,
        master_id: formData.master_id || null
      };

      if (worker) {
        await dispatch(updateWorker({ id: worker.id, data: submitData })).unwrap();
      } else {
        await dispatch(createWorker(submitData)).unwrap();
      }
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

        <TextField
          label="Фамилия *"
          value={formData.last_name}
          onChange={handleChange('last_name')}
          error={!!errors.last_name}
          helperText={errors.last_name}
          fullWidth
        />

        <TextField
          label="Имя *"
          value={formData.first_name}
          onChange={handleChange('first_name')}
          error={!!errors.first_name}
          helperText={errors.first_name}
          fullWidth
        />

        <TextField
          label="Отчество"
          value={formData.middle_name}
          onChange={handleChange('middle_name')}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Мастер</InputLabel>
          <Select
            value={formData.master_id}
            label="Мастер"
            onChange={handleChange('master_id')}
          >
            <MenuItem value="">Не назначен</MenuItem>
            {masters.map((master) => (
              <MenuItem key={master.id} value={master.id}>
                {master.last_name} {master.first_name} {master.middle_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained">
          {worker ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default WorkerForm;
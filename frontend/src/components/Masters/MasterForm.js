import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createMaster, updateMaster } from '../../store/slices/mastersSlice';

const MasterForm = ({ master, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (master) {
      setFormData({
        last_name: master.last_name || '',
        first_name: master.first_name || '',
        middle_name: master.middle_name || ''
      });
    }
  }, [master]);

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
      if (master) {
        await dispatch(updateMaster({ id: master.id, data: formData })).unwrap();
      } else {
        await dispatch(createMaster(formData)).unwrap();
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
      </Box>

      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained">
          {master ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default MasterForm;
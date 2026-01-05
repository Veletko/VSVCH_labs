import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  DialogActions,
  Grid
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createMaster, updateMaster } from '../../store/slices/mastersSlice';

const MasterForm = ({ master, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    email: '',
    password: '', // Добавляем поле пароля
    role: 'master', // По умолчанию роль мастер
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (master) {
      // При редактировании не показываем пароль
      setFormData({
        last_name: master.last_name || '',
        first_name: master.first_name || '',
        middle_name: master.middle_name || '',
        email: master.email || '',
        password: '', // При редактировании пароль оставляем пустым
        role: master.role || 'master',
        is_active: master.is_active !== undefined ? master.is_active : true
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

    if (!master && !formData.email.trim()) { // Email обязателен только при создании
      newErrors.email = 'Email обязателен';
    } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!master && !formData.password) { // Пароль обязателен только при создании
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
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
      const dataToSend = { ...formData };
      
      // Если редактируем и пароль не введен - удаляем поле пароля
      if (master && !dataToSend.password) {
        delete dataToSend.password;
      }
      
      // Если создаем - переименовываем password в password_hash
      if (!master && dataToSend.password) {
        dataToSend.password_hash = dataToSend.password;
        delete dataToSend.password;
      }

      if (master) {
        await dispatch(updateMaster({ id: master.id, data: dataToSend })).unwrap();
      } else {
        await dispatch(createMaster(dataToSend)).unwrap();
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

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Фамилия *"
              value={formData.last_name}
              onChange={handleChange('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Имя *"
              value={formData.first_name}
              onChange={handleChange('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Отчество"
              value={formData.middle_name}
              onChange={handleChange('middle_name')}
              fullWidth
            />
          </Grid>
          
          {!master && ( // Показываем email и пароль только при создании
            <>
              <Grid item xs={12}>
                <TextField
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Пароль *"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Роль"
              value={formData.role}
              onChange={handleChange('role')}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="master">Мастер</option>
              <option value="admin">Администратор</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Статус"
              value={formData.is_active}
              onChange={handleChange('is_active')}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value={true}>Активен</option>
              <option value={false}>Неактивен</option>
            </TextField>
          </Grid>
        </Grid>
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